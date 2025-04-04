export type IntervalType = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

export interface RegularTransfer {
  childId: 2;
  childName: string;
  image: string;
  childAccountNo: string;
  schedules: Schedule[];
}

export interface Schedule {
  scheduleId: number;
  amount: number;
  interval: IntervalType;
  day: string;
  startDate: string;
}

export interface SchedulePostForm {
  childId: number;
  amount: number;
  interval: IntervalType;
  startDate: string;
}
