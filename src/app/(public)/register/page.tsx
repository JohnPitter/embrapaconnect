"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || undefined,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao cadastrar.");
        setLoading(false);
        return;
      }

      // Auto login após registro
      await signIn("credentials", {
        email: formData.get("email"),
        password,
        redirect: false,
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Erro interno. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-base px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-[28px] font-black text-lime-accent">
            EC.
          </Link>
          <h1 className="mt-4 font-display text-[24px] font-bold text-white">
            Criar conta
          </h1>
          <p className="mt-2 text-[14px] text-light-muted">
            Cadastre-se gratuitamente como produtor rural
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Nome completo"
            name="name"
            placeholder="João da Silva"
            required
            dark
          />
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
            label="Telefone (opcional)"
            name="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            dark
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            required
            dark
            autoComplete="new-password"
          />
          <Input
            label="Confirmar senha"
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
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-[13px] text-light-muted/70">
          Já tem conta?{" "}
          <Link href="/login" className="text-lime-accent hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
