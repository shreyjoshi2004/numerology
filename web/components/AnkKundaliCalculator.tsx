"use client";

import { useState } from "react";
import {
  ankKundaliFromDob,
  VEDIC_GRID_LAYOUT,
  type AnkKundaliResult,
} from "@/lib/numerology";
import Tooltip from "./Tooltip";

export default function AnkKundaliCalculator() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<AnkKundaliResult | null>(null);

  const generate = () => {
    setResult(ankKundaliFromDob(dob));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="eyebrow block mb-1.5" htmlFor="ank-dob-input">
            Date of Birth
          </label>
          <input
            id="ank-dob-input"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && dob) generate();
            }}
            max={new Date().toISOString().slice(0, 10)}
            className="input-aol tabular-nums cursor-pointer"
          />
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={!dob}
          className="px-5 py-2 rounded-xl bg-[#B05818] text-white text-sm font-medium shadow-sm transition-colors hover:bg-[#8B2C2C] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#B05818]"
        >
          Generate
        </button>
      </div>

      {result ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 max-w-[13.5rem]">
            {VEDIC_GRID_LAYOUT.flat().map((digit, i) => {
              const count = result.grid[digit] ?? 0;
              return (
                <div
                  key={i}
                  className="aspect-square bg-[#FDF8F1] border border-[#EADFCB] rounded-lg flex items-center justify-center px-1"
                >
                  {count > 0 ? (
                    <span className="font-serif text-[#B05818] tabular-nums leading-none break-all text-center text-xl">
                      {String(digit).repeat(count)}
                    </span>
                  ) : (
                    <span className="text-[#D8CBB0] text-xl" aria-hidden="true">
                      ·
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#FDF8F1] border border-[#EADFCB] rounded-xl px-3 py-2 flex items-baseline justify-between gap-2">
              <div className="eyebrow flex items-center">Moolank</div>
              <div className="font-serif text-lg text-[#2A2A2A] tabular-nums leading-none">
                {result.moolank.value}
              </div>
            </div>
            <div className="bg-[#FDF8F1] border border-[#EADFCB] rounded-xl px-3 py-2 flex items-baseline justify-between gap-2">
              <div className="eyebrow flex items-center">Bhagyank</div>
              <div className="flex items-baseline gap-2">
                <div className="text-xs text-[#6B6B6B] tabular-nums">
                  compound{" "}
                  <span className="text-[#2A2A2A] font-medium">
                    {result.bhagyank.compound}
                  </span>
                </div>
                <div className="font-serif text-lg text-[#B05818] tabular-nums leading-none">
                  {result.bhagyank.reduced}
                </div>
              </div>
            </div>
          </div>

          <details className="group bg-[#FDF8F1] border border-[#EADFCB] rounded-xl">
            <summary className="cursor-pointer select-none list-none flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-medium text-[#2A2A2A]">
              <span>Breakdown</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#6B6B6B] transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div className="border-t border-[#EADFCB] divide-y divide-[#EADFCB]">
              {result.contributions.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 px-3.5 py-2.5"
                >
                  <div className="flex items-center gap-1 min-w-0 shrink-0">
                    <span className="text-sm text-[#2A2A2A] truncate">{c.label}</span>
                    <Tooltip label={c.label}>{c.detail}</Tooltip>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {c.digits.map((d, j) => (
                      <span
                        key={j}
                        className={
                          c.added
                            ? "px-2 py-0.5 rounded-md text-xs font-semibold tabular-nums bg-white border border-[#EADFCB] text-[#B05818]"
                            : "px-2 py-0.5 rounded-md text-xs font-semibold tabular-nums bg-white/60 border border-[#EADFCB]/70 text-[#C9BCA0]"
                        }
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      ) : null}
    </div>
  );
}
