import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  TrendingUp, 
  Calendar, 
  Flame, 
  User,
  Menu,
  X
} from "lucide-react";
import { progressStorage } from "@/lib/progress-storage";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const stats = progressStorage.getStats();
  const progressPercentage = (stats.completedProblems / stats.totalProblems) * 100;

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">DSA Master</h1>
            <p className="text-sm text-muted-foreground">Striver's A2Z Course</p>
          </div>
        </div>
        
        {/* Overall Progress */}
        <Card className="bg-secondary p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Total Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.completedProblems} / {stats.totalProblems}
            </span>
          </div>
          <Progress value={progressPercentage} className="mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Easy: {stats.easyCompleted}/{stats.easyTotal}</span>
            <span>Medium: {stats.mediumCompleted}/{stats.mediumTotal}</span>
            <span>Hard: {stats.hardCompleted}/{stats.hardTotal}</span>
          </div>
        </Card>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          <Button
            variant={currentView === "dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              onViewChange("dashboard");
              if (isMobile) setIsOpen(false);
            }}
            data-testid="nav-dashboard"
          >
            <TrendingUp className="w-4 h-4 mr-3 text-primary" />
            Progress Dashboard
          </Button>
          
          <Button
            variant={currentView === "topics" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              onViewChange("topics");
              if (isMobile) setIsOpen(false);
            }}
            data-testid="nav-topics"
          >
            <Code className="w-4 h-4 mr-3 text-muted-foreground" />
            DSA Topics
          </Button>
          
          <Button
            variant={currentView === "calendar" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              onViewChange("calendar");
              if (isMobile) setIsOpen(false);
            }}
            data-testid="nav-calendar"
          >
            <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
            Study Calendar
          </Button>
          
          <Button
            variant={currentView === "streaks" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              onViewChange("streaks");
              if (isMobile) setIsOpen(false);
            }}
            data-testid="nav-streaks"
          >
            <Flame className="w-4 h-4 mr-3 text-muted-foreground" />
            Streaks & Goals
          </Button>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-muted-foreground">Coding Journey</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(true)}
          data-testid="mobile-menu-toggle"
        >
          <Menu className="w-4 h-4" />
        </Button>
        
        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border">
              <div className="absolute right-4 top-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  data-testid="mobile-menu-close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {sidebarContent}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <aside className="w-80 bg-card border-r border-border hidden md:flex flex-col">
      {sidebarContent}
    </aside>
  );
}
