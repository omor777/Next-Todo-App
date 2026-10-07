"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TodoSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [queryInput, setQueryInput] = useState(
    () => searchParams.get("q") ?? "",
  );
  const debouncedQuery = useDebouncedValue(queryInput, 300);

  // Write the debounced value to the URL. Legitimate effect —
  // synchronizing with an external system (the browser URL).
  useEffect(() => {
    const currentUrlQuery = searchParams.get("q") ?? "";
    if (debouncedQuery === currentUrlQuery) return;

    const nextParams = new URLSearchParams(searchParams.toString());

    if (debouncedQuery.trim() === "") {
      nextParams.delete("q");
    } else {
      nextParams.set("q", debouncedQuery);
    }

    const nextQueryString = nextParams.toString();
    router.replace(
      nextQueryString ? `${pathname}?${nextQueryString}` : pathname,
      { scroll: false },
    );
  }, [debouncedQuery, pathname, router, searchParams]);

  const handleClear = () => {
    setQueryInput("");
  };

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={queryInput}
        onChange={(event) => setQueryInput(event.target.value)}
        placeholder="Search todos..."
        className="pl-9 pr-9"
      />
      {queryInput.length > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          <X />
        </Button>
      )}
    </div>
  );
}
