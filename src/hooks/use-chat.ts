"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Socket } from "socket.io-client";
import type { ChatMessage } from "@/types/chat";

interface UseChatOptions {
  roomId: string | null;
  socket: Socket | null;
  userId: string;
  userName: string;
}

export function useChat({ roomId, socket, userId, userName }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load initial messages
  useEffect(() => {
    if (!roomId) return;

    fetch(`/api/chat/rooms/${roomId}/messages`)
      .then((r) => r.json())
      .then((data: ChatMessage[]) => setMessages(data))
      .catch(console.error);
  }, [roomId]);

  // Join room and listen for new messages
  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("room:join", { roomId });

    socket.on("message:new", ({ message }: { message: ChatMessage }) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user:typing", () => {
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
    });

    return () => {
      socket.emit("room:leave", { roomId });
      socket.off("message:new");
      socket.off("user:typing");
    };
  }, [socket, roomId]);

  const sendMessage = useCallback(
    (content: string, type: string = "TEXT", alertCategory?: string) => {
      if (!socket || !roomId || !content.trim()) return;

      socket.emit("message:send", {
        roomId,
        content,
        type,
        alertCategory,
        senderName: userName,
      });

      // Also persist to DB
      fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type, alertCategory }),
      }).catch(console.error);
    },
    [socket, roomId, userName]
  );

  const sendTyping = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit("user:typing", { roomId });
  }, [socket, roomId]);

  return { messages, isTyping, sendMessage, sendTyping, userId };
}
