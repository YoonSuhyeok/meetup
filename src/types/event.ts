export interface EventCreationState {
  eventName: string;
  selectedDates: Date[];
  startTime: string;
  endTime: string;
  timezone: string;
  surveyType: 'specific-dates' | 'days-of-week';
  selectedDaysOfWeek: number[];
}

export interface TimeSlot {
  time: string;
  label: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  { time: '00:00', label: '12:00 AM' },
  { time: '01:00', label: '1:00 AM' },
  { time: '02:00', label: '2:00 AM' },
  { time: '03:00', label: '3:00 AM' },
  { time: '04:00', label: '4:00 AM' },
  { time: '05:00', label: '5:00 AM' },
  { time: '06:00', label: '6:00 AM' },
  { time: '07:00', label: '7:00 AM' },
  { time: '08:00', label: '8:00 AM' },
  { time: '09:00', label: '9:00 AM' },
  { time: '10:00', label: '10:00 AM' },
  { time: '11:00', label: '11:00 AM' },
  { time: '12:00', label: '12:00 PM' },
  { time: '13:00', label: '1:00 PM' },
  { time: '14:00', label: '2:00 PM' },
  { time: '15:00', label: '3:00 PM' },
  { time: '16:00', label: '4:00 PM' },
  { time: '17:00', label: '5:00 PM' },
  { time: '18:00', label: '6:00 PM' },
  { time: '19:00', label: '7:00 PM' },
  { time: '20:00', label: '8:00 PM' },
  { time: '21:00', label: '9:00 PM' },
  { time: '22:00', label: '10:00 PM' },
  { time: '23:00', label: '11:00 PM' },
];

export const TIMEZONES = [
  { value: 'Asia/Seoul', label: 'Asia/Seoul' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai' },
  { value: 'America/New_York', label: 'America/New_York' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'Europe/Paris', label: 'Europe/Paris' },
  { value: 'UTC', label: 'UTC' },
];

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'S' },
  { value: 1, label: 'Monday', short: 'M' },
  { value: 2, label: 'Tuesday', short: 'T' },
  { value: 3, label: 'Wednesday', short: 'W' },
  { value: 4, label: 'Thursday', short: 'T' },
  { value: 5, label: 'Friday', short: 'F' },
  { value: 6, label: 'Saturday', short: 'S' },
];
