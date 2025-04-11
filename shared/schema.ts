import { pgTable, text, serial, integer, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// High score table
export const highScores = pgTable("high_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  username: text("username").notNull(),
  score: integer("score").notNull(),
  moves: integer("moves").notNull(),
  time: integer("time").notNull(), // Time in seconds
  difficulty: text("difficulty").notNull(), // 'easy', 'medium', 'hard'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHighScoreSchema = createInsertSchema(highScores).omit({
  id: true,
  createdAt: true,
});

export type InsertHighScore = z.infer<typeof insertHighScoreSchema>;
export type HighScore = typeof highScores.$inferSelect;
