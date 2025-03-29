export const getDayOptions = (selectedInterval: string) => {
  if (selectedInterval === 'WEEKLY' || selectedInterval === 'BIWEEKLY') {
    return ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
  } else if (selectedInterval === 'MONTHLY') {
    return Array.from({ length: 31 }, (_, i) => `${i + 1}일`);
  }
  return [];
};
