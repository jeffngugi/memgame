import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatTime } from "@/lib/game-utils";
import { DifficultyLevel } from "@/lib/game-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface GameCompleteModalProps {
  isOpen: boolean;
  score: number;
  time: number;
  moves: number;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
  username: string;
  onUsernameChange: (username: string) => void;
  difficulty: DifficultyLevel;
}

export default function GameCompleteModal({
  isOpen,
  score,
  time,
  moves,
  onPlayAgain,
  onChangeSettings,
  username,
  onUsernameChange,
  difficulty,
}: GameCompleteModalProps) {
  const { toast } = useToast();

  // Mutation for submitting high score
  const submitScoreMutation = useMutation({
    mutationFn: async (data: {
      username: string;
      score: number;
      moves: number;
      time: number;
      difficulty: string;
    }) => {
      const res = await apiRequest("POST", "/api/high-scores", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/high-scores"] });
      toast({
        title: "High score submitted!",
        description: "Your score has been recorded.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit score",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Play success sound when modal opens
  useEffect(() => {
    if (isOpen) {
      const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3");
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [isOpen]);

  const handleSubmitScore = () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to submit your score.",
        variant: "destructive",
      });
      return;
    }

    submitScoreMutation.mutate({
      username,
      score,
      moves,
      time,
      difficulty,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-white dark:bg-card max-w-md">
        <DialogHeader className="text-center">
          <motion.div 
            className="mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <CheckCircle className="w-16 h-16 text-secondary mx-auto" />
          </motion.div>
          <DialogTitle className="text-2xl font-bold text-foreground mb-2">Congratulations!</DialogTitle>
          <p className="text-muted-foreground mb-6">You've matched all the pairs!</p>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Time</div>
            <div className="font-mono text-xl font-bold text-foreground">{formatTime(time)}</div>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Moves</div>
            <div className="font-mono text-xl font-bold text-foreground">{moves}</div>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Score</div>
            <div className="font-mono text-xl font-bold text-foreground">{score}</div>
          </div>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="username" className="mb-2 block">Enter your name to save your score:</Label>
          <Input 
            id="username" 
            placeholder="Your name" 
            value={username} 
            onChange={(e) => onUsernameChange(e.target.value)}
            className="mb-2"
          />
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={handleSubmitScore}
            disabled={submitScoreMutation.isPending}
          >
            {submitScoreMutation.isPending ? "Submitting..." : "Submit Score"}
          </Button>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="default" 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onPlayAgain}
          >
            Play Again
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onChangeSettings}
          >
            Change Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
