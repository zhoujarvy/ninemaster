<script setup>
import { computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import Fox from '../components/Fox.vue'
import Icon from '../components/Icon.vue'
import { store } from '../utils/store'
import { speakKoujue, speakEquation } from '../utils/speech'

// 用 computed 确保每次 store 变更后视图刷新
const list = computed(() => store.state.wrongBook)

function playKoujue(w) {
  speakKoujue(w.a, w.b)
}
function playEquation(w) {
  speakEquation(w.a, w.b)
}
function clearItem(key) {
  store.removeWrong(key)
}
</script>

<template>
  <div class="min-h-screen starfield">
    <NavBar title="错题本" />
    <div class="relative z-10 p-5 max-w-md mx-auto">
      <div class="text-center my-4 flex flex-col items-center">
        <Fox mood="think" :size="100" />
        <p class="text-white/90 font-han mt-2 text-sm">
          错题也是好老师，多听几遍就记住啦
        </p>
      </div>

      <div v-if="list.length === 0" class="text-center py-12">
        <div class="text-7xl mb-3 animate-float">🎉</div>
        <p class="text-white/80 font-han">还没有错题，</p>
        <p class="text-candy-lemon font-han font-bold mt-1">继续保持，太棒了！</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="w in [...list].sort((a,b) => b.count - a.count)"
          :key="w.key"
          class="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 flex items-center gap-3"
        >
          <!-- 红色警告徽章 -->
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-candy-pink to-candy-peach flex items-center justify-center flex-shrink-0 shadow-soft">
            <span class="num-display text-lg text-white font-bold">{{ w.count }}</span>
          </div>

          <div class="flex-1">
            <div class="num-display text-2xl text-white">
              {{ w.a }} × {{ w.b }} = <span class="text-candy-lemon">{{ w.a * w.b }}</span>
            </div>
            <div class="text-xs text-white/60 font-han mt-0.5">错过 {{ w.count }} 次</div>
          </div>

          <div class="flex gap-2 flex-shrink-0">
            <button
              @click="playKoujue(w)"
              class="w-12 h-12 rounded-2xl bg-candy-sky/20 border border-candy-sky/40 text-candy-sky flex items-center justify-center btn-pop"
              title="读口诀"
            >
              <Icon name="speaker" :size="22" color="#7ec8ff" />
            </button>
            <button
              @click="clearItem(w.key)"
              class="w-12 h-12 rounded-2xl bg-candy-pink/20 border border-candy-pink/40 text-candy-pink flex items-center justify-center btn-pop"
              title="删除错题"
            >
              <Icon name="trash" :size="22" color="#ff8fb1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
