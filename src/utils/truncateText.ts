export function truncateText(text: string, maxLength = 24) {
  return text.length > maxLength
    ? text.substring(0, maxLength - 3) + '...'
    : text;
}
