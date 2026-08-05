"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();

  return (
    <section className="relative w-full overflow-hidden bg-[#FFFDFB] pt-16 pb-6 md:pt-24 md:pb-8">
      {/* =========================================
          SOFT BACKGROUND DETAILS
      ========================================== */}

      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#EDE7F7]/40 blur-3xl" />

      <div className="pointer-events-none absolute right-[-120px] top-1/3 h-64 w-64 rounded-full bg-[#F8E8EE]/35 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-120px] left-[-100px] h-72 w-72 rounded-full bg-[#EEEAF8]/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12 xl:px-16">
        {/* =========================================
            SECTION HEADER
        ========================================== */}

        <div className="mb-10 flex flex-col md:mb-14">
          {/* Small label */}

          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#B9A7D8]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#806B9D]">
              Our favourites
            </span>

            <span className="h-px w-8 bg-[#B9A7D8]" />
          </div>

          {/* Title */}

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="max-w-xl font-serif text-3xl leading-tight tracking-[-0.025em] text-[#29222F] sm:text-4xl md:text-[42px]">
                Costumes kids
                <span className="text-[#8B75A8]"> love.</span>
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#756C78] sm:text-base">
                A little collection of our most-loved costumes, picked
                especially for magical moments and memorable days.
              </p>
            </div>

            {/* Desktop mini link */}

            <button
              type="button"
              onClick={() => router.push("/all-products")}
              className="group hidden items-center gap-2 pb-1 text-sm font-medium text-[#5E5364] transition-colors hover:text-[#806B9D] md:flex"
            >
              Explore collection

              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* =========================================
            PRODUCT GRID
        ========================================== */}

        {products?.length > 0 ? (
          <div
            className="
              grid
              grid-cols-2
              gap-x-3
              gap-y-9
              sm:gap-x-5
              sm:gap-y-11
              md:grid-cols-3
              md:gap-x-6
              lg:grid-cols-4
              lg:gap-x-7
              xl:grid-cols-5
              xl:gap-x-8
            "
          >
            {products.slice(0, 10).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[240px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 rounded-full border border-[#E7E0ED] bg-white" />

              <p className="text-sm text-[#756C78]">
                No products to show yet.
              </p>
            </div>
          </div>
        )}

        {/* =========================================
            BOTTOM CTA
        ========================================== */}

        <div className="mt-10 flex justify-center md:mt-12">
          <button
            type="button"
            onClick={() => router.push("/all-products")}
            className="
              group
              flex
              items-center
              gap-3
              rounded-full
              border
              border-[#DED7E5]
              bg-white
              px-7
              py-3
              text-sm
              font-medium
              text-[#4E4655]
              shadow-[0_5px_20px_rgba(50,40,60,0.04)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-[#BDAED0]
              hover:shadow-[0_10px_30px_rgba(50,40,60,0.08)]
            "
          >
            View all costumes

            <span
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-[#F3EFF7]
                transition-colors
                duration-300
                group-hover:bg-[#EAE2F2]
              "
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeProducts;