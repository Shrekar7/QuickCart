"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const sliderData = [
  {
    id: 1,
    tag: "Halloween",
    title: "Little looks,\nbig adventures.",
    subtitle:
      "Discover playful Halloween costumes made for unforgettable moments.",
    offer: "Up to 30% off",
    features: ["Comfortable fabrics", "Party ready"],
    buttonText: "Explore Halloween",
    accent: "#F5B700",
    imgSrc: assets.header_halloween_image,
  },
  {
    id: 2,
    tag: "Animals & Birds",
    title: "Bring their\nimagination to life.",
    subtitle:
      "From tiny explorers to wild little creatures, find a look they'll love.",
    offer: "New arrivals",
    features: ["Soft & comfortable", "Made for play"],
    buttonText: "Explore collection",
    accent: "#2E7D6B",
    imgSrc: assets.header_animal_image,
  },
  {
    id: 3,
    tag: "Indian State & Dance",
    title: "Celebrate culture,\nbeautifully.",
    subtitle:
      "Authentic-inspired costumes for school events, dance and celebrations.",
    offer: "Made for special moments",
    features: ["Authentic designs", "Event ready"],
    buttonText: "Explore collection",
    accent: "#E8578E",
    imgSrc: assets.indian_state_poster,
  },
];

const SLIDE_DURATION = 5200;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const HeaderSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDot, setHoveredDot] = useState(null);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // =========================================
  // AUTO SLIDE
  // =========================================

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [isPaused]);

  // =========================================
  // CHANGE SLIDE
  // =========================================

  const handleSlideChange = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // =========================================
  // TOUCH HANDLERS
  // =========================================

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      setIsPaused(false);
      return;
    }

    const distance = touchStartX.current - touchEndX.current;
    const minimumSwipeDistance = 50;

    if (Math.abs(distance) >= minimumSwipeDistance) {
      if (distance > 0) {
        setCurrentSlide((prev) => (prev + 1) % sliderData.length);
      } else {
        setCurrentSlide(
          (prev) => (prev - 1 + sliderData.length) % sliderData.length
        );
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;

    setTimeout(() => setIsPaused(false), 500);
  };

  const active = sliderData[currentSlide];

  return (
    <section
      className="relative mt-5 w-full overflow-hidden rounded-[28px] bg-[#fbfbfd]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ "--accent": active.accent }}
    >
      {/* =========================================
          ANIMATIONS
      ========================================== */}

      <style>{`
        @keyframes heroFadeIn {
          0% { opacity: 0; transform: translateY(14px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes textFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }

        .hero-image {
          animation: heroFadeIn 900ms ${EASE} both;
        }

        .hero-text > * {
          animation: textFadeIn 700ms ${EASE} both;
        }

        .hero-text > *:nth-child(1) { animation-delay: 40ms; }
        .hero-text > *:nth-child(2) { animation-delay: 90ms; }
        .hero-text > *:nth-child(3) { animation-delay: 150ms; }
        .hero-text > *:nth-child(4) { animation-delay: 200ms; }
        .hero-text > *:nth-child(5) { animation-delay: 250ms; }

        .progress-fill {
          animation: progressFill ${SLIDE_DURATION}ms linear forwards;
        }

        .dot-pill {
          transition: width 420ms ${EASE}, background-color 300ms ease;
        }

        .dot-label {
          transition: opacity 250ms ease, max-width 420ms ${EASE};
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-image,
          .hero-text > *,
          .progress-fill,
          .dot-pill,
          .dot-label {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* =========================================
          SLIDES
      ========================================== */}

      <div
        className="relative flex touch-pan-y transition-transform duration-[900ms]"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transitionTimingFunction: EASE,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {sliderData.map((slide, index) => (
          <article
            key={slide.id}
            className="relative flex min-w-full flex-col md:min-h-[460px] md:flex-row md:items-center"
            aria-hidden={currentSlide !== index}
          >
            {/* =====================================
                LEFT — TEXT
            ====================================== */}

            <div
              className={`relative z-20 flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 md:px-14 lg:px-20 ${
                currentSlide === index ? "hero-text" : ""
              }`}
            >
              {/* EYEBROW */}
              <div className="mb-6 flex items-center gap-2 text-[#6e6e73]">
                <span
                  className="h-[6px] w-[6px] rounded-full"
                  style={{ backgroundColor: slide.accent }}
                />
                <span className="text-[11px] font-medium uppercase tracking-[0.2em]">
                  {slide.tag}
                </span>
              </div>

              {/* TITLE */}
              <h1 className="max-w-[620px] whitespace-pre-line text-[38px] font-semibold leading-[1.04] tracking-[-0.03em] text-[#1d1d1f] sm:text-[48px] md:text-[54px] lg:text-[62px]">
                {slide.title}
              </h1>

              {/* SUBTITLE */}
              <p className="mt-5 max-w-[440px] text-[15px] leading-[1.6] text-[#6e6e73] sm:text-[17px]">
                {slide.subtitle}
              </p>

              {/* OFFER + FEATURES */}
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-medium text-[#1d1d1f]">
                <span style={{ color: slide.accent }}>{slide.offer}</span>
                {slide.features.map((feature) => (
                  <React.Fragment key={feature}>
                    <span className="text-[#d2d2d7]">·</span>
                    <span className="text-[#6e6e73]">{feature}</span>
                  </React.Fragment>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-9 flex items-center gap-6">
                <button
                  className="group inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-[14px] font-medium text-white transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {slide.buttonText}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button className="text-[14px] font-medium text-[#1d1d1f] underline-offset-4 hover:underline">
                  Learn more
                </button>
              </div>
            </div>

            {/* =====================================
                RIGHT — IMAGE
            ====================================== */}

            <div className="relative min-h-[300px] flex-1 md:min-h-[460px]">
              <div
                className="absolute bottom-8 right-[8%] h-[260px] w-[260px] rounded-full opacity-[0.10] blur-[60px] md:h-[340px] md:w-[340px]"
                style={{ backgroundColor: slide.accent }}
              />

              <div className="absolute inset-0 flex items-end justify-center md:justify-end md:pr-12 lg:pr-20">
                {slide.imgSrc && (
                  <Image
                    key={`${slide.id}-${currentSlide}`}
                    src={slide.imgSrc}
                    alt={slide.title}
                    width={520}
                    height={560}
                    priority={index === 0}
                    className={`relative z-10 h-[88%] w-auto max-w-[88%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.10)] md:h-[90%] ${
                      currentSlide === index ? "hero-image" : ""
                    }`}
                  />
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* =========================================
          BOTTOM CONTROLS
      ========================================== */}

      <div className="relative z-30 flex items-center justify-between border-t border-[#1d1d1f]/[0.06] px-6 py-4 sm:px-10">
        {/* COUNTER */}
        <span className="text-[12px] font-medium tabular-nums text-[#6e6e73]">
          {String(currentSlide + 1).padStart(2, "0")}
          <span className="mx-1 text-[#d2d2d7]">/</span>
          {String(sliderData.length).padStart(2, "0")}
        </span>

        {/* PAGINATION — signature expanding pills */}
        <div className="flex items-center gap-2.5">
          {sliderData.map((slide, index) => {
            const isActive = currentSlide === index;
            const isHovered = hoveredDot === index;
            const expanded = isActive || isHovered;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSlideChange(index)}
                onMouseEnter={() => setHoveredDot(index)}
                onMouseLeave={() => setHoveredDot(null)}
                aria-label={`Go to ${slide.tag} slide`}
                aria-current={isActive}
                className="dot-pill relative flex h-[7px] items-center overflow-hidden rounded-full"
                style={{
                  width: expanded ? "auto" : "7px",
                  minWidth: "7px",
                  backgroundColor: isActive
                    ? `${slide.accent}22`
                    : "#1d1d1f14",
                  paddingLeft: expanded ? "10px" : "0px",
                  paddingRight: expanded ? "10px" : "0px",
                  height: expanded ? "26px" : "7px",
                }}
              >
                {isActive && (
                  <span
                    key={`${currentSlide}-${isPaused}`}
                    className="progress-fill absolute inset-y-0 left-0 rounded-full opacity-40"
                    style={{
                      backgroundColor: slide.accent,
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                  />
                )}
                <span
                  className="dot-label relative whitespace-nowrap text-[11px] font-medium"
                  style={{
                    color: isActive ? slide.accent : "#6e6e73",
                    opacity: expanded ? 1 : 0,
                    maxWidth: expanded ? "140px" : "0px",
                  }}
                >
                  {slide.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* STATUS */}
        <span className="hidden min-w-[60px] justify-end text-[11px] font-medium text-[#6e6e73]/70 sm:flex">
          {isPaused ? "Paused" : "Auto"}
        </span>
      </div>
    </section>
  );
};

export default HeaderSlider;