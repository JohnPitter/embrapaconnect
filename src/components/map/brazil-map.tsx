"use client";

import { useEffect, useRef, useState } from "react";
import type mapboxgl from "mapbox-gl";
import type { FarmMapMarker } from "@/types/map";
import { FarmPreviewPanel } from "./farm-preview-panel";

interface BrazilMapProps {
  farms: FarmMapMarker[];
}

export function BrazilMap({ farms }: BrazilMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<FarmMapMarker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.warn("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN not set — map will not load");
      return;
    }

    // Dynamic import to avoid SSR issues
    import("mapbox-gl").then(({ default: mapboxglLib }) => {
      if (!mapContainerRef.current) return;
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
        // Add Brazil states GeoJSON
        map.addSource("estados", {
          type: "geojson",
          data: "/geojson/estados.json",
        });
        map.addLayer({
          id: "estados-fill",
          type: "fill",
          source: "estados",
          paint: {
            "fill-color": "#1E2A14",
            "fill-opacity": 0.5,
          },
        });
        map.addLayer({
          id: "estados-outline",
          type: "line",
          source: "estados",
          paint: {
            "line-color": "#4A5C2E",
            "line-width": 1,
          },
        });

        setMapLoaded(true);
      });

      return () => {
        map.remove();
        mapRef.current = null;
      };
    });
  }, []);

  // Add markers when map is loaded and farms change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    import("mapbox-gl").then(({ default: mapboxglLib }) => {
      const map = mapRef.current;
      if (!map) return;

      farms.forEach((farm) => {
        if (!farm.latitude || !farm.longitude) return;

        const el = document.createElement("div");
        el.style.cssText = `
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${farm.hasAlert ? "#EF4444" : "#C6E832"};
          border: 2px solid white;
          cursor: pointer;
          transition: transform 0.15s ease;
          box-shadow: 0 0 8px ${farm.hasAlert ? "rgba(239,68,68,0.6)" : "rgba(198,232,50,0.4)"};
        `;
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.6)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
        });
        el.addEventListener("click", () => {
          setSelectedFarm(farm);
          map.flyTo({
            center: [farm.longitude, farm.latitude],
            zoom: 8,
            duration: 1200,
          });
        });

        new mapboxglLib.Marker(el)
          .setLngLat([farm.longitude, farm.latitude])
          .addTo(map);
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
        <FarmPreviewPanel
          farm={selectedFarm}
          onClose={() => setSelectedFarm(null)}
        />
      )}
    </div>
  );
}
