document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const selectedText = params.get("selectedText");
    const textContainer = document.getElementById("selected-text");

    textContainer.innerText = selectedText;
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showTranslation") {
      showTranslation(request.translation);
    }
  });

  function showTranslation(translation) {
    const loadingContainer = document.getElementById("loading-container");
    const textContainer = document.getElementById("selected-text");

    // 隐藏加载图标并显示翻译结果
    loadingContainer.style.display = "none";
    textContainer.innerText = translation;
    textContainer.style.display = "block";
  }

  window.addEventListener("blur", closePopup);

  function closePopup() {
    window.close();
  }
