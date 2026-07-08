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

const planetColors = ['#ff8fb1', '#ffb38a', '#ffe066', '#7eebc5', '#7ec8ff', '#c4a6ff', '#ff8c4a', '#ffd6b8', '#9be7e7']
</script>

<template>
  <div class="min-h-screen starfield">
    <NavBar title="选择星球" />
    <div class="relative z-10 p-5 max-w-md mx-auto">
      <div class="text-center my-4">
        <p class="text-white/90 font-han text-sm">选一颗星球开始冒险 🚀</p>
        <p class="text-white/60 font-han text-xs mt-1">每个星球对应一个数字口诀</p>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="(n, idx) in units"
          :key="n"
          @click="router.push(`/unit/${n}`)"
          class="relative aspect-square rounded-3xl flex flex-col items-center justify-center p-3 btn-pop border-2 border-white/10"
          :style="{
            background: `radial-gradient(circle at 30% 30%, ${planetColors[idx]}66, ${planetColors[idx]}22 60%, transparent 80%)`
          }"
        >
          <!-- 星球本身 -->
          <div
            class="w-14 h-14 rounded-full flex items-center justify-center shadow-soft"
            :style="{
              background: `radial-gradient(circle at 35% 35%, white, ${planetColors[idx]} 50%)`,
              boxShadow: `0 0 24px ${planetColors[idx]}88`
            }"
          >
            <span class="num-display text-2xl text-white drop-shadow">{{ n }}</span>
          </div>
          <div class="text-xs text-white/70 font-han mt-2">的口诀</div>
          <div class="text-[10px] text-white/40 font-han mt-0.5">{{ 10 - n }} 句</div>
          <div v-if="accuracy(n) != null" class="text-[10px] mt-1 px-2 py-0.5 rounded-full bg-candy-mint/20 text-candy-mint font-bold">
            {{ accuracy(n) }}%
          </div>
          <div v-else class="text-[10px] mt-1 text-white/40 font-han">未开始</div>
        </button>
      </div>
    </div>
  </div>
</template>
