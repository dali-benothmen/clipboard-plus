import { uuid } from '../../utils/uuid';

document.addEventListener('copy', () => {
  const copiedText = document.getSelection().toString();

  if (copiedText) {
    const url = window.location.href;
    const hostname = window.location.hostname;
    const name = document.title || url;
    const favicon =
      document.querySelector("link[rel~='icon']")?.href ||
      `${window.location.origin}/favicon.ico`;

    const newCopiedItem = {
      id: uuid(),
      text: copiedText,
      label: copiedText,
      timestamp: new Date().toISOString(),
      pinned: false,
      isTrashed: false,
      category: null,
      source: {
        url,
        hostname,
        name,
        favicon,
      },
    };

    chrome.storage.local.get('clipboardHistory', (result) => {
      let clipboardHistory = result.clipboardHistory || [];

      clipboardHistory.unshift(newCopiedItem);

      chrome.storage.local.set({ clipboardHistory });
    });
  }
});
