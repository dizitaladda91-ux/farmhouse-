"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
  badge?: string;
  subtext?: string;
}

interface LuxuryDropdownProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder?: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
}

export default function LuxuryDropdown({
  label,
  icon,
  value,
  placeholder = "Select option",
  options,
  onChange,
  className = "",
}: LuxuryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left bg-slate-50/90 hover:bg-white border rounded-2xl p-2.5 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer select-none ${
          isOpen
            ? "border-[#1A365D] bg-white ring-2 ring-[#1A365D]/10 -translate-y-1 shadow-md"
            : "border-slate-200/90 hover:border-[#D4AF37] hover:-translate-y-1"
        }`}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-0.5">
          {label}
        </span>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center min-w-0 pr-2">
            <span className="flex-shrink-0 mr-2">{icon}</span>
            <span
              className={`text-xs font-semibold truncate ${
                value ? "text-slate-900" : "text-slate-700"
              }`}
            >
              {displayText}
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
              isOpen ? "transform rotate-180 text-[#1A365D]" : ""
            }`}
          />
        </div>
      </button>

      {/* Floating 3D Animated Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[9999] bg-white border border-slate-200/90 rounded-2xl shadow-[0_25px_60px_-10px_rgba(26,54,93,0.3),0_10px_20px_-5px_rgba(0,0,0,0.1)] p-2 min-w-full w-max max-w-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-64 overflow-y-auto space-y-1 py-1">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bosa-gradient-bg text-white font-bold shadow-sm"
                      : "text-slate-900 font-semibold hover:bg-slate-100 hover:text-[#1A365D] hover:pl-4.5"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{opt.label}</span>
                    {opt.badge && (
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold tracking-wider ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-amber-100 text-amber-900 border border-amber-300/60"
                        }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 ml-2" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
