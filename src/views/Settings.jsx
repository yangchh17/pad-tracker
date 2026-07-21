import { useState } from 'react';
import { LlmSettings } from '../lib/storage';
import { llmChat, llmErrorMessage } from '../lib/llm';

const DEFAULT_BASE_URL = 'http://localhost:11434';

export default function Settings({ t, lang, llm, onLlmChange, onReopenOnboarding, onOpenReferences, onClose }) {
  const [baseLlm, setBaseLlm] = useState({ enabled: llm.enabled, baseUrl: llm.baseUrl, model: llm.model });
  const [testConnStatus, setTestConnStatus] = useState('idle'); // 'idle' | 'testing' | 'ok' | 'fail'
  const [testResultText, setTestResultText] = useState('');

  const handleToggleLlm = () => {
    const newLlm = { ...baseLlm, enabled: !baseLlm.enabled };
    setBaseLlm(newLlm);
    LlmSettings.save(newLlm);
    onLlmChange(newLlm);
  };

  const handleBaseUrlChange = (val) => {
    const newLlm = { ...baseLlm, baseUrl: val };
    setBaseLlm(newLlm);
    LlmSettings.save(newLlm);
    onLlmChange(newLlm);
  };

  const handleModelChange = (val) => {
    const newLlm = { ...baseLlm, model: val };
    setBaseLlm(newLlm);
    LlmSettings.save(newLlm);
    onLlmChange(newLlm);
  };

  const handleTestConnection = () => {
    setTestConnStatus('testing');
    setTestResultText('');
    llmChat(
      baseLlm,
      [{ role: 'user', content: 'Say OK.' }],
      { timeoutMs: 30000 }
    )
      .then(() => {
        setTestConnStatus('ok');
        setTestResultText(t.testOk);
      })
      .catch((err) => {
        setTestConnStatus('fail');
        setTestResultText(llmErrorMessage(err, t));
      });
  };

  // Knob position: enabled → left 24, disabled → left 2
  const knobLeft = baseLlm.enabled ? '24px' : '2px';

  return (
    <div>
      {/* Header */}
      <div className="hdr">
        <div
          className="chip"
          onClick={onClose}
          style={{ font: "italic 400 13px 'EB Garamond',serif", color: 'rgba(217,190,122,.75)' }}
        >
          {'‹'} {t.settings}
        </div>
      </div>

      <div className="panel">
        {/* Use local AI toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ font: "400 13px 'EB Garamond',serif", color: '#EDE7F6' }}>{t.llmEnable}</span>
          <div className="pv" onClick={handleToggleLlm} style={{ width: 52, cursor: 'pointer' }}>
            <div className="pv-knob" style={{ left: knobLeft }} />
          </div>
        </div>

        {/* LLM settings panel — only when enabled */}
        {baseLlm.enabled && (
          <div className="panel" style={{ marginTop: 8, padding: '14px 16px' }}>
            {/* Desktop-only note */}
            <div style={{ font: "italic 400 12px 'EB Garamond',serif", color: '#E0645C', marginBottom: 12 }}>{t.desktopOnly}</div>

            {/* Base URL input */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ font: "400 10px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.5)', display: 'block', marginBottom: 4 }}>{t.baseUrl}</label>
              <input
                type="text"
                value={baseLlm.baseUrl}
                onChange={(e) => handleBaseUrlChange(e.target.value)}
                placeholder="http://localhost:11434"
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '8px 10px',
                  background: 'rgba(232,224,255,.06)', border: '1px solid rgba(217,190,122,.2)',
                  borderRadius: 6, font: "400 13px 'JetBrains Mono',monospace", color: '#EDE7F6',
                }}
              />
            </div>

            {/* CORS hint */}
            <div style={{ font: "italic 400 11px 'EB Garamond',serif", color: 'rgba(232,224,255,.45)', marginBottom: 12 }}>{t.llmOriginsHint}</div>

            {/* Model name input */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ font: "400 10px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.5)', display: 'block', marginBottom: 4 }}>{t.modelName}</label>
              <input
                type="text"
                value={baseLlm.model}
                onChange={(e) => handleModelChange(e.target.value)}
                placeholder="llama3.1"
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '8px 10px',
                  background: 'rgba(232,224,255,.06)', border: '1px solid rgba(217,190,122,.2)',
                  borderRadius: 6, font: "400 13px 'JetBrains Mono',monospace", color: '#EDE7F6',
                }}
              />
            </div>

            {/* Test connection chip */}
            <div className="chip" onClick={handleTestConnection} style={{ font: "italic 400 12px 'EB Garamond',serif", color: testConnStatus === 'testing' ? 'rgba(232,224,255,.4)' : 'rgba(217,190,122,.75)', cursor: testConnStatus === 'testing' ? 'default' : 'pointer', marginBottom: 8 }}>
              {testConnStatus === 'testing' ? t.testing : t.testConnection}
            </div>

            {/* Result message */}
            {testResultText && (
              <div style={{ font: "italic 400 12px 'EB Garamond',serif", color: testConnStatus === 'ok' ? '#98DCA5' : '#E0645C' }}>
                {testResultText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tutorial panel */}
      <div className="panel" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          className="chip"
          onClick={onReopenOnboarding}
          style={{ font: "400 12px 'EB Garamond',serif", color: 'rgba(217,190,122,.75)', cursor: 'pointer' }}
        >
          {t.onboardAgain}
        </div>
        <div
          className="chip"
          onClick={onOpenReferences}
          style={{ font: "400 12px 'EB Garamond',serif", color: 'rgba(217,190,122,.75)', cursor: 'pointer' }}
        >
          {t.readingReferences}
        </div>
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}
