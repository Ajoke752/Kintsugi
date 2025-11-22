import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// Mock data - will be replaced with real data from your backend
const mockActionPlans = [
  {
    id: 1,
    debrief_date: "2024-01-15",
    actions: [
      {
        id: 1,
        text: "Schedule 15-min 1-on-1 with team lead to clarify priorities",
        priority: "high",
        completed: false,
      },
      {
        id: 2,
        text: "Block 2 hours on calendar for deep work tomorrow morning",
        priority: "high",
        completed: false,
      },
      {
        id: 3,
        text: "Send quick message to teammate acknowledging their perspective",
        priority: "medium",
        completed: true,
      },
    ],
  },
];

const ActionPlans = () => {
  const [completedActions, setCompletedActions] = useState<Set<number>>(
    new Set(mockActionPlans.flatMap(plan => 
      plan.actions.filter(a => a.completed).map(a => a.id)
    ))
  );

  const toggleAction = (actionId: number) => {
    setCompletedActions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(actionId)) {
        newSet.delete(actionId);
      } else {
        newSet.add(actionId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-accent" />
            Action Plans
          </h2>
          <p className="text-muted-foreground">
            Tactical steps based on your debriefs. Do these to change how you feel.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {mockActionPlans.map((plan) => {
          const totalActions = plan.actions.length;
          const completedCount = plan.actions.filter((a) => completedActions.has(a.id)).length;
          const progress = (completedCount / totalActions) * 100;

          return (
            <Card key={plan.id} className="p-6 bg-card border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  From debrief on{" "}
                  {new Date(plan.debrief_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <Badge
                  variant={progress === 100 ? "default" : "secondary"}
                  className={progress === 100 ? "bg-accent text-accent-foreground" : ""}
                >
                  {completedCount}/{totalActions} Complete
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Action Items */}
              <div className="space-y-3">
                {plan.actions.map((action) => (
                  <ActionItem
                    key={action.id}
                    action={action}
                    isCompleted={completedActions.has(action.id)}
                    onToggle={() => toggleAction(action.id)}
                  />
                ))}
              </div>

              {progress === 100 && (
                <div className="flex items-center gap-2 text-accent pt-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">All actions completed!</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {mockActionPlans.length === 0 && (
        <Card className="p-12 text-center bg-card border-border border-dashed">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Complete a debrief to get your first action plan.
          </p>
        </Card>
      )}
    </div>
  );
};

const ActionItem = ({
  action,
  isCompleted,
  onToggle,
}: {
  action: { text: string; priority: string };
  isCompleted: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
      <Checkbox
        checked={isCompleted}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <div className="flex-1 space-y-1">
        <p
          className={`text-foreground ${
            isCompleted ? "line-through opacity-60" : ""
          }`}
        >
          {action.text}
        </p>
        {action.priority === "high" && (
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 text-xs"
          >
            High Priority
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ActionPlans;
