"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import dayjs from "@/lib/dayjs";

export function AccountInfo() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>You are not signed in.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formattedCreatedAt = dayjs(session.user.createdAt).format(
    "MMMM D, YYYY",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Your account details.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <AccountField label="Name" value={session.user.name} />
          <Separator />
          <AccountField label="Email" value={session.user.email} />
          <Separator />
          <AccountField label="User ID" value={session.user.id} />
          <Separator />
          <AccountField label="Member since" value={formattedCreatedAt} />
        </dl>
      </CardContent>
    </Card>
  );
}

type AccountFieldProps = {
  label: string;
  value: string;
};

function AccountField({ label, value }: AccountFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}
