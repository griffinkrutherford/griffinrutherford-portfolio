import React from 'react';
import styled from 'styled-components';

const StreakDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: ${props => props.theme.gradients.primary};
  border-radius: ${props => props.theme.borderRadius.medium};
  color: white;
  box-shadow: ${props => props.theme.shadows.medium};
  margin-bottom: 20px;
`;

const StreakValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 5px;
`;

const StreakLabel = styled.div`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StreakIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const StreakDisplay = ({ value, label = "Current Streak" }) => {
  return (
    <StreakDisplayContainer>
      <StreakIcon>
        <i className="fas fa-fire"></i>
      </StreakIcon>
      <StreakValue>{value}</StreakValue>
      <StreakLabel>{label}</StreakLabel>
    </StreakDisplayContainer>
  );
};

export default StreakDisplay;
