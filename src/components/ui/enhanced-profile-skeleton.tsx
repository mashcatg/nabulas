import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function EnhancedProfileSkeleton() {
  return (
    <div className="container mx-auto px-2 md:px-8 py-6 max-w-6xl space-y-6 animate-fade-up">
      {/* Profile header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center animate-fade-up">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2 ml-auto">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        {/* Chart section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="p-4">
              {/* Chart bars */}
              <div className="flex items-end justify-between h-32 gap-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <Skeleton className={`w-full bg-muted animate-pulse`} style={{ height: `${Math.random() * 80 + 20}%` }} />
                    <Skeleton className="h-3 w-6" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent conversations */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded border">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Health insights section */}
      <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2 p-3 rounded border bg-muted/20">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <Skeleton className="h-9 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}