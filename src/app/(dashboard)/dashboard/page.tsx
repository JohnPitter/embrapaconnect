import Link from "next/link";
import { auth } from "@/lib/auth";
import { getFarmsByUser } from "@/services/farm.service";
import { Header } from "@/components/layout/header";
import { CardLight } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FarmCard } from "@/components/farms/farm-card";
import { Tractor, Sprout, Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const farms = session?.user
    ? await getFarmsByUser((session.user as any).id)
    : [];

  const totalCrops = farms.reduce((acc, f) => acc + f.crops.length, 0);
  const totalArea = farms.reduce((acc, f) => acc + f.totalAreaHectares, 0);

  return (
    <>
      <Header
        title={`Olá, ${session?.user?.name?.split(" ")[0] ?? "Produtor"}`}
        breadcrumb={["Dashboard"]}
      />
      <div className="flex flex-col gap-8 p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CardLight>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-lime-accent/10 p-2.5">
                <Tractor className="h-5 w-5 text-mid-green" />
              </div>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider text-gray-400">
                  Fazendas
                </p>
                <p className="font-display text-2xl font-bold text-dark-base">{farms.length}</p>
              </div>
            </div>
          </CardLight>
          <CardLight>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-lime-accent/10 p-2.5">
                <Sprout className="h-5 w-5 text-mid-green" />
              </div>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider text-gray-400">
                  Plantações
                </p>
                <p className="font-display text-2xl font-bold text-dark-base">{totalCrops}</p>
              </div>
            </div>
          </CardLight>
          <CardLight>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-lime-accent/10 p-2.5">
                <Sprout className="h-5 w-5 text-mid-green" />
              </div>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider text-gray-400">
                  Área total
                </p>
                <p className="font-display text-2xl font-bold text-dark-base">
                  {totalArea.toFixed(0)} ha
                </p>
              </div>
            </div>
          </CardLight>
        </div>

        {/* Fazendas recentes */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[20px] font-bold text-dark-base">Minhas Fazendas</h2>
            <Link href="/dashboard/fazendas/nova">
              <Button size="sm" arrow>
                <Plus className="h-4 w-4" />
                Nova fazenda
              </Button>
            </Link>
          </div>
          {farms.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
              <Tractor className="h-10 w-10 text-gray-300" />
              <p className="mt-3 font-display text-[18px] font-bold text-dark-base">
                Comece cadastrando sua fazenda
              </p>
              <p className="mt-1 text-[14px] text-gray-500">
                Adicione sua propriedade e comece a acompanhar o crescimento.
              </p>
              <Link href="/dashboard/fazendas/nova" className="mt-6">
                <Button arrow>Cadastrar fazenda</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {farms.slice(0, 4).map((farm) => (
                <FarmCard key={farm.id} farm={farm} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
