<script setup>
import { computed, onMounted, ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import { store } from '../utils/store'
import { speak } from '../utils/speech'

const UNIT_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] // 0 = 混合

const selectedUnit = ref(0)
const started = ref(false)
const question = ref(null)
const options = ref([])
const feedback = ref(null) // 'correct' | 'wrong' | null
const streak = ref(0)
const correctCount = ref(0)

function genQuestion() {
  let a, b
  if (selectedUnit.value === 0) {
    a = Math.floor(Math.random() * 9) + 1
    b = Math.floor(Math.random() * 9) + 1
  } else {
    a = selectedUnit.value
    b = Math.floor(Math.random() * 9) + 1
  }
  const answer = a * b
  // 生成 4 个选项
  const set = new Set([answer])
  while (set.size < 4) {
    const delta = (Math.floor(Math.random() * 7) - 3)
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
  next()
}

function next() {
  feedback.value = null
  question.value = genQuestion()
  // 重新计算选项
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
  const correct = val === question.value.answer
  feedback.value = correct ? 'correct' : 'wrong'
  store.recordAnswer(selectedUnit.value, correct)

  if (correct) {
    streak.value += 1
    correctCount.value += 1
    store.addCoins(1 + Math.floor(streak.value / 3))
    if (store.grantBadge('first-correct')) {}
    if (correctCount.value >= 10 && store.grantBadge('perfect-10')) {}
    if (selectedUnit.value > 0) {
      const p = store.state.stats.unitProgress[selectedUnit.value]
      if (p && p.correct >= 9 && store.grantBadge(`unit-${selectedUnit.value}-done`)) {}
    }
    speak(`${question.value.a}乘${question.value.b}等于${question.value.answer}`, { rate: 1 })
  } else {
    streak.value = 0
    store.addWrong({ a: question.value.a, b: question.value.b })
    speak('没关系，再试试')
  }

  setTimeout(next, 1200)
}

onMounted(() => {
  // 等待选择单元后开始
})
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="p-4 max-w-md mx-auto">
      <template v-if="!started">
        <h2 class="text-center text-lg font-bold text-orange-600 mb-3">闯关练习</h2>
        <p class="text-center text-xs text-gray-500 mb-4">选择要练习的单元</p>

        <div class="grid grid-cols-3 gap-2 mb-6">
          <button
            v-for="u in UNIT_OPTIONS"
            :key="u"
            @click="selectedUnit = u"
            class="rounded-xl py-3 font-bold transition-all"
            :class="selectedUnit === u
              ? 'bg-orange-500 text-white shadow-md scale-105'
              : 'bg-white text-orange-500'"
          >
            {{ u === 0 ? '🌟 混合' : `${u} 的` }}
          </button>
        </div>

        <button
          @click="start"
          class="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-4 rounded-2xl text-lg shadow-lg active:scale-95 transition-transform"
        >
          开始答题 🚀
        </button>
      </template>

      <template v-else>
        <!-- 状态条 -->
        <div class="flex justify-between items-center mb-4">
          <div class="bg-yellow-100 px-3 py-1 rounded-full text-sm">
            连击 🔥 {{ streak }}
          </div>
          <div class="bg-green-100 px-3 py-1 rounded-full text-sm text-green-700">
            答对 {{ correctCount }}
          </div>
        </div>

        <!-- 题目 -->
        <div
          v-if="question"
          class="bg-white rounded-3xl p-8 shadow-md text-center mb-6"
          :class="{
            'animate-pop': feedback === 'correct',
            'animate-shake': feedback === 'wrong'
          }"
        >
          <div class="text-5xl font-bold text-orange-600">
            {{ question.a }} × {{ question.b }} = ?
          </div>
          <div class="mt-2 text-sm text-gray-400">点击下方正确答案</div>
        </div>

        <!-- 选项 -->
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="opt in options"
            :key="opt"
            @click="pick(opt)"
            :disabled="!!feedback"
            class="rounded-2xl py-8 text-3xl font-bold shadow-sm transition-all active:scale-95"
            :class="[
              feedback
                ? (opt === question.answer
                    ? 'bg-green-400 text-white'
                    : (opt === question.lastPick ? 'bg-red-300' : 'bg-white opacity-50'))
                : 'bg-white text-orange-600'
            ]"
          >
            {{ opt }}
          </button>
        </div>

        <!-- 反馈 -->
        <div v-if="feedback" class="mt-6 text-center">
          <div class="text-4xl">{{ feedback === 'correct' ? '🎉' : '💪' }}</div>
          <div class="text-lg font-bold mt-2" :class="feedback === 'correct' ? 'text-green-500' : 'text-orange-500'">
            {{ feedback === 'correct' ? '答对了！' : '再加油！' }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
