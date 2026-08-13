"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";

/* ============================================================
   CATEGORIES
============================================================ */

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
   ARROW ICON
============================================================ */

const ArrowIcon = ({ direction = "right" }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

/* ============================================================
   CATEGORY SECTION
============================================================ */

const CategorySection = () => {
  const router = useRouter();
  const scrollRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  /* ==========================================================
     SCROLL
  ========================================================== */

  const scrollByAmount = (direction) => {
    const container = scrollRef.current;

    if (!container) return;

    const card = container.querySelector(
      "[data-category-card]"
    );

    if (!card) return;

    const cardWidth =
      card.getBoundingClientRect().width;

    const styles =
      window.getComputedStyle(container);

    const gap = parseFloat(
      styles.columnGap ||
        styles.gap ||
        "20"
    );

    const amount =
      (cardWidth + gap) * 2;

    container.scrollBy({
      left:
        direction === "left"
          ? -amount
          : amount,
      behavior: "smooth",
    });
  };

  /* ==========================================================
     ACTIVE DOT
  ========================================================== */

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const handleScroll = () => {
      const card =
        container.querySelector(
          "[data-category-card]"
        );

      if (!card) return;

      const cardWidth =
        card.getBoundingClientRect().width;

      const styles =
        window.getComputedStyle(container);

      const gap = parseFloat(
        styles.columnGap ||
          styles.gap ||
          "20"
      );

      const index = Math.round(
        container.scrollLeft /
          (cardWidth + gap)
      );

      setActiveIndex(
        Math.max(
          0,
          Math.min(
            index,
            categories.length - 1
          )
        )
      );
    };

    container.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* ==========================================================
     CATEGORY CLICK
  ========================================================== */

  const handleCategoryClick = (href) => {
    router.push(href);
  };

  /* ==========================================================
     GO TO CATEGORY
  ========================================================== */

  const goToCategory = (index) => {
    const container =
      scrollRef.current;

    if (!container) return;

    const card =
      container.querySelector(
        `[data-category-card]:nth-child(${index + 1})`
      );

    if (!card) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  return (
    <section className="relative w-full mt-10 sm:mt-14 md:mt-16 lg:mt-20 pb-10 md:pb-16">

      {/* ======================================================
          MAIN CONTAINER
      ======================================================= */}

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1500px]
          overflow-hidden
          rounded-[28px]
          sm:rounded-[34px]
          md:rounded-[40px]
          border
          border-[#E8E2DB]
          bg-[#F8F6F3]
          py-12
          sm:py-14
          md:py-16
          lg:py-20
        "
      >

        {/* ==================================================
            BACKGROUND
        =================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -top-32
            left-[8%]
            h-80
            w-80
            rounded-full
            bg-[#E9E1EF]/40
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-[-100px]
            top-[30%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#F2E3E8]/35
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-150px]
            left-[35%]
            h-96
            w-96
            rounded-full
            bg-white/80
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
            max-w-3xl
            px-5
            text-center
          "
        >

          {/* SMALL LABEL */}

          <div className="flex items-center justify-center gap-3 mb-5">

            <span className="h-px w-8 bg-[#C8C1B9]" />

            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#827A73]
              "
            >
              Discover
            </span>

            <span className="h-px w-8 bg-[#C8C1B9]" />

          </div>

          {/* HEADING */}

          <h2
            className="
              font-serif
              text-[32px]
              leading-[1.05]
              tracking-[-0.04em]
              text-[#292624]
              sm:text-[38px]
              md:text-[46px]
              lg:text-[52px]
            "
          >
            Dress up.
            <span
              className="
                italic
                text-[#81758B]
              "
            >
              {" "}
              Dream big.
            </span>
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-5
              max-w-xl
              text-[13px]
              leading-6
              text-[#77716B]
              sm:text-[14px]
            "
          >
            Explore magical costumes and unforgettable
            characters made for every little adventure.
          </p>

        </div>

        {/* ==================================================
            CAROUSEL
        =================================================== */}

        <div className="relative z-10 mt-10 sm:mt-12 md:mt-14">

          {/* ==================================================
              LEFT ARROW
          =================================================== */}

          <button
            type="button"
            onClick={() =>
              scrollByAmount("left")
            }
            aria-label="Previous categories"
            className="
              absolute
              left-5
              top-1/2
              z-30
              hidden
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-[#DDD7D0]
              bg-white
              text-[#49433E]
              shadow-[0_10px_30px_rgba(40,35,30,0.08)]
              transition-all
              duration-300
              hover:-translate-y-[calc(50%+2px)]
              hover:bg-[#292624]
              hover:text-white
              hover:shadow-[0_15px_35px_rgba(40,35,30,0.16)]
              lg:flex
            "
          >
            <ArrowIcon direction="left" />
          </button>

          {/* ==================================================
              RIGHT ARROW
          =================================================== */}

          <button
            type="button"
            onClick={() =>
              scrollByAmount("right")
            }
            aria-label="Next categories"
            className="
              absolute
              right-5
              top-1/2
              z-30
              hidden
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-[#DDD7D0]
              bg-white
              text-[#49433E]
              shadow-[0_10px_30px_rgba(40,35,30,0.08)]
              transition-all
              duration-300
              hover:-translate-y-[calc(50%+2px)]
              hover:bg-[#292624]
              hover:text-white
              hover:shadow-[0_15px_35px_rgba(40,35,30,0.16)]
              lg:flex
            "
          >
            <ArrowIcon />
          </button>

          {/* ==================================================
              LEFT FADE
          =================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-20
              w-10
              bg-gradient-to-r
              from-[#F8F6F3]
              to-transparent
              sm:w-16
              md:w-24
            "
          />

          {/* ==================================================
              RIGHT FADE
          =================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              z-20
              w-10
              bg-gradient-to-l
              from-[#F8F6F3]
              to-transparent
              sm:w-16
              md:w-24
            "
          />

          {/* ==================================================
              SCROLL CONTAINER
          =================================================== */}

          <div
            ref={scrollRef}
            className="
              flex
              gap-4
              overflow-x-auto
              px-5
              pb-5
              snap-x
              snap-mandatory
              scroll-smooth
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

            {categories.map(
              (category, index) => (

                <article
                  key={category.id}
                  data-category-card
                  onClick={() =>
                    handleCategoryClick(
                      category.href
                    )
                  }
                  className="
                    group
                    relative
                    aspect-[0.72]
                    w-[190px]
                    shrink-0
                    cursor-pointer
                    snap-start
                    overflow-hidden
                    rounded-[24px]
                    bg-[#DDD8D2]
                    shadow-[0_8px_25px_rgba(45,38,32,0.08)]
                    ring-1
                    ring-black/[0.04]
                    transition-all
                    duration-500

                    hover:-translate-y-2
                    hover:shadow-[0_22px_45px_rgba(45,38,32,0.18)]

                    sm:w-[210px]
                    sm:rounded-[26px]

                    md:w-[225px]

                    lg:w-[235px]
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
                      priority={
                        index < 3
                      }
                      sizes="
                        (max-width: 640px) 190px,
                        (max-width: 768px) 210px,
                        (max-width: 1024px) 225px,
                        235px
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-[900ms]
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
                      IMAGE OVERLAY
                  =================================================== */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/[0.82]
                      via-black/[0.18]
                      to-transparent
                    "
                  />

                  {/* ==================================================
                      TOP LIGHT
                  =================================================== */}

                  <div
                    className="
                      absolute
                      inset-x-0
                      top-0
                      h-32
                      bg-gradient-to-b
                      from-white/[0.12]
                      to-transparent
                    "
                  />

                  {/* ==================================================
                      NUMBER
                  =================================================== */}

                  <div
                    className="
                      absolute
                      left-4
                      top-4
                      flex
                      h-8
                      min-w-8
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/20
                      bg-black/15
                      px-2
                      backdrop-blur-md
                    "
                  >

                    <span
                      className="
                        text-[9px]
                        font-semibold
                        tracking-[0.12em]
                        text-white
                      "
                    >
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                  </div>

                  {/* ==================================================
                      ARROW
                  =================================================== */}

                  <div
                    className="
                      absolute
                      right-4
                      top-4
                      flex
                      h-9
                      w-9
                      translate-y-1
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/20
                      bg-white/10
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
                      CONTENT
                  =================================================== */}

                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      p-5
                    "
                  >

                    <p
                      className="
                        font-serif
                        text-[20px]
                        font-medium
                        leading-[1.08]
                        tracking-[-0.025em]
                        text-white
                        sm:text-[21px]
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

                    {/* UNDERLINE */}

                    <div
                      className="
                        mt-3
                        h-px
                        w-7
                        bg-white/70
                        transition-all
                        duration-500
                        group-hover:w-14
                      "
                    />

                  </div>

                </article>

              )
            )}

          </div>

          {/* ==================================================
              DOTS
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

            {categories.map(
              (category, index) => (

                <button
                  key={category.id}
                  type="button"
                  aria-label={`Go to ${category.name}`}
                  onClick={() =>
                    goToCategory(index)
                  }
                  className={`
                    h-1.5
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      index ===
                      activeIndex
                        ? "w-7 bg-[#5B5550]"
                        : "w-1.5 bg-[#C9C3BC] hover:bg-[#9E968E]"
                    }
                  `}
                />

              )
            )}

          </div>

        </div>

        {/* ==================================================
            BOTTOM STATEMENT
        =================================================== */}

        <div
          className="
            relative
            z-10
            mt-8
            flex
            items-center
            justify-center
            gap-3
            px-5
            md:mt-10
          "
        >

          <span className="h-px w-8 bg-[#D7D1C9] sm:w-12" />

          <span
            className="
              text-center
              text-[9px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-[#918981]
              sm:text-[10px]
            "
          >
            Something for every imagination
          </span>

          <span className="h-px w-8 bg-[#D7D1C9] sm:w-12" />

        </div>

      </div>

    </section>
  );
};

export default CategorySection;