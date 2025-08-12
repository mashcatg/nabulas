import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");
  return initials || "NA";
}

export function AvatarWithFallback({ name, src }: { name: string; src?: string }) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={src} alt={name} className="object-cover" />
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
