chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openPopup") {
    const selectedText = request.selectedText;
    const x = request.x;
    const y = request.y;
    const screenWidth = request.screenWidth;
    const screenHeight = request.screenHeight;
    // const language = detectLanguage(selectedText);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer xxxx",
      },
      body: JSON.stringify([{
        Text: selectedText
      }]),
    };

    const popupWidth = 400;
    const popupHeight = 300;

    // 计算合适的窗口位置
    const xPosition = Math.min(x, screenWidth - popupWidth);
    const yPosition = Math.min(y, screenHeight - popupHeight);

    // 显示包含加载动画的弹出窗口并获取窗口 ID
    chrome.windows.create(
      {
        url: chrome.runtime.getURL("popup.html?loading=true"),
        type: "popup",
        width: popupWidth,
        height: popupHeight,
        top: yPosition,
        left: xPosition,
      },
      (window) => {
        const popupWindowId = window.id;
        const popupTabId = window.tabs[0].id;

        fetch("https://api-edge.cognitive.microsofttranslator.com/translate?from=&to=zh-Hans&api-version=3.0&includeSentenceLength=true", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            const result = data[0].translations[0].text;

            chrome.runtime.sendMessage({
              action: "showTranslation",
              translation: result,
              popupWindowId: popupWindowId,
              popupTabId: popupTabId,
            });
          });
      }
    );
  }
});

function detectLanguage(text) {
  const regex = /[\u4e00-\u9fa5]/;
  return regex.test(text) ? "zh-Hans" : "other";
}
