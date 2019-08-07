export default function toNanoPrefix(value = '') {
  return String(value).replace(/^bcb/, 'bcb');
}
