"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardLight } from "@/components/ui/card";
import { CROP_TYPE_LABELS } from "@/types/crop";
import type { CropType } from "@prisma/client";

interface CropFormProps {
  farmId: string;
}

const CROP_TYPES = Object.entries(CROP_TYPE_LABELS) as [CropType, string][];

export function CropForm({ farmId }: CropFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    type: "SOJA" as CropType,
    customTypeName: "",
    areaHectares: "",
    plantedAt: new Date().toISOString().split("T")[0],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/farms/${farmId}/crops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          ...(form.customTypeName.trim() && { customTypeName: form.customTypeName.trim() }),
          areaHectares: parseFloat(form.areaHectares),
          plantedAt: new Date(form.plantedAt).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(
          typeof data.error === "string"
            ? data.error
            : "Erro ao registrar plantação"
        );
        return;
      }

      router.push(`/dashboard/fazendas/${farmId}`);
      router.refresh();
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardLight className="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium uppercase tracking-wider text-gray-600">
            Cultura
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as CropType })}
            className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm text-dark-base outline-none focus:ring-2 focus:ring-lime-accent/50"
            required
          >
            {CROP_TYPES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {form.type === "OUTRO" && (
          <Input
            label="Nome da Cultura"
            placeholder="Ex: Girassol, Sorgo..."
            value={form.customTypeName}
            onChange={(e) => setForm({ ...form, customTypeName: e.target.value })}
          />
        )}

        <Input
          label="Área (hectares)"
          type="number"
          step="0.1"
          min="0.1"
          placeholder="Ex: 25.5"
          value={form.areaHectares}
          onChange={(e) => setForm({ ...form, areaHectares: e.target.value })}
          required
        />

        <Input
          label="Data de Plantio"
          type="date"
          value={form.plantedAt}
          onChange={(e) => setForm({ ...form, plantedAt: e.target.value })}
          required
        />

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>
            Registrar Plantação
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => router.push(`/dashboard/fazendas/${farmId}`)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </CardLight>
  );
}
