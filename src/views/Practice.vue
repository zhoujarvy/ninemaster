<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Fox from '../components/Fox.vue'
import Icon from '../components/Icon.vue'
import Confetti from '../components/Confetti.vue'
import { store } from '../utils/store'
import { speakEquation, speakPhrase } from '../utils/speech'

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
const confettiTrigger = ref(0)
const pickedIdx = ref(-1)
const wrongAnswerIdx = ref(-1) // 显示哪个是错的

const planetColors = ['#ff8fb1', '#ffb38a', '#ffe066', '#7eebc5', '#7ec8ff', '#c4a6ff', '#ff8c4a', '#ffd6b8', '#9be7e7']

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
    store.addCoins(1 + Math.floor(streak.value / 3))
    store.grantBadge('first-correct')
    if (correctCount.value >= 10) store.grantBadge('perfect-10')
    if (selectedUnit.value > 0) {
      const p = store.state.stats.unitProgress[selectedUnit.value]
      if (p && p.correct >= 9) store.grantBadge(`unit-${selectedUnit.value}-done`)
    }
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

function exit() {
  started.value = false
  router.push('/')
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

        <div class="grid grid-cols-3 gap-2.5 mb-6">
          <button
            v-for="u in UNIT_OPTIONS"
            :key="u"
            @click="selectedUnit = u"
            class="rounded-2xl py-4 btn-pop border-2 flex flex-col items-center"
            :class="selectedUnit === u
              ? 'bg-gradient-to-br from-candy-pink to-candy-lilac border-white text-white shadow-glow'
              : 'bg-white/8 border-white/10 text-white/80'"
          >
            <span class="num-display text-2xl font-bold">{{ u === 0 ? '🌟' : u }}</span>
            <span class="text-xs font-han mt-0.5">{{ u === 0 ? '混合' : '的口诀' }}</span>
          </button>
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
            <Icon name="flame" :size="18" color="#ffb38a" />
            <span class="font-display font-bold text-candy-peach">连击 {{ streak }}</span>
          </div>
          <div class="flex items-center gap-1.5 bg-candy-mint/20 px-3 py-1.5 rounded-full border border-candy-mint/40">
            <Icon name="check" :size="18" color="#7eebc5" />
            <span class="font-display font-bold text-candy-mint">✓ {{ correctCount }}</span>
          </div>
          <button @click="exit" class="text-white/60 px-3 py-1.5 rounded-full border border-white/20 text-xs font-han btn-pop">退出</button>
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
  </div>
</template>
