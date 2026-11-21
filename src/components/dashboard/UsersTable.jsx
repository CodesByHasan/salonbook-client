"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import DetailList from "@/components/shared/DetailList";
import EmptyState from "@/components/shared/EmptyState";
import { setUserBlocked } from "@/lib/actions/users";
import { notify } from "@/lib/notify";
import { cn, formatDateTime } from "@/lib/utils";

const UserStatus = ({ blocked }) => (
  <Badge
    variant="secondary"
    className={cn(
      blocked
        ? "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300"
        : "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
    )}
  >
    {blocked ? "Blocked" : "Active"}
  </Badge>
);

export default function UsersTable({ users }) {
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [target, setTarget] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const user = target;
    startTransition(async () => {
      notify(await setUserBlocked(user._id, !user.isBlocked), router);
      setTarget(null);
    });
  }

  if (users.length === 0) {
    return <EmptyState icon={Users} title="No users found" />;
  }

  return (
    <>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="pl-4 font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="capitalize">{user.role === "admin" ? "Admin" : "Customer"}</TableCell>
                <TableCell><UserStatus blocked={user.isBlocked} /></TableCell>
                <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                <TableCell className="pr-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setDetails(user)}>Details</Button>
                    {user.role !== "admin" && (
                      <Button variant={user.isBlocked ? "default" : "destructive"} size="sm" onClick={() => setTarget(user)}>
                        {user.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!details} onOpenChange={(open) => !open && setDetails(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{details?.name}</DialogTitle>
            <DialogDescription>User details</DialogDescription>
          </DialogHeader>
          {details && (
            <DetailList
              items={[
                ["Email", details.email],
                ["Phone", details.phone || "—"],
                ["Role", details.role === "admin" ? "Admin" : "Customer"],
                ["Status", <UserStatus key="s" blocked={details.isBlocked} />],
                ["Joined", formatDateTime(details.createdAt)],
                ["User ID", details._id],
              ]}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title={target?.isBlocked ? "Unblock this user?" : "Block this user?"}
        description={
          target?.isBlocked
            ? `${target?.name} will be able to use the app again.`
            : `${target?.name} will immediately lose access to bookings and payments.`
        }
        confirmLabel={target?.isBlocked ? "Unblock" : "Block"}
        destructive={!target?.isBlocked}
        loading={isPending}
        onConfirm={handleToggle}
      />
    </>
  );
}