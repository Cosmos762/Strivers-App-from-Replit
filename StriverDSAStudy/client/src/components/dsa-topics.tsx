import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ExpandIcon, 
  Shuffle, 
  Search, 
  Filter,
  ChevronDown
} from "lucide-react";
import { dsaSteps, getAllProblems } from "@/lib/dsa-data";
import { TopicStep } from "./topic-step";
import { progressStorage } from "@/lib/progress-storage";

export function DSATopics() {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>(["Easy", "Medium", "Hard"]);
  const [refreshKey, setRefreshKey] = useState(0);

  const toggleExpandAll = () => {
    if (expandedSteps.size === dsaSteps.length) {
      setExpandedSteps(new Set());
    } else {
      setExpandedSteps(new Set(dsaSteps.map(step => step.id)));
    }
  };

  const pickRandomProblem = () => {
    const allProblems = getAllProblems();
    const incompletedProblems = allProblems.filter(problem => 
      !progressStorage.isCompleted(problem.id) &&
      difficultyFilter.includes(problem.difficulty)
    );
    
    if (incompletedProblems.length > 0) {
      const randomProblem = incompletedProblems[Math.floor(Math.random() * incompletedProblems.length)];
      // Find the step and expand it
      for (const step of dsaSteps) {
        for (const lecture of step.lectures) {
          if (lecture.problems.some(p => p.id === randomProblem.id)) {
            setExpandedSteps(new Set([step.id]));
            // Scroll to the problem (simplified approach)
            setTimeout(() => {
              const element = document.querySelector(`[data-testid="checkbox-${randomProblem.id}"]`);
              element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return;
          }
        }
      }
    }
  };

  const handleProgressChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const toggleDifficultyFilter = (difficulty: string) => {
    setDifficultyFilter(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Striver's A2Z DSA Course</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpandAll}
              data-testid="toggle-expand-all"
            >
              <ExpandIcon className="w-4 h-4 mr-2" />
              {expandedSteps.size === dsaSteps.length ? "Collapse All" : "Expand All"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={pickRandomProblem}
              data-testid="pick-random-problem"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Pick Random
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="search-problems"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={difficultyFilter.includes("Easy") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleDifficultyFilter("Easy")}
              className={difficultyFilter.includes("Easy") ? "bg-green-600 hover:bg-green-700" : ""}
              data-testid="filter-easy"
            >
              Easy
            </Button>
            <Button
              variant={difficultyFilter.includes("Medium") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleDifficultyFilter("Medium")}
              className={difficultyFilter.includes("Medium") ? "bg-yellow-600 hover:bg-yellow-700" : ""}
              data-testid="filter-medium"
            >
              Medium
            </Button>
            <Button
              variant={difficultyFilter.includes("Hard") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleDifficultyFilter("Hard")}
              className={difficultyFilter.includes("Hard") ? "bg-red-600 hover:bg-red-700" : ""}
              data-testid="filter-hard"
            >
              Hard
            </Button>
          </div>
        </div>
      </div>

      {/* DSA Steps */}
      <div className="space-y-4" key={refreshKey}>
        {dsaSteps.map((step) => (
          <TopicStep 
            key={step.id} 
            step={step} 
            onProgressChange={handleProgressChange}
          />
        ))}
        
        {/* Load More Steps Placeholder */}
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            More steps coming soon! This demo shows the first 6 steps of the complete 18-step program.
          </p>
          <Button 
            variant="outline" 
            disabled
            data-testid="load-more-steps"
          >
            Load More Steps (12 remaining)
          </Button>
        </div>
      </div>
    </div>
  );
}
