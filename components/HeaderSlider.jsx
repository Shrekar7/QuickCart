"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeaderSlider = () => {
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDot, setHoveredDot] = useState(null);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  /* ============================================================
     AUTO SLIDE
  ============================================================ */

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % sliderData.length
      );
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [isPaused]);

  /* ============================================================
     CHANGE SLIDE
  ============================================================ */

  const handleSlideChange = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  /* ============================================================
     TOUCH
  ============================================================ */

  const handleTouchStart = (e) => {
    touchStartX.current =
      e.touches[0].clientX;

    touchEndX.current = null;

    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current =
      e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      setIsPaused(false);
      return;
    }

    const distance =
      touchStartX.current -
      touchEndX.current;

    const minimumSwipeDistance = 50;

    if (
      Math.abs(distance) >=
      minimumSwipeDistance
    ) {
      if (distance > 0) {
        setCurrentSlide(
          (prev) =>
            (prev + 1) %
            sliderData.length
        );
      } else {
        setCurrentSlide(
          (prev) =>
            (prev - 1 + sliderData.length) %
            sliderData.length
        );
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;

    setTimeout(
      () => setIsPaused(false),
      500
    );
  };

  const active =
    sliderData[currentSlide];

  return (
    <section
      className="
        relative
        mt-5
        w-full
        overflow-hidden
        rounded-[26px]
        sm:rounded-[30px]
        md:rounded-[34px]
        bg-[#F8F6F3]
        border
        border-[#E8E2DB]
      "
      onMouseEnter={() =>
        setIsPaused(true)
      }
      onMouseLeave={() =>
        setIsPaused(false)
      }
      style={{
        "--accent": active.accent,
      }}
    >
      {/* ============================================================
          ANIMATIONS
      ============================================================ */}

      <style>{`

        @keyframes heroImageIn {
          0% {
            opacity: 0;
            transform:
              translateX(35px)
              scale(0.92);
          }

          100% {
            opacity: 1;
            transform:
              translateX(0)
              scale(1);
          }
        }

        @keyframes textFadeIn {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progressFill {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }

        .hero-image {
          animation:
            heroImageIn
            900ms
            ${EASE}
            both;
        }

        .hero-text > * {
          animation:
            textFadeIn
            700ms
            ${EASE}
            both;
        }

        .hero-text > *:nth-child(1) {
          animation-delay: 40ms;
        }

        .hero-text > *:nth-child(2) {
          animation-delay: 90ms;
        }

        .hero-text > *:nth-child(3) {
          animation-delay: 150ms;
        }

        .hero-text > *:nth-child(4) {
          animation-delay: 200ms;
        }

        .hero-text > *:nth-child(5) {
          animation-delay: 250ms;
        }

        .progress-fill {
          animation:
            progressFill
            ${SLIDE_DURATION}ms
            linear
            forwards;
        }

        .dot-pill {
          transition:
            width 420ms ${EASE},
            background-color 300ms ease;
        }

        .dot-label {
          transition:
            opacity 250ms ease,
            max-width 420ms ${EASE};
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

      {/* ============================================================
          SLIDES
      ============================================================ */}

      <div
        className="
          relative
          flex
          touch-pan-y
          transition-transform
          duration-[900ms]
        "
        style={{
          transform:
            `translateX(-${currentSlide * 100}%)`,
          transitionTimingFunction: EASE,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {sliderData.map(
          (slide, index) => (
            <article
              key={slide.id}
              className="
                relative
                flex
                min-w-full
                flex-col
                overflow-hidden

                md:h-[500px]
                md:flex-row
              "
              aria-hidden={
                currentSlide !== index
              }
            >

              {/* ======================================================
                  SOFT BACKGROUND ACCENT
              ======================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  right-[-100px]
                  top-1/2
                  h-[500px]
                  w-[500px]
                  -translate-y-1/2
                  rounded-full
                  opacity-[0.07]
                  blur-[80px]
                "
                style={{
                  backgroundColor:
                    slide.accent,
                }}
              />

              {/* ======================================================
                  LEFT — TEXT
              ======================================================= */}

              <div
                className={`
                  relative
                  z-20
                  flex
                  flex-1
                  flex-col
                  justify-center

                  px-6
                  py-12

                  sm:px-10
                  sm:py-14

                  md:px-12
                  lg:px-16
                  xl:px-20

                  ${
                    currentSlide === index
                      ? "hero-text"
                      : ""
                  }
                `}
              >

                {/* EYEBROW */}

                <div
                  className="
                    mb-5
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      h-[6px]
                      w-[6px]
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        slide.accent,
                    }}
                  />

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-[#827A73]
                    "
                  >
                    {slide.tag}
                  </span>
                </div>

                {/* TITLE */}

                <h1
                  className="
                    max-w-[560px]
                    whitespace-pre-line
                    font-serif

                    text-[38px]
                    leading-[1.03]
                    tracking-[-0.035em]
                    text-[#292624]

                    sm:text-[46px]

                    md:text-[52px]

                    lg:text-[60px]

                    xl:text-[64px]
                  "
                >
                  {slide.title}
                </h1>

                {/* SUBTITLE */}

                <p
                  className="
                    mt-5
                    max-w-[440px]
                    text-[14px]
                    leading-[1.65]
                    text-[#77716B]

                    sm:text-[15px]
                  "
                >
                  {slide.subtitle}
                </p>

                {/* OFFER */}

                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    items-center
                    gap-x-3
                    gap-y-2
                    text-[12px]
                    font-medium
                  "
                >
                  <span
                    style={{
                      color:
                        slide.accent,
                    }}
                  >
                    {slide.offer}
                  </span>

                  {slide.features.map(
                    (feature) => (
                      <React.Fragment
                        key={feature}
                      >
                        <span className="text-[#D2CDC7]">
                          ·
                        </span>

                        <span className="text-[#827A73]">
                          {feature}
                        </span>
                      </React.Fragment>
                    )
                  )}
                </div>

                {/* CTA */}

                <div
                  className="
                    mt-7
                    flex
                    items-center
                    gap-5
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        slide.href
                      )
                    }
                    className="
                      group
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-[#292624]
                      px-6
                      py-3.5
                      text-[13px]
                      font-semibold
                      text-white
                      transition-all
                      duration-300

                      hover:-translate-y-0.5
                      hover:shadow-[0_12px_25px_rgba(41,38,36,0.18)]

                      active:scale-[0.98]
                    "
                  >
                    {slide.buttonText}

                    <span
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    >
                      <ArrowIcon />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        slide.href
                      )
                    }
                    className="
                      text-[13px]
                      font-medium
                      text-[#49433E]
                      underline-offset-4
                      hover:underline
                    "
                  >
                    Learn more
                  </button>

                </div>

              </div>

              {/* ======================================================
                  RIGHT — LARGE IMAGE
              ======================================================= */}

              <div
                className="
                  relative
                  flex-1

                  h-[330px]

                  sm:h-[380px]

                  md:h-auto
                  md:min-h-[500px]
                "
              >

                {/* LARGE SOFT GLOW */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-[8%]
                    top-1/2
                    h-[320px]
                    w-[320px]
                    -translate-y-1/2
                    rounded-full
                    opacity-[0.12]
                    blur-[70px]

                    sm:h-[400px]
                    sm:w-[400px]

                    md:h-[460px]
                    md:w-[460px]
                  "
                  style={{
                    backgroundColor:
                      slide.accent,
                  }}
                />

                {/* IMAGE AREA */}

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center

                    md:justify-end
                  "
                >

                  {slide.imgSrc && (
                    <Image
                      key={`${slide.id}-${currentSlide}`}
                      src={slide.imgSrc}
                      alt={slide.tag}
                      width={800}
                      height={800}
                      priority={
                        index === 0
                      }
                      className={`
                        relative
                        z-10

                        h-[115%]
                        w-auto
                        max-w-none

                        object-contain

                        drop-shadow-[0_25px_35px_rgba(0,0,0,0.14)]

                        sm:h-[120%]

                        md:h-[125%]
                        md:max-w-[125%]
                        md:-mr-8

                        lg:h-[130%]
                        lg:max-w-[130%]
                        lg:-mr-12

                        xl:h-[135%]
                        xl:max-w-[135%]
                        xl:-mr-16

                        ${
                          currentSlide ===
                          index
                            ? "hero-image"
                            : ""
                        }
                      `}
                    />
                  )}

                </div>

              </div>

            </article>
          )
        )}
      </div>

      {/* ============================================================
          BOTTOM CONTROLS
      ============================================================ */}

      <div
        className="
          relative
          z-30
          flex
          items-center
          justify-between
          border-t
          border-[#292624]/[0.07]
          px-5
          py-3.5

          sm:px-8
        "
      >

        {/* COUNTER */}

        <span
          className="
            text-[11px]
            font-medium
            tabular-nums
            text-[#77716B]
          "
        >
          {String(
            currentSlide + 1
          ).padStart(2, "0")}

          <span className="mx-1 text-[#D2CDC7]">
            /
          </span>

          {String(
            sliderData.length
          ).padStart(2, "0")}
        </span>

        {/* PAGINATION */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          {sliderData.map(
            (slide, index) => {
              const isActive =
                currentSlide === index;

              const isHovered =
                hoveredDot === index;

              const expanded =
                isActive ||
                isHovered;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() =>
                    handleSlideChange(
                      index
                    )
                  }
                  onMouseEnter={() =>
                    setHoveredDot(
                      index
                    )
                  }
                  onMouseLeave={() =>
                    setHoveredDot(
                      null
                    )
                  }
                  aria-label={`Go to ${slide.tag} slide`}
                  aria-current={
                    isActive
                  }
                  className="
                    dot-pill
                    relative
                    flex
                    h-[7px]
                    items-center
                    overflow-hidden
                    rounded-full
                  "
                  style={{
                    width: expanded
                      ? "auto"
                      : "7px",

                    minWidth: "7px",

                    backgroundColor:
                      isActive
                        ? `${slide.accent}22`
                        : "#29262414",

                    paddingLeft:
                      expanded
                        ? "10px"
                        : "0px",

                    paddingRight:
                      expanded
                        ? "10px"
                        : "0px",

                    height:
                      expanded
                        ? "25px"
                        : "7px",
                  }}
                >

                  {isActive && (
                    <span
                      key={`${currentSlide}-${isPaused}`}
                      className="
                        progress-fill
                        absolute
                        inset-y-0
                        left-0
                        rounded-full
                        opacity-40
                      "
                      style={{
                        backgroundColor:
                          slide.accent,

                        animationPlayState:
                          isPaused
                            ? "paused"
                            : "running",
                      }}
                    />
                  )}

                  <span
                    className="
                      dot-label
                      relative
                      whitespace-nowrap
                      text-[10px]
                      font-medium
                    "
                    style={{
                      color:
                        isActive
                          ? slide.accent
                          : "#77716B",

                      opacity:
                        expanded
                          ? 1
                          : 0,

                      maxWidth:
                        expanded
                          ? "140px"
                          : "0px",
                    }}
                  >
                    {slide.tag}
                  </span>

                </button>
              );
            }
          )}
        </div>

        {/* STATUS */}

        <span
          className="
            hidden
            min-w-[55px]
            justify-end
            text-[10px]
            font-medium
            text-[#77716B]/70
            sm:flex
          "
        >
          {isPaused
            ? "Paused"
            : "Auto"}
        </span>

      </div>

    </section>
  );
};

export default HeaderSlider;