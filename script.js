const config = window.APP_CONFIG || { apiEndpoint: "" };
const composer = document.querySelector("#composer");
const promptInput = document.querySelector("#prompt");
const imageInput = document.querySelector("#imageInput");
const previewList = document.querySelector("#previewList");
const resultPanel = document.querySelector("#resultPanel");
const loadingState = document.querySelector("#loadingState");
const resultContent = document.querySelector("#resultContent");
let selectedFiles = [];

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    promptInput.value = button.dataset.prompt;
    promptInput.focus();
  });
});

imageInput.addEventListener("change", () => {
  selectedFiles = [...imageInput.files].slice(0, 6);
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
  resultContent.innerHTML = "";
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });

  if (!config.apiEndpoint) {
    window.setTimeout(() => showApiPlaceholder(prompt), 850);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
    selectedFiles.forEach((file) => formData.append("images", file));
    const response = await fetch(config.apiEndpoint, { method: "POST", body: formData });
    if (!response.ok) throw new Error(`服务返回 ${response.status}`);
    const data = await response.json();
    showResult(data.result || data.content || "已收到服务响应，但未找到结果文本。");
  } catch (error) {
    showResult(`AI 服务暂时不可用：${error.message}`);
  }
});

function showApiPlaceholder(prompt) {
  const names = selectedFiles.length ? selectedFiles.map((file) => file.name).join("、") : "未上传图片";
  loadingState.style.display = "none";
  resultContent.innerHTML = `
    <div class="notice"><strong>前端交互已经就绪，AI 接口暂未配置。</strong><br />收到 API 后，只需在 <code>config.js</code> 中填写服务端地址即可发起真实请求。</div>
    <div class="request-summary"><strong>本次输入</strong><br />${escapeHtml(prompt)}<br /><small>参考图片：${escapeHtml(names)}</small></div>
  `;
  resultContent.classList.add("visible");
}

function showResult(text) {
  loadingState.style.display = "none";
  resultContent.textContent = text;
  resultContent.classList.add("visible");
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
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
  if (window.innerWidth <= 520) return 1;
  if (window.innerWidth <= 860) return 1;
  return 3;
}

function goTo(index) {
  const maxIndex = Math.max(0, slides.length - visibleCount());
  current = index > maxIndex ? 0 : index < 0 ? maxIndex : index;
  const gap = 16;
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${current * (slideWidth + gap)}px)`;
  [...dotsWrap.children].forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === current));
}

function restartTimer() {
  window.clearInterval(timer);
  if (playing) timer = window.setInterval(() => goTo(current + 1), 4200);
}

document.querySelector("#prevSlide").addEventListener("click", () => { goTo(current - 1); restartTimer(); });
document.querySelector("#nextSlide").addEventListener("click", () => { goTo(current + 1); restartTimer(); });
document.querySelector("#togglePlay").addEventListener("click", (event) => {
  playing = !playing;
  event.currentTarget.textContent = playing ? "Ⅱ" : "▶";
  event.currentTarget.setAttribute("aria-label", playing ? "暂停自动播放" : "继续自动播放");
  restartTimer();
});
window.addEventListener("resize", () => goTo(current));
goTo(0);
restartTimer();
