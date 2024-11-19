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
    id: 'customOptions',
    title: 'Dashboard',
    contexts: ['action'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'customOptions') {
    chrome.runtime.openOptionsPage();
  }
});
