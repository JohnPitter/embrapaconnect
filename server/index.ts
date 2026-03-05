import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import next from "next";
import { parse } from "url";
import { decode } from "next-auth/jwt";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT ?? "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
      credentials: true,
    },
  });

  // Track online users: socketId -> userId
  const onlineUsers = new Map<string, string>();

  io.on("connection", async (socket) => {
    const token = socket.handshake.auth?.token as string | undefined;
    let userId: string | undefined;

    if (token) {
      try {
        const decoded = await decode({
          token,
          secret: process.env.NEXTAUTH_SECRET ?? "dev-secret",
          salt: "authjs.session-token",
        });
        userId = decoded?.sub ?? undefined;
      } catch {
        // Invalid token — proceed without userId
      }
    }

    if (userId) {
      onlineUsers.set(socket.id, userId);
    }

    socket.on("room:join", ({ roomId }: { roomId: string }) => {
      socket.join(`room:${roomId}`);
    });

    socket.on("room:leave", ({ roomId }: { roomId: string }) => {
      socket.leave(`room:${roomId}`);
    });

    socket.on(
      "message:send",
      ({
        roomId,
        content,
        type,
        alertCategory,
        senderName,
      }: {
        roomId: string;
        content: string;
        type: string;
        alertCategory?: string;
        senderName: string;
      }) => {
        const message = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          roomId,
          senderId: userId ?? "",
          senderName,
          content,
          type,
          alertCategory: alertCategory ?? null,
          imageUrl: null,
          createdAt: new Date().toISOString(),
        };

        io.to(`room:${roomId}`).emit("message:new", { message });

        if (type === "ALERT") {
          io.emit("alert:new", { roomId, category: alertCategory });
        }
      }
    );

    socket.on("user:typing", ({ roomId }: { roomId: string }) => {
      socket.to(`room:${roomId}`).emit("user:typing", { userId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
