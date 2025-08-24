import React, { useState, useCallback, useRef, useEffect } from "react";
import "./App.css";

interface EventState {
  eventName: string;
  selectedDates: Date[];
  startTime: string;
  endTime: string;
  timezone: string;
  surveyType: 'specific-dates' | 'days-of-week';
  selectedTimeSlots: { [dateKey: string]: string[] }; // dateKey: "YYYY-MM-DD", value: array of time slots like ["09:00", "10:00"]
}

interface DragState {
  isDragging: boolean;
  dragMode: 'select' | 'deselect' | null;
  startDate: string | null;
  startTime: string | null;
}

function App() {
  const [eventState, setEventState] = useState<EventState>({
    eventName: "New Event Name",
    selectedDates: [],
    startTime: "09:00",
    endTime: "17:00",
    timezone: "Asia/Seoul",
    surveyType: "specific-dates",
    selectedTimeSlots: {}
  });

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragMode: null,
    startDate: null,
    startTime: null
  });

  const timeGridRef = useRef<HTMLDivElement>(null);

  const timeOptions = [
    { value: "00:00", label: "12:00 AM" },
    { value: "01:00", label: "1:00 AM" },
    { value: "02:00", label: "2:00 AM" },
    { value: "03:00", label: "3:00 AM" },
    { value: "04:00", label: "4:00 AM" },
    { value: "05:00", label: "5:00 AM" },
    { value: "06:00", label: "6:00 AM" },
    { value: "07:00", label: "7:00 AM" },
    { value: "08:00", label: "8:00 AM" },
    { value: "09:00", label: "9:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "13:00", label: "1:00 PM" },
    { value: "14:00", label: "2:00 PM" },
    { value: "15:00", label: "3:00 PM" },
    { value: "16:00", label: "4:00 PM" },
    { value: "17:00", label: "5:00 PM" },
    { value: "18:00", label: "6:00 PM" },
    { value: "19:00", label: "7:00 PM" },
    { value: "20:00", label: "8:00 PM" },
    { value: "21:00", label: "9:00 PM" },
    { value: "22:00", label: "10:00 PM" },
    { value: "23:00", label: "11:00 PM" },
  ];

  const timezones = [
    { value: "Asia/Seoul", label: "Asia/Seoul" },
    { value: "Asia/Tokyo", label: "Asia/Tokyo" },
    { value: "America/New_York", label: "America/New_York" },
    { value: "America/Los_Angeles", label: "America/Los_Angeles" },
    { value: "Europe/London", label: "Europe/London" },
    { value: "UTC", label: "UTC" },
  ];

  // 간단한 캘린더 생성 (현재 월)
  const generateCalendarDates = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // 이번 달 1일부터 시작
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const dates = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
      dates.push(new Date(currentYear, currentMonth, day));
    }
    
    return dates;
  };

  // 시간 슬롯 생성 함수
  const generateTimeSlots = () => {
    const startHour = parseInt(eventState.startTime.split(':')[0]);
    const endHour = parseInt(eventState.endTime.split(':')[0]);
    const slots = [];
    
    for (let hour = startHour; hour <= endHour; hour++) {
      const timeString = hour.toString().padStart(2, '0') + ':00';
      slots.push(timeString);
    }
    
    return slots;
  };

  // 날짜를 키로 변환하는 함수
  const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  };

  // 시간 슬롯 선택/해제 함수
  const handleTimeSlotClick = (date: Date, timeSlot: string) => {
    if (dragState.isDragging) return; // 드래그 중일 때는 클릭 이벤트 무시
    
    const dateKey = getDateKey(date);
    const currentSlots = eventState.selectedTimeSlots[dateKey] || [];
    
    if (currentSlots.includes(timeSlot)) {
      // 시간 슬롯 제거
      const newSlots = currentSlots.filter(slot => slot !== timeSlot);
      setEventState(prev => ({
        ...prev,
        selectedTimeSlots: {
          ...prev.selectedTimeSlots,
          [dateKey]: newSlots
        }
      }));
    } else {
      // 시간 슬롯 추가
      setEventState(prev => ({
        ...prev,
        selectedTimeSlots: {
          ...prev.selectedTimeSlots,
          [dateKey]: [...currentSlots, timeSlot]
        }
      }));
    }
  };

  // 드래그 시작
  const handleMouseDown = (date: Date, timeSlot: string, event: React.MouseEvent) => {
    event.preventDefault();
    const dateKey = getDateKey(date);
    const isCurrentlySelected = isTimeSlotSelected(date, timeSlot);
    
    setDragState({
      isDragging: true,
      dragMode: isCurrentlySelected ? 'deselect' : 'select',
      startDate: dateKey,
      startTime: timeSlot
    });

    // 첫 번째 슬롯 즉시 토글
    toggleTimeSlot(date, timeSlot, !isCurrentlySelected);
  };

  // 드래그 중 마우스 오버
  const handleMouseEnter = (date: Date, timeSlot: string) => {
    if (!dragState.isDragging) return;
    
    const shouldSelect = dragState.dragMode === 'select';
    const isCurrentlySelected = isTimeSlotSelected(date, timeSlot);
    
    if (shouldSelect && !isCurrentlySelected) {
      toggleTimeSlot(date, timeSlot, true);
    } else if (!shouldSelect && isCurrentlySelected) {
      toggleTimeSlot(date, timeSlot, false);
    }
  };

  // 드래그 종료
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      dragMode: null,
      startDate: null,
      startTime: null
    });
  }, []);

  // 시간 슬롯 토글 헬퍼 함수
  const toggleTimeSlot = (date: Date, timeSlot: string, shouldSelect: boolean) => {
    const dateKey = getDateKey(date);
    const currentSlots = eventState.selectedTimeSlots[dateKey] || [];
    
    if (shouldSelect && !currentSlots.includes(timeSlot)) {
      setEventState(prev => ({
        ...prev,
        selectedTimeSlots: {
          ...prev.selectedTimeSlots,
          [dateKey]: [...currentSlots, timeSlot]
        }
      }));
    } else if (!shouldSelect && currentSlots.includes(timeSlot)) {
      const newSlots = currentSlots.filter(slot => slot !== timeSlot);
      setEventState(prev => ({
        ...prev,
        selectedTimeSlots: {
          ...prev.selectedTimeSlots,
          [dateKey]: newSlots
        }
      }));
    }
  };

  // 전역 마우스 이벤트 리스너 추가
  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp();
    
    if (dragState.isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [dragState.isDragging, handleMouseUp]);

  // 시간 슬롯이 선택되었는지 확인
  const isTimeSlotSelected = (date: Date, timeSlot: string) => {
    const dateKey = getDateKey(date);
    const currentSlots = eventState.selectedTimeSlots[dateKey] || [];
    return currentSlots.includes(timeSlot);
  };

  const calendarDates = generateCalendarDates();

  const handleDateClick = (date: Date) => {
    const dateExists = eventState.selectedDates.some(
      selectedDate => selectedDate.getTime() === date.getTime()
    );

    if (dateExists) {
      setEventState(prev => ({
        ...prev,
        selectedDates: prev.selectedDates.filter(
          selectedDate => selectedDate.getTime() !== date.getTime()
        )
      }));
    } else {
      setEventState(prev => ({
        ...prev,
        selectedDates: [...prev.selectedDates, date]
      }));
    }
  };

  const isDateSelected = (date: Date) => {
    return eventState.selectedDates.some(
      selectedDate => selectedDate.getTime() === date.getTime()
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const createEvent = () => {
    const eventId = Math.random().toString(36).substring(2, 15);
    alert(`Event created! ID: ${eventId}\nSelected dates: ${eventState.selectedDates.length}`);
  };

  return (
    <main className="when2meet-container">
      <div className="header">
        <nav className="nav-links">
          <a href="#about">About When2meet</a>
          <a href="#new">Plan a New Event</a>
        </nav>
      </div>

      <div className="event-creation">
        <table className="event-table">
          <tbody>
            <tr>
              <td className="section-cell">
                <input
                  type="text"
                  value={eventState.eventName}
                  onChange={(e) => setEventState(prev => ({ ...prev, eventName: e.target.value }))}
                  className="event-name-input"
                  placeholder="New Event Name"
                />
              </td>
            </tr>
            
            <tr>
              <td className="main-content">
                <div className="content-row">
                  <div className="dates-section">
                    <h3>What dates might work?</h3>
                    <p>Click and drag dates to choose possibilities.</p>
                    
                    <div className="survey-type">
                      <label>Survey using:</label>
                      <select 
                        value={eventState.surveyType}
                        onChange={(e) => setEventState(prev => ({ 
                          ...prev, 
                          surveyType: e.target.value as 'specific-dates' | 'days-of-week'
                        }))}
                      >
                        <option value="specific-dates">Specific Dates</option>
                        <option value="days-of-week">Days of the Week</option>
                      </select>
                    </div>

                    <div className="calendar">
                      <div className="weekdays">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                          <div key={index} className="weekday">{day}</div>
                        ))}
                      </div>
                      
                      <div className="calendar-grid">
                        {calendarDates.map((date, index) => (
                          <button
                            key={index}
                            onClick={() => handleDateClick(date)}
                            className={`calendar-day ${isDateSelected(date) ? 'selected' : ''}`}
                          >
                            <div className="date-number">{date.getDate()}</div>
                            <div className="date-info">
                              <div className="month">{formatDate(date).split(' ')[0]}</div>
                              <div className="day">{formatDay(date)}</div>
                            </div>
                          </button>
                        ))}
                      </div>

                      <button className="today-btn">Today</button>
                    </div>
                  </div>

                  <div className="times-section">
                    <h3>What times might work?</h3>
                    
                    <div className="time-selection">
                      <div className="time-row">
                        <label>No earlier than:</label>
                        <select
                          value={eventState.startTime}
                          onChange={(e) => setEventState(prev => ({ ...prev, startTime: e.target.value }))}
                        >
                          {timeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="time-row">
                        <label>No later than:</label>
                        <select
                          value={eventState.endTime}
                          onChange={(e) => setEventState(prev => ({ ...prev, endTime: e.target.value }))}
                        >
                          {timeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="time-row">
                        <label>Time Zone:</label>
                        <select
                          value={eventState.timezone}
                          onChange={(e) => setEventState(prev => ({ ...prev, timezone: e.target.value }))}
                        >
                          {timezones.map(tz => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td className="create-section">
                <div className="create-event-area">
                  <span>Ready?</span>
                  <button onClick={createEvent} className="create-event-btn">
                    Create Event
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {eventState.selectedDates.length > 0 && (
        <div className="selected-dates-preview">
          <h4>Selected Dates ({eventState.selectedDates.length}):</h4>
          <div className="dates-list">
            {eventState.selectedDates.map((date, index) => (
              <span key={index} className="selected-date">
                {formatDate(date)} ({formatDay(date)})
              </span>
            ))}
          </div>
        </div>
      )}

      {eventState.selectedDates.length > 0 && (
        <div className="time-grid-section">
          <h3>Select your available times for each date:</h3>
          <div className="time-grid-container">
            <div className="time-grid">
              {/* 시간 헤더 */}
              <div className="time-header">
                <div className="date-column-header">Date</div>
                {generateTimeSlots().map(timeSlot => (
                  <div key={timeSlot} className="time-column-header">
                    {timeOptions.find(opt => opt.value === timeSlot)?.label || timeSlot}
                  </div>
                ))}
              </div>
              
              {/* 각 날짜별 시간 선택 행 */}
              {eventState.selectedDates.map((date, dateIndex) => (
                <div key={dateIndex} className="time-row-grid">
                  <div className="date-column">
                    <div className="date-label">
                      {formatDate(date)}
                    </div>
                    <div className="day-label">
                      {formatDay(date)}
                    </div>
                  </div>
                  
                  {generateTimeSlots().map(timeSlot => (
                    <button
                      key={timeSlot}
                      onMouseDown={(e) => handleMouseDown(date, timeSlot, e)}
                      onMouseEnter={() => handleMouseEnter(date, timeSlot)}
                      onMouseUp={handleMouseUp}
                      onClick={() => handleTimeSlotClick(date, timeSlot)}
                      className={`time-slot-btn ${isTimeSlotSelected(date, timeSlot) ? 'selected' : ''} ${dragState.isDragging ? 'dragging' : ''}`}
                      style={{ userSelect: 'none' }}
                    >
                      <div className="time-slot-content">
                        {isTimeSlotSelected(date, timeSlot) ? '✓' : ''}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
