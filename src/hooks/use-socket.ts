"use client";

import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

export function useSocket() {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const userId = (session?.user as { id?: string } | undefined)?.id;

  useEffect(() => {
    if (!userId) return;

    import("@/lib/socket").then(async ({ getSocket }) => {
      const sock = await getSocket();
      socketRef.current = sock;

      sock.on("connect", () => setConnected(true));
      sock.on("disconnect", () => setConnected(false));
      setConnected(sock.connected);
    });

    return () => {
      socketRef.current?.off("connect");
      socketRef.current?.off("disconnect");
    };
  }, [userId]);

  return { socket: socketRef.current, connected };
}
