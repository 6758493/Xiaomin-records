const sound = new Audio("./assets/success.mp3");

let videos = {
  "吃屎": "./mp4/108.mp4",
  "火烧": "./mp4/hs.mp4",
  "demo.mp4": "./mp4/demo.mp4",
  "video1": "./mp4/video1.mp4"
};
Object.assign(videos, JSON.parse(localStorage.getItem("uploadedVideos") || "{}"));

window.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("popupAccepted")) {
    document.getElementById("popupCard").classList.remove("hidden");
  }
});

function closePopup() {
  const popup = document.getElementById("popupCard");
  const msg = document.getElementById("savedMsg");
  popup.style.opacity = "0";
  msg.classList.remove("hidden");
  msg.style.opacity = "1";
  sound.play();
  setTimeout(() => {
    popup.classList.add("hidden");
    msg.style.opacity = "0";
  }, 2000);
  localStorage.setItem("popupAccepted", "yes");
}

function searchVideo() {
  const input = document.getElementById("searchInput").value.trim();
  const matchKey = Object.keys(videos).find(k => k.includes(input));
  const container = document.getElementById("videoContainer");
  const msg = document.getElementById("message");
  if (!input) {
    msg.textContent = "请输入搜索内容";
    msg.classList.remove("hidden");
    container.classList.add("hidden");
    return;
  }
  if (matchKey) {
    document.getElementById("videoPlayer").src = videos[matchKey];
    container.classList.remove("hidden");
    msg.classList.add("hidden");
    updateLikeUI(matchKey);
    loadDanmakus(matchKey);
  } else {
    msg.textContent = `未找到 “${input}” 的视频`;
    msg.classList.remove("hidden");
    container.classList.add("hidden");
  }
}

function updateLikeUI(key) {
  const count = localStorage.getItem(`like_${key}`) || 0;
  document.getElementById("likeCount").textContent = count;
  document.getElementById("likeBtn").onclick = () => {
    let n = parseInt(localStorage.getItem(`like_${key}`) || 0);
    localStorage.setItem(`like_${key}`, ++n);
    document.getElementById("likeCount").textContent = n;
  };
}

function addComment() {
  const text = document.getElementById("commentInput").value.trim();
  const color = document.getElementById("colorInput").value;
  const key = document.getElementById("searchInput").value.trim();
  if (!text || !key) return;
  const list = JSON.parse(localStorage.getItem(`comments_${key}`) || "[]");
  list.push({ text, color });
  localStorage.setItem(`comments_${key}`, JSON.stringify(list));
  appendDanmaku(text, color);
  document.getElementById("commentInput").value = "";
}

function appendDanmaku(text, color) {
  const el = document.createElement("div");
  el.textContent = text;
  el.className = "danmaku-text";
  el.style.top = Math.random() * 80 + "%";
  el.style.color = color;
  document.getElementById("danmakuLayer").appendChild(el);
  setTimeout(() => el.remove(), 10000);
}

function loadDanmakus(key) {
  const list = JSON.parse(localStorage.getItem(`comments_${key}`) || "[]");
  document.getElementById("danmakuLayer").innerHTML = "";
  list.forEach(({ text, color }, i) =>
    setTimeout(() => appendDanmaku(text, color), i * 800)
  );
}

function handleUpload() {
  const file = document.getElementById("uploadInput").files[0];
  if (!file) return alert("请选择视频文件");
  const name = prompt("给这个视频起个名字：");
  if (!name) return;
  const url = URL.createObjectURL(file);
  videos[name] = url;
  localStorage.setItem("uploadedVideos", JSON.stringify(videos));
  alert(`上传成功！你可以搜索 “${name}” 来播放它。`);
}
