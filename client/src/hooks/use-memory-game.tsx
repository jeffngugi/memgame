import { useState, useEffect, useCallback, useRef } from "react";
import { generateCards, shuffleCards, DifficultyLevel, Card } from "@/lib/game-utils";

interface UseMemoryGameOptions {
  onGameComplete?: () => void;
}

export function useMemoryGame({ onGameComplete }: UseMemoryGameOptions = {}) {
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(12); // Default for medium
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(90); // Default for medium
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Refs
  const timerRef = useRef<number | null>(null);
  
  // Audio effects (created but not loaded to avoid unnecessary requests)
  const audio = {
    flip: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-light-card-flip-988.mp3"),
    match: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3"),
    mismatch: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3"),
    win: new Audio("https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3"),
  };
  
  // Play sound helper
  const playSound = useCallback((sound: keyof typeof audio) => {
    if (soundEnabled) {
      audio[sound].currentTime = 0;
      audio[sound].play().catch(e => console.log('Audio play failed:', e));
    }
  }, [soundEnabled]);

  // Initialize difficulty settings
  useEffect(() => {
    if (difficulty === "easy") {
      setTotalPairs(6);
      setTimer(60); // 1:00
    } else if (difficulty === "medium") {
      setTotalPairs(12);
      setTimer(90); // 1:30
    } else if (difficulty === "hard") {
      setTotalPairs(20);
      setTimer(120); // 2:00
    }
  }, [difficulty]);
  
  // Timer effect
  useEffect(() => {
    if (isPlaying && timer > 0 && !isGameComplete) {
      timerRef.current = window.setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            // Time's up
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isGameComplete]);
  
  // Check for game completion
  useEffect(() => {
    if (matchedPairs > 0 && matchedPairs === totalPairs && isPlaying) {
      // Game complete
      setIsPlaying(false);
      setIsGameComplete(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      playSound("win");
      
      if (onGameComplete) {
        onGameComplete();
      }
    }
  }, [matchedPairs, totalPairs, isPlaying, playSound, onGameComplete]);

  // Start a new game
  const startGame = useCallback(() => {
    // Generate and shuffle cards based on difficulty
    const newCards = shuffleCards(generateCards(totalPairs));
    
    setCards(newCards);
    setIsPlaying(true);
    setIsGameComplete(false);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    
    // Reset timer based on difficulty
    if (difficulty === "easy") {
      setTimer(60);
    } else if (difficulty === "medium") {
      setTimer(90);
    } else if (difficulty === "hard") {
      setTimer(120);
    }
  }, [difficulty, totalPairs]);
  
  // Reset the game
  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setIsGameComplete(false);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    
    // Clear the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Reset the cards
    setCards(prevCards => 
      prevCards.map(card => ({
        ...card,
        isFlipped: false,
        isMatched: false,
        isMismatched: false
      }))
    );
    
    // Reset timer based on difficulty
    if (difficulty === "easy") {
      setTimer(60);
    } else if (difficulty === "medium") {
      setTimer(90);
    } else if (difficulty === "hard") {
      setTimer(120);
    }
  }, [difficulty]);
  
  // Flip a card
  const flipCard = useCallback((cardId: number) => {
    if (!isPlaying || flippedCards.length >= 2) return;
    
    // Find the card
    const cardIndex = cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;
    
    const card = cards[cardIndex];
    
    // Don't allow flipping if card is already flipped or matched
    if (card.isFlipped || card.isMatched) return;
    
    // Play flip sound
    playSound("flip");
    
    // Flip the card
    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[cardIndex] = {
        ...newCards[cardIndex],
        isFlipped: true,
        isMismatched: false
      };
      return newCards;
    });
    
    // Add to flipped cards
    setFlippedCards(prev => [...prev, cardId]);
    
    // If this is the second card
    if (flippedCards.length === 1) {
      // Increment moves
      setMoves(prevMoves => prevMoves + 1);
      
      // Find the first card
      const firstCardId = flippedCards[0];
      const firstCard = cards.find(card => card.id === firstCardId);
      
      // Check for match
      if (firstCard && firstCard.value === card.value) {
        // Match found
        setTimeout(() => {
          setCards(prevCards => {
            return prevCards.map(c => {
              if (c.id === firstCardId || c.id === cardId) {
                return { ...c, isMatched: true };
              }
              return c;
            });
          });
          
          setMatchedPairs(prev => prev + 1);
          
          // Update score - more time left = higher score
          setScore(prevScore => prevScore + 100 + Math.floor(timer / 2));
          
          playSound("match");
          
          // Clear flipped cards
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards => {
            return prevCards.map(c => {
              if (c.id === firstCardId || c.id === cardId) {
                return { ...c, isMismatched: true };
              }
              return c;
            });
          });
          
          playSound("mismatch");
          
          // Flip cards back after delay
          setTimeout(() => {
            setCards(prevCards => {
              return prevCards.map(c => {
                if (c.id === firstCardId || c.id === cardId) {
                  return { 
                    ...c, 
                    isFlipped: false,
                    isMismatched: false
                  };
                }
                return c;
              });
            });
            
            // Clear flipped cards
            setFlippedCards([]);
          }, 1000);
        }, 500);
      }
    }
  }, [cards, flippedCards, isPlaying, timer, playSound]);
  
  // Change difficulty level
  const handleSetDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
  }, []);

  return {
    cards,
    difficulty,
    setDifficulty: handleSetDifficulty,
    isPlaying,
    isGameComplete,
    timer,
    moves,
    matchedPairs,
    totalPairs,
    score,
    soundEnabled,
    setSoundEnabled,
    startGame,
    resetGame,
    flipCard,
  };
}
