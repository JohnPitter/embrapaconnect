import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFarmsByUser, createFarm } from "@/services/farm.service";
import { z } from "zod";

const createFarmSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  state: z.string().min(2),
  city: z.string().min(2),
  address: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  totalAreaHectares: z.number().positive(),
  boundaryCoords: z.record(z.any()).optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const farms = await getFarmsByUser((session.user as any).id);
  return NextResponse.json(farms);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const parsed = createFarmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const farm = await createFarm((session.user as any).id, parsed.data);
  return NextResponse.json(farm, { status: 201 });
}
