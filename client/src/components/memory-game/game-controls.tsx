import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DifficultyLevel } from "@/lib/game-utils";
import { Volume2, VolumeX, PlayCircle, RotateCcw, HelpCircle } from "lucide-react";

interface GameControlsProps {
  difficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onStartGame: () => void;
  onResetGame: () => void;
  onShowInstructions: () => void;
  isPlaying: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function GameControls({
  difficulty,
  onDifficultyChange,
  onStartGame,
  onResetGame,
  onShowInstructions,
  isPlaying,
  soundEnabled,
  onToggleSound
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      {/* Difficulty Selector */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="difficulty" className="text-foreground font-medium">Difficulty:</Label>
        <Select 
          value={difficulty} 
          onValueChange={(value) => onDifficultyChange(value as DifficultyLevel)}
          disabled={isPlaying}
        >
          <SelectTrigger className="w-[140px]" id="difficulty">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy (4×3)</SelectItem>
            <SelectItem value="medium">Medium (6×4)</SelectItem>
            <SelectItem value="hard">Hard (8×5)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Game Controls */}
      <Button 
        variant="default" 
        className="bg-primary hover:bg-primary/90 text-primary-foreground" 
        onClick={onStartGame}
        disabled={isPlaying}
      >
        <PlayCircle className="mr-2 h-5 w-5" /> New Game
      </Button>
      
      <Button 
        variant="outline" 
        className="bg-background hover:bg-muted"
        onClick={onResetGame}
        disabled={!isPlaying}
      >
        <RotateCcw className="mr-2 h-5 w-5" /> Reset
      </Button>
      
      <Button 
        variant="outline" 
        className="bg-accent text-accent-foreground hover:bg-accent/90"
        onClick={onShowInstructions}
      >
        <HelpCircle className="mr-2 h-5 w-5" /> Instructions
      </Button>
      
      {/* Sound Toggle */}
      <Button 
        variant="outline" 
        className="bg-background border-border"
        onClick={onToggleSound}
      >
        {soundEnabled ? (
          <>
            <Volume2 className="mr-2 h-5 w-5" /> Sound On
          </>
        ) : (
          <>
            <VolumeX className="mr-2 h-5 w-5" /> Sound Off
          </>
        )}
      </Button>
    </div>
  );
}
