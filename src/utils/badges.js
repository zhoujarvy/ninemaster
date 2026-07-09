// 勋章定义（星尘碎片）
// 类别分组便于展示
export const BADGE_DEFS = [
  // —— 启蒙 / 探索 ——
  { id: 'opened-table', icon: '👀', name: '好奇宝宝', desc: '打开了九九总表', color: 'bg-blue-100', group: '探索' },
  { id: 'first-correct', icon: '🌱', name: '初露锋芒', desc: '第一次答对题目', color: 'bg-green-100', group: '探索' },
  { id: 'opened-badges', icon: '🧭', name: '探险家', desc: '查看了星尘碎片', color: 'bg-cyan-100', group: '探索' },

  // —— 连击里程碑 ——
  { id: 'streak-combo-5', icon: '⚡', name: '小闪电', desc: '连击达到 5 次', color: 'bg-yellow-100', group: '连击' },
  { id: 'streak-combo-10', icon: '🔥', name: '连击高手', desc: '连击达到 10 次', color: 'bg-orange-100', group: '连击' },
  { id: 'streak-combo-20', icon: '💥', name: '连击大师', desc: '连击达到 20 次', color: 'bg-red-100', group: '连击' },

  // —— 得分挑战 ——
  { id: 'perfect-10', icon: '💯', name: '全对大师', desc: '一次答对 10 道题', color: 'bg-purple-100', group: '挑战' },
  { id: 'perfect-20', icon: '🌟', name: '二十连胜', desc: '一次答对 20 道题', color: 'bg-indigo-100', group: '挑战' },
  { id: 'score-50', icon: '💰', name: '金币小富翁', desc: '单次闯关获得 50 金币', color: 'bg-amber-100', group: '挑战' },

  // —— 坚持打卡 ——
  { id: 'streak-3', icon: '🔥', name: '坚持三天', desc: '连续三天打开应用', color: 'bg-orange-100', group: '坚持' },
  { id: 'streak-7', icon: '📅', name: '一周达人', desc: '连续七天打开应用', color: 'bg-pink-100', group: '坚持' },
  { id: 'streak-14', icon: '🌙', name: '半月勇士', desc: '连续十四天打开应用', color: 'bg-violet-100', group: '坚持' },

  // —— 单元征服 ——
  { id: 'unit-1-done', icon: '1️⃣', name: '一的小主人', desc: '完成 1 的口诀', color: 'bg-yellow-100', group: '单元' },
  { id: 'unit-2-done', icon: '2️⃣', name: '二的小主人', desc: '完成 2 的口诀', color: 'bg-yellow-100', group: '单元' },
  { id: 'unit-3-done', icon: '3️⃣', name: '三的小主人', desc: '完成 3 的口诀', color: 'bg-yellow-100', group: '单元' },
  { id: 'unit-4-done', icon: '4️⃣', name: '四的小主人', desc: '完成 4 的口诀', color: 'bg-yellow-100', group: '单元' },
  { id: 'unit-5-done', icon: '5️⃣', name: '五的小主人', desc: '完成 5 的口诀', color: 'bg-yellow-100', group: '单元' },
  { id: 'unit-6-done', icon: '6️⃣', name: '六的小主人', desc: '完成 6 的口诀', color: 'bg-yellow-100', group: '单元' },
  { id: 'unit-7-done', icon: '7️⃣', name: '七的小主人', desc: '完成 7 的口诀', color: 'bg-yellow-100', group: '单元' },
  { id: 'unit-8-done', icon: '8️⃣', name: '八的小主人', desc: '完成 8 的口诀', color: 'bg-yellow-100', group: '单元' },
  { id: 'unit-9-done', icon: '9️⃣', name: '九的小主人', desc: '完成 9 的口诀', color: 'bg-yellow-100', group: '单元' },
  { id: 'all-units', icon: '🏆', name: '九九小达人', desc: '完成全部 9 个单元', color: 'bg-pink-100', group: '单元' },

  // —— 总对题数 ——
  { id: 'correct-100', icon: '🎖️', name: '百题先锋', desc: '累计答对 100 题', color: 'bg-teal-100', group: '成就' },
  { id: 'correct-500', icon: '🏅', name: '题海小侠', desc: '累计答对 500 题', color: 'bg-emerald-100', group: '成就' },
  { id: 'correct-1000', icon: '👑', name: '乘法王者', desc: '累计答对 1000 题', color: 'bg-rose-100', group: '成就' }
]

export function getBadgeDef(id) {
  return BADGE_DEFS.find((b) => b.id === id)
}
