import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";
import { ALERT_CATEGORY_LABELS, ALERT_CATEGORY_COLORS } from "@/types/chat";
import type { AlertCategory } from "@prisma/client";
import { AlertTriangle } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (message.type === "ALERT") {
    const alertColor = message.alertCategory
      ? ALERT_CATEGORY_COLORS[message.alertCategory as AlertCategory]
      : "#EF4444";
    const alertLabel = message.alertCategory
      ? ALERT_CATEGORY_LABELS[message.alertCategory as AlertCategory]
      : "Alerta";

    return (
      <div className="flex justify-center py-2">
        <div
          className="flex w-full max-w-sm flex-col gap-2 rounded-xl border p-3"
          style={{ borderColor: alertColor + "40", backgroundColor: alertColor + "15" }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" style={{ color: alertColor }} />
            <span
              className="text-[12px] font-bold uppercase tracking-wider"
              style={{ color: alertColor }}
            >
              {alertLabel}
            </span>
            <span className="ml-auto text-[11px] text-gray-400">{time}</span>
          </div>
          <p className="text-[13px] text-gray-700">{message.content}</p>
          <p className="text-[11px] text-gray-400">— {message.senderName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", isOwn ? "items-end" : "items-start")}>
      {!isOwn && (
        <p className="px-3 text-[11px] font-medium text-gray-500">{message.senderName}</p>
      )}
      <div
        className={cn(
          "max-w-xs rounded-2xl px-4 py-2.5 text-[14px] lg:max-w-sm",
          isOwn
            ? "rounded-br-sm bg-lime-accent text-dark-base"
            : "rounded-bl-sm bg-gray-100 text-gray-800"
        )}
      >
        {message.content}
      </div>
      <p className={cn("px-3 text-[11px] text-gray-400", isOwn ? "text-right" : "text-left")}>
        {time}
      </p>
    </div>
  );
}
