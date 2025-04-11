import { useState, useEffect } from "react";
import GameBoard from "@/components/memory-game/game-board";
import GameControls from "@/components/memory-game/game-controls";
import GameStats from "@/components/memory-game/game-stats";
import InstructionsModal from "@/components/memory-game/instructions-modal";
import GameCompleteModal from "@/components/memory-game/game-complete-modal";
import { useMemoryGame } from "@/hooks/use-memory-game";
import { DifficultyLevel } from "@/lib/game-utils";
import { useToast } from "@/hooks/use-toast";

export default function GamePage() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [username, setUsername] = useState("");
  
  const { toast } = useToast();

  const {
    cards,
    difficulty,
    setDifficulty,
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
  } = useMemoryGame({
    onGameComplete: () => {
      setShowGameComplete(true);
    }
  });

  useEffect(() => {
    // Show a welcome toast when the page loads
    toast({
      title: "Welcome to Memory Card Game!",
      description: "Match all the cards to win. Good luck!",
    });
  }, [toast]);

  // Handle game restart from game complete modal
  const handlePlayAgain = () => {
    setShowGameComplete(false);
    resetGame();
    startGame();
  };

  // Handle change settings from game complete modal
  const handleChangeSettings = () => {
    setShowGameComplete(false);
    resetGame();
  };

  // Handle starting the game from instructions modal
  const handleStartFromInstructions = () => {
    setShowInstructions(false);
    startGame();
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-background">
      {/* Game Header */}
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-4xl font-bold text-center text-primary mb-2">Memory Card Game</h1>
        <p className="text-center text-muted-foreground mb-6">Flip the cards and find the matching pairs!</p>
        
        {/* Game Controls */}
        <GameControls 
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onStartGame={startGame}
          onResetGame={resetGame}
          onShowInstructions={() => setShowInstructions(true)}
          isPlaying={isPlaying}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />
        
        {/* Game Stats */}
        <GameStats 
          timer={timer}
          moves={moves}
          score={score}
          matchedPairs={matchedPairs}
          totalPairs={totalPairs}
        />
      </div>
      
      {/* Game Board */}
      <GameBoard 
        cards={cards}
        difficulty={difficulty}
        onCardClick={flipCard}
      />
      
      {/* Instructions Modal */}
      <InstructionsModal 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        onStartGame={handleStartFromInstructions}
      />
      
      {/* Game Complete Modal */}
      <GameCompleteModal 
        isOpen={showGameComplete}
        score={score}
        time={90 - timer} // Time spent = starting time - remaining time
        moves={moves}
        onPlayAgain={handlePlayAgain}
        onChangeSettings={handleChangeSettings}
        username={username}
        onUsernameChange={setUsername}
        difficulty={difficulty}
      />
    </div>
  );
}
