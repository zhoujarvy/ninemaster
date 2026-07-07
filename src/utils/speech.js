// 基于预生成 mp3 的语音播放
// 音频文件由 scripts/gen_audio.py 通过 edge-tts 生成, 放在 public/audio/

let currentAudio = null

function playFile(name) {
  // 停止当前正在播放的音频
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
  }

  const audio = new Audio(`./audio/${name}.mp3`)
  audio.playbackRate = 1
  currentAudio = audio

  return audio.play().catch((e) => {
    console.warn('音频播放失败:', name, e)
  })
}

// 朗读口诀（小九九，自动归一化为小数在前）
// speakKoujue(3, 4) 和 speakKoujue(4, 3) 都朗读"三四十二"
export function speakKoujue(a, b) {
  const x = Math.min(a, b)
  const y = Math.max(a, b)
  return playFile(`kj_${x}_${y}`)
}

// 朗读算式, 如 "3 乘 4 等于 12"（原样朗读，不归一化）
export function speakEquation(a, b) {
  return playFile(`eq_${a}_${b}`)
}

// 朗读数字
export function speakNumber(n) {
  return playFile(`num_${n}`)
}

// 播放鼓励语
export function speakPhrase(name) {
  return playFile(name)
}

// 兼容旧接口: speak(text) - 不再支持任意文本朗读
// 保留导出避免破坏旧引用
export function speak(_text) {
  console.warn('speak(text) 已弃用, 请使用 speakKoujue/speakEquation/speakPhrase')
}

export function stopSpeak() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = 0
  }
}
