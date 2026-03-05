"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useChat } from "@/hooks/use-chat";
import { ChatWindow } from "@/components/chat/chat-window";
import { MessageCircle, Wifi, WifiOff, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomParticipant {
  user: { id: string; name: string | null; role: string };
}

interface RoomMessage {
  content: string;
  createdAt: string;
}

interface Room {
  id: string;
  participants: RoomParticipant[];
  messages: RoomMessage[];
}

export default function AdminChatPage() {
  const { data: session } = useSession();
  const { socket, connected } = useSocket();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const userId = (session?.user as { id?: string })?.id ?? "";

  useEffect(() => {
    fetch("/api/chat/rooms")
      .then((r) => r.json())
      .then((data: Room[]) => {
        setRooms(data);
        if (data[0]) setSelectedRoom(data[0]);
      })
      .catch(console.error);
  }, []);

  const { messages, isTyping, sendMessage, sendTyping } = useChat({
    roomId: selectedRoom?.id ?? null,
    socket,
    userId,
    userName: "Embrapa",
  });

  const getFarmerName = (room: Room) =>
    room.participants.find((p) => p.user.role === "FARMER")?.user.name ?? "Fazendeiro";

  return (
    <div className="flex h-screen">
      {/* Room list */}
      <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-white/5 bg-dark-base">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-lime-accent" />
            <h2 className="text-[14px] font-semibold text-white">Conversas</h2>
            <span className="ml-auto rounded-full bg-lime-accent/20 px-2 py-0.5 text-[11px] font-medium text-lime-accent">
              {rooms.length}
            </span>
          </div>
        </div>
        <div className="p-2">
          {rooms.map((room) => {
            const lastMsg = room.messages[0];
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={cn(
                  "w-full rounded-xl p-3 text-left transition-all",
                  selectedRoom?.id === room.id ? "bg-lime-accent/10" : "hover:bg-white/5"
                )}
              >
                <p
                  className={cn(
                    "text-[13px] font-medium",
                    selectedRoom?.id === room.id ? "text-lime-accent" : "text-white"
                  )}
                >
                  {getFarmerName(room)}
                </p>
                {lastMsg && (
                  <p className="mt-0.5 truncate text-[12px] text-light-muted/60">
                    {lastMsg.content}
                  </p>
                )}
              </button>
            );
          })}
          {rooms.length === 0 && (
            <p className="p-4 text-center text-[13px] text-light-muted/40">
              Nenhuma conversa
            </p>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-lime-700" />
            <h1 className="text-[16px] font-bold text-dark-base">
              {selectedRoom ? getFarmerName(selectedRoom) : "Central de Chat"}
            </h1>
          </div>
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

        {selectedRoom ? (
          <ChatWindow
            roomId={selectedRoom.id}
            messages={messages}
            currentUserId={userId}
            isTyping={isTyping}
            onSend={sendMessage}
            onTyping={sendTyping}
            disabled={!connected}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[14px] text-gray-400">Selecione uma conversa</p>
          </div>
        )}
      </div>
    </div>
  );
}
