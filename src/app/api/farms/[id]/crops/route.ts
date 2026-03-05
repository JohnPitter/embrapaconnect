import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCropsByFarm, createCrop } from "@/services/crop.service";
import { getFarmById } from "@/services/farm.service";
import { z } from "zod";

const createCropSchema = z.object({
  type: z.enum([
    "SOJA",
    "MILHO",
    "CAFE",
    "CANA",
    "ALGODAO",
    "TRIGO",
    "ARROZ",
    "FEIJAO",
    "MANDIOCA",
    "OUTRO",
  ]),
  customTypeName: z.string().max(100).optional(),
  areaHectares: z.number().positive(),
  plantedAt: z.string().datetime(),
  notes: z.string().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const farm = await getFarmById(id, (session.user as { id: string }).id);
  if (!farm) {
    return NextResponse.json({ error: "Fazenda não encontrada" }, { status: 404 });
  }

  const crops = await getCropsByFarm(id);
  return NextResponse.json(crops);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const farm = await getFarmById(id, (session.user as { id: string }).id);
  if (!farm) {
    return NextResponse.json({ error: "Fazenda não encontrada" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = createCropSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const crop = await createCrop(id, parsed.data);
  return NextResponse.json(crop, { status: 201 });
}
