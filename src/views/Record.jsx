import { useState, useRef } from 'react';
import { clamp } from '../lib/pad';
import { EMOTION_BANK, infoHtml } from '../lib/text';

export default function Record({ t, lang, llmEnabled, record, setRecord, onSave, onTalkItThrough }) {
  const [wordsExpanded, setWordsExpanded] = useState(false);
  const [infoAxis, setInfoAxis] = useState(null);

  const vTrackRef = useRef(null);
  const aTrackRef = useRef(null);
  const dTrackRef = useRef(null);
  const scoreTrackRef = useRef(null);
  const dragAxis = useRef(null);
  const dragScore = useRef(false);

  const updateSlider = (axis, clientX) => {
    const ref = axis === 'v' ? vTrackRef : axis === 'a' ? aTrackRef : dTrackRef;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    let tt = (clientX - rect.left) / rect.width;
    tt = clamp(tt, 0, 1);
    const val = Math.round((tt * 2 - 1) * 100) / 100;
    setRecord((r) => ({ ...r, [axis]: val }));
  };
  const sliderDown = (axis, e) => { e.target.setPointerCapture(e.pointerId); dragAxis.current = axis; updateSlider(axis, e.clientX); };
  const sliderMove = (axis, e) => { if (dragAxis.current === axis) updateSlider(axis, e.clientX); };
  const sliderUp = () => { dragAxis.current = null; };

  const updateScore = (clientX) => {
    if (!scoreTrackRef.current) return;
    const rect = scoreTrackRef.current.getBoundingClientRect();
    let tt = (clientX - rect.left) / rect.width;
    tt = clamp(tt, 0, 1);
    const val = Math.round(tt * 9) + 1;
    setRecord((r) => ({ ...r, score: val }));
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
  const sliders = sliderDefs.map((s) => ({
    ...s,
    valStr: (s.val >= 0 ? '+' : '') + s.val.toFixed(2),
    pct: (((s.val + 1) / 2) * 100).toFixed(1),
  }));

  const scoreTicks = Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    return { key: n, pct: ((i / 9) * 100).toFixed(1), n, active: n === record.score };
  });
  const scoreFillPct = (((record.score - 1) / 9) * 100).toFixed(1);

  const scoredAll = EMOTION_BANK.map((w) => {
    const dist = Math.sqrt((record.v - w.tv) ** 2 + (record.a - w.ta) ** 2 + (record.d - w.td) ** 2);
    const sim = clamp(1 - dist / 3.46, 0, 1);
    return { ...w, pct: Math.round(sim * 100) };
  });
  const scored = [...scoredAll].sort((x, y) => y.pct - x.pct).slice(0, 8);
  const visibleWords = wordsExpanded ? scored : scored.slice(0, 1);
  const hiddenWordCount = Math.max(0, scored.length - visibleWords.length);
  const wordsToggleLabel = wordsExpanded ? t.showLess : `${t.showMore}${hiddenWordCount ? ' (+' + hiddenWordCount + ')' : ''}`;

  const recordHint = lang === 'zh'
    ? '按感觉移动滑块；情绪词会随着调整。'
    : 'Move each slider by feel; the emotion words will adjust as you go.';

  const hasNoteText = !!(record.note || '').trim();
  const infoAxisLabel = infoAxis === 'v' ? t.v : infoAxis === 'a' ? t.a : infoAxis === 'd' ? t.d : '';

  return (
    <div>
      <div className="hdr" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ font: "400 24px/1.1 'EB Garamond',serif", color: '#EDE7F6' }}>{t.record}</div>
          <div style={{ font: "400 11px/1.4 Inter,sans-serif", color: 'rgba(232,224,255,.48)', marginTop: 6 }}>{recordHint}</div>
        </div>
      </div>

      <div className="panel">
        {sliders.map((s) => (
          <div key={s.axis} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ font: "400 10px 'JetBrains Mono',monospace", letterSpacing: '.1em', color: s.color }}>{s.label}</span>
                <div className="chip" onClick={() => setInfoAxis((a) => (a === s.axis ? null : s.axis))} style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid rgba(217,190,122,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9BE7A', font: "500 9px 'JetBrains Mono',monospace", lineHeight: 1 }}>i</div>
              </div>
              <span style={{ font: "300 15px 'JetBrains Mono',monospace", color: '#EDE7F6' }}>{s.valStr}</span>
            </div>
            <div className="slider-track" ref={s.ref} onPointerDown={(e) => sliderDown(s.axis, e)} onPointerMove={(e) => sliderMove(s.axis, e)} onPointerUp={sliderUp} onPointerCancel={sliderUp}>
              <div style={{ position: 'absolute', left: '50%', top: 5, width: 1, height: 10, background: 'rgba(255,255,255,.2)' }} />
              <div className="slider-handle" style={{ left: `${s.pct}%` }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <span style={{ font: "400 11px 'EB Garamond',serif", fontStyle: 'italic', color: 'rgba(217,190,122,.75)' }}>{t.suggested}</span>
          <span className="chip" onClick={() => setWordsExpanded((v) => !v)} style={{ font: "400 10px 'JetBrains Mono',monospace", color: '#D9BE7A' }}>{wordsToggleLabel}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto', overflowX: 'hidden' }}>
          {visibleWords.map((w) => (
            <div
              key={w.en}
              className="chip"
              onClick={() => setRecord((r) => ({ ...r, title: w.en }))}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, minHeight: 54, padding: '9px 10px', border: `1px solid ${record.title === w.en ? 'rgba(217,190,122,.6)' : 'rgba(217,190,122,.15)'}`, borderRadius: 6, background: record.title === w.en ? 'rgba(217,190,122,.1)' : 'transparent' }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ font: "500 12px Inter,sans-serif", color: '#EDE7F6' }}>{w.en} · {w.zh}</div>
                <div style={{ font: "italic 400 10px 'EB Garamond',serif", color: 'rgba(232,224,255,.4)', marginTop: 1 }}>{w.poetic} · {w.poeticZh}</div>
              </div>
              <div style={{ font: "400 11px 'JetBrains Mono',monospace", color: '#D9BE7A' }}>{w.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ font: "400 11px 'EB Garamond',serif", fontStyle: 'italic', color: 'rgba(217,190,122,.75)' }}>{t.note}</span>
          <div style={{ display: 'flex', gap: 12 }}>
            {hasNoteText && (
              <span className="chip" onClick={() => setRecord((r) => ({ ...r, note: '' }))} style={{ font: "400 10px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.4)' }}>{t.clear}</span>
            )}
            {llmEnabled && (
              <span className="chip" onClick={onTalkItThrough} style={{ font: "400 10px 'JetBrains Mono',monospace", color: '#D9BE7A' }}>{t.talkItThrough}</span>
            )}
          </div>
        </div>
        <textarea
          value={record.note}
          onChange={(e) => setRecord((r) => ({ ...r, note: e.target.value }))}
          placeholder={t.notePlaceholder}
          style={{ width: '100%', minHeight: 82, background: 'rgba(255,255,255,.025)', border: '1px solid rgba(217,190,122,.2)', borderRadius: 6, padding: 12, font: "400 14px/1.45 Inter,sans-serif", color: '#EDE7F6', resize: 'none' }}
        />
      </div>

      <div style={{ position: 'relative', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="chip primary-action" onClick={onSave}>{t.save}</div>
      </div>

      {infoAxis && (
        <div onClick={() => setInfoAxis(null)} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,6,12,.75)', backdropFilter: 'blur(8px)' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'calc(100% - 32px)', maxWidth: 340, background: 'linear-gradient(170deg,rgba(217,190,122,.06) 0%,rgba(10,8,6,.97) 40%),rgba(10,8,6,.95)', border: '1px solid rgba(217,190,122,.35)', borderTopColor: 'rgba(217,190,122,.5)', borderRadius: 18, padding: '32px 36px', boxShadow: '0 24px 64px rgba(0,0,0,.35)', position: 'relative' }}>
            <div style={{ font: "italic 17px 'EB Garamond',serif", color: '#D9BE7A', marginBottom: 14 }}>{infoAxisLabel}</div>
            <div dangerouslySetInnerHTML={{ __html: infoHtml(infoAxis, lang) }} />
            <div onClick={() => setInfoAxis(null)} style={{ marginTop: 22, width: '100%', textAlign: 'center', font: "italic 14px 'EB Garamond',serif", color: '#D9BE7A', cursor: 'pointer', padding: 10, borderRadius: 10, background: 'rgba(217,190,122,.06)', border: '1px solid rgba(217,190,122,.3)', userSelect: 'none' }}>{t.infoDismiss}</div>
          </div>
        </div>
      )}
    </div>
  );
}
