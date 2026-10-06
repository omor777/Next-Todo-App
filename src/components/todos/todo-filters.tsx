"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TODO_FILTERS,
  isTodoFilter,
  type TodoFilter,
} from "@/lib/todos/filters";

type TodoFiltersProps = {
  counts: Record<TodoFilter, number>;
};

export function TodoFilters({ counts }: TodoFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requested = searchParams.get("filter");
  const value: TodoFilter = isTodoFilter(requested) ? requested : "all";

  const handleChange = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next === "all") {
      params.delete("filter");
    } else {
      params.set("filter", next);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <Tabs value={value} onValueChange={handleChange}>
      <TabsList>
        {TODO_FILTERS.map((f) => (
          <TabsTrigger key={f} value={f}>
            <span>{labelFor(f)}</span>
            <Badge variant="secondary">{counts[f]}</Badge>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function labelFor(filter: TodoFilter): string {
  switch (filter) {
    case "all":
      return "All";
    case "active":
      return "Active";
    case "completed":
      return "Completed";
  }
}
