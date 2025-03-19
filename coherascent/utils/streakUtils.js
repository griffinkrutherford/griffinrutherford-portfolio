import React from 'react';
import styled from 'styled-components';

const StreakUtilsContainer = styled.div`
  margin-bottom: 30px;
`;

// Helper function to calculate current streak
export const calculateCurrentStreak = (entries) => {
  if (!entries || entries.length === 0) return 0;
  
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Convert today to YYYY-MM-DD format
  const todayStr = today.toISOString().split('T')[0];
  
  // Check if there's an entry for today
  const hasTodayEntry = sortedEntries.some(entry => entry.date === todayStr && entry.completed);
  
  // If no entry for today, check if there's an entry for yesterday
  if (!hasTodayEntry) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const hasYesterdayEntry = sortedEntries.some(entry => entry.date === yesterdayStr && entry.completed);
    
    // If no entry for yesterday either, streak is broken
    if (!hasYesterdayEntry) return 0;
  }
  
  // Calculate streak by counting consecutive completed entries
  for (let i = 0; i < sortedEntries.length; i++) {
    const entry = sortedEntries[i];
    
    if (entry.completed) {
      streak++;
      
      // Check if the next entry is consecutive
      if (i < sortedEntries.length - 1) {
        const currentDate = new Date(entry.date);
        const nextDate = new Date(sortedEntries[i + 1].date);
        
        // Calculate the difference in days
        const diffTime = Math.abs(currentDate - nextDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // If not consecutive, break the streak
        if (diffDays !== 1) break;
      }
    } else {
      // If entry is not completed, break the streak
      break;
    }
  }
  
  return streak;
};

// Helper function to calculate longest streak
export const calculateLongestStreak = (entries) => {
  if (!entries || entries.length === 0) return 0;
  
  // Sort entries by date (oldest first)
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  
  let currentStreak = 0;
  let longestStreak = 0;
  let previousDate = null;
  
  for (let i = 0; i < sortedEntries.length; i++) {
    const entry = sortedEntries[i];
    const entryDate = new Date(entry.date);
    
    if (entry.completed) {
      // If this is the first entry or if it's consecutive with the previous entry
      if (previousDate === null || isConsecutiveDay(previousDate, entryDate)) {
        currentStreak++;
      } else {
        // If there's a gap, reset the current streak
        currentStreak = 1;
      }
      
      // Update longest streak if current streak is longer
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
      
      previousDate = entryDate;
    } else {
      // If entry is not completed, reset the current streak
      currentStreak = 0;
      previousDate = null;
    }
  }
  
  return longestStreak;
};

// Helper function to check if two dates are consecutive days
const isConsecutiveDay = (date1, date2) => {
  // Clone dates to avoid modifying the originals
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Set time to midnight to compare only dates
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  // Calculate the difference in days
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
};

// Helper function to get streak milestone message
export const getStreakMilestoneMessage = (streak) => {
  if (streak >= 365) {
    return "One Year Achievement! 🏆";
  } else if (streak >= 180) {
    return "Six Month Milestone! 🥇";
  } else if (streak >= 90) {
    return "Three Month Milestone! 🥈";
  } else if (streak >= 30) {
    return "One Month Milestone! ⭐";
  } else if (streak >= 21) {
    return "21 Day Milestone! 🌱";
  } else if (streak >= 7) {
    return "One Week Streak! 🔥";
  } else if (streak >= 3) {
    return "Three Day Streak! 👍";
  } else if (streak >= 1) {
    return "Streak Started! 🚩";
  } else {
    return "Start your streak today!";
  }
};

// Helper function to format date
export const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Export an empty component to satisfy React conventions
const StreakUtils = () => {
  return <StreakUtilsContainer />;
};

export default StreakUtils;
