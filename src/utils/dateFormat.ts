export function formatTimeFromISO(isoDate: string) {
  const dateObj = new Date(isoDate);

  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateFromISO(isoDate: string) {
  const dateObj = new Date(isoDate);

  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
