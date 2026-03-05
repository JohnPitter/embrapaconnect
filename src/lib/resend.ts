import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  // Em dev, apenas loga (sem chamar Resend com key inválida)
  if (
    process.env.RESEND_API_KEY === "re_dev" ||
    !process.env.RESEND_API_KEY?.startsWith("re_")
  ) {
    console.log(`[DEV] Password reset URL para ${email}: ${resetUrl}`);
    return;
  }

  await resend.emails.send({
    from: "EmbrapaConnect <noreply@embrapaconnect.com.br>",
    to: email,
    subject: "Redefinição de senha — EmbrapaConnect",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <h2 style="color:#1A1F0F;">Redefinir senha</h2>
        <p style="color:#555;">Clique no link abaixo para redefinir sua senha. O link expira em 1 hora.</p>
        <a href="${resetUrl}"
          style="display:inline-block;background:#C6E832;color:#1A1F0F;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:700;margin:16px 0;">
          Redefinir senha →
        </a>
        <p style="color:#999;font-size:13px;margin-top:24px;">
          Se você não solicitou isso, ignore este email.
        </p>
      </div>
    `,
  });
}
