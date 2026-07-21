import { REFERENCES } from '../lib/text';

export default function References({ t, lang, onBack }) {
  return (
    <div>
      <div className="hdr">
        <div
          className="chip"
          onClick={onBack}
          style={{ font: "italic 400 13px 'EB Garamond',serif", color: 'rgba(217,190,122,.75)' }}
        >
          {'‹'} {t.settings}
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 12 }}>
        <div style={{ font: "400 20px/1.3 'EB Garamond',serif", color: '#D9BE7A', marginBottom: 10 }}>{t.readingReferences}</div>
        <div style={{ font: "400 13px/1.6 'EB Garamond',serif", fontStyle: 'italic', color: 'rgba(232,224,255,.7)' }}>{t.referencesIntro}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {REFERENCES.map((r, i) => (
          <div key={i} className="panel">
            <div style={{ font: "500 12px 'JetBrains Mono',monospace", color: '#EDE7F6', marginBottom: 6, lineHeight: 1.5 }}>{r.cite}</div>
            <div style={{ font: "italic 400 12px 'EB Garamond',serif", color: 'rgba(232,224,255,.6)', lineHeight: 1.5 }}>
              {lang === 'zh' ? r.note_zh : r.note_en}
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}
