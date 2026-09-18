const SYSTEM_PROMPT = `
你是“乡村短剧 AI 创作助手”，服务于“合肥工业大学新媒体中心赴黄山‘乡村短剧赋能乡村振兴’调研暑期社会实践团队”。

你的核心任务：
1. 围绕富溪乡、白际乡、西溪南镇等乡村场景，协助完成短剧选题、故事结构、剧本、台词、分镜、采访提纲、拍摄方案、剪辑建议和传播文案。
2. 创作要适合短视频传播，兼顾真实性、可拍性、节奏、情绪与乡村文化表达。
3. 用户上传图片时，结合图片中的人物、环境、物件、文字和构图进行分析，但不要臆测无法从图片确认的事实。
4. 涉及具体历史、政策、产业数据、团队内部事实或当地细节，而用户没有提供资料时，不要编造；明确说明哪些信息需要补充。
5. 默认使用中文回答。除非用户明确要求其他语言。
6. 输出尽量清晰、可直接执行；如果用户要剧本或分镜，给出可直接拍摄的结构。
`.trim();

const ALLOWED_IMAGE_PREFIX = /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i;
const MAX_PROMPT_LENGTH = 12000;
const MAX_IMAGES = 4;
const MAX_IMAGE_DATA_URL_LENGTH = 1_600_000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "仅支持 POST 请求。" });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
  const model = process.env.DEEPSEEK_MODEL || "deepseek-flash";

  if (!apiKey) {
    return res.status(503).json({
      error: "服务器尚未配置 DEEPSEEK_API_KEY，请在 Vercel Environment Variables 中添加后重新部署。"
    });
  }

  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  const images = Array.isArray(req.body?.images) ? req.body.images : [];

  if (!prompt) {
    return res.status(400).json({ error: "请输入要创作或咨询的内容。" });
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: "输入内容过长，请控制在 12000 字符以内。" });
  }

  if (images.length > MAX_IMAGES) {
    return res.status(400).json({ error: "一次最多上传 4 张参考图片。" });
  }

  for (const image of images) {
    if (
      typeof image !== "string" ||
      !ALLOWED_IMAGE_PREFIX.test(image) ||
      image.length > MAX_IMAGE_DATA_URL_LENGTH
    ) {
      return res.status(400).json({ error: "图片格式或大小不符合要求，请重新选择图片。" });
    }
  }

  const userContent = images.length
    ? [
        { type: "text", text: prompt },
        ...images.map((url) => ({
          type: "image_url",
          image_url: { url, detail: "auto" }
        }))
      ]
    : prompt;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent }
        ],
        stream: false
      }),
      signal: controller.signal
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const providerMessage =
        data?.error?.message ||
        data?.message ||
        `DeepSeek 返回 HTTP ${upstream.status}`;

      console.error("DeepSeek API error:", upstream.status, providerMessage);
      return res.status(upstream.status).json({
        error: `DeepSeek 调用失败：${providerMessage}`
      });
    }

    const result = data?.choices?.[0]?.message?.content;

    if (!result || typeof result !== "string") {
      console.error("Unexpected DeepSeek response:", data);
      return res.status(502).json({ error: "DeepSeek 已响应，但未返回可显示的文本。" });
    }

    return res.status(200).json({
      result,
      model: data?.model || model
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      return res.status(504).json({ error: "AI 响应超时，请稍后重试。" });
    }

    console.error("Generate API error:", error);
    return res.status(500).json({ error: "AI 服务暂时不可用，请稍后重试。" });
  } finally {
    clearTimeout(timeout);
  }
}
