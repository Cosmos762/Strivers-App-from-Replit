import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProgressSchema, insertStreakSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user progress
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Mark problem as complete
  app.post("/api/progress/:userId/complete", async (req, res) => {
    try {
      const { userId } = req.params;
      const { problemId } = insertProgressSchema.parse(req.body);
      
      const progress = await storage.markProblemComplete(userId, problemId);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  // Mark problem as incomplete
  app.delete("/api/progress/:userId/:problemId", async (req, res) => {
    try {
      const { userId, problemId } = req.params;
      const success = await storage.markProblemIncomplete(userId, problemId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // Get daily streaks
  app.get("/api/streaks/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const streaks = await storage.getDailyStreaks(userId);
      res.json(streaks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch streaks" });
    }
  });

  // Update daily streak
  app.post("/api/streaks/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const streakData = insertStreakSchema.parse(req.body);
      
      const streak = await storage.updateDailyStreak(userId, streakData);
      res.json(streak);
    } catch (error) {
      res.status(400).json({ error: "Invalid streak data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
