export function FormatDateUTC(isoString) {
  const date = new Date(isoString);
  return date.toUTCString();
}
