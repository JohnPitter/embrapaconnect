import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";

const steps = [
  {
    number: "01",
    title: "Cadastre-se",
    description: "Crie sua conta gratuitamente como produtor rural. Monte seu avatar 3D personalizado.",
  },
  {
    number: "02",
    title: "Mapeie sua fazenda",
    description: "Desenhe o perímetro da propriedade no mapa e adicione suas plantações com data de plantio.",
  },
  {
    number: "03",
    title: "Acompanhe em tempo real",
    description: "Veja sua fazenda evoluir em 3D, arraste a timeline e comunique-se com a Embrapa.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-dark-green py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16 text-center">
          <SectionHeader
            label="Como Funciona"
            headline={
              <>
                Três passos para{" "}
                <span className="text-lime-accent">transformar</span>{" "}
                sua fazenda
              </>
            }
            description="Do cadastro ao acompanhamento científico em menos de 10 minutos."
            center
            dark
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col gap-4">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-6 bg-lime-accent/30 md:block translate-x-full" />
              )}
              <div className="rounded-2xl border border-white/10 bg-dark-base/50 p-8 backdrop-blur-sm">
                <span className="font-display text-[64px] font-black leading-none text-lime-accent/20">
                  {step.number}
                </span>
                <h3 className="mt-4 font-display text-[20px] font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-light-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/register">
            <Button variant="primary" size="lg" arrow>
              Começar agora
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
