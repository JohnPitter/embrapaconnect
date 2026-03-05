import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFarmById } from "@/services/farm.service";
import { CropForm } from "@/components/crops/crop-form";
import { Header } from "@/components/layout/header";
import { Sprout, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NovaPlantacaoPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const farm = await getFarmById(id, (session.user as { id: string }).id);
  if (!farm) redirect("/dashboard/fazendas");

  return (
    <>
      <Header
        title="Nova Plantação"
        breadcrumb={["Dashboard", "Fazendas", farm.name, "Nova Plantação"]}
      />
      <div className="p-8">
        <div className="mb-8">
          <Link
            href={`/dashboard/fazendas/${id}`}
            className="mb-4 inline-flex items-center gap-2 text-[13px] text-gray-500 hover:text-dark-base transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para {farm.name}
          </Link>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-accent/10">
              <Sprout className="h-5 w-5 text-lime-700" />
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-dark-base font-display">
                Nova Plantação
              </h1>
              <p className="text-[14px] text-gray-500">{farm.name}</p>
            </div>
          </div>
        </div>
        <CropForm farmId={id} />
      </div>
    </>
  );
}
