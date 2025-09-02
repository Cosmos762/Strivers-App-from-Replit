import { UserProgress, ProgressStats, StudyPlan } from "@shared/schema";
import { getAllProblems, getTotalProblemCounts } from "./dsa-data";

const PROGRESS_STORAGE_KEY = "dsa_progress";
const STREAK_STORAGE_KEY = "dsa_streaks";
const STUDY_PLANS_KEY = "dsa_study_plans";

export interface LocalProgress {
  problemId: string;
  completed: boolean;
  completedAt: string;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastStudyDate: string;
  streakDates: string[];
}

export const progressStorage = {
  getProgress(): LocalProgress[] {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  markComplete(problemId: string): void {
    const progress = this.getProgress();
    const existingIndex = progress.findIndex(p => p.problemId === problemId);
    
    const newProgress: LocalProgress = {
      problemId,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      progress[existingIndex] = newProgress;
    } else {
      progress.push(newProgress);
    }

    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    this.updateStreak();
  },

  markIncomplete(problemId: string): void {
    const progress = this.getProgress();
    const filtered = progress.filter(p => p.problemId !== problemId);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(filtered));
  },

  isCompleted(problemId: string): boolean {
    const progress = this.getProgress();
    return progress.some(p => p.problemId === problemId && p.completed);
  },

  getStats(): ProgressStats {
    const progress = this.getProgress();
    const completed = progress.filter(p => p.completed);
    const allProblems = getAllProblems();
    const totals = getTotalProblemCounts();

    const completedProblems = completed.map(p => 
      allProblems.find(problem => problem.id === p.problemId)
    ).filter(Boolean);

    const easyCompleted = completedProblems.filter(p => p?.difficulty === "Easy").length;
    const mediumCompleted = completedProblems.filter(p => p?.difficulty === "Medium").length;
    const hardCompleted = completedProblems.filter(p => p?.difficulty === "Hard").length;

    const streakData = this.getStreakData();

    return {
      totalProblems: totals.total,
      completedProblems: completed.length,
      easyCompleted,
      mediumCompleted,
      hardCompleted,
      easyTotal: totals.easy,
      mediumTotal: totals.medium,
      hardTotal: totals.hard,
      currentStreak: streakData.currentStreak,
      bestStreak: streakData.bestStreak,
    };
  },

  getStreakData(): StreakData {
    try {
      const stored = localStorage.getItem(STREAK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        currentStreak: 0,
        bestStreak: 0,
        lastStudyDate: "",
        streakDates: [],
      };
    } catch {
      return {
        currentStreak: 0,
        bestStreak: 0,
        lastStudyDate: "",
        streakDates: [],
      };
    }
  },

  updateStreak(): void {
    const streakData = this.getStreakData();
    const today = new Date().toISOString().split('T')[0];
    
    if (!streakData.streakDates.includes(today)) {
      streakData.streakDates.push(today);
      
      // Calculate current streak
      const sortedDates = streakData.streakDates.sort();
      let currentStreak = 1;
      
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const currentDate = new Date(sortedDates[i + 1]);
        const prevDate = new Date(sortedDates[i]);
        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      streakData.currentStreak = currentStreak;
      streakData.bestStreak = Math.max(streakData.bestStreak, currentStreak);
      streakData.lastStudyDate = today;
      
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakData));
    }
  },

  getCalendarData(): { date: string; hasProblem: boolean }[] {
    const streakData = this.getStreakData();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const calendarDays = [];
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
      calendarDays.push({
        date,
        hasProblem: streakData.streakDates.includes(date),
      });
    }
    
    return calendarDays;
  },

  // Study Plans Management
  getStudyPlans(): StudyPlan[] {
    try {
      const stored = localStorage.getItem(STUDY_PLANS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  getStudyPlan(date: string): StudyPlan | null {
    const plans = this.getStudyPlans();
    return plans.find(plan => plan.date === date) || null;
  },

  saveStudyPlan(plan: StudyPlan): void {
    const plans = this.getStudyPlans();
    const existingIndex = plans.findIndex(p => p.date === plan.date);
    
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.push(plan);
    }

    localStorage.setItem(STUDY_PLANS_KEY, JSON.stringify(plans));
  },

  removeStudyPlan(date: string): void {
    const plans = this.getStudyPlans();
    const filtered = plans.filter(plan => plan.date !== date);
    localStorage.setItem(STUDY_PLANS_KEY, JSON.stringify(filtered));
  },
};
