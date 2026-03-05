import { cn } from "@/lib/utils";
import type { CropStage } from "@prisma/client";
import { CROP_STAGE_LABELS } from "@/types/crop";

const STAGE_COLORS: Record<CropStage, string> = {
  PREPARO: "bg-gray-100 text-gray-700",
  PLANTIO: "bg-amber-100 text-amber-700",
  GERMINACAO: "bg-yellow-100 text-yellow-700",
  CRESCIMENTO: "bg-lime-100 text-lime-700",
  FLORACAO: "bg-pink-100 text-pink-700",
  FRUTIFICACAO: "bg-orange-100 text-orange-700",
  MATURACAO: "bg-emerald-100 text-emerald-700",
  COLHEITA: "bg-green-100 text-green-800",
};

interface CropStageBadgeProps {
  stage: CropStage;
  className?: string;
}

export function CropStageBadge({ stage, className }: CropStageBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        STAGE_COLORS[stage],
        className
      )}
    >
      {CROP_STAGE_LABELS[stage]}
    </span>
  );
}
