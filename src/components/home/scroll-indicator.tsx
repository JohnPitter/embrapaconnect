"use client";

import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  function handleClick() {
    document.getElementById("funcionalidades")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Rolar para funcionalidades"
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 hover:opacity-80 transition-opacity duration-300 cursor-pointer group"
    >
      <span className="text-[11px] uppercase tracking-widest text-white">Explorar</span>
      <ChevronDown
        className="h-5 w-5 text-white animate-bounce"
        strokeWidth={1.5}
      />
    </button>
  );
}
