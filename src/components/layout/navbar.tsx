"use client";

import { ListTodo, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserMenu } from "./user-menu";

const navItems = [
  { href: "/dashboard", label: "Todos" },
  { href: "/dashboard/stats", label: "Stats" },
  { href: "/dashboard/settings", label: "Settings" },
];


export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <ListTodo />
          <span className="font-semibold">Todo</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button
              nativeButton={false}
              key={item.href}
              render={<Link href={item.href} />}
              variant={pathname === item.href ? "secondary" : "ghost"}
              size="sm"
            >
              {" "}
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <UserMenu />
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    render={<Link href={item.href}>{item.label}</Link>}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setOpen(false)}
                  ></Button>
                ))}
              </nav>

              <Separator />

              <div className="px-4">
                <UserMenu />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
