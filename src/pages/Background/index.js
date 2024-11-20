chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
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
