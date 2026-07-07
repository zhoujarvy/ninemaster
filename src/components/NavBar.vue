<script setup>
import { useRouter, useRoute } from 'vue-router'
import { store } from '../utils/store'

const router = useRouter()
const route = useRoute()
</script>

<template>
  <header class="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-orange-100">
    <div class="flex items-center justify-between px-4 py-3">
      <button
        v-if="route.path !== '/'"
        @click="router.back()"
        class="text-orange-500 text-lg w-9 h-9 flex items-center justify-center rounded-full hover:bg-orange-50 active:bg-orange-100"
        aria-label="返回"
      >
        ‹
      </button>
      <span v-else class="w-9"></span>
      <div class="text-orange-600 font-bold text-lg">九九乘法大师</div>
      <div class="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
        <span class="text-yellow-600">★</span>
        <span class="text-yellow-700 font-bold">{{ store.state.coins }}</span>
      </div>
    </div>
  </header>
</template>
