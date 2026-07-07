# 九九乘法大师 (ninemaster)

帮助孩子学习九九乘法口诀的纯前端 H5 应用。无后端、零配置，开箱即用。

## ✨ 功能

- **九九总表** — 点击任意一格朗读对应口诀
- **分单元学习** — 1 到 9 的口诀一句一句学，配可视化 emoji
- **闯关练习** — 选择题练习，连击奖励金币
- **勋章系统** — 多种成就解锁，激励孩子持续学习
- **错题本** — 自动记录错题，方便复习
- **家长面板** — 密码进入，查看孩子学习数据并支持导出备份

## 🎨 设计特点

- 大字大按钮，适合儿童操作
- 鲜艳配色，避免枯燥
- 答对撒花、答错鼓励，正向反馈循环
- 纯本地存储（localStorage），无需账号

## 🚀 本地开发

```bash
npm install
npm run dev
```

## 📦 构建部署

```bash
npm run build
```

构建产物在 `dist/` 目录，可直接部署到任意静态服务器，如 GitHub Pages、Cloudflare Pages、Gitee Pages 等。

## 🛠 技术栈

- Vue 3 + Vue Router
- Vite
- Tailwind CSS
- Web Speech API（语音朗读）

## 📄 License

MIT
