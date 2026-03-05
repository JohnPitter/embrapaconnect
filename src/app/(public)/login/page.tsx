"use client";

import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou senha inválidos.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
          dark
          autoComplete="email"
        />
        <Input
          label="Senha"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          dark
          autoComplete="current-password"
        />

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-[13px] text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} className="w-full" arrow>
          Entrar
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3 text-center">
        <Link
          href="/forgot-password"
          className="text-[13px] text-light-muted hover:text-lime-accent transition-colors"
        >
          Esqueci minha senha
        </Link>
        <p className="text-[13px] text-light-muted/70">
          Não tem conta?{" "}
          <Link href="/register" className="text-lime-accent hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-base px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-[28px] font-black text-lime-accent">
            EC.
          </Link>
          <h1 className="mt-4 font-display text-[24px] font-bold text-white">
            Entrar na plataforma
          </h1>
          <p className="mt-2 text-[14px] text-light-muted">
            Acesse sua conta para continuar
          </p>
        </div>

        <Suspense fallback={<div className="text-light-muted text-center">Carregando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
