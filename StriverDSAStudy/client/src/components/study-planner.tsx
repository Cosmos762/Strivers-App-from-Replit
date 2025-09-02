import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Edit, Target, BookOpen } from "lucide-react";
import { dsaSteps } from "@/lib/dsa-data";
import { StudyPlan } from "@shared/schema";

interface StudyPlannerProps {
  selectedDate: string | null;
  onPlanSave?: (plan: StudyPlan) => void;
  existingPlan?: StudyPlan | null;
}

export function StudyPlanner({ selectedDate, onPlanSave, existingPlan }: StudyPlannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<Set<string>>(
    new Set(existingPlan?.selectedStepIds || [])
  );
  const [selectedLectures, setSelectedLectures] = useState<Set<string>>(
    new Set(existingPlan?.selectedLectureIds || [])
  );
  const [targetProblems, setTargetProblems] = useState(existingPlan?.targetProblems || 3);
  const [notes, setNotes] = useState(existingPlan?.notes || "");

  const handleStepToggle = (stepId: string) => {
    const newSelected = new Set(selectedSteps);
    if (newSelected.has(stepId)) {
      newSelected.delete(stepId);
      // Also remove all lectures from this step
      const step = dsaSteps.find(s => s.id === stepId);
      if (step) {
        const newLectures = new Set(selectedLectures);
        step.lectures.forEach(lecture => {
          newLectures.delete(lecture.id);
        });
        setSelectedLectures(newLectures);
      }
    } else {
      newSelected.add(stepId);
    }
    setSelectedSteps(newSelected);
  };

  const handleLectureToggle = (lectureId: string, stepId: string) => {
    const newSelected = new Set(selectedLectures);
    if (newSelected.has(lectureId)) {
      newSelected.delete(lectureId);
    } else {
      newSelected.add(lectureId);
      // Also select the parent step
      setSelectedSteps(prev => new Set([...Array.from(prev), stepId]));
    }
    setSelectedLectures(newSelected);
  };

  const handleSave = () => {
    if (!selectedDate) return;

    const plan: StudyPlan = {
      id: existingPlan?.id || `plan-${selectedDate}`,
      date: selectedDate,
      selectedStepIds: Array.from(selectedSteps),
      selectedLectureIds: Array.from(selectedLectures),
      targetProblems,
      notes,
    };

    onPlanSave?.(plan);
    setIsOpen(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!selectedDate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={existingPlan ? "secondary" : "default"}
          size="sm"
          className="w-full"
          data-testid="open-study-planner"
        >
          {existingPlan ? (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Plan
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Plan Study
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Study Plan for {formatDate(selectedDate)}
          </DialogTitle>
          <DialogDescription>
            Set your daily study goals and select topics to focus on for this date.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Target Problems */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target-problems" className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" />
                Target Problems
              </Label>
              <Input
                id="target-problems"
                type="number"
                min="1"
                max="20"
                value={targetProblems}
                onChange={(e) => setTargetProblems(parseInt(e.target.value) || 1)}
                data-testid="target-problems-input"
              />
            </div>
            
            <div>
              <Label className="block mb-2">Selected Topics</Label>
              <div className="text-sm text-muted-foreground">
                {selectedSteps.size} steps, {selectedLectures.size} lectures
              </div>
            </div>
          </div>

          {/* Topic Selection */}
          <div>
            <Label className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4" />
              Select Topics to Study
            </Label>
            
            <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">
              {dsaSteps.map((step) => (
                <div key={step.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedSteps.has(step.id)}
                      onCheckedChange={() => handleStepToggle(step.id)}
                      data-testid={`step-checkbox-${step.stepNumber}`}
                    />
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Step {step.stepNumber}
                      </Badge>
                      <span className="font-medium">{step.title}</span>
                    </div>
                  </div>
                  
                  {selectedSteps.has(step.id) && (
                    <div className="ml-8 space-y-1">
                      {step.lectures.map((lecture) => (
                        <div key={lecture.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedLectures.has(lecture.id)}
                            onCheckedChange={() => handleLectureToggle(lecture.id, step.id)}
                            data-testid={`lecture-checkbox-${lecture.id}`}
                          />
                          <span className="text-sm text-muted-foreground">
                            {lecture.title}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {lecture.problems.length} problems
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Study Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or goals for this study session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
              data-testid="study-notes-textarea"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              data-testid="cancel-plan"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={selectedSteps.size === 0}
              data-testid="save-plan"
            >
              Save Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}