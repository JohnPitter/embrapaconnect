import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllFarmsForAdmin } from "@/services/farm.service";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const farms = await getAllFarmsForAdmin();
  return NextResponse.json(farms);
}
