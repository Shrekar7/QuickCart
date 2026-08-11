"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

const NewArrivals = () => {
    const { newArrivals = [] } = useAppContext();
    const router = useRouter();

    // Don't show the section if there are no new products
    if (!newArrivals || newArrivals.length === 0) {
        return null;
    }

    return (
        <section className="w-full px-5 sm:px-6 md:px-12 lg:px-20 xl:px-28 py-16 md:py-24">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="flex flex-col items-center text-center mb-10 md:mb-14">

                {/* Small label */}

                <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-px bg-[#8B5CF6]/40" />

                    <span className="
                        text-[10px]
                        md:text-[11px]
                        font-semibold
                        tracking-[0.28em]
                        uppercase
                        text-[#8B5CF6]
                    ">
                        New Arrivals
                    </span>

                    <span className="w-8 h-px bg-[#8B5CF6]/40" />
                </div>

                {/* Heading */}

                <h2 className="
                    text-3xl
                    sm:text-4xl
                    md:text-[42px]
                    font-serif
                    tracking-tight
                    text-[#2E1A47]
                    leading-tight
                ">
                    Freshly Added
                </h2>

                {/* Description */}

                <p className="
                    mt-3
                    max-w-xl
                    text-sm
                    md:text-base
                    leading-relaxed
                    text-[#5B4B75]/60
                ">
                    Discover the latest pieces we've added to our collection.
                    Fresh styles, carefully selected for you.
                </p>
            </div>


            {/* =====================================================
                PRODUCT GRID
            ===================================================== */}

            <div className="
                grid
                grid-cols-2
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                gap-x-4
                sm:gap-x-5
                md:gap-x-6
                gap-y-8
                md:gap-y-10
            ">

                {newArrivals.slice(0, 5).map((product) => {

                    const image = product.image?.[0];

                    if (!image) return null;

                    const productPrice =
                        Number(product.offerPrice) || 0;

                    const originalPrice =
                        Number(product.price) || 0;

                    const hasDiscount =
                        originalPrice > productPrice;

                    return (
                        <div
                            key={product._id}
                            className="
                                group
                                cursor-pointer
                            "
                            onClick={() =>
                                router.push(
                                    `/product/${product._id}`
                                )
                            }
                        >

                            {/* =================================================
                                IMAGE
                            ================================================= */}

                            <div className="
                                relative
                                aspect-[4/5]
                                rounded-[22px]
                                overflow-hidden
                                bg-gradient-to-br
                                from-[#FAF9FF]
                                to-[#F3EFFF]
                                border
                                border-[#EDEBFB]
                                shadow-[0_6px_24px_rgba(139,92,246,0.06)]
                                transition-all
                                duration-500
                                group-hover:-translate-y-1
                                group-hover:shadow-[0_14px_35px_rgba(139,92,246,0.12)]
                            ">

                                {/* NEW BADGE */}

                                <div className="
                                    absolute
                                    top-3
                                    left-3
                                    z-10
                                    px-2.5
                                    py-1
                                    rounded-full
                                    bg-[#2E1A47]
                                    text-white
                                    text-[9px]
                                    font-bold
                                    tracking-[0.12em]
                                    uppercase
                                    shadow-sm
                                ">
                                    New
                                </div>


                                {/* DISCOUNT */}

                                {hasDiscount && (
                                    <div className="
                                        absolute
                                        top-3
                                        right-3
                                        z-10
                                        px-2.5
                                        py-1
                                        rounded-full
                                        bg-white/90
                                        backdrop-blur-sm
                                        text-[#E8578E]
                                        text-[9px]
                                        font-bold
                                    ">
                                        {Math.round(
                                            ((originalPrice -
                                                productPrice) /
                                                originalPrice) *
                                                100
                                        )}
                                        % OFF
                                    </div>
                                )}


                                {/* PRODUCT IMAGE */}

                                <Image
                                    src={image}
                                    alt={product.name}
                                    fill
                                    sizes="
                                        (max-width: 640px) 50vw,
                                        (max-width: 1024px) 33vw,
                                        20vw
                                    "
                                    className="
                                        object-contain
                                        mix-blend-multiply
                                        p-5
                                        sm:p-6
                                        transition-transform
                                        duration-700
                                        ease-out
                                        group-hover:scale-[1.05]
                                    "
                                />

                            </div>


                            {/* =================================================
                                PRODUCT INFO
                            ================================================= */}

                            <div className="px-1 pt-4">

                                {/* CATEGORY */}

                                <p className="
                                    text-[9px]
                                    md:text-[10px]
                                    uppercase
                                    tracking-[0.18em]
                                    font-semibold
                                    text-[#8B5CF6]/70
                                    mb-1.5
                                ">
                                    {product.category}
                                </p>


                                {/* NAME */}

                                <h3 className="
                                    text-sm
                                    md:text-[15px]
                                    font-medium
                                    text-[#2E1A47]
                                    line-clamp-1
                                    transition-colors
                                    duration-300
                                    group-hover:text-[#8B5CF6]
                                ">
                                    {product.name}
                                </h3>


                                {/* PRICE */}

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    mt-2
                                ">

                                    <span className="
                                        text-sm
                                        md:text-base
                                        font-semibold
                                        text-[#2E1A47]
                                    ">
                                        ₹{productPrice}
                                    </span>

                                    {hasDiscount && (
                                        <span className="
                                            text-[11px]
                                            md:text-xs
                                            text-[#5B4B75]/35
                                            line-through
                                        ">
                                            ₹{originalPrice}
                                        </span>
                                    )}

                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>


            {/* =====================================================
                VIEW ALL
            ===================================================== */}

            {newArrivals.length > 5 && (
                <div className="flex justify-center mt-12 md:mt-14">

                    <button
                        type="button"
                        onClick={() =>
                            router.push("/all-products")
                        }
                        className="
                            group
                            flex
                            items-center
                            gap-2
                            px-7
                            py-3
                            rounded-full
                            border
                            border-[#2E1A47]/12
                            bg-white
                            text-[#2E1A47]
                            text-sm
                            font-semibold
                            shadow-sm
                            hover:border-[#8B5CF6]/40
                            hover:text-[#8B5CF6]
                            hover:shadow-md
                            transition-all
                            duration-300
                        "
                    >
                        View all products

                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
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
            )}

        </section>
    );
};

export default NewArrivals;