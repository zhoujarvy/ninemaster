// 勋章定义
export const BADGE_DEFS = [
  { id: 'opened-table', icon: '👀', name: '好奇宝宝', desc: '打开了九九总表', color: 'bg-blue-100' },
  { id: 'first-correct', icon: '🌱', name: '初露锋芒', desc: '第一次答对题目', color: 'bg-green-100' },
  { id: 'unit-1-done', icon: '1️⃣', name: '一的小主人', desc: '完成 1 的口诀练习', color: 'bg-yellow-100' },
  { id: 'streak-3', icon: '🔥', name: '坚持三天', desc: '连续三天打开应用', color: 'bg-orange-100' },
  { id: 'perfect-10', icon: '💯', name: '全对大师', desc: '一次答对 10 道题', color: 'bg-purple-100' },
  { id: 'all-units', icon: '🏆', name: '九九小达人', desc: '完成全部 9 个单元', color: 'bg-pink-100' }
]

export function getBadgeDef(id) {
  return BADGE_DEFS.find((b) => b.id === id)
}
