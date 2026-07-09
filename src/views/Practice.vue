<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Fox from '../components/Fox.vue'
import Icon from '../components/Icon.vue'
import Confetti from '../components/Confetti.vue'
import { store } from '../utils/store'
import { speakEquation, speakPhrase } from '../utils/speech'
import { BADGE_DEFS } from '../utils/badges'

const router = useRouter()
const UNIT_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] // 0 = 混合

const selectedUnit = ref(0)
const started = ref(false)
const question = ref(null)
const options = ref([])
const lastPick = ref(null)
const feedback = ref(null) // 'correct' | 'wrong' | null
const streak = ref(0)
const correctCount = ref(0)
const wrongCount = ref(0)
const score = ref(0) // 本次得分（金币累计）
const confettiTrigger = ref(0)
const pickedIdx = ref(-1)
const wrongAnswerIdx = ref(-1) // 显示哪个是错的
const runStartTime = ref(0) // 本次闯关开始时间戳
const summary = ref(null) // 闯关结束总结：{ streak, score, correctCount, durationSec, beatStreak, beatScore, beatGlobalStreak }

const planetColors = ['#ff8fb1', '#ffb38a', '#ffe066', '#7eebc5', '#7ec8ff', '#c4a6ff', '#ff8c4a', '#ffd6b8', '#9be7e7']

// 当前单元的历史最佳
const bestRecord = computed(() => store.getBestRecord(selectedUnit.value))

function genQuestion() {
  let a, b
  if (selectedUnit.value === 0) {
    a = Math.floor(Math.random() * 9) + 1
    b = Math.floor(Math.random() * 9) + 1
  } else {
    // 单元模式：n 随机作被乘数或乘数，让孩子熟悉交换律
    const n = selectedUnit.value
    const other = Math.floor(Math.random() * 9) + 1
    if (Math.random() < 0.5) {
      a = n; b = other
    } else {
      a = other; b = n
    }
  }
  const answer = a * b
  const set = new Set([answer])
  while (set.size < 4) {
    const delta = Math.floor(Math.random() * 11) - 5
    const cand = Math.max(1, Math.min(81, answer + delta))
    set.add(cand)
  }
  const opts = Array.from(set).sort(() => Math.random() - 0.5)
  return { a, b, answer, key: `${a}x${b}` }
}

function start() {
  started.value = true
  streak.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  score.value = 0
  summary.value = null
  runStartTime.value = Date.now()
  next()
}

function next() {
  feedback.value = null
  lastPick.value = null
  pickedIdx.value = -1
  wrongAnswerIdx.value = -1
  question.value = genQuestion()
  const set = new Set([question.value.answer])
  while (set.size < 4) {
    const delta = Math.floor(Math.random() * 11) - 5
    const cand = Math.max(1, Math.min(81, question.value.answer + delta))
    set.add(cand)
  }
  options.value = Array.from(set).sort(() => Math.random() - 0.5)
}

function pick(val) {
  if (feedback.value) return
  lastPick.value = val
  const correct = val === question.value.answer
  feedback.value = correct ? 'correct' : 'wrong'
  store.recordAnswer(selectedUnit.value, correct)
  pickedIdx.value = options.value.indexOf(val)

  if (correct) {
    streak.value += 1
    correctCount.value += 1
    const gained = 1 + Math.floor(streak.value / 3)
    score.value += gained
    store.addCoins(gained)
    store.grantBadge('first-correct')
    // 连击里程碑
    if (streak.value >= 5) store.grantBadge('streak-combo-5')
    if (streak.value >= 10) store.grantBadge('streak-combo-10')
    if (streak.value >= 20) store.grantBadge('streak-combo-20')
    // 一次答对题数
    if (correctCount.value >= 10) store.grantBadge('perfect-10')
    if (correctCount.value >= 20) store.grantBadge('perfect-20')
    // 单次得分
    if (score.value >= 50) store.grantBadge('score-50')
    // 单元完成（任意单元 1-9 答对达到 9 次）
    if (selectedUnit.value > 0) {
      const p = store.state.stats.unitProgress[selectedUnit.value]
      if (p && p.correct >= 9) {
        store.grantBadge(`unit-${selectedUnit.value}-done`)
        // 检查是否全单元完成
        const allDone = [1, 2, 3, 4, 5, 6, 7, 8, 9].every((u) => {
          const up = store.state.stats.unitProgress[u]
          return up && up.correct >= 9
        })
        if (allDone) store.grantBadge('all-units')
      }
    }
    // 累计答对题数
    if (store.state.stats.totalCorrect >= 100) store.grantBadge('correct-100')
    if (store.state.stats.totalCorrect >= 500) store.grantBadge('correct-500')
    if (store.state.stats.totalCorrect >= 1000) store.grantBadge('correct-1000')
    confettiTrigger.value++
    speakEquation(question.value.a, question.value.b)
    if (streak.value >= 3 && streak.value % 3 === 0) {
      setTimeout(() => speakPhrase('correct_' + (Math.floor(Math.random() * 3) + 1)), 1300)
    }
  } else {
    streak.value = 0
    wrongCount.value += 1
    store.addWrong({ a: question.value.a, b: question.value.b })
    wrongAnswerIdx.value = options.value.indexOf(val)
    speakPhrase('wrong_1')
  }

  setTimeout(next, 1400)
}

// 结束本关：记录成绩，弹出总结
function finishRun() {
  const durationSec = Math.max(1, Math.round((Date.now() - runStartTime.value) / 1000))
  const result = store.recordRun(selectedUnit.value, streak.value, score.value, durationSec)
  summary.value = {
    streak: streak.value,
    score: score.value,
    correctCount: correctCount.value,
    wrongCount: wrongCount.value,
    durationSec,
    bestStreak: store.getBestRecord(selectedUnit.value).bestStreak,
    bestScore: store.getBestRecord(selectedUnit.value).bestScore,
    ...result
  }
}

function exit() {
  started.value = false
  summary.value = null
  router.push('/')
}

function playAgain() {
  summary.value = null
  start()
}

const foxMood = computed(() => {
  if (feedback.value === 'correct') return 'cheer'
  if (feedback.value === 'wrong') return 'sad'
  if (streak.value >= 3) return 'cheer'
  return 'happy'
})

const foxBubble = computed(() => {
  if (feedback.value === 'correct') {
    const msgs = ['答对了！', '真厉害！', '太聪明了！', '完美！']
    return msgs[Math.floor(Math.random() * msgs.length)]
  }
  if (feedback.value === 'wrong') return '再试一次！'
  if (streak.value >= 3) return '连击中！'
  return '加油哦~'
})

function optionClass(idx, val) {
  if (!feedback.value) return 'bg-white/12 border-white/10 text-white'
  if (val === question.value.answer) return 'bg-gradient-to-br from-candy-mint to-candy-sky border-candy-mint text-white scale-105'
  if (idx === wrongAnswerIdx.value) return 'bg-gradient-to-br from-candy-pink to-candy-peach border-candy-pink text-white animate-shake'
  return 'bg-white/8 border-white/10 text-white/40'
}
</script>

<template>
  <div class="min-h-screen starfield">
    <Confetti :trigger="confettiTrigger" />
    <NavBar title="闯关练习" />

    <div class="relative z-10 p-4 max-w-md mx-auto">
      <template v-if="!started">
        <!-- 单元选择 -->
        <div class="text-center my-6">
          <Fox mood="happy" :size="120" />
          <p class="text-white/90 font-han mt-3">选择一个星球开始闯关</p>
        </div>

        <div class="grid grid-cols-3 gap-2.5 mb-4">
          <button
            v-for="u in UNIT_OPTIONS"
            :key="u"
            @click="selectedUnit = u"
            class="rounded-2xl py-4 btn-pop border-2 flex flex-col items-center relative"
            :class="selectedUnit === u
              ? 'bg-gradient-to-br from-candy-pink to-candy-lilac border-white text-white shadow-glow'
              : 'bg-white/8 border-white/10 text-white/80'"
          >
            <span class="num-display text-2xl font-bold">{{ u === 0 ? '🌟' : u }}</span>
            <span class="text-xs font-han mt-0.5">{{ u === 0 ? '混合' : '的口诀' }}</span>
            <span
              v-if="store.getBestRecord(u).bestScore > 0"
              class="absolute -top-2 -right-2 bg-candy-lemon text-space-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-space-900/20"
            >最高 {{ store.getBestRecord(u).bestScore }}</span>
          </button>
        </div>

        <!-- 本单元历史最佳 -->
        <div v-if="bestRecord.bestScore > 0" class="text-center mb-4 text-xs font-han text-white/70">
          🏅 本关历史最佳 · 连击 {{ bestRecord.bestStreak }} · 得分 {{ bestRecord.bestScore }}
        </div>
        <div v-else class="text-center mb-4 text-xs font-han text-white/50">
          ✨ 还没有记录，努力创造第一个最佳吧！
        </div>

        <button
          @click="start"
          class="w-full bg-gradient-to-r from-candy-lemon via-candy-peach to-candy-pink text-space-900 font-display font-bold text-xl py-5 rounded-3xl btn-pop shadow-soft flex items-center justify-center gap-2"
        >
          <Icon name="rocket" :size="26" color="#1a1140" />
          <span>发射！</span>
        </button>
      </template>

      <template v-else>
        <!-- 状态条 -->
        <div class="flex justify-between items-center mb-4 px-1">
          <div class="flex items-center gap-1.5 bg-candy-peach/20 px-3 py-1.5 rounded-full border border-candy-peach/40">
            <Icon name="flame" :size="16" color="#ffb38a" />
            <span class="font-display font-bold text-candy-peach text-sm">连击 {{ streak }}</span>
          </div>
          <div class="flex items-center gap-1.5 bg-candy-mint/20 px-3 py-1.5 rounded-full border border-candy-mint/40">
            <Icon name="check" :size="16" color="#7eebc5" />
            <span class="font-display font-bold text-candy-mint text-sm">{{ correctCount }}</span>
          </div>
          <div class="flex items-center gap-1.5 bg-candy-lemon/20 px-3 py-1.5 rounded-full border border-candy-lemon/40">
            <Icon name="coin" :size="16" color="#ffe066" />
            <span class="font-display font-bold text-candy-lemon text-sm">{{ score }}</span>
          </div>
          <button @click="finishRun" class="text-white/80 px-3 py-1.5 rounded-full border border-white/25 text-xs font-han btn-pop bg-white/10">结束</button>
        </div>

        <!-- 狐狸对话 -->
        <div class="flex items-center gap-3 mb-4">
          <Fox :mood="foxMood" :size="64" />
          <div class="flex-1 bg-white/10 backdrop-blur rounded-2xl px-4 py-3 border border-white/15">
            <span class="font-han text-sm text-white/90">{{ foxBubble }}</span>
          </div>
        </div>

        <!-- 题目卡 -->
        <div
          v-if="question"
          class="rounded-3xl p-8 text-center mb-6 border-2 border-white/10 relative overflow-hidden"
          :class="[
            feedback === 'correct'
              ? 'bg-gradient-to-br from-candy-mint/30 to-candy-sky/30 animate-pop'
              : feedback === 'wrong'
                ? 'bg-gradient-to-br from-candy-pink/30 to-candy-peach/30 animate-shake'
                : 'bg-white/8 backdrop-blur'
          ]"
        >
          <div class="num-display text-6xl text-white drop-shadow">
            {{ question.a }} × {{ question.b }} = <span class="text-candy-lemon">?</span>
          </div>
          <div class="mt-2 text-xs text-white/60 font-han">点击下方正确答案</div>
        </div>

        <!-- 选项 -->
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="(opt, idx) in options"
            :key="idx"
            @click="pick(opt)"
            :disabled="!!feedback"
            class="rounded-3xl py-8 num-display text-4xl font-bold border-2 transition-all btn-pop"
            :class="optionClass(idx, opt)"
          >
            {{ opt }}
          </button>
        </div>

        <!-- 答题结果 -->
        <div v-if="feedback" class="mt-6 text-center">
          <div class="text-5xl animate-pop">{{ feedback === 'correct' ? '🎉' : '💪' }}</div>
          <div class="font-display font-bold text-xl mt-2" :class="feedback === 'correct' ? 'text-candy-mint' : 'text-candy-pink'">
            {{ feedback === 'correct' ? `+${1 + Math.floor(streak / 3)} 金币` : '别灰心' }}
          </div>
        </div>
      </template>
    </div>

    <!-- 闯关总结弹窗 -->
    <transition name="fade">
      <div
        v-if="summary"
        class="fixed inset-0 z-50 bg-space-900/80 backdrop-blur-sm flex items-center justify-center p-5"
      >
        <div class="bg-gradient-to-br from-space-700 to-space-800 rounded-3xl border-2 border-candy-lemon/40 shadow-glow p-6 max-w-sm w-full animate-pop">
          <div class="text-center">
            <div class="text-6xl mb-2">{{ summary.beatGlobalStreak ? '🏆' : summary.beatStreak || summary.beatScore ? '🎉' : '✨' }}</div>
            <h2 class="font-display font-bold text-2xl text-gradient mb-1">闯关完成！</h2>
            <p class="text-white/70 font-han text-xs mb-4">
              {{ selectedUnit === 0 ? '混合模式' : selectedUnit + ' 的口诀' }} · 用时 {{ Math.floor(summary.durationSec / 60) }}分{{ summary.durationSec % 60 }}秒
            </p>

            <!-- 数据 -->
            <div class="grid grid-cols-3 gap-2 mb-4">
              <div class="bg-white/8 rounded-2xl py-3 border border-white/10">
                <div class="num-display text-2xl text-candy-peach relative inline-block">
                  {{ summary.streak }}
                  <span v-if="summary.beatStreak" class="absolute -top-2 -right-4 text-xs">🆕</span>
                </div>
                <div class="text-[10px] text-white/60 font-han">本局连击</div>
                <div class="text-[9px] text-white/40 font-han">最佳 {{ summary.bestStreak }}</div>
              </div>
              <div class="bg-white/8 rounded-2xl py-3 border border-white/10">
                <div class="num-display text-2xl text-candy-mint">{{ summary.correctCount }}</div>
                <div class="text-[10px] text-white/60 font-han">答对题数</div>
                <div class="text-[9px] text-white/40 font-han">错 {{ summary.wrongCount }} 题</div>
              </div>
              <div class="bg-white/8 rounded-2xl py-3 border border-white/10">
                <div class="num-display text-2xl text-candy-lemon relative inline-block">
                  {{ summary.score }}
                  <span v-if="summary.beatScore" class="absolute -top-2 -right-4 text-xs">🆕</span>
                </div>
                <div class="text-[10px] text-white/60 font-han">本局得分</div>
                <div class="text-[9px] text-white/40 font-han">最佳 {{ summary.bestScore }}</div>
              </div>
            </div>

            <!-- 破纪录鼓励 -->
            <div v-if="summary.beatGlobalStreak" class="bg-candy-lemon/15 rounded-2xl py-2 mb-3 border border-candy-lemon/30">
              <p class="font-display font-bold text-candy-lemon text-sm">🌟 打破全局连击纪录！🌟</p>
            </div>
            <div v-else-if="summary.beatStreak || summary.beatScore" class="bg-candy-mint/15 rounded-2xl py-2 mb-3 border border-candy-mint/30">
              <p class="font-display font-bold text-candy-mint text-sm">🎊 超越自己，新纪录诞生！</p>
            </div>
            <div v-else class="bg-white/5 rounded-2xl py-2 mb-3">
              <p class="font-han text-white/70 text-xs">再试一次，挑战历史最佳！</p>
            </div>

            <!-- 按钮 -->
            <div class="flex gap-2">
              <button
                @click="playAgain"
                class="flex-1 bg-gradient-to-r from-candy-pink to-candy-lilac text-white font-display font-bold py-3 rounded-2xl btn-pop"
              >再来一关</button>
              <button
                @click="exit"
                class="flex-1 bg-white/10 text-white/80 font-han py-3 rounded-2xl border border-white/20 btn-pop"
              >返回首页</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
