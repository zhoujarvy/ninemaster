<script setup>
// Mingcute 风格圆润 SVG 图标
// props: name, size, color
defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 28 },
  color: { type: String, default: 'currentColor' }
})

// 所有图标 24x24 viewBox, 描边 1.8, 圆角端点, Mingcute 风格
const paths = {
  table: '<path d="M3 3h18v18H3V3zm0 6h18M9 21V9"/><path d="M3 3h18v18H3z" stroke="none"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2V5z"/><path d="M19 7v14M9 7h7M9 11h7"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  medal: '<circle cx="12" cy="14" r="6"/><path d="M9 9l-2-6M15 9l2-6M12 11l1.5 3 3 .5-2.2 2 .5 3.5-2.8-1.5L9 23l.5-3.5-2.2-2 3-.5L12 11z"/>',
  bookOpen: '<path d="M12 7c-2-2-5-2-7-1v13c2-1 5-1 7 1 2-2 5-2 7-1V6c-2-1-5-1-7 1z"/><path d="M12 7v13"/>',
  users: '<circle cx="9" cy="9" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M15 20c0-2 1.5-4 4-4s4 2 4 4"/>',
  star: '<path d="M12 3l2.5 5 5.5 1-4 4 1 5.5L12 16l-5 2.5 1-5.5-4-4 5.5-1L12 3z"/>',
  rocket: '<path d="M12 3c3 2 5 5 5 9l-2 2H9l-2-2c0-4 2-7 5-9z"/><path d="M9 14l-3 4 3-1M15 14l3 4-3-1"/><circle cx="12" cy="9" r="1.5"/>',
  planet: '<circle cx="12" cy="12" r="6"/><ellipse cx="12" cy="12" rx="11" ry="3" transform="rotate(-25 12 12)"/>',
  coin: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/>',
  arrowLeft: '<path d="M15 5l-7 7 7 7"/>',
  arrowRight: '<path d="M9 5l7 7-7 7"/>',
  speaker: '<path d="M5 9v6h4l5 4V5L9 9H5z"/><path d="M16 9c1 1 1 5 0 6M18 7c2 2 2 8 0 10"/>',
  check: '<path d="M5 12l5 5L20 6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6l3 3M21 12a9 9 0 0 1-15 6l-3-3"/><path d="M18 3v6h-6M6 21v-6h6"/>',
  flame: '<path d="M12 3c2 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3-2-3 0-6 0-8z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  trophy: '<path d="M7 4h10v3a5 5 0 0 1-10 0V4z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M9 17h6M10 17v-2M14 17v-2M8 21h8"/>',
  download: '<path d="M12 3v12M7 11l5 4 5-4M5 21h14"/>',
  home: '<path d="M3 12l9-8 9 8M5 10v10h14V10"/>',
  fire: '<path d="M12 3c2 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3-2-3 0-6 0-8z"/>'
}

function getSvg(name, color, size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ''}</svg>`
}
</script>

<template>
  <span class="inline-flex items-center justify-center" v-html="getSvg(name, color, size)"></span>
</template>
