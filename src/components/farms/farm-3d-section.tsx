"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { TimelineSlider } from "@/components/3d/timeline-slider";
import { Sprout } from "lucide-react";

const FarmScene = dynamic(
  () =>
    import("@/components/3d/farm-scene").then((m) => ({
      default: m.FarmScene,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Sprout className="h-8 w-8 animate-pulse text-lime-accent" />
          <p className="text-[13px] text-light-muted">
            Carregando fazenda 3D...
          </p>
        </div>
      </div>
    ),
  },
);

interface GrowthPoint {
  day: number;
  percentage: number;
  stage: string;
}

interface CropData {
  id: string;
  type: string;
  plantedAt: Date | string;
  growthData: GrowthPoint[];
}

interface Farm3DSectionProps {
  crops: CropData[];
}

export function Farm3DSection({ crops }: Farm3DSectionProps) {
  const [currentDay, setCurrentDay] = useState(0);

  if (crops.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Sprout className="h-12 w-12 text-light-muted/40" />
          <p className="text-[14px] text-light-muted/60">
            Adicione uma plantação para ver a visualização 3D
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="min-h-0 flex-1">
        <FarmScene crops={crops} currentDay={currentDay} />
      </div>
      <TimelineSlider crops={crops} onDayChange={setCurrentDay} />
    </div>
  );
}
