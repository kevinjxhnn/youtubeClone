export function calculateDaysAgo(publishedTimestampSeconds) {
  const currentDateMilliseconds = new Date().getTime();
  const firebaseDatetimeMilliseconds = publishedTimestampSeconds * 1000;
  const timeDifference = currentDateMilliseconds - firebaseDatetimeMilliseconds;
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return daysAgo;
}
