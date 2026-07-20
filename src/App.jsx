import { Storage, LlmSettings, Onboarding, DEFAULT_LLM_BASE_URL, DEFAULT_LLM_MODEL, ONBOARDING_PAGES } from './lib/storage';
import { TEXT, EMOTION_BANK, infoHtml } from './lib/text';
import { llmChat, llmErrorMessage, buildChatSystemPrompt, buildChatSummaryPrompt, formatChatTranscript, buildOnboardInstallBody, buildInsightsPrompt, CHAT_MAX_TURNS } from './lib/llm';
import { fmtTime, fmtDate, fmtDateTime, fmtSigned, csvEscape, classifyDate } from './lib/format';
import { clamp, proj, buildTrailSegments, buildHighlightDot, buildRings, buildAxes, mapLine, mapScore, chartXTime, computeChartXs, chartYPad, chartYScore } from './lib/pad';

function smokeTest() {
  const checks = [];
  checks.push(['Storage.load() is array', Array.isArray(Storage.load())]);
  checks.push(['LlmSettings.load() has default baseUrl', LlmSettings.load().baseUrl === DEFAULT_LLM_BASE_URL]);
  checks.push(['LlmSettings.load() has default model', LlmSettings.load().model === DEFAULT_LLM_MODEL]);
  checks.push(['Onboarding.isDone() is boolean', typeof Onboarding.isDone() === 'boolean']);
  checks.push(['ONBOARDING_PAGES is 3', ONBOARDING_PAGES === 3]);
  checks.push(['TEXT.en.home', TEXT.en.home === 'Home']);
  checks.push(['TEXT.zh.home', TEXT.zh.home === '主页']);
  checks.push(['EMOTION_BANK has 44 entries', EMOTION_BANK.length === 44]);
  checks.push(['infoHtml(v,en) returns string', typeof infoHtml('v', 'en') === 'string' && infoHtml('v', 'en').length > 0]);
  checks.push(['buildChatSystemPrompt returns string', typeof buildChatSystemPrompt('en', 0) === 'string']);
  checks.push(['buildChatSummaryPrompt returns string', typeof buildChatSummaryPrompt('en') === 'string']);
  checks.push(['formatChatTranscript works', formatChatTranscript('en', [{ role: 'user', content: 'hi' }]).includes('Me: hi')]);
  checks.push(['buildOnboardInstallBody works', typeof buildOnboardInstallBody('en', false, false) === 'string']);
  checks.push(['buildInsightsPrompt returns 2 messages', buildInsightsPrompt([], 'en').length === 2]);
  checks.push(['CHAT_MAX_TURNS is 12', CHAT_MAX_TURNS === 12]);
  checks.push(['llmErrorMessage works', llmErrorMessage(new Error('timeout'), TEXT.en) === TEXT.en.errTimeout]);
  checks.push(['fmtTime works', /^\d{2}:\d{2}$/.test(fmtTime(Date.now()))]);
  checks.push(['fmtDate works', typeof fmtDate(Date.now(), 'en') === 'string']);
  checks.push(['fmtDateTime works', typeof fmtDateTime(Date.now(), 'en') === 'string']);
  checks.push(['fmtSigned works', fmtSigned(0.5) === '+0.50']);
  checks.push(['csvEscape escapes commas', csvEscape('a,b') === '"a,b"']);
  checks.push(['classifyDate works', classifyDate(Date.now(), Date.now()) === 'today']);
  checks.push(['clamp works', clamp(5, 0, 3) === 3]);
  checks.push(['proj works', proj(1, 1, 1, 100).x === 100]);
  checks.push(['buildTrailSegments works', buildTrailSegments([{ v: 0, a: 0, d: 0 }, { v: 1, a: 1, d: 1 }], 100, -12, 24).segs.length > 0]);
  checks.push(['buildHighlightDot returns string', typeof buildHighlightDot(0, 0, 0, 100, -12, 24) === 'string']);
  checks.push(['buildRings returns 3', buildRings(100).length === 3]);
  checks.push(['buildAxes returns 3', buildAxes(100).length === 3]);
  checks.push(['mapLine works', typeof mapLine([0, 0.5, 1], 100, 100, 10) === 'string']);
  checks.push(['mapScore works', typeof mapScore([5, 6, 7], 100, 100, 10) === 'string']);
  checks.push(['chartXTime works', typeof chartXTime(Date.now(), Date.now(), 1) === 'number']);
  checks.push(['computeChartXs works', computeChartXs([{ ts: Date.now() }, { ts: Date.now() + 1000 }], Date.now(), 1).length === 2]);
  checks.push(['chartYPad works', typeof chartYPad(0) === 'number']);
  checks.push(['chartYScore works', typeof chartYScore(5) === 'number']);
  return checks;
}

export default function App() {
  const checks = smokeTest();
  const failed = checks.filter(([, ok]) => !ok);
  return (
    <div className="min-h-dvh bg-[#05060C] text-[#EDE7F6] font-mono text-xs p-6">
      <h1 className="font-serif italic text-lg text-[#D9BE7A] mb-4">
        Phase 1 smoke test — {checks.length - failed.length}/{checks.length} passed
      </h1>
      <ul className="space-y-1">
        {checks.map(([name, ok]) => (
          <li key={name} className={ok ? 'text-green-400' : 'text-red-400'}>
            {ok ? '✓' : '✗'} {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
