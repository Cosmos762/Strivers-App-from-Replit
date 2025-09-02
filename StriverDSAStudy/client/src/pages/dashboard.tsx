import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";
import { ProgressOverview } from "@/components/progress-overview";
import { StudyCalendar } from "@/components/study-calendar";
import { DSATopics } from "@/components/dsa-topics";
import { 
  Flame, 
  Calendar, 
  Shuffle,
  Download,
  Play
} from "lucide-react";
import { progressStorage } from "@/lib/progress-storage";
import { getAllProblems } from "@/lib/dsa-data";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();
  
  const stats = progressStorage.getStats();

  const pickRandomProblem = () => {
    const allProblems = getAllProblems();
    const incompletedProblems = allProblems.filter(problem => 
      !progressStorage.isCompleted(problem.id)
    );
    
    if (incompletedProblems.length > 0) {
      const randomProblem = incompletedProblems[Math.floor(Math.random() * incompletedProblems.length)];
      toast({
        title: "Random Problem Selected!",
        description: `${randomProblem.title} (${randomProblem.difficulty})`,
      });
      setCurrentView("topics");
    } else {
      toast({
        title: "Congratulations!",
        description: "You've completed all available problems!",
      });
    }
  };

  const exportProgress = () => {
    const progress = progressStorage.getProgress();
    const dataStr = JSON.stringify(progress, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dsa_progress.json';
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Progress Exported",
      description: "Your progress has been downloaded as a JSON file.",
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case "topics":
        return <DSATopics />;
      case "calendar":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Study Calendar & Streaks</h2>
            <StudyCalendar />
          </div>
        );
      case "streaks":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Streaks & Goals</h2>
            <StudyCalendar />
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Study Goals</h3>
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-muted-foreground">
                  Set daily study goals and track your consistency. Maintain your streak by solving at least one problem per day!
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div key={refreshKey}>
            <ProgressOverview />
            <StudyCalendar />
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {stats.completedProblems > 0 ? (
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <p className="text-sm">
                      Great progress! You've completed {stats.completedProblems} problems so far.
                      Keep up the momentum! 🚀
                    </p>
                  </div>
                ) : (
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground">
                      Start your DSA journey by completing your first problem! 
                      Navigate to DSA Topics to begin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">DSA Learning Dashboard</h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-primary" />
                <span data-testid="header-streak">{stats.currentStreak} Day Streak</span>
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={pickRandomProblem}
                data-testid="header-random-problem"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Pick Random
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportProgress}
                data-testid="header-export-progress"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </main>

      {/* Right Panel - Quick Actions */}
      <aside className="w-80 bg-card border-l border-border p-6 hidden xl:block">
        <div className="space-y-6">
          {/* Today's Goal */}
          <div className="bg-secondary rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Goal
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Problems to solve</span>
                <span className="text-primary font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Study time</span>
                <span className="text-primary font-medium">2 hours</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((stats.completedProblems / 3) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.min(stats.completedProblems, 3)} of 3 problems completed today
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                className="w-full justify-start"
                onClick={pickRandomProblem}
                data-testid="sidebar-random-problem"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Random Problem
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setCurrentView("topics")}
                data-testid="sidebar-resume-topic"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume Last Topic
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={exportProgress}
                data-testid="sidebar-export-progress"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Progress
              </Button>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Progress Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  Easy
                </Badge>
                <span className="text-sm font-medium">
                  {stats.easyCompleted}/{stats.easyTotal}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                  Medium
                </Badge>
                <span className="text-sm font-medium">
                  {stats.mediumCompleted}/{stats.mediumTotal}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                  Hard
                </Badge>
                <span className="text-sm font-medium">
                  {stats.hardCompleted}/{stats.hardTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
