export const intervalCategory: Record<string, string> = {
  WEEKLY: '매주',
  BIWEEKLY: '격주',
  MONTHLY: '매월',
};

export function formatInterval(interval: string): string {
  return intervalCategory[interval];
}
