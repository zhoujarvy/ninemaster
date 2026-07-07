<script setup>
// 撒花/彩纸效果
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  trigger: Number  // 监听这个值变化触发
})

const pieces = ref([])
let idCounter = 0
let timer = null

const colors = ['#ff8fb1', '#ffb38a', '#ffe066', '#7eebc5', '#7ec8ff', '#c4a6ff']

function burst() {
  const arr = []
  for (let i = 0; i < 40; i++) {
    arr.push({
      id: ++idCounter,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? 'square' : 'circle',
      size: 8 + Math.random() * 10,
      duration: 1.2 + Math.random() * 0.6
    })
  }
  pieces.value = arr
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => { pieces.value = [] }, 2200)
}

watch(() => props.trigger, (n) => {
  if (n > 0) burst()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="confetti-container">
    <div
      v-for="p in pieces"
      :key="p.id"
      class="confetti"
      :style="{
        left: p.left + '%',
        backgroundColor: p.color,
        borderRadius: p.shape === 'circle' ? '50%' : '2px',
        width: p.size + 'px',
        height: p.size + 'px',
        animationDelay: p.delay + 's',
        animationDuration: p.duration + 's'
      }"
    ></div>
  </div>
</template>
