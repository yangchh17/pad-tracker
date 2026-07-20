import { TEXT } from './text';
import { fmtTime } from './format';

export const LLM_TIMEOUT_MS = 120000;
export const INSIGHTS_MAX_ENTRIES = 20;
export const CHAT_MAX_TURNS = 12;

export function llmChat(settings, messages, opts) {
  const timeoutMs = (opts && opts.timeoutMs) || LLM_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const base = (settings.baseUrl || '').replace(/\/+$/, '');
  // Ollama's native /api/chat (not the OpenAI-compatible /v1/chat/completions) is used
  // deliberately: local "thinking"/reasoning models can spend their entire token budget
  // on chain-of-thought before ever emitting the answer, and only the native endpoint's
  // options.num_predict reliably raises that budget on every Ollama version/install we
  // tested — the OpenAI-compat endpoint silently ignored max_tokens and any options
  // passthrough attempt, always capping at a small default and returning an empty
  // response. This does trade away portability to non-Ollama OpenAI-compatible servers
  // (LM Studio etc.) for actually working with real local reasoning models.
  // think:false skips that chain-of-thought pass entirely for models that support it
  // (confirmed via Ollama's own "thinking" response field disappearing, and eval_count
  // dropping from ~50 to ~7 tokens on a trivial prompt) — cuts real end-to-end latency
  // from 60-90s+ to a few seconds without changing the underlying model or its answers.
  return fetch(base + '/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: settings.model,
      messages,
      stream: false,
      think: false,
      options: { temperature: 0.2, num_predict: 1024, num_ctx: 8192 },
    }),
    signal: controller.signal,
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().catch(() => '').then((bodyText) => {
          throw new Error('http_' + res.status + (bodyText ? ': ' + bodyText.slice(0, 200) : ''));
        });
      }
      return res.json();
    })
    .then((data) => {
      const content = data && data.message && data.message.content;
      if (typeof content !== 'string' || !content.length) throw new Error('empty_response');
      return content;
    })
    .catch((err) => {
      if (err && err.name === 'AbortError') throw new Error('timeout');
      throw err;
    })
    .finally(() => {
      clearTimeout(timer);
    });
}

export function llmErrorMessage(err, t) {
  const msg = (err && err.message) || '';
  if (msg === 'timeout') return t.errTimeout;
  if (msg.startsWith('http_404')) return t.errModel;
  if (msg.startsWith('http_')) return t.errServer;
  return t.errNetwork;
}

export function buildChatSystemPrompt(lang, turnsUsed) {
  const langLine = lang === 'zh' ? 'Chinese' : 'English';
  const n = typeof turnsUsed === 'number' ? turnsUsed : 0;
  let turnLine;
  if (n >= CHAT_MAX_TURNS) {
    turnLine = `This is turn ${n} of a hard ${CHAT_MAX_TURNS}-turn limit - it is the LAST reply you will get to give. Do NOT ask another question. Briefly summarize what came up in this conversation and warmly invite them to check in on their mood now that you're wrapping up.`;
  } else if (n >= CHAT_MAX_TURNS - 2) {
    turnLine = `This is turn ${n} of a hard ${CHAT_MAX_TURNS}-turn limit - only ${CHAT_MAX_TURNS - n} exchange(s) left. Start moving toward a summary now rather than opening a new thread, and let them know in this reply that you're nearly at the end so it doesn't cut off abruptly.`;
  } else {
    turnLine = `This is turn ${n} of a hard ${CHAT_MAX_TURNS}-turn limit. Use the early turns to explore openly; start naming what you're noticing in PAD terms by the middle of the budget.`;
  }
  return `You are a warm, supportive journaling companion helping someone reflect on how they're feeling right now, using the Valence/Arousal/Dominance (PAD) model this app is built on: pleasant vs. unpleasant, energized vs. calm, in control vs. overwhelmed. You are not a therapist, counselor, or medical professional, and you must never diagnose, label a clinical condition, or suggest treatment.

- Naming feelings in plain PAD language (e.g. "that sounds like it has an unsettled, keyed-up quality" or "more like a stuck, powerless feeling") is exactly what you're here for - it is not a clinical act, and you should do it, not refuse to.
- Ask short, open, curious questions - one at a time, not a list. Reflect back what you hear before asking the next one.
- Never rush to reassure, fix, or minimize. Sit with what they share first.
- If the user asks a direct question about you, this tool, or how it works (e.g. "what model are you," "how many turns do we get," "what's your goal") - answer it plainly and honestly in one sentence, then continue. Do not deflect a direct question back as another reflective question.
- If the user signals they want to wrap up (e.g. "one more round," "let's stop," "I'm okay now") - treat that as final. Your next reply should briefly summarize what came up and invite them to check in on how they feel now, not open a new thread or ask "anything else?"
- ${turnLine}
- If they mention self-harm, crisis, or being in danger, gently and clearly encourage them to reach out to a crisis line or someone they trust right now, and do not continue with reflective questions in that moment.
- Keep responses brief - 2-4 sentences. This is a conversation, not an essay.
- Write in ${langLine}.`;
}

export function buildChatSummaryPrompt(lang) {
  return lang === 'zh'
    ? '请用不超过3句非临床、温暖的话，总结以下对话中用户分享的内容和情绪走向，不要下诊断或使用临床术语，也不要提及你自己。'
    : 'In 2-3 warm, non-clinical sentences, summarize what the user shared in this conversation and how their feelings seemed to shift. Do not diagnose, use clinical language, or refer to yourself.';
}

export function formatChatTranscript(lang, messages) {
  const t = TEXT[lang];
  const who = (role) => (role === 'user' ? t.chatMe : t.chatCompanion);
  return t.conversationTitle + '\n' + messages.map((m) => who(m.role) + ': ' + m.content).join('\n');
}

export function buildOnboardInstallBody(lang, isIOS, isAndroid) {
  if (lang === 'zh') {
    if (isIOS) return '点击分享图标，然后选择"添加到主屏幕"。这样可以保护你的记录，并把 PAD Tracker 像真正的 App 一样放在主屏幕上。';
    if (isAndroid) return '点击菜单（⋮），然后选择"安装应用"（或"添加到主屏幕"）。这样可以保护你的记录，并把 PAD Tracker 像真正的 App 一样放在主屏幕上。';
    return 'iPhone：点击分享图标 → "添加到主屏幕"。\nAndroid：点击菜单（⋮）→ "安装应用"。\n这样可以保护你的记录，并把 PAD Tracker 像真正的 App 一样放在主屏幕上。';
  }
  if (isIOS) return 'Tap the Share icon, then "Add to Home Screen." This keeps your entries safe and puts PAD Tracker on your home screen like a real app.';
  if (isAndroid) return 'Tap the menu (⋮), then "Install app" (or "Add to Home Screen"). This keeps your entries safe and puts PAD Tracker on your home screen like a real app.';
  return 'On iPhone: tap the Share icon, then "Add to Home Screen."\nOn Android: tap the menu (⋮), then "Install app."\nThis keeps your entries safe and puts PAD Tracker on your home screen like a real app.';
}

export function buildInsightsPrompt(entries, lang) {
  const recent = [...entries].sort((a, b) => a.ts - b.ts).slice(-INSIGHTS_MAX_ENTRIES);
  const rows = recent
    .map((e) => {
      const d = new Date(e.ts);
      return `${d.toISOString().slice(0, 10)} ${fmtTime(e.ts)} | V=${e.v.toFixed(2)} A=${e.a.toFixed(2)} D=${e.d.toFixed(2)} score=${e.score} | ${e.emotion || '(untitled)'} | note: ${(e.note || '').replace(/\n/g, ' ')}`;
    })
    .join('\n');
  const system =
    'You are a supportive, non-clinical mood-journal assistant. You are not a therapist and must not diagnose. Respond in plain prose only, no JSON, no markdown headers, 3-5 short sentences maximum.';
  const user = `Here are the ${recent.length} most recent mood-tracking entries (Valence/Arousal/Dominance model, each axis from -1 to 1, plus a 1-10 overall score):\n\n${rows}\n\nIn 3-5 short sentences, describe any noticeable patterns: recurring emotional themes, time-of-day or day-of-week trends, or notable shifts. Be gentle and observational, not diagnostic. Write in ${lang === 'zh' ? 'Chinese' : 'English'}.`;
  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}
