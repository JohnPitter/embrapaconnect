import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllFarmsForMap } from "@/services/farm.service";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const farms = await getAllFarmsForMap();
  return NextResponse.json(farms);
}
