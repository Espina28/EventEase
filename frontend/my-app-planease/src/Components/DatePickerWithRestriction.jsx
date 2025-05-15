import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './styles/DatePickerWithRestriction.css';

const DatePickerWithRestriction = ({ onChange, value, name }) => {
  const [selectedDate, setSelectedDate] = useState(value || '');
  const [minDate, setMinDate] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [daysInMonth, setDaysInMonth] = useState([]);

  // Calculate minimum date (3 weeks from now)
  useEffect(() => {
    const minDateValue = moment().add(3, 'weeks').format('YYYY-MM-DD');
    setMinDate(minDateValue);
    
    // Generate calendar days for current month
    generateDaysForMonth(currentMonth);
  }, []);

  // Update calendar when currentMonth changes
  useEffect(() => {
    generateDaysForMonth(currentMonth);
  }, [currentMonth]);

  const generateDaysForMonth = (monthMoment) => {
    const year = monthMoment.year();
    const month = monthMoment.month();
    
    // Get first day of month and calculate offset
    const firstDay = moment([year, month, 1]);
    const firstDayOfWeek = firstDay.day(); // 0 is Sunday
    
    // Get number of days in month
    const daysInMonthCount = monthMoment.daysInMonth();
    
    // Create array for calendar display
    const days = [];
    
    // Add empty spaces for days before first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days of month
    for (let i = 1; i <= daysInMonthCount; i++) {
      const dayDate = moment([year, month, i]);
      days.push({
        date: dayDate,
        day: i,
        isDisabled: dayDate.isBefore(moment().add(3, 'weeks')),
        isToday: dayDate.isSame(moment(), 'day')
      });
    }
    
    setDaysInMonth(days);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    
    // Check if date is valid (at least 3 weeks from now)
    const selectedMoment = moment(date);
    const minAcceptableDate = moment().add(3, 'weeks');
    
    if (selectedMoment.isBefore(minAcceptableDate)) {
      setShowWarning(true);
      setWarningMessage("You can't book an event less than 3 weeks from today.");
    } else {
      setShowWarning(false);
      onChange && onChange({
        target: {
          name,
          value: date
        }
      });
    }
  };

  const handleDayClick = (e, day) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    
    if (!day || day.isDisabled) return;
    
    const newDate = day.date.format('YYYY-MM-DD');
    setSelectedDate(newDate);
    setCalendarOpen(false);
    
    onChange && onChange({
      target: {
        name,
        value: newDate
      }
    });
  };

  const handlePrevMonth = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    setCurrentMonth(moment(currentMonth).subtract(1, 'month'));
  };

  const handleNextMonth = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    setCurrentMonth(moment(currentMonth).add(1, 'month'));
  };

  const toggleCalendar = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    setCalendarOpen(!calendarOpen);
  };

  // Get day names for header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="custom-date-picker">
      <div className="date-input-container">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          min={minDate}
          className="date-input"
          onClick={toggleCalendar}
        />
        <button 
          type="button" 
          className="calendar-toggle" 
          onClick={toggleCalendar}
        >
          📅
        </button>
      </div>
      
      {showWarning && (
        <div className="date-warning">
          {warningMessage}
        </div>
      )}
      
      {calendarOpen && (
        <div className="calendar-dropdown">
          <div className="calendar-header">
            <button type="button" onClick={handlePrevMonth}>&lt;</button>
            <span>{currentMonth.format('MMMM YYYY')}</span>
            <button type="button" onClick={handleNextMonth}>&gt;</button>
          </div>
          
          <div className="calendar-day-names">
            {dayNames.map(name => (
              <div key={name} className="day-name">{name}</div>
            ))}
          </div>
          
          <div className="calendar-days">
            {daysInMonth.map((day, index) => (
              <div 
                key={index} 
                className={`calendar-day ${!day ? 'empty-day' : ''} ${
                  day && day.isDisabled ? 'disabled-day' : ''
                } ${day && day.isToday ? 'today' : ''} ${
                  day && moment(selectedDate).isSame(day.date, 'day') ? 'selected-day' : ''
                }`}
                onClick={(e) => handleDayClick(e, day)}
              >
                {day && day.day}
                {day && day.isDisabled && (
                  <span className="tooltip-text">
                    Must book at least 3 weeks in advance
                  </span>
                )}
              </div>
            ))}
          </div>
          
          <div className="calendar-footer">
            <div className="date-info">
              <span className="info-dot disabled-dot"></span>
              <span>Not available (less than 3 weeks)</span>
            </div>
            <div className="date-info">
              <span className="info-dot today-dot"></span>
              <span>Today</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerWithRestriction;
