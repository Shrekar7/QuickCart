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
    accent: "#E8578E",
  },
  {
    id: 2,
    name: "Animals & Birds",
    image: assets.animal_birds_poster,
    href: "/category/animals-and-birds",
    description: "Wild & wonderful",
    accent: "#2E7D6B",
  },
  {
    id: 3,
    name: "Indian State & Dance",
    image: assets.indian_state_poster,
    href: "/category/indian-state-and-dance",
    description: "Culture & tradition",
    accent: "#F5B700",
  },
  {
    id: 4,
    name: "Superhero",
    image: assets.superhero_poster,
    href: "/category/superhero",
    description: "Heroes & legends",
    accent: "#8B5CF6",
  },
  {
    id: 5,
    name: "Fairy Tale & Fantasy",
    image: assets.fairytale_poster,
    href: "/category/fairy-tale-and-fantasy",
    description: "Dreams & magic",
    accent: "#E8578E",
  },
  {
    id: 6,
    name: "Profession Dress-up",
    image: assets.service_poster,
    href: "/category/profession-dress-up",
    description: "Future starts here",
    accent: "#8B5CF6",
  },
  {
    id: 7,
    name: "Historical & Mythology",
    image: assets.History,
    href: "/category/historical-and-mythology",
    description: "Stories of the past",
    accent: "#F5B700",
  },
  {
    id: 8,
    name: "Sports & Team Wear",
    image: assets.Sports_poster,
    href: "/category/sports-and-team-wear",
    description: "Play your part",
    accent: "#2E7D6B",
  },
];

/* ============================================================
   ARROW ICON
============================================================ */

const ArrowIcon = ({ direction = "right" }) => (
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
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="1.8"
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
        "18"
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
          "18"
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

    const cards =
      container.querySelectorAll(
        "[data-category-card]"
      );

    const card = cards[index];

    if (!card) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  return (
    <section
      className="
        relative
        w-full
        mt-8
        sm:mt-10
        md:mt-12
        pb-8
        md:pb-12
      "
    >
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
          bg-white
          border
          border-[#EEE9F2]
          py-10
          sm:py-12
          md:py-14
        "
      >

        {/* ==================================================
            DECORATIVE BACKGROUND
        =================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -top-32
            -left-24
            h-[300px]
            w-[300px]
            rounded-full
            bg-[#F5B700]/[0.08]
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            top-20
            h-[340px]
            w-[340px]
            rounded-full
            bg-[#8B5CF6]/[0.07]
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-150px]
            left-[38%]
            h-[320px]
            w-[320px]
            rounded-full
            bg-[#E8578E]/[0.06]
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

          {/* SMALL BRAND LABEL */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#E9E1F0]
              bg-[#FAF8FC]
              px-4
              py-2
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#F5B700]
              "
            />

            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-[#766A82]
              "
            >
              Explore Sunshine
            </span>

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#E8578E]
              "
            />
          </div>

          {/* HEADING */}

          <h2
            className="
              mt-5
              font-serif
              text-[34px]
              leading-[1.02]
              tracking-[-0.04em]
              text-[#2E1A47]

              sm:text-[40px]
              md:text-[48px]
              lg:text-[52px]
            "
          >
            Find their next
            <span
              className="
                ml-2
                italic
                text-[#8B5CF6]
              "
            >
              adventure.
            </span>
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-4
              max-w-[520px]
              text-[13px]
              leading-6
              text-[#81748F]
              sm:text-[14px]
            "
          >
            From superheroes and princesses to
            animals, professions and traditions —
            there's a costume for every imagination.
          </p>

        </div>

        {/* ==================================================
            CAROUSEL
        =================================================== */}

        <div
          className="
            relative
            z-10
            mt-9
            sm:mt-10
            md:mt-12
          "
        >

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
              left-4
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
              border-[#E5DFEA]
              bg-white
              text-[#4C4057]
              shadow-[0_10px_28px_rgba(46,26,71,0.10)]
              transition-all
              duration-300
              hover:-translate-y-[calc(50%+2px)]
              hover:bg-[#2E1A47]
              hover:text-white
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
              right-4
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
              border-[#E5DFEA]
              bg-white
              text-[#4C4057]
              shadow-[0_10px_28px_rgba(46,26,71,0.10)]
              transition-all
              duration-300
              hover:-translate-y-[calc(50%+2px)]
              hover:bg-[#2E1A47]
              hover:text-white
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
              w-8
              bg-gradient-to-r
              from-white
              to-transparent
              sm:w-12
              md:w-20
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
              w-8
              bg-gradient-to-l
              from-white
              to-transparent
              sm:w-12
              md:w-20
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
              pb-4
              snap-x
              snap-mandatory
              scroll-smooth
              overscroll-x-contain

              sm:gap-5
              sm:px-8

              md:px-14

              lg:px-16

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
                    aspect-[0.76]
                    w-[178px]
                    shrink-0
                    cursor-pointer
                    snap-start
                    overflow-hidden
                    rounded-[22px]
                    bg-[#E9E5EC]
                    shadow-[0_7px_22px_rgba(46,26,71,0.09)]
                    ring-1
                    ring-black/[0.04]
                    transition-all
                    duration-500

                    hover:-translate-y-2
                    hover:shadow-[0_20px_40px_rgba(46,26,71,0.17)]

                    sm:w-[195px]
                    sm:rounded-[24px]

                    md:w-[210px]

                    lg:w-[220px]
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
                        (max-width: 640px) 178px,
                        (max-width: 768px) 195px,
                        (max-width: 1024px) 210px,
                        220px
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-[800ms]
                        ease-out
                        group-hover:scale-[1.07]
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
                        bg-[#E9E5EC]
                        text-xs
                        text-[#81748F]
                      "
                    >
                      No image
                    </div>
                  )}

                  {/* ==================================================
                      DARK IMAGE OVERLAY
                  =================================================== */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#1E1528]/90
                      via-[#1E1528]/15
                      to-transparent
                    "
                  />

                  {/* ==================================================
                      TOP SHINE
                  =================================================== */}

                  <div
                    className="
                      absolute
                      inset-x-0
                      top-0
                      h-28
                      bg-gradient-to-b
                      from-white/[0.15]
                      to-transparent
                    "
                  />

                  {/* ==================================================
                      NUMBER
                  =================================================== */}

                  <div
                    className="
                      absolute
                      left-3.5
                      top-3.5
                      flex
                      h-7
                      min-w-7
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
                        text-[8px]
                        font-bold
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
                      ACCENT DOT
                  =================================================== */}

                  <div
                    className="
                      absolute
                      right-4
                      top-4
                      h-2
                      w-2
                      rounded-full
                      opacity-90
                    "
                    style={{
                      background:
                        category.accent,
                    }}
                  />

                  {/* ==================================================
                      ARROW
                  =================================================== */}

                  <div
                    className="
                      absolute
                      right-3.5
                      top-12
                      flex
                      h-8
                      w-8
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
                      p-4
                      sm:p-5
                    "
                  >

                    {/* ACCENT LINE */}

                    <div
                      className="
                        mb-3
                        h-1
                        w-7
                        rounded-full
                        transition-all
                        duration-500
                        group-hover:w-12
                      "
                      style={{
                        background:
                          category.accent,
                      }}
                    />

                    {/* CATEGORY NAME */}

                    <p
                      className="
                        font-serif
                        text-[18px]
                        font-medium
                        leading-[1.08]
                        tracking-[-0.025em]
                        text-white

                        sm:text-[19px]
                      "
                    >
                      {category.name}
                    </p>

                    {/* DESCRIPTION */}

                    <p
                      className="
                        mt-1.5
                        text-[9px]
                        font-medium
                        tracking-[0.04em]
                        text-white/65

                        sm:text-[10px]
                      "
                    >
                      {category.description}
                    </p>

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
                        ? "w-7 bg-[#8B5CF6]"
                        : "w-1.5 bg-[#D7D0DD] hover:bg-[#B7AFC0]"
                    }
                  `}
                />
              )
            )}
          </div>
        </div>

        {/* ==================================================
            BOTTOM CTA
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

          <span
            className="
              h-px
              w-8
              bg-[#E5DFEA]
              sm:w-12
            "
          />

          <span
            className="
              text-center
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[#968A9E]
              sm:text-[10px]
            "
          >
            Pick a character. Make it yours.
          </span>

          <span
            className="
              h-px
              w-8
              bg-[#E5DFEA]
              sm:w-12
            "
          />

        </div>

      </div>
    </section>
  );
};

export default CategorySection;