import React from "react";

export default function Logo({ variant = "vertical", size = "md" }) {
  const iconSize = size === "sm" ? 40 : size === "lg" ? 75 : 55;

  return (
    <div className={`flex ${variant === "horizontal" ? "flex-row items-center gap-3" : "flex-col items-center"}`}>
      <svg
        viewBox="0 0 100 100"
        width={iconSize}
        height={iconSize}
        className="shrink-0"
      >
        <defs>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a6ce39" />
            <stop offset="100%" stopColor="#4ea739" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#29b6f6" />
            <stop offset="100%" stopColor="#0d47a1" />
          </linearGradient>
          <linearGradient id="lightGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a6ce39" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#a6ce39" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="lightBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#29b6f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#29b6f6" stopOpacity="0.02" />
          </linearGradient>
          <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Shadow at the bottom of the triangle */}
        <ellipse cx="50" cy="94" rx="18" ry="2.2" fill="url(#shadowGrad)" />

        {/* LEFT HALF (Green "D" & Top Circuits) */}
        {/* Top Circuit Background */}
        <path
          d="M 12 15 L 48 15 L 48 48 L 29 48 Z"
          fill="url(#lightGreenGrad)"
          stroke="url(#greenGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Left Circuits */}
        <path d="M 40 20 L 30 30 L 30 42" stroke="#a6ce39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="40" cy="20" r="1.8" fill="#a6ce39" />
        <circle cx="30" cy="42" r="1.8" fill="#a6ce39" />

        <path d="M 22 22 L 28 28 L 28 38" stroke="#a6ce39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="22" cy="22" r="1.8" fill="#a6ce39" />
        <circle cx="28" cy="38" r="1.8" fill="#a6ce39" />

        <path d="M 32 18 L 36 24 L 44 24" stroke="#a6ce39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="44" cy="24" r="1.8" fill="#a6ce39" />

        <path d="M 16 30 L 22 30 L 24 34" stroke="#a6ce39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="30" r="1.8" fill="#a6ce39" />

        {/* Solid Bottom "D" with hollow center */}
        <path
          d="M 29 48 L 48 48 L 48 85 Z M 35.5 54 L 43.5 54 L 43.5 70 Z"
          fill="url(#greenGrad)"
          stroke="url(#greenGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          fillRule="evenodd"
        />

        {/* RIGHT HALF (Blue "B" & Top Circuits) */}
        {/* Top Circuit Background */}
        <path
          d="M 88 15 L 52 15 L 52 48 L 71 48 Z"
          fill="url(#lightBlueGrad)"
          stroke="url(#blueGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Right Circuits */}
        <path d="M 60 20 L 70 30 L 70 42" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="60" cy="20" r="1.8" fill="#29b6f6" />
        <circle cx="70" cy="42" r="1.8" fill="#29b6f6" />

        <path d="M 78 22 L 72 28 L 72 38" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="78" cy="22" r="1.8" fill="#29b6f6" />
        <circle cx="72" cy="38" r="1.8" fill="#29b6f6" />

        <path d="M 68 18 L 64 24 L 56 24" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="56" cy="24" r="1.8" fill="#29b6f6" />

        <path d="M 84 30 L 78 30 L 76 34" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="84" cy="30" r="1.8" fill="#29b6f6" />

        {/* Solid Bottom "B" with two hollow loops */}
        <path
          d="M 71 48 L 52 48 L 52 85 Z M 56.5 53.5 L 63.5 53.5 L 56.5 62.5 Z M 56.5 66.5 L 60.5 66.5 L 56.5 74.5 Z"
          fill="url(#blueGrad)"
          stroke="url(#blueGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          fillRule="evenodd"
        />
      </svg>

      <div className={variant === "horizontal" ? "text-left" : "text-center mt-2"}>
        <div
          className="text-xl tracking-wider font-black flex items-center justify-center select-none"
          style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
        >
          <span className="text-[#a6ce39]">DIJITAL</span>
          <span className="text-[#29b6f6] ml-1">BRAINS</span>
        </div>
        <div className="text-[9px] tracking-[0.16em] uppercase text-gray-400 font-bold select-none mt-0.5">
          Making Ideas Happen
        </div>
      </div>
    </div>
  );
}
