import React, { useRef, useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

const categories = [
  {
    id: 1,
    name: "Halloween",
    image: assets.Poster_halloween, // TODO: swap for real Halloween costume photo
    href: "/category/halloween",
  },
  {
    id: 2,
    name: "Animals & Birds",
    image: assets.animal_birds_poster, // TODO: swap for real animal costume photo
    href: "/category/animals-and-birds",
  },
  {
    id: 3,
    name: "Indian State & Dance",
    image: assets.indian_state_poster, // TODO: swap for real dance costume photo
    href: "/category/indian-state-and-dance",
  },
  {
    id: 4,
    name: "Superhero",
    image: assets.superhero_poster, // TODO: swap for real superhero costume photo
    href: "/category/superhero",
  },
  {
    id: 5,
    name: "Fairy Tale & Fantasy",
    image: assets.fairytale_poster, // TODO: swap for real fantasy costume photo
    href: "/category/fairy-tale-and-fantasy",
  },
  {
    id: 6,
    name: "Profession Dress-up",
    image: assets.service_poster, // TODO: swap for real profession costume photo
    href: "/category/profession-dress-up",
  },
  {
    id: 7,
    name: "Historical & Mythology",
    image: assets.History, // TODO: swap for real historical costume photo
    href: "/category/historical-and-mythology",
  },
  {
    id: 8,
    name: "Sports & Team Wear",
    image: assets.Sports_poster, // TODO: swap for real sports costume photo
    href: "/category/sports-and-team-wear",
  },
];

// Small strip of marquee bulbs — the signature motif for this section,
// echoing the lights around a costume-shop / theatre marquee sign.
const MarqueeBulbs = ({ count = 14 }) => (
  <div className="flex items-center justify-center gap-2.5 md:gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <span
        key={i}
        className="block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#F5B700]"
        style={{
          animation: "bulbGlow 2.4s ease-in-out infinite",
          animationDelay: `${i * 0.12}s`,
        }}
      />
    ))}
  </div>
);

const CategorySection = () => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("[data-card]");
    const cardWidth = card ? card.offsetWidth + 20 : 220; // width + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
      behavior: "smooth",
    });
  };

  // Track which card is centered so mobile dot indicators can update.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.querySelector("[data-card]");
      const cardWidth = card ? card.offsetWidth + 20 : 220;
      const index = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.min(index, categories.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative mt-10 md:mt-16 bg-[#FAF9FF] py-10 md:py-14 rounded-2xl md:rounded-3xl overflow-hidden">
      {/* ambient spotlight glow, stage-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
      />

      <div className="relative flex flex-col items-center px-4">
        <MarqueeBulbs />
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mt-4">
          Explore
        </span>
        <p className="text-2xl md:text-4xl font-serif tracking-tight text-[#2E1A47] text-center mt-1">
          Shop by Category
        </p>
        <div className="w-10 h-px bg-[#F5B700] mt-3 md:mt-4" />
      </div>

      <div className="relative mt-8 md:mt-12">
        {/* left arrow — desktop only */}
        <button
          onClick={() => scrollByAmount("left")}
          aria-label="Scroll left"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg ring-1 ring-[#EDEBFB] items-center justify-center hover:bg-[#F5B700] hover:ring-[#F5B700] hover:shadow-[0_0_0_6px_rgba(245,183,0,0.15)] transition-all duration-300 group/arrow"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#2E1A47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/arrow:stroke-white transition-colors" />
          </svg>
        </button>

        {/* right arrow — desktop only */}
        <button
          onClick={() => scrollByAmount("right")}
          aria-label="Scroll right"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg ring-1 ring-[#EDEBFB] items-center justify-center hover:bg-[#F5B700] hover:ring-[#F5B700] hover:shadow-[0_0_0_6px_rgba(245,183,0,0.15)] transition-all duration-300 group/arrow"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#2E1A47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/arrow:stroke-white transition-colors" />
          </svg>
        </button>

        {/* soft fade at the edges so the strip feels like it recedes into the wings */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-16 z-10 bg-gradient-to-r from-[#FAF9FF] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-16 z-10 bg-gradient-to-l from-[#FAF9FF] to-transparent" />

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 md:px-16 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              data-card
              onClick={() => router.push(cat.href)}
              className="group relative shrink-0 snap-start w-44 sm:w-48 md:w-48 aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer bg-gray-100 shadow-md ring-1 ring-black/5 hover:shadow-2xl hover:ring-[#F5B700]/40 transition-all duration-500 active:scale-[0.98] md:active:scale-100 md:hover:-translate-y-1.5"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 45vw, 200px"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              )}

              {/* gradient scrim for legible text over any image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

              {/* spotlight sweep on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#F5B700]/15 via-transparent to-transparent" />

              {/* corner ticket-stub number */}
              <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3 w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/25 flex items-center justify-center">
                <span className="text-white text-[10px] md:text-[11px] font-serif">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <p className="font-serif text-white text-base md:text-xl leading-tight tracking-tight">
                  {cat.name}
                </p>
                <div className="h-px w-5 md:w-6 bg-[#F5B700] mt-2 group-hover:w-8 md:group-hover:w-10 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* mobile progress dots */}
        <div className="flex md:hidden items-center justify-center gap-1.5 mt-5">
          {categories.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-5 bg-[#F5B700]" : "w-1.5 bg-[#2E1A47]/15"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bulbGlow {
          0%, 100% {
            opacity: 0.35;
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

export default CategorySection;