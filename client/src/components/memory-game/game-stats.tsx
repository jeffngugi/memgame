import { motion } from "framer-motion";
import { formatTime } from "@/lib/game-utils";

interface GameStatsProps {
  timer: number;
  moves: number;
  score: number;
  matchedPairs: number;
  totalPairs: number;
}

// Animation variants for stat counters
const statsVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
}

export default function GameStats({ 
  timer, 
  moves, 
  score, 
  matchedPairs, 
  totalPairs 
}: GameStatsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6">
      {/* Timer */}
      <motion.div 
        className="bg-white dark:bg-card px-6 py-3 rounded-lg shadow-md"
        variants={statsVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0 }}
      >
        <div className="text-sm text-muted-foreground mb-1">Time</div>
        <div className="font-mono text-2xl font-bold text-foreground">{formatTime(timer)}</div>
      </motion.div>
      
      {/* Moves Counter */}
      <motion.div 
        className="bg-white dark:bg-card px-6 py-3 rounded-lg shadow-md"
        variants={statsVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="text-sm text-muted-foreground mb-1">Moves</div>
        <div className="font-mono text-2xl font-bold text-foreground">{moves}</div>
      </motion.div>
      
      {/* Score Counter */}
      <motion.div 
        className="bg-white dark:bg-card px-6 py-3 rounded-lg shadow-md"
        variants={statsVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="text-sm text-muted-foreground mb-1">Score</div>
        <div className="font-mono text-2xl font-bold text-foreground">{score}</div>
      </motion.div>
      
      {/* Matches Counter */}
      <motion.div 
        className="bg-white dark:bg-card px-6 py-3 rounded-lg shadow-md"
        variants={statsVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="text-sm text-muted-foreground mb-1">Matches</div>
        <div className="font-mono text-2xl font-bold text-foreground">
          <span>{matchedPairs}</span>/<span>{totalPairs}</span>
        </div>
      </motion.div>
    </div>
  );
}
