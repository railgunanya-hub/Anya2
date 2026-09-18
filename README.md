# 乡村短剧 AI 创作助手

合肥工业大学新媒体中心赴黄山“乡村短剧赋能乡村振兴”调研暑期社会实践团队网页前端。

## 已完成

- 官方、活力兼具的响应式首屏主视觉
- 小狐狸、融媒体徽章和黄山三下乡元素整合
- 6 张实践图片自动轮播，支持手动切换与暂停
- AI 问答输入框、快捷提示词与多图片上传预览
- 生成时自动收起轮播区，为回答腾出空间
- AI API 接口位置已经预留，但没有写入任何密钥
- 可直接作为静态网站导入 GitHub，并由 Vercel 部署

## 本地预览

直接双击 `index.html` 即可；也可以在本目录运行静态服务器：

```bash
python -m http.server 8080
```

然后打开 `http://localhost:8080`。

## 导入 GitHub

将压缩包解压后，把文件夹内的全部文件上传到仓库根目录即可。必须保留 `assets` 文件夹及其层级。

## 后续接入 API

在 `config.js` 中填写后端接口地址：

```js
window.APP_CONFIG = {
  apiEndpoint: "/api/generate"
};
```

前端会以 `multipart/form-data` 发送：

- `prompt`：用户输入的文字
- `images`：用户选择的图片，可为多张

接口返回 JSON 时推荐使用：

```json
{ "result": "模型生成的回答" }
```

请勿把 API Key 写入 `config.js`、`script.js` 或其他前端文件。密钥应保存在后端或 Vercel 环境变量中。
