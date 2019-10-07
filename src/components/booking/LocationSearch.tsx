"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Navigation } from "lucide-react";
import type { PlaceResult } from "@/lib/google-maps";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSelect: (place: PlaceResult) => void;
  icon?: "pickup" | "dropoff";
};

export function LocationSearch({
  label,
  value,
  placeholder = "Enter address or airport",
  onChange,
  onSelect,
  icon = "pickup",
}: Props) {
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSuggestions(data.places || []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const isPickup = icon === "pickup";

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <div
        className={cn(
          "flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300",
          focused && (isPickup ? "border-emerald-400 ring-4 ring-emerald-500/10" : "border-amber-400 ring-4 ring-amber-500/10")
        )}
      >
        <span
          aria-hidden
          className={cn(
            "flex w-12 shrink-0 items-center justify-center text-sm font-bold text-white",
            isPickup ? "bg-emerald-500" : "bg-amber-500"
          )}
        >
          {isPickup ? "A" : "B"}
        </span>
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              setFocused(true);
              if (suggestions.length > 0) setOpen(true);
            }}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && open && suggestions.length > 0) {
              e.preventDefault();
              const place = suggestions[0];
              onSelect(place);
              onChange(place.address);
              setOpen(false);
            }
          }}
          placeholder={placeholder}
            className="w-full border-0 bg-transparent py-3.5 pl-3 pr-10 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoComplete="off"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-emerald-500" />
          )}
        </div>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-900/10">
          {suggestions.map((place, i) => (
            <li key={`${place.address}-${i}`}>
              <button
                type="button"
                className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition hover:bg-emerald-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(place);
                  onChange(place.address);
                  setOpen(false);
                }}
              >
                <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span className="text-slate-700">{place.address}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
