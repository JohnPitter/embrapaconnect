import { CardLight } from "@/components/ui/card";
import { CropStageBadge } from "./crop-stage-badge";
import { CROP_TYPE_LABELS } from "@/types/crop";
import type { CropWithGrowth } from "@/types/crop";
import { Sprout, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CropCardProps {
  crop: CropWithGrowth;
}

export function CropCard({ crop }: CropCardProps) {
  const growthPoint = crop.currentGrowthPoint ?? crop.growthData[0];
  const progressPct = growthPoint?.percentage ?? 0;
  const plantedDate = new Date(crop.plantedAt).toLocaleDateString("pt-BR");
  const harvestDate = crop.estimatedHarvestAt
    ? new Date(crop.estimatedHarvestAt).toLocaleDateString("pt-BR")
    : null;

  const displayName = crop.customTypeName ?? CROP_TYPE_LABELS[crop.type];
  const typeLabel = CROP_TYPE_LABELS[crop.type];

  return (
    <CardLight className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-accent/10">
            <Sprout className="h-5 w-5 text-lime-700" />
          </div>
          <div>
            <p className="font-semibold text-dark-base text-[14px]">{displayName}</p>
            {crop.customTypeName && (
              <p className="text-[12px] text-gray-500">{typeLabel}</p>
            )}
          </div>
        </div>
        <CropStageBadge stage={crop.currentStage} />
      </div>

      {/* Progress bar */}
      <div>
        <div className="mb-1 flex justify-between text-[12px]">
          <span className="text-gray-500">Crescimento</span>
          <span className="font-medium text-dark-base">{progressPct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              progressPct >= 100 ? "bg-green-500" : "bg-lime-accent"
            )}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <MapPin className="h-3.5 w-3.5" />
          <span>{crop.areaHectares} ha</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>Plantio: {plantedDate}</span>
        </div>
        {harvestDate && (
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>Colheita prev.: {harvestDate}</span>
          </div>
        )}
      </div>
    </CardLight>
  );
}
