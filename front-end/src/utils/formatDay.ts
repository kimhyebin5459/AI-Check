const dayCategory: Record<string, string> = {
  MONDAY: '월요일',
  TUESDAY: '화요일',
  WEDNESDAY: '수요일',
  THURSDAY: '목요일',
  FRIDAY: '금요일',
  SATURDAY: '토요일',
  SUNDAY: '일요일',
};

export function formatDay(day: string | number): string {
  if (!isNaN(Number(day))) return `${day}일`;
  else return dayCategory[day];
}
