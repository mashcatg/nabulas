import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function EnhancedChatSkeleton() {
  return (
    <div className="container mx-auto px-2 md:px-4 py-6 max-w-6xl space-y-6 animate-fade-up">
      {/* Header section with title and actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between animate-fade-up">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-8 w-3/4 md:w-1/2" />
          <Skeleton className="h-4 w-1/2 md:w-1/3" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Skeleton className="h-9 w-full sm:w-32" />
          <Skeleton className="h-9 w-full sm:w-24" />
        </div>
      </div>

      {/* Stats cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        {/* Left column - Audio player and summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio player card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="flex items-center justify-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>

        {/* Right column - Transcript */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${i % 2 === 0 ? 'bg-muted' : 'bg-primary/10'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className={`h-4 ${i % 3 === 0 ? 'w-32' : i % 3 === 1 ? 'w-24' : 'w-40'}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}