# Coherascent Trial Application - Deployment Guide

This document provides instructions for deploying the Coherascent Trial Application with CBT-based habit tracking functionality.

## Package Contents

- `trial/` - The main landing page for the trial application
- `app/` - The application backend components
- `streaks/` - React components for streak tracking functionality
- `utils/` - Utility functions for streak calculations
- `data/` - Synthetic datasets for demonstration
- `design_document.md` - Overview of the application design
- `coherascent-logo-march-25-variation.png` - Logo file

## Deployment Instructions

### 1. Add to Your Website Structure

1. Create a directory called `coherascent` at the root level of your portfolio:
   ```
   mkdir -p portfolio/coherascent
   ```

2. Extract the contents of this package into the `coherascent` directory:
   ```
   portfolio/
   ├── AlmndBrd/
   ├── coherascent/  <-- Extract here
   │   ├── index.html
   │   ├── css/
   │   ├── js/
   │   ├── images/
   │   └── trial/    <-- Trial application
   ├── gradient-descent/
   ├── css/
   ├── images/
   ├── js/
   └── ...
   ```

3. Ensure the trial application is accessible at `griffinrutherford.com/coherascent/trial/`

### 2. Backend Setup (Optional for Full Functionality)

For the complete experience with backend functionality:

1. Install Node.js dependencies:
   ```
   cd portfolio/coherascent/app
   npm install
   ```

2. Start the backend server:
   ```
   npm start
   ```

3. The API will be available at `/coherascent/app/api/`

### 3. Testing

After deployment, verify that:
- The main Coherascent landing page loads at `/coherascent/`
- The trial application landing page loads at `/coherascent/trial/`
- The streak tracking demo is accessible via the "Try the Demo" button

## Features Implemented

- **CBT-Based Habit Tracking**: Track habits based on cognitive behavioral therapy principles
- **Streak Functionality**: Visual streak tracking with milestone achievements
- **Data Visualization**: Progress charts and mood correlation
- **Streak Recovery**: Mechanics for handling missed days
- **Streak Insights**: Data-driven insights about habit patterns

## Technologies Used

- Frontend: React, styled-components, Chart.js
- Backend: Node.js, Express
- Data: Synthetic datasets with realistic habit patterns

## Support

For any questions or issues with deployment, please contact:
- Email: support@coherascent.com
