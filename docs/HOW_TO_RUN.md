# How to Run the Memory Card Game

This document provides step-by-step instructions on how to run the Memory Card Game application and test the card preview feature.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL database (for high score functionality)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd memory-card-game
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Database

The application uses PostgreSQL for storing high scores. Make sure you have a PostgreSQL instance running.

The database connection string should be set in the environment variable `DATABASE_URL`. If you're running the application in Replit, this is automatically set up for you.

### 4. Run the Application

```bash
npm run dev
```

This command starts both the backend server and the frontend development server. The application will be available at http://localhost:5000 (or another port if 5000 is already in use).

## Testing the Card Preview Feature

The card preview feature allows players to see all cards face-up before the game begins, giving them time to memorize the positions of each card.

### Step-by-Step Testing Process

1. **Start the Application**
   - Run `npm run dev` if not already running
   - Open your browser to the application URL

2. **Select a Difficulty Level**
   - Choose from Easy, Medium, or Hard using the dropdown menu

3. **Start the Game**
   - Click the "Start Game" button
   - You'll notice all cards appear face-up for you to memorize

4. **Preview Phase**
   - A notification appears at the top: "Memorize the cards - they are face up now!"
   - All cards are displayed face-up with a colored border to indicate preview mode
   - Take your time to memorize the card positions

5. **Begin Gameplay**
   - When you're ready, click the "I've Memorized - Start Game" button
   - All cards will flip face-down
   - The game begins, and you can start clicking cards to find matches

6. **Verify Game Mechanics**
   - Click on cards to flip them
   - If you find a match, cards stay face-up
   - If not, cards flip back down after a brief delay

## Troubleshooting

If you encounter any issues running the application:

1. **Check Database Connection**
   - Verify your PostgreSQL connection string
   - Ensure the database is running

2. **Port Conflict**
   - If port 5000 is in use, the application should automatically select another port
   - Check the console output for the URL

3. **Preview Feature Issues**
   - If cards don't show in preview mode, check the browser console for errors
   - Try resetting the game using the "Reset Game" button

## Customizing the Preview Feature

You can modify the preview feature behavior in the following files:

- `src/hooks/use-memory-game.tsx`: Controls the game logic for preview mode
- `src/pages/game-page.tsx`: Contains the UI elements for the preview notification and button
- `src/components/memory-game/game-card.tsx`: Handles the visual appearance of cards in preview mode

For more detailed information on the implementation, see [PREVIEW_FEATURE.md](./PREVIEW_FEATURE.md).

## Deployment

The application can be deployed to any hosting service that supports Node.js applications. For Replit deployment, simply click the "Deploy" button in the Replit interface.