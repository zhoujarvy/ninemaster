// 基于 Web Speech API 的语音朗读
// 优先使用中文语音，回退到默认语音

let cachedVoices = []

function loadVoices() {
  return new Promise((resolve) => {
    const v = window.speechSynthesis.getVoices()
    if (v.length) {
      cachedVoices = v
      resolve(v)
      return
    }
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices()
      resolve(cachedVoices)
    }
  })
}

function pickChineseVoice() {
  const prefer = cachedVoices.find((v) => /zh(-|_)?CN/i.test(v.lang) && /female|ting|xiao|hui/i.test(v.name))
  if (prefer) return prefer
  const zh = cachedVoices.find((v) => /^zh/i.test(v.lang))
  return zh || null
}

export async function ensureVoices() {
  if (!cachedVoices.length) await loadVoices()
}

export function speak(text, { rate = 0.9, pitch = 1.1 } = {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('当前浏览器不支持语音合成')
    return
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = rate
  u.pitch = pitch
  const voice = pickChineseVoice()
  if (voice) u.voice = voice
  window.speechSynthesis.speak(u)
}

export function stopSpeak() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

// 初始化时预加载语音列表
ensureVoices()
