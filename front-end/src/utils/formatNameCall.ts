export function formatNameCall(name: string): string {
  if (!name) return '';

  const lastChar = name.charAt(name.length - 1);

  if (lastChar >= '가' && lastChar <= '힣') {
    const lastCharCode = lastChar.charCodeAt(0);
    const hasJongseong = (lastCharCode - 0xac00) % 28 !== 0;

    return `${name}${hasJongseong ? '아' : '야'}`;
  }

  return `${name}아`;
}
