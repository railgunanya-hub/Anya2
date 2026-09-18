const config = window.APP_CONFIG || { apiEndpoint: "" };
const composer = document.querySelector("#composer");
const promptInput = document.querySelector("#prompt");
const imageInput = document.querySelector("#imageInput");
const previewList = document.querySelector("#previewList");
const resultPanel = document.querySelector("#resultPanel");
const loadingState = document.querySelector("#loadingState");
const resultContent = document.querySelector("#resultContent");
const submitButton = composer.querySelector(".submit-button");
const submitLabel = submitButton.querySelector("span");
let selectedFiles = [];
const counter = document.querySelector(".counter");
const MAX_VISIBLE_INPUT = 2000;

function updateCounter() {
  if (!counter) return;
  counter.textContent = `${Math.min(promptInput.value.length, MAX_VISIBLE_INPUT)}/${MAX_VISIBLE_INPUT}`;
}
promptInput.addEventListener("input", updateCounter);
updateCounter();

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    promptInput.value = button.dataset.prompt;
    updateCounter();
    promptInput.focus();
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
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  document.body.classList.add("focus-mode");
  resultPanel.classList.add("visible");
  loadingState.style.display = "flex";
  resultContent.classList.remove("visible");
  resultContent.textContent = "";
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });

  submitButton.disabled = true;
  submitLabel.textContent = "正在生成…";

  if (!config.apiEndpoint) {
    showResult("AI 接口地址尚未配置，请检查 config.js。");
    submitButton.disabled = false;
    submitLabel.textContent = "生成创作建议";
    return;
  }

  try {
    const images = await Promise.all(selectedFiles.map(prepareImageForApi));

    const response = await fetch(config.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, images })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `服务返回 ${response.status}`);
    }

    showResult(data.result || data.content || "已收到服务响应，但未找到结果文本。");
  } catch (error) {
    showResult(`AI 服务暂时不可用：${error.message}`);
  } finally {
    submitButton.disabled = false;
    submitLabel.textContent = "生成创作建议";
  }
});

function showResult(text) {
  loadingState.style.display = "none";
  resultContent.style.whiteSpace = "pre-wrap";
  resultContent.textContent = text;
  resultContent.classList.add("visible");
}

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

  let maxDimension = 1400;
  let quality = 0.82;
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

    if (output.length <= 1_050_000) {
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
  document.body.classList.remove("focus-mode");
  resultPanel.classList.remove("visible");
  document.querySelector("#top").scrollIntoView({ behavior: "smooth" });
}

document.querySelector("#closeResult").addEventListener("click", resetPage);
document.querySelector("#resetView").addEventListener("click", resetPage);

const track = document.querySelector("#carouselTrack");
const slides = [...track.children];
const dotsWrap = document.querySelector("#carouselDots");
let current = 0;
let playing = true;
let timer;

slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `查看第 ${index + 1} 张图片`);
  dot.addEventListener("click", () => goTo(index));
  dotsWrap.append(dot);
});

function visibleCount() {
  if (window.innerWidth <= 560) return 2;
  if (window.innerWidth <= 860) return 3;
  if (window.innerWidth <= 1180) return 4;
  return 6;
}

function goTo(index) {
  const maxIndex = Math.max(0, slides.length - visibleCount());
  current = index > maxIndex ? 0 : index < 0 ? maxIndex : index;
  const gap = 2;
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${current * (slideWidth + gap)}px)`;
  [...dotsWrap.children].forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === current));
}

function restartTimer() {
  window.clearInterval(timer);
  if (playing) timer = window.setInterval(() => goTo(current + 1), 2200);
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

window.addEventListener("resize", () => goTo(current));
goTo(0);
restartTimer();
