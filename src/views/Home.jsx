import { useState, useRef, useEffect } from 'react';
import {
  clamp, buildRings, buildAxes, buildTrailSegments, buildHighlightDot,
  computeChartXs, chartYPad, chartYScore, CHART_PADR,
} from '../lib/pad';
import { fmtSigned, fmtTime, fmtDateTime } from '../lib/format';

const SIZE = 70;

export default function Home({ t, lang, entries }) {
  const [rx, setRx] = useState(-12);
  const [ry, setRy] = useState(24);
  const [zoom, setZoom] = useState(1);
  const [chartTab, setChartTab] = useState('pad');
  const [chartZoom, setChartZoom] = useState(1);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverScreenX, setHoverScreenX] = useState(0);

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

  useEffect(() => {
    scrollChartToEnd();
  }, [chartZoom]);

  const cubeDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    dragCube.current = true;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
  };
  const cubeMove = (e) => {
    if (!dragCube.current) return;
    const dx = e.clientX - lastX.current, dy = e.clientY - lastY.current;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    setRx((v) => clamp(v - dy * 0.4, -85, 10));
    setRy((v) => v + dx * 0.4);
  };
  const cubeUp = () => { dragCube.current = false; };
  const cubeWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom((v) => clamp(v + delta, 0.6, 2));
  };
  const zoomIn = () => setZoom((v) => clamp(v + 0.15, 0.6, 2));
  const zoomOut = () => setZoom((v) => clamp(v - 0.15, 0.6, 2));

  const sortedEntries = [...entries].sort((a, b) => a.ts - b.ts);
  const hasEntries = sortedEntries.length > 0;
  const now = Date.now();
  const latest = hasEntries ? sortedEntries[sortedEntries.length - 1] : null;
  const chartOriginTs = hasEntries ? sortedEntries[0].ts : now;
  const chartXs = hasEntries ? computeChartXs(sortedEntries, chartOriginTs, chartZoom) : [];

  const chartHoverAt = (clientX) => {
    if (!chartScrollNode.current || !sortedEntries.length) return;
    const rect = chartScrollNode.current.getBoundingClientRect();
    const scrollLeft = chartScrollNode.current.scrollLeft;
    const localX = clientX - rect.left + scrollLeft;
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
  const chartWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setChartZoom((v) => clamp(v + delta, 0.6, 2.5));
  };
  const chartZoomIn = () => setChartZoom((v) => clamp(v + 0.25, 0.6, 2.5));
  const chartZoomOut = () => setChartZoom((v) => clamp(v - 0.25, 0.6, 2.5));

  const trailPts = sortedEntries.slice(-40).map((e) => ({ v: e.v, a: e.a, d: e.d }));
  const trailData = trailPts.length ? buildTrailSegments(trailPts, SIZE, rx, ry) : { segs: [], headDot: { style: '' } };
  const rings = buildRings(SIZE * 1.35);
  const axes = buildAxes(SIZE);

  const dateStr = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'zh-CN', lang === 'en' ? { month: 'short', day: 'numeric', year: 'numeric' } : { year: 'numeric', month: 'long', day: 'numeric' }).format(now);

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
  const hoverEntry = hasEntries ? sortedEntries[hoverIndex !== null ? hoverIndex : sortedEntries.length - 1] : null;
  const hoverDate = hoverEntry ? fmtDateTime(hoverEntry.ts, lang) : '';
  const hoverSummary = hoverEntry
    ? (chartTab === 'pad' ? `V ${fmtSigned(hoverEntry.v)}  A ${fmtSigned(hoverEntry.a)}  D ${fmtSigned(hoverEntry.d)}` : `${t.score} ${hoverEntry.score}`)
    : '';
  const hasHoverNote = !!(hoverEntry && hoverEntry.note);
  const hoverNote = hoverEntry ? hoverEntry.note : '';
  const hoverTooltipLeft = 32 + hoverScreenX;
  const hoverHighlightStyle = hasHover ? buildHighlightDot(sortedEntries[hoverIndex].v, sortedEntries[hoverIndex].a, sortedEntries[hoverIndex].d, SIZE, rx, ry) : '';

  return (
    <div>
      <div className="hdr">
        <div>
          <div style={{ font: "400 24px/1.1 'EB Garamond',serif", color: '#EDE7F6', letterSpacing: '.02em' }}>{t.home}</div>
          <div style={{ font: "400 10px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.35)', marginTop: 4, letterSpacing: '.06em' }}>{dateStr}</div>
        </div>
        <div style={{ font: "italic 400 12px 'EB Garamond',serif", color: 'rgba(232,224,255,.4)' }}>{t.now}</div>
      </div>

      <div className="panel" style={{ overflow: 'visible' }}>
        <div style={{ font: "400 11px 'EB Garamond',serif", fontStyle: 'italic', letterSpacing: '.06em', color: 'rgba(217,190,122,.75)', marginBottom: 4 }}>{t.phase}</div>
        <div
          className="cube-drag"
          onPointerDown={cubeDown} onPointerMove={cubeMove} onPointerUp={cubeUp} onPointerCancel={cubeUp} onWheel={cubeWheel}
          style={{ position: 'relative', height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 650, overflow: 'visible' }}
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
              {hasHover && <div style={cssText(hoverHighlightStyle)} />}
            </div>
          </div>
          <div style={{ position: 'absolute', right: 6, bottom: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="chip" onClick={zoomIn} style={{ width: 32, height: 32, border: '1px solid rgba(217,190,122,.4)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9BE7A', font: "400 16px 'JetBrains Mono',monospace" }}>+</div>
            <div className="chip" onClick={zoomOut} style={{ width: 32, height: 32, border: '1px solid rgba(217,190,122,.4)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9BE7A', font: "400 16px 'JetBrains Mono',monospace" }}>–</div>
          </div>
          {!hasEntries && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center', font: "italic 400 11px 'EB Garamond',serif", color: 'rgba(232,224,255,.4)', pointerEvents: 'none' }}>{t.emptyTrail}</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 8, paddingTop: 14, borderTop: '1px solid rgba(217,190,122,.12)' }}>
          <div style={{ flex: 1 }}><div style={{ font: "400 9px 'JetBrains Mono',monospace", color: '#E8B54D', letterSpacing: '.08em' }}>{t.v}</div><div style={{ font: "300 17px 'JetBrains Mono',monospace", color: '#EDE7F6' }}>{latest ? fmtSigned(latest.v) : '—'}</div></div>
          <div style={{ flex: 1 }}><div style={{ font: "400 9px 'JetBrains Mono',monospace", color: '#E0645C', letterSpacing: '.08em' }}>{t.a}</div><div style={{ font: "300 17px 'JetBrains Mono',monospace", color: '#EDE7F6' }}>{latest ? fmtSigned(latest.a) : '—'}</div></div>
          <div style={{ flex: 1 }}><div style={{ font: "400 9px 'JetBrains Mono',monospace", color: '#6D9BD1', letterSpacing: '.08em' }}>{t.d}</div><div style={{ font: "300 17px 'JetBrains Mono',monospace", color: '#EDE7F6' }}>{latest ? fmtSigned(latest.d) : '—'}</div></div>
        </div>
      </div>

      <div className="panel">
        {hasEntries ? (
          <>
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
                  {hasHoverNote && <div style={{ marginTop: 3, font: "italic 400 10px 'EB Garamond',serif", color: 'rgba(232,224,255,.55)', whiteSpace: 'normal', maxWidth: 180 }}>{hoverNote}</div>}
                </div>
              )}
            </div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(217,190,122,.1)', font: "400 11px 'JetBrains Mono',monospace", color: 'rgba(232,224,255,.55)' }}>
              <span style={{ color: '#D9BE7A' }}>{hoverDate}</span> · {hoverSummary}
              {hasHoverNote && <div style={{ marginTop: 4, font: "italic 400 11px 'EB Garamond',serif", color: 'rgba(232,224,255,.45)' }}>{hoverNote}</div>}
            </div>
          </>
        ) : (
          <div style={{ padding: '24px 4px', textAlign: 'center', font: "italic 400 12px 'EB Garamond',serif", color: 'rgba(232,224,255,.4)' }}>{t.emptyChart}</div>
        )}
      </div>

      <div style={{ height: 100 }} />
    </div>
  );
}

// Legacy segment/label styles are plain CSS strings (position/transform/etc.)
// built by the ported lib/pad.js functions - parse them into a React style
// object rather than rewriting every caller to build objects instead.
function cssText(str) {
  const out = {};
  if (!str) return out;
  str.split(';').forEach((decl) => {
    const idx = decl.indexOf(':');
    if (idx === -1) return;
    const prop = decl.slice(0, idx).trim();
    const val = decl.slice(idx + 1).trim();
    if (!prop || !val) return;
    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = val;
  });
  return out;
}
