import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

export const generateEventId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 7);
  return `${timestamp.slice(-8)}-${random}`;
};

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date): string => {
  return format(date, 'MMM d');
};

export const formatDisplayDay = (date: Date): string => {
  return format(date, 'EEE');
};

export const getWeekDates = (startDate: Date): Date[] => {
  const start = startOfWeek(startDate);
  return Array.from({ length: 35 }, (_, i) => addDays(start, i));
};

export const isDateSelected = (date: Date, selectedDates: Date[]): boolean => {
  return selectedDates.some(selectedDate => isSameDay(date, selectedDate));
};

export const toggleDateSelection = (date: Date, selectedDates: Date[]): Date[] => {
  const isSelected = isDateSelected(date, selectedDates);
  
  if (isSelected) {
    return selectedDates.filter(selectedDate => !isSameDay(date, selectedDate));
  } else {
    return [...selectedDates, date];
  }
};
