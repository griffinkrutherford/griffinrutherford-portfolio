import React from 'react';
import styled from 'styled-components';

const StreakCalendarContainer = styled.div`
  margin-bottom: 30px;
`;

const CalendarTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.md};
  margin-bottom: 15px;
  color: ${props => props.theme.colors.primaryDark};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const DayLabel = styled.div`
  text-align: center;
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 5px;
`;

const DayCell = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.completed 
    ? props.theme.colors.primary 
    : props.missed 
      ? 'rgba(244, 67, 54, 0.1)' 
      : props.future 
        ? 'transparent'
        : props.theme.colors.gray};
  color: ${props => props.completed ? 'white' : props.theme.colors.text};
  font-weight: ${props => props.isToday ? '700' : '400'};
  border: ${props => props.isToday ? '2px solid #000' : 'none'};
  font-size: ${props => props.theme.fontSizes.xs};
  
  @media (min-width: 768px) {
    font-size: ${props => props.theme.fontSizes.sm};
  }
`;

const StreakCalendar = ({ habitEntries, days = 28 }) => {
  // Get the last N days
  const getLastNDays = () => {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  };
  
  const lastNDays = getLastNDays();
  
  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Check if a date is in the future
  const isFuture = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };
  
  // Check if habit was completed on a specific date
  const wasCompletedOnDate = (date) => {
    const dateStr = formatDate(date);
    const entry = habitEntries.find(entry => entry.date === dateStr);
    return entry && entry.completed;
  };
  
  // Check if habit was missed on a specific date
  const wasMissedOnDate = (date) => {
    const dateStr = formatDate(date);
    const entry = habitEntries.find(entry => entry.date === dateStr);
    return entry && !entry.completed;
  };
  
  // Get day of week labels
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <StreakCalendarContainer>
      <CalendarTitle>Completion Calendar</CalendarTitle>
      
      <CalendarGrid>
        {dayLabels.map(day => (
          <DayLabel key={day}>{day}</DayLabel>
        ))}
        
        {lastNDays.map(date => (
          <DayCell 
            key={formatDate(date)}
            completed={wasCompletedOnDate(date)}
            missed={wasMissedOnDate(date)}
            future={isFuture(date)}
            isToday={isToday(date)}
          >
            {date.getDate()}
          </DayCell>
        ))}
      </CalendarGrid>
    </StreakCalendarContainer>
  );
};

export default StreakCalendar;
