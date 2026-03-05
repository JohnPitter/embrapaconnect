"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import type mapboxgl from "mapbox-gl";
import type { FarmMapMarker, AlertCategory } from "@/types/map";
import { FarmPreviewPanel } from "./farm-preview-panel";

interface BrazilMapProps {
  farms: FarmMapMarker[];
}

const ALERT_STYLES: Record<AlertCategory, { emoji: string; color: string; glow: string; label: string }> = {
  INCENDIO: { emoji: "🔥", color: "#EF4444", glow: "rgba(239,68,68,0.7)",  label: "Incêndio" },
  PRAGA:    { emoji: "🐛", color: "#F97316", glow: "rgba(249,115,22,0.7)", label: "Praga" },
  SECA:     { emoji: "☀️", color: "#EAB308", glow: "rgba(234,179,8,0.7)",  label: "Seca" },
  OUTRO:    { emoji: "⚠️", color: "#8B5CF6", glow: "rgba(139,92,246,0.7)", label: "Outro" },
};

function getAlertStyle(farm: FarmMapMarker) {
  if (!farm.hasAlert) {
    return { emoji: "", color: "#C6E832", glow: "rgba(198,232,50,0.4)" };
  }
  const cat = farm.alertCategory as AlertCategory | null;
  return cat ? ALERT_STYLES[cat] : { emoji: "⚠️", color: "#EF4444", glow: "rgba(239,68,68,0.6)" };
}

export function BrazilMap({ farms }: BrazilMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<FarmMapMarker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Init map — cleanup is at effect level, not inside .then()
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.warn("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN not set");
      return;
    }

    let cancelled = false;

    import("mapbox-gl").then(({ default: mapboxglLib }) => {
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      mapboxglLib.accessToken = token;

      const map = new mapboxglLib.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-51.9253, -14.235],
        zoom: 3.5,
        attributionControl: false,
      });

      mapRef.current = map;

      map.on("load", () => {
        if (cancelled) return;

        if (!map.getSource("estados")) {
          map.addSource("estados", {
            type: "geojson",
            data: "/geojson/estados.json",
          });
          map.addLayer({
            id: "estados-fill",
            type: "fill",
            source: "estados",
            paint: { "fill-color": "#1E2A14", "fill-opacity": 0.5 },
          });
          map.addLayer({
            id: "estados-outline",
            type: "line",
            source: "estados",
            paint: { "line-color": "#4A5C2E", "line-width": 1 },
          });
        }

        setMapLoaded(true);
      });
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapLoaded(false);
    };
  }, []);

  // Add/update markers whenever map is loaded or farms change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    import("mapbox-gl").then(({ default: mapboxglLib }) => {
      const map = mapRef.current;
      if (!map) return;

      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      farms.forEach((farm) => {
        if (farm.latitude == null || farm.longitude == null) return;

        const { emoji, color, glow } = getAlertStyle(farm);

        // wrapper: Mapbox applies its own transform here for positioning
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "cursor:pointer;";

        // icon element — scales on hover without breaking Mapbox positioning
        const el = document.createElement("div");
        el.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${farm.hasAlert ? "30px" : "14px"};
          height: ${farm.hasAlert ? "30px" : "14px"};
          border-radius: 50%;
          background: ${color};
          border: 2px solid white;
          font-size: ${farm.hasAlert ? "16px" : "0"};
          line-height: 1;
          transition: transform 0.15s ease;
          box-shadow: 0 0 8px ${glow};
        `;
        if (farm.hasAlert) el.textContent = emoji;
        wrapper.appendChild(el);

        wrapper.addEventListener("mouseenter", () => { el.style.transform = "scale(1.25)"; });
        wrapper.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });
        wrapper.addEventListener("click", () => {
          setSelectedFarm(farm);
          const targetZoom = Math.max(map.getZoom(), 8);
          map.flyTo({ center: [farm.longitude, farm.latitude], zoom: targetZoom, duration: 800 });
        });

        const marker = new mapboxglLib.Marker(wrapper)
          .setLngLat([farm.longitude, farm.latitude])
          .addTo(map);

        markersRef.current.push(marker);
      });
    });
  }, [mapLoaded, farms]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-base/80">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime-accent border-t-transparent" />
            <p className="text-[13px] text-light-muted">Carregando mapa...</p>
          </div>
        </div>
      )}
      {selectedFarm && (
        <FarmPreviewPanel farm={selectedFarm} onClose={() => setSelectedFarm(null)} />
      )}
    </div>
  );
}
