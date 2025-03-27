export function formatMoney(money: number): string {
  return money.toLocaleString('ko-KR') + '원';
}
