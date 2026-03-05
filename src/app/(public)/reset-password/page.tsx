"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimateIn } from "@/components/ui/animate-in";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/password-reset", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erro ao redefinir senha.");
    } else {
      router.push("/login?reset=success");
    }
  }

  if (!token) {
    return (
      <p className="text-center text-red-400">
        Link inválido. Solicite um novo link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Nova senha"
        name="password"
        type="password"
        placeholder="Mínimo 8 caracteres"
        required
        dark
        autoComplete="new-password"
      />
      <Input
        label="Confirmar nova senha"
        name="confirmPassword"
        type="password"
        placeholder="Repita a senha"
        required
        dark
        autoComplete="new-password"
      />
      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-[13px] text-red-400">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full" arrow>
        Redefinir senha
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-base px-6">
      <AnimateIn threshold={0} className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-[28px] font-black text-lime-accent">
            EC.
          </Link>
          <h1 className="mt-4 font-display text-[24px] font-bold text-white">
            Nova senha
          </h1>
          <p className="mt-2 text-[14px] text-light-muted">
            Digite e confirme sua nova senha.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="text-light-muted text-center">Carregando...</div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </AnimateIn>
    </div>
  );
}
