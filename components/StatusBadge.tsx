import React from "react";
import { Badge } from "./Badge";

type ConnectionStatus =
  | "idle"
  | "initializing"
  | "ready"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

interface StatusBadgeProps {
  status: ConnectionStatus;
}

const statusConfig: Record<
  ConnectionStatus,
  { text: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" }
> = {
  idle: { text: "Idle", variant: "secondary" },
  initializing: { text: "Initializing...", variant: "secondary" },
  ready: { text: "Ready to Connect", variant: "default" },
  connecting: { text: "Connecting...", variant: "warning" },
  connected: { text: "Connected", variant: "success" },
  disconnected: { text: "Disconnected", variant: "destructive" },
  error: { text: "Error", variant: "destructive" },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { text, variant } = statusConfig[status];
  return <Badge variant={variant}>{text}</Badge>;
};