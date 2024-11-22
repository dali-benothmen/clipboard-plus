import { handleCopyEvent } from '../../utils/storageUtils';

document.addEventListener('copy', (event) => {
  const getCopiedData = () => {
    const copiedText = document.getSelection().toString();
    const url = window.location.href;
    const hostname = window.location.hostname;
    const name = document.title || url;
    const favicon =
      document.querySelector("link[rel~='icon']")?.href ||
      `${window.location.origin}/favicon.ico`;

    return { copiedText, url, hostname, name, favicon };
  };

  handleCopyEvent(event, getCopiedData);
});
