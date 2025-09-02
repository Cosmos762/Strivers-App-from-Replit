import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ExternalLink, 
  Youtube, 
  BookOpen, 
  Code, 
  CheckCircle 
} from "lucide-react";
import { Problem } from "@shared/schema";
import { progressStorage } from "@/lib/progress-storage";

interface ProblemItemProps {
  problem: Problem;
  onProgressChange?: () => void;
}

export function ProblemItem({ problem, onProgressChange }: ProblemItemProps) {
  const [isCompleted, setIsCompleted] = useState(
    progressStorage.isCompleted(problem.id)
  );

  const handleCompletionChange = (completed: boolean) => {
    if (completed) {
      progressStorage.markComplete(problem.id);
    } else {
      progressStorage.markIncomplete(problem.id);
    }
    setIsCompleted(completed);
    onProgressChange?.();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 hover:bg-green-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-400 hover:bg-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleCompletionChange}
          className="w-5 h-5"
          data-testid={`checkbox-${problem.id}`}
        />
        {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h6 className="font-medium">{problem.title}</h6>
          <Badge 
            variant="secondary" 
            className={getDifficultyColor(problem.difficulty)}
          >
            {problem.difficulty}
          </Badge>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {problem.tufUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
            >
              <a 
                href={problem.tufUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid={`tuf-link-${problem.id}`}
              >
                <BookOpen className="w-3 h-3 mr-1" />
                TUF Notes
              </a>
            </Button>
          )}
          
          {problem.youtubeUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30"
            >
              <a 
                href={problem.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid={`youtube-link-${problem.id}`}
              >
                <Youtube className="w-3 h-3 mr-1" />
                Video
              </a>
            </Button>
          )}
          
          {problem.practiceUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30"
            >
              <a 
                href={problem.practiceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid={`practice-link-${problem.id}`}
              >
                <Code className="w-3 h-3 mr-1" />
                Practice
              </a>
            </Button>
          )}
          
          {problem.leetcodeUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs bg-blue-600/20 text-blue-400 border-blue-600/30 hover:bg-blue-600/30"
            >
              <a 
                href={problem.leetcodeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid={`leetcode-link-${problem.id}`}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                LeetCode
              </a>
            </Button>
          )}
          
          {problem.geeksforgeeksUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs bg-orange-600/20 text-orange-400 border-orange-600/30 hover:bg-orange-600/30"
            >
              <a 
                href={problem.geeksforgeeksUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid={`gfg-link-${problem.id}`}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                GeeksforGeeks
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
