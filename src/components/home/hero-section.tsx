import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatBlock } from "@/components/ui/stat-block";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-56px)] bg-dark-base overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-lime-accent/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-mid-green/20 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center justify-center gap-8 px-6 py-24 md:flex-row md:items-center md:gap-16 md:py-32">
        {/* Left — Headline + CTA */}
        <div className="flex flex-1 flex-col gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-lime-accent/30 bg-lime-accent/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-accent animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lime-accent">
              Plataforma Digital Agrícola
            </span>
          </div>

          <h1 className="font-display text-[56px] font-black uppercase leading-[0.92] tracking-tight text-white md:text-[72px] lg:text-[80px]">
            CONECTE SUA{" "}
            <span className="text-lime-accent">FAZENDA</span>{" "}
            À{" "}
            <span className="text-lime-accent">EMBRAPA</span>
          </h1>

          <p className="max-w-lg text-[15px] leading-relaxed text-light-muted">
            Mapeie sua propriedade, acompanhe o crescimento das plantações em 3D
            com base em pesquisas científicas e comunique-se diretamente com
            especialistas da Embrapa.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" arrow>
                Cadastre-se gratuitamente
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outlined" size="lg">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Right — Stats */}
        <div className="flex flex-shrink-0 flex-col gap-8 md:items-end">
          <div className="rounded-2xl border border-white/10 bg-dark-green p-8 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-8">
              <StatBlock value="500+" label="Fazendas cadastradas" accent />
              <StatBlock value="27" label="Estados cobertos" />
              <StatBlock value="9" label="Culturas suportadas" accent />
              <StatBlock value="98%" label="Satisfação" />
            </div>
          </div>

          {/* Culturas tags */}
          <div className="flex flex-wrap gap-2 justify-end">
            {["Soja", "Milho", "Café", "Cana", "Algodão", "Trigo", "Arroz", "Feijão", "Mandioca"].map((c) => (
              <span key={c} className="rounded-full bg-tag-bg px-3 py-1 text-[11px] font-medium text-tag-text">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[11px] uppercase tracking-widest text-white">Explorar</span>
        <div className="h-8 w-px bg-white/30" />
      </div>
    </section>
  );
}
