<script setup>
import { useRouter, useRoute } from 'vue-router'
import { store } from '../utils/store'
import Icon from './Icon.vue'

defineProps({
  title: { type: String, default: '九九乘法大师' },
  showHome: { type: Boolean, default: false }
})

const router = useRouter()
const route = useRoute()

function back() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}
</script>

<template>
  <header class="sticky top-0 z-30 backdrop-blur-md bg-space-900/70 border-b border-white/10">
    <div class="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
      <button
        v-if="route.path !== '/'"
        @click="back"
        class="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/10 text-white btn-pop"
        aria-label="返回"
      >
        <Icon name="arrowLeft" :size="24" />
      </button>
      <button
        v-else
        @click="router.push('/')"
        class="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/10 text-white btn-pop"
        aria-label="首页"
      >
        <Icon name="home" :size="22" />
      </button>

      <div class="font-display font-bold text-base text-white/95 tracking-wide">{{ title }}</div>

      <div class="flex items-center gap-1.5 px-3 h-11 rounded-2xl bg-candy-lemon/15 border border-candy-lemon/40">
        <Icon name="star" :size="20" color="#ffe066" />
        <span class="font-display font-bold text-candy-lemon text-base num-display">{{ store.state.coins }}</span>
      </div>
    </div>
  </header>
</template>
