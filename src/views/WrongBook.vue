<script setup>
import NavBar from '../components/NavBar.vue'
import { store } from '../utils/store'
import { speak } from '../utils/speech'
import { toKoujue } from '../utils/koujue'

const list = store.state.wrongBook

function play(w) {
  speak(toKoujue(w.a, w.b))
}

function clearItem(key) {
  store.removeWrong(key)
}
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="p-4 max-w-md mx-auto">
      <h2 class="text-center text-lg font-bold text-orange-600 mb-1">错题本</h2>
      <p class="text-center text-xs text-gray-500 mb-4">
        做错的题会自动记在这里，多听听就记住啦
      </p>

      <div v-if="list.length === 0" class="text-center py-12 text-gray-400">
        <div class="text-6xl mb-3">🎉</div>
        <div>还没有错题，继续加油！</div>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="w in list"
          :key="w.key"
          class="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
        >
          <div>
            <div class="text-2xl font-bold text-gray-800">{{ w.a }} × {{ w.b }} = {{ w.a * w.b }}</div>
            <div class="text-xs text-gray-400 mt-1">错过 {{ w.count }} 次</div>
          </div>
          <div class="flex gap-2">
            <button
              @click="play(w)"
              class="w-12 h-12 rounded-full bg-orange-100 text-orange-500 text-xl active:scale-90"
            >🔊</button>
            <button
              @click="clearItem(w.key)"
              class="w-12 h-12 rounded-full bg-gray-100 text-gray-400 text-xl active:scale-90"
            >✓</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
