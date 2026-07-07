<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import { store } from '../utils/store'

// 简单密码门
const PASSWORD = '1688'
const unlocked = ref(false)
const input = ref('')

function tryUnlock() {
  if (input.value === PASSWORD) unlocked.value = true
  else input.value = ''
}

const stats = store.state.stats
const accuracy = stats.totalAnswered ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0

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
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="p-4 max-w-md mx-auto">
      <template v-if="!unlocked">
        <div class="text-center py-16">
          <div class="text-5xl mb-3">🔐</div>
          <h2 class="text-lg font-bold text-gray-600 mb-3">家长面板</h2>
          <p class="text-xs text-gray-400 mb-4">请输入密码（默认 1688）</p>
          <input
            v-model="input"
            type="tel"
            inputmode="numeric"
            @keyup.enter="tryUnlock"
            placeholder="请输入密码"
            class="border border-orange-200 rounded-xl px-4 py-2 text-center text-lg w-40"
          />
          <div class="mt-4">
            <button
              @click="tryUnlock"
              class="bg-orange-500 text-white px-6 py-2 rounded-full active:scale-95"
            >进入</button>
          </div>
        </div>
      </template>

      <template v-else>
        <h2 class="text-center text-lg font-bold text-orange-600 mb-3">孩子学习概况</h2>

        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div class="text-3xl font-bold text-orange-500">{{ stats.totalAnswered }}</div>
            <div class="text-xs text-gray-500 mt-1">累计答题</div>
          </div>
          <div class="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div class="text-3xl font-bold text-green-500">{{ accuracy }}%</div>
            <div class="text-xs text-gray-500 mt-1">正确率</div>
          </div>
          <div class="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div class="text-3xl font-bold text-yellow-500">{{ stats.streakDays }}</div>
            <div class="text-xs text-gray-500 mt-1">连续天数</div>
          </div>
          <div class="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div class="text-3xl font-bold text-purple-500">{{ store.state.coins }}</div>
            <div class="text-xs text-gray-500 mt-1">金币</div>
          </div>
        </div>

        <h3 class="text-sm font-bold text-gray-700 mb-2">各单元情况</h3>
        <div class="space-y-2 mb-6">
          <div v-for="n in 9" :key="n" class="bg-white rounded-xl px-4 py-2 flex items-center justify-between shadow-sm">
            <span class="font-bold text-orange-500">{{ n }} 的口诀</span>
            <span v-if="unitStat(n)" class="text-sm text-gray-600">
              {{ unitStat(n).correct }}/{{ unitStat(n).answered }} · {{ unitStat(n).accuracy }}%
            </span>
            <span v-else class="text-xs text-gray-400">未练习</span>
          </div>
        </div>

        <h3 class="text-sm font-bold text-gray-700 mb-2">错题 ({{ store.state.wrongBook.length }})</h3>
        <div v-if="store.state.wrongBook.length" class="bg-white rounded-xl p-3 shadow-sm mb-6">
          <div v-for="w in store.state.wrongBook" :key="w.key" class="text-sm py-1 flex justify-between">
            <span>{{ w.a }} × {{ w.b }}</span>
            <span class="text-red-500">错过 {{ w.count }} 次</span>
          </div>
        </div>
        <div v-else class="text-sm text-gray-400 mb-6">暂无错题</div>

        <button
          @click="exportData"
          class="w-full bg-gray-100 text-gray-600 py-3 rounded-xl active:scale-95"
        >导出数据备份</button>
      </template>
    </div>
  </div>
</template>
