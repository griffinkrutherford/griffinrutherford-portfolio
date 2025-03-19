import React from 'react';
import styled from 'styled-components';

const StreakInsightsContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const InsightsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const InsightsIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22f8ed, #00c2b8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  
  i {
    color: black;
    font-size: 1.5rem;
  }
`;

const InsightsInfo = styled.div`
  flex: 1;
`;

const InsightsTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 5px 0;
  color: #333;
`;

const InsightsSubtitle = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: #666;
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const InsightCard = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const InsightTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  display: flex;
  align-items: center;
  
  i {
    margin-right: 8px;
    color: #00c2b8;
  }
`;

const InsightContent = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0;
`;

const StreakInsights = ({ habitEntries, currentStreak, longestStreak }) => {
  // Calculate completion patterns
  const calculateCompletionPatterns = () => {
    if (!habitEntries || habitEntries.length === 0) {
      return {
        weekdayCompletion: {},
        bestDay: null,
        worstDay: null
      };
    }
    
    // Initialize weekday counters
    const weekdayCompletions = {
      0: { total: 0, completed: 0 }, // Sunday
      1: { total: 0, completed: 0 }, // Monday
      2: { total: 0, completed: 0 }, // Tuesday
      3: { total: 0, completed: 0 }, // Wednesday
      4: { total: 0, completed: 0 }, // Thursday
      5: { total: 0, completed: 0 }, // Friday
      6: { total: 0, completed: 0 }  // Saturday
    };
    
    // Count completions by weekday
    habitEntries.forEach(entry => {
      const date = new Date(entry.date);
      const weekday = date.getDay();
      
      weekdayCompletions[weekday].total++;
      if (entry.completed) {
        weekdayCompletions[weekday].completed++;
      }
    });
    
    // Calculate completion rates
    const weekdayRates = {};
    Object.keys(weekdayCompletions).forEach(day => {
      const { total, completed } = weekdayCompletions[day];
      weekdayRates[day] = total > 0 ? (completed / total) * 100 : 0;
    });
    
    // Find best and worst days
    let bestDay = null;
    let worstDay = null;
    let bestRate = -1;
    let worstRate = 101;
    
    Object.keys(weekdayRates).forEach(day => {
      const rate = weekdayRates[day];
      if (weekdayCompletions[day].total >= 3) { // Only consider days with enough data
        if (rate > bestRate) {
          bestRate = rate;
          bestDay = parseInt(day);
        }
        if (rate < worstRate) {
          worstRate = rate;
          worstDay = parseInt(day);
        }
      }
    });
    
    return {
      weekdayRates,
      bestDay,
      worstDay
    };
  };
  
  const { weekdayRates, bestDay, worstDay } = calculateCompletionPatterns();
  
  // Get weekday name
  const getWeekdayName = (day) => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[day];
  };
  
  // Calculate average streak length
  const calculateAverageStreakLength = () => {
    if (!habitEntries || habitEntries.length === 0) return 0;
    
    let streaks = [];
    let currentStreakCount = 0;
    
    // Sort entries by date
    const sortedEntries = [...habitEntries].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    // Calculate streaks
    sortedEntries.forEach(entry => {
      if (entry.completed) {
        currentStreakCount++;
      } else {
        if (currentStreakCount > 0) {
          streaks.push(currentStreakCount);
          currentStreakCount = 0;
        }
      }
    });
    
    // Add the last streak if it exists
    if (currentStreakCount > 0) {
      streaks.push(currentStreakCount);
    }
    
    // Calculate average
    return streaks.length > 0
      ? Math.round(streaks.reduce((sum, streak) => sum + streak, 0) / streaks.length)
      : 0;
  };
  
  const averageStreakLength = calculateAverageStreakLength();
  
  // Generate insights based on data
  const generateInsights = () => {
    const insights = [];
    
    // Streak comparison insight
    if (currentStreak > 0 && longestStreak > 0) {
      if (currentStreak === longestStreak) {
        insights.push({
          icon: "fas fa-trophy",
          title: "Personal Best",
          content: `You're currently at your longest streak ever (${currentStreak} days)! Keep going to set a new record.`
        });
      } else {
        const percentOfBest = Math.round((currentStreak / longestStreak) * 100);
        insights.push({
          icon: "fas fa-chart-line",
          title: "Streak Progress",
          content: `Your current streak is ${percentOfBest}% of your personal best (${longestStreak} days). Keep going!`
        });
      }
    }
    
    // Best day insight
    if (bestDay !== null) {
      insights.push({
        icon: "fas fa-calendar-check",
        title: "Most Consistent Day",
        content: `${getWeekdayName(bestDay)} is your most consistent day, with a ${Math.round(weekdayRates[bestDay])}% completion rate.`
      });
    }
    
    // Challenging day insight
    if (worstDay !== null) {
      insights.push({
        icon: "fas fa-calendar-times",
        title: "Most Challenging Day",
        content: `${getWeekdayName(worstDay)} tends to be your most challenging day, with a ${Math.round(weekdayRates[worstDay])}% completion rate.`
      });
    }
    
    // Average streak insight
    if (averageStreakLength > 0) {
      insights.push({
        icon: "fas fa-calculator",
        title: "Average Streak Length",
        content: `Your average streak length is ${averageStreakLength} days. Consistency builds over time!`
      });
    }
    
    return insights;
  };
  
  const insights = generateInsights();
  
  return (
    <StreakInsightsContainer>
      <InsightsHeader>
        <InsightsIcon>
          <i className="fas fa-lightbulb"></i>
        </InsightsIcon>
        <InsightsInfo>
          <InsightsTitle>Streak Insights</InsightsTitle>
          <InsightsSubtitle>Discover patterns in your habit consistency</InsightsSubtitle>
        </InsightsInfo>
      </InsightsHeader>
      
      <InsightsGrid>
        {insights.map((insight, index) => (
          <InsightCard key={index}>
            <InsightTitle>
              <i className={insight.icon}></i>
              {insight.title}
            </InsightTitle>
            <InsightContent>{insight.content}</InsightContent>
          </InsightCard>
        ))}
        
        {insights.length === 0 && (
          <InsightCard>
            <InsightTitle>
              <i className="fas fa-info-circle"></i>
              Not Enough Data
            </InsightTitle>
            <InsightContent>
              Continue tracking your habit to generate personalized insights about your patterns and progress.
            </InsightContent>
          </InsightCard>
        )}
      </InsightsGrid>
    </StreakInsightsContainer>
  );
};

export default StreakInsights;
