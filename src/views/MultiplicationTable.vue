<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import Icon from '../components/Icon.vue'
import Fox from '../components/Fox.vue'
import { speakKoujue, speakEquation } from '../utils/speech'
import { toKoujue } from '../utils/koujue'
import { store } from '../utils/store'

const active = ref(null)   // 当前高亮的格子 "a-b" (a<=b)
const flash = ref('')
const flashEq = ref('')

// 点击格 (a, b) 其中 a<=b
function playCell(a, b) {
  active.value = `${a}-${b}`
  speakKoujue(a, b)
  flash.value = toKoujue(a, b)
  flashEq.value = `${a} × ${b} = ${a * b}`
  store.grantBadge('opened-table')
  setTimeout(() => (active.value = null), 700)
}

// 行 a 中有 (b-a+1) 个有效格子, b 从 a 到 9
function rowCells(a) {
  const arr = []
  for (let b = a; b <= 9; b++) arr.push(b)
  return arr
}

// 颜色分配, 让对角线有视觉节奏
const cellTones = [
  'from-candy-pink/40 to-candy-pink/10',
  'from-candy-peach/40 to-candy-peach/10',
  'from-candy-lemon/40 to-candy-lemon/10',
  'from-candy-mint/40 to-candy-mint/10',
  'from-candy-sky/40 to-candy-sky/10',
  'from-candy-lilac/40 to-candy-lilac/10',
  'from-candy-pink/40 to-candy-lilac/10',
  'from-candy-mint/40 to-candy-sky/10',
  'from-candy-peach/40 to-candy-lemon/10'
]
</script>

<template>
  <div class="min-h-screen starfield">
    <NavBar title="九九总表" />
    <div class="relative z-10 p-4 max-w-md mx-auto">
      <div class="text-center my-4 flex flex-col items-center">
        <Fox mood="happy" :size="80" />
        <p class="text-white/90 font-han mt-2 text-sm">小九九 · 共 45 句</p>
        <p class="text-white/60 font-han text-xs mt-0.5">点点你的小手指 👆</p>
      </div>

      <!-- 三角形小九九表 -->
      <div class="bg-white/8 backdrop-blur p-3 rounded-3xl border border-white/10">
        <div v-for="a in 9" :key="a" class="flex justify-center gap-1.5 mb-1.5">
          <!-- 行标签 -->
          <div class="w-8 h-8 flex items-center justify-center text-candy-pink font-display font-bold text-sm flex-shrink-0">{{ a }}</div>
          <!-- 行的格子 -->
          <button
            v-for="b in rowCells(a)"
            :key="a + '-' + b"
            @click="playCell(a, b)"
            class="h-8 px-2 rounded-lg flex items-center justify-center text-xs font-display font-bold btn-pop bg-gradient-to-br border border-white/10"
            :class="[
              active === `${a}-${b}`
                ? 'from-candy-lemon to-candy-peach text-space-900 scale-110 animate-pop shadow-glow z-10'
                : cellTones[(a + b) % cellTones.length] + ' text-white'
            ]"
            style="min-width: 56px;"
          >
            {{ a }}×{{ b }}
          </button>
        </div>
      </div>

      <!-- 浮动显示 -->
      <transition name="fade">
        <div v-if="flash" class="mt-5 text-center">
          <div class="inline-block bg-gradient-to-r from-candy-pink to-candy-lilac px-6 py-3 rounded-2xl shadow-soft animate-pop">
            <div class="num-display text-base text-white/80">{{ flashEq }}</div>
            <div class="font-han text-2xl text-white font-bold mt-1">{{ flash }}</div>
          </div>
        </div>
      </transition>

      <!-- 提示 -->
      <div class="mt-5 bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-full bg-candy-lemon/20 flex items-center justify-center flex-shrink-0">
            <Icon name="speaker" :size="18" color="#ffe066" />
          </div>
          <div class="text-xs text-white/70 font-han leading-relaxed">
            <p>小九九规则：小数在前，大数在后。</p>
            <p class="mt-1">例如 3×4 和 4×3 都用「三四十二」这一句。</p>
            <p class="mt-1 text-candy-lemon">共 45 句，比 81 句少背一半！</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
