# 乡村短剧 AI 创作助手

合肥工业大学新媒体中心赴黄山“乡村短剧赋能乡村振兴”调研暑期社会实践团队公开 AI 网页。

项目以富溪乡、白际乡、西溪南镇的真实实践材料与乡村短剧创作经验为知识参考，通过 DeepSeek 提供选题、剧本、分镜、拍摄、剪辑与传播建议。

## 当前功能

- 响应式首页主视觉，整合融媒体中心徽章、最终版小狐狸角色与黄山实践影像
- 8 张实践图片轮播，支持手动切换、暂停、移动端自适应与减少动画偏好
- AI 创作助手：选题创意、剧本生成、分镜脚本、拍摄建议、剪辑方案
- 支持文字输入与最多 4 张参考图片上传；图片会在浏览器端压缩后再发送
- 支持连续追问，保留最近对话上下文
- 支持停止生成、复制结果、重新开始
- AI 回答支持标题、列表、引用、代码等基础 Markdown 排版
- 回答后展示本轮调用到的实践经验库来源
- 内置富溪乡、白际乡、西溪南镇案例与通用创作经验
- 前后端均部署在 Vercel，前端调用同源 `/api/generate`

## 项目结构

```text
.
├─ index.html
├─ styles.css
├─ script.js
├─ vercel.json
├─ api/
│  └─ generate.js
└─ assets/
   ├─ practice/
   └─ ...
```

## AI 接口

前端通过 JSON 调用：

```http
POST /api/generate
Content-Type: application/json
```

请求体主要字段：

```json
{
  "prompt": "用户当前输入",
  "images": ["data:image/webp;base64,..."],
  "history": [
    { "role": "user", "content": "上一轮问题" },
    { "role": "assistant", "content": "上一轮回答" }
  ]
}
```

接口成功时返回：

```json
{
  "result": "模型生成的回答",
  "model": "实际模型名称",
  "knowledgeSources": ["本轮参考的经验库来源"]
}
```

## Vercel 环境变量

API Key 不写入前端或 GitHub 仓库。部署时在 Vercel Environment Variables 中配置：

- `DEEPSEEK_API_KEY`：必需
- `DEEPSEEK_BASE_URL`：可选，默认 `https://api.deepseek.com`
- `DEEPSEEK_MODEL`：可选，未设置时使用后端默认模型

修改环境变量后需要重新部署，使新的 Production Deployment 读取到最新配置。

## 实践经验库

当前后端知识库参考材料包括：

- 《乡村短剧创作经验与AI执行手册》
- 《富溪乡短剧0714》
- 《白际乡综艺短剧 捉迷藏篇》
- 《西溪南镇第一人称短剧0716》
- 《短剧思路》

知识库用于迁移创作结构、人物推进、任务机制、分镜字段、现场执行、安全边界与替代方案。案例设定不会被自动当成其他地点的现实事实；涉及历史、数字、非遗归属、产业数据、动态活动等内容时仍应核验。

后端会结合当前问题与最近的用户对话，选择更相关的经验片段，再与系统角色提示一起发送给模型，因此用户可以在第一次回答后继续说“再详细一点”“改成 60 秒版本”“按白际乡条件重写”等。

## 本地预览

静态页面可直接打开 `index.html`。若只查看界面，也可以运行：

```bash
python -m http.server 8080
```

然后打开 `http://localhost:8080`。

注意：本地静态服务器不会自动提供 Vercel 的 `/api/generate` Serverless Function；完整 AI 功能应通过 Vercel 部署环境测试。

## 中国大陆访问优化

项目目前在继续使用 Vercel 默认域名的前提下做了这些优化：

- Vercel Function Region 固定为香港 `hkg1`
- 不依赖 Google Fonts、国外 CDN 或第三方前端脚本
- 首屏关键图片预加载，其余图片延迟加载
- 图片在上传 AI 前进行浏览器端压缩
- HTML、CSS、JS 与图片采用不同缓存策略，兼顾更新及时性与重复访问速度
- API 请求超时与函数执行时长协调，减少无提示中断

这些措施能改善可访问时的速度与稳定性，但不能保证 `.vercel.app` 在中国大陆所有运营商、地区和时段都稳定可达。若后续需要更高的大陆可用性，建议使用备案域名与面向中国大陆的托管/CDN。
