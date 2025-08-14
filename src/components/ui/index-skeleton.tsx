import { Skeleton } from "@/components/ui/skeleton";

export function IndexSkeleton() {
  return (
    <main className="relative flex flex-col items-center justify-center text-center py-12 px-4 animate-fade-up">
      {/* Title skeleton */}
      <div className="mb-3 animate-fade-up">
        <Skeleton className="h-12 md:h-14 w-80 md:w-96 mx-auto" />
      </div>
      
      {/* Subtitle skeleton */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <Skeleton className="h-5 w-64 md:w-80 mx-auto" />
      </div>
      
      {/* Main content area */}
      <div className="relative flex flex-col items-center gap-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        {/* Timer skeleton */}
        <Skeleton className="h-4 w-16 mb-1" />
        
        {/* Voice control circle */}
        <div className="h-28 w-28 rounded-full bg-muted animate-pulse mb-3" />
        
        {/* Caption area */}
        <div className="h-12 w-80 rounded-md border">
          <div className="px-3 py-2 flex items-center justify-center">
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </div>
      
      {/* Voice controls skeleton */}
      <div className="mt-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <div className="flex justify-center gap-3">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    </main>
  );
}