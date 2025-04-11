import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHighScoreSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get high scores filtered by difficulty
  app.get("/api/high-scores", async (req, res) => {
    try {
      const difficulty = req.query.difficulty as string | undefined;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const validDifficulty = z.enum(["easy", "medium", "hard"]).optional().parse(difficulty);
      const validLimit = z.number().min(1).max(50).parse(limit);
      
      const highScores = await storage.getHighScores(validDifficulty, validLimit);
      res.json(highScores);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Failed to retrieve high scores" });
      }
    }
  });

  // Submit a new high score
  app.post("/api/high-scores", async (req, res) => {
    try {
      const highScoreData = insertHighScoreSchema.parse(req.body);
      const highScore = await storage.createHighScore(highScoreData);
      res.status(201).json(highScore);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Failed to save high score" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
