export const TEXT = {
  en: {
    home: 'Home', record: 'Record', journal: 'Journal', phase: 'Phase Space', pad: 'PAD', score: 'Score', log: 'Log Now',
    v: 'Valence', a: 'Arousal', d: 'Dominance', now: 'Now', suggested: 'Emotion Words',
    overallScore: 'Overall Score (1–10)', note: 'Note (optional)', notePlaceholder: 'What brought this on...',
    save: 'Save Entry', today: 'Today', yesterday: 'Yesterday', thisweek: 'This Week', earlier: 'Earlier',
    emptyTrail: 'No entries yet — Log Now to begin your trail', emptyChart: 'Log your first entry to see trends',
    emptyJournal: 'No entries yet.', export: 'Export CSV', untitled: 'Untitled', showMore: 'Show more', showLess: 'Show less',
    settings: 'Settings', llmEnable: 'Use local AI (Ollama)', baseUrl: 'Base URL', modelName: 'Model name',
    llmOriginsHint: 'Requires Ollama running with OLLAMA_ORIGINS allowing this page\'s address (see README).',
    desktopOnly: '🖥 Desktop only today — see README',
    testConnection: 'Test connection', testing: 'Testing…', testOk: 'Connected successfully.',
    getInsights: 'Get Insights', insightsLoading: 'Thinking about your recent entries…', insightsClose: 'Dismiss',
    hintDrag: 'Drag to rotate', hintPan: 'Swipe to pan',
    errTimeout: 'No response — is Ollama running?', errModel: 'Model not found — check the model name.',
    errServer: 'Server error — check the base URL.',
    errNetwork: 'Can\'t reach the server — check the URL, or that Ollama\'s CORS (OLLAMA_ORIGINS) allows this page.',
    recordFirst: 'Record your first entry', saved: 'Saved ✓', infoDismiss: 'Got it',
    talkItThrough: 'Talk it through', chatPlaceholder: 'Say what\'s on your mind...', send: 'Send',
    chatThinking: 'Thinking…', wrapUp: 'Wrap up', retry: 'Retry',
    addingToNote: 'Adding to note…', clear: 'Clear',
    chatCapReached: 'Long enough for now — tap Wrap up to check in.',
    afterReadingTitle: 'How do you feel now?', before: 'Before', after: 'After', viewConversation: 'View conversation',
    includeConversation: 'Save this conversation with the entry', conversationTitle: '— Talk it through conversation —',
    chatMe: 'Me', chatCompanion: 'Companion', aiSummaryPrefix: '(AI Summary)', savingEntry: 'Saving…',
    chatOpeningFraming: 'There\'s no right or wrong here — just say whatever comes to mind, however small. We\'ll check back on how you feel once we\'re done.',
    chatOpeningQuestions: ['What\'s on your mind right now?', 'What\'s present for you today?', 'Is there something sitting with you right now?', 'What\'s been on your mind lately?', 'How are things, really?'],
    onboardTitle1: 'Install it like an app',
    onboardTitle2: 'Rate how you feel',
    onboardBody2: 'Drag the three sliders by feel — no rules, just notice what feels true right now. Watch the emotion words shift as you go; they\'re a mirror for what you\'re already dialing in, not something to get right.',
    onboardTitle3: 'Talk it through (optional)',
    onboardBody3: 'Turn on "Use local AI" in Settings to talk through your day with an AI companion before logging your mood. It helps you notice and name what you\'re feeling, then compares how you felt before and after.',
    onboardSkip: 'Skip', onboardNext: 'Next', onboardDone: 'Got it', onboardAgain: 'View tutorial again',
  },
  zh: {
    home: '主页', record: '记录', journal: '日志', phase: '相空间', pad: '情绪三轴', score: '总分', log: '记录情绪',
    v: '愉悦度', a: '唤醒度', d: '支配度', now: '当前', suggested: '情绪词',
    overallScore: '总体评分 (1–10)', note: '备注（可选）', notePlaceholder: '是什么引发的...',
    save: '保存记录', today: '今天', yesterday: '昨天', thisweek: '本周', earlier: '较早',
    emptyTrail: '暂无记录 — 点击"记录情绪"开始你的轨迹', emptyChart: '记录第一条情绪以查看趋势',
    emptyJournal: '暂无记录。', export: '导出 CSV', untitled: '未命名', showMore: '展开更多', showLess: '收起',
    settings: '设置', llmEnable: '使用本地 AI（Ollama）', baseUrl: '服务器地址', modelName: '模型名称',
    llmOriginsHint: '需要 Ollama 正在运行，并且 OLLAMA_ORIGINS 允许此页面的地址（详见 README）。',
    desktopOnly: '🖥 仅限桌面端 — 详见 README',
    testConnection: '测试连接', testing: '测试中…', testOk: '连接成功。',
    getInsights: '获取洞察', insightsLoading: '正在分析你最近的记录…', insightsClose: '关闭',
    hintDrag: '拖动旋转', hintPan: '滑动查看',
    errTimeout: '没有响应 — Ollama 是否正在运行？', errModel: '找不到模型 — 请检查模型名称。',
    errServer: '服务器错误 — 请检查服务器地址。',
    errNetwork: '无法连接服务器 — 请检查地址，或确认 Ollama 的 OLLAMA_ORIGINS 允许此页面。',
    recordFirst: '记录你的第一条', saved: '已保存 ✓', infoDismiss: '知道了',
    talkItThrough: '聊一聊', chatPlaceholder: '说说你在想什么...', send: '发送',
    chatThinking: '思考中…', wrapUp: '结束对话', retry: '重试',
    addingToNote: '正在添加到备注…', clear: '清空',
    chatCapReached: '先聊到这里 — 点击"结束对话"来记录当下的心情。',
    afterReadingTitle: '现在感觉如何？', before: '之前', after: '之后', viewConversation: '查看对话',
    includeConversation: '将这段对话保存到记录中', conversationTitle: '— 聊一聊对话记录 —',
    chatMe: '我', chatCompanion: '伙伴', aiSummaryPrefix: '（AI 摘要）', savingEntry: '保存中…',
    chatOpeningFraming: '这里没有对错，想到什么就说什么，不需要想好了再说。聊完之后，我们会再看看你的感受有没有变化。',
    chatOpeningQuestions: ['现在你在想什么？', '今天有什么一直放在心里吗？', '此刻，你在意的是什么？', '最近有什么事一直萦绕着你？', '老实说，最近怎么样？'],
    onboardTitle1: '把它安装成 App',
    onboardTitle2: '拖动滑块，感受你的情绪',
    onboardBody2: '凭感觉拖动三个滑块——没有对错，只是留意当下真实的感受。情绪词会随之变化，它们只是一面镜子，不是需要"答对"的题目。',
    onboardTitle3: '聊一聊（可选）',
    onboardBody3: '在设置中开启"使用本地 AI"，即可在记录心情前先和 AI 伙伴聊聊你的一天。它能帮你留意并说出你的感受，并对比聊天前后的状态变化。',
    onboardSkip: '跳过', onboardNext: '下一步', onboardDone: '知道了', onboardAgain: '重新查看教程',
  },
};

export const EMOTION_BANK = [
  { en: 'Content', zh: '满足', poetic: 'a held breath, released', poeticZh: '一口气，终于放下', tv: 0.5, ta: -0.35, td: 0.25 },
  { en: 'Happy', zh: '开心', poetic: 'sunlight through the window', poeticZh: '洒进来的阳光', tv: 0.65, ta: 0.1, td: 0.35 },
  { en: 'Elated', zh: '欣喜', poetic: 'light spilling over', poeticZh: '溢出的光', tv: 0.8, ta: 0.5, td: 0.5 },
  { en: 'Euphoric', zh: '狂喜', poetic: 'sky wide open', poeticZh: '豁然开朗的天空', tv: 0.9, ta: 0.75, td: 0.6 },
  { en: 'Relaxed', zh: '放松', poetic: 'shoulders finally down', poeticZh: '肩膀终于放下', tv: 0.45, ta: -0.5, td: 0.2 },
  { en: 'Calm', zh: '平静', poetic: 'still water, no ripple', poeticZh: '静水无波', tv: 0.5, ta: -0.6, td: 0.35 },
  { en: 'Serene', zh: '宁静', poetic: 'a held silence', poeticZh: '一片安然的寂静', tv: 0.55, ta: -0.7, td: 0.5 },
  { en: 'Uneasy', zh: '不安', poetic: 'grey static under the skin', poeticZh: '皮下的灰色静电', tv: -0.25, ta: 0.3, td: -0.35 },
  { en: 'Anxious', zh: '焦虑', poetic: 'a tightening chest', poeticZh: '收紧的胸口', tv: -0.35, ta: 0.55, td: -0.4 },
  { en: 'Apprehensive', zh: '忧虑', poetic: 'static behind the ribs', poeticZh: '肋骨后的静电', tv: -0.4, ta: 0.5, td: -0.5 },
  { en: 'Fearful', zh: '恐惧', poetic: 'the floor tilting', poeticZh: '地板在倾斜', tv: -0.55, ta: 0.7, td: -0.65 },
  { en: 'Irritated', zh: '恼怒', poetic: 'sand in the gears', poeticZh: '齿轮里的沙', tv: -0.4, ta: 0.4, td: 0.15 },
  { en: 'Frustrated', zh: '挫败', poetic: 'a locked door, no key', poeticZh: '锁住的门，没有钥匙', tv: -0.45, ta: 0.45, td: -0.15 },
  { en: 'Angry', zh: '愤怒', poetic: 'heat rising in the throat', poeticZh: '喉咙里升起的热', tv: -0.6, ta: 0.65, td: 0.3 },
  { en: 'Resentful', zh: '怨恨', poetic: 'a slow burn, banked', poeticZh: '压住的余烬', tv: -0.6, ta: 0.15, td: 0.35 },
  { en: 'Wistful', zh: '惆怅', poetic: 'a door left ajar', poeticZh: '半掩的门', tv: -0.15, ta: -0.2, td: -0.3 },
  { en: 'Drained', zh: '疲惫', poetic: 'the tide gone out', poeticZh: '退潮之后', tv: -0.3, ta: -0.6, td: -0.5 },
  { en: 'Numb', zh: '麻木', poetic: 'static on an empty channel', poeticZh: '空频道里的雪花', tv: -0.1, ta: -0.7, td: -0.6 },
  { en: 'Confident', zh: '自信', poetic: 'a steady hand', poeticZh: '稳住的手', tv: 0.4, ta: 0.2, td: 0.7 },
  { en: 'Proud', zh: '自豪', poetic: 'standing a little taller', poeticZh: '挺直的脊背', tv: 0.55, ta: 0.35, td: 0.75 },
  { en: 'Grateful', zh: '感激', poetic: 'warmth passed forward', poeticZh: '传递的暖意', tv: 0.6, ta: -0.1, td: 0.3 },
  { en: 'Satisfied', zh: '满意', poetic: 'the click of a finished puzzle', poeticZh: '拼图归位的一声轻响', tv: 0.5, ta: -0.1, td: 0.4 },
  { en: 'Capable', zh: '得心应手', poetic: 'hands that know the motion', poeticZh: '熟悉的手感', tv: 0.35, ta: 0.15, td: 0.6 },
  { en: 'Energetic', zh: '充满活力', poetic: 'current running through the limbs', poeticZh: '四肢里流动的电流', tv: 0.5, ta: 0.7, td: 0.4 },
  { en: 'Loved', zh: '被爱着', poetic: 'a name held gently', poeticZh: '被轻轻记住的名字', tv: 0.6, ta: -0.1, td: -0.1 },
  { en: 'Tender', zh: '温柔', poetic: 'a hand cupped around a flame', poeticZh: '手掌护着的火苗', tv: 0.5, ta: -0.2, td: 0.1 },
  { en: 'Accomplished', zh: '成就感', poetic: 'the last box checked', poeticZh: '划掉的最后一项', tv: 0.55, ta: 0.15, td: 0.55 },
  { en: 'Inspired', zh: '振奋', poetic: 'a spark catching', poeticZh: '火星点燃', tv: 0.6, ta: 0.5, td: 0.35 },
  { en: 'Determined', zh: '坚定', poetic: 'teeth set, eyes forward', poeticZh: '咬紧牙关向前看', tv: 0.2, ta: 0.4, td: 0.65 },
  { en: 'Surprised', zh: '惊讶', poetic: 'the ground shifting slightly', poeticZh: '地面微微一晃', tv: 0.05, ta: 0.6, td: -0.1 },
  { en: 'Overwhelmed', zh: '不堪重负', poetic: 'too many hands, not enough arms', poeticZh: '手不够用了', tv: -0.4, ta: 0.5, td: -0.7 },
  { en: 'Disgusted', zh: '厌恶', poetic: 'a taste that won’t leave', poeticZh: '挥之不去的味道', tv: -0.65, ta: 0.3, td: 0.1 },
  { en: 'Bothered', zh: '心烦', poetic: 'a pebble in the shoe', poeticZh: '鞋里的石子', tv: -0.3, ta: 0.25, td: -0.1 },
  { en: 'Contemptuous', zh: '轻蔑', poetic: 'looking down a long nose', poeticZh: '眼角的一瞥', tv: -0.35, ta: 0.2, td: 0.6 },
  { en: 'Helpless', zh: '无助', poetic: 'hands tied behind the back', poeticZh: '被反绑的双手', tv: -0.55, ta: 0.2, td: -0.75 },
  { en: 'Ashamed', zh: '羞愧', poetic: 'wanting to fold inward', poeticZh: '想把自己折起来', tv: -0.5, ta: 0.1, td: -0.55 },
  { en: 'Guilty', zh: '内疚', poetic: 'a weight under the sternum', poeticZh: '压在胸骨下方的重量', tv: -0.45, ta: 0.15, td: -0.3 },
  { en: 'Inadequate', zh: '不够好', poetic: 'always one step short', poeticZh: '总是差一步', tv: -0.5, ta: 0.05, td: -0.6 },
  { en: 'Apathetic', zh: '提不起劲', poetic: 'a low hum, nothing more', poeticZh: '只剩微弱的嗡鸣', tv: -0.2, ta: -0.55, td: -0.2 },
  { en: 'Confused', zh: '困惑', poetic: 'a map with no north', poeticZh: '没有指北的地图', tv: -0.1, ta: 0.35, td: -0.3 },
  { en: 'Ambivalent', zh: '矛盾', poetic: 'a fork in the road, both paths fading', poeticZh: '岔路口，两条路都在变淡', tv: -0.05, ta: 0.1, td: -0.15 },
  { en: 'Lonely', zh: '孤独', poetic: 'a room too large for one', poeticZh: '空得过大的房间', tv: -0.45, ta: -0.3, td: -0.4 },
  { en: 'Jealous', zh: '嫉妒', poetic: 'a green thread pulling tight', poeticZh: '一根收紧的绿线', tv: -0.35, ta: 0.4, td: 0.1 },
  { en: 'Mistrustful', zh: '多疑', poetic: 'checking the lock twice', poeticZh: '反复检查的门锁', tv: -0.25, ta: 0.3, td: 0.15 },
];

export function infoHtml(axis, lang) {
  const kw = (text, cls) => `<span class="${cls}">${text}</span>`;
  const baseStyle = "font:italic 15.5px 'EB Garamond',serif;line-height:1.8;color:rgba(232,224,255,.72)";
  if (axis === 'v') {
    if (lang === 'zh')
      return `<div style="${baseStyle}">衡量你情感的<span style="font-weight:400;font-style:normal">整体好坏</span>。<br>代表你内心的舒适度。<br>你现在是感到 ${kw('积极、愉悦、快乐', 'kw-amber')}，还是 ${kw('消极、痛苦、难受', 'kw-tobacco')}？</div>`;
    return `<div style="${baseStyle}">The overall quality of your emotion.<br>It measures your inner comfort.<br>Is your current mood ${kw('Positive, pleasant, and joyful', 'kw-amber')}, or is it ${kw('negative, distressing, and uncomfortable', 'kw-tobacco')}?</div>`;
  }
  if (axis === 'a') {
    if (lang === 'zh')
      return `<div style="${baseStyle}">衡量你身体和<span style="font-weight:400;font-style:normal">精神的能量水平</span>。<br>你现在是处于 ${kw('高度警觉、兴奋、紧张', 'kw-crimson')} 的状态，<br>还是感到 ${kw('放松、平静、甚至疲倦', 'kw-indigo')}？</div>`;
    return `<div style="${baseStyle}">Your physical and mental energy level.<br>Are you ${kw('highly alert, excited, or tense', 'kw-crimson')},<br>or do you feel ${kw('deeply relaxed, calm, sluggish, or sleepy', 'kw-indigo')} right now?</div>`;
  }
  if (axis === 'd') {
    if (lang === 'zh')
      return `<div style="${baseStyle}">衡量你对当下环境的<span style="font-weight:400;font-style:normal">掌控感</span>。<br>你是觉得自己 ${kw('充满自信、能说了算', 'kw-olive')}，<br>还是感到 ${kw('无能为力', 'kw-rock')}、被环境压得喘不过气？</div>`;
    return `<div style="${baseStyle}">Your sense of influence and control.<br>Do you feel ${kw('confident, empowered, and in charge', 'kw-olive')},<br>or do you feel ${kw('restricted, helpless, overwhelmed', 'kw-rock')}?</div>`;
  }
  return '';
}
