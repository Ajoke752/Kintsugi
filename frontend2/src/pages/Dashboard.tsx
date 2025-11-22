import { useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VoiceRecorder from "@/components/VoiceRecorder";
import DebriefHistory from "@/components/DebriefHistory";
import ActionPlans from "@/components/ActionPlans";
import { Shield, Mic, History, Target } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"debrief" | "history" | "actions">("debrief");

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-accent" />
            <span className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Kintsugi
            </span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Command Center</h1>
            <p className="text-muted-foreground">
              Ready to debrief? Hit record and let's turn chaos into action.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-border">
            <TabButton
              active={activeTab === "debrief"}
              onClick={() => setActiveTab("debrief")}
              icon={<Mic className="w-4 h-4" />}
              label="Debrief"
            />
            <TabButton
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
              icon={<History className="w-4 h-4" />}
              label="History"
            />
            <TabButton
              active={activeTab === "actions"}
              onClick={() => setActiveTab("actions")}
              icon={<Target className="w-4 h-4" />}
              label="Action Plans"
            />
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === "debrief" && (
              <Card className="p-8 bg-gradient-card border-border">
                <VoiceRecorder />
              </Card>
            )}
            {activeTab === "history" && <DebriefHistory />}
            {activeTab === "actions" && <ActionPlans />}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-none border-b-2 transition-colors ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </Button>
  );
};

export default Dashboard;
