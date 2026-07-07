# 九九乘法大师 · 技术文档

本文档面向开发者，详细介绍架构设计、模块职责、扩展指南。

## 一、架构总览

### 技术栈选型理由

| 选型 | 理由 |
|------|------|
| **Vue 3 + Composition API** | 学习曲线平缓，组合式 API 逻辑复用好 |
| **Vite** | 启动快、HMR 即时、构建产物小 |
| **Tailwind CSS** | 原子化 CSS，开发儿童 UI 时配色/间距/动画效率高 |
| **Vue Router (hash 模式)** | 部署到 GitHub Pages 不需要服务器配置 |
| **localStorage 状态层** | 数据量小（< 50KB），无需引入 Pinia/Vuex |
| **预生成 mp3** | 跨平台稳定，避免浏览器 TTS 兼容性问题 |

### 数据流

```
┌─────────────────────────────────────────────────────────┐
│                  Vue 组件 (views/)                       │
│  Home / Table / Unit / Practice / Badges / WrongBook / Parent
└──────────────────┬──────────────────────────────────────┘
                   │ 调用
                   ▼
┌─────────────────────────────────────────────────────────┐
│              utils/ (业务逻辑层)                          │
│  koujue.js  speech.js  store.js  badges.js              │
└──────┬───────────────────────┬──────────────────────────┘
       │                       │
       ▼                       ▼
┌─────────────┐         ┌──────────────────┐
| 口诀生成算法 |         | localStorage     |
| (纯函数)     |         | (ninemaster:state) |
└─────────────┘         └──────────────────┘
```

### 路由设计

所有路由使用 `createWebHashHistory`（hash 模式），保证 GitHub Pages 部署无需配置 fallback。

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | `Home.vue` | 主菜单 + 数据概览 |
| `/table` | `MultiplicationTable.vue` | 九九总表（三角形小九九） |
| `/unit` | `UnitList.vue` | 单元列表（9 颗星球） |
| `/unit/:n` | `UnitDetail.vue` | 单元详情（动态路由） |
| `/practice` | `Practice.vue` | 闯关练习 |
| `/badges` | `Badges.vue` | 勋章墙 |
| `/wrong-book` | `WrongBook.vue` | 错题本 |
| `/parent` | `Parent.vue` | 家长面板（密码门） |

## 二、核心模块详解

### 1. 口诀工具 `utils/koujue.js`

纯函数模块，负责中文数字转换和口诀生成。

**关键函数**：

```js
// 数字 → 中文 (1-99)
toChinese(1)    // "一"
toChinese(12)   // "十二"
toChinese(20)   // "二十"
toChinese(45)   // "四十五"

// 任意 (a,b) → 小九九口诀（自动归一化）
toKoujue(3, 4)  // "三四十二"
toKoujue(4, 3)  // "三四十二"  ← 同一结果

// 归一化
normalizePair(4, 3)  // [3, 4]

// 生成所有 45 句口诀
genAllKoujue()  // [{a:1, b:1, ...}, {a:1, b:2, ...}, ..., {a:9, b:9, ...}]

// 生成单元 n 的 9 句口诀（小九九规则）
genUnitKoujue(6)
// 返回: [
//   {a:1, b:6}, {a:2, b:6}, {a:3, b:6}, {a:4, b:6}, {a:5, b:6}, {a:6, b:6},
//   {a:6, b:7}, {a:6, b:8}, {a:6, b:9}
// ]
```

**单元 n 的展示规则**：
- 当 `b <= n`：展示 `b × n`（b 在前，n 在后）
- 当 `b > n`：展示 `n × b`（n 在前，b 在后）
- 始终保持"小数在前"

### 2. 音频播放 `utils/speech.js`

封装预生成 mp3 的播放，提供 4 个语义化接口：

```js
speakKoujue(3, 4)    // 朗读"三四十二"（归一化查找 kj_3_4.mp3）
speakEquation(3, 4)  // 朗读"3 乘 4 等于 12"（原样查找 eq_3_4.mp3）
speakNumber(12)      // 朗读"12"（查找 num_12.mp3）
speakPhrase('correct_1')  // 播放预定义鼓励语
```

**实现细节**：
- 单例 `currentAudio`：同一时刻只播放一个音频
- 调用新音频时自动停止当前播放
- 返回 `Promise`，调用方可链式处理

**音频文件命名约定**：
| 类型 | 命名 | 数量 | 内容 |
|------|------|------|------|
| 口诀 | `kj_<小>_<大>.mp3` | 45 | "三四十二" |
| 算式 | `eq_<a>_<b>.mp3` | 81 | "a 乘 b 等于 c" |
| 数字 | `num_<n>.mp3` | 82 | "n" (0-81) |
| 短语 | `<name>.mp3` | 10 | 鼓励语、音效 |

### 3. 状态存储 `utils/store.js`

基于 `localStorage` 的响应式状态层，所有数据持久化在 `ninemaster:state` 键下。

**数据结构**：

```js
{
  coins: 0,                    // 金币总数
  badges: ['opened-table'],    // 已解锁勋章 ID 数组
  wrongBook: [                 // 错题列表（归一化后）
    { key: '3x4', a: 3, b: 4, count: 2, lastAt: 1690000000000 }
  ],
  parentPassword: '1688',      // 家长面板密码（可修改）
  stats: {
    totalAnswered: 0,          // 累计答题数
    totalCorrect: 0,           // 累计答对数
    unitProgress: {            // 各单元独立统计
      3: { answered: 10, correct: 8 }
    },
    lastOpenDate: '2026-07-08', // ISO 日期字符串
    streakDays: 1               // 连续打卡天数
  }
}
```

**关键 API**：
- `store.addCoins(n)` — 增加金币
- `store.addWrong({a, b})` — 自动归一化添加错题
- `store.removeWrong(key)` — 删除错题
- `store.recordAnswer(unit, correct)` — 记录一次答题（同步刷新 streak）
- `store.grantBadge(id)` — 解锁勋章（去重）
- `store.setParentPassword(pwd)` — 修改家长密码

**连续打卡逻辑**：
- 每天首次调用 `recordAnswer` 触发检查
- 若昨天有记录 → `streakDays + 1`
- 否则 → `streakDays = 1`

### 4. 勋章系统 `utils/badges.js`

勋章定义数组，每个勋章 5 个字段：

```js
{
  id: 'opened-table',        // 唯一 ID
  icon: '👀',                 // emoji
  name: '好奇宝宝',           // 中文名
  desc: '打开了九九总表',     // 解锁条件描述
  color: 'bg-blue-100'       // Tailwind 背景色类
}
```

**已定义勋章**（6 个）：
1. `opened-table` — 打开九九总表
2. `first-correct` — 首次答对
3. `unit-1-done` — 完成 1 的口诀练习
4. `streak-3` — 连续 3 天打开
5. `perfect-10` — 一次答对 10 题
6. `all-units` — 完成全部 9 个单元

**解锁触发点**：在对应业务代码中调用 `store.grantBadge(id)`，返回 `true` 表示首次解锁（可用于弹窗提示）。

## 三、组件设计

### `Fox.vue` — 太空小狐狸吉祥物

**Props**：
- `mood: 'happy' | 'cheer' | 'think' | 'sad'` — 表情
- `size: Number` — px 宽高（默认 120）

**SVG 结构**：
- 火箭尾焰（CSS 动画呼吸）
- 双耳（橙白配色）
- 圆脸 + 白色腹毛
- 太空头盔（半透明球 + 高光）
- 眼睛（4 种表情切换）
- 腮红（happy/cheer 显示）
- 头盔星星徽章

### `Icon.vue` — Mingcute 风格图标

**Props**：`name`, `size`, `color`

**已内置图标**：`table`, `book`, `target`, `medal`, `bookOpen`, `users`, `star`, `rocket`, `planet`, `coin`, `arrowLeft`, `arrowRight`, `speaker`, `check`, `x`, `refresh`, `flame`, `lock`, `trophy`, `download`, `home`, `fire`

**风格**：1.8 描边宽度，圆角端点，24×24 viewBox。

### `StarField.vue` — 星空背景

CSS 渐变 + 点状星星 + 漂浮装饰星球，纯装饰无交互。

### `Confetti.vue` — 撒彩纸动效

监听 `trigger` prop 数值变化，每次自增触发 40 片随机彩纸下落。

```vue
<Confetti :trigger="confettiTrigger" />
<!-- 答对时 confettiTrigger++ -->
```

### `NavBar.vue` — 顶部导航

 Props：`title`, `showHome`。自动判断是否在首页显示返回/主页按钮，右侧固定显示金币。

## 四、扩展指南

### 添加新勋章

```js
// 1. utils/badges.js 中追加
{ id: 'lightning-20', icon: '⚡', name: '闪电手', desc: '闪电战答对20题', color: 'bg-yellow-100' }

// 2. 业务代码触发
if (condition) store.grantBadge('lightning-20')
```

### 添加新题型

参考 `Practice.vue` 的实现，新建 `views/LightningWar.vue`：

```vue
<script setup>
import { ref } from 'vue'
import { store } from '../utils/store'
import { speakKoujue } from '../utils/speech'

const TIME_LIMIT = 60
const score = ref(0)

function start() {
  // 计时器 + 题目循环
}
</script>

<template>
  <!-- 答题 UI -->
</template>
```

在 `router/index.js` 注册路由：
```js
{ path: '/lightning', name: 'lightning', component: () => import('../views/LightningWar.vue') }
```

### 重新生成音频

修改 `scripts/gen_audio.py` 顶部的 `VOICE` 和 `RATE`：

```python
VOICE = "zh-CN-YunxiNeural"  # 换成男童声
RATE = "-10%"                # 慢一点
```

运行：
```bash
pip3 install edge-tts
python3 scripts/gen_audio.py
```

输出会覆盖 `public/audio/`。

### 增加新鼓励语

1. `scripts/gen_audio.py` 的 `praises` 数组追加：
```python
praises.append(("new_phrase", "新鼓励语内容"))
```

2. 运行脚本生成 `new_phrase.mp3`

3. 代码中调用 `speakPhrase('new_phrase')`

## 五、性能与体积

### 当前体积
- 源码：~70 KB（gzip 后 ~25 KB）
- 音频：27 MB（218 个 mp3）
- 总构建产物：~27 MB

### 优化空间
- **数字朗读 `num_*.mp3`**：当前 82 个备用，若不做"听音选答"题型可删除
- **音频压缩**：用 ffmpeg 转 32kbps mono 可减半体积（当前未安装 ffmpeg）
- **懒加载视图**：已用动态 import，路由切换时按需加载

## 六、部署说明

### GitHub Pages（当前方案）

```bash
npm run build
npx gh-pages -d dist -r https://github.com/<user>/ninemaster.git
```

仓库设置 → Pages → Branch → `gh-pages` 即可。

### Cloudflare Pages

连接 GitHub 仓库，配置：
- 构建命令：`npm run build`
- 输出目录：`dist`
- 自定义域名：在 Cloudflare 控制台绑定（如 `nine.hp110.cn`）

### Gitee Pages

将 `dist/` 内容推送到独立分支（如 `pages`），开通 Gitee Pages 服务。

## 七、常见问题

### Q: 为什么点击没声音？

A: 浏览器要求首次音频播放必须有用户手势触发。首次进入应用至少需要点击一次页面元素后音频才能正常播放。如果完全无声，检查：
1. 设备静音开关
2. 浏览器音量设置
3. 移动端是否启用了"省流量模式"

### Q: 数据存储在哪里？换设备怎么迁移？

A: 数据存在浏览器的 `localStorage`，仅限当前设备+当前浏览器。迁移方法：
1. 旧设备打开家长面板 → 导出数据备份（JSON 文件）
2. 新设备打开家长面板 → （后续版本将提供导入功能）

### Q: 密码忘了怎么办？

A: 浏览器开发者工具（F12）→ Application → Local Storage → 删除 `ninemaster:state` 键 → 刷新页面。密码会重置为默认值 `1688`。

### Q: 可以给孩子班级使用吗？

A: 完全可以。本应用是 MIT 协议开源，可以自由部署到学校服务器或自己的网站。

## 八、贡献指南

欢迎提 Issue 反馈 bug、建议新功能，或提 PR 贡献代码。

**代码风格**：
- Vue 组件用 `<script setup>` 语法
- JavaScript 用 ES2022+ 特性
- Tailwind 优先，避免手写 CSS（除非动画）
- 中文字符串使用全角标点

**提交前检查**：
- [ ] `npm run build` 无错误
- [ ] 浏览器手动测试核心流程
- [ ] 不引入新的全局依赖（保持轻量）
