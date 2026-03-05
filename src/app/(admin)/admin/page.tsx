import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { StatBlock } from "@/components/ui/stat-block";
import { getAllFarmsForAdmin } from "@/services/farm.service";
import { AnimateIn } from "@/components/ui/animate-in";
import { MapPin, Users, Sprout, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const [totalFarms, totalFarmers, totalCrops, totalAlerts, recentFarms] =
    await Promise.all([
      prisma.farm.count(),
      prisma.user.count({ where: { role: "FARMER" } }),
      prisma.crop.count(),
      prisma.chatMessage.count({ where: { type: "ALERT" } }),
      getAllFarmsForAdmin(),
    ]);

  const farmsByState = await prisma.farm.groupBy({
    by: ["state"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-dark-base p-8">
      <AnimateIn threshold={0} delay={0}>
        <div className="mb-8">
          <p className="text-[11px] font-medium uppercase tracking-widest text-lime-accent">
            Painel Embrapa
          </p>
          <h1 className="mt-1 text-[28px] font-bold text-white font-display">
            Dashboard
          </h1>
        </div>
      </AnimateIn>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: MapPin, label: "Fazendas", value: String(totalFarms), sub: "Total mapeadas", accent: true },
          { icon: Users, label: "Produtores", value: String(totalFarmers), sub: "Cadastrados", accent: true },
          { icon: Sprout, label: "Plantações", value: String(totalCrops), sub: "Ativas", accent: false },
          { icon: AlertTriangle, label: "Alertas", value: String(totalAlerts), sub: "Registrados", accent: false },
        ].map(({ icon: Icon, label, value, sub, accent }, i) => (
          <AnimateIn key={label} threshold={0} delay={i * 70}>
            <Card className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-light-muted/60">
                <Icon className="h-4 w-4" />
                <span className="text-[12px] uppercase tracking-wider">{label}</span>
              </div>
              <StatBlock value={value} label={sub} accent={accent} />
            </Card>
          </AnimateIn>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent farms */}
        <AnimateIn threshold={0} delay={320}>
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-white">Fazendas Recentes</h2>
              <Link href="/admin/fazendas" className="text-[12px] text-lime-accent hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {recentFarms.slice(0, 5).map((farm) => (
                <Link
                  key={farm.id}
                  href={`/admin/fazendas/${farm.id}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
                >
                  <div>
                    <p className="text-[14px] font-medium text-white">{farm.name}</p>
                    <p className="text-[12px] text-light-muted/60">{farm.city}, {farm.state}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-lime-accent/15 px-2 py-0.5 text-[11px] text-lime-accent">
                      {farm.state}
                    </span>
                  </div>
                </Link>
              ))}
              {recentFarms.length === 0 && (
                <p className="py-4 text-center text-[13px] text-light-muted/40">
                  Nenhuma fazenda cadastrada
                </p>
              )}
            </div>
          </Card>
        </AnimateIn>

        {/* Farms by state */}
        <AnimateIn threshold={0} delay={400}>
          <Card>
            <div className="mb-4">
              <h2 className="text-[16px] font-semibold text-white">Fazendas por Estado</h2>
            </div>
            <div className="flex flex-col gap-3">
              {farmsByState.map((item) => {
                const maxCount = farmsByState[0]?._count.id ?? 1;
                const pct = (item._count.id / maxCount) * 100;
                return (
                  <div key={item.state} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-light-muted">{item.state}</span>
                      <span className="text-[13px] font-medium text-white">{item._count.id}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-lime-accent transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {farmsByState.length === 0 && (
                <p className="py-4 text-center text-[13px] text-light-muted/40">
                  Sem dados
                </p>
              )}
            </div>
          </Card>
        </AnimateIn>
      </div>
    </div>
  );
}
