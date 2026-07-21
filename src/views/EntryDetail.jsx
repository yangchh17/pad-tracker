import { useState, useRef, useEffect } from 'react';
import {
  clamp, buildRings, buildAxes, buildTrailSegments, buildHighlightDot,
  computeChartXs, chartYPad, chartYScore, CHART_PADR,
} from '../lib/pad';
import { fmtSigned, fmtTime, fmtDateTime } from '../lib/format';

const SIZE = 70;

export default function EntryDetail({ t, lang, entries, entry, onBack }) {
  const [rx, setRx] = useState(-12);
  const [ry, setRy] = useState(24);
  const [zoom, setZoom] = useState(1);
  const [chartTab, setChartTab] = useState('pad');
  const [chartZoom, setChartZoom] = useState(1);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverScreenX, setHoverScreenX] = useState(0);
  const [chatExpanded, setChatExpanded] = useState(false);

  const dragCube = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const chartScrollNode = useRef(null);
  const chartDrag = useRef(false);
  const chartStartX = useRef(0);
  const chartStartScroll = useRef(0);

  const scrollChartToEnd = () => {
    if (chartScrollNode.current) chartScrollNode.current.scrollLeft = chartScrollNode.current.scrollWidth;
  };
  useEffect(() => { scrollChartToEnd(); }, [chartZoom]);

  const cubeDown = (e) => { e.target.setPointerCapture(e.pointerId); dragCube.current = true; lastX.current = e.clientX; lastY.current = e.clientY; };
  const cubeMove = (e) => {
    if (!dragCube.current) return;
    const dx = e.clientX - lastX.current, dy = e.clientY - lastY.current;
    lastX.current = e.clientX; lastY.current = e.clientY;
    setRx((v) => clamp(v - dy * 0.4, -85, 10));
    setRy((v) => v + dx * 0.4);
  };
  const cubeUp = () => { dragCube.current = false; };
  const cubeWheel = (e) => { e.preventDefault(); const d = e.deltaY > 0 ? -0.08 : 0.08; setZoom((v) => clamp(v + d, 0.6, 2)); };
  const zoomIn = () => setZoom((v) => clamp(v + 0.15, 0.6, 2));
  const zoomOut = () => setZoom((v) => clamp(v - 0.15, 0.6, 2));

  const sortedEntries = [...entries].sort((a, b) => a.ts - b.ts);
  const hasEntries = sortedEntries.length > 0;
  const now = Date.now();
  const chartOriginTs = hasEntries ? sortedEntries[0].ts : now;
  const chartXs = hasEntries ? computeChartXs(sortedEntries, chartOriginTs, chartZoom) : [];

  const chartHoverAt = (clientX) => {
    if (!chartScrollNode.current || !sortedEntries.length) return;
    const rect = chartScrollNode.current.getBoundingClientRect();
    const localX = clientX - rect.left + chartScrollNode.current.scrollLeft;
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < sortedEntries.length; i++) {
      const dist = Math.abs(chartXs[i] - localX);
      if (dist < bestDist) { bestDist = dist; best = i; }
    }
    setHoverIndex(best);
    setHoverScreenX(clamp(clientX - rect.left, 0, rect.width));
  };
  const chartDown = (e) => {
    if (!chartScrollNode.current) return;
    chartDrag.current = true;
    chartStartX.current = e.clientX;
    chartStartScroll.current = chartScrollNode.current.scrollLeft;
    chartHoverAt(e.clientX);
  };
  const chartMove = (e) => {
    if (chartDrag.current) {
      const dx = e.clientX - chartStartX.current;
      chartScrollNode.current.scrollLeft = chartStartScroll.current - dx;
    }
    chartHoverAt(e.clientX);
  };
  const chartUp = () => { chartDrag.current = false; setHoverIndex(null); };
  const chartWheel = (e) => { e.preventDefault(); const d = e.deltaY > 0 ? -0.15 : 0.15; setChartZoom((v) => clamp(v + d, 0.6, 2.5)); };
  const chartZoomIn = () => setChartZoom((v) => clamp(v + 0.25, 0.6, 2.5));
  const chartZoomOut = () => setChartZoom((v) => clamp(v - 0.25, 0.6, 2.5));

  const trailPts = sortedEntries.slice(-40).map((e) => ({ v: e.v, a: e.a, d: e.d }));
  const trailData = trailPts.length ? buildTrailSegments(trailPts, SIZE, rx, ry) : { segs: [], headDot: { style: '' } };
  const rings = buildRings(SIZE * 1.35);
  const axes = buildAxes(SIZE);
  const highlightStyle = entry ? buildHighlightDot(entry.v, entry.a, entry.d, SIZE, rx, ry) : '';

  const chartTotalWidth = hasEntries ? Math.max(chartXs[chartXs.length - 1] + CHART_PADR, 300) : 300;
  const padPolyV = sortedEntries.map((e, i) => `${chartXs[i].toFixed(1)},${chartYPad(e.v).toFixed(1)}`).join(' ');
  const padPolyA = sortedEntries.map((e, i) => `${chartXs[i].toFixed(1)},${chartYPad(e.a).toFixed(1)}`).join(' ');
  const padPolyD = sortedEntries.map((e, i) => `${chartXs[i].toFixed(1)},${chartYPad(e.d).toFixed(1)}`).join(' ');
  const scorePoly = sortedEntries.map((e, i) => `${chartXs[i].toFixed(1)},${chartYScore(e.score).toFixed(1)}`).join(' ');
  const xTicks = sortedEntries.map((e, i) => {
    const prev = i > 0 ? new Date(sortedEntries[i - 1].ts) : null;
    const d = new Date(e.ts);
    const isNewDay = !prev || prev.getFullYear() !== d.getFullYear() || prev.getMonth() !== d.getMonth() || prev.getDate() !== d.getDate();
    return { key: e.id, x: chartXs[i], label: isNewDay ? `${d.getMonth() + 1}/${d.getDate()}` : '' };
  });
  const gridLines = chartTab === 'pad'
    ? [{ key: 'g0', y: chartYPad(1) }, { key: 'g1', y: chartYPad(0) }, { key: 'g2', y: chartYPad(-1) }]
    : [{ key: 'g0', y: chartYScore(10) }, { key: 'g1', y: chartYScore(5) }, { key: 'g2', y: chartYScore(0) }];
  const yLabels = chartTab === 'pad' ? ['+1.0', '0', '−1.0'] : ['10', '5', '0'];
  const hasHover = hoverIndex !== null && hasEntries;
  const hoverX = hasHover ? chartXs[hoverIndex] : 0;
  const hoverEntry = hasHover ? sortedEntries[hoverIndex] : null;
  const hoverDate = hoverEntry ? fmtDateTime(hoverEntry.ts, lang) : '';
  const hoverSummary = hoverEntry
    ? (chartTab === 'pad' ? `V ${fmtSigned(hoverEntry.v)}  A ${fmtSigned(hoverEntry.a)}  D ${fmtSigned(hoverEntry.d)}` : `${t.score} ${hoverEntry.score}`)
    : '';
  const hoverTooltipLeft = 32 + hoverScreenX;

  if (!entry) return null;
  const hasBefore = !!entry.before;
  const beforeSummary = hasBefore ? `V${fmtSigned(entry.before.v)} A${fmtSigned(entry.before.a)} D${fmtSigned(entry.before.d)} · ${entry.before.score}/10` : '';
  const afterSummary = `V${fmtSigned(entry.v)} A${fmtSigned(entry.a)} D${fmtSigned(entry.d)} · ${entry.score}/10`;
  const hasChat = !!(entry.chat && entry.chat.length);
  const chatMessages = hasChat
    ? entry.chat.map((m, i) => ({
        key: i, content: m.content,
        justify: m.role === 'user' ? 'flex-end' : 'flex-start',
        bg: m.role === 'user' ? 'rgba(217,190,122,.08)' : 'rgba(255,255,255,.03)',
        textAlign: m.role === 'user' ? 'right' : 'left',
        color: m.role === 'user' ? '#EDE7F6' : 'rgba(232,224,255,.8)',
      }))
    : [];

  return (
    <div>
      <div className="hdr">
        <div className="chip" onClick={onBack} style={{ font: "italic 400 13px 'EB Garamond',serif", color: 'rgba(217,190,122,.75)' }}>‹ {t.journal}</div>
      </div>

      <div className="panel" style={{ overflow: 'visible' }}>
        <div style={{ font: "400 11px 'EB Garamond',serif", fontStyle: 'italic', letterSpacing: '.06em', color: 'rgba(217,190,122,.75)', marginBottom: 4 }}>{t.phase}</div>
        <div
          className="cube-drag"
          onPointerDown={cubeDown} onPointerMove={cubeMove} onPointerUp={cubeUp} onPointerCancel={cubeUp} onWheel={cubeWheel}
          style={{ position: 'relative', height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 650, overflow: 'hidden' }}
        >
          <div style={{ transform: `scale(${zoom})` }}>
            <div style={{ position: 'relative', width: 0, height: 0, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
              {rings.map((r) => <div key={r.key} style={cssText(r.style)} />)}
              {axes.map((ax) => (
                <div key={ax.label}>
                  <div style={cssText(ax.lineStyle)} />
                  <div style={cssText(ax.labelStyle)}>{ax.label}</div>
                </div>
              ))}
              {trailData.segs.map((sg) => <div key={sg.key} style={cssText(sg.style)} />)}
              <div style={cssText(trailData.headDot.style)} />
              <div style={cssText(highlightStyle)} />
            </div>
          </div>
          <div style={{ position: 'absolute', right: 6, bottom: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="chip" onClick={zoomIn} style={{ width: 32, height: 32, border: '1px solid rgba(217,190,122,.4)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9BE7A', font: "400 16px 'JetBrains Mono',monospace" }}>+</div>
            <div className="chip" onClick={zoomOut} style={{ width: 32, height: 32, border: '1px solid rgba(217,190,122,.4)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9BE7A', font: "400 16px 'JetBrains Mono',monospace" }}>–</div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div style={{ display: 'flex', gap: 18, marginBottom: 12 }}>
          <div className="chip" onClick={() => setChartTab('pad')} style={{ font: "400 12px 'EB Garamond',serif", fontStyle: 'italic', color: chartTab === 'pad' ? '#D9BE7A' : 'rgba(255,255,255,.35)', borderBottom: `1px solid ${chartTab === 'pad' ? '#D9BE7A' : 'transparent'}`, paddingBottom: 6 }}>{t.pad}</div>
          <div className="chip" onClick={() => setChartTab('score')} style={{ font: "400 12px 'EB Garamond',serif", fontStyle: 'italic', color: chartTab === 'score' ? '#D9BE7A' : 'rgba(255,255,255,.35)', borderBottom: `1px solid ${chartTab === 'score' ? '#D9BE7A' : 'transparent'}`, paddingBottom: 6 }}>{t.score}</div>
          <div style={{ flex: 1 }} />
          <div className="chip" onClick={chartZoomOut} style={{ width: 30, height: 30, border: '1px solid rgba(217,190,122,.4)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9BE7A', font: "400 14px 'JetBrains Mono',monospace" }}>–</div>
          <div className="chip" onClick={chartZoomIn} style={{ width: 30, height: 30, border: '1px solid rgba(217,190,122,.4)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9BE7A', font: "400 14px 'JetBrains Mono',monospace" }}>+</div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 'none', width: 26, height: 78, marginTop: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {yLabels.map((yl) => <div key={yl} style={{ font: "300 9px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.35)', textAlign: 'right' }}>{yl}</div>)}
            </div>
            <div
              ref={chartScrollNode}
              onPointerDown={chartDown} onPointerMove={chartMove} onPointerUp={chartUp} onPointerLeave={chartUp} onWheel={chartWheel}
              style={{ overflowX: 'auto', flex: 1, cursor: 'grab', touchAction: 'none' }}
            >
              <svg width={chartTotalWidth} height="110" viewBox={`0 0 ${chartTotalWidth} 110`} style={{ display: 'block' }}>
                {gridLines.map((gl) => <line key={gl.key} x1="0" y1={gl.y} x2={chartTotalWidth} y2={gl.y} stroke="rgba(255,255,255,.06)" strokeWidth="1" />)}
                {chartTab === 'pad' && (
                  <>
                    <polyline points={padPolyV} fill="none" stroke="#E8B54D" strokeWidth="1.3" />
                    <polyline points={padPolyA} fill="none" stroke="#E0645C" strokeWidth="1.3" />
                    <polyline points={padPolyD} fill="none" stroke="#6D9BD1" strokeWidth="1.3" />
                  </>
                )}
                {chartTab === 'score' && <polyline points={scorePoly} fill="none" stroke="#D9BE7A" strokeWidth="1.6" />}
                {hasHover && <line x1={hoverX} y1="0" x2={hoverX} y2="88" stroke="rgba(217,190,122,.4)" strokeWidth="1" />}
                {xTicks.map((xt) => <text key={xt.key} x={xt.x} y="104" fontSize="8" fill="rgba(232,224,255,.35)" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{xt.label}</text>)}
              </svg>
            </div>
          </div>
          {hasHover && (
            <div style={{ position: 'absolute', left: hoverTooltipLeft, top: -4, transform: 'translate(-50%,-100%)', background: 'rgba(10,8,6,.95)', border: '1px solid rgba(217,190,122,.4)', borderRadius: 6, padding: '8px 10px', font: "400 10px 'JetBrains Mono',monospace", color: '#EDE7F6', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10 }}>
              <div style={{ color: '#D9BE7A', marginBottom: 3 }}>{hoverDate}</div>
              <div>{hoverSummary}</div>
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ font: "500 16px Inter,sans-serif", color: '#EDE7F6' }}>{entry.emotion || t.untitled}</span>
          <span style={{ font: "400 10px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.4)' }}>{fmtTime(entry.ts)}</span>
        </div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><div style={{ font: "400 9px 'JetBrains Mono',monospace", color: '#E8B54D', letterSpacing: '.08em' }}>{t.v}</div><div style={{ font: "300 16px 'JetBrains Mono',monospace", color: '#EDE7F6' }}>{fmtSigned(entry.v)}</div></div>
          <div style={{ flex: 1 }}><div style={{ font: "400 9px 'JetBrains Mono',monospace", color: '#E0645C', letterSpacing: '.08em' }}>{t.a}</div><div style={{ font: "300 16px 'JetBrains Mono',monospace", color: '#EDE7F6' }}>{fmtSigned(entry.a)}</div></div>
          <div style={{ flex: 1 }}><div style={{ font: "400 9px 'JetBrains Mono',monospace", color: '#6D9BD1', letterSpacing: '.08em' }}>{t.d}</div><div style={{ font: "300 16px 'JetBrains Mono',monospace", color: '#EDE7F6' }}>{fmtSigned(entry.d)}</div></div>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,.08)', marginBottom: 12 }}>
          <div style={{ height: '100%', borderRadius: 2, background: '#D9BE7A', width: `${entry.score * 10}%` }} />
        </div>
        <div style={{ font: "400 13px/1.6 Inter,sans-serif", color: 'rgba(232,224,255,.6)', whiteSpace: 'pre-line' }}>{entry.note}</div>
        {hasBefore && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(217,190,122,.12)', font: "400 10px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.45)' }}>
            {t.before}: {beforeSummary} · {t.after}: {afterSummary}
          </div>
        )}
        {hasChat && (
          <div style={{ marginTop: 10 }}>
            <span className="chip" onClick={() => setChatExpanded((v) => !v)} style={{ font: "400 10px 'JetBrains Mono',monospace", color: '#D9BE7A' }}>
              {chatExpanded ? t.showLess : t.viewConversation}
            </span>
            {chatExpanded && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {chatMessages.map((m) => (
                  <div key={m.key} style={{ display: 'flex', justifyContent: m.justify }}>
                    <div style={{ maxWidth: '80%', padding: '9px 12px', borderRadius: 6, background: m.bg, border: '1px solid rgba(217,190,122,.15)', textAlign: m.textAlign, font: "400 12px/1.5 Inter,sans-serif", color: m.color, whiteSpace: 'pre-line' }}>{m.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}

function cssText(str) {
  const out = {};
  if (!str) return out;
  str.split(';').forEach((decl) => {
    const idx = decl.indexOf(':');
    if (idx === -1) return;
    const prop = decl.slice(0, idx).trim();
    const val = decl.slice(idx + 1).trim();
    if (!prop || !val) return;
    out[prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = val;
  });
  return out;
}
