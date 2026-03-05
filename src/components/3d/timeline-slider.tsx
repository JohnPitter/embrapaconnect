"use client";

import { useState, useMemo } from "react";

interface GrowthPoint {
  day: number;
  percentage: number;
  stage: string;
}

interface CropData {
  plantedAt: Date | string;
  growthData: GrowthPoint[];
}

interface TimelineSliderProps {
  crops: CropData[];
  onDayChange: (day: number) => void;
}

const STAGE_LABELS: Record<string, string> = {
  PREPARO: "Preparo do Solo",
  PLANTIO: "Plantio",
  GERMINACAO: "Germinação",
  CRESCIMENTO: "Crescimento",
  FLORACAO: "Floração",
  FRUTIFICACAO: "Frutificação",
  MATURACAO: "Maturação",
  COLHEITA: "Colheita",
};

export function TimelineSlider({ crops, onDayChange }: TimelineSliderProps) {
  const maxDays = useMemo(() => {
    if (!crops.length) return 120;
    const allPoints = crops.flatMap((c) => c.growthData);
    return Math.max(...allPoints.map((p) => p.day), 120);
  }, [crops]);

  const [currentDay, setCurrentDay] = useState(0);

  const primaryCrop = crops[0];
  const growthData = primaryCrop?.growthData ?? [];
  const currentPoint = growthData[currentDay] ?? growthData[0];

  const plantedDate = primaryCrop
    ? new Date(primaryCrop.plantedAt).toLocaleDateString("pt-BR")
    : "—";

  const estimatedHarvest = primaryCrop
    ? new Date(
        new Date(primaryCrop.plantedAt).getTime() + maxDays * 86400000,
      ).toLocaleDateString("pt-BR")
    : "—";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = Number(e.target.value);
    setCurrentDay(day);
    onDayChange(day);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-dark-base/90 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-light-muted">
            {currentPoint
              ? (STAGE_LABELS[currentPoint.stage] ?? currentPoint.stage)
              : "—"}
          </p>
          <p className="text-[15px] font-semibold text-white">
            Dia {currentDay}{" "}
            <span className="text-light-muted/60">/ {maxDays}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-light-muted">Colheita estimada</p>
          <p className="text-[13px] font-medium text-lime-accent">
            {estimatedHarvest}
          </p>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={maxDays}
        value={currentDay}
        onChange={handleChange}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-lime-accent"
        aria-label="Timeline do crescimento"
      />

      <div className="mt-1.5 flex justify-between">
        <span className="text-[11px] text-light-muted/60">{plantedDate}</span>
        <span className="text-[11px] text-light-muted/60">
          {estimatedHarvest}
        </span>
      </div>

      {currentPoint && (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-lime-accent transition-all duration-300"
              style={{ width: `${currentPoint.percentage}%` }}
            />
          </div>
          <span className="text-[12px] font-semibold text-lime-accent">
            {currentPoint.percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}
