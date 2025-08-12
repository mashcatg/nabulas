import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const options: { key: string; label: string }[] = [
    { key: "light", label: "Light" },
    { key: "dark", label: "Dark" },
    { key: "system", label: "System" },
  ];

  return (
    <div className="inline-flex items-center rounded-full border p-0.5">
      {options.map((opt) => (
        <Button
          key={opt.key}
          variant={theme === opt.key ? "secondary" : "ghost"}
          size="sm"
          className={`rounded-full px-3 transition-colors ${theme === opt.key ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"}`}
          onClick={() => setTheme(opt.key as any)}
          aria-pressed={theme === opt.key}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
