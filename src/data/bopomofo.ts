export interface BopomofoItem {
  symbol: string;
  pinyin: string;
  word: string;
  emoji: string;
  ttsHint: string;
}

export const bopomofoData: BopomofoItem[] = [
  { symbol: 'ㄅ', pinyin: 'b', word: '包子', emoji: '🥟', ttsHint: '玻' },
  { symbol: 'ㄆ', pinyin: 'p', word: '蘋果', emoji: '🍎', ttsHint: '坡' },
  { symbol: 'ㄇ', pinyin: 'm', word: '貓咪', emoji: '🐱', ttsHint: '摸' },
  { symbol: 'ㄈ', pinyin: 'f', word: '飛機', emoji: '✈️', ttsHint: '佛' },
  { symbol: 'ㄉ', pinyin: 'd', word: '大象', emoji: '🐘', ttsHint: '得' },
  { symbol: 'ㄊ', pinyin: 't', word: '兔子', emoji: '🐰', ttsHint: '特' },
  { symbol: 'ㄋ', pinyin: 'n', word: '鳥兒', emoji: '🐦', ttsHint: '呢' },
  { symbol: 'ㄌ', pinyin: 'l', word: '老虎', emoji: '🐯', ttsHint: '勒' },
  { symbol: 'ㄍ', pinyin: 'g', word: '狗狗', emoji: '🐶', ttsHint: '哥' },
  { symbol: 'ㄎ', pinyin: 'k', word: '恐龍', emoji: '🦖', ttsHint: '科' },
  { symbol: 'ㄏ', pinyin: 'h', word: '猴子', emoji: '🐒', ttsHint: '喝' },
  { symbol: 'ㄐ', pinyin: 'j', word: '機器人', emoji: '🤖', ttsHint: '機' },
  { symbol: 'ㄑ', pinyin: 'q', word: '企鵝', emoji: '🐧', ttsHint: '七' },
  { symbol: 'ㄒ', pinyin: 'x', word: '西瓜', emoji: '🍉', ttsHint: '西' },
];
