import React from 'react';
import styled from 'styled-components';

const StreakChallengeContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const ChallengeHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ChallengeIcon = styled.div`
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

const ChallengeInfo = styled.div`
  flex: 1;
`;

const ChallengeTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 5px 0;
  color: #333;
`;

const ChallengeSubtitle = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: #666;
`;

const ChallengeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const ChallengeCard = styled.div`
  background-color: ${props => props.active ? 'rgba(34, 248, 237, 0.1)' : '#f5f5f5'};
  border-radius: 8px;
  padding: 15px;
  border-left: ${props => props.active ? '4px solid #22f8ed' : 'none'};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ChallengeName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
`;

const ChallengeDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 15px;
`;

const ChallengeProgress = styled.div`
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(to right, #22f8ed, #00c2b8);
  border-radius: 4px;
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-align: right;
`;

const StreakChallenge = ({ currentStreak }) => {
  // Define streak challenges
  const challenges = [
    {
      name: "3-Day Kickoff",
      description: "Complete your habit for 3 consecutive days to build initial momentum.",
      target: 3,
      active: currentStreak < 3
    },
    {
      name: "Weekly Warrior",
      description: "Maintain your streak for a full week to establish a routine.",
      target: 7,
      active: currentStreak >= 3 && currentStreak < 7
    },
    {
      name: "21-Day Habit Builder",
      description: "Reach 21 days to solidify your habit according to habit formation research.",
      target: 21,
      active: currentStreak >= 7 && currentStreak < 21
    },
    {
      name: "Monthly Master",
      description: "Complete a full month to demonstrate your commitment to long-term change.",
      target: 30,
      active: currentStreak >= 21 && currentStreak < 30
    }
  ];
  
  // Calculate progress for each challenge
  const calculateProgress = (target) => {
    const progress = Math.min(currentStreak / target * 100, 100);
    return Math.round(progress);
  };
  
  return (
    <StreakChallengeContainer>
      <ChallengeHeader>
        <ChallengeIcon>
          <i className="fas fa-trophy"></i>
        </ChallengeIcon>
        <ChallengeInfo>
          <ChallengeTitle>Streak Challenges</ChallengeTitle>
          <ChallengeSubtitle>Complete these milestones to build your habit</ChallengeSubtitle>
        </ChallengeInfo>
      </ChallengeHeader>
      
      <ChallengeGrid>
        {challenges.map((challenge, index) => (
          <ChallengeCard key={index} active={challenge.active}>
            <ChallengeName>{challenge.name}</ChallengeName>
            <ChallengeDescription>{challenge.description}</ChallengeDescription>
            <ChallengeProgress>
              <ProgressBar progress={calculateProgress(challenge.target)} />
            </ChallengeProgress>
            <ProgressText>
              {currentStreak >= challenge.target 
                ? 'Completed!' 
                : `${currentStreak}/${challenge.target} days`}
            </ProgressText>
          </ChallengeCard>
        ))}
      </ChallengeGrid>
    </StreakChallengeContainer>
  );
};

export default StreakChallenge;
