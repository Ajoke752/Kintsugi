import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface ActionItem {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  category?: string;
}

interface ActionPlan {
  id: string;
  debrief_date: string;
  actions: ActionItem[];
}

const ActionPlans = () => {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Local state for optimistic updates
  const [completedActions, setCompletedActions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let token: string | null = null;
        try {
          token = await getToken();
        } catch (tokErr) {
          // Not signed in or token unavailable — continue without token (useful for dev)
          console.debug("getToken unavailable:", tokErr);
          token = null;
        }

        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        // Ensure this URL matches your backend port (default 5000)
        let res = await fetch(`${API_BASE}/api/dashboard`, { headers });

        // If backend returns 401, try again without auth to support local SKIP_AUTH dev mode
        if (res.status === 401) {
          console.warn(
            "Dashboard returned 401; retrying without Authorization header (dev fallback)"
          );
          res = await fetch(`${API_BASE}/api/dashboard`);
        }

        if (!res.ok)
          throw new Error(
            `Failed to fetch mission data (status=${res.status})`
          );

        const data = await res.json();

        if (data.activeMission) {
          const mission = data.activeMission;

          // Initialize completed set
          const completedSet = new Set<string>();
          mission.protocol.forEach((task: any) => {
            if (task.isCompleted) completedSet.add(task._id);
          });
          setCompletedActions(completedSet);

          // Format the plan
          const currentPlan: ActionPlan = {
            id: mission._id,
            debrief_date: mission.createdAt,
            actions: mission.protocol.map((task: any) => ({
              id: task._id,
              text: task.action,
              priority: "high",
              category: task.category,
              completed: task.isCompleted,
            })),
          };
          setPlans([currentPlan]);
        } else {
          setPlans([]);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  const toggleAction = async (planId: string, actionId: string) => {
    // Optimistic Update
    setCompletedActions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(actionId)) {
        newSet.delete(actionId);
      } else {
        newSet.add(actionId);
      }
      return newSet;
    });

    // Send to Backend
    try {
      let token: string | null = null;
      try {
        token = await getToken();
      } catch (tokErr) {
        console.debug("getToken unavailable for toggleAction:", tokErr);
        token = null;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      let res = await fetch(`${API_BASE}/api/debrief/${planId}/complete`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ taskId: actionId }),
      });

      if (res.status === 401) {
        console.warn(
          "PATCH debrief returned 401; retrying without Authorization header (dev fallback)"
        );
        res = await fetch(`${API_BASE}/api/debrief/${planId}/complete`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId: actionId }),
        });
      }

      if (!res.ok) throw new Error("Server failed to save");

      const data = await res.json();

      toast({
        title: data.msg || "Objective Updated",
        description: "Tactical progress saved.",
      });
    } catch (err) {
      console.error(err);
      // Revert optimistic update on failure
      setCompletedActions((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(actionId)) newSet.delete(actionId);
        else newSet.add(actionId);
        return newSet;
      });

      toast({
        title: "Connection Error",
        description: "Could not save progress to Command Center.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-muted-foreground animate-pulse">
        Contacting Command Center...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center text-destructive border border-destructive/20 rounded-lg bg-destructive/5">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <p>Secure connection failed. Ensure Backend is running on port 5000.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-accent" />
            Action Plans
          </h2>
          <p className="text-muted-foreground">
            Tactical steps based on your debriefs. Do these to change how you
            feel.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {plans.map((plan) => {
          const totalActions = plan.actions.length;
          const completedCount = plan.actions.filter((a) =>
            completedActions.has(a.id)
          ).length;
          const progress =
            totalActions > 0 ? (completedCount / totalActions) * 100 : 0;

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
                  className={
                    progress === 100 ? "bg-accent text-accent-foreground" : ""
                  }
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
                    onToggle={() => toggleAction(plan.id, action.id)}
                  />
                ))}
              </div>

              {progress === 100 && (
                <div className="flex items-center gap-2 text-accent pt-2 animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">
                    Mission Accomplished. Good work.
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {plans.length === 0 && (
        <Card className="p-12 text-center bg-card border-border border-dashed">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No active missions. Complete a voice debrief to generate your first
            protocol.
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
  action: ActionItem;
  isCompleted: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-colors border border-transparent
        ${
          isCompleted
            ? "bg-secondary/30 opacity-60"
            : "hover:bg-secondary/50 hover:border-border"
        }`}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={onToggle}
        className="mt-0.5 data-[state=checked]:bg-accent data-[state=checked]:text-black data-[state=checked]:border-accent"
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold tracking-wider uppercase ${
              isCompleted ? "text-muted-foreground" : "text-primary"
            }`}
          >
            {action.category || "TACTICAL"}
          </span>
          {action.priority === "high" && !isCompleted && (
            <Badge
              variant="outline"
              className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] h-5 px-1.5"
            >
              PRIORITY
            </Badge>
          )}
        </div>
        <p
          className={`text-sm md:text-base transition-all ${
            isCompleted
              ? "line-through text-muted-foreground"
              : "text-foreground font-medium"
          }`}
        >
          {action.text}
        </p>
      </div>
    </div>
  );
};

export default ActionPlans;
