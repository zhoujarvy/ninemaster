<script setup>
import NavBar from '../components/NavBar.vue'
import Fox from '../components/Fox.vue'
import { store } from '../utils/store'
import { BADGE_DEFS } from '../utils/badges'

const unlocked = (id) => store.state.badges.includes(id)
</script>

<template>
  <div class="min-h-screen starfield">
    <NavBar title="星尘碎片" />
    <div class="relative z-10 p-5 max-w-md mx-auto">
      <!-- 头部 -->
      <div class="text-center my-4 flex flex-col items-center">
        <Fox :mood="store.state.badges.length >= 3 ? 'cheer' : 'happy'" :size="100" />
        <p class="text-white/90 font-han mt-2 text-sm">
          已收集 {{ store.state.badges.length }} / {{ BADGE_DEFS.length }} 颗星尘
        </p>
        <div class="mt-2 w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/10">
          <div
            class="h-full bg-gradient-to-r from-candy-lemon to-candy-pink transition-all duration-500"
            :style="{ width: (store.state.badges.length / BADGE_DEFS.length) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- 勋章网格 -->
      <div class="grid grid-cols-3 gap-3 mt-6">
        <div
          v-for="b in BADGE_DEFS"
          :key="b.id"
          class="relative rounded-2xl p-4 text-center border-2 transition-all"
          :class="unlocked(b.id)
            ? 'bg-gradient-to-br from-white/15 to-white/5 border-candy-lemon/40 shadow-glow'
            : 'bg-white/5 border-white/10'"
        >
          <div
            class="text-5xl mb-2"
            :class="{ 'grayscale opacity-30': !unlocked(b.id) }"
          >
            {{ unlocked(b.id) ? b.icon : '🔒' }}
          </div>
          <div class="font-han text-xs font-bold text-white">{{ unlocked(b.id) ? b.name : '???' }}</div>
          <div class="text-[10px] text-white/50 mt-1 font-han leading-tight">{{ b.desc }}</div>

          <div v-if="unlocked(b.id)" class="absolute top-1 right-1 w-4 h-4 rounded-full bg-candy-mint flex items-center justify-center">
            <span class="text-[10px] text-space-900">✓</span>
          </div>
        </div>
      </div>

      <!-- 提示 -->
      <div class="mt-6 bg-white/5 rounded-2xl p-4 border border-white/10">
        <p class="text-xs text-white/70 font-han text-center leading-relaxed">
          💡 多练习、多坚持，就能收集更多星尘碎片！<br>
          每个勋章都是你努力的小证明。
        </p>
      </div>
    </div>
  </div>
</template>
