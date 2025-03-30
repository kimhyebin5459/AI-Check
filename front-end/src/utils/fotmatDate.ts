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

export const formatDateToParam = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
