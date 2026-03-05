import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllFarmsForMap } from "@/services/farm.service";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const BrazilMap = dynamic(
  () =>
    import("@/components/map/brazil-map").then((m) => ({
      default: m.BrazilMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-dark-base">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime-accent border-t-transparent" />
          <p className="text-[13px] text-light-muted">Carregando mapa...</p>
        </div>
      </div>
    ),
  }
);

export default async function MapaPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const farms = await getAllFarmsForMap();

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-dark-base px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-accent/10">
            <MapPin className="h-5 w-5 text-lime-accent" />
          </div>
          <div>
            <h1 className="font-display text-[18px] font-bold text-white">
              Mapa Geográfico
            </h1>
            <p className="text-[13px] text-light-muted">
              {farms.length} fazenda{farms.length !== 1 ? "s" : ""} mapeada
              {farms.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-lime-accent" />
            <span className="text-[12px] text-light-muted">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-[12px] text-light-muted">Alerta</span>
          </div>
        </div>
      </div>
      {/* Map fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <BrazilMap farms={farms} />
      </div>
    </div>
  );
}
