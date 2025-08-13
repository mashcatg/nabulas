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
    <div className="inline-flex items-center rounded-full border p-[3px]">
      {options.map((opt) => {
        const Icon = opt.icon;
        return (
          <Button
            key={opt.key}
            variant={theme === opt.key ? "default" : "ghost"}
            size="xs"
            className={`rounded-full px-[5px] py-[5px] transition-colors ${theme === opt.key ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"}`}
            onClick={() => setTheme(opt.key as any)}
            aria-pressed={theme === opt.key}
            aria-label={opt.label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
}
