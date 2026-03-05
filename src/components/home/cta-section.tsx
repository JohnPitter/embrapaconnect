"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/ui/animate-in";

export function CtaSection() {
  return (
    <section id="contato" className="bg-dark-base py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="relative overflow-hidden rounded-3xl bg-dark-green border border-white/10 px-8 py-16 text-center md:px-16 md:py-24">
          {/* Background decorations */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime-accent/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-mid-green/30 blur-3xl" />
          </div>

          <AnimateIn>
            <div className="relative z-10">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-lime-accent">
                Junte-se a nós
              </p>
              <h2 className="font-display text-[40px] font-black uppercase leading-tight tracking-tight text-white md:text-[56px]">
                PRONTO PARA{" "}
                <span className="text-lime-accent">TRANSFORMAR</span>{" "}
                SUA FAZENDA?
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-light-muted">
                Cadastre-se gratuitamente e conecte sua propriedade à rede de
                suporte científico da Embrapa.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="/register">
                  <Button variant="primary" size="lg" arrow>
                    Cadastrar fazenda agora
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outlined" size="lg">
                    Já tenho conta
                  </Button>
                </Link>
              </div>

              <p className="mt-6 text-[12px] text-light-muted/50">
                Gratuito para produtores rurais. Suporte da Embrapa incluído.
              </p>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
