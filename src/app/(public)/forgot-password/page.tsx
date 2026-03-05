"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    await fetch("/api/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") }),
    });

    setLoading(false);
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-base px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-[28px] font-black text-lime-accent">
            EC.
          </Link>
          <h1 className="mt-4 font-display text-[24px] font-bold text-white">
            Esqueci minha senha
          </h1>
          <p className="mt-2 text-[14px] text-light-muted">
            Informe seu email para receber o link de redefinição.
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl bg-lime-accent/10 border border-lime-accent/30 p-6 text-center">
            <p className="text-[15px] font-semibold text-lime-accent">Email enviado!</p>
            <p className="mt-2 text-[13px] text-light-muted">
              Verifique sua caixa de entrada. O link expira em 1 hora.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-[13px] text-lime-accent hover:underline"
            >
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              dark
            />
            <Button type="submit" loading={loading} className="w-full" arrow>
              Enviar link de redefinição
            </Button>
            <Link
              href="/login"
              className="text-center text-[13px] text-light-muted hover:text-lime-accent transition-colors"
            >
              Voltar ao login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
