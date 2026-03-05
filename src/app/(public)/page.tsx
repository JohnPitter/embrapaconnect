import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center bg-dark-base px-6 text-center">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-light-muted/70">
        Plataforma Digital Agrícola
      </p>
      <h1 className="font-display text-[64px] font-black uppercase leading-none tracking-tight text-white md:text-[80px]">
        CONECTE SUA{" "}
        <span className="text-lime-accent">FAZENDA</span>{" "}
        AO FUTURO
      </h1>
      <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-light-muted">
        Plataforma digital que aproxima produtores rurais brasileiros da Embrapa com visualização 3D,
        acompanhamento científico e comunicação em tempo real.
      </p>
      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link href="/register">
          <Button variant="primary" size="lg" arrow>
            Cadastre-se gratuitamente
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outlined" size="lg">
            Entrar na plataforma
          </Button>
        </Link>
      </div>
    </section>
  );
}
