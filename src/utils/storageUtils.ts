import { uuid } from './uuid';

export function saveCopiedItem(
  clipboardItem: {
    copiedText: string;
    url: string;
    hostname: string;
    name: string;
    favicon: string;
  },
  maxClipboardItems: number = 100
) {
  const { copiedText, url, hostname, favicon, name } = clipboardItem;
  const newCopiedItem = {
    id: uuid(),
    text: copiedText,
    label: copiedText,
    timestamp: new Date().toISOString(),
    pinned: false,
    isTrashed: false,
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

    if (clipboardHistory.length > maxClipboardItems) {
      chrome.runtime.sendMessage({
        type: 'showNotification',
        message: 'You have reached the maximum number of saved copied items.',
      });
      return;
    }

    chrome.storage.local.set({ clipboardHistory });
  });
}

type CopiedData = {
  copiedText: string;
  url: string;
  hostname: string;
  name: string;
  favicon: string;
};

type getCopiedDataFN = () => CopiedData;

export function handleCopyEvent(event: Event, getCopiedData: getCopiedDataFN) {
  event.preventDefault();

  try {
    const { copiedText, url, name, favicon, hostname } = getCopiedData();

    if (copiedText) {
      saveCopiedItem({ copiedText, url, hostname, name, favicon });
    }
  } catch (error) {
    console.error('Something went wrong', error);
  }
}
