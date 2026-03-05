import { prisma } from "@/lib/prisma";
import type { MessageType, AlertCategory } from "@prisma/client";

export async function getOrCreateRoomForFarm(farmId: string) {
  const existing = await prisma.chatRoom.findUnique({
    where: { farmId },
    include: {
      participants: { include: { user: { select: { id: true, name: true, role: true } } } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (existing) return existing;

  const room = await prisma.chatRoom.create({
    data: { farmId },
    include: {
      participants: { include: { user: { select: { id: true, name: true, role: true } } } },
      messages: { take: 1 },
    },
  });

  return room;
}

export async function getOrCreateRoomForFarmer(userId: string) {
  // Find the farmer's first farm and get/create its chat room
  const farm = await prisma.farm.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!farm) return null;

  return getOrCreateRoomForFarm(farm.id);
}

export async function getAllRoomsForAdmin() {
  return prisma.chatRoom.findMany({
    include: {
      farm: {
        include: {
          user: { select: { id: true, name: true, role: true } },
        },
      },
      participants: { include: { user: { select: { id: true, name: true, role: true } } } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRoomMessages(roomId: string, limit = 50) {
  return prisma.chatMessage.findMany({
    where: { roomId },
    include: {
      sender: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });
}

export async function canAccessRoom(
  roomId: string,
  userId: string,
  isAdmin: boolean
): Promise<boolean> {
  if (isAdmin) return true;
  const room = await prisma.chatRoom.findFirst({
    where: {
      id: roomId,
      farm: { userId },
    },
  });
  return room !== null;
}

export async function saveMessage(data: {
  roomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  alertCategory?: AlertCategory;
  imageUrl?: string;
}) {
  const message = await prisma.chatMessage.create({
    data: {
      roomId: data.roomId,
      senderId: data.senderId,
      content: data.content,
      type: data.type,
      alertCategory: data.alertCategory ?? null,
      imageUrl: data.imageUrl ?? null,
    },
    include: { sender: { select: { name: true } } },
  });

  return message;
}
