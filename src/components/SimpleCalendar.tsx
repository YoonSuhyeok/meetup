import React, { useState } from 'react';

interface CalendarProps {
  selectedDates: Date[];
  onDateSelect: (date: Date) => void;
}

export const SimpleCalendar: React.FC<CalendarProps> = ({ selectedDates, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 현재 월의 첫 번째 날과 마지막 날
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // 달력 시작일 (월요일부터 시작하도록 조정)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  // 5주 분량의 날짜 생성
  const dates: Date[] = [];
  for (let i = 0; i < 35; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  
  const isDateSelected = (date: Date): boolean => {
    return selectedDates.some(selected => 
      selected.getDate() === date.getDate() &&
      selected.getMonth() === date.getMonth() &&
      selected.getFullYear() === date.getFullYear()
    );
  };
  
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };
  
  const formatDate = (date: Date): string => {
    return date.getDate().toString();
  };
  
  const formatMonth = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => navigateMonth('prev')} className="nav-button">
          ←
        </button>
        <h3 className="month-title">{formatMonth(currentDate)}</h3>
        <button onClick={() => navigateMonth('next')} className="nav-button">
          →
        </button>
      </div>
      
      <div className="calendar-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="weekday">
            {day}
          </div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {dates.map((date, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(date)}
            className={`calendar-day ${
              isCurrentMonth(date) ? 'current-month' : 'other-month'
            } ${
              isDateSelected(date) ? 'selected' : ''
            }`}
          >
            {formatDate(date)}
          </button>
        ))}
      </div>
    </div>
  );
};
