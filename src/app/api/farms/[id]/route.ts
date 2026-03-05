import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFarmById, updateFarm, deleteFarm } from "@/services/farm.service";
import { z } from "zod";

const updateFarmSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  totalAreaHectares: z.number().positive().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const farm = await getFarmById(id, (session.user as any).id);
  if (!farm) return NextResponse.json({ error: "Fazenda não encontrada" }, { status: 404 });

  return NextResponse.json(farm);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateFarmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const farm = await updateFarm(id, (session.user as any).id, parsed.data);
    return NextResponse.json(farm);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  try {
    await deleteFarm(id, (session.user as any).id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao deletar" }, { status: 400 });
  }
}
