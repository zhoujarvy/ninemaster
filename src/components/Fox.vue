<script setup>
// 太空小狐狸吉祥物
// props:
//   mood: 'happy' | 'cheer' | 'think' | 'sad' - 控制表情
//   size: 数字 - px 宽高
defineProps({
  mood: { type: String, default: 'happy' },
  size: { type: Number, default: 120 }
})

// 表情参数
const moodMap = {
  happy: { eyeY: 50, mouth: 'smile', blush: true },
  cheer: { eyeY: 50, mouth: 'open', blush: true },
  think: { eyeY: 48, mouth: 'tiny', blush: false },
  sad: { eyeY: 52, mouth: 'sad', blush: false }
}
</script>

<template>
  <div class="inline-block animate-float" :style="{ width: size + 'px', height: size + 'px' }">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 火箭尾焰 (装饰) -->
      <ellipse cx="50" cy="92" rx="14" ry="6" fill="#ff8fb1" opacity="0.6">
        <animate attributeName="ry" values="6;3;6" dur="0.6s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="50" cy="95" rx="10" ry="5" fill="#ffe066" opacity="0.8">
        <animate attributeName="ry" values="5;2;5" dur="0.5s" repeatCount="indefinite"/>
      </ellipse>

      <!-- 头部 -->
      <!-- 左耳 -->
      <path d="M 22 35 L 30 12 L 38 30 Z" fill="#ff8c4a"/>
      <path d="M 26 28 L 30 18 L 34 28 Z" fill="#ffd6b8"/>
      <!-- 右耳 -->
      <path d="M 78 35 L 70 12 L 62 30 Z" fill="#ff8c4a"/>
      <path d="M 74 28 L 70 18 L 66 28 Z" fill="#ffd6b8"/>

      <!-- 脸 -->
      <circle cx="50" cy="50" r="30" fill="#ff8c4a"/>
      <!-- 脸部白色腹毛 -->
      <ellipse cx="50" cy="58" rx="20" ry="18" fill="#fff5e8"/>

      <!-- 太空头盔 (透明球) -->
      <circle cx="50" cy="50" r="32" fill="rgba(180,200,255,0.18)" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
      <!-- 高光 -->
      <ellipse cx="42" cy="38" rx="6" ry="4" fill="rgba(255,255,255,0.5)"/>

      <!-- 眼睛 -->
      <g v-if="mood === 'happy'">
        <ellipse cx="40" cy="50" rx="3" ry="4" fill="#1a1140"/>
        <ellipse cx="60" cy="50" rx="3" ry="4" fill="#1a1140"/>
        <!-- 眼睛高光 -->
        <circle cx="41" cy="49" r="1" fill="white"/>
        <circle cx="61" cy="49" r="1" fill="white"/>
      </g>
      <g v-else-if="mood === 'cheer'">
        <!-- 弯弯的笑眼 -->
        <path d="M 37 50 Q 40 46 43 50" stroke="#1a1140" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M 57 50 Q 60 46 63 50" stroke="#1a1140" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
      <g v-else-if="mood === 'sad'">
        <ellipse cx="40" cy="52" rx="3" ry="4" fill="#1a1140"/>
        <ellipse cx="60" cy="52" rx="3" ry="4" fill="#1a1140"/>
        <!-- 泪滴 -->
        <ellipse cx="36" cy="56" rx="1.5" ry="2.5" fill="#7ec8ff"/>
      </g>
      <g v-else>
        <circle cx="40" cy="50" r="3" fill="#1a1140"/>
        <circle cx="60" cy="50" r="3" fill="#1a1140"/>
      </g>

      <!-- 腮红 -->
      <ellipse v-if="moodMap[mood].blush" cx="35" cy="58" rx="3.5" ry="2.5" fill="#ff8fb1" opacity="0.7"/>
      <ellipse v-if="moodMap[mood].blush" cx="65" cy="58" rx="3.5" ry="2.5" fill="#ff8fb1" opacity="0.7"/>

      <!-- 鼻子 -->
      <ellipse cx="50" cy="58" rx="2.5" ry="1.8" fill="#1a1140"/>

      <!-- 嘴巴 -->
      <path v-if="mood === 'happy'" d="M 45 64 Q 50 70 55 64" stroke="#1a1140" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse v-else-if="mood === 'cheer'" cx="50" cy="66" rx="5" ry="3" fill="#1a1140"/>
      <path v-else-if="mood === 'sad'" d="M 45 68 Q 50 64 55 68" stroke="#1a1140" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path v-else d="M 47 65 L 53 65" stroke="#1a1140" stroke-width="2" fill="none" stroke-linecap="round"/>

      <!-- 头盔顶部星星徽章 -->
      <g transform="translate(50 18)">
        <path d="M 0 -5 L 1.5 -1.5 L 5 0 L 1.5 1.5 L 0 5 L -1.5 1.5 L -5 0 L -1.5 -1.5 Z" fill="#ffe066"/>
      </g>
    </svg>
  </div>
</template>
