import { useState } from 'react';
import { classifyDate, fmtTime, csvEscape } from '../lib/format';
import { buildInsightsPrompt, llmChat, llmErrorMessage } from '../lib/llm';

const GROUP_ORDER = ['today', 'yesterday', 'thisweek', 'earlier'];

export default function Journal({ t, lang, entries, llmEnabled, llm, onSelectEntry, onGoRecord }) {
  const [insightsStatus, setInsightsStatus] = useState(null); // null | 'loading' | 'error' | 'success'
  const [insightsText, setInsightsText] = useState('');

  const sortedEntries = [...entries].sort((a, b) => a.ts - b.ts);
  const descEntries = [...sortedEntries].reverse(); // newest-first for grouping (non-mutating)
  const now = Date.now();

  // Group entries by classifyDate() — descEntries → newest-first within each group
  const grouped = {};
  for (const e of descEntries) {
    const g = classifyDate(e.ts, now);
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(e);
  }

  // CSV export matching legacy exportCsv() exactly:
  // - Header: date,time,valence,arousal,dominance,score,emotion,note,beforeValence,beforeArousal,beforeDominance,beforeScore
  // - Date: new Date(e.ts).toISOString().slice(0,10) (YYYY-MM-DD)
  // - V/A/D: e.v.toFixed(2) etc. (no sign prefix — plain toFixed)
  // - emotion/note: single csvEscape() pass each
  // - Row join: \r\n
  // - Anchor: append → click → remove → revokeObjectURL after 1s delay
  const handleExportCsv = () => {
    const header = ['date', 'time', 'valence', 'arousal', 'dominance', 'score', 'emotion', 'note', 'beforeValence', 'beforeArousal', 'beforeDominance', 'beforeScore'];
    const rows = [header];
    sortedEntries.forEach((e) => {
      const d = new Date(e.ts);
      const b = e.before;
      rows.push([
        d.toISOString().slice(0, 10),
        fmtTime(e.ts),
        e.v.toFixed(2),
        e.a.toFixed(2),
        e.d.toFixed(2),
        e.score,
        e.emotion || '',
        e.note || '',
        b ? b.v.toFixed(2) : '',
        b ? b.a.toFixed(2) : '',
        b ? b.d.toFixed(2) : '',
        b ? b.score : '',
      ]);
    });
    const csv = rows.map((r) => r.map(csvEscape).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pad-tracker-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleInsights = () => {
    // Loading guard: early return if already fetching (prevents concurrent calls)
    if (insightsStatus === 'loading') return;
    setInsightsStatus('loading');
    setInsightsText('');
    llmChat(llm, buildInsightsPrompt(entries, lang))
      .then((text) => {
        setInsightsText(text.trim());
        setInsightsStatus('success');
      })
      .catch((err) => {
        console.error('PAD Tracker: getInsights failed', err);
        setInsightsText(llmErrorMessage(err, t));
        setInsightsStatus('error');
      });
  };

  return (
    <div>
      {/* Header */}
      <div className="hdr">
        <div style={{ font: "400 24px/1.1 'EB Garamond',serif", color: '#EDE7F6' }}>{t.journal}</div>
        {entries.length > 0 && (
          <div className="chip" onClick={handleExportCsv} style={{ font: "italic 400 12px 'EB Garamond',serif", color: 'rgba(217,190,122,.75)' }}>
            {t.export}
          </div>
        )}
        {entries.length > 0 && llmEnabled && (
          <div className="chip" onClick={handleInsights} style={{ font: "italic 400 12px 'EB Garamond',serif", color: 'rgba(217,190,122,.75)' }}>
            {t.getInsights}
          </div>
        )}
      </div>

      {/* Empty state */}
      {entries.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ font: "italic 400 14px 'EB Garamond',serif", color: 'rgba(232,224,255,.5)', marginBottom: 20, textAlign: 'center' }}>{t.emptyJournal}</div>
          <div className="chip" onClick={onGoRecord} style={{ font: "400 12px 'EB Garamond',serif", color: '#D9BE7A', cursor: 'pointer' }}>
            {t.recordFirst}
          </div>
        </div>
      ) : (
        <>
          {/* Insights panel */}
          {insightsStatus === 'loading' && (
            <div className="panel" style={{ marginTop: 12 }}>
              <div style={{ font: "italic 400 13px 'EB Garamond',serif", color: 'rgba(232,224,255,.6)' }}>{t.insightsLoading}</div>
            </div>
          )}
          {insightsStatus === 'error' && (
            <div className="panel" style={{ marginTop: 12 }}>
              <div style={{ font: "italic 400 13px 'EB Garamond',serif", color: '#E0645C' }}>{insightsText}</div>
            </div>
          )}
          {insightsStatus === 'success' && (
            <div className="panel" style={{ marginTop: 12 }}>
              <div style={{ font: "italic 400 13px 'EB Garamond',serif", color: 'rgba(232,224,255,.7)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{insightsText}</div>
            </div>
          )}

          {/* Entry list grouped by date */}
          {GROUP_ORDER.map((group) => {
            const groupEntries = grouped[group];
            if (!groupEntries || groupEntries.length === 0) return null;
            return (
              <div key={group}>
                <div className="hdr" style={{ fontSize: 14, marginTop: 12 }}>
                  <span style={{ font: "italic 400 13px 'EB Garamond',serif", color: '#D9BE7A' }}>{t[group]}</span>
                </div>
                {groupEntries.map((entry) => (
                  <div key={entry.id} className="panel" onClick={() => onSelectEntry && onSelectEntry(entry)} style={{ cursor: 'pointer', marginBottom: 6 }}>
                    {/* Title row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ font: "400 13px 'EB Garamond',serif", color: '#EDE7F6' }}>{entry.emotion || t.untitled}</span>
                      <span style={{ font: "400 9px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.4)' }}>{fmtTime(entry.ts)}</span>
                    </div>
                    {/* V/A/D row */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                      <span style={{ font: "300 11px 'JetBrains Mono',monospace", color: '#E8B54D' }}>V {entry.v.toFixed(2)}</span>
                      <span style={{ font: "300 11px 'JetBrains Mono',monospace", color: '#E0645C' }}>A {entry.a.toFixed(2)}</span>
                      <span style={{ font: "300 11px 'JetBrains Mono',monospace", color: '#6D9BD1' }}>D {entry.d.toFixed(2)}</span>
                    </div>
                    {/* Score fill bar */}
                    <div style={{ height: 4, background: 'rgba(232,224,255,.08)', borderRadius: 2, marginBottom: 6 }}>
                      <div style={{ height: 4, width: `${entry.score * 10}%`, background: '#D9BE7A', borderRadius: 2, transition: 'width 0.3s' }} />
                    </div>
                    {/* Note text */}
                    {entry.note && (
                      <div style={{ font: "italic 400 12px 'EB Garamond',serif", color: 'rgba(232,224,255,.45)', whiteSpace: 'pre-line' }}>{entry.note}</div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </>
      )}

      <div style={{ height: 100 }} />
    </div>
  );
}
