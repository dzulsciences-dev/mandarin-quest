export type Phrase = {
  hanzi: string
  pinyin: string
  en: string
  ms: string
  kind: string
  example: string
  examplePinyin: string
  exampleEn: string
  exampleMs: string
  note?: string
  world: string
  icon: string
}

export const phrases: Phrase[] = [
  { hanzi: '买东西', pinyin: 'mǎi dōng xi', en: 'buy something', ms: 'beli barang', kind: 'Action phrase · standard Mandarin', example: '我要买这个。', examplePinyin: 'Wǒ yào mǎi zhège.', exampleEn: 'I want to buy this.', exampleMs: 'Saya nak beli yang ini.', note: '东西 (dōngxi) means “things/stuff” here; the second syllable is light.', world: 'Shopping & food', icon: '🛍️' },
  { hanzi: '帮我一下', pinyin: 'bāng wǒ yí xià', en: 'help me for a moment', ms: 'tolong saya sekejap', kind: 'Request · standard Mandarin', example: '你可以帮我一下吗？', examplePinyin: 'Nǐ kěyǐ bāng wǒ yí xià ma?', exampleEn: 'Could you help me for a moment?', exampleMs: 'Boleh tolong saya sekejap?', note: '一下 softens the request. 一 is pronounced yí here because it comes before the fourth-tone 下 (xià).', world: 'Social life', icon: '🤝' },
  { hanzi: '拍照', pinyin: 'pāi zhào', en: 'take a photo', ms: 'ambil gambar', kind: 'Action phrase · standard Mandarin', example: '可以帮我们拍照吗？', examplePinyin: 'Kěyǐ bāng wǒmen pāi zhào ma?', exampleEn: 'Could you take a photo for us?', exampleMs: 'Boleh tolong ambil gambar kami?', world: 'Social life', icon: '📸' },
  { hanzi: '等一下', pinyin: 'děng yí xià', en: 'wait a moment', ms: 'tunggu sekejap', kind: 'Everyday expression · standard Mandarin', example: '等一下，我去拿。', examplePinyin: 'Děng yí xià, wǒ qù ná.', exampleEn: 'Wait a moment, I’ll go get it.', exampleMs: 'Tunggu sekejap, saya pergi ambil.', world: 'Everyday actions', icon: '⏳' },
  { hanzi: '站在前面', pinyin: 'zhàn zài qián miàn', en: 'stand in front', ms: 'berdiri di depan', kind: 'Instruction · standard Mandarin', example: '请站在前面。', examplePinyin: 'Qǐng zhàn zài qián miàn.', exampleEn: 'Please stand in front.', exampleMs: 'Sila berdiri di depan.', world: 'Directions & movement', icon: '🧍' },
  { hanzi: '走过去', pinyin: 'zǒu guò qù', en: 'walk over there', ms: 'jalan ke sana', kind: 'Movement phrase · standard Mandarin', example: '我们走过去吧。', examplePinyin: 'Wǒmen zǒu guò qù ba.', exampleEn: 'Let’s walk over there.', exampleMs: 'Jom kita jalan ke sana.', note: '过去 points movement away from the speaker’s position; 过来 points toward the speaker.', world: 'Directions & movement', icon: '🚶' },
  { hanzi: '买这个', pinyin: 'mǎi zhège', en: 'buy this', ms: 'beli yang ini', kind: 'Verb + object · standard Mandarin', example: '你要买这个吗？', examplePinyin: 'Nǐ yào mǎi zhège ma?', exampleEn: 'Do you want to buy this?', exampleMs: 'Awak nak beli yang ini?', world: 'Shopping & food', icon: '🛒' },
  { hanzi: '找东西', pinyin: 'zhǎo dōng xi', en: 'look for something', ms: 'cari barang', kind: 'Action phrase · standard Mandarin', example: '我在找东西。', examplePinyin: 'Wǒ zài zhǎo dōng xi.', exampleEn: 'I’m looking for something.', exampleMs: 'Saya sedang cari barang.', world: 'Everyday actions', icon: '🔎' },
  { hanzi: '打电话', pinyin: 'dǎ diàn huà', en: 'make a phone call', ms: 'buat panggilan telefon', kind: 'Action phrase · standard Mandarin', example: '我想打电话给朋友。', examplePinyin: 'Wǒ xiǎng dǎ diàn huà gěi péng you.', exampleEn: 'I want to call a friend.', exampleMs: 'Saya nak telefon kawan.', world: 'Daily communication', icon: '📞' },
  { hanzi: '付钱', pinyin: 'fù qián', en: 'pay', ms: 'bayar', kind: 'Action phrase · standard Mandarin', example: '我来付钱。', examplePinyin: 'Wǒ lái fù qián.', exampleEn: 'I’ll pay.', exampleMs: 'Biar saya bayar.', world: 'Shopping & food', icon: '💳' },
  { hanzi: '带过来', pinyin: 'dài guò lái', en: 'bring it over here', ms: 'bawa ke sini', kind: 'Movement phrase · standard Mandarin', example: '请把菜单带过来。', examplePinyin: 'Qǐng bǎ cài dān dài guò lái.', exampleEn: 'Please bring the menu over.', exampleMs: 'Tolong bawa menu ke sini.', note: '过来 indicates movement toward the speaker. 把 marks the menu as the thing being brought.', world: 'Everyday actions', icon: '🧺' },
  { hanzi: '放进去', pinyin: 'fàng jìn qù', en: 'put it inside', ms: 'masukkan ke dalam', kind: 'Instruction · standard Mandarin', example: '请把这个放进去。', examplePinyin: 'Qǐng bǎ zhège fàng jìn qù.', exampleEn: 'Please put this inside.', exampleMs: 'Tolong masukkan yang ini.', note: '进去 means into a place away from the speaker. Use 进来 when the movement is toward you.', world: 'Everyday actions', icon: '📥' },
]

export const lessons = [
  { id: 'actions', world: 'Everyday Actions', title: 'Small actions, big help', subtitle: 'Wait, look for things & help out', icon: '⚡', color: 'lavender', duration: '5 min', phrases: [3, 7, 1], pattern: { form: '等一下，我去 + verb。', pinyin: 'Děng yí xià, wǒ qù + verb.', meaning: 'Wait a moment, I’ll go …', tip: 'Lepas 我去 (wǒ qù), tambah action: 拿 (ná, ambil), 看 (kàn, tengok), 买 (mǎi, beli).' } },
  { id: 'shopping', world: 'Shopping & Food', title: 'At the shop', subtitle: 'Say what you want to buy', icon: '🛍️', color: 'peach', duration: '6 min', phrases: [0, 6, 9], pattern: { form: '我要 + verb + object。', pinyin: 'Wǒ yào + verb + object.', meaning: 'I want to …', tip: 'Ganti action dan barang ikut situasi: 我要买这个 (I want to buy this), 我要这个 (I want this).' } },
  { id: 'directions', world: 'Directions & Movement', title: 'Move this way', subtitle: 'Simple directions & positions', icon: '🧭', color: 'mint', duration: '5 min', phrases: [4, 5, 10, 11], pattern: { form: '请 + action。', pinyin: 'Qǐng + action.', meaning: 'Please …', tip: '请 (qǐng) makes a polite request: 请站在前面 (please stand in front).' } },
  { id: 'social', world: 'Social Life', title: 'Friends help friends', subtitle: 'Ask for help & take a photo', icon: '📸', color: 'yellow', duration: '6 min', phrases: [1, 2, 8], pattern: { form: '你可以 + action + 吗？', pinyin: 'Nǐ kěyǐ + action + ma?', meaning: 'Could you …?', tip: 'Letak 吗 (ma) di hujung untuk jadikan soalan yes/no yang lembut.' } },
]

export const quizQuestions = [
  { type: 'Choose the meaning', prompt: '等一下', pinyin: 'děng yí xià', options: ['Wait a moment', 'Pay the bill', 'Walk over there', 'Take a photo'], answer: 'Wait a moment', hint: 'A friend at the mamak says this while they go to collect something.' },
  { type: 'Choose the Hanzi', prompt: 'Which phrase means “take a photo”?', options: ['买东西', '拍照', '找东西', '付钱'], answer: '拍照', hint: 'You might ask a friend to do this for your group photo.' },
  { type: 'Complete the sentence', prompt: '我想 ___ 给朋友。', pinyin: 'Wǒ xiǎng ___ gěi péng you.', options: ['打电话', '站在前面', '等一下', '放进去'], answer: '打电话', hint: 'I want to make a phone call to a friend.' },
  { type: 'Pick a natural reply', prompt: '可以帮我们拍照吗？', pinyin: 'Could you take a photo for us?', options: ['可以，没问题。', '我在找东西。', '请站在前面。', '我要买这个。'], answer: '可以，没问题。', hint: 'A friendly yes: “Sure, no problem.”' },
  { type: 'Choose the Pinyin', prompt: '站在前面', options: ['zhàn zài qián miàn', 'zhǎn zài qián miàn', 'zhàn zài qīng miàn', 'zhàn zhài qián miàn'], answer: 'zhàn zài qián miàn', hint: '站 zhàn is fourth tone; 前 qián is second tone.' },
  { type: 'Complete the request', prompt: '你可以帮我 ___ 吗？', pinyin: 'Nǐ kěyǐ bāng wǒ ___ ma?', options: ['一下', '这个', '东西', '前面'], answer: '一下', hint: '一下 (yí xià) softens the request: “for a moment / a little”.' },
  { type: 'Build the sentence', prompt: 'Arrange the idea: “I want to buy this.”', options: ['我要', '买', '这个'], answer: '我要买这个。', words: ['我要', '买', '这个'], hint: 'Start with 我要 (I want), then the action 买, then 这个 (this).' },
  { type: 'Fill the blank', prompt: '等一下，我去 ___。', pinyin: 'Wait a moment, I’ll go get it.', options: ['拿', '拍照', '付钱', '站'], answer: '拿', hint: '拿 (ná) means take / get / hold.' },
]
