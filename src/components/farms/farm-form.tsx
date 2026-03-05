"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

interface FarmFormProps {
  onSuccess?: (farmId: string) => void;
}

export function FarmForm({ onSuccess }: FarmFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      state: formData.get("state") as string,
      city: formData.get("city") as string,
      address: (formData.get("address") as string) || undefined,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
      totalAreaHectares: parseFloat(formData.get("totalAreaHectares") as string),
    };

    try {
      const res = await fetch("/api/farms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar fazenda.");
        return;
      }

      if (onSuccess) {
        onSuccess(data.id);
      } else {
        router.push(`/dashboard/fazendas/${data.id}`);
      }
    } catch {
      setError("Erro interno. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
      <Input label="Nome da fazenda" name="name" placeholder="Fazenda Santa Maria" required />
      <Input label="Descrição (opcional)" name="description" placeholder="Breve descrição da propriedade" />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium uppercase tracking-wider text-gray-600">
            Estado
          </label>
          <select
            name="state"
            required
            className="rounded-full border border-gray-200 bg-white px-6 py-3 text-[14px] text-dark-base outline-none focus:ring-2 focus:ring-lime-accent/50"
          >
            <option value="">Selecionar</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <Input label="Cidade" name="city" placeholder="São Paulo" required />
      </div>

      <Input label="Endereço (opcional)" name="address" placeholder="Rodovia BR-101, km 45" />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Latitude" name="latitude" type="number" step="any" placeholder="-21.1775" required />
        <Input label="Longitude" name="longitude" type="number" step="any" placeholder="-47.8103" required />
      </div>

      <Input
        label="Área total (hectares)"
        name="totalAreaHectares"
        type="number"
        step="0.01"
        placeholder="150"
        required
      />

      <p className="text-[12px] text-gray-500">
        Use o Google Maps para obter latitude e longitude: clique com o botão direito no mapa e copie as coordenadas.
      </p>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-[13px] text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} arrow>
        Salvar fazenda
      </Button>
    </form>
  );
}
