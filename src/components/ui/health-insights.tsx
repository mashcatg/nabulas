import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

interface TimelineEvent {
  date: string;
  event: string;
}

interface HealthSummary {
  health_patterns: string[];
  primary_concerns: string[];
  progress: string[];
}

interface HealthInsight {
  timeline?: TimelineEvent[] | null;
  summary?: HealthSummary | null;
  recommendations?: string[] | null;
  [key: string]: any;
}

interface HealthInsightsProps {
  insights: HealthInsight | null | any;
}

export function HealthInsights({ insights }: HealthInsightsProps) {
  if (!insights || typeof insights !== 'object') {
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
            No insights available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasTimeline = Array.isArray(insights.timeline) && insights.timeline.length > 0;
  const hasSummary = insights.summary && (
    Array.isArray(insights.summary.health_patterns) ||
    Array.isArray(insights.summary.primary_concerns) ||
    Array.isArray(insights.summary.progress)
  );
  const hasRecommendations = Array.isArray(insights.recommendations) && insights.recommendations.length > 0;

  return (
    <div className="space-y-6">
      {/* Health Timeline */}
      {hasTimeline && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Health Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.timeline!.map((event, index) => (
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
      )}
      {/* Health Summary */}
      {hasSummary && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Health Patterns */}
            {Array.isArray(insights.summary?.health_patterns) && insights.summary.health_patterns.length > 0 && (
              <>
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
              </>
            )}

            {/* Primary Concerns */}
            {Array.isArray(insights.summary?.primary_concerns) && insights.summary.primary_concerns.length > 0 && (
              <>
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
              </>
            )}

            {/* Progress */}
            {Array.isArray(insights.summary?.progress) && insights.summary.progress.length > 0 && (
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
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {hasRecommendations && (
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
      )}
    </div>
  );
}