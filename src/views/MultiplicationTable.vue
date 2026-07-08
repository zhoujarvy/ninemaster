<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import Icon from '../components/Icon.vue'
import Fox from '../components/Fox.vue'
import { speakKoujue } from '../utils/speech'
import { toKoujue } from '../utils/koujue'
import { store } from '../utils/store'

const active = ref(null)
const flash = ref('')
const flashEq = ref('')

function playCell(a, b) {
  active.value = `${a}-${b}`
  speakKoujue(a, b)
  flash.value = toKoujue(a, b)
  flashEq.value = `${a} × ${b} = ${a * b}`
  store.grantBadge('opened-table')
  setTimeout(() => (active.value = null), 700)
}

// 第 a 行的格子: b 从 a 到 9
function rowCells(a) {
  const arr = []
  for (let b = a; b <= 9; b++) arr.push({ a, b })
  return arr
}

// 颜色: 按行号分配渐变
const rowTones = [
  'from-candy-pink/40 to-candy-pink/15',
  'from-candy-peach/40 to-candy-peach/15',
  'from-candy-lemon/40 to-candy-lemon/15',
  'from-candy-mint/40 to-candy-mint/15',
  'from-candy-sky/40 to-candy-sky/15',
  'from-candy-lilac/40 to-candy-lilac/15',
  'from-candy-pink/40 to-candy-lilac/15',
  'from-candy-peach/40 to-candy-mint/15',
  'from-candy-sky/40 to-candy-pink/15'
]
</script>

<template>
  <div class="min-h-screen starfield">
    <NavBar title="九九总表" />
    <div class="relative z-10 p-3 max-w-md mx-auto">
      <div class="text-center my-3 flex flex-col items-center">
        <Fox mood="happy" :size="72" />
        <p class="text-white/90 font-han mt-2 text-sm">小九九 · 共 45 句</p>
        <p class="text-white/60 font-han text-xs mt-0.5">点点任意一格，听口诀</p>
      </div>

      <!-- 阶梯形小九九表 -->
      <div class="bg-white/8 backdrop-blur px-2 py-4 rounded-3xl border border-white/10 overflow-x-auto scroll-hide">
        <div
          v-for="a in 9"
          :key="a"
          class="flex justify-center gap-1 mb-1.5"
        >
          <!-- 行标签 (左侧) -->
          <div class="w-6 h-7 flex items-center justify-center text-candy-lemon font-display font-bold text-xs flex-shrink-0">
            {{ a }}
          </div>

          <!-- 该行的格子 -->
          <button
            v-for="cell in rowCells(a)"
            :key="`${cell.a}-${cell.b}`"
            @click="playCell(cell.a, cell.b)"
            class="h-7 px-1 rounded-md flex items-center justify-center text-[11px] font-display font-bold btn-pop bg-gradient-to-br border border-white/10 leading-none"
            :class="[
              active === `${cell.a}-${cell.b}`
                ? 'from-candy-lemon to-candy-peach text-space-900 scale-110 animate-pop shadow-glow z-10'
                : rowTones[(cell.a - 1) % rowTones.length] + ' text-white'
            ]"
            style="min-width: 36px;"
          >
            {{ cell.a }}×{{ cell.b }}
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
