import React from 'react';
import styled from 'styled-components';

const StreakRecoveryContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const RecoveryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const RecoveryIcon = styled.div`
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

const RecoveryInfo = styled.div`
  flex: 1;
`;

const RecoveryTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 5px 0;
  color: #333;
`;

const RecoverySubtitle = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: #666;
`;

const RecoveryContent = styled.div`
  padding: 15px;
  background-color: rgba(34, 248, 237, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
`;

const RecoveryMessage = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 15px;
`;

const RecoveryTips = styled.ul`
  margin-left: 20px;
  margin-bottom: 20px;
`;

const RecoveryTip = styled.li`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
`;

const RecoveryButton = styled.button`
  background: linear-gradient(135deg, #22f8ed, #00c2b8);
  color: black;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const StreakRecovery = ({ onRecover, canRecover = true, lastCompletedDate }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get days since last completion
  const getDaysSinceLastCompletion = () => {
    if (!lastCompletedDate) return 0;
    
    const lastDate = new Date(lastCompletedDate);
    const today = new Date();
    
    // Set both dates to midnight for accurate day calculation
    lastDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysSinceLastCompletion = getDaysSinceLastCompletion();
  
  // Determine if recovery is possible (typically only allow recovery after 1-2 days)
  const isRecoveryPossible = canRecover && daysSinceLastCompletion > 0 && daysSinceLastCompletion <= 2;
  
  return (
    <StreakRecoveryContainer>
      <RecoveryHeader>
        <RecoveryIcon>
          <i className="fas fa-life-ring"></i>
        </RecoveryIcon>
        <RecoveryInfo>
          <RecoveryTitle>Streak Recovery</RecoveryTitle>
          <RecoverySubtitle>Get back on track with your habit streak</RecoverySubtitle>
        </RecoveryInfo>
      </RecoveryHeader>
      
      <RecoveryContent>
        <RecoveryMessage>
          {isRecoveryPossible 
            ? `You missed your habit ${daysSinceLastCompletion === 1 ? 'yesterday' : 'recently'}. You can use a streak recovery to maintain your progress.`
            : daysSinceLastCompletion > 2
              ? "It's been more than 2 days since your last completion. Your streak has been reset, but you can start a new one today!"
              : "Your streak is currently active. Keep up the good work!"}
        </RecoveryMessage>
        
        <RecoveryTips>
          <RecoveryTip>Streak recovery can be used when you miss 1-2 days of your habit.</RecoveryTip>
          <RecoveryTip>You can use recovery up to twice per month to maintain momentum.</RecoveryTip>
          <RecoveryTip>The most important thing is consistency, not perfection.</RecoveryTip>
        </RecoveryTips>
        
        {lastCompletedDate && (
          <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#666' }}>
            Last completed: {formatDate(lastCompletedDate)}
          </div>
        )}
        
        <RecoveryButton 
          onClick={onRecover} 
          disabled={!isRecoveryPossible}
        >
          {isRecoveryPossible 
            ? "Use Streak Recovery" 
            : daysSinceLastCompletion > 2
              ? "Start New Streak Today"
              : "No Recovery Needed"}
        </RecoveryButton>
      </RecoveryContent>
    </StreakRecoveryContainer>
  );
};

export default StreakRecovery;
