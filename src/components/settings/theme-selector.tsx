"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

type ThemeValue = (typeof THEME_OPTIONS)[number]["value"];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);

  // next-themes can only read the actual theme after mount.
  // Before mount, `theme` is undefined on the server and on first client render.
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Choose how the app looks. System follows your device setting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {THEME_OPTIONS.map((option) => {
            const IconComponent = option.icon;
            const isActive = hasMounted && theme === option.value;

            return (
              <Button
                key={option.value}
                variant={isActive ? "secondary" : "outline"}
                onClick={() => setTheme(option.value)}
                disabled={!hasMounted}
              >
                <IconComponent />
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
