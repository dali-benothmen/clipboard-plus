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
