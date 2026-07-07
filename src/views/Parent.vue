<script setup>
import { ref, computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import Icon from '../components/Icon.vue'
import { store } from '../utils/store'

const unlocked = ref(false)
const input = ref('')
const errTip = ref('')

// 修改密码相关
const showChangePwd = ref(false)
const oldPwd = ref('')
const newPwd = ref('')
const newPwd2 = ref('')
const pwdTip = ref('')
const pwdTipType = ref('')  // 'ok' | 'err'

function tryUnlock() {
  if (input.value === store.state.parentPassword) {
    unlocked.value = true
    errTip.value = ''
    input.value = ''
  } else {
    errTip.value = '密码不对哦'
    input.value = ''
  }
}

function submitChangePwd() {
  if (oldPwd.value !== store.state.parentPassword) {
    pwdTip.value = '原密码不对'
    pwdTipType.value = 'err'
    return
  }
  if (!/^\d{4}$/.test(newPwd.value)) {
    pwdTip.value = '新密码必须是 4 位数字'
    pwdTipType.value = 'err'
    return
  }
  if (newPwd.value !== newPwd2.value) {
    pwdTip.value = '两次输入不一致'
    pwdTipType.value = 'err'
    return
  }
  store.setParentPassword(newPwd.value)
  pwdTip.value = '密码修改成功！'
  pwdTipType.value = 'ok'
  oldPwd.value = ''
  newPwd.value = ''
  newPwd2.value = ''
  setTimeout(() => {
    showChangePwd.value = false
    pwdTip.value = ''
  }, 1500)
}

const stats = store.state.stats
const accuracy = computed(() =>
  stats.totalAnswered ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0
)

function unitStat(n) {
  const p = stats.unitProgress[n]
  if (!p || !p.answered) return null
  return {
    answered: p.answered,
    correct: p.correct,
    accuracy: Math.round((p.correct / p.answered) * 100)
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(store.state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ninemaster-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function resetAll() {
  if (confirm('确定要清空所有进度吗？此操作不可撤销。')) {
    localStorage.removeItem('ninemaster:state')
    location.reload()
  }
}
</script>

<template>
  <div class="min-h-screen starfield">
    <NavBar title="家长面板" />
    <div class="relative z-10 p-4 max-w-md mx-auto">
      <!-- 密码门 -->
      <template v-if="!unlocked">
        <div class="text-center py-20">
          <div class="text-6xl mb-4 animate-float">🔐</div>
          <h2 class="text-xl font-display font-bold text-white mb-2">家长入口</h2>
          <p class="text-xs text-white/60 font-han mb-4">请输入密码（默认 1688）</p>
          <div class="flex justify-center">
            <input
              v-model="input"
              type="tel"
              inputmode="numeric"
              @keyup.enter="tryUnlock"
              placeholder="••••"
              class="bg-white/10 border-2 border-white/15 rounded-2xl px-5 py-3 text-center num-display text-2xl text-white w-44 tracking-widest focus:outline-none focus:border-candy-pink"
            />
          </div>
          <p v-if="errTip" class="text-candy-pink text-xs mt-2 font-han">{{ errTip }}</p>
          <div class="mt-5">
            <button
              @click="tryUnlock"
              class="bg-gradient-to-r from-candy-pink to-candy-lilac text-white font-display font-bold px-8 py-3 rounded-2xl btn-pop shadow-soft"
            >进入</button>
          </div>
        </div>
      </template>

      <!-- 数据面板 -->
      <template v-else>
        <h2 class="text-center text-base font-display font-bold text-white/95 mb-4">孩子学习概况</h2>

        <!-- 4 大数据 -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-gradient-to-br from-candy-pink/20 to-candy-pink/5 rounded-2xl p-4 border border-candy-pink/30">
            <div class="flex items-center justify-between">
              <Icon name="target" :size="20" color="#ff8fb1" />
              <span class="text-[10px] text-white/50 font-han">累计答题</span>
            </div>
            <div class="num-display text-3xl text-white mt-2">{{ stats.totalAnswered }}</div>
          </div>
          <div class="bg-gradient-to-br from-candy-mint/20 to-candy-mint/5 rounded-2xl p-4 border border-candy-mint/30">
            <div class="flex items-center justify-between">
              <Icon name="check" :size="20" color="#7eebc5" />
              <span class="text-[10px] text-white/50 font-han">正确率</span>
            </div>
            <div class="num-display text-3xl text-white mt-2">{{ accuracy }}<span class="text-base">%</span></div>
          </div>
          <div class="bg-gradient-to-br from-candy-lemon/20 to-candy-lemon/5 rounded-2xl p-4 border border-candy-lemon/30">
            <div class="flex items-center justify-between">
              <Icon name="flame" :size="20" color="#ffe066" />
              <span class="text-[10px] text-white/50 font-han">连续天数</span>
            </div>
            <div class="num-display text-3xl text-white mt-2">{{ stats.streakDays }}</div>
          </div>
          <div class="bg-gradient-to-br from-candy-lilac/20 to-candy-lilac/5 rounded-2xl p-4 border border-candy-lilac/30">
            <div class="flex items-center justify-between">
              <Icon name="star" :size="20" color="#c4a6ff" />
              <span class="text-[10px] text-white/50 font-han">金币</span>
            </div>
            <div class="num-display text-3xl text-white mt-2">{{ store.state.coins }}</div>
          </div>
        </div>

        <!-- 单元情况 -->
        <h3 class="text-sm font-display font-bold text-white/95 mb-2">各单元情况</h3>
        <div class="space-y-1.5 mb-5">
          <div
            v-for="n in 9"
            :key="n"
            class="bg-white/8 rounded-xl px-4 py-2.5 flex items-center justify-between border border-white/10"
          >
            <span class="font-display font-bold text-white text-base">{{ n }} 的口诀</span>
            <span v-if="unitStat(n)" class="text-sm font-han flex items-center gap-2">
              <span class="text-candy-mint">{{ unitStat(n).correct }}/{{ unitStat(n).answered }}</span>
              <span
                class="px-2 py-0.5 rounded-full text-xs font-bold"
                :class="unitStat(n).accuracy >= 80
                  ? 'bg-candy-mint/20 text-candy-mint'
                  : unitStat(n).accuracy >= 50
                    ? 'bg-candy-lemon/20 text-candy-lemon'
                    : 'bg-candy-pink/20 text-candy-pink'"
              >{{ unitStat(n).accuracy }}%</span>
            </span>
            <span v-else class="text-xs text-white/40 font-han">未练习</span>
          </div>
        </div>

        <!-- 错题 -->
        <h3 class="text-sm font-display font-bold text-white/95 mb-2">错题 ({{ store.state.wrongBook.length }})</h3>
        <div v-if="store.state.wrongBook.length" class="bg-white/8 rounded-xl p-3 border border-white/10 mb-5">
          <div v-for="w in store.state.wrongBook" :key="w.key" class="text-sm py-1.5 flex justify-between font-han">
            <span class="text-white/80">{{ w.a }} × {{ w.b }} = {{ w.a * w.b }}</span>
            <span class="text-candy-pink">错 {{ w.count }} 次</span>
          </div>
        </div>
        <div v-else class="text-sm text-white/40 font-han mb-5 text-center py-3">暂无错题</div>

        <!-- 操作按钮 -->
        <div class="space-y-2">
          <button
            @click="exportData"
            class="w-full flex items-center justify-center gap-2 bg-candy-sky/15 text-candy-sky py-3 rounded-2xl btn-pop border border-candy-sky/30 font-han"
          >
            <Icon name="download" :size="20" color="#7ec8ff" />
            <span>导出数据备份</span>
          </button>
          <button
            @click="showChangePwd = !showChangePwd"
            class="w-full flex items-center justify-center gap-2 bg-candy-lilac/15 text-candy-lilac py-3 rounded-2xl btn-pop border border-candy-lilac/30 font-han"
          >
            <Icon name="lock" :size="20" color="#c4a6ff" />
            <span>修改密码</span>
          </button>
          <button
            @click="resetAll"
            class="w-full bg-candy-pink/10 text-candy-pink/80 py-3 rounded-2xl btn-pop border border-candy-pink/20 font-han text-sm"
          >
            清空所有进度
          </button>
        </div>

        <!-- 修改密码面板 -->
        <div v-if="showChangePwd" class="mt-3 bg-white/8 rounded-2xl p-4 border border-white/10">
          <h4 class="font-display font-bold text-white mb-3">修改家长密码</h4>
          <div class="space-y-2">
            <input
              v-model="oldPwd"
              type="tel"
              inputmode="numeric"
              placeholder="原密码"
              class="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-white num-display tracking-widest focus:outline-none focus:border-candy-lilac"
            />
            <input
              v-model="newPwd"
              type="tel"
              inputmode="numeric"
              maxlength="4"
              placeholder="新密码（4 位数字）"
              class="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-white num-display tracking-widest focus:outline-none focus:border-candy-lilac"
            />
            <input
              v-model="newPwd2"
              type="tel"
              inputmode="numeric"
              maxlength="4"
              placeholder="再次输入新密码"
              class="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-white num-display tracking-widest focus:outline-none focus:border-candy-lilac"
            />
            <p v-if="pwdTip" class="text-xs font-han" :class="pwdTipType === 'ok' ? 'text-candy-mint' : 'text-candy-pink'">
              {{ pwdTip }}
            </p>
            <button
              @click="submitChangePwd"
              class="w-full bg-gradient-to-r from-candy-lilac to-candy-pink text-white py-2.5 rounded-xl btn-pop font-display font-bold"
            >
              确认修改
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
