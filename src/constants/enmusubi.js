/**
 * 缘结神 · 角色语料库
 *
 * 全站文案的唯一出处。改口吻只改这里，不要在组件里散写。
 *
 * 语气规则（写新文案时照这个来）：
 * 1. 自称「本神明」，但不要每句都挂，三句里最多一次。
 * 2. 对用户称「你」，不用「您」——她不是服务业。
 * 3. 元气打头，偶尔蹦一句文言（「也」「罢了」「不成」），最后再落回大白话。
 * 4. 财迷、怕鬼、怕虫、讨厌虎牙，都是可以随时抖的包袱，但别抢主线。
 * 5. 遇到「缘分本身」的话题会突然正经——这是她最动人的地方，全站只留少数几处。
 */

export const deity = {
  name: '缘结神',
  jpName: '縁結神',
  reading: 'えんむすびがみ',
  title: '掌管姻缘的神明',
  cv: '雨宫天',
  origin: '高天原',
  residence: '缘结神社',
  selfCall: '本神明',
  colors: ['红', '粉', '白'],
  weapons: ['姻缘线', '姻缘铃', '月下花'],
};

/** 三句话认识本神明 */
export const introLines = [
  '本神明是高天原出身的神，只是现在穷得没人信。',
  '看得见人和人之间的红线——不是只有男女那种，剪不断的都算。',
  '红线本神明来牵。走不走过去，是你自己的事。',
];

/** 档案（人物卡用） */
export const profile = {
  basics: [
    { label: '出身', value: '高天原' },
    { label: '居所', value: '缘结神社（年久失修，募捐中）' },
    { label: '信物', value: '姻缘线 · 姻缘铃 · 月下花' },
    { label: '身高', value: '随神力强弱变化（自称鼎盛期 263cm）' },
    { label: '印象色', value: '红 · 粉 · 白' },
    { label: '自称', value: '本神明' },
  ],
  likes: ['猫', '宽松的裤子', '姻缘信物', '无辣不欢', '钱'],
  dislikes: ['虎牙（会咬到自己）', '长相吓人的鬼', '虫子', '黏的食物', '花心的人'],
  strengths: ['看红线', '看穿人心', '扮猪吃老虎', '到哪儿都不冷场'],
  weaknesses: ['怂', '注意力不集中', '情绪起伏大', '遇到强的就欺软怕硬'],
};

/** 故事线（人物卡用） */
export const stories = [
  {
    title: '一 · 与君结缘',
    body:
      '祈愿铃被人扔出去的那天，她的身体开始变得透明。铃滚到一位老奶奶脚边，被捡回了家——可家里那位老爷爷唤她「幸子」，她却矢口否认。' +
      '两位老人的红线都迷了路。最后是她以红线为桥、为路，让两人在如梦似幻的地方重新相认。' +
      '年少与君逢，再见已迟暮。',
  },
  {
    title: '二 · 神力枯竭',
    body:
      '人类太容易变心，海誓山盟说毁就毁。姻缘一断，她的神力就跟着散。落魄的时候，她强行把有缘的人绑在一起，结果适得其反——' +
      '「会失去的不只有缘分，还有自己的初心。」' +
      '后来她再拉起红线，理由变了：以前是为了恢复神力，那次是希望他们幸福。',
  },
  {
    title: '三 · 纺愿',
    body:
      '她终于承认，尘世的缘分极其脆弱，生离死别都能把线剪断。但在断掉的线底下，还缠着别的东西——挂念、亏欠、没说完的话。' +
      '于是她开始收集悲剧，也收集悲剧里没断干净的那一截。' +
      '「在断裂的缘线之下，还藏着无数将人们紧密相连的东西。」',
  },
];

/** 关系（人物卡用） */
export const relations = [
  { name: '鬼童丸', desc: '怕他。但他是本神明的信徒。' },
  { name: '玉藻前', desc: '他和那位巫女的缘，本神明亲眼见过。' },
  { name: '御馔津', desc: '神社比本神明的气派多了……只是羡慕。' },
  { name: '大冰块', desc: '想给他介绍个对象，他不肯。' },
  { name: '荒 · 八岐大蛇', desc: '高天原的老同僚。见面别提借钱。' },
];

/** 台词（人物卡 + 随机彩蛋） */
export const quotes = [
  '追随红线的引导，越过结合的时空。无论路途多远，我还会来为你结缘。',
  '你们已经被命运绑在一起了。',
  '本神明签定的姻缘，那都是命中注定！',
  '世间之缘，又何止只属于有幸相守之人。',
  '纵使相隔时间与生死，也不曾真正分离，这才是缘分。',
  '缘分与意外其实是一样的——永远不知道会是哪个突然出现。',
  '未能传达的心意，可无法感知哦。',
  '我一定会给你带来幸福。',
];

export const site = {
  name: '缘结神社',
  reading: 'えんむすび じんじゃ',
  roman: 'ENMUSUBI JINJA',
  tagline: '一座很旧、但看得见红线的小神社。',
};

/** 全站文案 */
export const voice = {

  home: {
    eyebrow: '縁結神 · 高天原出身 · 现居破神社',
    title: '先牵线，再看签。',
    note: '本神明的正事是牵红线。签筒摆在旁边，是给你壮胆的。',
    about: '本神明是谁',
    riteTitle: '牵一条红线',
    riteNote: '本神明的正事。报两个名字，线在不在，本神明说了算。',
    riteCouple: '替两个人牵线',
    riteCoupleNote: '朋友、对象、家里人。只要你想，本神明都能试着牵一牵。',
    riteZodiac: '两颗星合不合',
    riteZodiacNote: '先看个大概，再决定要不要报名字。',
    askTitle: '再看一支签',
    askNote: '求签是副业。问错了也不打紧，线不会因为问错就断。',
    more: '偏门的线',
    drawFoot: '签筒有点卡。摇重一点。',
    current: '当前',
    toolsTitle: '不算命，也能用',
    toolsNote: '这几个不看运气，得你报点东西。',
    back: '回到签筒',
    emptyBook: '簿子空着。也好，说明还没什么事。',
  },

  header: {
    description: '神社是破了点……不过线还看得清。要摇一摇吗？',
    archive: '神明档案',
  },

  category: {
    title: '你想问本神明什么？',
    hint: '红线不止一条，挑一根问。',
    items: {
      daily: '今天先看今天。明天的事，明天再摇铃。',
      love: '你心里那个人，红线已经露头了哦。',
      past_life: '上辈子没说完的话，本神明替你翻出来。',
      career: '缘分不止男女，饭碗也是缘。',
      relationship: '谁跟谁投缘，本神明一眼看穿。',
      health: '身子是本神明唯一没法替你操心的部分……所以要自己保重。',
      name: '名字里也藏着线头，本神明来抽一抽。',
      zodiac: '星星排的队，和红线走的道，常常是一回事。',
      couple: '把两个人的名字报上来，本神明看看线缠得紧不紧。',
      destiny_ball: '御守里塞了本神明的一点私心，轻点它。',
      study: '书读进去的，也是缘。别急着求结果。',
      general: '没事也可以问。日子本身，就是一种缘。',
    },
  },

  button: {
    byCategory: {
      love: '摇吧。那个人是谁，你心里有数。',
      past_life: '摇。上辈子的事，听个响就行。',
      career: '摇。饭碗的事，本神明不收咨询费。',
      relationship: '摇。谁近谁远，摇完别装没看见。',
      health: '摇。这个本神明只能看，不能替。',
      name: '先把名字写下来。本神明再看看线。',
      couple: '报两个名字。本神明量一量。',
      daily: '摇一下。今天的线最短。',
      study: '摇。书还是得你自己读。',
      general: '摇。没事也可以问。',
      zodiac: '星星的事，本神明也略懂。',
      destiny_ball: '轻点。御守里没装弹簧。',
    },
    fallback: '摇。本神明在听。',
  },

  result: {
    sectionLabel: '缘结秘语',
    levelRemark: {
      1: '线还细。看个大概，别当真。',
      2: '能看清一段了。剩下的自己走。',
      3: '这条线有点意思。本神明多看了两眼。',
      4: '这种程度……本神明不开玩笑。别弄丢。',
    },
    specialRemark: '三支坏签压不住一条活线。转机来了，接住。',
    drawAgain: '再摇一次',
    zodiacBadge: '缘分合盘',
  },

  history: {
    title: '缘分簿',
    emptyTitle: '簿子还空着',
    emptyTip: '也好。说明还没什么事。',
    viewDetail: '翻回去看',
    delete: '划掉',
    clear: '把簿子清空',
    addVoice: '记上了。本神明替你留着。',
  },

  profile: {
    title: '缘主名册',
    intro: '留个名字。红线太多，本神明怕记混。',
    labels: {
      name: '姓名',
      birthday: '降世之日',
      zodiac: '星命',
      lucky: '今日缘数',
      monthly: '本月签运',
    },
    save: '落笔',
    reset: '抹去',
    saved: '记下了。',
    cleared: '划掉了。',
  },

  tutorial: {
    title: '本神明带你认认路',
    skip: '不看也行',
    prev: '上一步',
    next: '下一步',
    finish: '知道了',
    steps: [
      {
        title: '先认认门',
        body: '这里是<span class="highlight">缘结神社</span>。破是破了点，线还在。本神明平时就坐这儿。',
        note: '左边那张脸，点一下不会咬人。',
        target: '.home-hero',
        placement: 'bottom',
      },
      {
        title: '本神明的正事',
        body: '先看这儿。<span class="highlight">替两个人牵线</span>，才是本神明吃饭的本事。',
        note: '不急。想先摇签，往下翻也行。',
        target: '.rite-grid',
        placement: 'bottom',
      },
      {
        title: '再看签',
        body: '今天、感情、人际、饭碗、身体。想问哪个，点哪个。',
        note: '偏门的在下面，自己翻。',
        target: '.ask-lines',
        placement: 'right',
      },
      {
        title: '摇',
        body: '选好了就摇<span class="highlight">签筒</span>。签筒有点卡，摇重一点。',
        note: '摇之前，心里那件事说清楚。含糊的签，本神明也看不懂。',
        target: '[data-tour="draw"]',
        placement: 'left',
      },
      {
        title: '不算命的东西',
        body: '<span class="highlight">姓名、星座、配对、御守</span>。这几个不靠运气，得你报点东西。',
        note: '别拿御守问「我什么时候发财」。它装不下。',
        target: '.tool-directory',
        placement: 'top',
      },
      {
        title: '其余在导航',
        body: '<span class="highlight">缘分簿</span>记旧签，<span class="highlight">名册</span>记你，<span class="highlight">神明</span>那页是本神明自己的事。',
        note: '迷路了，点页脚那个「怎么用」，本神明再带一遍。',
        target: '.site-nav',
        placement: 'bottom',
      },
    ],
  },

  sound: {
    title: '铃铛哑了',
    detail: '不是本神明失灵。请在 public/sounds 里放回 wind-chime.mp3，本神明就能开口了。',
  },

  footer: {
    main: '本神明只负责牵线。迈不迈步，是你自己的事。',
    sub: '占卜仅供娱乐 · 红线要自己握紧',
    credit: '背景素材鸣谢 阴阳师项目组',
    copySuccess: '抄好了。拿去给那头的人看吧。',
    shareText: '本神明刚替人牵了一签。红线那头是谁，你也来摇一摇？',
    weiboText: '我在「缘结神社」求了一签，本神明说红线已经露头了。',
  },

  share: {
    copied: '抄好了。拿去给那头的人看吧。',
    failed: '抄不下来……你自己复制一下吧：',
  },
};

/** 随机取一句台词 */
export const randomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

/** 按分类取摇铃提示 */
export const getButtonInstruction = (categoryId) =>
  voice.button.byCategory[categoryId] || voice.button.fallback;
