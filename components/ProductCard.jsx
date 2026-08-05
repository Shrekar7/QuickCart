"use client";

import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();

  const averageRating = product.averageRating || 0;
  const reviewCount = product.reviewCount || 0;

  const handleProductClick = () => {
    router.push("/product/" + product._id);
    window.scrollTo(0, 0);
  };

  return (
    <div
      onClick={handleProductClick}
      className="
        group
        flex
        w-full
        max-w-[240px]
        cursor-pointer
        flex-col
      "
    >
      {/* =====================================================
          PRODUCT IMAGE
      ====================================================== */}

      <div
        className="
          relative
          flex
          h-56
          w-full
          items-center
          justify-center
          overflow-hidden
          rounded-[22px]
          border
          border-[#ECE8E1]
          bg-[#F8F6F2]
          transition-all
          duration-500
          group-hover:border-[#DDD4E4]
          group-hover:shadow-[0_18px_40px_rgba(55,42,68,0.08)]
          sm:h-60
          md:h-64
        "
      >
        {/* Soft background decoration */}

        <div
          className="
            pointer-events-none
            absolute
            -bottom-16
            -left-10
            h-32
            w-32
            rounded-full
            bg-[#EEE8F1]
            opacity-40
            blur-3xl
            transition-all
            duration-500
            group-hover:opacity-70
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-10
            -top-10
            h-28
            w-28
            rounded-full
            bg-[#F3E8EC]
            opacity-30
            blur-3xl
          "
        />

        {/* Product image */}

        <Image
          src={product.image[0]}
          alt={product.name}
          width={800}
          height={800}
          className="
            relative
            z-10
            h-4/5
            w-4/5
            object-contain
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.06]
            md:h-full
            md:w-full
          "
        />

        {/* =================================================
            HEART BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label="Add to wishlist"
          className="
            absolute
            right-3
            top-3
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-white
            bg-white/90
            shadow-[0_5px_18px_rgba(40,30,20,0.08)]
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-105
            hover:bg-white
          "
        >
          <Image
            src={assets.heart_icon}
            alt="heart"
            width={15}
            height={15}
            className="
              h-[15px]
              w-[15px]
              opacity-55
              transition-opacity
              duration-300
              group-hover:opacity-80
            "
          />
        </button>

        {/* =================================================
            HOVER VIEW BUTTON
        ================================================== */}

        <div
          className="
            absolute
            bottom-3
            left-3
            right-3
            z-20
            translate-y-2
            opacity-0
            transition-all
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#302921]/95
              px-4
              py-2.5
              text-[11px]
              font-semibold
              tracking-wide
              text-white
              shadow-lg
            "
          >
            View costume

            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* =====================================================
          PRODUCT DETAILS
      ====================================================== */}

      <div className="px-1 pt-3">

        {/* Category */}

        {product.category && (
          <p
            className="
              mb-1.5
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#918598]
            "
          >
            {product.category}
          </p>
        )}

        {/* Product name */}

        <p
          className="
            w-full
            truncate
            text-[13px]
            font-semibold
            leading-snug
            text-[#302921]
            transition-colors
            duration-300
            group-hover:text-[#776584]
            sm:text-[14px]
          "
        >
          {product.name}
        </p>

        {/* Description */}

        <p
          className="
            mt-1
            hidden
            w-full
            truncate
            text-[11px]
            leading-relaxed
            text-[#958B80]
            sm:block
          "
        >
          {product.description}
        </p>

        {/* =================================================
            RATING
        ================================================== */}

        <div className="mt-2.5 flex items-center gap-1.5">
          {reviewCount > 0 ? (
            <>
              <span className="text-[10px] font-medium text-[#71675F]">
                {averageRating}
              </span>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Image
                    key={index}
                    className="h-3 w-3"
                    src={
                      index < Math.round(averageRating)
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    alt="star"
                  />
                ))}
              </div>

              <span className="text-[10px] text-[#A49A90]">
                ({reviewCount})
              </span>
            </>
          ) : (
            <span className="text-[10px] text-[#A49A90]">
              No reviews yet
            </span>
          )}
        </div>

        {/* =================================================
            PRICE
        ================================================== */}

        <div className="mt-2 flex w-full items-center justify-between">
          <p
            className="
              text-[15px]
              font-semibold
              tracking-tight
              text-[#302921]
              sm:text-[16px]
            "
          >
            {currency}
            {product.offerPrice}
          </p>

          {/* Small arrow */}

          <div
            className="
              hidden
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-[#F1EDF4]
              text-[#776584]
              opacity-0
              transition-all
              duration-300
              group-hover:opacity-100
              sm:flex
            "
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;