import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DifficultyLevel, Card, GameConfig, InsertHighScore } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useGameSounds } from "@/hooks/use-game-sounds";

interface GameContextType {
  cards: Card[];
  difficulty: DifficultyLevel;
  score: number;
  time: number;
  isPlaying: boolean;
  isLoading: boolean;
  isVictory: boolean;
  flippedCards: number[];
  gameConfig: {
    rows: number;
    cols: number;
    pairs: number;
  };
  
  setDifficulty: (difficulty: DifficultyLevel) => void;
  startGame: () => void;
  resetGame: () => void;
  handleCardClick: (cardIndex: number) => void;
  saveHighScore: (username: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { playFlipSound, playMatchSound, playMismatchSound, playWinSound } = useGameSounds();
  
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Fetch cards from the server
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/cards", difficulty],
    enabled: false,
  });
  
  const cards: Card[] = data?.cards || [];
  const gameConfig = data?.config || { rows: 3, cols: 4, pairs: 6 };
  
  // Save high score mutation
  const saveHighScoreMutation = useMutation({
    mutationFn: async (highScore: InsertHighScore) => {
      const res = await apiRequest("POST", "/api/highscores", highScore);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "High score saved!",
        description: "Your score has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/highscores"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to save high score",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying && !isVictory) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isVictory]);
  
  // Check for win condition
  useEffect(() => {
    if (isPlaying && matchedPairs === gameConfig.pairs) {
      setIsPlaying(false);
      setIsVictory(true);
      playWinSound();
    }
  }, [matchedPairs, gameConfig.pairs, isPlaying]);
  
  const startGame = () => {
    refetch().then(() => {
      setScore(0);
      setTime(0);
      setIsPlaying(true);
      setIsVictory(false);
      setFlippedCards([]);
      setMatchedPairs(0);
    });
  };
  
  const resetGame = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setScore(0);
      setTime(0);
      setFlippedCards([]);
      setMatchedPairs(0);
      setIsVictory(false);
      startGame();
    } else {
      startGame();
    }
  };
  
  const handleCardClick = (cardIndex: number) => {
    // Prevent card flipping if game not playing, processing, card already flipped or matched
    if (
      !isPlaying || 
      isProcessing || 
      flippedCards.includes(cardIndex) || 
      cards[cardIndex].isMatched
    ) {
      return;
    }
    
    playFlipSound();
    
    // Add card to flipped cards
    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);
    
    // Check for pairs
    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      
      const [firstCardIndex, secondCardIndex] = newFlippedCards;
      const firstCard = cards[firstCardIndex];
      const secondCard = cards[secondCardIndex];
      
      // Check if cards match
      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          playMatchSound();
          
          // Mark both cards as matched in the stored cards array
          cards[firstCardIndex].isMatched = true;
          cards[secondCardIndex].isMatched = true;
          
          setFlippedCards([]);
          setScore((prevScore) => prevScore + 10);
          setMatchedPairs((prev) => prev + 1);
          setIsProcessing(false);
        }, 500);
      } else {
        // Mismatch
        setTimeout(() => {
          playMismatchSound();
          setScore((prevScore) => Math.max(0, prevScore - 1));
          
          // Flip cards back
          setTimeout(() => {
            setFlippedCards([]);
            setIsProcessing(false);
          }, 500);
        }, 500);
      }
    }
  };
  
  const saveHighScore = (username: string) => {
    const highScoreData: InsertHighScore = {
      username,
      score,
      time,
      difficulty,
      date: new Date().toISOString(),
    };
    
    saveHighScoreMutation.mutate(highScoreData);
  };
  
  const value = {
    cards,
    difficulty,
    score,
    time,
    isPlaying,
    isLoading,
    isVictory,
    flippedCards,
    gameConfig,
    
    setDifficulty,
    startGame,
    resetGame,
    handleCardClick,
    saveHighScore,
  };
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  
  return context;
}
