const dayMap: { [key: string]: number } = {
  일요일: 0,
  월요일: 1,
  화요일: 2,
  수요일: 3,
  목요일: 4,
  금요일: 5,
  토요일: 6,
};

export const getNextDate = (interval: string, day: string): string => {
  const today = new Date();
  const targetDate = new Date(today);

  const targetDay = dayMap[day];

  if (interval === '매주' || interval === '격주') {
    let diff = targetDay - today.getDay();

    if (diff <= 0) {
      diff += 7;
    }

    if (interval === '격주') {
      diff += 7;
    }

    targetDate.setDate(today.getDate() + diff);
  } else if (interval === '매월') {
    const targetDayNum = parseInt(day);

    if (targetDayNum > today.getDate()) {
      targetDate.setDate(targetDayNum);
    } else {
      targetDate.setMonth(today.getMonth() + 1);
      targetDate.setDate(targetDayNum);
    }
  }

  return targetDate.toISOString().split('T')[0];
};
