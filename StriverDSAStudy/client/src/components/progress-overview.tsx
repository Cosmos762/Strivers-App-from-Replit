import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, Trophy, CheckCircle } from "lucide-react";
import { progressStorage } from "@/lib/progress-storage";

export function ProgressOverview() {
  const stats = progressStorage.getStats();
  
  const easyProgress = (stats.easyCompleted / stats.easyTotal) * 100;
  const mediumProgress = (stats.mediumCompleted / stats.mediumTotal) * 100;
  const hardProgress = (stats.hardCompleted / stats.hardTotal) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Easy Problems */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="hsl(var(--border))" 
                  strokeWidth="4" 
                  fill="transparent"
                />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="hsl(120 60% 50%)" 
                  strokeWidth="4" 
                  fill="transparent"
                  strokeDasharray={`${175.92}`}
                  strokeDashoffset={`${175.92 - (175.92 * easyProgress) / 100}`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold">{Math.round(easyProgress)}%</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Easy Problems</h3>
              <p className="text-muted-foreground">
                {stats.easyCompleted} / {stats.easyTotal} completed
              </p>
              <Badge 
                variant="secondary" 
                className="mt-1 bg-green-500/20 text-green-400 hover:bg-green-500/30"
              >
                Easy
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medium Problems */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="hsl(var(--border))" 
                  strokeWidth="4" 
                  fill="transparent"
                />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="hsl(45 60% 50%)" 
                  strokeWidth="4" 
                  fill="transparent"
                  strokeDasharray={`${175.92}`}
                  strokeDashoffset={`${175.92 - (175.92 * mediumProgress) / 100}`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold">{Math.round(mediumProgress)}%</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Medium Problems</h3>
              <p className="text-muted-foreground">
                {stats.mediumCompleted} / {stats.mediumTotal} completed
              </p>
              <Badge 
                variant="secondary" 
                className="mt-1 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
              >
                Medium
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hard Problems */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="hsl(var(--border))" 
                  strokeWidth="4" 
                  fill="transparent"
                />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="hsl(0 60% 50%)" 
                  strokeWidth="4" 
                  fill="transparent"
                  strokeDasharray={`${175.92}`}
                  strokeDashoffset={`${175.92 - (175.92 * hardProgress) / 100}`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold">{Math.round(hardProgress)}%</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Hard Problems</h3>
              <p className="text-muted-foreground">
                {stats.hardCompleted} / {stats.hardTotal} completed
              </p>
              <Badge 
                variant="secondary" 
                className="mt-1 bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                Hard
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Streak */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Daily Streak</h3>
              <p className="text-2xl font-bold text-primary">{stats.currentStreak} Days</p>
              <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
