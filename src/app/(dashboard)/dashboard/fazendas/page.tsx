import Link from "next/link";
import { auth } from "@/lib/auth";
import { getFarmsByUser } from "@/services/farm.service";
import { Header } from "@/components/layout/header";
import { FarmCard } from "@/components/farms/farm-card";
import { Button } from "@/components/ui/button";
import { Plus, Tractor } from "lucide-react";

export default async function FazendasPage() {
  const session = await auth();
  const farms = session?.user
    ? await getFarmsByUser((session.user as any).id)
    : [];

  return (
    <>
      <Header title="Minhas Fazendas" breadcrumb={["Dashboard", "Fazendas"]} />
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[13px] text-gray-500">
              {farms.length} {farms.length === 1 ? "fazenda cadastrada" : "fazendas cadastradas"}
            </p>
          </div>
          <Link href="/dashboard/fazendas/nova">
            <Button size="sm" arrow>
              <Plus className="h-4 w-4" />
              Nova fazenda
            </Button>
          </Link>
        </div>

        {farms.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
            <Tractor className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 font-display text-[20px] font-bold text-dark-base">
              Nenhuma fazenda cadastrada
            </h3>
            <p className="mt-2 text-[14px] text-gray-500">
              Cadastre sua primeira propriedade e comece a acompanhar suas plantações.
            </p>
            <Link href="/dashboard/fazendas/nova" className="mt-6">
              <Button arrow>Cadastrar minha fazenda</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {farms.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
