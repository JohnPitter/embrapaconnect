import { io, type Socket } from "socket.io-client";
import { getSession } from "next-auth/react";

let socket: Socket | null = null;

export async function getSocket(): Promise<Socket> {
  if (!socket) {
    const session = await getSession();
    const token = (session as any)?._token ?? "";

    socket = io({
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
