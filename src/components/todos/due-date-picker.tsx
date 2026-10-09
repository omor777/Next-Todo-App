"use client";

import { useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import dayjs from "@/lib/dayjs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DueDatePickerProps = {
  value: string | null;
  onChange: (nextValue: string | null) => void;
};

export function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedDate = value ? dayjs(value).toDate() : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(null);
    } else {
      // Normalize to end of day so date-only selections don't shift backward
      onChange(dayjs(date).endOf("day").toISOString());
    }
    setIsOpen(false);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(null);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={<Button variant="outline" className="w-48 justify-start" />}
      >
        <CalendarIcon />
        {value ? dayjs(value).format("MMM D, YYYY") : <span>Due date</span>}
        {value && (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleClear(event as unknown as React.MouseEvent);
              }
            }}
            className="ml-auto"
          >
            <X />
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
