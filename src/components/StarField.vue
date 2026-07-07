<script setup>
import { computed } from 'vue'

// 漂浮的装饰星球 (远景)
const planets = computed(() => [
  { size: 60, top: '8%', left: '-5%', color: '#c4a6ff', ring: true, delay: '0s' },
  { size: 30, top: '70%', right: '-3%', color: '#7eebc5', ring: false, delay: '1.5s' },
  { size: 20, top: '40%', right: '5%', color: '#ffe066', ring: false, delay: '0.8s' }
])
</script>

<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    <!-- 装饰星球 -->
    <div
      v-for="(p, i) in planets"
      :key="i"
      class="absolute rounded-full animate-float"
      :style="{
        width: p.size + 'px',
        height: p.size + 'px',
        top: p.top,
        left: p.left,
        right: p.right,
        background: `radial-gradient(circle at 30% 30%, ${p.color}, ${p.color}88 50%, transparent 70%)`,
        animationDelay: p.delay,
        boxShadow: `0 0 ${p.size/2}px ${p.color}66`
      }"
    >
      <div
        v-if="p.ring"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white/30 rounded-full"
        style="width: 130%; height: 30%; transform: translate(-50%,-50%) rotate(-25deg);"
      ></div>
    </div>
  </div>
</template>
