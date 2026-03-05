import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAvatarConfig, saveAvatarConfig } from "@/services/avatar.service";
import { z } from "zod";

const avatarSchema = z.object({
  skinTone: z.string(),
  eyeShape: z.enum(["round", "almond", "large", "small"]),
  eyeColor: z.string(),
  bodyType: z.enum(["slim", "medium", "robust"]),
  glasses: z.enum(["none", "round", "square", "aviator"]),
  hat: z.enum(["none", "straw", "cap", "cangaceiro", "cowboy"]),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || session.user.id !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getAvatarConfig(id);
  return NextResponse.json(config ?? {});
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || session.user.id !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = avatarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await saveAvatarConfig(id, parsed.data);
  return NextResponse.json({ success: true });
}
