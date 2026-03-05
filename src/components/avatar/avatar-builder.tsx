"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { CardLight } from "@/components/ui/card";
import {
  DEFAULT_AVATAR,
  SKIN_TONES,
  EYE_COLORS,
  HAT_LABELS,
  GLASSES_LABELS,
  BODY_TYPE_LABELS,
  EYE_SHAPE_LABELS,
  type AvatarConfig,
} from "@/types/avatar";
import { Check, User, Eye, Shirt, Glasses, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

const AvatarScene = dynamic(
  () => import("@/components/3d/avatar-scene").then((m) => ({ default: m.AvatarScene })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] w-full animate-pulse rounded-xl bg-dark-green/30" />
    ),
  }
);

const TABS = [
  { id: "skin", label: "Pele", icon: User },
  { id: "eyes", label: "Olhos", icon: Eye },
  { id: "body", label: "Corpo", icon: Shirt },
  { id: "glasses", label: "Óculos", icon: Glasses },
  { id: "hat", label: "Chapéu", icon: HardHat },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface AvatarBuilderProps {
  initialConfig?: AvatarConfig | null;
}

export function AvatarBuilder({ initialConfig }: AvatarBuilderProps) {
  const { data: session } = useSession();
  const [config, setConfig] = useState<AvatarConfig>(initialConfig ?? DEFAULT_AVATAR);
  const [activeTab, setActiveTab] = useState<TabId>("skin");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!session?.user?.id) return;
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/users/${session.user.id}/avatar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 3D Preview */}
      <div className="flex flex-col gap-4">
        <AvatarScene config={config} height="380px" />
        <Button onClick={handleSave} loading={saving} className="w-full">
          {saved ? (
            <>
              <Check className="h-4 w-4" /> Avatar Salvo!
            </>
          ) : (
            "Salvar Avatar"
          )}
        </Button>
      </div>

      {/* Builder */}
      <CardLight className="flex flex-col gap-5 p-6">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium uppercase tracking-wider transition-all",
                activeTab === id
                  ? "bg-dark-base text-lime-accent shadow-sm"
                  : "text-gray-500 hover:text-dark-base"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Skin tab */}
        {activeTab === "skin" && (
          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500">
              Tom de Pele
            </p>
            <div className="flex flex-wrap gap-3">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setConfig({ ...config, skinTone: tone })}
                  className={cn(
                    "h-10 w-10 rounded-full border-2 transition-all hover:scale-110",
                    config.skinTone === tone
                      ? "border-lime-accent scale-110 ring-2 ring-lime-accent/30"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: tone }}
                  title={tone}
                />
              ))}
            </div>
          </div>
        )}

        {/* Eyes tab */}
        {activeTab === "eyes" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500">
                Formato dos Olhos
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  Object.entries(EYE_SHAPE_LABELS) as [
                    AvatarConfig["eyeShape"],
                    string,
                  ][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setConfig({ ...config, eyeShape: value })}
                    className={cn(
                      "rounded-xl border-2 px-3 py-2 text-[13px] font-medium transition-all",
                      config.eyeShape === value
                        ? "border-lime-accent bg-lime-accent/10 text-dark-base"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500">
                Cor dos Olhos
              </p>
              <div className="flex flex-wrap gap-3">
                {EYE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setConfig({ ...config, eyeColor: color })}
                    className={cn(
                      "h-9 w-9 rounded-full border-2 transition-all hover:scale-110",
                      config.eyeColor === color
                        ? "border-lime-accent scale-110 ring-2 ring-lime-accent/30"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Body tab */}
        {activeTab === "body" && (
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500">
              Tipo de Corpo
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                Object.entries(BODY_TYPE_LABELS) as [
                  AvatarConfig["bodyType"],
                  string,
                ][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setConfig({ ...config, bodyType: value })}
                  className={cn(
                    "rounded-xl border-2 px-3 py-3 text-[13px] font-medium transition-all",
                    config.bodyType === value
                      ? "border-lime-accent bg-lime-accent/10 text-dark-base"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Glasses tab */}
        {activeTab === "glasses" && (
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500">
              Óculos
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                Object.entries(GLASSES_LABELS) as [
                  AvatarConfig["glasses"],
                  string,
                ][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setConfig({ ...config, glasses: value })}
                  className={cn(
                    "rounded-xl border-2 px-3 py-2.5 text-[13px] font-medium transition-all",
                    config.glasses === value
                      ? "border-lime-accent bg-lime-accent/10 text-dark-base"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hat tab */}
        {activeTab === "hat" && (
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500">
              Chapéu
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                Object.entries(HAT_LABELS) as [AvatarConfig["hat"], string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setConfig({ ...config, hat: value })}
                  className={cn(
                    "rounded-xl border-2 px-3 py-2.5 text-[13px] font-medium transition-all",
                    config.hat === value
                      ? "border-lime-accent bg-lime-accent/10 text-dark-base"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardLight>
    </div>
  );
}
