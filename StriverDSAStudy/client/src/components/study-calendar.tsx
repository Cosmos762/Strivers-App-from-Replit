import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Star, CheckCircle, BookOpen, Target } from "lucide-react";
import { progressStorage } from "@/lib/progress-storage";
import { StudyPlanner } from "./study-planner";
import { StudyPlan } from "@shared/schema";

export function StudyCalendar() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const calendarData = progressStorage.getCalendarData();
  const streakData = progressStorage.getStreakData();
  const stats = progressStorage.getStats();

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Get day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePlanSave = (plan: StudyPlan) => {
    progressStorage.saveStudyPlan(plan);
    setRefreshKey(prev => prev + 1);
  };

  const getDatePlan = (dateStr: string) => {
    return progressStorage.getStudyPlan(dateStr);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Calendar Widget */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Study Calendar - {currentMonth}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {calendarData.map((day, index) => {
              const dayNumber = new Date(day.date).getDate();
              const isToday = day.date === new Date().toISOString().split('T')[0];
              const hasActivity = day.hasProblem;
              const hasPlan = getDatePlan(day.date) !== null;
              const isSelected = selectedDate === day.date;
              
              return (
                <div
                  key={day.date}
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-colors relative
                    ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                    ${isToday ? 'bg-primary text-primary-foreground font-bold' : ''}
                    ${hasActivity && !isToday ? 'bg-primary/70 text-primary-foreground' : ''}
                    ${hasPlan && !hasActivity && !isToday ? 'bg-blue-500/50 text-blue-100' : ''}
                    ${!hasActivity && !hasPlan && !isToday ? 'hover:bg-muted' : ''}
                  `}
                  onClick={() => setSelectedDate(day.date)}
                  data-testid={`calendar-day-${dayNumber}`}
                >
                  {dayNumber}
                  {hasPlan && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/70 rounded"></div>
              <span>Study Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/50 rounded"></div>
              <span>Planned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">Current Streak</span>
              </div>
              <span className="text-primary font-bold" data-testid="current-streak">
                {stats.currentStreak} days
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <span className="font-medium">Best Streak</span>
              </div>
              <span className="text-yellow-500 font-bold" data-testid="best-streak">
                {stats.bestStreak} days
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <span className="font-medium">Problems Solved</span>
              </div>
              <span className="text-green-500 font-bold" data-testid="total-solved">
                {stats.completedProblems}
              </span>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Study Days This Month</p>
                <p className="text-2xl font-bold text-primary">
                  {calendarData.filter(day => day.hasProblem).length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Plan Panel */}
      {selectedDate && (
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })} Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Study Planner Component */}
              <StudyPlanner
                selectedDate={selectedDate}
                onPlanSave={handlePlanSave}
                existingPlan={getDatePlan(selectedDate)}
              />

              {/* Plan Summary */}
              {getDatePlan(selectedDate) && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      Target: {getDatePlan(selectedDate)?.targetProblems} problems
                    </span>
                  </div>
                  
                  <div>
                    <h6 className="font-medium mb-2">Selected Topics:</h6>
                    <div className="space-y-1">
                      {(() => {
                        const plan = getDatePlan(selectedDate);
                        return (
                          <>
                            {plan?.selectedStepIds?.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {plan.selectedStepIds.length} steps
                              </Badge>
                            )}
                            {plan?.selectedLectureIds?.length > 0 && (
                              <Badge variant="outline" className="text-xs ml-2">
                                {plan.selectedLectureIds.length} lectures
                              </Badge>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {getDatePlan(selectedDate)?.notes && (
                    <div>
                      <h6 className="font-medium mb-2">Notes:</h6>
                      <p className="text-sm text-muted-foreground">
                        {getDatePlan(selectedDate)?.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
