import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Step } from "@shared/schema";
import { ProblemItem } from "./problem-item";
import { progressStorage } from "@/lib/progress-storage";

interface TopicStepProps {
  step: Step;
  onProgressChange?: () => void;
}

export function TopicStep({ step, onProgressChange }: TopicStepProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedLectures, setExpandedLectures] = useState<Set<string>>(new Set());
  
  // Calculate progress for this step
  const allProblemsInStep = step.lectures.flatMap(lecture => lecture.problems);
  const completedProblems = allProblemsInStep.filter(problem => 
    progressStorage.isCompleted(problem.id)
  ).length;

  const toggleLecture = (lectureId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedLectures);
    if (newExpanded.has(lectureId)) {
      newExpanded.delete(lectureId);
    } else {
      newExpanded.add(lectureId);
    }
    setExpandedLectures(newExpanded);
  };

  const handleProgressChange = () => {
    onProgressChange?.();
  };

  return (
    <Card className="overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        data-testid={`step-header-${step.stepNumber}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold">{step.stepNumber}</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold">{step.title}</h4>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">
                {completedProblems} / {step.totalProblems}
              </p>
              <p className="text-xs text-muted-foreground">completed</p>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 transition-transform" />
            ) : (
              <ChevronRight className="w-5 h-5 transition-transform" />
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-border" onClick={(e) => e.stopPropagation()}>
          {step.lectures.map((lecture) => {
            const lectureCompletedProblems = lecture.problems.filter(problem => 
              progressStorage.isCompleted(problem.id)
            ).length;
            const isLectureExpanded = expandedLectures.has(lecture.id);

            return (
              <div key={lecture.id} className="border-b border-border last:border-b-0">
                <div 
                  className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={(e) => toggleLecture(lecture.id, e)}
                  data-testid={`lecture-header-${lecture.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isLectureExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <h5 className="font-semibold text-base">{lecture.title}</h5>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {lectureCompletedProblems} / {lecture.problems.length}
                    </span>
                  </div>
                </div>
                
                {isLectureExpanded && (
                  <div className="px-6 pb-6" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-3">
                      {lecture.problems.map((problem) => (
                        <ProblemItem
                          key={problem.id}
                          problem={problem}
                          onProgressChange={handleProgressChange}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
