import { SectionHeader } from "@/components/ui/section-header";
import { AnimateIn } from "@/components/ui/animate-in";
import {
  MapPin,
  Box,
  TrendingUp,
  User,
  MessageSquare,
  Map,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "Mapeamento Digital",
    description: "Desenhe o perímetro da sua propriedade no mapa e cadastre suas plantações com área e data de plantio.",
    icon: MapPin,
  },
  {
    number: "02",
    title: "Visualização 3D",
    description: "Veja sua fazenda em 3D com visual estilo Colheita Feliz — terreno, plantações e estruturas animadas.",
    icon: Box,
  },
  {
    number: "03",
    title: "Timeline Científica",
    description: "Arraste o slider para ver qualquer momento da evolução da plantação, baseado em ciclos reais da Embrapa.",
    icon: TrendingUp,
  },
  {
    number: "04",
    title: "Avatar Personalizado",
    description: "Monte seu boneco 3D com cor de pele, olhos, corpo, óculos e chapéu. Animado e único como você.",
    icon: User,
  },
  {
    number: "05",
    title: "Chat com a Embrapa",
    description: "Canal direto com especialistas para tirar dúvidas, enviar alertas de emergência e receber orientações.",
    icon: MessageSquare,
  },
  {
    number: "06",
    title: "Mapa do Brasil",
    description: "A Embrapa visualiza todas as fazendas no mapa real do Brasil, podendo acompanhar por estado e cidade.",
    icon: Map,
  },
];

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="bg-off-white py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16 flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <AnimateIn>
            <SectionHeader
              label="Funcionalidades"
              headline={
                <>
                  Tudo que você precisa para{" "}
                  <span className="relative">
                    <span className="relative z-10">modernizar</span>
                    <span className="absolute bottom-1 left-0 h-2 w-full bg-lime-accent/30" />
                  </span>{" "}
                  sua produção
                </>
              }
              className="max-w-xl"
            />
          </AnimateIn>
          <AnimateIn delay={150} from="right">
            <p className="max-w-xs text-[14px] leading-relaxed text-gray-500 md:text-right">
              Tecnologia de ponta adaptada para o campo brasileiro, com base em dados científicos da Embrapa.
            </p>
          </AnimateIn>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <AnimateIn key={feature.number} delay={i * 80}>
                <div className="group h-full rounded-xl border border-black/5 bg-white p-8 transition-all duration-200 hover:border-lime-accent/30 hover:shadow-md">
                  <div className="mb-6 flex items-start justify-between">
                    <span className="font-display text-[48px] font-black leading-none text-black/5 transition-colors group-hover:text-lime-accent/20">
                      {feature.number}
                    </span>
                    <div className="rounded-lg bg-lime-accent/10 p-2.5">
                      <Icon className="h-5 w-5 text-mid-green" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-display text-[17px] font-bold text-dark-base">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
