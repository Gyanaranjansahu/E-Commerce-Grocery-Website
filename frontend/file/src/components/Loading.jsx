import React, { useState, useEffect } from "react";

export default function GroceryLoader({
  message = "Gathering fresh farm harvests...",
  subtext = "Sourcing zero-pesticide produce directly to your kitchen",
}) {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const facts = [
    "Cold-chain transport preserves 95% more vitamins.",
    "Harvested under 12 hours before arrival at your door.",
    "Zero chemical ripening agents — 100% natural maturation.",
    "Lab purity testing run daily on all A2 dairy batches.",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [facts.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFAF8] text-[#1E221E] px-4 select-none overflow-hidden font-sans">
      
      {/* Background Organic Ambient Glow */}
      <div className="absolute -top-12 -left-12 w-80 h-80 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-lime-100/50 blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#161B16] leading-none">
          VEDA
        </h1>
        <span className="text-[11px] font-bold tracking-[0.3em] text-[#1B3821] uppercase mt-1.5">
          Organics
        </span>
      </div>

      {/* Center Animated Stage */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
        
        {/* Ring 1: Subtle Expanding Pulse */}
        <div className="absolute inset-0 rounded-full border border-emerald-300 animate-ping opacity-20" />

        {/* Ring 2: Rotating Dashed Orbit */}
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#A2C7A7] animate-spin [animation-duration:14s]" />

        {/* Center Circular Card */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow-xl shadow-emerald-950/5 border border-[#E6E4DD] flex items-center justify-center">
          
          {/* Grocery Basket Icon with Bounce */}
          <div className="animate-bounce [animation-duration:1.8s]">
            <svg
              className="w-12 h-12 text-[#1B3821]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>

          {/* Sparkle Accent */}
          <div className="absolute -top-1 right-2 text-amber-500 animate-pulse">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.1-6.2-4.6-6.2 4.6 2.3-7.1-6.1-4.5h7.6z" />
            </svg>
          </div>
        </div>

        {/* Floating Item 1: Carrot (Top-Right) */}
        <div className="absolute -top-2 -right-2 p-2.5 bg-white rounded-2xl shadow-md border border-[#ECE9DF] animate-bounce [animation-duration:2.4s] [animation-delay:200ms]">
          <span className="text-xl leading-none select-none">🥕</span>
        </div>

        {/* Floating Item 2: Apple (Bottom-Right) */}
        <div className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-2xl shadow-md border border-[#ECE9DF] animate-bounce [animation-duration:2.8s] [animation-delay:400ms]">
          <span className="text-xl leading-none select-none">🍎</span>
        </div>

        {/* Floating Item 3: Milk Bottle (Bottom-Left) */}
        <div className="absolute -bottom-2 -left-2 p-2.5 bg-white rounded-2xl shadow-md border border-[#ECE9DF] animate-bounce [animation-duration:2.2s] [animation-delay:600ms]">
          <span className="text-xl leading-none select-none">🥛</span>
        </div>

        {/* Floating Item 4: Leaf/Sprout (Top-Left) */}
        <div className="absolute -top-2 -left-2 p-2.5 bg-white rounded-2xl shadow-md border border-[#ECE9DF] animate-bounce [animation-duration:2.6s] [animation-delay:100ms]">
          <span className="text-xl leading-none select-none">🌿</span>
        </div>
      </div>

      {/* Main Informational Text */}
      <div className="mt-8 text-center max-w-sm px-4">
        <h2 className="text-lg sm:text-xl font-serif font-bold text-[#161B16] tracking-tight">
          {message}
        </h2>
        <p className="text-xs sm:text-sm text-[#666F66] mt-1.5 leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Modern Indeterminate Progress Bar */}
      <div className="w-56 sm:w-64 h-1.5 bg-[#E6E8E2] rounded-full overflow-hidden mt-6 relative">
        <div className="h-full bg-[#1B3821] rounded-full w-2/5 animate-[shimmer_1.4s_infinite_ease-in-out]" />
      </div>

      {/* Cycling Quality Assurance Tag */}
      <div className="mt-6 flex items-center gap-2.5 bg-white border border-[#E0DDD3] px-4 py-2 rounded-full shadow-sm max-w-xs sm:max-w-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-700" />
        </span>
        <span className="text-[11px] font-medium text-[#2E4733] truncate">
          {facts[currentFactIndex]}
        </span>
      </div>

    </div>
  );
}