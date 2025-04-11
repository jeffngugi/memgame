// Types
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  isMismatched: boolean;
}

// List of possible card values
// This needs to have at least 20 unique values for the hard difficulty level
const possibleCardValues = [
  'people', 'plus', 'check', 'eye', 'star',
  'heart', 'bell', 'cloud', 'lightning', 'moon',
  'sun', 'globe', 'code', 'music', 'camera',
  'gift', 'shield', 'fire', 'puzzle', 'cake'
];

// Generate cards based on the number of pairs needed
export function generateCards(numPairs: number): Card[] {
  // Ensure we don't exceed the number of possible values
  const pairsToGenerate = Math.min(numPairs, possibleCardValues.length);
  
  // Get the subset of values we need
  const values = possibleCardValues.slice(0, pairsToGenerate);
  
  // Create pairs of cards
  const cards: Card[] = [];
  let id = 1;
  
  values.forEach(value => {
    // Add two cards with the same value (a pair)
    cards.push({
      id: id++,
      value,
      isFlipped: false,
      isMatched: false,
      isMismatched: false
    });
    
    cards.push({
      id: id++,
      value,
      isFlipped: false,
      isMatched: false,
      isMismatched: false
    });
  });
  
  return cards;
}

// Shuffle an array of cards using Fisher-Yates algorithm
export function shuffleCards(cards: Card[]): Card[] {
  const shuffled = [...cards];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

// Format seconds to MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Get starting time based on difficulty
export function getStartingTime(difficulty: DifficultyLevel): number {
  switch (difficulty) {
    case 'easy':
      return 60; // 1:00
    case 'medium':
      return 90; // 1:30
    case 'hard':
      return 120; // 2:00
    default:
      return 90;
  }
}

// Get total pairs based on difficulty
export function getTotalPairs(difficulty: DifficultyLevel): number {
  switch (difficulty) {
    case 'easy':
      return 6;
    case 'medium':
      return 12;
    case 'hard':
      return 20;
    default:
      return 12;
  }
}
