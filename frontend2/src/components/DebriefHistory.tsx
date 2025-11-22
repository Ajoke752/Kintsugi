import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";

// Mock data - will be replaced with real data from your backend
const mockDebriefs = [
  {
    id: 1,
    date: "2024-01-15",
    sentiment: "negative",
    keyStressors: ["Work pressure", "Team conflict"],
    summary: "Feeling overwhelmed with project deadlines and communication issues with team members.",
  },
  {
    id: 2,
    date: "2024-01-14",
    sentiment: "neutral",
    keyStressors: ["Time management"],
    summary: "Struggling to balance personal time with work commitments.",
  },
  {
    id: 3,
    date: "2024-01-13",
    sentiment: "positive",
    keyStressors: [],
    summary: "Good progress on fitness goals and feeling more energized.",
  },
];

const DebriefHistory = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Your Debriefs</h2>
        <Badge variant="outline" className="text-muted-foreground">
          {mockDebriefs.length} total
        </Badge>
      </div>

      <div className="space-y-4">
        {mockDebriefs.map((debrief) => (
          <Card
            key={debrief.id}
            className="p-6 bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(debrief.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <SentimentBadge sentiment={debrief.sentiment} />
              </div>

              <p className="text-foreground">{debrief.summary}</p>

              {debrief.keyStressors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {debrief.keyStressors.map((stressor, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-secondary text-secondary-foreground"
                    >
                      {stressor}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {mockDebriefs.length === 0 && (
        <Card className="p-12 text-center bg-card border-border border-dashed">
          <p className="text-muted-foreground">
            No debriefs yet. Start your first one to begin tracking your journey.
          </p>
        </Card>
      )}
    </div>
  );
};

const SentimentBadge = ({ sentiment }: { sentiment: string }) => {
  const config = {
    positive: {
      icon: <TrendingUp className="w-3 h-3" />,
      label: "Positive",
      className: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    neutral: {
      icon: <Minus className="w-3 h-3" />,
      label: "Neutral",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    negative: {
      icon: <TrendingDown className="w-3 h-3" />,
      label: "Needs Attention",
      className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
  };

  const { icon, label, className } = config[sentiment as keyof typeof config] || config.neutral;

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${className}`}>
      {icon}
      {label}
    </Badge>
  );
};

export default DebriefHistory;
