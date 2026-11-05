"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { assets } from "@/assets/assets";
import sgnLogo from "@/assets/SNG-logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const sliderData = [
  {
    id: 0,
    type: "intro",
    tag: "Welcome to SGN Costume World",
    title: "Welcome to \nSNG Costume World.",
    subtitle:
      "Your one-stop shop for kids' costumes, from Halloween and animal outfits to Indian state and dance looks. Browse by category and find the perfect look for school events, festivals and parties.",
    highlights: [
      {
        icon: "sparkle",
        title: "Wide range",
        text: "Festivals, school events & parties",
      },
      {
        icon: "heart",
        title: "Comfy fabrics",
        text: "Soft, kid-friendly materials",
      },
      {
        icon: "grid",
        title: "Easy to browse",
        text: "Shop by category in a tap",
      },
    ],
    categories: [
      { label: "Halloween", href: "/category/halloween", color: "#F28C00" },
      {
        label: "Animals & Birds",
        href: "/category/animals-and-birds",
        color: "#2E7D6B",
      },
      {
        label: "Indian State & Dance",
        href: "/category/indian-state-and-dance",
        color: "#E8578E",
      },
    ],
    buttonText: "Explore Our Collection",
    accent: "#D99A00",
    imgSrc: sgnLogo,
    href: "/all-products",
  },
  {
    id: 1,
    tag: "Halloween",
    title: "Little looks,\nbig adventures.",
    subtitle:
      "Discover playful Halloween costumes made for unforgettable moments.",
    offer: "Up to 30% off",
    features: ["Comfortable fabrics", "Party ready"],
    buttonText: "Explore Halloween",
    accent: "#F28C00",
    imgSrc: assets.header_halloween_image,
    href: "/category/halloween",
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
    href: "/category/animals-and-birds",
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
    href: "/category/indian-state-and-dance",
  },
];

const SLIDE_DURATION = 5200;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HighlightIcon = ({ name }) => {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "sparkle") {
    return (
      <svg {...common}>
        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
        <path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16z" />
      </svg>
    );
  }

  if (name === "heart") {
    return (
      <svg {...common}>
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
};

const HeaderSlider = () => {
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDot, setHoveredDot] = useState(null);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const resumeTimeout = useRef(null);

  const goToSlide = useCallback((index) => {
    setCurrentSlide((index + sliderData.length) % sliderData.length);
  }, []);

  // Autoplay is driven by the progress bar finishing (see onAnimationEnd),
  // so pausing/resuming always stays in sync with what you see.

  useEffect(() => {
    return () => {
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
    setIsPaused(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      if (Math.abs(distance) >= 50) {
        goToSlide(distance > 0 ? currentSlide + 1 : currentSlide - 1);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    resumeTimeout.current = setTimeout(() => setIsPaused(false), 500);
  };

  const active = sliderData[currentSlide];

  return (
    <section
      className="relative mt-5 w-full overflow-hidden rounded-[26px] border border-[#E8E2DB] bg-[#F8F6F3] shadow-[0_20px_60px_-30px_rgba(60,40,10,0.35)] sm:rounded-[30px] md:rounded-[34px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ "--accent": active.accent }}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      <style>{`
        @keyframes heroImageIn {
          0% { opacity: 0; transform: translateX(35px) scale(0.94); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes textFadeIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .hero-image { animation: heroImageIn 900ms ${EASE} both; }
        .hero-text > * { animation: textFadeIn 700ms ${EASE} both; }
        .hero-text > *:nth-child(1) { animation-delay: 40ms; }
        .hero-text > *:nth-child(2) { animation-delay: 90ms; }
        .hero-text > *:nth-child(3) { animation-delay: 150ms; }
        .hero-text > *:nth-child(4) { animation-delay: 200ms; }
        .hero-text > *:nth-child(5) { animation-delay: 250ms; }
        .hero-text > *:nth-child(6) { animation-delay: 300ms; }

        .float-pill { animation: floatY 4.5s ease-in-out infinite; }
        .float-pill-2 { animation-delay: 1.2s; }
        .float-pill-3 { animation-delay: 2.4s; }

        .progress-fill { animation: progressFill ${SLIDE_DURATION}ms linear forwards; }

        .dot-pill {
          transition: width 420ms ${EASE}, background-color 300ms ease, height 300ms ease;
        }
        .dot-label {
          transition: opacity 250ms ease, max-width 420ms ${EASE};
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-image, .hero-text > *, .float-pill, .dot-pill, .dot-label {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* SLIDES */}
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
        {sliderData.map((slide, index) => {
          const isActive = currentSlide === index;
          const tab = isActive ? 0 : -1;
          const isIntro = slide.type === "intro";

          return (
            <article
              key={slide.id}
              aria-hidden={!isActive}
              className="relative flex min-w-full flex-col overflow-hidden md:h-[500px] md:flex-row"
            >
              {/* Background */}
              {isIntro ? (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFF3D1] via-[#FFF9EE] to-[#FDE6EF]" />
                  <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#F5B700]/20 blur-[80px]" />
                  <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-[#E8578E]/15 blur-[90px]" />
                </>
              ) : (
                <div
                  className="pointer-events-none absolute right-[-100px] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.08] blur-[80px]"
                  style={{ backgroundColor: slide.accent }}
                />
              )}

              {/* INTRO ONLY — MOBILE: logo + button instead of the text */}
              {isIntro && (
                <div className="relative z-20 flex flex-1 flex-col items-center justify-center gap-7 px-6 py-10 md:hidden">
                  <div className="-rotate-2">
                    <div
                      className={`relative aspect-square w-[min(74vw,320px)] overflow-hidden rounded-[28px] bg-white shadow-[0_25px_50px_-15px_rgba(60,40,10,0.35)] ring-1 ring-black/5 ${
                        isActive ? "hero-image" : ""
                      }`}
                    >
                      <Image
                        src={slide.imgSrc}
                        alt="SGN Costume World logo"
                        fill
                        priority
                        sizes="(max-width: 768px) 74vw, 320px"
                        className="object-contain p-4"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    tabIndex={tab}
                    onClick={() => router.push(slide.href)}
                    className="group inline-flex items-center gap-2 rounded-full bg-[#292624] px-6 py-3.5 text-[13px] font-semibold text-white shadow-[0_12px_25px_-10px_rgba(41,38,36,0.5)] transition-all duration-300 active:scale-[0.98]"
                  >
                    {slide.buttonText}
                    <ArrowIcon />
                  </button>
                </div>
              )}

              {/* LEFT: TEXT (hidden on mobile for the intro slide) */}
              <div
                className={`relative z-20 flex-1 flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 md:px-12 lg:px-16 xl:px-20 ${
                  isIntro ? "hidden md:flex" : "flex"
                } ${isActive ? "hero-text" : ""}`}
              >
                <div className="mb-5 flex items-center gap-2">
                  <span
                    className="h-[6px] w-[6px] rounded-full"
                    style={{ backgroundColor: slide.accent }}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#827A73]">
                    {slide.tag}
                  </span>
                </div>

                <h2
                  className={`max-w-[560px] whitespace-pre-line font-serif leading-[1.03] tracking-[-0.035em] text-[#292624] ${
                    isIntro
                      ? "text-[36px] sm:text-[42px] md:text-[46px] lg:text-[54px] xl:text-[58px]"
                      : "text-[38px] sm:text-[46px] md:text-[52px] lg:text-[60px] xl:text-[64px]"
                  }`}
                >
                  {slide.title}
                </h2>

                <p
                  className={`mt-5 text-[14px] leading-[1.65] text-[#77716B] sm:text-[15px] ${
                    isIntro ? "max-w-[500px]" : "max-w-[440px]"
                  }`}
                >
                  {slide.subtitle}
                </p>

                {isIntro ? (
                  <div className="mt-6 grid max-w-[520px] grid-cols-1 gap-3 sm:grid-cols-3">
                    {slide.highlights.map((item) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-2.5 sm:flex-col sm:gap-2"
                      >
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-[0_6px_16px_-8px_rgba(60,40,10,0.4)]"
                          style={{ color: slide.accent }}
                        >
                          <HighlightIcon name={item.icon} />
                        </span>
                        <span>
                          <span className="block text-[12.5px] font-bold text-[#292624]">
                            {item.title}
                          </span>
                          <span className="block text-[11.5px] leading-snug text-[#827A73]">
                            {item.text}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-medium">
                    <span className="font-bold" style={{ color: slide.accent }}>
                      {slide.offer}
                    </span>
                    {slide.features.map((feature) => (
                      <React.Fragment key={feature}>
                        <span className="text-[#D2CDC7]">·</span>
                        <span className="text-[#827A73]">{feature}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}

                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    tabIndex={tab}
                    onClick={() => router.push(slide.href)}
                    className="group inline-flex items-center gap-2 rounded-full bg-[#292624] px-6 py-3.5 text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(41,38,36,0.18)] active:scale-[0.98]"
                  >
                    {slide.buttonText}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowIcon />
                    </span>
                  </button>

                  {!isIntro && (
                    <button
                      type="button"
                      tabIndex={tab}
                      onClick={() => router.push(slide.href)}
                      className="text-[13px] font-medium text-[#49433E] underline-offset-4 hover:underline"
                    >
                      Learn more
                    </button>
                  )}
                </div>
              </div>

              {/* RIGHT: IMAGE (hidden on mobile for the intro slide) */}
              <div
                className={`relative h-[300px] flex-1 sm:h-[360px] md:h-auto ${
                  isIntro ? "hidden md:block" : ""
                }`}
              >
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-[60px] sm:h-[340px] sm:w-[340px] md:h-[400px] md:w-[400px]"
                  style={{ backgroundColor: slide.accent }}
                />

                {isIntro ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center p-10">
                    {/* Logo in a tilted white card */}
                    <div className="h-full max-h-[380px] -rotate-2">
                      <div
                        className={`relative aspect-square h-full overflow-hidden rounded-[28px] bg-white shadow-[0_25px_50px_-15px_rgba(60,40,10,0.35)] ring-1 ring-black/5 ${
                          isActive ? "hero-image" : ""
                        }`}
                      >
                        <Image
                          src={slide.imgSrc}
                          alt="SGN Costume World logo"
                          fill
                          sizes="380px"
                          className="object-contain p-5"
                        />
                      </div>
                    </div>

                    {/* Floating category buttons */}
                    {slide.categories.map((cat, i) => {
                      const positions = [
                        "left-[2%] top-[12%]",
                        "right-[2%] top-[44%]",
                        "bottom-[10%] left-[6%]",
                      ];
                      return (
                        <button
                          key={cat.label}
                          type="button"
                          tabIndex={tab}
                          onClick={() => router.push(cat.href)}
                          className={`float-pill float-pill-${i + 1} absolute z-20 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11.5px] font-semibold text-[#292624] shadow-[0_12px_28px_-10px_rgba(60,40,10,0.45)] ring-1 ring-black/5 transition-colors hover:bg-[#292624] hover:text-white ${positions[i]}`}
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  slide.imgSrc && (
                    <Image
                      src={slide.imgSrc}
                      alt={slide.tag}
                      fill
                      priority={index === 1}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`z-10 object-contain p-4 drop-shadow-[0_25px_35px_rgba(0,0,0,0.16)] sm:p-6 md:p-8 lg:p-10 ${
                        isActive ? "hero-image" : ""
                      }`}
                    />
                  )
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="relative z-30 flex items-center justify-between border-t border-[#292624]/[0.07] bg-[#F8F6F3] px-5 py-3.5 sm:px-8">
        <span className="text-[11px] font-medium tabular-nums text-[#77716B]">
          {String(currentSlide + 1).padStart(2, "0")}
          <span className="mx-1 text-[#D2CDC7]">/</span>
          {String(sliderData.length).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-2">
          {sliderData.map((slide, index) => {
            const isActive = currentSlide === index;
            const expanded = isActive || hoveredDot === index;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(index)}
                onMouseEnter={() => setHoveredDot(index)}
                onMouseLeave={() => setHoveredDot(null)}
                aria-label={`Go to ${slide.tag} slide`}
                aria-current={isActive ? "true" : undefined}
                className="dot-pill relative flex items-center justify-center overflow-hidden rounded-full"
                style={{
                  width: expanded ? "auto" : "7px",
                  minWidth: "7px",
                  height: expanded ? "25px" : "7px",
                  backgroundColor: isActive ? `${slide.accent}22` : "#29262414",
                  paddingLeft: expanded ? "10px" : "0px",
                  paddingRight: expanded ? "10px" : "0px",
                }}
              >
                {isActive && (
                  <span
                    key={currentSlide}
                    className="progress-fill absolute inset-y-0 left-0 rounded-full opacity-40"
                    onAnimationEnd={() =>
                      setCurrentSlide((prev) => (prev + 1) % sliderData.length)
                    }
                    style={{
                      backgroundColor: slide.accent,
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                  />
                )}

                <span
                  className="dot-label relative whitespace-nowrap text-[10px] font-medium"
                  style={{
                    color: isActive ? slide.accent : "#77716B",
                    opacity: expanded ? 1 : 0,
                    maxWidth: expanded ? "180px" : "0px",
                  }}
                >
                  {slide.tag}
                </span>
              </button>
            );
          })}
        </div>

        <span className="hidden min-w-[55px] justify-end text-[10px] font-medium text-[#77716B]/70 sm:flex">
          {isPaused ? "Paused" : "Auto"}
        </span>
      </div>
    </section>
  );
};

export default HeaderSlider;