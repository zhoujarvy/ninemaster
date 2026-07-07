<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { genUnitKoujue } from '../utils/koujue'
import { speak } from '../utils/speech'

const route = useRoute()
const n = computed(() => Number(route.params.n))
const list = computed(() => genUnitKoujue(n.value))

const activeIdx = ref(-1)
const visualEmoji = ['🍎', '🍊', '🍓', '🍇', '🍉', '🍒', '🥝', '🍑', '🍐']

function play(item, idx) {
  activeIdx.value = idx
  speak(item.koujue)
  setTimeout(() => (activeIdx.value = -1), 800)
}

function playAll() {
  let i = 0
  const next = () => {
    if (i >= list.value.length) return
    play(list.value[i], i)
    i++
    setTimeout(next, 1500)
  }
  next()
}

watch(n, () => activeIdx.value = -1)
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="p-4 max-w-md mx-auto">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold text-orange-600">{{ n }} 的口诀</h2>
        <button
          @click="playAll"
          class="bg-orange-500 text-white text-sm px-4 py-2 rounded-full active:scale-95 transition-transform"
        >
          ▶ 连续播放
        </button>
      </div>

      <div class="space-y-2">
        <button
          v-for="(item, idx) in list"
          :key="idx"
          @click="play(item, idx)"
          class="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between active:scale-98 transition-all"
          :class="{ 'ring-2 ring-yellow-400 animate-pop': activeIdx === idx }"
        >
          <div class="flex-1 text-left">
            <div class="text-2xl font-bold text-gray-800">
              {{ item.a }} × {{ item.b }} = {{ item.c }}
            </div>
            <div class="text-sm text-orange-500 mt-1">{{ item.koujue }}</div>
            <div class="mt-2 text-xl">
              <span v-for="k in item.b" :key="k">{{ visualEmoji[(item.a - 1) % visualEmoji.length] }}</span>
            </div>
          </div>
          <div class="text-3xl text-orange-300">🔊</div>
        </button>
      </div>
    </div>
  </div>
</template>
