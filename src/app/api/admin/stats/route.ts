import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalFarms, totalFarmers, totalCrops, recentAlerts] = await Promise.all([
    prisma.farm.count(),
    prisma.user.count({ where: { role: "FARMER" } }),
    prisma.crop.count(),
    prisma.chatMessage.count({ where: { type: "ALERT" } }),
  ]);

  const farmsByState = await prisma.farm.groupBy({
    by: ["state"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  return NextResponse.json({
    totalFarms,
    totalFarmers,
    totalCrops,
    recentAlerts,
    farmsByState: farmsByState.map((s) => ({
      state: s.state,
      count: s._count.id,
    })),
  });
}
