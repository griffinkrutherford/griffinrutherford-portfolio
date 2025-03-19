import React from 'react';
import styled from 'styled-components';
import { calculateCurrentStreak, calculateLongestStreak, getStreakMilestoneMessage } from '../../utils/streakUtils';

const StreakSummaryContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const StreakHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const StreakIcon = styled.div`
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

const StreakInfo = styled.div`
  flex: 1;
`;

const StreakTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 5px 0;
  color: #333;
`;

const StreakSubtitle = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: #666;
`;

const StreakGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StreakMetric = styled.div`
  text-align: center;
  padding: 15px;
  background-color: ${props => props.highlight ? 'rgba(34, 248, 237, 0.1)' : '#f5f5f5'};
  border-radius: 8px;
  border-left: ${props => props.highlight ? '4px solid #22f8ed' : 'none'};
`;

const MetricValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.highlight ? '#00c2b8' : '#333'};
  margin-bottom: 5px;
`;

const MetricLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MilestoneMessage = styled.div`
  background-color: rgba(34, 248, 237, 0.1);
  border-left: 4px solid #22f8ed;
  padding: 10px 15px;
  font-size: 0.9rem;
  color: #333;
  display: flex;
  align-items: center;
  
  i {
    margin-right: 10px;
    color: #00c2b8;
  }
`;

const StreakSummary = ({ habitEntries, habitName = "this habit" }) => {
  // Calculate streak metrics
  const currentStreak = calculateCurrentStreak(habitEntries);
  const longestStreak = calculateLongestStreak(habitEntries);
  
  // Calculate completion rate
  const completionRate = habitEntries.length > 0
    ? Math.round((habitEntries.filter(entry => entry.completed).length / habitEntries.length) * 100)
    : 0;
  
  // Get milestone message
  const milestoneMessage = getStreakMilestoneMessage(currentStreak);
  
  // Get appropriate icon based on streak
  const getStreakIcon = () => {
    if (currentStreak >= 30) return "fas fa-award";
    if (currentStreak >= 7) return "fas fa-fire";
    return "fas fa-calendar-check";
  };
  
  return (
    <StreakSummaryContainer>
      <StreakHeader>
        <StreakIcon>
          <i className={getStreakIcon()}></i>
        </StreakIcon>
        <StreakInfo>
          <StreakTitle>Streak Summary</StreakTitle>
          <StreakSubtitle>Track your consistency with {habitName}</StreakSubtitle>
        </StreakInfo>
      </StreakHeader>
      
      <StreakGrid>
        <StreakMetric highlight={true}>
          <MetricValue highlight={true}>{currentStreak}</MetricValue>
          <MetricLabel>Current Streak</MetricLabel>
        </StreakMetric>
        
        <StreakMetric>
          <MetricValue>{longestStreak}</MetricValue>
          <MetricLabel>Longest Streak</MetricLabel>
        </StreakMetric>
        
        <StreakMetric>
          <MetricValue>{completionRate}%</MetricValue>
          <MetricLabel>Completion Rate</MetricLabel>
        </StreakMetric>
      </StreakGrid>
      
      <MilestoneMessage>
        <i className="fas fa-trophy"></i>
        {milestoneMessage}
      </MilestoneMessage>
    </StreakSummaryContainer>
  );
};

export default StreakSummary;
