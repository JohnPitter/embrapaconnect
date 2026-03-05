import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRoomMessages, saveMessage } from "@/services/chat.service";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1).max(2000),
  type: z.enum(["TEXT", "IMAGE", "ALERT"]).default("TEXT"),
  alertCategory: z.enum(["INCENDIO", "PRAGA", "SECA", "OUTRO"]).optional(),
  imageUrl: z.string().url().optional(),
});

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await getRoomMessages(params.id);
  return NextResponse.json(
    messages.map((m) => ({
      id: m.id,
      roomId: m.roomId,
      senderId: m.senderId,
      senderName: m.sender.name ?? "Usuário",
      content: m.content,
      type: m.type,
      alertCategory: m.alertCategory,
      imageUrl: m.imageUrl,
      createdAt: m.createdAt.toISOString(),
    }))
  );
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const body = await req.json();
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const message = await saveMessage({
    roomId: params.id,
    senderId: userId,
    content: parsed.data.content,
    type: parsed.data.type,
    alertCategory: parsed.data.alertCategory,
    imageUrl: parsed.data.imageUrl,
  });

  return NextResponse.json(
    {
      id: message.id,
      roomId: message.roomId,
      senderId: message.senderId,
      senderName: message.sender.name ?? "Usuário",
      content: message.content,
      type: message.type,
      alertCategory: message.alertCategory,
      imageUrl: message.imageUrl,
      createdAt: message.createdAt.toISOString(),
    },
    { status: 201 }
  );
}
