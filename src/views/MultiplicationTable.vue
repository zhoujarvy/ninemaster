<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import Fox from '../components/Fox.vue'
import Icon from '../components/Icon.vue'
import { speakKoujue, stopSpeak } from '../utils/speech'
import { toKoujue } from '../utils/koujue'
import { store } from '../utils/store'

const active = ref(null)
const flash = ref('')
const flashEq = ref('')

function playCell(a, b) {
  stopAll()
  active.value = `${a}-${b}`
  speakKoujue(a, b)
  flash.value = toKoujue(a, b)
  flashEq.value = `${a} × ${b} = ${a * b}`
  store.grantBadge('opened-table')
  setTimeout(() => (active.value = null), 700)
}

// 第 b 行的格子: a 从 1 到 b
function rowCells(b) {
  const arr = []
  for (let a = 1; a <= b; a++) arr.push({ a, b })
  return arr
}

// 朗读全部 (45 句小九九)
// 顺序: 1×1, 1×2, 2×2, 1×3, 2×3, 3×3, ... 1×9, ..., 9×9 (按行扫)
const isPlayingAll = ref(false)
let playAllTimer = null
let currentAudioEl = null

function buildAllCells() {
  const arr = []
  for (let b = 1; b <= 9; b++) {
    for (let a = 1; a <= b; a++) arr.push({ a, b })
  }
  return arr
}

async function playAll() {
  if (isPlayingAll.value) {
    stopAll()
    return
  }
  isPlayingAll.value = true
  const cells = buildAllCells()
  let i = 0
  const step = () => {
    if (!isPlayingAll.value || i >= cells.length) {
      stopAll()
      return
    }
    const { a, b } = cells[i]
    active.value = `${a}-${b}`
    flash.value = toKoujue(a, b)
    flashEq.value = `${a} × ${b} = ${a * b}`
    // 监听音频结束才继续下一句
    currentAudioEl = new Audio(`./audio/kj_${Math.min(a, b)}_${Math.max(a, b)}.mp3`)
    currentAudioEl.onended = () => {
      i++
      playAllTimer = setTimeout(step, 150)
    }
    currentAudioEl.onerror = () => {
      i++
      playAllTimer = setTimeout(step, 150)
    }
    currentAudioEl.play().catch(() => {
      i++
      playAllTimer = setTimeout(step, 150)
    })
  }
  step()
}

function stopAll() {
  isPlayingAll.value = false
  if (playAllTimer) { clearTimeout(playAllTimer); playAllTimer = null }
  if (currentAudioEl) {
    currentAudioEl.onended = null
    currentAudioEl.onerror = null
    currentAudioEl.pause()
    currentAudioEl = null
  }
  stopSpeak()
}

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

      <!-- 朗读全部按钮 -->
      <button
        @click="playAll"
        class="w-full mb-3 flex items-center justify-center gap-2 bg-gradient-to-r from-candy-pink to-candy-lilac text-white font-display font-bold py-3 rounded-2xl btn-pop shadow-soft"
      >
        <Icon :name="isPlayingAll ? 'x' : 'speaker'" :size="22" color="white" />
        <span>{{ isPlayingAll ? '停止朗读' : '朗读全部 45 句' }}</span>
      </button>

      <!-- 正阶梯形小九九表 -->
      <div class="bg-white/8 backdrop-blur px-2 py-4 rounded-3xl border border-white/10 overflow-x-auto scroll-hide">
        <div
          v-for="b in 9"
          :key="b"
          class="flex justify-center gap-1 mb-1.5"
        >
          <button
            v-for="cell in rowCells(b)"
            :key="`${cell.a}-${cell.b}`"
            @click="playCell(cell.a, cell.b)"
            class="h-7 px-1 rounded-md flex items-center justify-center text-[11px] font-display font-bold btn-pop bg-gradient-to-br border border-white/10 leading-none"
            :class="[
              active === `${cell.a}-${cell.b}`
                ? 'from-candy-lemon to-candy-peach text-space-900 scale-110 animate-pop shadow-glow z-10'
                : rowTones[(cell.b - 1) % rowTones.length] + ' text-white'
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
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
