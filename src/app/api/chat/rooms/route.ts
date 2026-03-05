import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrCreateRoomForFarmer, getAllRoomsForAdmin } from "@/services/chat.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role?: string }).role;

  if (role === "ADMIN") {
    const rooms = await getAllRoomsForAdmin();
    return NextResponse.json(rooms);
  }

  const room = await getOrCreateRoomForFarmer(userId);
  if (!room) {
    return NextResponse.json([], { status: 200 });
  }
  return NextResponse.json([room]);
}
