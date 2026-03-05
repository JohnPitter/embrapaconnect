import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getFarmById } from "@/services/farm.service";
import { getCropsByFarm } from "@/services/crop.service";
import { Header } from "@/components/layout/header";
import { CardLight } from "@/components/ui/card";
import { CropCard } from "@/components/crops/crop-card";
import { Farm3DSection } from "@/components/farms/farm-3d-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Sprout } from "lucide-react";

export default async function FazendaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) notFound();

  const { id } = await params;
  const farm = await getFarmById(id, (session.user as { id: string }).id);
  if (!farm) notFound();

  const crops = await getCropsByFarm(id);

  return (
    <>
      <Header title={farm.name} breadcrumb={["Dashboard", "Fazendas", farm.name]} />
      <div className="flex flex-col gap-6 p-8">
        {/* Info geral */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <CardLight>
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-400">
              Localização
            </p>
            <p className="mt-2 flex items-center gap-1.5 font-semibold text-dark-base">
              <MapPin className="h-4 w-4 text-mid-green" />
              {farm.city}, {farm.state}
            </p>
          </CardLight>
          <CardLight>
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-400">
              Área Total
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-dark-base">
              {farm.totalAreaHectares.toFixed(0)}
              <span className="text-lg font-normal text-gray-400"> ha</span>
            </p>
          </CardLight>
          <CardLight>
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-400">
              Plantações
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-dark-base">
              {crops.length}
              <span className="text-lg font-normal text-gray-400"> culturas</span>
            </p>
          </CardLight>
        </div>

        {/* Plantações */}
        <CardLight>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-[20px] font-bold text-dark-base">Plantações</h2>
            <Link href={`/dashboard/fazendas/${farm.id}/plantacao/nova`}>
              <Button size="sm" arrow>
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </Link>
          </div>

          {crops.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Sprout className="h-10 w-10 text-gray-300" />
              <p className="mt-3 text-[14px] text-gray-500">
                Nenhuma plantação adicionada ainda.
              </p>
              <Link href={`/dashboard/fazendas/${farm.id}/plantacao/nova`} className="mt-4">
                <Button size="sm" arrow>
                  Adicionar plantação
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {crops.map((crop) => (
                <CropCard key={crop.id} crop={crop} />
              ))}
            </div>
          )}
        </CardLight>

        {/* Visualização 3D */}
        <CardLight>
          <h2 className="mb-4 font-display text-[20px] font-bold text-dark-base">
            Visualização 3D
          </h2>
          <div className="h-[500px]">
            <Farm3DSection crops={crops} />
          </div>
        </CardLight>
      </div>
    </>
  );
}
