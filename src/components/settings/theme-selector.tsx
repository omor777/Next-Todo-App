"use client";

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

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

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
            const isActive = theme === option.value;

            return (
              <Button
                key={option.value}
                variant={isActive ? "secondary" : "outline"}
                onClick={() => setTheme(option.value)}
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
