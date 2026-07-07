<script setup>
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { store } from '../utils/store'

const router = useRouter()

const menus = [
  { path: '/table', icon: '🔢', title: '九九总表', desc: '点哪一格读哪一句', color: 'from-orange-400 to-pink-400' },
  { path: '/unit', icon: '📚', title: '分单元学', desc: '一句一句慢慢来', color: 'from-blue-400 to-cyan-400' },
  { path: '/practice', icon: '🎯', title: '闯关练习', desc: '答对赚金币', color: 'from-green-400 to-emerald-400' },
  { path: '/badges', icon: '🏅', title: '我的勋章', desc: '看看收集了几个', color: 'from-purple-400 to-fuchsia-400' },
  { path: '/wrong-book', icon: '📒', title: '错题本', desc: '复习错过的题', color: 'from-red-400 to-orange-400' },
  { path: '/parent', icon: '👨‍👩‍👧', title: '家长面板', desc: '查看进度', color: 'from-slate-400 to-gray-500' }
]
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="p-4 max-w-md mx-auto">
      <div class="my-6 text-center">
        <div class="text-6xl mb-2">🚀</div>
        <h1 class="text-2xl font-bold text-orange-600">一起学乘法吧！</h1>
        <p class="text-gray-500 mt-1">点击下方任意一个开始</p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="m in menus"
          :key="m.path"
          @click="router.push(m.path)"
          class="rounded-2xl p-4 text-left text-white shadow-md active:scale-95 transition-transform bg-gradient-to-br"
          :class="m.color"
        >
          <div class="text-3xl mb-1">{{ m.icon }}</div>
          <div class="font-bold text-lg">{{ m.title }}</div>
          <div class="text-xs text-white/90">{{ m.desc }}</div>
        </button>
      </div>

      <div class="mt-6 text-center text-xs text-gray-400">
        已坚持 {{ store.state.stats.streakDays }} 天 · 累计答对 {{ store.state.stats.totalCorrect }} 题
      </div>
    </div>
  </div>
</template>
