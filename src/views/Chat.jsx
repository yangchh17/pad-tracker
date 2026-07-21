import { useState, useRef } from 'react';
import { clamp } from '../lib/pad';
import { TEXT } from '../lib/text';
import {
  llmChat, llmErrorMessage, buildChatSystemPrompt, buildChatSummaryPrompt,
  formatChatTranscript, CHAT_MAX_TURNS,
} from '../lib/llm';
import { fmtDateTime, fmtSigned } from '../lib/format';

// "Talk it through" - multi-turn journaling conversation. Ported from the
// legacy app with all its hard-won behavior intact:
// - deterministic opener (timestamp + framing line + random question), no
//   LLM call needed to start
// - the system prompt is rebuilt every send with the actual turn count so
//   the model paces itself and closes properly at the 12-turn cap
// - optimistic message append; on failure the transcript is preserved and
//   Retry re-sends as-is (no duplication)
// - Wrap up -> after-mood sliders anchored at the before values
// - exiting stages the conversation into the Note field (AI summary if the
//   note was blank) instead of discarding - "Clear" on Record is the
//   actual discard affordance
export default function Chat({ t, lang, llm, record, setRecord, onSaveEntry, onExit }) {
  // Snapshot the mood the user had dialed in when the conversation started -
  // this becomes the entry's `before` reading.
  const [beforeReading] = useState(() => ({ v: record.v, a: record.a, d: record.d, score: record.score }));
  const [messages, setMessages] = useState(() => {
    const questions = t.chatOpeningQuestions;
    const question = questions[Math.floor(Math.random() * questions.length)];
    return [{ role: 'assistant', content: fmtDateTime(Date.now(), lang) + '\n' + t.chatOpeningFraming + '\n\n' + question }];
  });
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const [errorMsg, setErrorMsg] = useState('');
  const [phase, setPhase] = useState('talking'); // talking | afterReading
  const [buildingNote, setBuildingNote] = useState(false);
  const [includeConversation, setIncludeConversation] = useState(true);
  const [saving, setSaving] = useState(false);

  const vTrackRef = useRef(null);
  const aTrackRef = useRef(null);
  const dTrackRef = useRef(null);
  const scoreTrackRef = useRef(null);
  const dragAxis = useRef(null);
  const dragScore = useRef(false);

  const userTurns = messages.filter((m) => m.role === 'user').length;
  const capReached = userTurns >= CHAT_MAX_TURNS;
  const canSend = status !== 'sending' && !!input.trim() && !capReached;

  const sendMessage = () => {
    const text = (input || '').trim();
    if (!text || status === 'sending' || capReached) return;
    const prev = messages;
    const pending = { role: 'user', content: text };
    setMessages([...prev, pending]);
    setInput('');
    setStatus('sending');
    setErrorMsg('');
    const turnsUsed = prev.filter((m) => m.role === 'user').length + 1;
    const system = { role: 'system', content: buildChatSystemPrompt(lang, turnsUsed) };
    llmChat(llm, [system, ...prev, pending])
      .then((reply) => {
        setMessages((ms) => [...ms, { role: 'assistant', content: reply.trim() }]);
        setStatus('idle');
      })
      .catch((err) => {
        console.error('PAD Tracker: sendChatMessage failed', err);
        setStatus('error');
        setErrorMsg(llmErrorMessage(err, TEXT[lang]));
      });
  };

  const retryLast = () => {
    if (status === 'sending' || !messages.length) return;
    setStatus('sending');
    setErrorMsg('');
    const turnsUsed = messages.filter((m) => m.role === 'user').length;
    const system = { role: 'system', content: buildChatSystemPrompt(lang, turnsUsed) };
    llmChat(llm, [system, ...messages])
      .then((reply) => {
        setMessages((ms) => [...ms, { role: 'assistant', content: reply.trim() }]);
        setStatus('idle');
      })
      .catch((err) => {
        console.error('PAD Tracker: retryLastMessage failed', err);
        setStatus('error');
        setErrorMsg(llmErrorMessage(err, TEXT[lang]));
      });
  };

  const backFromChat = () => {
    if (buildingNote) return;
    const hasRealConversation = messages.some((m) => m.role === 'user');
    if (!hasRealConversation) {
      onExit();
      return;
    }
    // Exiting mid-conversation stages the transcript into the editable Note
    // field (with an AI summary on top if the user hadn't written a note) -
    // nothing silently lost, nothing silently saved.
    const userNote = (record.note || '').trim();
    const transcriptText = formatChatTranscript(lang, messages);
    if (userNote) {
      setRecord((r) => ({ ...r, note: userNote + '\n\n' + transcriptText }));
      onExit();
      return;
    }
    setBuildingNote(true);
    const system = { role: 'system', content: buildChatSummaryPrompt(lang) };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    llmChat(llm, [system, ...history])
      .then((summary) => {
        setRecord((r) => ({ ...r, note: t.aiSummaryPrefix + ' ' + summary.trim() + '\n\n' + transcriptText }));
        onExit();
      })
      .catch((err) => {
        console.error('PAD Tracker: exit note generation failed, using transcript only', err);
        setRecord((r) => ({ ...r, note: transcriptText }));
        onExit();
      });
  };

  const finishSave = (note, chatData) => {
    onSaveEntry({
      note,
      before: beforeReading,
      ...(chatData ? { chat: chatData } : {}),
    });
  };

  const saveChatEntry = () => {
    if (saving) return;
    const userNote = (record.note || '').trim();
    if (!includeConversation) {
      finishSave(record.note, null);
      return;
    }
    const transcriptText = formatChatTranscript(lang, messages);
    if (userNote) {
      finishSave(userNote + '\n\n' + transcriptText, messages);
      return;
    }
    setSaving(true);
    const system = { role: 'system', content: buildChatSummaryPrompt(lang) };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    llmChat(llm, [system, ...history])
      .then((summary) => {
        finishSave(t.aiSummaryPrefix + ' ' + summary.trim() + '\n\n' + transcriptText, messages);
      })
      .catch((err) => {
        console.error('PAD Tracker: chat summary generation failed, saving without it', err);
        finishSave(transcriptText, messages);
      });
  };

  // After-reading sliders operate on the live record (same as Record view).
  const updateSlider = (axis, clientX) => {
    const ref = axis === 'v' ? vTrackRef : axis === 'a' ? aTrackRef : dTrackRef;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    let tt = clamp((clientX - rect.left) / rect.width, 0, 1);
    const val = Math.round((tt * 2 - 1) * 100) / 100;
    setRecord((r) => ({ ...r, [axis]: val }));
  };
  const sliderDown = (axis, e) => { e.target.setPointerCapture(e.pointerId); dragAxis.current = axis; updateSlider(axis, e.clientX); };
  const sliderMove = (axis, e) => { if (dragAxis.current === axis) updateSlider(axis, e.clientX); };
  const sliderUp = () => { dragAxis.current = null; };
  const updateScore = (clientX) => {
    if (!scoreTrackRef.current) return;
    const rect = scoreTrackRef.current.getBoundingClientRect();
    let tt = clamp((clientX - rect.left) / rect.width, 0, 1);
    setRecord((r) => ({ ...r, score: Math.round(tt * 9) + 1 }));
  };
  const scoreDown = (e) => { e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); dragScore.current = true; updateScore(e.clientX); };
  const scoreMove = (e) => { if (dragScore.current) updateScore(e.clientX); };
  const scoreUp = () => { dragScore.current = false; };

  const labelHints = lang === 'zh'
    ? { vLow: '不愉快', vHigh: '愉快', aLow: '平静', aHigh: '有能量', dLow: '被压倒', dHigh: '有掌控感' }
    : { vLow: 'unpleasant', vHigh: 'pleasant', aLow: 'calm', aHigh: 'energized', dLow: 'overwhelmed', dHigh: 'in control' };
  const sliderDefs = [
    { axis: 'v', label: t.v, color: '#E8B54D', ref: vTrackRef, val: record.v, low: labelHints.vLow, high: labelHints.vHigh },
    { axis: 'a', label: t.a, color: '#E0645C', ref: aTrackRef, val: record.a, low: labelHints.aLow, high: labelHints.aHigh },
    { axis: 'd', label: t.d, color: '#6D9BD1', ref: dTrackRef, val: record.d, low: labelHints.dLow, high: labelHints.dHigh },
  ];
  const scoreTicks = Array.from({ length: 10 }, (_, i) => ({ key: i + 1, pct: ((i / 9) * 100).toFixed(1) }));
  const scoreFillPct = (((record.score - 1) / 9) * 100).toFixed(1);
  const beforeSummary = `V${fmtSigned(beforeReading.v)} A${fmtSigned(beforeReading.a)} D${fmtSigned(beforeReading.d)} · ${beforeReading.score}/10`;

  const displayMessages = messages.map((m, i) => ({
    key: i, content: m.content,
    justify: m.role === 'user' ? 'flex-end' : 'flex-start',
    bg: m.role === 'user' ? 'rgba(217,190,122,.08)' : 'rgba(255,255,255,.03)',
    textAlign: m.role === 'user' ? 'right' : 'left',
    color: m.role === 'user' ? '#EDE7F6' : 'rgba(232,224,255,.8)',
  }));

  return (
    <div>
      <div className="hdr">
        {buildingNote ? (
          <span style={{ font: "italic 400 12px 'EB Garamond',serif", color: 'rgba(217,190,122,.6)', animation: 'pulseGlow 1.6s ease-in-out infinite' }}>{t.addingToNote}</span>
        ) : (
          <>
            <div className="chip" onClick={backFromChat} style={{ font: "italic 400 13px 'EB Garamond',serif", color: 'rgba(217,190,122,.75)' }}>‹ {t.record}</div>
            {phase === 'talking' && (
              <div className="chip" onClick={() => setPhase('afterReading')} style={{ font: "400 11px 'JetBrains Mono',monospace", color: '#D9BE7A' }}>{t.wrapUp}</div>
            )}
          </>
        )}
      </div>

      {phase === 'talking' && (
        <>
          <div className="panel" style={{ marginBottom: 10 }}>
            <div style={{ font: "italic 400 11px/1.55 'EB Garamond',serif", color: 'rgba(232,224,255,.5)' }}>{t.chatGuidance}</div>
          </div>
          <div className="panel" style={{ maxHeight: '46vh', overflowY: 'auto' }}>
            {displayMessages.map((m) => (
              <div key={m.key} style={{ display: 'flex', justifyContent: m.justify, marginBottom: 8 }}>
                <div style={{ maxWidth: '80%', padding: '9px 12px', borderRadius: 6, background: m.bg, border: '1px solid rgba(217,190,122,.15)', textAlign: m.textAlign, font: "400 13px/1.5 Inter,sans-serif", color: m.color, whiteSpace: 'pre-line' }}>{m.content}</div>
              </div>
            ))}
            {status === 'sending' && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '9px 12px', font: "italic 400 12px 'EB Garamond',serif", color: 'rgba(217,190,122,.6)', animation: 'pulseGlow 1.6s ease-in-out infinite' }}>{t.chatThinking}</div>
              </div>
            )}
          </div>
          {status === 'error' && (
            <div style={{ margin: '0 20px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ font: "400 11px 'JetBrains Mono',monospace", color: '#E0645C', flex: 1 }}>{errorMsg}</span>
              <div className="chip" onClick={retryLast} style={{ font: "400 11px 'JetBrains Mono',monospace", color: '#D9BE7A' }}>{t.retry}</div>
            </div>
          )}
          <div className="panel">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatPlaceholder}
              style={{ width: '100%', minHeight: 70, background: 'rgba(255,255,255,.025)', border: '1px solid rgba(217,190,122,.2)', borderRadius: 6, padding: 12, font: "400 14px/1.45 Inter,sans-serif", color: '#EDE7F6', resize: 'none' }}
            />
            {capReached && (
              <div style={{ marginTop: 8, font: "italic 400 11px 'EB Garamond',serif", color: 'rgba(232,224,255,.4)' }}>{t.chatCapReached}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <div className="chip primary-action" onClick={sendMessage} style={{ opacity: canSend ? 1 : 0.4 }}>{t.send}</div>
            </div>
          </div>
        </>
      )}

      {phase === 'afterReading' && (
        <>
          <div className="panel" style={{ overflow: 'visible' }}>
            <div style={{ font: "400 12px 'EB Garamond',serif", fontStyle: 'italic', color: 'rgba(217,190,122,.75)', marginBottom: 4 }}>{t.afterReadingTitle}</div>
            <div style={{ font: "400 10px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.4)', marginBottom: 14 }}>{t.before}: {beforeSummary}</div>
            {sliderDefs.map((s) => (
              <div key={s.axis} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span style={{ font: "400 10px 'JetBrains Mono',monospace", letterSpacing: '.1em', color: s.color }}>{s.label}</span>
                  <span style={{ font: "300 15px 'JetBrains Mono',monospace", color: '#EDE7F6' }}>{(s.val >= 0 ? '+' : '') + s.val.toFixed(2)}</span>
                </div>
                <div className="slider-track" ref={s.ref} onPointerDown={(e) => sliderDown(s.axis, e)} onPointerMove={(e) => sliderMove(s.axis, e)} onPointerUp={sliderUp} onPointerCancel={sliderUp}>
                  <div style={{ position: 'absolute', left: '50%', top: 5, width: 1, height: 10, background: 'rgba(255,255,255,.2)' }} />
                  <div className="slider-handle" style={{ left: `${(((s.val + 1) / 2) * 100).toFixed(1)}%` }}>
                    <div style={{ position: 'absolute', left: '50%', top: '50%', width: 16, height: 16, transform: 'translate(-50%,-50%)', border: `1px solid ${s.color}`, borderRadius: '50%', background: 'rgba(5,6,12,.8)', boxShadow: `0 0 10px ${s.color}` }} />
                    <div style={{ position: 'absolute', left: '50%', top: '50%', width: 9, height: 1, background: s.color, transform: 'translate(-50%,-50%)' }} />
                    <div style={{ position: 'absolute', left: '50%', top: '50%', width: 1, height: 9, background: s.color, transform: 'translate(-50%,-50%)' }} />
                  </div>
                </div>
                <div className="range-labels"><span>{s.low}</span><span>{s.high}</span></div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ font: "400 11px 'EB Garamond',serif", fontStyle: 'italic', color: 'rgba(217,190,122,.75)' }}>{t.overallScore}</span>
              <span style={{ font: "300 22px 'JetBrains Mono',monospace", color: '#EDE7F6' }}>{record.score}</span>
            </div>
            <div ref={scoreTrackRef} onPointerDown={scoreDown} onPointerMove={scoreMove} onPointerUp={scoreUp} onPointerCancel={scoreUp} style={{ position: 'relative', height: 24, background: 'transparent', borderRadius: 12, margin: '8px 0 4px', touchAction: 'none' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 10, height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }} />
              <div style={{ position: 'absolute', left: 0, top: 10, height: 6, borderRadius: 3, background: 'linear-gradient(90deg,#8a6b2f,#D9BE7A)', width: `${scoreFillPct}%`, pointerEvents: 'none' }} />
              {scoreTicks.map((tk) => (
                <div key={tk.key} style={{ position: 'absolute', top: 7, left: `${tk.pct}%`, width: 1, height: 12, background: 'rgba(255,255,255,.15)', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
              ))}
              <div style={{ position: 'absolute', top: '50%', left: `${scoreFillPct}%`, width: 24, height: 24, borderRadius: '50%', background: '#F5EFE0', boxShadow: '0 0 12px #D9BE7A', transform: 'translate(-50%,-50%)', cursor: 'grab', pointerEvents: 'none' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ font: "400 9px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.3)' }}>1</span>
              <span style={{ font: "400 9px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.3)' }}>10</span>
            </div>
          </div>

          <div className="panel">
            <div style={{ font: "400 11px 'EB Garamond',serif", fontStyle: 'italic', color: 'rgba(217,190,122,.75)', marginBottom: 10 }}>{t.note}</div>
            <textarea
              value={record.note}
              onChange={(e) => { const val = e.target.value; setRecord((r) => ({ ...r, note: val })); }}
              placeholder={t.notePlaceholder}
              style={{ width: '100%', minHeight: 82, background: 'rgba(255,255,255,.025)', border: '1px solid rgba(217,190,122,.2)', borderRadius: 6, padding: 12, font: "400 14px/1.45 Inter,sans-serif", color: '#EDE7F6', resize: 'none' }}
            />
          </div>

          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ font: "400 11px 'EB Garamond',serif", fontStyle: 'italic', color: 'rgba(217,190,122,.75)' }}>{t.includeConversation}</span>
              <div className="pv" onClick={() => setIncludeConversation((v) => !v)}>
                <div className="pv-knob" style={{ left: includeConversation ? 24 : 2 }} />
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="chip primary-action" onClick={saveChatEntry} style={{ opacity: saving ? 0.5 : 1 }}>{saving ? t.savingEntry : t.save}</div>
          </div>
        </>
      )}
    </div>
  );
}
