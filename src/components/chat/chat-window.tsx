"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import type { ChatMessage } from "@/types/chat";

interface ChatWindowProps {
  roomId: string;
  messages: ChatMessage[];
  currentUserId: string;
  isTyping?: boolean;
  onSend: (content: string, type?: string, alertCategory?: string) => void;
  onTyping?: () => void;
  disabled?: boolean;
}

export function ChatWindow({
  messages,
  currentUserId,
  isTyping,
  onSend,
  onTyping,
  disabled,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-[14px] text-gray-400">
              Nenhuma mensagem ainda. Inicie uma conversa!
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === currentUserId}
          />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 px-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-[12px] text-gray-400">digitando...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={onSend} onTyping={onTyping} disabled={disabled} />
    </div>
  );
}
