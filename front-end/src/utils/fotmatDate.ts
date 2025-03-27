export function formatDate(isoString: string): string {
  const now = new Date();
  const targetDate = new Date(isoString);
  const diff = Math.floor((now.getTime() - targetDate.getTime()) / 1000); // 초 단위 차이

  if (diff < 1) return '방금 전';
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}
