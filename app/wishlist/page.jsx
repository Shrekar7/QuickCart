"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";

const WishlistPage = () => {
  const {
    wishlist,
    products,
    toggleWishlist,
    currency,
    router,
  } = useAppContext();

  // --------------------------------------------------
  // GET WISHLIST PRODUCTS
  // --------------------------------------------------

  const wishlistProducts = products.filter((product) =>
    wishlist?.includes(String(product._id))
  );

  // --------------------------------------------------
  // REMOVE FROM WISHLIST
  // --------------------------------------------------

  const handleRemove = async (productId) => {
    await toggleWishlist(productId);
  };

  // --------------------------------------------------
  // OPEN PRODUCT
  // --------------------------------------------------

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
    window.scrollTo(0, 0);
  };

  return (
    <main className="min-h-screen bg-[#FCFAF7]">
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="px-5 sm:px-8 lg:px-16 xl:px-24 pt-10 pb-8">
        <div className="max-w-[1400px] mx-auto">

          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              text-[12px]
              text-[#8C8175]
              hover:text-[#302921]
              transition-colors
              mb-6
            "
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Continue shopping
          </Link>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  font-semibold
                  text-[#B27B27]
                  mb-2
                "
              >
                Your favourites
              </p>

              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  font-semibold
                  tracking-tight
                  text-[#302921]
                "
              >
                Wishlist
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  text-[#8C8175]
                "
              >
                {wishlistProducts.length === 0
                  ? "Your wishlist is waiting for something special."
                  : `${wishlistProducts.length} ${
                      wishlistProducts.length === 1
                        ? "item"
                        : "items"
                    } saved for later.`}
              </p>
            </div>

            {/* WISHLIST COUNT */}

            {wishlistProducts.length > 0 && (
              <div
                className="
                  hidden
                  sm:flex
                  h-10
                  min-w-10
                  px-3
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F3E8EC]
                  text-[#A95567]
                  text-sm
                  font-semibold
                "
              >
                {wishlistProducts.length}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          WISHLIST CONTENT
      ================================================= */}

      <section className="px-5 sm:px-8 lg:px-16 xl:px-24 pb-20">
        <div className="max-w-[1400px] mx-auto">

          {/* =================================================
              EMPTY WISHLIST
          ================================================= */}

          {wishlistProducts.length === 0 && (
            <div
              className="
                min-h-[420px]
                rounded-[30px]
                border
                border-[#EAE4DA]
                bg-white
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-6
              "
            >
              {/* HEART */}

              <div
                className="
                  w-20
                  h-20
                  rounded-full
                  bg-[#F8F2F4]
                  flex
                  items-center
                  justify-center
                  mb-6
                "
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="
                      M20.84 4.61
                      a5.5 5.5 0 0 0-7.78 0
                      L12 5.67
                      l-1.06-1.06
                      a5.5 5.5 0 0 0-7.78 7.78
                      l1.06 1.06
                      L12 21.23
                      l7.78-7.78
                      1.06-1.06
                      a5.5 5.5 0 0 0 0-7.78Z
                    "
                    stroke="#D96B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2
                className="
                  text-xl
                  font-semibold
                  text-[#302921]
                "
              >
                Your wishlist is empty
              </h2>

              <p
                className="
                  mt-2
                  max-w-sm
                  text-sm
                  leading-relaxed
                  text-[#958B80]
                "
              >
                Save your favourite costumes here
                and come back to them whenever
                you're ready.
              </p>

              <Link
                href="/all-products"
                className="
                  mt-7
                  inline-flex
                  items-center
                  justify-center
                  rounded-full
                  bg-[#302921]
                  px-6
                  py-3
                  text-xs
                  font-semibold
                  tracking-wide
                  text-white
                  hover:bg-[#4A3D33]
                  transition-colors
                "
              >
                Explore costumes
              </Link>
            </div>
          )}

          {/* =================================================
              PRODUCTS
          ================================================= */}

          {wishlistProducts.length > 0 && (
            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4
                gap-x-4
                gap-y-10
                sm:gap-x-6
                lg:gap-x-7
              "
            >
              {wishlistProducts.map((product) => (
                <div
                  key={product._id}
                  className="group relative"
                >
                  {/* =================================================
                      PRODUCT IMAGE
                  ================================================= */}

                  <div
                    className="
                      relative
                      h-56
                      sm:h-64
                      md:h-72
                      w-full
                      overflow-hidden
                      rounded-[22px]
                      border
                      border-[#ECE8E1]
                      bg-[#F8F6F2]
                    "
                  >
                    {/* IMAGE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleProductClick(
                          product._id
                        )
                      }
                      className="
                        absolute
                        inset-0
                        z-10
                        flex
                        items-center
                        justify-center
                        cursor-pointer
                      "
                    >
                      {product.image?.[0] ? (
                        <Image
                          src={product.image[0]}
                          alt={product.name}
                          width={700}
                          height={700}
                          className="
                            h-full
                            w-full
                            object-contain
                            transition-transform
                            duration-500
                            group-hover:scale-[1.05]
                          "
                        />
                      ) : (
                        <span className="text-sm text-[#958B80]">
                          No image
                        </span>
                      )}
                    </button>

                    {/* REMOVE BUTTON */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(product._id)
                      }
                      aria-label={`Remove ${product.name} from wishlist`}
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
                        bg-white/95
                        border
                        border-white
                        text-[#D96B7A]
                        shadow-[0_5px_18px_rgba(40,30,20,0.08)]
                        backdrop-blur-md
                        transition-all
                        duration-300
                        hover:scale-105
                        hover:bg-[#FFF5F6]
                      "
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="
                            M20.84 4.61
                            a5.5 5.5 0 0 0-7.78 0
                            L12 5.67
                            l-1.06-1.06
                            a5.5 5.5 0 0 0-7.78 7.78
                            l1.06 1.06
                            L12 21.23
                            l7.78-7.78
                            1.06-1.06
                            a5.5 5.5 0 0 0 0-7.78Z
                          "
                        />
                      </svg>
                    </button>
                  </div>

                  {/* =================================================
                      PRODUCT DETAILS
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      handleProductClick(
                        product._id
                      )
                    }
                    className="
                      mt-3
                      w-full
                      text-left
                    "
                  >
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

                    <p
                      className="
                        truncate
                        text-[13px]
                        sm:text-[14px]
                        font-semibold
                        leading-snug
                        text-[#302921]
                        group-hover:text-[#776584]
                        transition-colors
                      "
                    >
                      {product.name}
                    </p>

                    {product.description && (
                      <p
                        className="
                          mt-1
                          hidden
                          sm:block
                          truncate
                          text-[11px]
                          leading-relaxed
                          text-[#958B80]
                        "
                      >
                        {product.description}
                      </p>
                    )}

                    {/* PRICE */}

                    <div className="mt-2 flex items-center justify-between">
                      <p
                        className="
                          text-[15px]
                          sm:text-[16px]
                          font-semibold
                          tracking-tight
                          text-[#302921]
                        "
                      >
                        {currency}
                        {product.offerPrice}
                      </p>

                      <span
                        className="
                          hidden
                          sm:flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          bg-[#F1EDF4]
                          text-[#776584]
                          opacity-0
                          group-hover:opacity-100
                          transition-opacity
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
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default WishlistPage;

