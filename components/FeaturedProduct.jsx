"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";

const categories = [
  {
    id: 1,
    name: "Halloween",
    image: assets.Poster_halloween,
    href: "/category/halloween",
    description: "Spooky & fun",
  },
  {
    id: 2,
    name: "Animals & Birds",
    image: assets.animal_birds_poster,
    href: "/category/animals-and-birds",
    description: "Wild & wonderful",
  },
  {
    id: 3,
    name: "Indian State & Dance",
    image: assets.indian_state_poster,
    href: "/category/indian-state-and-dance",
    description: "Culture & tradition",
  },
  {
    id: 4,
    name: "Superhero",
    image: assets.superhero_poster,
    href: "/category/superhero",
    description: "Heroes & legends",
  },
  {
    id: 5,
    name: "Fairy Tale & Fantasy",
    image: assets.fairytale_poster,
    href: "/category/fairy-tale-and-fantasy",
    description: "Dreams & magic",
  },
  {
    id: 6,
    name: "Profession Dress-up",
    image: assets.service_poster,
    href: "/category/profession-dress-up",
    description: "Future starts here",
  },
  {
    id: 7,
    name: "Historical & Mythology",
    image: assets.History,
    href: "/category/historical-and-mythology",
    description: "Stories of the past",
  },
  {
    id: 8,
    name: "Sports & Team Wear",
    image: assets.Sports_poster,
    href: "/category/sports-and-team-wear",
    description: "Play your part",
  },
];

/* ============================================================
   ARROW
============================================================ */

const ArrowIcon = ({ direction = "right" }) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    {direction === "left" ? (
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

/* ============================================================
   CATEGORY SECTION
============================================================ */

const CategorySection = () => {
  const router = useRouter();
  const scrollRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  /* ----------------------------------------------------------
     SCROLL
  ---------------------------------------------------------- */

  const scrollByAmount = (direction) => {
    const container = scrollRef.current;

    if (!container) return;

    const card = container.querySelector("[data-category-card]");

    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width;

    const styles = window.getComputedStyle(container);
    const gap = parseFloat(styles.columnGap || styles.gap || "20");

    const amount = (cardWidth + gap) * 2;

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  /* ----------------------------------------------------------
     ACTIVE DOT
  ---------------------------------------------------------- */

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const handleScroll = () => {
      const card = container.querySelector("[data-category-card]");

      if (!card) return;

      const cardWidth = card.getBoundingClientRect().width;

      const styles = window.getComputedStyle(container);
      const gap = parseFloat(styles.columnGap || styles.gap || "20");

      const index = Math.round(
        container.scrollLeft / (cardWidth + gap)
      );

      setActiveIndex(
        Math.max(0, Math.min(index, categories.length - 1))
      );
    };

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ----------------------------------------------------------
     CATEGORY CLICK
  ---------------------------------------------------------- */

  const handleCategoryClick = (href) => {
    router.push(href);
  };

  return (
    <section
      className="
        relative
        w-full
        mt-8
        sm:mt-10
        md:mt-12
        lg:mt-14
        pb-8
        md:pb-12
      "
    >
      {/* ======================================================
          SECTION
      ======================================================= */}

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1500px]
          overflow-hidden
          rounded-[30px]
          md:rounded-[38px]
          bg-[#F7F5F2]
          border border-[#ECE8E2]
          py-12
          sm:py-14
          md:py-16
          lg:py-20
        "
      >
        {/* ==================================================
            BACKGROUND ATMOSPHERE
        =================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -top-40
            left-[15%]
            h-80
            w-80
            rounded-full
            bg-[#E8E2F0]/45
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-40
            top-[35%]
            h-96
            w-96
            rounded-full
            bg-[#F1E4E8]/35
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-40
            left-1/3
            h-80
            w-80
            rounded-full
            bg-white/70
            blur-3xl
          "
        />

        {/* ==================================================
            HEADER
        =================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-2xl
            px-5
            text-center
          "
        >
          {/* Eyebrow */}

          <div
            className="
              mb-4
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <span className="h-px w-7 bg-[#C9C2BA]" />

            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.24em]
                text-[#817A73]
              "
            >
              Explore
            </span>

            <span className="h-px w-7 bg-[#C9C2BA]" />
          </div>

          {/* Main heading */}

          <h2
            className="
              font-serif
              text-[30px]
              leading-[1.08]
              tracking-[-0.035em]
              text-[#292624]
              sm:text-[34px]
              md:text-[42px]
              lg:text-[48px]
            "
          >
            A costume for
            <span className="text-[#81758B] italic">
              {" "}
              every little story.
            </span>
          </h2>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-[13px]
              leading-6
              text-[#77716B]
              sm:text-[14px]
            "
          >
            From brave superheroes to magical fairies, discover
            a world of characters waiting to be brought to life.
          </p>
        </div>

        {/* ==================================================
            CAROUSEL
        =================================================== */}

        <div className="relative z-10 mt-9 sm:mt-11 md:mt-13">
          {/* ------------------------------------------------
              DESKTOP LEFT
          ------------------------------------------------- */}

          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            aria-label="Previous categories"
            className="
              group
              absolute
              left-5
              top-1/2
              z-30
              hidden
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-[#E2DDD7]
              bg-white/95
              text-[#514B46]
              shadow-[0_8px_25px_rgba(40,35,30,0.08)]
              backdrop-blur-sm
              transition-all
              duration-300
              hover:-translate-y-[calc(50%+2px)]
              hover:bg-[#292624]
              hover:text-white
              hover:shadow-[0_12px_30px_rgba(40,35,30,0.15)]
              lg:flex
            "
          >
            <ArrowIcon direction="left" />
          </button>

          {/* ------------------------------------------------
              DESKTOP RIGHT
          ------------------------------------------------- */}

          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            aria-label="Next categories"
            className="
              group
              absolute
              right-5
              top-1/2
              z-30
              hidden
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-[#E2DDD7]
              bg-white/95
              text-[#514B46]
              shadow-[0_8px_25px_rgba(40,35,30,0.08)]
              backdrop-blur-sm
              transition-all
              duration-300
              hover:-translate-y-[calc(50%+2px)]
              hover:bg-[#292624]
              hover:text-white
              hover:shadow-[0_12px_30px_rgba(40,35,30,0.15)]
              lg:flex
            "
          >
            <ArrowIcon />
          </button>

          {/* ------------------------------------------------
              EDGE FADES
          ------------------------------------------------- */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-20
              w-10
              bg-gradient-to-r
              from-[#F7F5F2]
              to-transparent
              sm:w-14
              md:w-20
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              z-20
              w-10
              bg-gradient-to-l
              from-[#F7F5F2]
              to-transparent
              sm:w-14
              md:w-20
            "
          />

          {/* ------------------------------------------------
              SCROLL AREA
          ------------------------------------------------- */}

          <div
            ref={scrollRef}
            className="
              flex
              gap-4
              overflow-x-auto
              px-5
              pb-4
              scroll-smooth
              snap-x
              snap-mandatory
              overscroll-x-contain
              sm:gap-5
              sm:px-8
              md:gap-5
              md:px-16
              lg:px-20
              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]
            "
          >
            {categories.map((category, index) => (
              <article
                key={category.id}
                data-category-card
                onClick={() =>
                  handleCategoryClick(category.href)
                }
                className="
                  group
                  relative
                  aspect-[3/4]
                  w-[180px]
                  shrink-0
                  cursor-pointer
                  snap-start
                  overflow-hidden
                  rounded-[22px]
                  bg-[#DDD8D2]
                  shadow-[0_7px_25px_rgba(45,38,32,0.08)]
                  ring-1
                  ring-black/[0.04]
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:shadow-[0_20px_40px_rgba(45,38,32,0.16)]
                  sm:w-[200px]
                  md:w-[215px]
                  lg:w-[225px]
                "
              >
                {/* ==================================================
                    IMAGE
                =================================================== */}

                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    priority={index < 3}
                    sizes="
                      (max-width: 640px) 180px,
                      (max-width: 768px) 200px,
                      (max-width: 1024px) 215px,
                      225px
                    "
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.08]
                    "
                  />
                ) : (
                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-[#DDD8D2]
                      text-xs
                      text-[#817A73]
                    "
                  >
                    No image
                  </div>
                )}

                {/* ==================================================
                    IMAGE DEPTH
                =================================================== */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/[0.78]
                    via-black/[0.08]
                    to-transparent
                  "
                />

                {/* Subtle top shine */}

                <div
                  className="
                    absolute
                    inset-x-0
                    top-0
                    h-24
                    bg-gradient-to-b
                    from-white/[0.12]
                    to-transparent
                    opacity-60
                  "
                />

                {/* Hover atmosphere */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-white/0
                    transition-all
                    duration-500
                    group-hover:bg-white/[0.045]
                  "
                />

                {/* ==================================================
                    TOP CATEGORY LABEL
                =================================================== */}

                <div
                  className="
                    absolute
                    left-3
                    top-3
                    rounded-full
                    border
                    border-white/20
                    bg-black/15
                    px-2.5
                    py-1
                    opacity-80
                    backdrop-blur-md
                    transition-all
                    duration-300
                    group-hover:bg-white/15
                  "
                >
                  <span
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.16em]
                      text-white
                    "
                  >
                    0{index + 1}
                  </span>
                </div>

                {/* ==================================================
                    HOVER ARROW
                =================================================== */}

                <div
                  className="
                    absolute
                    right-3
                    top-3
                    flex
                    h-9
                    w-9
                    translate-y-1
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-white/15
                    text-white
                    opacity-0
                    backdrop-blur-md
                    transition-all
                    duration-300
                    group-hover:translate-y-0
                    group-hover:opacity-100
                  "
                >
                  <ArrowIcon />
                </div>

                {/* ==================================================
                    CARD CONTENT
                =================================================== */}

                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    p-4
                    sm:p-5
                  "
                >
                  <p
                    className="
                      font-serif
                      text-[18px]
                      font-medium
                      leading-[1.08]
                      tracking-[-0.025em]
                      text-white
                      sm:text-[20px]
                    "
                  >
                    {category.name}
                  </p>

                  <p
                    className="
                      mt-1.5
                      text-[10px]
                      tracking-wide
                      text-white/65
                      sm:text-[11px]
                    "
                  >
                    {category.description}
                  </p>

                  {/* Animated line */}

                  <div
                    className="
                      mt-3
                      h-px
                      w-7
                      bg-white/70
                      transition-all
                      duration-500
                      group-hover:w-12
                    "
                  />
                </div>
              </article>
            ))}
          </div>

          {/* ==================================================
              MOBILE DOTS
          =================================================== */}

          <div
            className="
              mt-2
              flex
              items-center
              justify-center
              gap-1.5
              lg:hidden
            "
          >
            {categories.map((category, index) => (
              <button
                key={category.id}
                type="button"
                aria-label={`Go to ${category.name}`}
                onClick={() => {
                  const container = scrollRef.current;

                  if (!container) return;

                  const card = container.querySelector(
                    `[data-category-card]:nth-child(${index + 1})`
                  );

                  if (!card) return;

                  card.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "start",
                  });
                }}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    index === activeIndex
                      ? "w-6 bg-[#5B5550]"
                      : "w-1.5 bg-[#C9C3BC] hover:bg-[#9E968E]"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* ==================================================
            FOOTER STATEMENT
        =================================================== */}

        <div
          className="
            relative
            z-10
            mt-7
            flex
            items-center
            justify-center
            gap-3
            px-5
            md:mt-9
          "
        >
          <span className="h-px w-6 bg-[#D7D1C9] sm:w-10" />

          <span
            className="
              text-center
              text-[9px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-[#918981]
              sm:text-[10px]
            "
          >
            Something for every imagination
          </span>

          <span className="h-px w-6 bg-[#D7D1C9] sm:w-10" />
        </div>
      </div>
    </section>
  );
};

export default CategorySection;