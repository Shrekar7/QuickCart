"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Banner = () => {
  const router = useRouter();
  const sectionRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x, y });
  };

  return (
    <section className="w-full py-10 sm:py-14 md:py-16">
      <style>{`
        @keyframes bannerFloat {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes bannerFloatSlow {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
        }
        @keyframes bannerRiseIn {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bannerPop {
          from { opacity: 0; transform: scale(0.85) rotate(-6deg); }
          to { opacity: 1; transform: scale(1) rotate(-4deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .float-el, .float-el-slow { animation: none !important; }
        }
      `}</style>

      <div
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        className="relative mx-auto w-full max-w-[1500px] overflow-hidden rounded-[36px] md:rounded-[44px] bg-[#1A1226]"
      >
        {/* ===== Bold Lego-style color blocks ===== */}
        <div
          className="absolute -top-20 -left-20 w-[340px] h-[340px] rounded-[64px] rotate-12 opacity-90 float-el"
          style={{
            background: "linear-gradient(135deg, #F5B700 0%, #E8578E 100%)",
            animation: "bannerFloat 7s ease-in-out infinite",
            transform: `translate(${mouse.x * -8}px, ${mouse.y * -8}px) rotate(12deg)`,
          }}
        />
        <div
          className="absolute -bottom-28 -right-16 w-[380px] h-[380px] rounded-full opacity-80 float-el-slow"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)",
            animation: "bannerFloatSlow 9s ease-in-out infinite",
            transform: `translate(${mouse.x * 10}px, ${mouse.y * 10}px)`,
          }}
        />
        <div
          className="absolute top-1/3 right-[8%] w-24 h-24 rounded-3xl -rotate-12 opacity-60 hidden md:block"
          style={{ background: "#2E7D6B" }}
        />

        {/* ===== Grain / vignette for depth ===== */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1226] via-transparent to-[#1A1226]/40 pointer-events-none" />

        {/* ===== Content ===== */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] items-center gap-12 md:gap-8 px-8 py-16 sm:px-14 sm:py-20 md:px-16 md:py-24 lg:px-20">

          {/* Text */}
          <div
            className="flex flex-col items-center md:items-start text-center md:text-left"
            style={visible ? { animation: "bannerRiseIn 0.8s cubic-bezier(0.16,1,0.3,1) both" } : { opacity: 0 }}
          >
            <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-7 backdrop-blur-sm bg-white/8 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
                Make their moment magical
              </span>
            </div>

            <h2 className="font-serif text-[42px] sm:text-[58px] md:text-[64px] lg:text-[74px] leading-[0.98] tracking-[-0.03em] text-white">
              Let them become
              <br />
              <span
                className="italic bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, #F5B700, #E8578E, #8B5CF6, #F5B700)",
                  backgroundSize: "300% 100%",
                  animation: "shimmer 6s linear infinite",
                }}
              >
                someone wonderful.
              </span>
            </h2>

            <p className="mt-6 max-w-[440px] text-base sm:text-lg text-white/60 leading-relaxed">
              From fearless heroes to magical characters — costumes built
              for big imaginations, and memories that outlast the party.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/all-products")}
                className="group flex items-center gap-3 rounded-full px-8 py-4 text-[15px] font-semibold text-[#1A1226] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #F5B700 0%, #F5C93F 100%)",
                  boxShadow: "0 12px 32px rgba(245,183,0,0.35)",
                }}
              >
                Explore costumes
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A1226]/10 transition-transform duration-300 group-hover:translate-x-1.5">
                  <ArrowIcon />
                </span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/all-products")}
                className="group flex items-center gap-2 rounded-full px-5 py-4 text-[15px] font-semibold text-white/70 hover:text-white transition-colors"
              >
                See what's new
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </button>
            </div>

            <div className="mt-9 flex items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" /> Dress up
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8578E]" /> Imagine
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" /> Celebrate
              </span>
            </div>
          </div>

          {/* Layered floating imagery — Apple-style depth, Lego-style boldness */}
          <div className="relative flex justify-center md:justify-end h-[320px] sm:h-[380px] md:h-[440px]">

            {/* back color block — the "stage" */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[380px] md:h-[380px] rounded-[56px]"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 60%, #E8578E 100%)",
                transform: `rotate(6deg) translate(${mouse.x * -6}px, ${mouse.y * -6}px)`,
                transition: "transform 0.3s ease-out",
              }}
            />

            {/* secondary small block, gold, offset */}
            <div
              className="absolute top-[8%] right-[6%] w-20 h-20 sm:w-24 sm:h-24 rounded-3xl -rotate-12"
              style={{
                background: "#F5B700",
                transform: `translate(${mouse.x * 14}px, ${mouse.y * 14}px) rotate(-12deg)`,
                transition: "transform 0.3s ease-out",
              }}
            />

            {/* main product image, floating above the stage */}
            <div
              className="relative w-[220px] h-[220px] sm:w-[270px] sm:h-[270px] md:w-[300px] md:h-[300px] z-10"
              style={{
                animation: visible ? "bannerPop 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both" : undefined,
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  transform: `translate(${mouse.x * -10}px, ${mouse.y * -10}px)`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                <Image
                  src={assets.superhero_poster}
                  alt="Costume collection"
                  fill
                  sizes="(max-width: 640px) 220px, (max-width: 768px) 270px, 300px"
                  className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]"
                />
              </div>
            </div>

            {/* small floating badge */}
            <div
              className="absolute bottom-[6%] left-[2%] sm:left-[8%] z-20 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-2xl"
              style={{
                animation: "bannerFloat 6s ease-in-out infinite",
                animationDelay: "1s",
              }}
            >
              <span className="w-8 h-8 rounded-full bg-[#2E7D6B]/10 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#2E7D6B]" />
              </span>
              <div className="leading-tight">
                <p className="text-[11px] font-bold text-[#2E1A47]">New styles</p>
                <p className="text-[10px] text-[#5B4B75]/50">Every week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;