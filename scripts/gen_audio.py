#!/usr/bin/env python3
"""
批量生成九九乘法口诀的 TTS 音频
发音人: zh-CN-XiaoyiNeural (女童声, 活泼)
输出目录: public/audio/
"""
import asyncio
import os
import sys
import edge_tts

# 发音人选项:
#   zh-CN-XiaoyiNeural  女童声 (活泼)
#   zh-CN-YunxiNeural   男童声 (阳光)
#   zh-CN-XiaoyiNeural  默认
VOICE = "zh-CN-XiaoyiNeural"
RATE = "+0%"      # 语速
PITCH = "+0Hz"    # 音调

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio")

CN_NUMS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]

def to_cn(n):
    if n <= 10:
        return CN_NUMS[n]
    if n < 20:
        return "十" + CN_NUMS[n - 10]
    tens = n // 10
    ones = n % 10
    if ones == 0:
        return CN_NUMS[tens] + "十"
    return CN_NUMS[tens] + "十" + CN_NUMS[ones]

def to_koujue(a, b):
    c = a * b
    prefix = "得" if c < 10 else ""
    return f"{to_cn(a)}{to_cn(b)}{prefix}{to_cn(c)}"

async def synth_one(text, out_path):
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
    await communicate.save(out_path)

async def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    tasks = []

    # 1. 45 句口诀 (小九九, 小数在前去重): kj_3_4.mp3 -> "三四十二"
    #    a<=b, 共 45 句
    for a in range(1, 10):
        for b in range(a, 10):
            text = to_koujue(a, b)
            out = os.path.join(OUT_DIR, f"kj_{a}_{b}.mp3")
            tasks.append((text, out))

    # 2. 算式朗读: eq_3_4.mp3 -> "3 乘 4 等于 12"
    for a in range(1, 10):
        for b in range(1, 10):
            text = f"{a} 乘 {b} 等于 {a*b}"
            out = os.path.join(OUT_DIR, f"eq_{a}_{b}.mp3")
            tasks.append((text, out))

    # 3. 鼓励语
    praises = [
        ("correct_1", "答对了，真棒！"),
        ("correct_2", "厉害！继续加油！"),
        ("correct_3", "太聪明啦！"),
        ("wrong_1", "没关系，再试一次。"),
        ("wrong_2", "别灰心，慢慢来。"),
        ("encourage_1", "你做得很棒！"),
        ("encourage_2", "继续努力哦！"),
        ("badge_unlock", "恭喜获得新勋章！"),
        ("start", "我们开始吧！"),
        ("finish", "太棒了，全部完成！"),
    ]
    for name, text in praises:
        tasks.append((text, os.path.join(OUT_DIR, f"{name}.mp3")))

    # 数字朗读 0-81
    for n in range(0, 82):
        tasks.append((str(n), os.path.join(OUT_DIR, f"num_{n}.mp3")))

    print(f"共 {len(tasks)} 个音频需要生成")

    # 限制并发数, 避免被限流
    SEM = asyncio.Semaphore(5)
    async def run_one(text, out):
        async with SEM:
            try:
                await synth_one(text, out)
                return True
            except Exception as e:
                print(f"FAIL: {text} -> {e}", file=sys.stderr)
                return False

    results = await asyncio.gather(*[run_one(t, o) for t, o in tasks])
    ok = sum(1 for r in results if r)
    print(f"成功 {ok} / {len(tasks)}")

if __name__ == "__main__":
    asyncio.run(main())
