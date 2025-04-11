import { memo } from "react";
import GameCard from "./game-card";
import { Card } from "@/lib/game-utils";
import { DifficultyLevel } from "@/lib/game-utils";
import { motion } from "framer-motion";

interface GameBoardProps {
  cards: Card[];
  difficulty: DifficultyLevel;
  onCardClick: (cardId: number) => void;
}

// Get grid classes based on difficulty
const getDifficultyGridClasses = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case "easy":
      return "grid-cols-3 md:grid-cols-4";
    case "medium":
      return "grid-cols-4 md:grid-cols-6";
    case "hard":
      return "grid-cols-4 md:grid-cols-8";
    default:
      return "grid-cols-4 md:grid-cols-6";
  }
};

// Dynamically calculate gap size based on difficulty
const getGapSize = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case "easy":
      return "gap-4";
    case "medium":
      return "gap-3";
    case "hard":
      return "gap-2";
    default:
      return "gap-3";
  }
};

const GameBoard = memo(({ cards, difficulty, onCardClick }: GameBoardProps) => {
  const gridClasses = getDifficultyGridClasses(difficulty);
  const gapSize = getGapSize(difficulty);

  return (
    <motion.div 
      className="w-full max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className={`grid ${gridClasses} ${gapSize} mx-auto`} 
        style={{ maxWidth: "900px" }}
      >
        {cards.map((card) => (
          <GameCard 
            key={card.id}
            card={card}
            onClick={() => onCardClick(card.id)}
          />
        ))}
      </div>
    </motion.div>
  );
});

GameBoard.displayName = "GameBoard";

export default GameBoard;
