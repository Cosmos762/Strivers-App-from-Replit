import { type User, type InsertUser, type UserProgress, type InsertProgress, type DailyStreak, type InsertStreak } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getUserProgress(userId: string): Promise<UserProgress[]>;
  markProblemComplete(userId: string, problemId: string): Promise<UserProgress>;
  markProblemIncomplete(userId: string, problemId: string): Promise<boolean>;
  
  getDailyStreaks(userId: string): Promise<DailyStreak[]>;
  updateDailyStreak(userId: string, streak: InsertStreak): Promise<DailyStreak>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private progress: Map<string, UserProgress>;
  private streaks: Map<string, DailyStreak>;

  constructor() {
    this.users = new Map();
    this.progress = new Map();
    this.streaks = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.progress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async markProblemComplete(userId: string, problemId: string): Promise<UserProgress> {
    const id = randomUUID();
    const progressItem: UserProgress = {
      id,
      userId,
      problemId,
      completed: true,
      completedAt: new Date().toISOString(),
    };
    
    // Remove any existing progress for this problem
    const existingKey = Array.from(this.progress.entries()).find(
      ([_, progress]) => progress.userId === userId && progress.problemId === problemId
    )?.[0];
    
    if (existingKey) {
      this.progress.delete(existingKey);
    }
    
    this.progress.set(id, progressItem);
    return progressItem;
  }

  async markProblemIncomplete(userId: string, problemId: string): Promise<boolean> {
    const existingKey = Array.from(this.progress.entries()).find(
      ([_, progress]) => progress.userId === userId && progress.problemId === problemId
    )?.[0];
    
    if (existingKey) {
      this.progress.delete(existingKey);
      return true;
    }
    return false;
  }

  async getDailyStreaks(userId: string): Promise<DailyStreak[]> {
    return Array.from(this.streaks.values()).filter(
      (streak) => streak.userId === userId
    );
  }

  async updateDailyStreak(userId: string, streak: InsertStreak): Promise<DailyStreak> {
    const id = randomUUID();
    const dailyStreak: DailyStreak = {
      id,
      userId,
      date: streak.date,
      problemsSolved: streak.problemsSolved ?? 0,
    };
    
    // Remove existing streak for this date
    const existingKey = Array.from(this.streaks.entries()).find(
      ([_, s]) => s.userId === userId && s.date === streak.date
    )?.[0];
    
    if (existingKey) {
      this.streaks.delete(existingKey);
    }
    
    this.streaks.set(id, dailyStreak);
    return dailyStreak;
  }
}

export const storage = new MemStorage();
