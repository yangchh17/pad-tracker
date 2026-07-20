export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export function proj(v, a, d, size) {
  return { x: v * size, y: -a * size, z: d * size };
}

function catmullRom(p0, p1, p2, p3, t) {
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
}

function buildSmoothTrail(pts, steps) {
  const n = pts.length;
  const get = (i) => pts[Math.max(0, Math.min(n - 1, i))];
  const out = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      out.push({
        v: catmullRom(p0.v, p1.v, p2.v, p3.v, t),
        a: catmullRom(p0.a, p1.a, p2.a, p3.a, t),
        d: catmullRom(p0.d, p1.d, p2.d, p3.d, t),
      });
    }
  }
  out.push(pts[n - 1]);
  return out;
}

export function buildTrailSegments(pts, size, rx, ry) {
  const smooth = buildSmoothTrail(pts, 6);
  const proj_pts = smooth.map((p) => proj(p.v, p.a, p.d, size));
  const n = proj_pts.length;
  const segs = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = proj_pts[i], p1 = proj_pts[i + 1];
    const dx = p1.x - p0.x, dy = p1.y - p0.y, dz = p1.z - p0.z;
    const r = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
    const rxz = Math.sqrt(dx * dx + dz * dz) || 0.001;
    const phi = Math.atan2(dy, rxz);
    const theta = Math.atan2(-dz, dx);
    const t = i / (n - 2);
    const op = (0.12 + 0.8 * t).toFixed(2);
    const thick = (1 + 2.4 * t).toFixed(2);
    segs.push({
      key: 's' + i,
      style: `position:absolute;left:0;top:0;width:${r.toFixed(2)}px;height:${thick}px;border-radius:${thick}px;background:linear-gradient(90deg, rgba(142,159,217,${op * 0.7}), rgba(245,239,224,${op}));transform-origin:0% 50%;transform:translate3d(${p0.x.toFixed(2)}px,${p0.y.toFixed(2)}px,${p0.z.toFixed(2)}px) rotateY(${theta.toFixed(4)}rad) rotateZ(${phi.toFixed(4)}rad);box-shadow:0 0 ${(6 + 10 * t).toFixed(1)}px rgba(245,239,224,${(op * 0.6).toFixed(2)})`,
    });
  }
  const head = proj_pts[n - 1];
  const headDot = {
    style: `position:absolute;left:0;top:0;width:7px;height:7px;border-radius:50%;transform:translate3d(${head.x}px,${head.y}px,${head.z}px) rotateY(${-ry}deg) rotateX(${-rx}deg) translate(-50%,-50%);background:radial-gradient(circle at 32% 30%, #ffffff 0%, #F5EFE0 45%, #cbb98c 100%);box-shadow:inset -1px -1px 2px rgba(0,0,0,.5),0 0 10px #F5EFE0,0 0 20px rgba(217,190,122,.7)`,
  };
  return { segs, headDot };
}

export function buildHighlightDot(v, a, d, size, rx, ry) {
  const p = proj(v, a, d, size);
  return `position:absolute;left:0;top:0;width:10px;height:10px;border-radius:50%;transform:translate3d(${p.x}px,${p.y}px,${p.z}px) rotateY(${-ry}deg) rotateX(${-rx}deg) translate(-50%,-50%);background:radial-gradient(circle at 32% 30%, #ffffff 0%, #F5EFE0 45%, #cbb98c 100%);animation:pulseGlow 1.6s ease-in-out infinite`;
}

export function buildRings(size) {
  const defs = [
    { t: '', color: '109,155,209' },
    { t: 'rotateY(90deg)', color: '232,181,77' },
    { t: 'rotateX(90deg)', color: '224,100,92' },
  ];
  return defs.map((r, i) => ({
    key: 'r' + i,
    style: `position:absolute;left:${-size}px;top:${-size}px;width:${size * 2}px;height:${size * 2}px;border-radius:50%;border:1px solid rgba(${r.color},.4);transform:${r.t};opacity:0.75`,
  }));
}

export function buildAxes(size) {
  const defs = [
    { axis: 'v', color: '#E8B54D', label: 'V' },
    { axis: 'a', color: '#E0645C', label: 'A' },
    { axis: 'd', color: '#6D9BD1', label: 'D' },
  ];
  return defs.map((ax) => {
    let lineT, labelPr;
    if (ax.axis === 'v') { lineT = `width:${size}px;height:1px`; labelPr = proj(1.15, 0, 0, size); }
    if (ax.axis === 'a') { lineT = `width:1px;height:${size}px;transform:translate3d(0,${-size}px,0)`; labelPr = proj(0, 1.2, 0, size); }
    if (ax.axis === 'd') { lineT = `width:${size}px;height:1px;transform:rotateY(-90deg);transform-origin:0% 50%`; labelPr = proj(0, 0, 1.15, size); }
    return {
      lineStyle: `position:absolute;left:0;top:0;background:${ax.color};opacity:.4;${lineT}`,
      labelStyle: `position:absolute;left:0;top:0;font:400 9px 'JetBrains Mono',monospace;color:${ax.color};transform:translate3d(${labelPr.x}px,${labelPr.y}px,${labelPr.z}px) translate(-50%,-50%);white-space:nowrap`,
      label: ax.label,
    };
  });
}

export function mapLine(vals, w, h, pad) {
  const n = vals.length;
  return vals.map((v, i) => { const x = pad + (i / (n - 1)) * (w - pad * 2); const y = h - pad - ((v + 1) / 2) * (h - pad * 2); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
}

export function mapScore(vals, w, h, pad) {
  const n = vals.length;
  return vals.map((v, i) => { const x = pad + (i / (n - 1)) * (w - pad * 2); const y = h - pad - (v / 10) * (h - pad * 2); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
}

export const CHART_SPACING = 56, CHART_PADL = 8, CHART_PADR = 40, CHART_PADTOP = 10, CHART_PADBOTTOM = 22, CHART_H = 110;
const CHART_MS_PER_UNIT = 86400000;

export function chartXTime(ts, originTs, zoom) {
  return CHART_PADL + ((ts - originTs) / CHART_MS_PER_UNIT) * CHART_SPACING * zoom;
}

export function computeChartXs(sortedEntries, originTs, zoom) {
  // Pure time-proportional spacing collapses entries logged close together
  // (e.g. several in one sitting) into a fraction of a pixel, making the
  // line invisible even though the data is there. Enforce a minimum gap
  // between adjacent points so multi-day spans still read as real gaps,
  // but same-day/close-together entries stay visually spread out.
  const xs = sortedEntries.map((e) => chartXTime(e.ts, originTs, zoom));
  const minGap = CHART_SPACING * zoom;
  for (let i = 1; i < xs.length; i++) {
    if (xs[i] - xs[i - 1] < minGap) xs[i] = xs[i - 1] + minGap;
  }
  return xs;
}

export function chartYPad(v) {
  const plotH = CHART_H - CHART_PADTOP - CHART_PADBOTTOM;
  return CHART_PADTOP + (1 - (v + 1) / 2) * plotH;
}

export function chartYScore(v) {
  const plotH = CHART_H - CHART_PADTOP - CHART_PADBOTTOM;
  return CHART_PADTOP + (1 - v / 10) * plotH;
}
