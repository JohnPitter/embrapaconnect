import { Header } from "@/components/layout/header";
import { CardLight } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      <Header title="Início" breadcrumb={["Dashboard"]} />
      <div className="p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {["Minhas Fazendas", "Próxima Colheita", "Alertas"].map((item) => (
            <CardLight key={item}>
              <p className="text-[12px] font-medium uppercase tracking-wider text-gray-400">{item}</p>
              <p className="mt-2 font-display text-3xl font-bold text-dark-base">—</p>
            </CardLight>
          ))}
        </div>
      </div>
    </>
  );
}
