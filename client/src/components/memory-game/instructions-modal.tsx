import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export default function InstructionsModal({
  isOpen,
  onClose,
  onStartGame,
}: InstructionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-card max-w-md">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold text-foreground">How to Play</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <ol className="list-decimal pl-5 space-y-2 text-foreground">
          <li>Click on any card to flip it and reveal the symbol.</li>
          <li>Then click on another card to find its match.</li>
          <li>If the two cards match, they will stay face up.</li>
          <li>If they don't match, both cards will flip back face down.</li>
          <li>Remember the locations of the cards to find matches more quickly.</li>
          <li>The game is complete when all pairs are matched.</li>
        </ol>
        
        <div className="mt-4">
          <h3 className="font-bold text-foreground mb-2">Difficulty Levels:</h3>
          <ul className="list-disc pl-5 space-y-1 text-foreground">
            <li><span className="font-medium">Easy:</span> 12 cards (6 pairs)</li>
            <li><span className="font-medium">Medium:</span> 24 cards (12 pairs)</li>
            <li><span className="font-medium">Hard:</span> 40 cards (20 pairs)</li>
          </ul>
        </div>
        
        <DialogFooter className="mt-6">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onStartGame}
          >
            Got It!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
