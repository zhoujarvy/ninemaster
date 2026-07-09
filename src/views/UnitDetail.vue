<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Fox from '../components/Fox.vue'
import Icon from '../components/Icon.vue'
import { genUnitKoujue } from '../utils/koujue'
import { speakKoujue, speakEquation, speakPhrase } from '../utils/speech'

const route = useRoute()
const n = computed(() => Number(route.params.n))
const list = computed(() => genUnitKoujue(n.value))

const activeIdx = ref(-1)
const isPlayingAll = ref(false)
const visualEmoji = ['🍎', '🍊', '🍓', '🍇', '🍉', '🍒', '🥝', '🍑', '🍐']

const planetColors = ['#ff8fb1', '#ffb38a', '#ffe066', '#7eebc5', '#7ec8ff', '#c4a6ff', '#ff8c4a', '#ffd6b8', '#9be7e7']

function play(item, idx) {
  activeIdx.value = idx
  speakKoujue(item.a, item.b)
  setTimeout(() => (activeIdx.value = -1), 900)
}

let timer = null
function playAll() {
  if (isPlayingAll.value) {
    isPlayingAll.value = false
    if (timer) clearTimeout(timer)
    activeIdx.value = -1
    return
  }
  isPlayingAll.value = true
  let i = 0
  const step = () => {
    if (!isPlayingAll.value || i >= list.value.length) {
      isPlayingAll.value = false
      activeIdx.value = -1
      return
    }
    play(list.value[i], i)
    i++
    timer = setTimeout(step, 1700)
  }
  step()
}

watch(n, () => {
  activeIdx.value = -1
  isPlayingAll.value = false
  if (timer) clearTimeout(timer)
})

function emojiFor(idx) {
  return visualEmoji[(idx) % visualEmoji.length]
}
</script>

<template>
  <div class="min-h-screen starfield">
    <NavBar :title="`${n} 的口诀`" />
    <div class="relative z-10 p-4 max-w-md mx-auto">
      <!-- 星球标题 -->
      <div class="text-center my-4 flex flex-col items-center">
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center shadow-soft animate-float"
          :style="{
            background: `radial-gradient(circle at 35% 35%, white, ${planetColors[(n-1) % 9]} 55%)`,
            boxShadow: `0 0 30px ${planetColors[(n-1) % 9]}aa`
          }"
        >
          <span class="num-display text-4xl text-white drop-shadow">{{ n }}</span>
        </div>
        <p class="text-white/70 text-xs font-han mt-2">踏上 {{ n }} 号星球的口诀之旅</p>
      </div>

      <!-- 连续播放按钮 -->
      <button
        @click="playAll"
        class="w-full mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-candy-pink to-candy-lilac text-white font-display font-bold py-3 rounded-2xl btn-pop shadow-soft"
      >
        <Icon name="speaker" :size="22" color="white" />
        <span>{{ isPlayingAll ? '停止播放' : '连续朗读' }}</span>
      </button>

      <!-- 口诀列表 -->
      <div class="space-y-2.5">
        <button
          v-for="(item, idx) in list"
          :key="idx"
          @click="play(item, idx)"
          class="w-full rounded-2xl p-4 text-left btn-pop border-2 transition-all flex items-center gap-3"
          :class="activeIdx === idx
            ? 'bg-gradient-to-br from-candy-lemon to-candy-peach border-candy-lemon scale-[1.02] shadow-glow'
            : 'bg-white/10 border-white/10'"
        >
          <!-- 序号圆 -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold flex-shrink-0"
            :class="activeIdx === idx ? 'bg-space-900 text-white' : 'bg-white/15 text-white'"
          >
            {{ idx + 1 }}
          </div>

          <div class="flex-1">
            <div class="num-display text-2xl" :class="activeIdx === idx ? 'text-space-900' : 'text-white'">
              {{ item.a }} × {{ item.b }} = {{ item.c }}
            </div>
            <div class="text-sm font-han mt-0.5" :class="activeIdx === idx ? 'text-space-700' : 'text-candy-pink'">
              {{ item.koujue }}
            </div>
            <!-- 矩阵可视化: item.a 行 × item.b 列 -->
            <div
              class="mt-2 inline-flex flex-col gap-1 p-2 rounded-xl"
              :class="activeIdx === idx ? 'bg-space-900/10' : 'bg-white/5'"
            >
              <div
                v-for="row in item.a"
                :key="row"
                class="flex gap-1"
              >
                <span
                  v-for="col in item.b"
                  :key="col"
                  class="text-base leading-none"
                >{{ emojiFor(idx) }}</span>
              </div>
            </div>
            <div class="text-[10px] font-han mt-1" :class="activeIdx === idx ? 'text-space-600' : 'text-white/50'">
              {{ item.a }} 行 × {{ item.b }} 列 = {{ item.c }}
            </div>
          </div>

          <div
            class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            :class="activeIdx === idx ? 'bg-space-900/20' : 'bg-white/10'"
          >
            <Icon name="speaker" :size="20" :color="activeIdx === idx ? '#1a1140' : '#ffe066'" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
