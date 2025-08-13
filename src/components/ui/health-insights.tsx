import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

interface HealthInsight {
  timeline: Array<{
    date: string;
    event: string;
  }>;
  summary: {
    health_patterns: string[];
    primary_concerns: string[];
    progress: string[];
  };
  recommendations: string[];
}

interface HealthInsightsProps {
  insights: HealthInsight | null;
}

export function HealthInsights({ insights }: HealthInsightsProps) {
  if (!insights) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            AI-powered analysis of your conversation history
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Timeline */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Health Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.timeline.map((event, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm">{event.event}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Summary */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health Patterns */}
          <div>
            <h4 className="font-medium mb-2">Health Patterns</h4>
            <div className="flex flex-wrap gap-2">
              {insights.summary.health_patterns.map((pattern, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {pattern}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Primary Concerns */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Primary Concerns
            </h4>
            <ul className="space-y-1">
              {insights.summary.primary_concerns.map((concern, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {concern}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Progress */}
          <div>
            <h4 className="font-medium mb-2">Progress</h4>
            <ul className="space-y-1">
              {insights.summary.progress.map((progress, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {progress}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {insights.recommendations.map((rec, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                <p className="text-sm text-muted-foreground">{rec}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}