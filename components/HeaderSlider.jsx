import React, { useState, useEffect, useCallback } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

// Each slide keeps its own identity through an accent color, but sits on
// the same light #FAF9FF backdrop as the category section below it, so the
// top of the page reads as one continuous surface.
const sliderData = [
  {
    id: 1,
    tag: "Halloween",
    title: "Halloween Costumes for Kids",
    subtitle: "Spooky, cute, and everything in between",
    offer: "Up to 30% off, limited time",
    features: ["Wide range of styles", "Soft, comfortable fabric", "Perfect for parties"],
    buttonText1: "View collection",
    buttonText2: "See all styles",
    accent: "#F5B700",
    imgSrc: assets.header_halloween_image,
  },
  {
    id: 2,
    tag: "Animals & Birds",
    title: "Animal & Bird Costumes for Kids",
    subtitle: "From the jungle to your living room",
    offer: "New arrivals every week",
    features: ["High quality & comfortable", "Great for events", "Safe for all-day wear"],
    buttonText1: "View collection",
    buttonText2: "See all styles",
    accent: "#2E7D6B",
    imgSrc: assets.header_animal_image,
  },
  {
    id: 3,
    tag: "Indian State & Dance",
    title: "Indian State & Dance Costumes",
    subtitle: "Authentic looks for festivals & school events",
    offer: "Ideal for competitions & celebrations",
    features: ["Authentic state designs", "Durable stitching", "Ready for dance & events"],
    buttonText1: "View collection",
    buttonText2: "See all styles",
    accent: "#E8578E",
    imgSrc: assets.indian_state_poster,
  },
];

const SLIDE_DURATION = 4500;

const BulbTrim = ({ count = 26, active }) => (
  <div className="flex items-center justify-center gap-2.5 md:gap-3 py-3">
    {Array.from({ length: count }).map((_, i) => (
      <span
        key={i}
        className="block w-1.5 h-1.5 rounded-full transition-colors duration-700"
        style={{
          backgroundColor: active,
          animation: "bulbGlow 2.4s ease-in-out infinite",
          animationDelay: `${i * 0.08}s`,
        }}
      />
    ))}
  </div>
);

const HeaderSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleSlideChange = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const active = sliderData[currentSlide];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl mt-6 bg-[#FAF9FF] border border-[#EDEBFB]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes timeline-fill {
          from { width: 0% }
          to { width: 100% }
        }
        .timeline-bar-active {
          animation: timeline-fill ${SLIDE_DURATION}ms linear forwards;
        }
        @keyframes bulbGlow {
          0%, 100% { opacity: 0.3; box-shadow: 0 0 0px rgba(0,0,0,0); }
          50% { opacity: 1; box-shadow: 0 0 6px 1px currentColor; }
        }
        @media (prefers-reduced-motion: reduce) {
          span[style*="bulbGlow"] { animation: none !important; opacity: 0.85 !important; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 75% at 80% 55%, ${active.accent}22 0%, transparent 65%)`,
        }}
      />

      <div className="relative">
        <BulbTrim active={active.accent} />
      </div>

      <div
        className="relative flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-stretch justify-between min-h-[320px] md:min-h-[380px] min-w-full relative"
            aria-hidden={currentSlide !== index}
          >
            <div className="flex flex-col justify-center md:pl-14 pl-6 pr-6 py-8 md:py-0 max-w-lg relative z-10">
              <span
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full mb-4 w-fit border"
                style={{ color: slide.accent, borderColor: `${slide.accent}55` }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: slide.accent }}
                />
                {slide.tag}
              </span>

              <h1 className="text-3xl md:text-[42px] md:leading-[1.15] font-serif tracking-tight text-[#2E1A47]">
                {slide.title}
              </h1>
              <p className="text-[#5B4B75]/70 text-base md:text-lg mt-3 font-medium">
                {slide.subtitle}
              </p>

              <p className="text-sm font-semibold mt-3" style={{ color: slide.accent }}>
                {slide.offer}
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5">
                {slide.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: slide.accent }}
                    />
                    <span className="text-xs font-medium text-[#5B4B75]/60">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-5 mt-7">
                <button
                  className="px-7 py-2.5 rounded-full font-semibold text-white transition-transform hover:scale-105 shadow-md"
                  style={{ backgroundColor: slide.accent }}
                >
                  {slide.buttonText1}
                </button>
                <button className="group flex items-center gap-2 font-medium text-[#2E1A47]/70 hover:text-[#2E1A47] transition-colors">
                  {slide.buttonText2}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 relative self-stretch min-h-[240px] md:min-h-0">
              <div
                className="absolute bottom-4 right-16 md:right-24 w-56 h-56 rounded-full blur-3xl opacity-25"
                style={{ backgroundColor: slide.accent }}
              />
              <div className="absolute bottom-0 right-8 md:right-16 h-full flex items-end">
                {slide.imgSrc && (
                  <Image
                    className="h-[80%] md:h-[92%] w-auto object-contain drop-shadow-xl relative z-10"
                    src={slide.imgSrc}
                    alt={slide.title}
                    priority={index === 0}
                    width={400}
                    height={500}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center gap-2.5 py-6 border-t border-[#2E1A47]/8">
        {sliderData.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index}
            className="relative h-1 w-10 rounded-full overflow-hidden bg-[#2E1A47]/10"
          >
            {currentSlide === index && (
              <span
                key={`${currentSlide}-${isPaused}`}
                className="absolute inset-y-0 left-0 rounded-full timeline-bar-active"
                style={{
                  backgroundColor: slide.accent,
                  animationPlayState: isPaused ? "paused" : "running",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;