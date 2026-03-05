import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllFarmsForAdmin } from "@/services/farm.service";
import { AnimateIn } from "@/components/ui/animate-in";
import { MapPin, Sprout, Eye } from "lucide-react";
import Link from "next/link";

export default async function AdminFazendasPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const farms = await getAllFarmsForAdmin();

  return (
    <div className="min-h-screen bg-dark-base p-8">
      <AnimateIn threshold={0} delay={0}>
        <div className="mb-8">
          <p className="text-[11px] font-medium uppercase tracking-widest text-lime-accent">
            Gestão
          </p>
          <h1 className="mt-1 text-[28px] font-bold text-white font-display">
            Fazendas
          </h1>
          <p className="text-[14px] text-light-muted/60">
            {farms.length} propriedade{farms.length !== 1 ? "s" : ""} cadastrada{farms.length !== 1 ? "s" : ""}
          </p>
        </div>
      </AnimateIn>

      <AnimateIn threshold={0} delay={120}>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-light-muted/60">Fazenda</th>
                <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-light-muted/60">Localização</th>
                <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-light-muted/60">Área</th>
                <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-light-muted/60">Plantações</th>
                <th className="px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-light-muted/60">Ações</th>
              </tr>
            </thead>
            <tbody>
              {farms.map((farm) => (
                <tr
                  key={farm.id}
                  className="border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-accent/10">
                        <MapPin className="h-4 w-4 text-lime-accent" />
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-white">{farm.name}</p>
                        <p className="text-[12px] text-light-muted/60">ID: {farm.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[14px] text-light-muted">{farm.city}, {farm.state}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[14px] text-light-muted">
                      {farm.totalAreaHectares ? `${farm.totalAreaHectares} ha` : "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Sprout className="h-3.5 w-3.5 text-lime-accent/60" />
                      <span className="text-[14px] text-light-muted">
                        {farm.crops?.length ?? 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/fazendas/${farm.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-lime-accent/10 px-3 py-1.5 text-[12px] font-medium text-lime-accent transition-all hover:bg-lime-accent/20"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
              {farms.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[14px] text-light-muted/40">
                    Nenhuma fazenda cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AnimateIn>
    </div>
  );
}
