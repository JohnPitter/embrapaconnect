import { NextRequest, NextResponse } from "next/server";
import {
  createPasswordResetToken,
  validateAndUseResetToken,
} from "@/services/password-reset.service";
import { sendPasswordResetEmail } from "@/lib/resend";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validators";

// POST /api/password-reset — solicitar reset
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const rawToken = await createPasswordResetToken(parsed.data.email);

    if (rawToken) {
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`;
      await sendPasswordResetEmail(parsed.data.email, resetUrl);
    }

    // Sempre retornar sucesso (não revelar se email existe)
    return NextResponse.json({
      message: "Se o email existir, você receberá um link em breve.",
    });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// PUT /api/password-reset — confirmar nova senha
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const result = await validateAndUseResetToken(
      parsed.data.token,
      parsed.data.password
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: "Senha redefinida com sucesso." });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
