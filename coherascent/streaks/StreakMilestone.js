import React from 'react';
import styled from 'styled-components';

const StreakMilestoneContainer = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 20px;
  box-shadow: ${props => props.theme.shadows.small};
  margin-bottom: 20px;
  border-left: 5px solid ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
`;

const MilestoneIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${props => props.theme.borderRadius.circle};
  background: ${props => props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  
  i {
    color: white;
    font-size: 1.5rem;
  }
`;

const MilestoneContent = styled.div`
  flex: 1;
`;

const MilestoneTitle = styled.h4`
  font-size: ${props => props.theme.fontSizes.md};
  margin-bottom: 5px;
  color: ${props => props.theme.colors.primaryDark};
`;

const MilestoneDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textLight};
`;

const StreakMilestone = ({ streak, habitName }) => {
  // Determine milestone icon and message based on streak length
  const getMilestoneDetails = (streak) => {
    if (streak >= 365) {
      return {
        icon: "fas fa-crown",
        title: "One Year Achievement!",
        description: `You've maintained your ${habitName} habit for an entire year. This is an incredible accomplishment!`
      };
    } else if (streak >= 180) {
      return {
        icon: "fas fa-award",
        title: "Six Month Milestone!",
        description: `You've maintained your ${habitName} habit for six months. Your dedication is truly impressive!`
      };
    } else if (streak >= 90) {
      return {
        icon: "fas fa-medal",
        title: "Three Month Milestone!",
        description: `You've maintained your ${habitName} habit for three months. This is a significant achievement!`
      };
    } else if (streak >= 30) {
      return {
        icon: "fas fa-star",
        title: "One Month Milestone!",
        description: `You've maintained your ${habitName} habit for a full month. Great work on building this habit!`
      };
    } else if (streak >= 21) {
      return {
        icon: "fas fa-seedling",
        title: "21 Day Milestone!",
        description: `You've reached the crucial 21-day mark with your ${habitName} habit. It's becoming part of your routine!`
      };
    } else if (streak >= 7) {
      return {
        icon: "fas fa-fire",
        title: "One Week Streak!",
        description: `You've maintained your ${habitName} habit for a full week. You're on your way to making it a habit!`
      };
    } else if (streak >= 3) {
      return {
        icon: "fas fa-thumbs-up",
        title: "Three Day Streak!",
        description: `You've started strong with your ${habitName} habit. Keep going to build momentum!`
      };
    } else {
      return {
        icon: "fas fa-flag",
        title: "Streak Started!",
        description: `You've begun your ${habitName} habit journey. Every streak starts with a single day!`
      };
    }
  };
  
  const { icon, title, description } = getMilestoneDetails(streak);
  
  return (
    <StreakMilestoneContainer>
      <MilestoneIcon>
        <i className={icon}></i>
      </MilestoneIcon>
      <MilestoneContent>
        <MilestoneTitle>{title}</MilestoneTitle>
        <MilestoneDescription>{description}</MilestoneDescription>
      </MilestoneContent>
    </StreakMilestoneContainer>
  );
};

export default StreakMilestone;
