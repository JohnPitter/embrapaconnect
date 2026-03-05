import Link from "next/link";
import { MapPin, Sprout, ArrowRight } from "lucide-react";
import { CardLight } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const CROP_LABELS: Record<string, string> = {
  SOJA: "Soja",
  MILHO: "Milho",
  CAFE: "Café",
  CANA: "Cana",
  ALGODAO: "Algodão",
  TRIGO: "Trigo",
  ARROZ: "Arroz",
  FEIJAO: "Feijão",
  MANDIOCA: "Mandioca",
  OUTRO: "Outro",
};

interface FarmCardProps {
  farm: {
    id: string;
    name: string;
    state: string;
    city: string;
    totalAreaHectares: number;
    crops: { id: string; type: string; currentStage: string }[];
  };
}

export function FarmCard({ farm }: FarmCardProps) {
  return (
    <CardLight className="group flex flex-col gap-4 hover:border-lime-accent/40">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-[18px] font-bold text-dark-base">{farm.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            {farm.city}, {farm.state}
          </p>
        </div>
        <span className="rounded-full bg-lime-accent/10 px-3 py-1 text-[12px] font-semibold text-mid-green">
          {farm.totalAreaHectares.toFixed(0)} ha
        </span>
      </div>

      {farm.crops.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {farm.crops.slice(0, 4).map((crop) => (
            <Badge key={crop.id} variant="lime">
              <Sprout className="mr-1 h-3 w-3" />
              {CROP_LABELS[crop.type] ?? crop.type} — {STAGE_LABELS[crop.currentStage] ?? crop.currentStage}
            </Badge>
          ))}
          {farm.crops.length > 4 && (
            <Badge>+{farm.crops.length - 4}</Badge>
          )}
        </div>
      )}

      {farm.crops.length === 0 && (
        <p className="text-[13px] text-gray-400">Nenhuma plantação cadastrada.</p>
      )}

      <Link
        href={`/dashboard/fazendas/${farm.id}`}
        className="mt-auto flex items-center gap-2 text-[13px] font-medium text-mid-green transition-colors hover:text-dark-base group-hover:gap-3"
      >
        Ver fazenda em 3D <ArrowRight className="h-4 w-4 transition-all" />
      </Link>
    </CardLight>
  );
}
