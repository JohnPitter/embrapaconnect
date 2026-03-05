"use client";

import { useState, useEffect, useCallback } from "react";

interface Farm {
  id: string;
  name: string;
  state: string;
  city: string;
  totalAreaHectares: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  crops: { id: string; type: string; currentStage: string }[];
}

export function useFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/farms");
      if (!res.ok) throw new Error("Erro ao carregar fazendas");
      const data = await res.json();
      setFarms(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { farms, loading, error, refetch: fetch_ };
}
