"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useChat } from "@/hooks/use-chat";
import { ChatWindow } from "@/components/chat/chat-window";
import { MessageCircle, Wifi, WifiOff } from "lucide-react";

interface Room {
  id: string;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const { socket, connected } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);

  const userId = (session?.user as { id?: string })?.id ?? "";
  const userName = session?.user?.name ?? "Fazendeiro";

  useEffect(() => {
    if (!userId) return;
    fetch("/api/chat/rooms")
      .then((r) => r.json())
      .then((rooms: Room[]) => {
        if (rooms[0]) setRoom(rooms[0]);
      })
      .catch(console.error);
  }, [userId]);

  const { messages, isTyping, sendMessage, sendTyping } = useChat({
    roomId: room?.id ?? null,
    socket,
    userId,
    userName,
  });

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-accent/10">
            <MessageCircle className="h-5 w-5 text-lime-700" />
          </div>
          <div>
            <h1 className="font-display text-[18px] font-bold text-dark-base">
              Chat Embrapa
            </h1>
            <div className="flex items-center gap-1.5">
              {connected ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span className="text-[12px] text-green-600">Conectado</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-gray-400" />
                  <span className="text-[12px] text-gray-400">Desconectado</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden bg-white">
        {room ? (
          <ChatWindow
            roomId={room.id}
            messages={messages}
            currentUserId={userId}
            isTyping={isTyping}
            onSend={sendMessage}
            onTyping={sendTyping}
            disabled={!connected}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-lime-accent border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
