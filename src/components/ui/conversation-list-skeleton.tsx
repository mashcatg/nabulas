import { Skeleton } from "@/components/ui/skeleton";

export function ConversationListSkeleton() {
  return (
    <div className="space-y-2 px-2 animate-fade-up">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="flex items-center gap-3 p-2 rounded-md animate-fade-up" 
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {/* Icon placeholder */}
          <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
          
          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            <Skeleton className={`h-3 ${i % 3 === 0 ? 'w-24' : i % 3 === 1 ? 'w-32' : 'w-20'}`} />
            <Skeleton className="h-2 w-16" />
          </div>
          
          {/* Time */}
          <Skeleton className="h-2 w-8 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}