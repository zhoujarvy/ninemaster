<script setup>
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Fox from '../components/Fox.vue'
import StarField from '../components/StarField.vue'
import Icon from '../components/Icon.vue'
import { store } from '../utils/store'
import { computed, ref } from 'vue'

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

// —— 故事背景 & 狐狸对话 ——
const showStory = ref(false)

// 狐狸台词池，点击狐狸循环播放
const storyLines = [
  '我是小狐狸星宝，来自九九星系！🦊',
  '九九星系被迷雾笼罩，乘法口诀是点亮星辰的魔法！✨',
  '每答对一道题，就有一颗星星被重新点亮！⭐',
  '收集星尘碎片，就能唤醒沉睡的九九星图！🌟',
  '我们一起冒险，把整个星系重新照亮吧！🚀',
  '别怕错，错了的题星宝会帮你记在小本子上～📒',
  '坚持打卡，星宝会陪你一起成长！❤️'
]
const lineIdx = ref(0)
const currentLine = ref(storyLines[0])

function tapFox() {
  lineIdx.value = (lineIdx.value + 1) % storyLines.length
  currentLine.value = storyLines[lineIdx.value]
}
</script>

<template>
  <div class="min-h-screen starfield">
    <StarField />
    <NavBar />
    <div class="relative z-10 p-5 max-w-md mx-auto">
      <!-- 狐狸问候 -->
      <div class="text-center my-6">
        <button @click="tapFox" class="relative active:scale-95 transition-transform" aria-label="点点星宝">
          <Fox :mood="foxMood" :size="140" />
          <span class="absolute -top-1 -right-1 text-xs bg-candy-pink text-white px-2 py-0.5 rounded-full font-han animate-pop">点我</span>
        </button>
        <transition name="bubble" mode="out-in">
          <div :key="currentLine" class="mt-3 inline-block bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/20 max-w-[90%]">
            <p class="text-white/95 font-han text-sm leading-relaxed">{{ currentLine }}</p>
          </div>
        </transition>
        <p class="text-white/40 text-[10px] font-han mt-1.5">点点星宝，听故事～</p>
        <h1 class="text-3xl font-display font-bold mt-3 text-gradient">九九乘法大师</h1>
        <p class="text-white/60 text-xs mt-1 font-han">星际冒险 · 让学习像游戏一样</p>

        <button
          @click="showStory = true"
          class="mt-3 inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-4 py-1.5 rounded-full border border-white/20 text-xs font-han text-white/80 btn-pop"
        >
          <Icon name="book" :size="14" color="#ffe066" />
          <span>阅读冒险故事</span>
        </button>
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

    <!-- 冒险故事面板 -->
    <transition name="fade">
      <div
        v-if="showStory"
        class="fixed inset-0 z-50 bg-space-900/80 backdrop-blur-sm flex items-center justify-center p-5"
        @click.self="showStory = false"
      >
        <div class="bg-gradient-to-br from-space-700 to-space-900 rounded-3xl border-2 border-candy-lilac/40 shadow-glow p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto animate-pop">
          <div class="text-center mb-4">
            <Fox mood="cheer" :size="80" />
            <h2 class="font-display font-bold text-xl text-gradient mt-2">星宝的冒险故事</h2>
          </div>

          <div class="space-y-3 font-han text-sm text-white/90 leading-relaxed">
            <p class="bg-white/5 rounded-2xl p-3 border border-white/10">
              🌌 很久很久以前，<span class="text-candy-lemon font-bold">九九星系</span> 是银河里最闪亮的地方，81 颗星星连成美丽的乘法星图。
            </p>
            <p class="bg-white/5 rounded-2xl p-3 border border-white/10">
              😈 一天，迷雾怪兽<span class="text-candy-pink font-bold">吞掉了星光</span>，整个星系变暗了，星星们一颗颗熄灭……
            </p>
            <p class="bg-white/5 rounded-2xl p-3 border border-white/10">
              🦊 小狐狸<span class="text-candy-peach font-bold">星宝</span>从远方赶来，它说："只要学会九九口诀，就能重新点亮星辰！"
            </p>
            <p class="bg-white/5 rounded-2xl p-3 border border-white/10">
              ✨ 每答对一道题，就有一颗<span class="text-candy-lemon font-bold">星星</span>被点亮；
              每收集一颗<span class="text-candy-mint font-bold">星尘碎片</span>，迷雾就退散一分。
            </p>
            <p class="bg-gradient-to-r from-candy-pink/20 to-candy-lilac/20 rounded-2xl p-3 border border-candy-pink/30">
              🚀 小宇航员，你就是被选中的<span class="text-candy-lemon font-bold">星辰守护者</span>！
              让我们一起把九九星系重新照亮吧！
            </p>
          </div>

          <button
            @click="showStory = false"
            class="w-full mt-5 bg-gradient-to-r from-candy-pink to-candy-lilac text-white font-display font-bold py-3 rounded-2xl btn-pop"
          >
            出发冒险！
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.bubble-enter-active, .bubble-leave-active { transition: all 0.25s ease; }
.bubble-enter-from { opacity: 0; transform: translateY(6px); }
.bubble-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
