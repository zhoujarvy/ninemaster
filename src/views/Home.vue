<script setup>
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Fox from '../components/Fox.vue'
import StarField from '../components/StarField.vue'
import Icon from '../components/Icon.vue'
import { store } from '../utils/store'
import { computed } from 'vue'

const router = useRouter()

const menus = [
  { path: '/table', icon: 'table', title: '九九总表', desc: '点哪一格读哪一句', gradient: 'from-candy-pink to-candy-peach', emoji: '🔢' },
  { path: '/unit', icon: 'book', title: '分单元学', desc: '一句一句慢慢来', gradient: 'from-candy-sky to-candy-lilac', emoji: '📚' },
  { path: '/practice', icon: 'target', title: '闯关练习', desc: '答对赚金币', gradient: 'from-candy-mint to-candy-sky', emoji: '🎯' },
  { path: '/badges', icon: 'medal', title: '我的勋章', desc: '收集星尘碎片', gradient: 'from-candy-lilac to-candy-pink', emoji: '🏅' },
  { path: '/wrong-book', icon: 'bookOpen', title: '错题本', desc: '复习错过的题', gradient: 'from-candy-peach to-candy-lemon', emoji: '📒' },
  { path: '/parent', icon: 'users', title: '家长面板', desc: '查看学习进度', gradient: 'from-space-600 to-space-700', emoji: '👨‍👩‍👧' }
]

const foxMood = computed(() => {
  if (store.state.stats.streakDays >= 3) return 'cheer'
  if (store.state.wrongBook.length > 5) return 'think'
  return 'happy'
})

const foxMessage = computed(() => {
  const d = store.state.stats.streakDays
  if (d === 0) return '欢迎来到九九星系！'
  if (d === 1) return '今天开始冒险吧！'
  if (d < 3) return `坚持了 ${d} 天，加油！`
  if (d < 7) return `好棒！${d} 天连续冒险！`
  return `太厉害了，${d} 天连续！`
})
</script>

<template>
  <div class="min-h-screen starfield">
    <StarField />
    <NavBar />
    <div class="relative z-10 p-5 max-w-md mx-auto">
      <!-- 狐狸问候 -->
      <div class="text-center my-6">
        <Fox :mood="foxMood" :size="140" />
        <div class="mt-3 inline-block bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/20">
          <p class="text-white/90 font-han text-sm">{{ foxMessage }}</p>
        </div>
        <h1 class="text-3xl font-display font-bold mt-4 text-gradient">九九乘法大师</h1>
        <p class="text-white/60 text-xs mt-1 font-han">星际冒险 · 让学习像游戏一样</p>
      </div>

      <!-- 数据展示 -->
      <div class="grid grid-cols-3 gap-2 mb-5">
        <div class="bg-white/8 backdrop-blur rounded-2xl py-3 text-center border border-white/10">
          <div class="num-display text-xl text-candy-lemon">{{ store.state.stats.streakDays }}</div>
          <div class="text-[10px] text-white/60 font-han">连续天数</div>
        </div>
        <div class="bg-white/8 backdrop-blur rounded-2xl py-3 text-center border border-white/10">
          <div class="num-display text-xl text-candy-mint">{{ store.state.stats.totalCorrect }}</div>
          <div class="text-[10px] text-white/60 font-han">答对题数</div>
        </div>
        <div class="bg-white/8 backdrop-blur rounded-2xl py-3 text-center border border-white/10">
          <div class="num-display text-xl text-candy-pink">{{ store.state.badges.length }}</div>
          <div class="text-[10px] text-white/60 font-han">星尘碎片</div>
        </div>
      </div>

      <!-- 菜单 -->
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="(m, idx) in menus"
          :key="m.path"
          @click="router.push(m.path)"
          class="relative overflow-hidden rounded-3xl p-5 text-left shadow-soft btn-pop bg-gradient-to-br border-2 border-white/10"
          :class="m.gradient"
          :style="{ animationDelay: idx * 0.05 + 's' }"
        >
          <div class="absolute -right-3 -bottom-3 text-6xl opacity-20 select-none">{{ m.emoji }}</div>
          <div class="relative">
            <div class="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center mb-2">
              <Icon :name="m.icon" :size="26" color="white" />
            </div>
            <div class="font-display font-bold text-lg text-white drop-shadow">{{ m.title }}</div>
            <div class="text-xs text-white/85 font-han mt-0.5">{{ m.desc }}</div>
          </div>
        </button>
      </div>

      <div class="mt-8 text-center text-[10px] text-white/40 font-han">
        Made with ♥ for 小朋友 · 纯前端 H5 应用
      </div>
    </div>
  </div>
</template>
