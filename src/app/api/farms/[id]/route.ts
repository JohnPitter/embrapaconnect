import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFarmById, updateFarm, deleteFarm } from "@/services/farm.service";

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
  try {
    const farm = await updateFarm(id, (session.user as any).id, body);
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
