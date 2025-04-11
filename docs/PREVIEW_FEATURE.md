# Memory Card Game - Preview Feature Documentation

## Overview

The preview feature allows players to see all cards face-up before the game begins, giving them time to memorize the positions of each card. This feature enhances the gameplay experience by adding a strategic memorization component.

## User Flow

1. User clicks the "Start Game" button
2. All cards are displayed face-up in their randomized positions
3. User takes time to memorize the card positions
4. When ready, user clicks the "I've Memorized - Start Game" button
5. All cards flip face-down
6. Game begins, and user can start clicking cards to make matches

## Implementation Details

### Key Components

#### 1. Game State

The preview state is managed in the `useMemoryGame` hook:

```typescript
// In hooks/use-memory-game.tsx
const isPreviewing = !isPlaying && !isGameComplete && cards.length > 0;
```

This derived state is `true` when:
- The game is not actively being played (`!isPlaying`)
- The game is not completed (`!isGameComplete`)
- Cards have been generated (`cards.length > 0`)

#### 2. Preview Initialization

When starting a new game, cards are initialized in face-up position:

```typescript
// In hooks/use-memory-game.tsx
const startGame = useCallback(() => {
  // Generate and shuffle cards
  const newCards = shuffleCards(generateCards(totalPairs));
  
  // Create cards in preview state (all face up)
  const previewCards = newCards.map(card => ({
    ...card,
    isFlipped: true, // All cards start face up for preview
    isMatched: false,
    isMismatched: false
  }));
  
  setCards(previewCards);
  setIsPlaying(false); // Keep game paused during preview
  // ... other state initialization
}, [difficulty, totalPairs]);
```

#### 3. Beginning Gameplay

A new function `beginGameplay` flips all cards face-down and starts the game:

```typescript
// In hooks/use-memory-game.tsx
const beginGameplay = useCallback(() => {
  // Flip all cards face down
  setCards(prevCards => 
    prevCards.map(card => ({
      ...card,
      isFlipped: false,
      isMatched: false,
      isMismatched: false
    }))
  );
  
  // Start the game
  setIsPlaying(true);
}, []);
```

#### 4. Card Display Logic

The `GameCard` component respects both the card's internal `isFlipped` state and the global `isPreviewing` state:

```typescript
// In components/memory-game/game-card.tsx
const showCardFace = isFlipped || isPreviewing;

// Use this for animation control
animate={showCardFace ? "flipped" : "unflipped"}
```

Additional styling is applied during preview mode:
```tsx
className={`...
  ${isPreviewing ? 'border-2 border-primary' : ''}`}
```

#### 5. User Interface

A notification and action button appear during preview mode:

```jsx
// In pages/game-page.tsx
{isPreviewing && (
  <div className="w-full rounded-lg bg-primary/10 p-4 mb-4 border border-primary text-center">
    <p className="text-primary font-medium mb-3">
      Memorize the cards - they are face up now!
    </p>
    <button 
      onClick={beginGameplay}
      className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition-colors"
    >
      I've Memorized - Start Game
    </button>
  </div>
)}
```

## Customization Options

To modify this feature:

### Change Preview Duration
The cards remain in preview mode until the user manually starts the game. If you want to add an auto-start timer:

```typescript
// Add to startGame function in hooks/use-memory-game.tsx
setTimeout(() => {
  beginGameplay();
}, 10000); // Auto-start after 10 seconds
```

### Modify Visual Indicators
The preview cards have a border to indicate they're in preview mode. You can modify this in `game-card.tsx`.

### Add Difficulty-Based Preview
For harder difficulty levels, you could reduce the allowed preview time:

```typescript
// Modify beginGameplay to account for difficulty
const previewTime = difficulty === 'easy' ? 10000 : 
                   difficulty === 'medium' ? 7000 : 5000;

setTimeout(() => {
  beginGameplay();
}, previewTime);
```

## Testing

To test this feature:
1. Click "Start Game"
2. Verify all cards are face-up
3. Verify the preview notification and button are visible
4. Click "I've Memorized - Start Game"
5. Verify all cards flip face-down
6. Verify the game starts (you can now click cards to flip them)