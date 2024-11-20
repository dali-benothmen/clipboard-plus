import { handleCopyEvent } from '../../utils/storageUtils';

const chromeFaviconURL =
  'https://www.gstatic.com/devrel-devsite/prod/v870e399c64f7c43c99a3043db4b3a74327bb93d0914e84a0c3dba90bbfd67625/chrome/images/favicon.png';

document.addEventListener('copy', async (event) => {
  const getCopiedData = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const copiedText = tab.url;
    const url = tab.url;
    const name = tab.title || 'Untitled';
    const favicon = tab.favIconUrl || chromeFaviconURL;

    return { copiedText, url, name, favicon };
  };

  handleCopyEvent(event, getCopiedData);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'showNotification') {
    chrome.notifications.create('reachedLimitNotification', {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'CopySaver',
      message: request.message,
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'dashboard',
    title: 'Dashboard',
    contexts: ['action'],
  });
});

chrome.contextMenus.onClicked.addListener((info, _) => {
  if (info.menuItemId === 'dashboard') {
    chrome.runtime.openOptionsPage();
  }
});
