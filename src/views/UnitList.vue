<script setup>
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { store } from '../utils/store'

const router = useRouter()

const units = Array.from({ length: 9 }, (_, i) => i + 1)

function accuracy(n) {
  const p = store.state.stats.unitProgress[n]
  if (!p || !p.answered) return null
  return Math.round((p.correct / p.answered) * 100)
}
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="p-4 max-w-md mx-auto">
      <h2 class="text-center text-lg font-bold text-orange-600 mb-3">分单元学习</h2>
      <p class="text-center text-xs text-gray-500 mb-4">从简单的开始，一个一个攻克</p>

      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="n in units"
          :key="n"
          @click="router.push(`/unit/${n}`)"
          class="aspect-square rounded-2xl bg-white shadow-md flex flex-col items-center justify-center active:scale-95 transition-transform"
        >
          <div class="text-4xl font-bold text-orange-500">{{ n }}</div>
          <div class="text-xs text-gray-400">的口诀</div>
          <div v-if="accuracy(n) != null" class="text-xs mt-1 text-green-500">
            正确率 {{ accuracy(n) }}%
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
