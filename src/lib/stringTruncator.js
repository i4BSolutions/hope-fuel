export default function stringTruncator(str, maxLength) {
  if (!maxLength) return str;
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
}
