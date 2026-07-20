export function fmtTime(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function fmtDate(ts, lang) {
  return lang === 'en'
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(ts)
    : new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(ts);
}

export function fmtDateTime(ts, lang) {
  return lang === 'en'
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(ts) + ', ' + fmtTime(ts)
    : new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' }).format(ts) + ' ' + fmtTime(ts);
}

export function fmtSigned(v) {
  return (v >= 0 ? '+' : '') + v.toFixed(2);
}

export function csvEscape(s) {
  const str = String(s ?? '');
  return /[",\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str;
}

const CHART_MS_PER_UNIT = 86400000;
export function classifyDate(ts, now) {
  const startOfDay = (ms) => {
    const d = new Date(ms);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  };
  const dayDiff = Math.round((startOfDay(now) - startOfDay(ts)) / CHART_MS_PER_UNIT);
  if (dayDiff <= 0) return 'today';
  if (dayDiff === 1) return 'yesterday';
  if (dayDiff <= 7) return 'thisweek';
  return 'earlier';
}
