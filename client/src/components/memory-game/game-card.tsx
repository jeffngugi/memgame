import { memo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/lib/game-utils";
import { getCardIcon } from "@/lib/card-icons";

interface GameCardProps {
  card: Card;
  isPreviewing?: boolean; // Add preview state prop
  onClick: () => void;
}

const GameCard = memo(({ card, isPreviewing = false, onClick }: GameCardProps) => {
  const { id, value, isFlipped, isMatched, isMismatched } = card;
  
  // Card should be shown if it's flipped OR we're in preview mode
  const showCardFace = isFlipped || isPreviewing;

  // Card animation variants
  const cardVariants = {
    flipped: { rotateY: 180 },
    unflipped: { rotateY: 0 },
  };

  // Mismatch animation
  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 0],
      transition: { duration: 0.5 }
    }
  };

  // Match animation
  const matchVariants = {
    match: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.5 }
    }
  };

  // Get the card icon based on the value
  const cardIcon = getCardIcon(value);

  return (
    <motion.div
      className="aspect-square relative cursor-pointer"
      onClick={onClick}
      animate={isMismatched ? "shake" : isMatched ? "match" : ""}
      variants={{
        ...shakeVariants,
        ...matchVariants
      }}
    >
      <div className="card w-full h-full perspective-1000 relative">
        {/* Front of card (hidden when flipped or previewing) */}
        <motion.div
          className="absolute w-full h-full rounded-lg shadow-md bg-card-back flex items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
          animate={showCardFace ? "flipped" : "unflipped"}
          variants={cardVariants}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Card back icon/symbol */}
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </motion.div>

        {/* Back of card (visible when flipped or previewing) */}
        <motion.div
          className={`absolute w-full h-full rounded-lg shadow-md flex items-center justify-center 
                    ${isMatched ? 'bg-secondary/90' : 'bg-white'}
                    ${isPreviewing ? 'border-2 border-primary' : ''}`} // Add border during preview
          style={{ backfaceVisibility: "hidden", rotateY: 180 }}
          animate={showCardFace ? "flipped" : "unflipped"}
          variants={cardVariants}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Card face icon/symbol */}
          {cardIcon}
        </motion.div>
      </div>
    </motion.div>
  );
});

GameCard.displayName = "GameCard";

export default GameCard;
