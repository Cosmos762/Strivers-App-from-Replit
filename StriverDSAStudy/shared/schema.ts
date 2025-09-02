import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  problemId: text("problem_id").notNull(),
  completed: boolean("completed").default(false),
  completedAt: text("completed_at"),
});

export const dailyStreaks = pgTable("daily_streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  problemsSolved: integer("problems_solved").default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  userId: true,
});

export const insertStreakSchema = createInsertSchema(dailyStreaks).omit({
  id: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type DailyStreak = typeof dailyStreaks.$inferSelect;
export type InsertStreak = z.infer<typeof insertStreakSchema>;

// DSA Course Types
export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tufUrl?: string;
  youtubeUrl?: string;
  practiceUrl?: string;
  leetcodeUrl?: string;
  geeksforgeeksUrl?: string;
  description?: string;
}

export interface Lecture {
  id: string;
  title: string;
  problems: Problem[];
}

export interface Step {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  lectures: Lecture[];
  totalProblems: number;
}

export interface ProgressStats {
  totalProblems: number;
  completedProblems: number;
  easyCompleted: number;
  mediumCompleted: number;
  hardCompleted: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
  currentStreak: number;
  bestStreak: number;
}

export interface StudyPlan {
  id: string;
  date: string;
  selectedStepIds: string[];
  selectedLectureIds: string[];
  targetProblems: number;
  notes?: string;
}
