const dayCategory: Record<string, string> = {
  MONDAY: '월요일',
  TUESDAY: '화요일',
  WEDNESDAY: '수요일',
  THURSDAY: '목요일',
  FRIDAY: '금요일',
  SATURDAY: '토요일',
  SUNDAY: '일요일',
};

export function formatTransferPlan(interval: string, day: string): string {
  switch (interval) {
    case 'MONTHLY':
      return `매월 ${day}일`;
    case 'WEEKLY':
      return `매주 ${dayCategory[day]}`;
    case 'BIWEEKLY':
      return `격주 ${dayCategory[day]}`;
  }
  return '';
}
