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

// 生成单个单元的口诀
// 单元 n 包含所有含 n 的口诀，按小九九规则展示（小数在前）
// 例如单元 6: 1×6, 2×6, 3×6, 4×6, 5×6, 6×6, 6×7, 6×8, 6×9
export function genUnitKoujue(n) {
  const list = []
  for (let b = 1; b <= 9; b++) {
    const a = n
    const small = Math.min(a, b)
    const large = Math.max(a, b)
    list.push({
      a: small,
      b: large,
      c: a * b,
      koujue: toKoujue(a, b)  // toKoujue 内部已归一化
    })
  }
  return list
}
