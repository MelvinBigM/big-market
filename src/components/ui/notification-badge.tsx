
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  if (count <= 0) return null;
  
  return (
    <Badge 
      className={cn(
        "absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
