"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ActiveUsersProps {
  users: any[];
}

export function ActiveUsers({ users }: ActiveUsersProps) {
  if (users.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-card border rounded-lg p-2 shadow-lg">
      <span className="text-sm text-muted-foreground">Active:</span>
      <div className="flex -space-x-2">
        {users.map((user, index) => (
          <Avatar
            key={index}
            className="border-2 border-background"
            style={{ borderColor: user.user.color }}
          >
            <AvatarFallback
              style={{ backgroundColor: user.user.color + "40" }}
              className="text-xs"
            >
              {user.user.name?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span className="text-sm font-medium">{users.length}</span>
    </div>
  );
}