"use client";

import { X, MapPin, Sprout, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { FarmMapMarker } from "@/types/map";
import { cn } from "@/lib/utils";

interface FarmPreviewPanelProps {
  farm: FarmMapMarker;
  onClose: () => void;
}

export function FarmPreviewPanel({ farm, onClose }: FarmPreviewPanelProps) {
  return (
    <div className="absolute right-4 top-4 z-10 w-72 animate-in slide-in-from-right-4 duration-300">
      <div className="rounded-xl border border-white/10 bg-dark-base/95 p-5 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-light-muted/60">
              Fazenda
            </p>
            <h3 className="text-[16px] font-bold text-white">{farm.name}</h3>
            <p className="text-[13px] text-light-muted">{farm.userName}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-light-muted/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Alert badge */}
        {farm.hasAlert && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-500/15 px-3 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <p className="text-[12px] font-medium text-red-400">Alerta ativo</p>
          </div>
        )}

        {/* Info */}
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-light-muted/50" />
            <span className="text-[13px] text-light-muted">
              {farm.city}, {farm.state}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sprout className="h-3.5 w-3.5 text-light-muted/50" />
            <span className="text-[13px] text-light-muted">
              {farm.totalCrops} plantação{farm.totalCrops !== 1 ? "ões" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                farm.hasAlert ? "bg-red-500" : "bg-lime-accent"
              )}
            />
            <span className="text-[13px] text-light-muted">
              {farm.hasAlert ? "Alerta ativo" : "Status normal"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/admin/fazendas/${farm.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-lime-accent px-3 py-2 text-[12px] font-semibold text-dark-base transition-all hover:brightness-110"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Detalhes
          </Link>
          <Link
            href={`/admin/chat?userId=${farm.userId}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-[12px] font-medium text-light-muted transition-all hover:bg-white/10 hover:text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
