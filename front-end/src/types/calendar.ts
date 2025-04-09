// types/calendar.ts

export interface CalendarDataItem {
  date: string;
  sum: number;
}

export interface CalendarResponse {
  expense: number;
  income: number;
  sum: number;
  calendar: CalendarDataItem[];
}

export interface CalendarDay {
  day: number | null;
  active: boolean;
  date: Date | null;
  sum: number | null;
}

export interface ErrorResponse {
  code: string;
  message: string;
}
