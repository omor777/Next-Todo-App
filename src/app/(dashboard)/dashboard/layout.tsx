import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { QueryProvider } from "@/lib/query-client";
import { Navbar } from "@/components/layout/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <QueryProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-5xl p-4 md:p-6">{children}</main>
      </div>
    </QueryProvider>
  );
}
