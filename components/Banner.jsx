import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

// Marquee bulb trim — same signature motif as the category section, used
// here as a thin border so the two sections read as one brand, not two
// different design languages stitched together.
const BulbTrim = ({ count = 22 }) => (
  <div className="flex items-center justify-center gap-3 md:gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <span
        key={i}
        className="block w-1.5 h-1.5 rounded-full bg-[#F5B700]"
        style={{
          animation: "bulbGlow 2.4s ease-in-out infinite",
          animationDelay: `${i * 0.09}s`,
        }}
      />
    ))}
  </div>
);

const Banner = () => {
  return (
    <div className="relative my-16 rounded-2xl md:rounded-3xl overflow-hidden bg-[#2E1A47]">
      {/* stage-lit backdrop: deep plum to near-black, with a soft violet
          spotlight rising behind the center where the copy sits */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 90% at 50% 0%, rgba(139,92,246,0.35) 0%, rgba(46,26,71,0) 60%), linear-gradient(180deg, #34204F 0%, #1E1230 100%)",
        }}
      />
      {/* faint vertical light rays, like stage beams either side of the copy */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "linear-gradient(100deg, transparent 30%, rgba(245,183,0,0.15) 40%, transparent 50%), linear-gradient(80deg, transparent 55%, rgba(245,183,0,0.12) 65%, transparent 75%)",
        }}
      />

      <div className="relative pt-5 md:pt-6">
        <BulbTrim />
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between md:pl-14 lg:pl-20 py-10 md:py-0">
        <div className="relative md:-mr-6">
          <div
            aria-hidden
            className="absolute inset-0 blur-2xl opacity-40 rounded-full"
            style={{ background: "radial-gradient(circle, #F5B700 0%, transparent 70%)" }}
          />
          <Image
            className="max-w-[170px] md:max-w-52 relative z-10 drop-shadow-2xl"
            src={assets.superhero_poster} // TODO: swap for real costume photo (e.g. fairy tale/fantasy costume)
            alt="Costume model"
          />
        </div>

        <div className="flex flex-col items-center justify-center text-center space-y-4 px-6 md:px-4 relative z-10 max-w-md">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-[#F5B700]">
            <span className="w-4 h-px bg-[#F5B700]" />
            Party Season
            <span className="w-4 h-px bg-[#F5B700]" />
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight text-white leading-[1.1]">
            Every Character,
            <br />
            One Wardrobe
          </h2>
          <p className="max-w-[340px] font-medium text-white/60 text-sm md:text-base">
            From capes to costumes, dress-up made comfortable, durable, and
            ready for any celebration.
          </p>
          <button className="group flex items-center justify-center gap-2 px-10 py-3 bg-[#F5B700] hover:bg-white transition-colors duration-300 rounded-full text-[#2E1A47] font-semibold mt-2 shadow-[0_8px_24px_rgba(245,183,0,0.35)]">
            Shop the collection
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="group-hover:translate-x-1 transition-transform duration-300"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="#2E1A47"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="relative md:-ml-6">
          <div
            aria-hidden
            className="absolute inset-0 blur-2xl opacity-40 rounded-full"
            style={{ background: "radial-gradient(circle, #F5B700 0%, transparent 70%)" }}
          />
          <Image
            className="hidden md:block max-w-64 lg:max-w-72 relative z-10 drop-shadow-2xl"
            src={assets.Poster_halloween} // TODO: swap for real costume photo (e.g. superhero costume)
            alt="Costume model"
          />
          <Image
            className="md:hidden max-w-[150px] relative z-10 drop-shadow-2xl mt-4"
            src={assets.boy_with_laptop_image} // TODO: swap for real costume photo (e.g. superhero costume)
            alt="Costume model"
          />
        </div>
      </div>

      <div className="relative pb-5 md:pb-6">
        <BulbTrim />
      </div>

      <style jsx>{`
        @keyframes bulbGlow {
          0%,
          100% {
            opacity: 0.3;
            box-shadow: 0 0 0px rgba(245, 183, 0, 0);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 6px 1px rgba(245, 183, 0, 0.7);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          span[style*="bulbGlow"] {
            animation: none !important;
            opacity: 0.8 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;