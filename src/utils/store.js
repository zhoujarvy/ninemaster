// 基于 localStorage 的状态存储
const PREFIX = 'ninemaster:'

// 深合并: 用 defaults 填充 target 中缺失的字段
// 用于版本升级时给旧 state 补齐新增字段的默认值
function mergeDefaults(target, defaults) {
  if (target == null) return JSON.parse(JSON.stringify(defaults))
  if (typeof target !== 'object' || typeof defaults !== 'object') return target
  const result = { ...target }
  for (const k of Object.keys(defaults)) {
    if (!(k in result)) {
      result[k] = JSON.parse(JSON.stringify(defaults[k]))
    } else if (
      typeof result[k] === 'object' && typeof defaults[k] === 'object'
      && !Array.isArray(result[k]) && !Array.isArray(defaults[k])
    ) {
      result[k] = mergeDefaults(result[k], defaults[k])
    }
  }
  return result
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw == null) return JSON.parse(JSON.stringify(fallback))
    const parsed = JSON.parse(raw)
    // 合并默认值，确保新增字段存在（版本兼容）
    return mergeDefaults(parsed, fallback)
  } catch {
    return JSON.parse(JSON.stringify(fallback))
  }
}

function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.warn('写入本地存储失败', e)
  }
}

const DEFAULT_STATE = {
  coins: 0,
  badges: [],
  wrongBook: [],
  parentPassword: '1688',  // 家长面板密码，默认 1688，可在面板内修改
  // 每个单元的最佳成绩: { 0: { bestStreak, bestScore }, 1: {...}, ... }
  // 0 = 混合单元
  bestRecords: {},
  // 全局最佳记录
  bestStreak: 0,
  bestScore: 0,
  // 累计练习时长（秒）
  totalPracticeSeconds: 0,
  stats: {
    totalAnswered: 0,
    totalCorrect: 0,
    unitProgress: {},
    lastOpenDate: null,
    streakDays: 0
  }
}

export const store = {
  state: read('state', DEFAULT_STATE),

  save() {
    write('state', this.state)
  },

  addCoins(n) {
    this.state.coins += n
    this.save()
  },

  addWrong(item) {
    // 归一化为小数在前，便于去重（3x4 和 4x3 视为同一题）
    const a = Math.min(item.a, item.b)
    const b = Math.max(item.a, item.b)
    const key = `${a}x${b}`
    const exists = this.state.wrongBook.find((w) => w.key === key)
    if (exists) {
      exists.count += 1
      exists.lastAt = Date.now()
    } else {
      this.state.wrongBook.push({ key, a, b, count: 1, lastAt: Date.now() })
    }
    this.save()
  },

  removeWrong(key) {
    this.state.wrongBook = this.state.wrongBook.filter((w) => w.key !== key)
    this.save()
  },

  recordAnswer(unit, correct) {
    this.state.stats.totalAnswered += 1
    if (correct) this.state.stats.totalCorrect += 1
    const p = this.state.stats.unitProgress[unit] || { answered: 0, correct: 0 }
    p.answered += 1
    if (correct) p.correct += 1
    this.state.stats.unitProgress[unit] = p
    // 连续打卡
    const today = new Date().toISOString().slice(0, 10)
    if (this.state.stats.lastOpenDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      this.state.stats.streakDays = this.state.stats.lastOpenDate === yesterday
        ? this.state.stats.streakDays + 1
        : 1
      this.state.stats.lastOpenDate = today
    }
    this.save()
  },

  grantBadge(id) {
    if (!this.state.badges.includes(id)) {
      this.state.badges.push(id)
      this.save()
      return true
    }
    return false
  },

  setParentPassword(pwd) {
    this.state.parentPassword = pwd
    this.save()
  },

  // 记录本次闯关的连击和得分，返回是否打破记录
  recordRun(unit, streak, score, durationSeconds = 0) {
    const prev = this.state.bestRecords[unit] || { bestStreak: 0, bestScore: 0 }
    const beatStreak = streak > prev.bestStreak
    const beatScore = score > prev.bestScore
    this.state.bestRecords[unit] = {
      bestStreak: Math.max(prev.bestStreak, streak),
      bestScore: Math.max(prev.bestScore, score)
    }
    // 全局最佳
    let beatGlobalStreak = false
    if (streak > this.state.bestStreak) {
      this.state.bestStreak = streak
      beatGlobalStreak = true
    }
    if (score > this.state.bestScore) {
      this.state.bestScore = score
    }
    // 累计时长
    if (durationSeconds > 0) {
      this.state.totalPracticeSeconds += durationSeconds
    }
    this.save()
    return {
      beatStreak,      // 本次是否打破该单元连击记录
      beatScore,       // 本次是否打破该单元得分记录
      beatGlobalStreak // 是否打破全局连击记录
    }
  },

  getBestRecord(unit) {
    return this.state.bestRecords[unit] || { bestStreak: 0, bestScore: 0 }
  }
}
