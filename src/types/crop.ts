import type { Crop, CropStage, CropType } from "@prisma/client";
import type { GrowthDataPoint } from "@/lib/crop-growth";

export type { Crop };

export interface CropWithGrowth extends Omit<Crop, "growthData"> {
  growthData: GrowthDataPoint[];
  currentGrowthPoint?: GrowthDataPoint;
}

export interface CreateCropInput {
  type: CropType;
  customTypeName?: string;
  areaHectares: number;
  plantedAt: string; // ISO date string from form
  notes?: string;
}

export interface UpdateCropInput {
  customTypeName?: string;
  areaHectares?: number;
  notes?: string;
  currentStage?: CropStage;
}

export const CROP_TYPE_LABELS: Record<CropType, string> = {
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

export const CROP_STAGE_LABELS: Record<CropStage, string> = {
  PREPARO: "Preparo do Solo",
  PLANTIO: "Plantio",
  GERMINACAO: "Germinação",
  CRESCIMENTO: "Crescimento",
  FLORACAO: "Floração",
  FRUTIFICACAO: "Frutificação",
  MATURACAO: "Maturação",
  COLHEITA: "Colheita",
};
