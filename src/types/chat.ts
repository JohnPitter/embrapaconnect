import type { AlertCategory, MessageType } from "@prisma/client";

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: MessageType;
  alertCategory?: AlertCategory | null;
  imageUrl?: string | null;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  farmId: string;
  farmerName: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  hasActiveAlert?: boolean;
}

export const ALERT_CATEGORY_LABELS: Record<AlertCategory, string> = {
  INCENDIO: "Incêndio",
  PRAGA: "Praga",
  SECA: "Seca",
  OUTRO: "Outro",
};

export const ALERT_CATEGORY_COLORS: Record<AlertCategory, string> = {
  INCENDIO: "#EF4444",
  PRAGA: "#F97316",
  SECA: "#EAB308",
  OUTRO: "#8B5CF6",
};
