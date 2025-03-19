const fs = require('fs');
const path = require('path');

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function randomBool(probability = 0.7) {
  return Math.random() < probability;
}

function generateDateRange(startDate, days) {
  const dates = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

// Load base data
const baseData = require('./base_data.json');
const habitDefinitions = baseData.habitDefinitions;
const userId = baseData.users[0].id;

// Generate 90 days of data
const startDate = '2025-01-15';
const days = 90;
const dateRange = generateDateRange(startDate, days);

// Generate user habits (which habits the user is tracking)
const userHabits = habitDefinitions.map(habit => ({
  id: habit.id,
  userId: userId,
  habitDefinitionId: habit.id,
  startDate: startDate,
  active: true,
  currentStreak: 0,
  longestStreak: 0,
  totalCompletions: 0,
  lastCompletedDate: null
}));

// Generate habit entries with realistic patterns
const habitEntries = [];
const moodEntries = [];
const thoughtRecords = [];

// Define mood options
const moodOptions = [
  { value: 1, label: "Very Poor" },
  { value: 2, label: "Poor" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Good" },
  { value: 5, label: "Very Good" }
];

// Define common negative thoughts and reframes for thought records
const negativeThoughts = [
  {
    thought: "I'll never be able to keep up with these habits.",
    distortion: "All-or-nothing thinking",
    reframe: "I don't have to be perfect. Even small progress is still progress."
  },
  {
    thought: "I missed a day, so I've ruined my progress.",
    distortion: "Catastrophizing",
    reframe: "Missing one day doesn't erase my previous efforts. I can start again today."
  },
  {
    thought: "Everyone else finds this easier than I do.",
    distortion: "Mind reading",
    reframe: "I don't know how others feel. Many people struggle with consistency."
  },
  {
    thought: "I should be doing better by now.",
    distortion: "Should statements",
    reframe: "I'm doing my best with the resources I have right now."
  },
  {
    thought: "This isn't working fast enough.",
    distortion: "Impatience",
    reframe: "Meaningful change takes time. I'm building habits that will last."
  }
];

// Generate data with realistic patterns
let currentStreaks = {};
let longestStreaks = {};
let totalCompletions = {};

// Initialize tracking variables
habitDefinitions.forEach(habit => {
  currentStreaks[habit.id] = 0;
  longestStreaks[habit.id] = 0;
  totalCompletions[habit.id] = 0;
});

// Generate data for each day
dateRange.forEach((date, dayIndex) => {
  // Generate daily mood entry
  const baseMood = randomInt(3, 5); // Start with a neutral to good baseline
  const dailyVariation = randomFloat(-0.5, 0.5); // Add some daily variation
  
  // Mood tends to improve over time with habit practice
  const progressImprovement = Math.min(dayIndex / 30, 1.5); // Max +1.5 improvement over 30 days
  
  // Calculate final mood value (clamped between 1-5)
  let moodValue = Math.min(Math.max(Math.round(baseMood + dailyVariation + progressImprovement), 1), 5);
  
  // Add mood entry
  moodEntries.push({
    id: dayIndex + 1,
    userId: userId,
    date: date,
    value: moodValue,
    notes: moodValue >= 4 
      ? "Feeling positive today" 
      : moodValue <= 2 
        ? "Struggling a bit today" 
        : "Average day"
  });
  
  // Generate habit entries for each habit
  habitDefinitions.forEach(habit => {
    // Different completion probabilities based on habit difficulty
    let completionProbability;
    
    switch(habit.difficulty) {
      case "easy":
        completionProbability = 0.85;
        break;
      case "medium":
        completionProbability = 0.75;
        break;
      case "hard":
        completionProbability = 0.65;
        break;
      default:
        completionProbability = 0.75;
    }
    
    // Adjust probability based on day of week (weekend effect)
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      completionProbability -= 0.1; // Harder to maintain habits on weekends
    }
    
    // Adjust probability based on progress (habits get easier over time)
    completionProbability += Math.min(dayIndex / 90, 0.15); // Max +0.15 over 90 days
    
    // Determine if habit was completed
    const completed = randomBool(completionProbability);
    
    // Update streak information
    if (completed) {
      currentStreaks[habit.id]++;
      totalCompletions[habit.id]++;
      
      if (currentStreaks[habit.id] > longestStreaks[habit.id]) {
        longestStreaks[habit.id] = currentStreaks[habit.id];
      }
    } else {
      currentStreaks[habit.id] = 0;
    }
    
    // Add habit entry
    habitEntries.push({
      id: habitEntries.length + 1,
      userId: userId,
      habitId: habit.id,
      date: date,
      completed: completed,
      duration: completed ? randomInt(
        Math.floor(habit.recommendedDuration * 0.8), 
        Math.ceil(habit.recommendedDuration * 1.2)
      ) : 0,
      notes: completed 
        ? `Completed ${habit.name} today` 
        : `Missed ${habit.name} today`
    });
    
    // Generate thought records for the Thought Record habit
    if (habit.id === 1 && completed) { // Thought Record habit
      const randomThought = negativeThoughts[randomInt(0, negativeThoughts.length - 1)];
      
      thoughtRecords.push({
        id: thoughtRecords.length + 1,
        userId: userId,
        date: date,
        situation: "While trying to maintain my daily habits",
        negativeThought: randomThought.thought,
        distortion: randomThought.distortion,
        reframe: randomThought.reframe,
        outcomeFeeling: randomInt(3, 5) // Feeling better after reframing
      });
    }
  });
});

// Update user habits with final streak information
userHabits.forEach(habit => {
  habit.currentStreak = currentStreaks[habit.id];
  habit.longestStreak = longestStreaks[habit.id];
  habit.totalCompletions = totalCompletions[habit.id];
  
  // Find the last completed date
  for (let i = habitEntries.length - 1; i >= 0; i--) {
    const entry = habitEntries[i];
    if (entry.habitId === habit.id && entry.completed) {
      habit.lastCompletedDate = entry.date;
      break;
    }
  }
});

// Create the final dataset
const syntheticData = {
  userHabits: userHabits,
  habitEntries: habitEntries,
  moodEntries: moodEntries,
  thoughtRecords: thoughtRecords
};

// Write to file
fs.writeFileSync(
  path.join(__dirname, 'synthetic_data.json'), 
  JSON.stringify(syntheticData, null, 2)
);

console.log('Synthetic data generated successfully!');
