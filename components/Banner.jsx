"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";

const ArrowIcon = () => (
    <svg
        width="18"
        height="18"
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

const Sparkle = ({ className = "" }) => (
    <svg
        className={className}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M12 2L14 9.5L22 12L14 14.5L12 22L10 14.5L2 12L10 9.5L12 2Z"
            fill="currentColor"
        />
    </svg>
);

const Banner = () => {
    const router = useRouter();
    const sectionRef = useRef(null);

    const [visible, setVisible] = useState(false);

    const [mouse, setMouse] = useState({
        x: 0,
        y: 0,
    });

    // =====================================================
    // REVEAL ANIMATION
    // =====================================================

    useEffect(() => {
        const element = sectionRef.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            {
                threshold: 0.2,
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    // =====================================================
    // MOUSE PARALLAX
    // =====================================================

    const handleMouseMove = (e) => {
        const rect =
            sectionRef.current?.getBoundingClientRect();

        if (!rect) return;

        const x =
            ((e.clientX - rect.left) /
                rect.width -
                0.5) *
            2;

        const y =
            ((e.clientY - rect.top) /
                rect.height -
                0.5) *
            2;

        setMouse({
            x,
            y,
        });
    };

    const resetMouse = () => {
        setMouse({
            x: 0,
            y: 0,
        });
    };

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
            <style>{`
                @keyframes sunshineFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes sunshineImageIn {
                    from {
                        opacity: 0;
                        transform: translateY(28px) scale(0.94);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes sunshineFloat {
                    0%,
                    100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-8px);
                    }
                }

                @keyframes sunshineFloatSmall {
                    0%,
                    100% {
                        transform: translateY(0) rotate(0deg);
                    }

                    50% {
                        transform: translateY(-7px) rotate(4deg);
                    }
                }

                @keyframes sunshineShimmer {
                    0% {
                        background-position: -200% 0;
                    }

                    100% {
                        background-position: 200% 0;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            {/* =====================================================
                MAIN BANNER
            ===================================================== */}

            <div
                ref={sectionRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={resetMouse}
                className="
                    relative
                    mx-auto
                    w-full
                    max-w-[1500px]
                    overflow-hidden
                    rounded-[26px]
                    sm:rounded-[32px]
                    lg:rounded-[38px]
                    bg-[#FBF8F4]
                    border
                    border-[#EEE7DF]
                "
            >
                {/* =================================================
                    BACKGROUND DECORATIONS
                ================================================= */}

                <div
                    className="
                        absolute
                        -top-28
                        -left-28
                        w-[250px]
                        h-[250px]
                        rounded-full
                        bg-[#F4E8FF]
                        opacity-70
                        pointer-events-none
                    "
                    style={{
                        transform: `
                            translate(
                                ${mouse.x * -7}px,
                                ${mouse.y * -7}px
                            )
                        `,
                        transition:
                            "transform 0.5s ease-out",
                    }}
                />

                <div
                    className="
                        absolute
                        -bottom-32
                        -right-28
                        w-[300px]
                        h-[300px]
                        rounded-full
                        bg-[#FCE7EF]
                        opacity-70
                        pointer-events-none
                    "
                    style={{
                        transform: `
                            translate(
                                ${mouse.x * 8}px,
                                ${mouse.y * 8}px
                            )
                        `,
                        transition:
                            "transform 0.5s ease-out",
                    }}
                />

                {/* Gold dot */}

                <div
                    className="
                        absolute
                        top-[17%]
                        right-[43%]
                        w-3
                        h-3
                        rounded-full
                        bg-[#F5B700]
                        opacity-70
                        hidden
                        lg:block
                    "
                    style={{
                        transform: `
                            translate(
                                ${mouse.x * 16}px,
                                ${mouse.y * 16}px
                            )
                        `,
                        transition:
                            "transform 0.5s ease-out",
                    }}
                />

                {/* Sparkles */}

                <Sparkle
                    className="
                        absolute
                        top-[13%]
                        right-[8%]
                        text-[#8B5CF6]
                        opacity-30
                        hidden
                        md:block
                    "
                />

                <Sparkle
                    className="
                        absolute
                        bottom-[14%]
                        left-[45%]
                        text-[#E8578E]
                        opacity-25
                        w-4
                        h-4
                        hidden
                        lg:block
                    "
                />

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div
                    className="
                        relative
                        z-10
                        grid
                        grid-cols-1
                        lg:grid-cols-[0.9fr_1.1fr]
                        items-center
                        min-h-[480px]
                        sm:min-h-[520px]
                        lg:min-h-[550px]
                    "
                >
                    {/* =================================================
                        LEFT SIDE
                    ================================================= */}

                    <div
                        className="
                            relative
                            z-20
                            px-7
                            py-10
                            sm:px-10
                            sm:py-12
                            lg:px-14
                            xl:px-16
                            lg:py-14
                        "
                        style={
                            visible
                                ? {
                                      animation:
                                          "sunshineFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both",
                                  }
                                : {
                                      opacity: 0,
                                  }
                        }
                    >
                        {/* =================================================
                            LABEL
                        ================================================= */}

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-white
                                border
                                border-[#EDE4D9]
                                px-3.5
                                py-1.5
                                shadow-sm
                            "
                        >
                            <span
                                className="
                                    flex
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-[#8B5CF6]
                                "
                            />

                            <span
                                className="
                                    text-[9px]
                                    sm:text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#6F617B]
                                "
                            >
                                SNG Costume World
                            </span>
                        </div>

                        {/* =================================================
                            HEADING
                        ================================================= */}

                        <h2
                            className="
                                mt-6
                                font-serif
                                text-[38px]
                                leading-[1.02]
                                tracking-[-0.035em]
                                text-[#2E1A47]
                                sm:text-[50px]
                                lg:text-[58px]
                                xl:text-[64px]
                            "
                        >
                            Dress up.

                            <br />

                            <span
                                className="
                                    italic
                                    bg-clip-text
                                    text-transparent
                                "
                                style={{
                                    backgroundImage:
                                        "linear-gradient(90deg, #8B5CF6, #E8578E, #8B5CF6)",
                                    backgroundSize:
                                        "200% 100%",
                                    animation:
                                        "sunshineShimmer 6s linear infinite",
                                }}
                            >
                                Dream big.
                            </span>
                        </h2>

                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <p
                            className="
                                mt-5
                                max-w-[430px]
                                text-[14px]
                                leading-[1.75]
                                text-[#74677D]
                                sm:text-[16px]
                            "
                        >
                            Discover costumes made for
                            little heroes, dreamers,
                            performers and every special
                            celebration.
                        </p>

                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div
                            className="
                                mt-7
                                flex
                                flex-wrap
                                items-center
                                gap-3
                            "
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/all-products"
                                    )
                                }
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-3
                                    rounded-full
                                    bg-[#2E1A47]
                                    px-6
                                    py-3.5
                                    text-[13px]
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-[#2E1A47]/15
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:bg-[#3B225A]
                                    hover:shadow-xl
                                "
                            >
                                Explore costumes

                                <span
                                    className="
                                        flex
                                        h-6
                                        w-6
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white/10
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
                                        "/all-products"
                                    )
                                }
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-3
                                    py-3.5
                                    text-[13px]
                                    font-semibold
                                    text-[#6F617B]
                                    transition-colors
                                    duration-300
                                    hover:text-[#8B5CF6]
                                "
                            >
                                View collection

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
                        </div>

                        {/* =================================================
                            TAGS
                        ================================================= */}

                        <div
                            className="
                                mt-7
                                flex
                                flex-wrap
                                gap-x-5
                                gap-y-2.5
                                text-[9px]
                                sm:text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.12em]
                                text-[#9A8E9F]
                            "
                        >
                            <span className="flex items-center gap-1.5">
                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-[#8B5CF6]
                                    "
                                />
                                Dress up
                            </span>

                            <span className="flex items-center gap-1.5">
                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-[#E8578E]
                                    "
                                />
                                Imagine
                            </span>

                            <span className="flex items-center gap-1.5">
                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-[#F5B700]
                                    "
                                />
                                Celebrate
                            </span>
                        </div>
                    </div>

                    {/* =================================================
                        RIGHT IMAGE AREA
                    ================================================= */}

                    <div
                        className="
                            relative
                            flex
                            min-h-[320px]
                            items-center
                            justify-center
                            px-5
                            pb-10
                            sm:min-h-[390px]
                            sm:px-8
                            lg:min-h-[550px]
                            lg:px-8
                            lg:pb-0
                        "
                    >
                        {/* =================================================
                            PURPLE BACKGROUND SHAPE
                        ================================================= */}

                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                h-[240px]
                                w-[240px]
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-[45%]
                                bg-[#EEE6FF]
                                sm:h-[300px]
                                sm:w-[300px]
                                lg:h-[380px]
                                lg:w-[380px]
                            "
                            style={{
                                transform: `
                                    translate(
                                        calc(-50% + ${mouse.x * 6}px),
                                        calc(-50% + ${mouse.y * 6}px)
                                    )
                                    rotate(-7deg)
                                `,
                                transition:
                                    "transform 0.5s ease-out",
                            }}
                        />

                        {/* =================================================
                            PINK SHAPE
                        ================================================= */}

                        <div
                            className="
                                absolute
                                right-[7%]
                                top-[13%]
                                h-14
                                w-14
                                rounded-[18px]
                                bg-[#FCE1EA]
                                rotate-12
                                sm:h-16
                                sm:w-16
                            "
                            style={{
                                transform: `
                                    translate(
                                        ${mouse.x * 10}px,
                                        ${mouse.y * 10}px
                                    )
                                    rotate(12deg)
                                `,
                                transition:
                                    "transform 0.5s ease-out",
                            }}
                        />

                        {/* =================================================
                            GOLD CIRCLE
                        ================================================= */}

                        <div
                            className="
                                absolute
                                bottom-[14%]
                                left-[8%]
                                h-10
                                w-10
                                rounded-full
                                bg-[#F5B700]/20
                                sm:h-14
                                sm:w-14
                            "
                            style={{
                                transform: `
                                    translate(
                                        ${mouse.x * -10}px,
                                        ${mouse.y * -10}px
                                    )
                                `,
                                transition:
                                    "transform 0.5s ease-out",
                            }}
                        />

                        {/* =================================================
                            MAIN PRODUCT IMAGE
                        ================================================= */}

                        <div
                            className="
                                relative
                                z-10
                                h-[260px]
                                w-[260px]
                                sm:h-[330px]
                                sm:w-[330px]
                                lg:h-[410px]
                                lg:w-[410px]
                            "
                            style={{
                                animation: visible
                                    ? "sunshineImageIn 1s cubic-bezier(0.16,1,0.3,1) 0.15s both"
                                    : undefined,
                            }}
                        >
                            <div
                                className="h-full w-full"
                                style={{
                                    transform: `
                                        translate(
                                            ${mouse.x * -7}px,
                                            ${mouse.y * -7}px
                                        )
                                    `,
                                    transition:
                                        "transform 0.4s ease-out",
                                }}
                            >
                                <Image
                                    src={
                                        assets.superhero_poster
                                    }
                                    alt="Sunshine costume collection"
                                    fill
                                    priority
                                    sizes="
                                        (max-width: 640px) 260px,
                                        (max-width: 1024px) 330px,
                                        410px
                                    "
                                    className="
                                        object-contain
                                        drop-shadow-[0_24px_30px_rgba(46,26,71,0.17)]
                                    "
                                />
                            </div>
                        </div>

                        {/* =================================================
                            FLOATING CARD
                        ================================================= */}

                        <div
                            className="
                                absolute
                                bottom-[7%]
                                left-[4%]
                                z-20
                                rounded-xl
                                border
                                border-white
                                bg-white/95
                                px-3.5
                                py-2.5
                                shadow-xl
                                backdrop-blur-sm
                                sm:left-[8%]
                                sm:px-4
                                sm:py-3
                            "
                            style={{
                                animation: visible
                                    ? "sunshineFloat 5s ease-in-out 1s infinite"
                                    : undefined,
                            }}
                        >
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#F0EBFF]
                                        text-[#8B5CF6]
                                    "
                                >
                                    <Sparkle
                                        className="h-3.5 w-3.5"
                                    />
                                </div>

                                <div>
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            text-[#2E1A47]
                                        "
                                    >
                                        Make it magical
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-[9px]
                                            text-[#968A9E]
                                        "
                                    >
                                        Find their perfect look
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            NEW ARRIVALS BADGE
                        ================================================= */}

                        <div
                            className="
                                absolute
                                right-[5%]
                                bottom-[12%]
                                z-20
                                hidden
                                rounded-full
                                bg-[#2E1A47]
                                px-3.5
                                py-1.5
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-white
                                shadow-lg
                                sm:block
                            "
                            style={{
                                animation: visible
                                    ? "sunshineFloatSmall 4s ease-in-out 1.4s infinite"
                                    : undefined,
                            }}
                        >
                            New arrivals
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;