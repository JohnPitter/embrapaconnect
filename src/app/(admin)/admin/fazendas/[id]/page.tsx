import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getCropsByFarm } from "@/services/crop.service";
import { getAvatarConfig } from "@/services/avatar.service";
import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";
import { MapPin, Sprout, MessageCircle, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CropCard } from "@/components/crops/crop-card";
import { DEFAULT_AVATAR } from "@/types/avatar";

const Farm3DSection = dynamic(
  () => import("@/components/farms/farm-3d-section").then((m) => ({ default: m.Farm3DSection })),
  { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse rounded-xl bg-white/5" /> }
);

const AvatarScene = dynamic(
  () => import("@/components/3d/avatar-scene").then((m) => ({ default: m.AvatarScene })),
  { ssr: false, loading: () => <div className="h-[240px] w-full animate-pulse rounded-xl bg-white/5" /> }
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminFazendaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const farm = await prisma.farm.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      crops: true,
    },
  });

  if (!farm) notFound();

  const [crops, avatarConfig] = await Promise.all([
    getCropsByFarm(id),
    getAvatarConfig(farm.userId),
  ]);

  return (
    <div className="min-h-screen bg-dark-base p-8">
      <div className="mb-6">
        <Link
          href="/admin/fazendas"
          className="mb-4 inline-flex items-center gap-2 text-[13px] text-light-muted/60 hover:text-lime-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Fazendas
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-lime-accent">
              Detalhes
            </p>
            <h1 className="mt-1 text-[28px] font-bold text-white font-display">
              {farm.name}
            </h1>
            <p className="flex items-center gap-1.5 text-[14px] text-light-muted/60">
              <MapPin className="h-4 w-4" />
              {farm.city}, {farm.state}
            </p>
          </div>
          <Link
            href={`/admin/chat?userId=${farm.userId}`}
            className="flex items-center gap-2 rounded-xl bg-lime-accent px-4 py-2.5 text-[13px] font-semibold text-dark-base transition-all hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" />
            Abrir Chat
          </Link>
        </div>
      </div>

      {/* Layout: Avatar + Info left, 3D right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Farmer info + Avatar */}
        <div className="flex flex-col gap-4">
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-accent/10">
                <User className="h-5 w-5 text-lime-accent" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white">{farm.user.name}</p>
                <p className="text-[12px] text-light-muted/60">{farm.user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 px-3 py-2.5">
                <p className="text-[11px] text-light-muted/60">Área Total</p>
                <p className="text-[16px] font-bold text-white">
                  {farm.totalAreaHectares ? `${farm.totalAreaHectares} ha` : "—"}
                </p>
              </div>
              <div className="rounded-lg bg-white/5 px-3 py-2.5">
                <p className="text-[11px] text-light-muted/60">Plantações</p>
                <p className="text-[16px] font-bold text-lime-accent">{crops.length}</p>
              </div>
            </div>
          </Card>
          {/* Avatar preview */}
          <Card>
            <p className="mb-3 text-[12px] font-medium uppercase tracking-wider text-light-muted/60">
              Avatar do Produtor
            </p>
            <AvatarScene config={avatarConfig ?? DEFAULT_AVATAR} height="240px" />
          </Card>
        </div>

        {/* Right: 3D farm */}
        <Card className="flex flex-col gap-3">
          <p className="text-[12px] font-medium uppercase tracking-wider text-light-muted/60">
            Visualização 3D
          </p>
          <div className="flex-1" style={{ minHeight: "400px" }}>
            <Farm3DSection crops={crops} />
          </div>
        </Card>
      </div>

      {/* Crops list */}
      {crops.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-4 text-[16px] font-semibold text-white">
            Plantações ({crops.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {crops.map((crop) => (
              <CropCard key={crop.id} crop={crop} />
            ))}
          </div>
        </div>
      )}

      {crops.length === 0 && (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-white/10 py-12">
          <Sprout className="mb-3 h-10 w-10 text-light-muted/30" />
          <p className="text-[14px] text-light-muted/40">Nenhuma plantação cadastrada</p>
        </div>
      )}
    </div>
  );
}
