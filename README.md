# Memory Card Game

A web-based memory card matching game with animations, scoring, and multiple difficulty levels.

## Getting Started

### Prerequisites

- Node.js (v14+)
- NPM (v6+)

### Installation

1. Clone the repository or download the source code
2. Install dependencies
```bash
npm install
```

### Running the Application

To start the application in development mode:

```bash
npm run dev
```

The application will run on `http://localhost:5000` (or another port if 5000 is already in use).

For detailed instructions on running the application and testing the preview feature, see [How to Run](docs/HOW_TO_RUN.md).

## How to Play

### Game Rules

1. The game consists of pairs of cards with matching symbols
2. Cards are initially presented face up for you to memorize
3. Once you click "I've Memorized - Start Game", cards will flip face down
4. Click on cards to flip them face up
5. Try to find all matching pairs with the fewest moves
6. The game ends when all pairs are matched

### Difficulty Levels

- **Easy**: 6 pairs of cards (12 total cards)
- **Medium**: 12 pairs of cards (24 total cards)
- **Hard**: 20 pairs of cards (40 total cards)

### Scoring

- Each match grants 100 points plus bonus points based on remaining time
- Faster matches earn more points
- Incorrect matches may deduct points
- Your score, time, and moves are displayed on the screen

### Controls

- **Start Game**: Initializes a new game with face-up cards for memorization
- **I've Memorized - Start Game**: Flips the cards face down and begins gameplay
- **Reset Game**: Resets the current game and generates new cards
- **Instructions**: Shows game instructions
- **Sound Toggle**: Enables/disables game sound effects

## Features

- Interactive card flipping with animations
- Sound effects for card flips, matches, and game completion
- Responsive design that works on mobile and desktop
- Multiple difficulty levels
- Game statistics tracking (time, moves, score)
- High score tracking
- Preview mode for memorizing cards before gameplay begins (see [Preview Feature Documentation](docs/PREVIEW_FEATURE.md))

## Implementation Details

The application is built using:

- React for UI components
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Express for the backend server
- PostgreSQL database for storing high scores
- Drizzle ORM for database operations

## File Structure

- `client/`: Frontend React application
  - `src/components/memory-game/`: Game-specific components
  - `src/hooks/`: Custom React hooks
  - `src/lib/`: Utility functions
  - `src/pages/`: Application pages
- `server/`: Backend Express server
- `shared/`: Shared code between frontend and backend

## License

This project is open source and available under the MIT License.