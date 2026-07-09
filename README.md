# 九九乘法大师 (ninemaster)

> 帮助 7-8 岁孩子学习乘法口诀的纯前端 H5 应用。零后端、零配置、离线可用。

## ✨ 功能一览

| 模块 | 说明 |
|------|------|
| **九九总表** | 小九九 45 句，三角形布局，点击任意格朗读口诀；支持朗读全部 45 句，离开页面自动停止 |
| **分单元学** | 1-9 各单元单独学习，配可视化 emoji 表示乘法意义 |
| **闯关练习** | 选择题练习，连击奖励金币，答对撒花动画；**记录最长连击与最高得分**，结束弹窗显示是否超越历史最佳 |
| **星尘碎片** | **24 种勋章**分 5 组（探索/连击/挑战/坚持/单元/成就），称号系统，全收集庆典 |
| **错题本** | 自动记录错题，按错误次数排序，复习更高效 |
| **家长面板** | 密码进入，查看学习数据，支持导出备份和修改密码 |
| **冒险故事** | 首页点击小狐狸星宝听故事，阅读完整冒险背景，激发学习兴趣 |

## 🎨 设计理念

- **小九九规则**：小数在前，大数在后（如 `3×4` 和 `4×3` 都读"三四十二"），45 句而非 81 句
- **糖果马卡龙 + 深空底**：糖果色在深紫蓝底色上跳脱，护眼又有冒险感
- **太空小狐狸吉祥物**：贯穿全应用的橙白小狐狸，4 种表情反馈答题状态
- **大字大按钮**：所有可点击元素 ≥ 56px，适合孩子手指
- **正向反馈**：答对撒彩纸、答错只摇晃不严厉提示，避免打击信心
- **故事化叙事**：太空小狐狸"星宝"陪伴冒险，九九星系被迷雾笼罩，每答对一道题就点亮一颗星，激励孩子持续探索
- **超越自我**：闯关记录最长连击和最高得分，下次练习时挑战自己之前的成绩
- **成就系统**：24 种星尘碎片 + 称号体系，全部收集后触发庆典鼓励

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm run dev
# 浏览器打开 http://localhost:5173

# 构建生产版本
npm run build
# 产物在 dist/ 目录

# 预览构建产物
npm run preview
```

## 📦 部署

构建后的 `dist/` 是纯静态文件，可托管到任何静态服务器。

### Cloudflare Pages（推荐）

直接连接 GitHub 仓库，设置：
- 构建命令：`npm run build`
- 输出目录：`dist`

推送代码后自动构建部署，无需手动操作。

### Vercel / Netlify

同样连接仓库，设置：
- 构建命令：`npm run build`
- 输出目录：`dist`

## 🛠 技术栈

- **Vue 3** + **Vue Router 4** — 渐进式前端框架
- **Vite 6** — 下一代构建工具
- **Tailwind CSS 3** — 原子化 CSS
- **Web Audio API** — 通过 `<audio>` 播放预生成音频
- **Edge TTS**（构建期）— 微软免费 TTS 生成女童声朗读

## 📁 项目结构

```
ninemaster/
├── public/
│   └── audio/              # 预生成的 TTS 音频 (218 个 mp3)
│       ├── kj_<a>_<b>.mp3  # 口诀朗读 (45 个, 小九九 a<=b)
│       ├── eq_<a>_<b>.mp3  # 算式朗读 (81 个, a*1..a*9)
│       ├── num_<n>.mp3     # 数字朗读 (82 个, 0-81, 备用)
│       └── *.mp3           # 鼓励语、音效 (10 个)
├── scripts/
│   └── gen_audio.py        # 音频生成脚本 (基于 edge-tts)
├── src/
│   ├── components/         # 通用组件
│   │   ├── NavBar.vue
│   │   ├── Fox.vue         # 太空小狐狸吉祥物
│   │   ├── Icon.vue        # Mingcute 风格 SVG 图标
│   │   ├── StarField.vue   # 星空背景装饰
│   │   └── Confetti.vue    # 撒彩纸动效
│   ├── views/              # 页面
│   │   ├── Home.vue
│   │   ├── MultiplicationTable.vue
│   │   ├── UnitList.vue
│   │   ├── UnitDetail.vue
│   │   ├── Practice.vue
│   │   ├── Badges.vue
│   │   ├── WrongBook.vue
│   │   └── Parent.vue
│   ├── utils/
│   │   ├── koujue.js       # 中文数字转换 + 小九九口诀
│   │   ├── speech.js       # 音频播放封装
│   │   ├── store.js        # 基于 localStorage 的状态存储
│   │   └── badges.js       # 勋章定义
│   ├── App.vue
│   ├── main.js
│   ├── router/index.js
│   └── style.css
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🔊 音频生成（可选）

仓库已包含预生成音频。如需重新生成（如换发音人、调整语速）：

```bash
# 1. 安装 edge-tts (Python)
pip3 install edge-tts

# 2. 修改 scripts/gen_audio.py 中的 VOICE 参数
#    推荐发音人：
#    - zh-CN-XiaoyiNeural  (女童声, 活泼, 默认)
#    - zh-CN-YunxiNeural   (男童声, 阳光)
#    - zh-CN-XiaoxiaoNeural(女声, 自然)
#    - zh-CN-YunyangNeural (男声, 沉稳)

# 3. 运行脚本
python3 scripts/gen_audio.py
```

可选发音人列表见 [Edge TTS 官方文档](https://learn.microsoft.com/zh-cn/azure/ai-services/speech-service/language-support)。

## 📖 设计决策

### 为什么用"小九九"？

中国传统的"小九九"乘法表只背诵 45 句（小数在前，去重），而非 81 句。优势：
1. **减少一半记忆负担**：从 81 → 45 句
2. **统一口诀**：`3×4` 和 `4×3` 共用"三四十二"，符合乘法交换律
3. **历史传承**：中国从春秋时代起就用小九九（《管子》有载）

### 为什么不用浏览器 SpeechSynthesis？

iOS Safari 对 `SpeechSynthesis` 的支持不稳定，常出现：
- 首次加载无声
- 多次播放卡死
- 中文发音人缺失

预生成音频彻底解决这些问题，且支持离线、自然音质。

### 为什么不用后端？

- 数据完全私有（孩子学习进度不上传）
- 部署零成本（GitHub Pages 免费）
- 离线可用（家长在地铁、飞机上也能给孩子用）

## 📄 License

MIT — 任意使用、修改、分发。

## 🤝 贡献

欢迎提 Issue 和 PR。开源目的是帮助更多家长和孩子，让学习乘法变成一件快乐的事。
