import React from 'react';
import styled from 'styled-components';

const StreakAnalyticsContainer = styled.div`
  margin-bottom: 30px;
`;

const AnalyticsTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.md};
  margin-bottom: 15px;
  color: ${props => props.theme.colors.primaryDark};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 15px;
  box-shadow: ${props => props.theme.shadows.small};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 700;
  color: ${props => props.theme.colors.primaryDark};
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StreakTips = styled.div`
  background: rgba(34, 248, 237, 0.1);
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 15px;
  margin-top: 20px;
`;

const TipTitle = styled.h4`
  font-size: ${props => props.theme.fontSizes.sm};
  margin-bottom: 10px;
  color: ${props => props.theme.colors.primaryDark};
`;

const TipList = styled.ul`
  margin-left: 20px;
`;

const TipItem = styled.li`
  margin-bottom: 8px;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const StreakAnalytics = ({ habitEntries, currentStreak, longestStreak }) => {
  // Calculate completion rate
  const completionRate = habitEntries.length > 0
    ? Math.round((habitEntries.filter(entry => entry.completed).length / habitEntries.length) * 100)
    : 0;
  
  // Calculate average streak length
  const calculateAverageStreakLength = () => {
    if (habitEntries.length === 0) return 0;
    
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
  
  // Get streak building tips based on current streak
  const getStreakTips = () => {
    if (currentStreak === 0) {
      return [
        "Start small - focus on consistency rather than perfection",
        "Set a specific time each day for your habit",
        "Use visual reminders like sticky notes or phone alerts",
        "Tell someone about your habit goal for accountability"
      ];
    } else if (currentStreak < 7) {
      return [
        "You're building momentum! The first week is crucial for habit formation",
        "Celebrate each day you complete your habit",
        "If you miss a day, don't break the chain twice",
        "Connect your habit to an existing routine for better consistency"
      ];
    } else if (currentStreak < 21) {
      return [
        "You're doing great! Keep going toward the 21-day milestone",
        "Notice how the habit is becoming easier to maintain",
        "Reflect on the benefits you're experiencing",
        "Consider increasing the challenge slightly to maintain interest"
      ];
    } else {
      return [
        "Impressive streak! Your habit is becoming part of your identity",
        "Share your success with others to reinforce your commitment",
        "Look for ways to deepen your practice",
        "Use your success with this habit to inspire other positive changes"
      ];
    }
  };
  
  const streakTips = getStreakTips();
  
  return (
    <StreakAnalyticsContainer>
      <AnalyticsTitle>Streak Analytics</AnalyticsTitle>
      
      <StatsGrid>
        <StatCard>
          <StatValue>{currentStreak}</StatValue>
          <StatLabel>Current Streak</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{longestStreak}</StatValue>
          <StatLabel>Longest Streak</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{averageStreakLength}</StatValue>
          <StatLabel>Avg Streak Length</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{completionRate}%</StatValue>
          <StatLabel>Completion Rate</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <StreakTips>
        <TipTitle>
          <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>
          Streak Building Tips
        </TipTitle>
        <TipList>
          {streakTips.map((tip, index) => (
            <TipItem key={index}>{tip}</TipItem>
          ))}
        </TipList>
      </StreakTips>
    </StreakAnalyticsContainer>
  );
};

export default StreakAnalytics;
