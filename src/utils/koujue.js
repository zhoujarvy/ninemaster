// 中文数字转换
const cnNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

// 把 1-99 转成中文读法
export function toChinese(n) {
  if (n <= 10) return cnNums[n]
  if (n < 20) return '十' + cnNums[n - 10]
  const tens = Math.floor(n / 10)
  const ones = n % 10
  if (ones === 0) return cnNums[tens] + '十'
  return cnNums[tens] + '十' + cnNums[ones]
}

// 把 a*b=c 转成中文口诀（小九九，小数在前）
// 例：3,4 → "三四十二"；4,3 → 同样 "三四十二"
export function toKoujue(a, b) {
  const x = Math.min(a, b)
  const y = Math.max(a, b)
  const c = x * y
  return `${toChinese(x)}${toChinese(y)}${c < 10 ? '得' : ''}${toChinese(c)}`
}

// 归一化 (a,b) 为 (小,大)，便于错题去重、音频文件查找
export function normalizePair(a, b) {
  return [Math.min(a, b), Math.max(a, b)]
}

// 生成完整小九九口诀 (45 句，小数在前)
export function genAllKoujue() {
  const list = []
  for (let a = 1; a <= 9; a++) {
    for (let b = a; b <= 9; b++) {
      list.push({ a, b, c: a * b, koujue: toKoujue(a, b) })
    }
  }
  return list
}

// 生成单个单元的口诀（去重版）
// 单元 n 只展示 n×n, n×(n+1), ..., n×9
// 因为 n×1, n×2, ..., n×(n-1) 已在之前的单元学过（小九九规则）
// 例如：
//   单元 1: 1×1
//   单元 2: 2×2, 2×3, ..., 2×9
//   单元 6: 6×6, 6×7, 6×8, 6×9
//   单元 9: 9×9
export function genUnitKoujue(n) {
  const list = []
  for (let b = n; b <= 9; b++) {
    list.push({
      a: n,
      b,
      c: n * b,
      koujue: toKoujue(n, b)
    })
  }
  return list
}

// 获取单元 n 的口诀数量（用于 UI 提示）
// 单元 n 共 (10 - n) 句
export function unitCount(n) {
  return 10 - n
}
