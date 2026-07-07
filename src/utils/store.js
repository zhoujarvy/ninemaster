// 基于 localStorage 的状态存储
const PREFIX = 'ninemaster:'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
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
  }
}
