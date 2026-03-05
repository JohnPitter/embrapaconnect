import { Header } from "@/components/layout/header";
import { FarmForm } from "@/components/farms/farm-form";
import { CardLight } from "@/components/ui/card";
import { AnimateIn } from "@/components/ui/animate-in";

export default function NovaFazendaPage() {
  return (
    <>
      <Header title="Nova Fazenda" breadcrumb={["Dashboard", "Fazendas", "Nova"]} />
      <div className="p-8">
        <AnimateIn threshold={0}>
        <CardLight className="max-w-2xl">
          <h2 className="mb-2 font-display text-[22px] font-bold text-dark-base">
            Cadastrar fazenda
          </h2>
          <p className="mb-8 text-[14px] text-gray-500">
            Preencha os dados básicos da sua propriedade. Você poderá adicionar plantações depois.
          </p>
          <FarmForm />
        </CardLight>
        </AnimateIn>
      </div>
    </>
  );
}
