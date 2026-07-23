export const TEXT = {
  en: {
    home: 'Home', record: 'Record', journal: 'Journal', phase: 'Phase Space', pad: 'PAD', score: 'Score', log: 'Log Now',
    v: 'Valence', a: 'Arousal', d: 'Dominance', now: 'Now', suggested: 'Emotion Words',
    overallScore: 'Overall Score (1–10)', note: 'Note (optional)', notePlaceholder: 'What brought this on...',
    save: 'Save Entry', today: 'Today', yesterday: 'Yesterday', thisweek: 'This Week', earlier: 'Earlier',
    emptyTrail: 'No entries yet — Log Now to begin your trail', emptyChart: 'Log your first entry to see trends',
    emptyJournal: 'No entries yet.', streakLabel: '{days}-day streak', export: 'Export CSV', untitled: 'Untitled', showMore: 'Show more', showLess: 'Show less',
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
    chatThinking: 'Thinking…', wrapUp: 'Wrap up', retry: 'Retry', backToChat: 'Back to conversation',
    addingToNote: 'Adding to note…', clear: 'Clear',
    chatCapReached: 'Long enough for now — tap Wrap up to check in.',
    afterReadingTitle: 'How do you feel now?', before: 'Before', after: 'After', viewConversation: 'View conversation',
    includeConversation: 'Save this conversation with the entry', conversationTitle: '— Talk it through conversation —',
    chatMe: 'Me', chatCompanion: 'Companion', aiSummaryPrefix: '(AI Summary)', savingEntry: 'Saving…',
    chatGuidance: 'Just talk — say whatever comes to mind, without editing yourself. When you tap Wrap up, your conversation will be summarized for you. This is a supportive space, not therapy or medical advice — if you\'re in crisis, please reach out to a professional or crisis line.',
    chatOpeningFraming: 'There\'s no right or wrong here — just say whatever comes to mind, however small. We\'ll check back on how you feel once we\'re done.',
    chatOpeningQuestions: ['What\'s on your mind right now?', 'What\'s present for you today?', 'Is there something sitting with you right now?', 'What\'s been on your mind lately?', 'How are things, really?'],
    onboardTitle1: 'Install it like an app',
    onboardTitle2: 'Rate how you feel',
    onboardBody2: 'Drag the three sliders by feel — no rules, just notice what feels true right now. Watch the emotion words shift as you go; they\'re a mirror for what you\'re already dialing in, not something to get right.',
    onboardTitle3: 'Talk it through (optional)',
    onboardBody3: 'Turn on "Use local AI" in Settings to talk through your day with an AI companion before logging your mood. It helps you notice and name what you\'re feeling, then compares how you felt before and after.',
    onboardSkip: 'Skip', onboardNext: 'Next', onboardPrev: 'Previous', onboardDone: 'Got it', onboardAgain: 'View tutorial again',
    readingReferences: 'Reading References', referencesIntro: 'PAD Tracker is built on established affective-science research, not invented terminology. Here\'s what it draws on.',
    milestoneToast: '{n} entries — you showed up. ✦',
    milestoneProgress: '{current} / {next} entries',
  },
  zh: {
    home: '主页', record: '记录', journal: '日志', phase: '相空间', pad: '情绪三轴', score: '总分', log: '记录情绪',
    v: '愉悦度', a: '唤醒度', d: '支配度', now: '当前', suggested: '情绪词',
    overallScore: '总体评分 (1–10)', note: '备注（可选）', notePlaceholder: '是什么引发的...',
    save: '保存记录', today: '今天', yesterday: '昨天', thisweek: '本周', earlier: '较早',
    emptyTrail: '暂无记录 — 点击"记录情绪"开始你的轨迹', emptyChart: '记录第一条情绪以查看趋势',
    emptyJournal: '暂无记录。', streakLabel: '{days}连击', export: '导出 CSV', untitled: '未命名', showMore: '展开更多', showLess: '收起',
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
    chatThinking: '思考中…', wrapUp: '结束对话', retry: '重试', backToChat: '返回对话',
    addingToNote: '正在添加到备注…', clear: '清空',
    chatCapReached: '先聊到这里 — 点击"结束对话"来记录当下的心情。',
    afterReadingTitle: '现在感觉如何？', before: '之前', after: '之后', viewConversation: '查看对话',
    includeConversation: '将这段对话保存到记录中', conversationTitle: '— 聊一聊对话记录 —',
    chatMe: '我', chatCompanion: '伙伴', aiSummaryPrefix: '（AI 摘要）', savingEntry: '保存中…',
    chatGuidance: '想到什么就说什么，不用先组织语言。准备好后点击"结束对话"，你的对话会被总结。这里是一个支持性的空间，并非心理治疗或医疗建议 — 如果你正处于危机中，请联系专业人士或危机热线。',
    chatOpeningFraming: '这里没有对错，想到什么就说什么，不需要想好了再说。聊完之后，我们会再看看你的感受有没有变化。',
    chatOpeningQuestions: ['现在你在想什么？', '今天有什么一直放在心里吗？', '此刻，你在意的是什么？', '最近有什么事一直萦绕着你？', '老实说，最近怎么样？'],
    onboardTitle1: '把它安装成 App',
    onboardTitle2: '拖动滑块，感受你的情绪',
    onboardBody2: '凭感觉拖动三个滑块——没有对错，只是留意当下真实的感受。情绪词会随之变化，它们只是一面镜子，不是需要"答对"的题目。',
    onboardTitle3: '聊一聊（可选）',
    onboardBody3: '在设置中开启"使用本地 AI"，即可在记录心情前先和 AI 伙伴聊聊你的一天。它能帮你留意并说出你的感受，并对比聊天前后的状态变化。',
    onboardSkip: '跳过', onboardNext: '下一步', onboardPrev: '上一步', onboardDone: '知道了', onboardAgain: '重新查看教程',
    readingReferences: '参考文献', referencesIntro: 'PAD Tracker 建立在成熟的情感科学研究之上，而非凭空创造的术语。以下是它所依据的文献。',
    milestoneToast: '{n} 条记录 — 你做到了。✦',
    milestoneProgress: '{current} / {next} 条',
  },
};

export const REFERENCES = [
  {
    cite: 'Mehrabian, A., & Russell, J. A. (1974). An Approach to Environmental Psychology. MIT Press.',
    note_en: 'Origin of the Pleasure-Arousal-Dominance (PAD) model this entire app is built on.',
    note_zh: '本应用所依据的愉悦度-唤醒度-支配度（PAD）模型的最初来源。',
  },
  {
    cite: 'Russell, J. A. (1980). A circumplex model of affect. Journal of Personality and Social Psychology, 39(6), 1161-1178.',
    note_en: 'The circular Valence/Arousal structure behind the Phase Space cube and chart.',
    note_zh: '相空间立方体与图表所依据的愉悦度/唤醒度环形结构模型。',
  },
  {
    cite: 'Bradley, M. M., & Lang, P. J. (1994). Measuring emotion: The Self-Assessment Manikin and the Semantic Differential. Journal of Behavior Therapy and Experimental Psychiatry, 25(1), 49-59.',
    note_en: 'Basis for the Overall Score (1-10) rating as a self-assessed pleasure/wellbeing scale.',
    note_zh: '"总体评分（1-10）"作为自评愉悦度/幸福感量表的依据。',
  },
  {
    cite: 'Warriner, A. B., Kuperman, V., & Brysbaert, M. (2013). Norms of valence, arousal, and dominance for 13,915 English lemmas. Behavior Research Methods, 45, 1191-1207.',
    note_en: 'Affective norms used to calibrate the coordinates of all 110 words in the Emotion Words bank.',
    note_zh: '用于校准情绪词库中全部 110 个词坐标的情感常模数据。',
  },
  {
    cite: 'Bradley, M. M., & Lang, P. J. (1999). Affective Norms for English Words (ANEW). University of Florida.',
    note_en: 'Earlier affective-norms dataset cross-referenced during word calibration.',
    note_zh: '在情绪词校准过程中交叉参考的早期情感常模数据集。',
  },
  {
    cite: 'Ekman, P. (1999). Basic Emotions. In T. Dalgleish & M. Power (Eds.), Handbook of Cognition and Emotion.',
    note_en: 'Basic-emotion families used to check coverage and intensity gradients (e.g. fear -> dread -> terrified -> panicked).',
    note_zh: '用于检查情绪词覆盖范围与强度梯度（如恐惧→忧惧→惊恐→惊慌）的基本情绪分类框架。',
  },
  {
    cite: 'Plutchik, R. (2001). The nature of emotions. American Scientist, 89(4), 344-350.',
    note_en: 'Wheel-of-emotions structure used to check commonly-confused pairs stay distinct (e.g. Envious vs. Jealous).',
    note_zh: '用于确保易混淆情绪词（如"羡慕"与"嫉妒"）保持区分的情绪之轮结构。',
  },
  {
    cite: 'Fredrickson, B. L. (2001). The role of positive emotions in positive psychology: The broaden-and-build theory. American Psychologist, 56(3), 218-226.',
    note_en: 'Informed the positive-emotion words added when the bank was expanded (Relieved, Awe, and others).',
    note_zh: '在情绪词库扩充时用于指导积极情绪词（如"如释重负""敬畏"等）的加入。',
  },
  {
    cite: 'Larsen, R. J., & Diener, E. (1987). Affect intensity as an individual difference characteristic: A review. Journal of Research in Personality, 21(1), 1-39.',
    note_en: 'Basis for treating self-reported intensity as a distinct signal from emotional position, explored for future score-based ranking.',
    note_zh: '将自评情绪强度视为独立于情绪位置的信号，为未来基于评分的排序机制提供理论依据。',
  },
  {
    cite: 'Frijda, N. H. (1986). The Emotions. Cambridge University Press.',
    note_en: 'Appraisal-theory basis for the Dominance-axis correction: anger and contempt are approach-motivated (not low-dominance), unlike fear and shame.',
    note_zh: '支配度轴校正的评价理论依据：愤怒与轻蔑属于趋近动机（并非低支配度），区别于恐惧与羞耻。',
  },
];

// Coordinates (tv/ta/td) are research-informed approximations calibrated
// against ANEW (Bradley & Lang 1999) / Warriner et al. (2013), Russell's
// circumplex, and appraisal-theory dominance. See emotion-lexicon-research.md
// at the project root for each word's dictionary + psychological definition
// and the rationale for its placement. Key correction vs. an intuitive
// bank: negative emotions are NOT uniformly low-dominance — anger/contempt
// are approach-motivated (positive/neutral D) while fear/helplessness/shame
// are avoidance-motivated (deep-negative D).
export const EMOTION_BANK = [
  // Pleasant · low arousal (contentment)
  { en: 'Content', zh: '满足', poetic: 'a held breath, released', poeticZh: '一口气，终于放下', tv: 0.6, ta: -0.38, td: 0.25 },
  { en: 'Calm', zh: '平静', poetic: 'still water, no ripple', poeticZh: '静水无波', tv: 0.4, ta: -0.55, td: 0.2 },
  { en: 'Relaxed', zh: '放松', poetic: 'shoulders finally down', poeticZh: '肩膀终于放下', tv: 0.5, ta: -0.63, td: 0.25 },
  { en: 'Serene', zh: '宁静', poetic: 'a held silence', poeticZh: '一片安然的寂静', tv: 0.45, ta: -0.6, td: 0.23 },
  { en: 'Peaceful', zh: '安宁', poetic: 'a room breathing slowly', poeticZh: '缓慢呼吸的房间', tv: 0.55, ta: -0.6, td: 0.3 },
  { en: 'Comfortable', zh: '自在', poetic: 'worn-in and warm', poeticZh: '穿旧了的温度', tv: 0.5, ta: -0.45, td: 0.3 },
  { en: 'Safe', zh: '安心', poetic: 'a door that locks from inside', poeticZh: '从里面锁上的门', tv: 0.55, ta: -0.4, td: 0.35 },
  { en: 'Grateful', zh: '感激', poetic: 'warmth passed forward', poeticZh: '传递的暖意', tv: 0.65, ta: -0.13, td: 0.13 },
  { en: 'Tender', zh: '温柔', poetic: 'a hand cupped around a flame', poeticZh: '手掌护着的火苗', tv: 0.5, ta: -0.3, td: 0.13 },
  { en: 'Sleepy', zh: '困倦', poetic: 'eyelids growing heavy', poeticZh: '眼皮渐渐沉下来', tv: 0.15, ta: -0.75, td: -0.05 },
  // Pleasant · high arousal (joy / vitality)
  { en: 'Happy', zh: '开心', poetic: 'sunlight through the window', poeticZh: '洒进来的阳光', tv: 0.8, ta: 0.25, td: 0.4 },
  { en: 'Excited', zh: '兴奋', poetic: 'the morning of a trip', poeticZh: '出发那天的清晨', tv: 0.7, ta: 0.65, td: 0.4 },
  { en: 'Elated', zh: '欣喜', poetic: 'light spilling over', poeticZh: '溢出的光', tv: 0.72, ta: 0.5, td: 0.45 },
  { en: 'Euphoric', zh: '狂喜', poetic: 'sky wide open', poeticZh: '豁然开朗的天空', tv: 0.82, ta: 0.7, td: 0.4 },
  { en: 'Energetic', zh: '充满活力', poetic: 'current running through the limbs', poeticZh: '四肢里流动的电流', tv: 0.38, ta: 0.55, td: 0.2 },
  { en: 'Playful', zh: '俏皮', poetic: 'skipping a stone', poeticZh: '打水漂', tv: 0.6, ta: 0.45, td: 0.4 },
  { en: 'Amused', zh: '逗乐', poetic: 'a laugh caught off guard', poeticZh: '冷不防笑出声', tv: 0.6, ta: 0.35, td: 0.35 },
  { en: 'Hopeful', zh: '充满希望', poetic: 'a lightening in the east', poeticZh: '东方渐白', tv: 0.55, ta: 0.2, td: 0.3 },
  { en: 'Curious', zh: '好奇', poetic: 'a door slightly open', poeticZh: '微微开着的门', tv: 0.45, ta: 0.4, td: 0.3 },
  { en: 'Awed', zh: '惊叹', poetic: 'standing under a wide sky', poeticZh: '站在辽阔的天空下', tv: 0.6, ta: 0.4, td: 0.05 },
  { en: 'Inspired', zh: '振奋', poetic: 'a spark catching', poeticZh: '火星点燃', tv: 0.65, ta: 0.3, td: 0.35 },
  { en: 'Loved', zh: '被爱着', poetic: 'a name held gently', poeticZh: '被轻轻记住的名字', tv: 0.83, ta: 0.08, td: 0.15 },
  // Pleasant · high dominance (mastery / pride)
  { en: 'Confident', zh: '自信', poetic: 'a steady hand', poeticZh: '稳住的手', tv: 0.58, ta: 0.08, td: 0.63 },
  { en: 'Empowered', zh: '有力量', poetic: 'the wheel in your hands', poeticZh: '方向盘握在手里', tv: 0.55, ta: 0.35, td: 0.65 },
  { en: 'Proud', zh: '自豪', poetic: 'standing a little taller', poeticZh: '挺直的脊背', tv: 0.73, ta: 0.2, td: 0.55 },
  { en: 'Focused', zh: '专注', poetic: 'the world narrowed to one point', poeticZh: '世界收拢成一点', tv: 0.35, ta: 0.3, td: 0.55 },
  { en: 'Motivated', zh: '有动力', poetic: 'an engine turning over', poeticZh: '引擎发动', tv: 0.5, ta: 0.4, td: 0.5 },
  { en: 'Optimistic', zh: '乐观', poetic: 'betting on tomorrow', poeticZh: '押注明天', tv: 0.6, ta: 0.15, td: 0.4 },
  { en: 'Capable', zh: '得心应手', poetic: 'hands that know the motion', poeticZh: '熟悉的手感', tv: 0.45, ta: 0.08, td: 0.45 },
  { en: 'Determined', zh: '坚定', poetic: 'teeth set, eyes forward', poeticZh: '咬紧牙关向前看', tv: 0.38, ta: 0.25, td: 0.5 },
  { en: 'Accomplished', zh: '成就感', poetic: 'the last box checked', poeticZh: '划掉的最后一项', tv: 0.63, ta: 0.15, td: 0.45 },
  { en: 'Satisfied', zh: '满意', poetic: 'the click of a finished puzzle', poeticZh: '拼图归位的一声轻响', tv: 0.6, ta: -0.05, td: 0.4 },
  // Near centre · mixed / neutral
  { en: 'Nostalgic', zh: '怀旧', poetic: 'an old song, half-remembered', poeticZh: '半记得的旧歌', tv: 0.15, ta: -0.15, td: -0.05 },
  { en: 'Reflective', zh: '沉思', poetic: 'watching rain on glass', poeticZh: '看雨落在玻璃上', tv: 0.05, ta: -0.25, td: 0.05 },
  { en: 'Ambivalent', zh: '矛盾', poetic: 'a fork in the road, both paths fading', poeticZh: '岔路口，两条路都在变淡', tv: -0.13, ta: -0.13, td: -0.18 },
  { en: 'Restless', zh: '坐立不安', poetic: 'pacing a small room', poeticZh: '在小屋里踱步', tv: -0.2, ta: 0.5, td: -0.1 },
  // Unpleasant · high arousal · low dominance (fear / anxiety)
  { en: 'Uneasy', zh: '不安', poetic: 'grey static under the skin', poeticZh: '皮下的灰色静电', tv: -0.38, ta: 0.13, td: -0.25 },
  { en: 'Nervous', zh: '紧张', poetic: 'butterflies before the bell', poeticZh: '铃响前的心慌', tv: -0.35, ta: 0.5, td: -0.3 },
  { en: 'Anxious', zh: '焦虑', poetic: 'a tightening chest', poeticZh: '收紧的胸口', tv: -0.43, ta: 0.33, td: -0.33 },
  { en: 'Worried', zh: '担忧', poetic: 'circling the same thought', poeticZh: '反复绕着同一个念头', tv: -0.4, ta: 0.35, td: -0.3 },
  { en: 'Apprehensive', zh: '忧虑', poetic: 'static behind the ribs', poeticZh: '肋骨后的静电', tv: -0.4, ta: 0.2, td: -0.35 },
  { en: 'Insecure', zh: '没底', poetic: "ground that won't hold still", poeticZh: '站不稳的地面', tv: -0.4, ta: 0.2, td: -0.45 },
  { en: 'Vulnerable', zh: '脆弱', poetic: 'skin without its shell', poeticZh: '卸了壳的皮肤', tv: -0.35, ta: 0.15, td: -0.5 },
  { en: 'Fearful', zh: '恐惧', poetic: 'the floor tilting', poeticZh: '地板在倾斜', tv: -0.68, ta: 0.45, td: -0.55 },
  { en: 'Panicked', zh: '惊慌', poetic: 'the exits all shrinking', poeticZh: '所有出口都在缩小', tv: -0.6, ta: 0.7, td: -0.6 },
  { en: 'Overwhelmed', zh: '不堪重负', poetic: 'too many hands, not enough arms', poeticZh: '手不够用了', tv: -0.53, ta: 0.3, td: -0.63 },
  { en: 'Confused', zh: '困惑', poetic: 'a map with no north', poeticZh: '没有指北的地图', tv: -0.35, ta: 0.05, td: -0.35 },
  { en: 'Surprised', zh: '惊讶', poetic: 'the ground shifting slightly', poeticZh: '地面微微一晃', tv: 0.13, ta: 0.6, td: -0.18 },
  // Unpleasant · high arousal · higher dominance (anger)
  { en: 'Irritated', zh: '恼怒', poetic: 'sand in the gears', poeticZh: '齿轮里的沙', tv: -0.48, ta: 0.13, td: 0.05 },
  { en: 'Annoyed', zh: '烦躁', poetic: "a fly that won't leave", poeticZh: '赶不走的苍蝇', tv: -0.4, ta: 0.3, td: 0.0 },
  { en: 'Impatient', zh: '不耐烦', poetic: 'tapping a stopped clock', poeticZh: '敲打停摆的钟', tv: -0.3, ta: 0.4, td: 0.15 },
  { en: 'Frustrated', zh: '挫败', poetic: 'a locked door, no key', poeticZh: '锁住的门，没有钥匙', tv: -0.55, ta: 0.2, td: -0.18 },
  { en: 'Angry', zh: '愤怒', poetic: 'heat rising in the throat', poeticZh: '喉咙里升起的热', tv: -0.65, ta: 0.5, td: 0.13 },
  { en: 'Resentful', zh: '怨恨', poetic: 'a slow burn, banked', poeticZh: '压住的余烬', tv: -0.58, ta: -0.13, td: 0.0 },
  { en: 'Disgusted', zh: '厌恶', poetic: 'a taste that won’t leave', poeticZh: '挥之不去的味道', tv: -0.63, ta: 0.05, td: 0.0 },
  { en: 'Contemptuous', zh: '轻蔑', poetic: 'looking down a long nose', poeticZh: '眼角的一瞥', tv: -0.5, ta: -0.13, td: 0.25 },
  { en: 'Jealous', zh: '嫉妒', poetic: 'a green thread pulling tight', poeticZh: '一根收紧的绿线', tv: -0.63, ta: 0.25, td: -0.25 },
  { en: 'Bothered', zh: '心烦', poetic: 'a pebble in the shoe', poeticZh: '鞋里的石子', tv: -0.4, ta: -0.05, td: -0.13 },
  { en: 'Mistrustful', zh: '多疑', poetic: 'checking the lock twice', poeticZh: '反复检查的门锁', tv: -0.43, ta: -0.05, td: 0.0 },
  // Unpleasant · low arousal (sadness / depletion)
  { en: 'Wistful', zh: '惆怅', poetic: 'a door left ajar', poeticZh: '半掩的门', tv: -0.2, ta: -0.38, td: -0.2 },
  { en: 'Bored', zh: '无聊', poetic: 'a clock with nowhere to be', poeticZh: '无处可去的时钟', tv: -0.35, ta: -0.55, td: -0.15 },
  { en: 'Sad', zh: '难过', poetic: "rain that won't lift", poeticZh: '停不下来的雨', tv: -0.6, ta: -0.15, td: -0.35 },
  { en: 'Disappointed', zh: '失望', poetic: 'a promise gone quiet', poeticZh: '沉默下来的承诺', tv: -0.5, ta: -0.15, td: -0.25 },
  { en: 'Discouraged', zh: '气馁', poetic: 'a hill that keeps growing', poeticZh: '越走越高的坡', tv: -0.5, ta: -0.2, td: -0.4 },
  { en: 'Regretful', zh: '懊悔', poetic: 'rewinding the same moment', poeticZh: '反复倒带的一刻', tv: -0.45, ta: -0.05, td: -0.3 },
  { en: 'Melancholy', zh: '忧郁', poetic: 'dusk that lingers', poeticZh: '迟迟不散的黄昏', tv: -0.45, ta: -0.4, td: -0.3 },
  { en: 'Drained', zh: '疲惫', poetic: 'the tide gone out', poeticZh: '退潮之后', tv: -0.45, ta: -0.63, td: -0.38 },
  { en: 'Numb', zh: '麻木', poetic: 'static on an empty channel', poeticZh: '空频道里的雪花', tv: -0.38, ta: -0.7, td: -0.38 },
  { en: 'Apathetic', zh: '提不起劲', poetic: 'a low hum, nothing more', poeticZh: '只剩微弱的嗡鸣', tv: -0.35, ta: -0.6, td: -0.3 },
  { en: 'Lonely', zh: '孤独', poetic: 'a room too large for one', poeticZh: '空得过大的房间', tv: -0.68, ta: -0.3, td: -0.43 },
  { en: 'Heartbroken', zh: '心碎', poetic: 'something set down, gone', poeticZh: '放下之后，空了', tv: -0.75, ta: 0.1, td: -0.5 },
  { en: 'Hopeless', zh: '绝望', poetic: 'a tunnel with no far end', poeticZh: '望不到头的隧道', tv: -0.75, ta: -0.1, td: -0.6 },
  // Unpleasant · self-conscious (shame · deep low dominance)
  { en: 'Ashamed', zh: '羞愧', poetic: 'wanting to fold inward', poeticZh: '想把自己折起来', tv: -0.63, ta: -0.13, td: -0.5 },
  { en: 'Embarrassed', zh: '尴尬', poetic: 'warmth climbing the neck', poeticZh: '爬上脖颈的热', tv: -0.4, ta: 0.3, td: -0.35 },
  { en: 'Guilty', zh: '内疚', poetic: 'a weight under the sternum', poeticZh: '压在胸骨下方的重量', tv: -0.6, ta: -0.05, td: -0.35 },
  { en: 'Inadequate', zh: '不够好', poetic: 'always one step short', poeticZh: '总是差一步', tv: -0.6, ta: -0.2, td: -0.5 },
  { en: 'Rejected', zh: '被拒之门外', poetic: 'a door closing softly', poeticZh: '轻轻关上的门', tv: -0.6, ta: 0.15, td: -0.5 },
  { en: 'Helpless', zh: '无助', poetic: 'hands tied behind the back', poeticZh: '被反绑的双手', tv: -0.68, ta: -0.13, td: -0.68 },

  // ── Expanded set II (2026-07-21) — intensity variants + established
  // taxonomy positions (Ekman Atlas of Emotions families, Plutchik wheel,
  // Fredrickson positive-emotion set). Same calibration method. ──
  // Pleasant · low arousal (relief / comfort / trust)
  { en: 'Relieved', zh: '如释重负', poetic: 'a weight set down', poeticZh: '一块石头落地', tv: 0.55, ta: -0.1, td: 0.25 },
  { en: 'Reassured', zh: '放下心来', poetic: 'a hand on the shoulder', poeticZh: '肩上一只手', tv: 0.5, ta: -0.3, td: 0.25 },
  { en: 'Trusting', zh: '信任', poetic: 'leaving the door unlocked', poeticZh: '门没有上锁', tv: 0.5, ta: -0.2, td: 0.15 },
  { en: 'Cozy', zh: '温暖惬意', poetic: 'a blanket and the rain outside', poeticZh: '一床被子，窗外落雨', tv: 0.55, ta: -0.5, td: 0.25 },
  { en: 'Blissful', zh: '幸福', poetic: 'warm all the way through', poeticZh: '从里到外的暖', tv: 0.85, ta: 0.1, td: 0.35 },
  { en: 'Refreshed', zh: '神清气爽', poetic: 'cold water on the face', poeticZh: '一捧凉水泼在脸上', tv: 0.55, ta: -0.05, td: 0.35 },
  { en: 'Humbled', zh: '谦卑', poetic: 'smaller under the stars', poeticZh: '星空下变小了', tv: 0.35, ta: -0.05, td: 0.05 },
  // Pleasant · high arousal (eagerness / fascination)
  { en: 'Eager', zh: '跃跃欲试', poetic: 'leaning toward the start line', poeticZh: '身子探向起跑线', tv: 0.5, ta: 0.55, td: 0.45 },
  { en: 'Enthusiastic', zh: '热情高涨', poetic: 'two feet already running', poeticZh: '双脚已经跑起来', tv: 0.6, ta: 0.6, td: 0.45 },
  { en: 'Fascinated', zh: '着迷', poetic: 'the rest of the room going quiet', poeticZh: '周围渐渐安静下来', tv: 0.5, ta: 0.45, td: 0.25 },
  { en: 'Enchanted', zh: '陶醉', poetic: 'held by a slow song', poeticZh: '被一首慢歌接住', tv: 0.6, ta: 0.25, td: 0.05 },
  // Pleasant · high dominance
  { en: 'Smug', zh: '自鸣得意', poetic: 'a cat with the cream', poeticZh: '偷到奶油的猫', tv: 0.3, ta: 0.1, td: 0.5 },
  // Near centre · mixed
  { en: 'Bittersweet', zh: '百感交集', poetic: 'the last good day of something', poeticZh: '美好事物的最后一天', tv: 0.05, ta: -0.05, td: 0.0 },
  { en: 'Longing', zh: '渴望', poetic: 'a light left on across the water', poeticZh: '隔水亮着的一盏灯', tv: -0.1, ta: 0.15, td: -0.15 },
  { en: 'Sentimental', zh: '感怀', poetic: 'keeping the ticket stub', poeticZh: '留着那张票根', tv: 0.2, ta: -0.1, td: 0.0 },
  // Unpleasant · high arousal · low dominance (fear intensities)
  { en: 'Dread', zh: '畏惧', poetic: 'a date circled in red', poeticZh: '日历上圈红的一天', tv: -0.55, ta: 0.3, td: -0.45 },
  { en: 'Terrified', zh: '惊恐', poetic: 'no ground under the next step', poeticZh: '下一步没有地面', tv: -0.75, ta: 0.6, td: -0.65 },
  { en: 'Startled', zh: '吓一跳', poetic: 'a door slamming behind you', poeticZh: '身后猛地关上的门', tv: -0.15, ta: 0.65, td: -0.25 },
  { en: 'Shocked', zh: '震惊', poetic: 'the news landing wrong', poeticZh: '消息砸下来', tv: -0.35, ta: 0.65, td: -0.3 },
  { en: 'Bewildered', zh: '茫然', poetic: "signs in a language you can't read", poeticZh: '满眼看不懂的路牌', tv: -0.35, ta: 0.25, td: -0.4 },
  // Unpleasant · high arousal · higher dominance (anger intensities / variants)
  { en: 'Furious', zh: '暴怒', poetic: 'the lid blown clean off', poeticZh: '盖子被掀翻', tv: -0.7, ta: 0.65, td: 0.2 },
  { en: 'Indignant', zh: '义愤', poetic: 'standing up too fast', poeticZh: '猛地站起身', tv: -0.4, ta: 0.4, td: 0.3 },
  { en: 'Envious', zh: '羡慕', poetic: 'watching from the fence', poeticZh: '隔着栅栏望过去', tv: -0.4, ta: 0.25, td: -0.2 },
  { en: 'Defensive', zh: '戒备', poetic: 'arms already crossed', poeticZh: '手臂已经抱起', tv: -0.3, ta: 0.35, td: 0.2 },
  { en: 'Cynical', zh: '愤世嫉俗', poetic: 'expecting the worst, out loud', poeticZh: '把最坏的预期说出口', tv: -0.35, ta: -0.1, td: 0.25 },
  // Unpleasant · low arousal (sadness intensities / variants)
  { en: 'Sorrowful', zh: '悲伤', poetic: 'a slow grey afternoon', poeticZh: '缓慢的灰色午后', tv: -0.65, ta: -0.1, td: -0.4 },
  { en: 'Grieving', zh: '悲痛', poetic: 'an empty chair at the table', poeticZh: '桌边空着的椅子', tv: -0.78, ta: 0.05, td: -0.5 },
  { en: 'Miserable', zh: '痛苦', poetic: 'soaked through, far from home', poeticZh: '淋透了，离家还远', tv: -0.7, ta: -0.05, td: -0.4 },
  { en: 'Weary', zh: '身心俱疲', poetic: 'carrying it too long', poeticZh: '背得太久了', tv: -0.4, ta: -0.5, td: -0.3 },
  { en: 'Disillusioned', zh: '幻灭', poetic: 'the curtain pulled back', poeticZh: '幕布被拉开', tv: -0.5, ta: -0.15, td: -0.2 },
  // Unpleasant · self-conscious (shame variants)
  { en: 'Sheepish', zh: '不好意思', poetic: 'caught with a hand in the jar', poeticZh: '手还在罐子里被逮到', tv: -0.25, ta: 0.15, td: -0.25 },
  { en: 'Humiliated', zh: '屈辱', poetic: 'small in front of everyone', poeticZh: '当着所有人变得很小', tv: -0.7, ta: 0.3, td: -0.55 },
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
