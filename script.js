const config = window.APP_CONFIG || { apiEndpoint: "" };
const composer = document.querySelector("#composer");
const promptInput = document.querySelector("#prompt");
const imageInput = document.querySelector("#imageInput");
const previewList = document.querySelector("#previewList");
const resultPanel = document.querySelector("#resultPanel");
const loadingState = document.querySelector("#loadingState");
const resultContent = document.querySelector("#resultContent");
const sourceChips = document.querySelector("#sourceChips");
const followupNote = document.querySelector("#followupNote");
const submitButton = composer.querySelector(".submit-button");
const submitLabel = submitButton.querySelector("span");
const counter = document.querySelector(".counter");
const copyResultButton = document.querySelector("#copyResult");
const newChatButton = document.querySelector("#newChat");
const stopGenerationButton = document.querySelector("#stopGeneration");

const MAX_VISIBLE_INPUT = 12000;
const MAX_HISTORY_MESSAGES = 8;
let selectedFiles = [];
let conversationHistory = [];
let activeController = null;
let lastResultText = "";

function updateCounter() {
  if (!counter) return;
  counter.textContent = `${promptInput.value.length}/${MAX_VISIBLE_INPUT}`;
}

function updateSubmitLabel() {
  if (activeController) {
    submitLabel.textContent = "正在生成…";
    return;
  }
  submitLabel.textContent = conversationHistory.length ? "发送追问" : "发送";
}

function setGenerating(isGenerating) {
  submitButton.disabled = isGenerating;
  stopGenerationButton.hidden = !isGenerating;
  updateSubmitLabel();
}

promptInput.addEventListener("input", updateCounter);
updateCounter();
updateSubmitLabel();

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    promptInput.value = button.dataset.prompt;
    updateCounter();
    promptInput.focus();
    document.querySelector("#studio")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

imageInput.addEventListener("change", () => {
  const files = [...imageInput.files].filter((file) => file.type.startsWith("image/"));

  if (files.length > 4) {
    window.alert("一次最多上传 4 张参考图片，已保留前 4 张。");
  }

  if (files.some((file) => file.size > 12 * 1024 * 1024)) {
    window.alert("单张原始图片请控制在 12MB 以内。");
  }

  selectedFiles = files
    .filter((file) => file.size <= 12 * 1024 * 1024)
    .slice(0, 4);

  renderPreviews();
});

function renderPreviews() {
  previewList.innerHTML = "";
  selectedFiles.forEach((file, index) => {
    const chip = document.createElement("div");
    chip.className = "image-chip";

    const image = document.createElement("img");
    image.alt = file.name;
    image.src = URL.createObjectURL(file);
    image.onload = () => URL.revokeObjectURL(image.src);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `移除 ${file.name}`);
    remove.addEventListener("click", () => {
      selectedFiles.splice(index, 1);
      renderPreviews();
    });

    chip.append(image, remove);
    previewList.append(chip);
  });
}

composer.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (activeController) return;

  const prompt = promptInput.value.trim();
  if (!prompt) return;

  document.body.classList.add("focus-mode");
  resultPanel.classList.add("visible");
  loadingState.style.display = "flex";
  resultContent.classList.remove("visible");
  resultContent.innerHTML = "";
  sourceChips.innerHTML = "";
  followupNote.hidden = true;
  copyResultButton.disabled = true;
  lastResultText = "";
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });

  if (!config.apiEndpoint) {
    showResult("AI 接口地址尚未配置，请检查页面中的 API 配置。");
    return;
  }

  activeController = new AbortController();
  setGenerating(true);

  try {
    const images = await Promise.all(selectedFiles.map(prepareImageForApi));

    const response = await fetch(config.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: activeController.signal,
      body: JSON.stringify({
        prompt,
        images,
        history: conversationHistory.slice(-MAX_HISTORY_MESSAGES)
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `服务返回 ${response.status}`);
    }

    const answer = data.result || data.content || "已收到服务响应，但未找到结果文本。";
    conversationHistory.push(
      { role: "user", content: prompt },
      { role: "assistant", content: answer }
    );
    conversationHistory = conversationHistory.slice(-MAX_HISTORY_MESSAGES);

    showResult(answer, data.knowledgeSources || []);
    promptInput.value = "";
    selectedFiles = [];
    imageInput.value = "";
    renderPreviews();
    updateCounter();
  } catch (error) {
    if (error?.name === "AbortError") {
      showResult("已停止本次生成。你可以调整问题后继续发送。");
    } else {
      showResult(`AI 服务暂时不可用：${error.message}`);
    }
  } finally {
    activeController = null;
    setGenerating(false);
  }
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function inlineFormat(value) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderMarkdown(text) {
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  let html = "";
  let listType = "";
  let inCode = false;
  let codeLines = [];

  const closeList = () => {
    if (!listType) return;
    html += `</${listType}>`;
    listType = "";
  };

  const flushCode = () => {
    if (!inCode) return;
    html += `<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`;
    inCode = false;
    codeLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim().startsWith("```")) {
      closeList();
      if (inCode) {
        flushCode();
      } else {
        inCode = true;
        codeLines = [];
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = Math.min(4, heading[1].length + 1);
      html += `<h${level}>${inlineFormat(heading[2])}</h${level}>`;
      continue;
    }

    const bullet = line.match(/^\s*[-*•]\s+(.+)$/);
    if (bullet) {
      if (listType !== "ul") {
        closeList();
        listType = "ul";
        html += "<ul>";
      }
      html += `<li>${inlineFormat(bullet[1])}</li>`;
      continue;
    }

    const ordered = line.match(/^\s*\d+[.)、]\s+(.+)$/);
    if (ordered) {
      if (listType !== "ol") {
        closeList();
        listType = "ol";
        html += "<ol>";
      }
      html += `<li>${inlineFormat(ordered[1])}</li>`;
      continue;
    }

    const quote = line.match(/^\s*>\s?(.+)$/);
    if (quote) {
      closeList();
      html += `<blockquote>${inlineFormat(quote[1])}</blockquote>`;
      continue;
    }

    closeList();
    html += `<p>${inlineFormat(line)}</p>`;
  }

  closeList();
  if (inCode) flushCode();
  return html;
}

function showResult(text, sources = []) {
  loadingState.style.display = "none";
  lastResultText = String(text || "");
  resultContent.innerHTML = renderMarkdown(lastResultText);
  resultContent.classList.add("visible");
  copyResultButton.disabled = !lastResultText;

  sourceChips.innerHTML = "";
  [...new Set(sources)].slice(0, 5).forEach((source) => {
    const chip = document.createElement("span");
    chip.textContent = source;
    sourceChips.append(chip);
  });

  followupNote.hidden = conversationHistory.length === 0;
}

copyResultButton.addEventListener("click", async () => {
  if (!lastResultText) return;

  try {
    await navigator.clipboard.writeText(lastResultText);
    const original = copyResultButton.textContent;
    copyResultButton.textContent = "已复制";
    window.setTimeout(() => {
      copyResultButton.textContent = original;
    }, 1400);
  } catch {
    const area = document.createElement("textarea");
    area.value = lastResultText;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
});

stopGenerationButton.addEventListener("click", () => {
  activeController?.abort();
});

newChatButton.addEventListener("click", () => {
  activeController?.abort();
  conversationHistory = [];
  lastResultText = "";
  promptInput.value = "";
  selectedFiles = [];
  imageInput.value = "";
  renderPreviews();
  updateCounter();
  updateSubmitLabel();
  resultContent.innerHTML = "";
  resultContent.classList.remove("visible");
  sourceChips.innerHTML = "";
  followupNote.hidden = true;
  resultPanel.classList.remove("visible");
  document.body.classList.remove("focus-mode");
  document.querySelector("#studio")?.scrollIntoView({ behavior: "smooth", block: "center" });
  promptInput.focus();
});

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`无法读取图片：${file.name}`));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("图片解析失败，请更换图片后重试。"));
    image.src = dataUrl;
  });
}

async function prepareImageForApi(file) {
  if (file.type === "image/gif") {
    if (file.size > 850 * 1024) {
      throw new Error("GIF 图片请控制在 850KB 以内，或转换成 JPG/PNG/WEBP 后上传。");
    }
    return readAsDataUrl(file);
  }

  const original = await readAsDataUrl(file);
  const image = await loadImage(original);

  let maxDimension = 1200;
  let quality = 0.78;
  let output = original;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, width, height);

    output = canvas.toDataURL("image/webp", quality);

    if (output.length <= 780_000) {
      return output;
    }

    maxDimension = Math.round(maxDimension * 0.8);
    quality = Math.max(0.58, quality - 0.08);
  }

  if (output.length > 1_500_000) {
    throw new Error(`图片 ${file.name} 处理后仍过大，请换一张更小的图片。`);
  }

  return output;
}

function resetPage() {
  activeController?.abort();
  document.body.classList.remove("focus-mode");
  resultPanel.classList.remove("visible");
  document.querySelector("#top").scrollIntoView({ behavior: "smooth" });
}

document.querySelector("#closeResult").addEventListener("click", resetPage);

const track = document.querySelector("#carouselTrack");
const slides = [...track.children];
const dotsWrap = document.querySelector("#carouselDots");
let current = 0;
let playing = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let timer;

function visibleCount() {
  if (window.innerWidth <= 560) return 2;
  if (window.innerWidth <= 860) return 3;
  if (window.innerWidth <= 1180) return 4;
  return 6;
}

function maxSlideIndex() {
  return Math.max(0, slides.length - visibleCount());
}

function rebuildDots() {
  const maxIndex = maxSlideIndex();
  dotsWrap.innerHTML = "";

  for (let index = 0; index <= maxIndex; index += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `查看第 ${index + 1} 组图片`);
    dot.addEventListener("click", () => {
      goTo(index);
      restartTimer();
    });
    dotsWrap.append(dot);
  }

  current = Math.min(current, maxIndex);
  goTo(current);
}

function goTo(index) {
  const maxIndex = maxSlideIndex();
  current = index > maxIndex ? 0 : index < 0 ? maxIndex : index;
  const gap = 2;
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${current * (slideWidth + gap)}px)`;
  [...dotsWrap.children].forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === current);
  });
}

function restartTimer() {
  window.clearInterval(timer);
  if (playing) {
    timer = window.setInterval(() => goTo(current + 1), 2600);
  }
}

document.querySelector("#prevSlide").addEventListener("click", () => {
  goTo(current - 1);
  restartTimer();
});

document.querySelector("#nextSlide").addEventListener("click", () => {
  goTo(current + 1);
  restartTimer();
});

document.querySelector("#togglePlay").addEventListener("click", (event) => {
  playing = !playing;
  event.currentTarget.textContent = playing ? "Ⅱ" : "▶";
  event.currentTarget.setAttribute("aria-label", playing ? "暂停自动播放" : "继续自动播放");
  restartTimer();
});

let resizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(rebuildDots, 120);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    window.clearInterval(timer);
  } else {
    restartTimer();
  }
});

document.querySelector("#togglePlay").textContent = playing ? "Ⅱ" : "▶";
document.querySelector("#togglePlay").setAttribute("aria-label", playing ? "暂停自动播放" : "继续自动播放");
rebuildDots();
restartTimer();
