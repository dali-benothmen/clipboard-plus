import { uuid } from '../../utils/uuid';

const DEFAULT_LIMIT_ITEMS = 100;
const DEFAULT_EXPIRATION_DATE = 30;

document.addEventListener('copy', () => {
  try {
    const copiedText = document.getSelection().toString();

    if (copiedText) {
      const url = window.location.href;
      const name = document.title || url;
      const favicon =
        document.querySelector("link[rel~='icon']")?.href ||
        `${window.location.origin}/favicon.ico`;

      const expirationDate = new Date();
      expirationDate.setDate(
        expirationDate.getDate() + DEFAULT_EXPIRATION_DATE
      );

      const newCopiedItem = {
        id: uuid(),
        text: copiedText,
        timestamp: new Date().toISOString(),
        expirationDate,
        website: {
          url,
          name,
          favicon,
        },
      };

      chrome.storage.local.get('copiedHistory', (result) => {
        let copiedHistory = result.copiedHistory || [];

        // Filter out expired items (older than 30 days)
        const now = new Date();

        copiedHistory = copiedHistory.filter((item) => {
          return new Date(item.expirationDate) > now;
        });

        if (copiedHistory.length > DEFAULT_LIMIT_ITEMS) {
          chrome.runtime.sendMessage({
            type: 'showNotification',
            message:
              'You have reached the maximum number of saved copied items.',
          });

          return;
        }

        copiedHistory.unshift(newCopiedItem);

        chrome.storage.local.set({ copiedHistory });
      });
    }
  } catch (error) {}
});
