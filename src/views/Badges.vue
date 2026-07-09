<script setup>
import { computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import Fox from '../components/Fox.vue'
import Confetti from '../components/Confetti.vue'
import Icon from '../components/Icon.vue'
import { store } from '../utils/store'
import { BADGE_DEFS } from '../utils/badges'

const unlocked = (id) => store.state.badges.includes(id)
const unlockedCount = computed(() => BADGE_DEFS.filter((b) => unlocked(b.id)).length)
const total = BADGE_DEFS.length
const allCollected = computed(() => unlockedCount.value === total)
const progress = computed(() => Math.round((unlockedCount.value / total) * 100))

// 按分组展示
const groups = computed(() => {
  const map = {}
  for (const b of BADGE_DEFS) {
    if (!map[b.group]) map[b.group] = []
    map[b.group].push(b)
  }
  return Object.entries(map)
})

const celebrateTrigger = computed(() => (allCollected.value ? 1 : 0))

// 根据进度给称号
const title = computed(() => {
  const p = progress.value
  if (p === 100) return '九九星系守护者'
  if (p >= 75) return '星辰导师'
  if (p >= 50) return '星尘猎人'
  if (p >= 25) return '见习宇航员'
  if (p > 0) return '新星探索者'
  return '迷雾中的旅人'
})
</script>

<template>
  <div class="min-h-screen starfield">
    <Confetti :trigger="celebrateTrigger" />
    <NavBar title="星尘碎片" />
    <div class="relative z-10 p-5 max-w-md mx-auto">
      <!-- 全收集庆典 -->
      <transition name="fade">
        <div v-if="allCollected" class="mb-5 rounded-3xl bg-gradient-to-br from-candy-lemon/30 via-candy-pink/30 to-candy-lilac/30 border-2 border-candy-lemon/50 p-5 text-center shadow-glow animate-pop relative overflow-hidden">
          <div class="absolute inset-0 pointer-events-none opacity-30">
            <div class="absolute top-2 left-4 text-2xl animate-float">⭐</div>
            <div class="absolute top-6 right-6 text-xl animate-float" style="animation-delay:0.3s">✨</div>
            <div class="absolute bottom-3 left-8 text-xl animate-float" style="animation-delay:0.6s">🌟</div>
            <div class="absolute bottom-5 right-4 text-2xl animate-float" style="animation-delay:0.9s">💫</div>
          </div>
          <div class="relative">
            <Fox mood="cheer" :size="90" />
            <h2 class="font-display font-bold text-2xl text-gradient mt-2">🎉 全部收集完成！🎉</h2>
            <p class="font-han text-candy-lemon font-bold mt-1">🏆 称号：{{ title }}</p>
            <p class="font-han text-white/90 text-sm mt-3 leading-relaxed">
              小宇航员，你做到了！<br>
              九九星系的 81 颗星辰已被你全部点亮，<br>
              迷雾彻底退散，星图重新闪耀！<br>
              <span class="text-candy-pink font-bold">你是真正的九九星系守护者！</span> ✨
            </p>
            <p class="font-han text-white/70 text-xs mt-3">
              继续练习保持称号吧，星宝永远陪着你！🦊❤️
            </p>
          </div>
        </div>
      </transition>

      <!-- 头部 -->
      <div class="text-center my-4 flex flex-col items-center">
        <Fox :mood="unlockedCount >= 3 ? 'cheer' : 'happy'" :size="100" />
        <p class="text-white/90 font-han mt-2 text-sm">
          已收集 <span class="text-candy-lemon font-bold">{{ unlockedCount }}</span> / {{ total }} 颗星尘
        </p>
        <p class="text-candy-lilac font-han text-xs mt-0.5">🏅 当前称号：{{ title }}</p>
        <div class="mt-2 w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/10">
          <div
            class="h-full bg-gradient-to-r from-candy-lemon to-candy-pink transition-all duration-500"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <p class="text-white/50 text-[10px] font-han mt-1">{{ progress }}% · 还差 {{ total - unlockedCount }} 颗</p>
      </div>

      <!-- 分组展示 -->
      <div v-for="[group, badges] in groups" :key="group" class="mt-5">
        <div class="flex items-center gap-2 mb-2 px-1">
          <span class="text-candy-lemon text-xs font-han">◆</span>
          <span class="font-han text-white/80 text-xs font-bold">{{ group }}</span>
          <span class="text-white/40 text-[10px] font-han">
            {{ badges.filter((b) => unlocked(b.id)).length }}/{{ badges.length }}
          </span>
          <div class="flex-1 h-px bg-white/10"></div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="b in badges"
            :key="b.id"
            class="relative rounded-2xl p-4 text-center border-2 transition-all"
            :class="unlocked(b.id)
              ? 'bg-gradient-to-br from-white/15 to-white/5 border-candy-lemon/40 shadow-glow'
              : 'bg-white/5 border-white/10'"
          >
            <div
              class="text-5xl mb-2 transition-transform"
              :class="{ 'grayscale opacity-30': !unlocked(b.id), 'animate-pop': unlocked(b.id) }"
            >
              {{ unlocked(b.id) ? b.icon : '🔒' }}
            </div>
            <div class="font-han text-xs font-bold text-white">{{ unlocked(b.id) ? b.name : '???' }}</div>
            <div class="text-[10px] text-white/50 mt-1 font-han leading-tight">{{ b.desc }}</div>

            <div v-if="unlocked(b.id)" class="absolute top-1 right-1 w-4 h-4 rounded-full bg-candy-mint flex items-center justify-center">
              <Icon name="check" :size="10" color="#1a1140" />
            </div>
          </div>
        </div>
      </div>

      <!-- 提示 -->
      <div class="mt-6 bg-white/5 rounded-2xl p-4 border border-white/10">
        <p class="text-xs text-white/70 font-han text-center leading-relaxed">
          💡 多练习、多坚持，就能收集更多星尘碎片！<br>
          每个勋章都是你努力的小证明。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
