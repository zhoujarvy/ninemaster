<script setup>
import NavBar from '../components/NavBar.vue'
import { store } from '../utils/store'
import { BADGE_DEFS } from '../utils/badges'
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="p-4 max-w-md mx-auto">
      <h2 class="text-center text-lg font-bold text-orange-600 mb-1">我的勋章</h2>
      <p class="text-center text-xs text-gray-500 mb-4">
        已收集 {{ store.state.badges.length }} / {{ BADGE_DEFS.length }}
      </p>

      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="b in BADGE_DEFS"
          :key="b.id"
          class="rounded-2xl p-4 text-center shadow-sm transition-all"
          :class="store.state.badges.includes(b.id) ? b.color + ' opacity-100' : 'bg-gray-100 opacity-40'"
        >
          <div class="text-4xl mb-1" :class="{ 'grayscale': !store.state.badges.includes(b.id) }">
            {{ store.state.badges.includes(b.id) ? b.icon : '🔒' }}
          </div>
          <div class="text-xs font-bold text-gray-700">{{ b.name }}</div>
          <div class="text-[10px] text-gray-500 mt-1">{{ b.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
