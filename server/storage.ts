import { highScores, users, type User, type InsertUser, type HighScore, type InsertHighScore } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getHighScores(difficulty?: string, limit?: number): Promise<HighScore[]>;
  createHighScore(highScore: InsertHighScore): Promise<HighScore>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private highScores: Map<number, HighScore>;
  currentUserId: number;
  currentHighScoreId: number;

  constructor() {
    this.users = new Map();
    this.highScores = new Map();
    this.currentUserId = 1;
    this.currentHighScoreId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getHighScores(difficulty?: string, limit: number = 10): Promise<HighScore[]> {
    let scores = Array.from(this.highScores.values());
    
    // Filter by difficulty if provided
    if (difficulty) {
      scores = scores.filter(score => score.difficulty === difficulty);
    }
    
    // Sort by score (descending)
    scores.sort((a, b) => b.score - a.score);
    
    // Limit the number of results
    return scores.slice(0, limit);
  }

  async createHighScore(insertHighScore: InsertHighScore): Promise<HighScore> {
    const id = this.currentHighScoreId++;
    const now = new Date();
    const highScore: HighScore = { 
      ...insertHighScore, 
      id, 
      createdAt: now 
    };
    this.highScores.set(id, highScore);
    return highScore;
  }
}

export const storage = new MemStorage();
