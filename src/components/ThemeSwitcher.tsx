import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const options: { key: string; label: string; icon: any }[] = [
    { key: "light", label: "Light", icon: Sun },
    { key: "dark", label: "Dark", icon: Moon },
    { key: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="inline-flex items-center rounded-full border p-[2px] h-8">
      {options.map((opt) => {
        const Icon = opt.icon;
        return (
        <Button
          key={opt.key}
          variant={theme === opt.key ? "secondary" : "ghost"}
          size="sm"
          className={`rounded-full px-[3px] py-[3px] h-6 w-6 transition-colors ${theme === opt.key ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
            onClick={() => setTheme(opt.key as any)}
            aria-pressed={theme === opt.key}
            aria-label={opt.label}
          >
            <Icon className="h-3 w-3" />
          </Button>
        );
      })}
    </div>
  );
}
