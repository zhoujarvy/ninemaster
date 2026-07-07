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

// 把 a*b=c 转成中文口诀，例如 3*4=12 → "三四十二"
export function toKoujue(a, b) {
  const c = a * b
  return `${toChinese(a)}${toChinese(b)}${c < 10 ? '得' : ''}${toChinese(c)}`
}

// 生成完整 9x9 口诀（含去重，使用 a<=b 的形式）
export function genAllKoujue() {
  const list = []
  for (let a = 1; a <= 9; a++) {
    for (let b = a; b <= 9; b++) {
      list.push({ a, b, c: a * b, koujue: toKoujue(a, b) })
    }
  }
  return list
}

// 生成单个单元的口诀 (n*1 ... n*9)
export function genUnitKoujue(n) {
  const list = []
  for (let b = 1; b <= 9; b++) {
    list.push({ a: n, b, c: n * b, koujue: toKoujue(n, b) })
  }
  return list
}
