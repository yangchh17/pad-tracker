import { useState, useRef } from 'react';
import { Storage, LlmSettings } from './lib/storage';
import { TEXT } from './lib/text';
import Home from './views/Home';
import Record from './views/Record';

const EMPTY_RECORD = { v: 0, a: 0, d: 0, title: null, score: 6, note: '' };

export default function App() {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState('home');
  const [entries, setEntries] = useState(() => Storage.load());
  const [record, setRecord] = useState(EMPTY_RECORD);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [llm] = useState(() => LlmSettings.load());
  const toastTimer = useRef(null);

  const t = TEXT[lang];
  const toggleLang = () => setLang((l) => (l === 'en' ? 'zh' : 'en'));
  const knob = lang === 'en' ? 2 : 32;
  const enLabelColor = lang === 'en' ? '#D9BE7A' : 'rgba(232,224,255,.35)';
  const zhLabelColor = lang === 'zh' ? '#D9BE7A' : 'rgba(232,224,255,.35)';
  const navColor = (v) => (view === v ? '#D9BE7A' : 'rgba(232,224,255,.35)');

  const saveEntry = () => {
    const entry = {
      id: window.crypto && crypto.randomUUID ? crypto.randomUUID() : 'e' + Date.now() + Math.random().toString(36).slice(2),
      ts: Date.now(),
      v: record.v, a: record.a, d: record.d,
      score: record.score,
      emotion: record.title || '',
      note: record.note,
    };
    const nextEntries = [...entries, entry];
    Storage.save(nextEntries);
    setEntries(nextEntries);
    setRecord(EMPTY_RECORD);
    setView('journal');
    setShowSavedToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowSavedToast(false), 2000);
  };

  // Talk it through (Phase 7) isn't built yet - placeholder so Record's
  // chip has something to call without crashing.
  const talkItThrough = () => console.log('Talk it through: Phase 7, not built yet');

  return (
    <div className="frame">
      <div className="stars" />

      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: 44,
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10,
          padding: 'env(safe-area-inset-top,0px) 20px 0', font: "400 12px 'JetBrains Mono',monospace",
          color: 'rgba(232,224,255,.5)', zIndex: 5, boxSizing: 'border-box',
        }}
      >
        <div className="chip" onClick={() => setView('settings')} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid rgba(217,190,122,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9BE7A', font: "400 12px 'JetBrains Mono',monospace", pointerEvents: 'none' }}>⚙</div>
        </div>
        <div className="pv" onClick={toggleLang} style={{ width: 52 }}>
          <span style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', font: "600 8px 'JetBrains Mono',monospace", color: enLabelColor, pointerEvents: 'none' }}>EN</span>
          <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', font: "600 8px 'JetBrains Mono',monospace", color: zhLabelColor, pointerEvents: 'none' }}>中</span>
          <div className="pv-knob" style={{ left: knob }} />
        </div>
      </div>

      <div className="scroll">
        {view === 'home' && <Home t={t} lang={lang} entries={entries} />}

        {view === 'record' && (
          <Record t={t} lang={lang} llmEnabled={llm.enabled} record={record} setRecord={setRecord} onSave={saveEntry} onTalkItThrough={talkItThrough} />
        )}

        {view === 'journal' && (
          <div>
            <div className="hdr">
              <div style={{ font: "400 24px/1.1 'EB Garamond',serif", color: '#EDE7F6' }}>{t.journal}</div>
            </div>
            <div className="panel">
              <div style={{ font: "400 13px 'EB Garamond',serif", color: 'rgba(232,224,255,.5)' }}>
                Phase 2 placeholder — entry list comes in Phase 5.
              </div>
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div>
            <div className="hdr">
              <div className="chip" onClick={() => setView('home')} style={{ font: "italic 400 13px 'EB Garamond',serif", color: 'rgba(217,190,122,.75)' }}>
                ‹ {t.settings}
              </div>
            </div>
            <div className="panel">
              <div style={{ font: "400 13px 'EB Garamond',serif", color: 'rgba(232,224,255,.5)' }}>
                Phase 2 placeholder — LLM settings come in Phase 8.
              </div>
            </div>
          </div>
        )}
      </div>

      {view === 'home' && (
        <div className="chip log-now-fab" onClick={() => setView('record')}>{t.log}</div>
      )}

      {showSavedToast && <div className="toast">{t.saved}</div>}

      <div className="tabbar">
        <div className="tabitem" onClick={() => setView('home')}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${navColor('home')}` }} />
          <span style={{ font: "400 9px 'JetBrains Mono',monospace", letterSpacing: '.05em', color: navColor('home') }}>{t.home}</span>
        </div>
        <div className="tabitem" onClick={() => setView('record')}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${navColor('record')}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: navColor('record') }} />
          </div>
          <span style={{ font: "400 9px 'JetBrains Mono',monospace", letterSpacing: '.05em', color: navColor('record') }}>{t.record}</span>
        </div>
        <div className="tabitem" onClick={() => setView('journal')}>
          <div style={{ width: 16, height: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ height: 1.5, background: navColor('journal') }} />
            <div style={{ height: 1.5, background: navColor('journal') }} />
            <div style={{ height: 1.5, background: navColor('journal') }} />
          </div>
          <span style={{ font: "400 9px 'JetBrains Mono',monospace", letterSpacing: '.05em', color: navColor('journal') }}>{t.journal}</span>
        </div>
      </div>
    </div>
  );
}
