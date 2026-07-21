import { useState, useRef } from 'react';
import { Storage, LlmSettings, Onboarding as OnboardingStore, ONBOARDING_PAGES } from './lib/storage';
import { TEXT } from './lib/text';
import Home from './views/Home';
import Record from './views/Record';
import Journal from './views/Journal';
import Settings from './views/Settings';
import EntryDetail from './views/EntryDetail';
import Chat from './views/Chat';
import OnboardingOverlay from './components/Onboarding';

const EMPTY_RECORD = { v: 0, a: 0, d: 0, title: null, score: 6, note: '' };

export default function App() {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState('home');
  const [entries, setEntries] = useState(() => Storage.load());
  const [record, setRecord] = useState(EMPTY_RECORD);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [llm, setLlm] = useState(() => LlmSettings.load());
  const [onboardingStep, setOnboardingStep] = useState(() => (OnboardingStore.isDone() ? 0 : 1));
  const toastTimer = useRef(null);
  const [{ isIOS, isAndroid }] = useState(() => {
    const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
    return { isIOS: /iPhone|iPad|iPod/.test(ua), isAndroid: /Android/.test(ua) };
  });

  const t = TEXT[lang];
  const toggleLang = () => setLang((l) => (l === 'en' ? 'zh' : 'en'));
  const knob = lang === 'en' ? 2 : 32;
  const enLabelColor = lang === 'en' ? '#D9BE7A' : 'rgba(232,224,255,.35)';
  const zhLabelColor = lang === 'zh' ? '#D9BE7A' : 'rgba(232,224,255,.35)';
  const navColor = (v) => (view === v ? '#D9BE7A' : 'rgba(232,224,255,.35)');

  // Shared save path for both Record (plain) and Chat (with before/chat).
  // `overrides` lets Chat pass its own note text + before/chat fields; the
  // top-level v/a/d/score always come from the live record (the "after"
  // reading), so every entry reader stays unchanged.
  const persistEntry = (overrides = {}) => {
    const entry = {
      id: window.crypto && crypto.randomUUID ? crypto.randomUUID() : 'e' + Date.now() + Math.random().toString(36).slice(2),
      ts: Date.now(),
      v: record.v, a: record.a, d: record.d,
      score: record.score,
      emotion: record.title || '',
      note: overrides.note !== undefined ? overrides.note : record.note,
      ...(overrides.before ? { before: overrides.before } : {}),
      ...(overrides.chat ? { chat: overrides.chat } : {}),
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

  const saveEntry = () => persistEntry();

  const talkItThrough = () => setView('chat');

  const selectEntry = (entry) => {
    setSelectedEntry(entry);
    setView('entryDetail');
  };

  const nextOnboarding = () => {
    setOnboardingStep((step) => {
      const next = step + 1;
      if (next > ONBOARDING_PAGES) {
        OnboardingStore.markDone();
        return 0;
      }
      return next;
    });
  };
  const skipOnboarding = () => {
    OnboardingStore.markDone();
    setOnboardingStep(0);
  };
  const reopenOnboarding = () => {
    setOnboardingStep(1);
    setView('home');
  };

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
          <Journal t={t} lang={lang} entries={entries} llmEnabled={llm.enabled} llm={llm} onSelectEntry={selectEntry} onGoRecord={() => setView('record')} />
        )}

        {view === 'settings' && (
          <Settings t={t} lang={lang} llm={llm} onLlmChange={setLlm} onReopenOnboarding={reopenOnboarding} onClose={() => setView('home')} />
        )}

        {view === 'entryDetail' && (
          <EntryDetail t={t} lang={lang} entries={entries} entry={selectedEntry} onBack={() => setView('journal')} />
        )}

        {view === 'chat' && (
          <Chat t={t} lang={lang} llm={llm} record={record} setRecord={setRecord} onSaveEntry={persistEntry} onExit={() => setView('record')} />
        )}
      </div>

      {view === 'home' && (
        <div className="chip log-now-fab" onClick={() => setView('record')}>{t.log}</div>
      )}

      {showSavedToast && <div className="toast">{t.saved}</div>}

      <OnboardingOverlay
        visible={onboardingStep > 0}
        step={onboardingStep}
        t={t}
        lang={lang}
        isIOS={isIOS}
        isAndroid={isAndroid}
        enLabelColor={enLabelColor}
        zhLabelColor={zhLabelColor}
        knob={knob}
        onToggleLang={toggleLang}
        onNext={nextOnboarding}
        onSkip={skipOnboarding}
      />

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
