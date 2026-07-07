<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import { speak } from '../utils/speech'
import { toKoujue } from '../utils/koujue'
import { store } from '../utils/store'

const active = ref(null)
const flash = ref('')

function playCell(a, b) {
  const koujue = toKoujue(a, b)
  active.value = `${a}-${b}`
  speak(koujue)
  flash.value = koujue
  // 触发勋章：使用九九表
  if (store.grantBadge('opened-table')) {
    flashBadge()
  }
  setTimeout(() => (active.value = null), 600)
}

function flashBadge() {
  // 简单占位，后续在勋章页增强
}
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="p-4 max-w-md mx-auto">
      <h2 class="text-center text-lg font-bold text-orange-600 mb-3">九九乘法总表</h2>
      <p class="text-center text-xs text-gray-500 mb-4">点击任意一格，听口诀</p>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-center">
          <thead>
            <tr>
              <th class="w-10 h-10 bg-orange-100 text-orange-600 rounded-l-lg">×</th>
              <th v-for="b in 9" :key="b" class="w-10 h-10 bg-orange-100 text-orange-600 font-bold">{{ b }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in 9" :key="a">
              <td class="w-10 h-10 bg-orange-100 text-orange-600 font-bold">{{ a }}</td>
              <td
                v-for="b in 9"
                :key="b"
                @click="playCell(Math.min(a, b), Math.max(a, b))"
                class="h-10 cursor-pointer select-none transition-all active:scale-90"
                :class="[
                  active === `${Math.min(a, b)}-${Math.max(a, b)}`
                    ? 'bg-yellow-300 text-orange-700 font-bold animate-pop'
                    : 'bg-white hover:bg-yellow-50 text-gray-700'
                ]"
              >
                {{ a * b }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="flash" class="mt-6 text-center">
        <div class="inline-block bg-white shadow-lg rounded-2xl px-6 py-3 animate-pop">
          <div class="text-2xl font-bold text-orange-600">{{ flash }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
