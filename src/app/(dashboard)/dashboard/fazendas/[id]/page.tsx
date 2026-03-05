import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getFarmById } from "@/services/farm.service";
import { Header } from "@/components/layout/header";
import { CardLight } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Sprout } from "lucide-react";

const CROP_LABELS: Record<string, string> = {
  SOJA: "Soja",
  MILHO: "Milho",
  CAFE: "Café",
  CANA: "Cana-de-açúcar",
  ALGODAO: "Algodão",
  TRIGO: "Trigo",
  ARROZ: "Arroz",
  FEIJAO: "Feijão",
  MANDIOCA: "Mandioca",
  OUTRO: "Outro",
};

const STAGE_LABELS: Record<string, string> = {
  PREPARO: "Preparo",
  PLANTIO: "Plantio",
  GERMINACAO: "Germinação",
  CRESCIMENTO: "Crescimento",
  FLORACAO: "Floração",
  FRUTIFICACAO: "Frutificação",
  MATURACAO: "Maturação",
  COLHEITA: "Colheita",
};

export default async function FazendaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) notFound();

  const { id } = await params;
  const farm = await getFarmById(id, (session.user as any).id);
  if (!farm) notFound();

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
              {farm.crops.length}
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

          {farm.crops.length === 0 ? (
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
            <div className="flex flex-col gap-3">
              {farm.crops.map((crop) => (
                <div
                  key={crop.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Sprout className="h-4 w-4 text-mid-green" />
                    <div>
                      <p className="font-medium text-dark-base">
                        {CROP_LABELS[crop.type] ?? crop.type}
                      </p>
                      <p className="text-[12px] text-gray-500">
                        {crop.areaHectares} ha &mdash; Plantado em{" "}
                        {new Date(crop.plantedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <Badge variant="lime">
                    {STAGE_LABELS[crop.currentStage] ?? crop.currentStage}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardLight>

        {/* Placeholder para 3D (será implementado na Task 8) */}
        <CardLight>
          <h2 className="mb-4 font-display text-[20px] font-bold text-dark-base">
            Visualização 3D
          </h2>
          <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-dark-base/5">
            <p className="text-[14px] text-gray-400">
              Visualização 3D — disponível após adicionar plantações
            </p>
          </div>
        </CardLight>
      </div>
    </>
  );
}
