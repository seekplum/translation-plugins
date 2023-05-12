window.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const x = event.pageX + window.screenX;
      const y = event.pageY + window.screenY;

      // 发送消息给 background.js 请求 API
      chrome.runtime.sendMessage({
        action: 'openPopup',
        selectedText: selectedText,
        x: x,
        y: y,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
      });
    }
  });