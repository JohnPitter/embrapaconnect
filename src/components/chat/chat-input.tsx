"use client";

import { useState, useRef } from "react";
import { Send, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertCategory } from "@prisma/client";
import { ALERT_CATEGORY_LABELS } from "@/types/chat";

interface ChatInputProps {
  onSend: (content: string, type?: string, alertCategory?: string) => void;
  onTyping?: () => void;
  disabled?: boolean;
}

const ALERT_CATEGORIES = Object.keys(ALERT_CATEGORY_LABELS) as AlertCategory[];

export function ChatInput({ onSend, onTyping, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [alertMode, setAlertMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (alertMode && selectedCategory) {
      onSend(trimmed, "ALERT", selectedCategory);
      setAlertMode(false);
      setSelectedCategory(null);
    } else {
      onSend(trimmed, "TEXT");
    }
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-gray-100 bg-white p-4">
      {/* Alert category selector */}
      {alertMode && (
        <div className="mb-3 flex flex-wrap gap-2">
          {ALERT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-full px-3 py-1 text-[12px] font-medium transition-all",
                selectedCategory === cat
                  ? "bg-red-500 text-white"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              )}
            >
              {ALERT_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Alert toggle */}
        <button
          onClick={() => {
            setAlertMode(!alertMode);
            setSelectedCategory(null);
          }}
          className={cn(
            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all",
            alertMode
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          )}
          title="Enviar alerta"
        >
          {alertMode ? <X className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
        </button>

        <input
          ref={inputRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping?.();
          }}
          onKeyDown={handleKeyDown}
          placeholder={alertMode ? "Descreva o alerta..." : "Digite uma mensagem..."}
          disabled={disabled}
          className={cn(
            "flex-1 rounded-full border px-4 py-2 text-[14px] text-dark-base outline-none transition-all",
            "focus:ring-2 focus:ring-lime-accent/50",
            alertMode
              ? "border-red-200 bg-red-50 placeholder:text-red-300"
              : "border-gray-200 bg-gray-50 placeholder:text-gray-400"
          )}
        />

        <button
          onClick={handleSend}
          disabled={!text.trim() || (alertMode && !selectedCategory) || disabled}
          className={cn(
            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            alertMode
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-lime-accent text-dark-base hover:brightness-110"
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
