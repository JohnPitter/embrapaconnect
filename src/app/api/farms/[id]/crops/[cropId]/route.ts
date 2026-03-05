import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCropById, updateCrop, deleteCrop } from "@/services/crop.service";
import { getFarmById } from "@/services/farm.service";
import { z } from "zod";

const updateCropSchema = z.object({
  customTypeName: z.string().max(100).optional(),
  areaHectares: z.number().positive().optional(),
  currentStage: z
    .enum([
      "PREPARO",
      "PLANTIO",
      "GERMINACAO",
      "CRESCIMENTO",
      "FLORACAO",
      "FRUTIFICACAO",
      "MATURACAO",
      "COLHEITA",
    ])
    .optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; cropId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id, cropId } = await params;
  const farm = await getFarmById(id, (session.user as { id: string }).id);
  if (!farm) {
    return NextResponse.json({ error: "Fazenda não encontrada" }, { status: 404 });
  }

  const crop = await getCropById(cropId, id);
  if (!crop) {
    return NextResponse.json({ error: "Plantação não encontrada" }, { status: 404 });
  }

  return NextResponse.json(crop);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; cropId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id, cropId } = await params;
  const farm = await getFarmById(id, (session.user as { id: string }).id);
  if (!farm) {
    return NextResponse.json({ error: "Fazenda não encontrada" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateCropSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const crop = await updateCrop(cropId, id, parsed.data);
  if (!crop) {
    return NextResponse.json({ error: "Plantação não encontrada" }, { status: 404 });
  }

  return NextResponse.json(crop);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; cropId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id, cropId } = await params;
  const farm = await getFarmById(id, (session.user as { id: string }).id);
  if (!farm) {
    return NextResponse.json({ error: "Fazenda não encontrada" }, { status: 404 });
  }

  const deleted = await deleteCrop(cropId, id);
  if (!deleted) {
    return NextResponse.json({ error: "Plantação não encontrada" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
