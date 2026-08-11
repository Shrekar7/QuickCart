"use client";

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const Product = () => {
    const { id } = useParams();

    const {
        products,
        router,
        currency,
        addToCart,
        cartItems,
        updateCartQuantity,

        // =====================================================
        // WISHLIST
        // =====================================================
        toggleWishlist,
        isInWishlist,
    } = useAppContext();

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    // =====================================================
    // FIND PRODUCT
    // =====================================================

    useEffect(() => {
        if (!products || products.length === 0 || !id) return;

        const product = products.find(
            (item) => String(item._id) === String(id)
        );

        setProductData(product || null);
    }, [id, products]);

    // =====================================================
    // RESET PRODUCT STATE
    // =====================================================

    useEffect(() => {
        if (productData?._id) {
            setSelectedSize(null);
            setMainImage(null);
        }
    }, [productData?._id]);

    // =====================================================
    // WISHLIST STATUS
    // =====================================================

    const isWishlisted = productData?._id
        ? isInWishlist(productData._id)
        : false;

    // =====================================================
    // SIZE PRICE
    // =====================================================

    const getSizePrice = (size) => {
        if (!productData?.sizePrices || !size) {
            return null;
        }

        const sizePrices = productData.sizePrices;

        if (sizePrices instanceof Map) {
            return sizePrices.get(size) ?? null;
        }

        return sizePrices[size] ?? null;
    };

    const selectedSizePrice = getSizePrice(selectedSize);

    // =====================================================
    // PRICE
    // =====================================================

    const currentPrice = Number(productData?.price || 0);

    const currentOfferPrice =
        selectedSize && selectedSizePrice != null
            ? Number(selectedSizePrice)
            : Number(productData?.offerPrice || 0);

    const discountPercent =
        currentPrice > currentOfferPrice
            ? Math.round(
                  ((currentPrice - currentOfferPrice) /
                      currentPrice) *
                      100
              )
            : 0;

    // =====================================================
    // CART QUANTITY
    // =====================================================

    const cartQuantity =
        productData?._id && cartItems
            ? Number(
                  cartItems[productData._id]?.quantity
              ) || 0
            : 0;

    // =====================================================
    // REQUIRE SIZE
    // =====================================================

    const requireSize = () => {
        if (
            !productData?.sizes ||
            productData.sizes.length === 0
        ) {
            return true;
        }

        if (!selectedSize) {
            toast.error(
                productData.sizingMode === "age"
                    ? "Please select an age range"
                    : "Please select a size"
            );

            return false;
        }

        return true;
    };

    // =====================================================
    // ADD TO CART
    // =====================================================

    const handleAddToCart = async () => {
        if (!productData?._id) return;

        if (!requireSize()) return;

        await addToCart(
            productData._id,
            selectedSize
        );
    };

    // =====================================================
    // INCREASE QUANTITY
    // =====================================================

    const handleIncreaseQuantity = async () => {
        if (!productData?._id) return;

        await updateCartQuantity(
            productData._id,
            cartQuantity + 1
        );
    };

    // =====================================================
    // DECREASE QUANTITY
    // =====================================================

    const handleDecreaseQuantity = async () => {
        if (!productData?._id) return;

        if (cartQuantity <= 1) {
            await updateCartQuantity(
                productData._id,
                0
            );

            return;
        }

        await updateCartQuantity(
            productData._id,
            cartQuantity - 1
        );
    };

    // =====================================================
    // BUY NOW
    // =====================================================

    const handleBuyNow = async () => {
        if (!productData?._id) return;

        if (!requireSize()) return;

        if (cartQuantity === 0) {
            await addToCart(
                productData._id,
                selectedSize
            );
        }

        router.push("/cart");
    };

    // =====================================================
    // WISHLIST
    // =====================================================

    const handleWishlist = async () => {
        if (!productData?._id) return;

        await toggleWishlist(
            productData._id
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (!productData) {
        return null;
    }

    // =====================================================
    // CART ACTION
    // =====================================================

    const CartAction = () => {
        return (
            <div className="flex flex-col gap-3 w-full">

                {cartQuantity > 0 ? (
                    <div
                        className="
                            h-14
                            rounded-full
                            bg-white
                            border-2
                            border-[#8B5CF6]
                            shadow-sm
                            px-3
                            flex
                            items-center
                            justify-between
                            w-full
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                handleDecreaseQuantity
                            }
                            aria-label="Decrease quantity"
                            className="
                                w-10
                                h-10
                                rounded-full
                                flex
                                items-center
                                justify-center
                                text-2xl
                                font-bold
                                text-[#8B5CF6]
                                hover:bg-[#8B5CF6]/10
                                active:scale-90
                                transition-all
                            "
                        >
                            −
                        </button>

                        <span
                            className="
                                text-lg
                                font-bold
                                text-[#2E1A47]
                                min-w-[30px]
                                text-center
                            "
                        >
                            {cartQuantity}
                        </span>

                        <button
                            type="button"
                            onClick={
                                handleIncreaseQuantity
                            }
                            aria-label="Increase quantity"
                            className="
                                w-10
                                h-10
                                rounded-full
                                flex
                                items-center
                                justify-center
                                text-2xl
                                font-bold
                                text-[#8B5CF6]
                                hover:bg-[#8B5CF6]/10
                                active:scale-90
                                transition-all
                            "
                        >
                            +
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="
                            h-14
                            w-full
                            rounded-full
                            font-semibold
                            text-base
                            text-[#2E1A47]
                            bg-white
                            border-2
                            border-[#2E1A47]/15
                            hover:border-[#8B5CF6]
                            hover:text-[#8B5CF6]
                            hover:shadow-md
                            active:scale-[0.98]
                            transition-all
                        "
                    >
                        Add to Cart
                    </button>
                )}

                <button
                    type="button"
                    onClick={handleBuyNow}
                    className="
                        h-14
                        w-full
                        rounded-full
                        font-semibold
                        text-base
                        text-white
                        shadow-md
                        hover:shadow-lg
                        hover:scale-[1.01]
                        active:scale-[0.98]
                        transition-all
                    "
                    style={{
                        background:
                            "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)",
                    }}
                >
                    Buy Now
                </button>
            </div>
        );
    };

    return (
        <>
            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar />

            {/* =================================================
                MAIN PRODUCT PAGE
            ================================================= */}

            <main
                className="
                    px-5
                    sm:px-6
                    md:px-16
                    lg:px-32
                    pt-8
                    md:pt-14
                    pb-16
                "
            >

                {/* =================================================
                    BREADCRUMB
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        md:text-sm
                        text-[#5B4B75]/60
                        mb-8
                    "
                >
                    <span
                        className="
                            hover:text-[#8B5CF6]
                            cursor-pointer
                            transition-colors
                        "
                        onClick={() =>
                            router.push("/")
                        }
                    >
                        Home
                    </span>

                    <span className="text-[#2E1A47]/20">
                        /
                    </span>

                    <span
                        className="
                            hover:text-[#8B5CF6]
                            cursor-pointer
                            transition-colors
                        "
                        onClick={() =>
                            router.push(
                                "/all-products"
                            )
                        }
                    >
                        Shop
                    </span>

                    <span className="text-[#2E1A47]/20">
                        /
                    </span>

                    <span
                        className="
                            text-[#2E1A47]
                            font-medium
                            truncate
                        "
                    >
                        {productData.name}
                    </span>
                </div>

                {/* =================================================
                    PRODUCT SECTION
                ================================================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-10
                        md:gap-16
                    "
                >

                    {/* =================================================
                        LEFT - IMAGES
                    ================================================= */}

                    <div>

                        {/* MAIN IMAGE */}

                        <div
                            className="
                                relative
                                rounded-3xl
                                overflow-hidden
                                bg-gradient-to-br
                                from-[#FAF9FF]
                                to-[#F3EFFF]
                                border
                                border-[#EDEBFB]
                                mb-4
                                aspect-square
                                shadow-[0_8px_30px_rgba(139,92,246,0.08)]
                            "
                        >

                            {/* DISCOUNT */}

                            {discountPercent > 0 && (
                                <span
                                    className="
                                        absolute
                                        top-4
                                        left-4
                                        z-10
                                        px-3
                                        py-1.5
                                        rounded-full
                                        text-xs
                                        font-bold
                                        text-white
                                        shadow-lg
                                    "
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #E8578E 0%, #C23A6F 100%)",
                                    }}
                                >
                                    {discountPercent}% OFF
                                </span>
                            )}

                            {/* =================================================
                                WISHLIST BUTTON
                            ================================================= */}

                            <button
                                type="button"
                                onClick={
                                    handleWishlist
                                }
                                aria-label={
                                    isWishlisted
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                }
                                className="
                                    absolute
                                    top-4
                                    right-4
                                    z-10
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-white/90
                                    backdrop-blur
                                    flex
                                    items-center
                                    justify-center
                                    shadow-md
                                    hover:scale-110
                                    active:scale-95
                                    transition-transform
                                "
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill={
                                        isWishlisted
                                            ? "#E8578E"
                                            : "none"
                                    }
                                >
                                    <path
                                        d="M12 21s-6.7-4.35-9.5-8.1C.6 10.1 1.2 6.3 4.4 4.9c2.2-1 4.7-.3 6.1 1.6l1.5 2 1.5-2c1.4-1.9 3.9-2.6 6.1-1.6 3.2 1.4 3.8 5.2 1.9 8-2.8 3.75-9.5 8.1-9.5 8.1z"
                                        stroke={
                                            isWishlisted
                                                ? "#E8578E"
                                                : "#2E1A47"
                                        }
                                        strokeWidth="1.8"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {/* MAIN IMAGE */}

                            <Image
                                src={
                                    mainImage ||
                                    productData.image?.[0]
                                }
                                alt={
                                    productData.name
                                }
                                fill
                                className="
                                    object-contain
                                    mix-blend-multiply
                                    p-8
                                    transition-transform
                                    duration-500
                                    hover:scale-105
                                "
                            />
                        </div>

                        {/* =================================================
                            THUMBNAILS
                        ================================================= */}

                        <div
                            className="
                                grid
                                grid-cols-4
                                gap-3
                            "
                        >
                            {productData.image?.map(
                                (
                                    image,
                                    index
                                ) => {

                                    const active =
                                        (
                                            mainImage ||
                                            productData
                                                .image[0]
                                        ) ===
                                        image;

                                    return (
                                        <button
                                            type="button"
                                            key={
                                                index
                                            }
                                            onClick={() =>
                                                setMainImage(
                                                    image
                                                )
                                            }
                                            className={`
                                                relative
                                                aspect-square
                                                rounded-2xl
                                                overflow-hidden
                                                bg-[#FAF9FF]
                                                border-2
                                                transition-all
                                                duration-300
                                                ${
                                                    active
                                                        ? "border-[#8B5CF6] shadow-md shadow-[#8B5CF6]/15 scale-[1.02]"
                                                        : "border-[#EDEBFB] hover:border-[#8B5CF6]/50"
                                                }
                                            `}
                                        >
                                            <Image
                                                src={
                                                    image
                                                }
                                                alt=""
                                                fill
                                                className="
                                                    object-contain
                                                    mix-blend-multiply
                                                    p-2
                                                "
                                            />
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    {/* =================================================
                        RIGHT - PRODUCT INFORMATION
                    ================================================= */}

                    <div
                        className="
                            flex
                            flex-col
                        "
                    >

                        {/* CATEGORY */}

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-2
                                text-[11px]
                                font-bold
                                tracking-[0.2em]
                                uppercase
                                text-[#8B5CF6]
                                mb-3
                                w-fit
                                px-3
                                py-1.5
                                rounded-full
                                bg-[#8B5CF6]/8
                            "
                        >
                            <span
                                className="
                                    w-1.5
                                    h-1.5
                                    rounded-full
                                    bg-[#F5B700]
                                "
                            />

                            {productData.category}
                        </span>

                        {/* NAME */}

                        <h1
                            className="
                                text-3xl
                                md:text-[40px]
                                font-serif
                                tracking-tight
                                text-[#2E1A47]
                                leading-tight
                            "
                        >
                            {productData.name}
                        </h1>

                        {/* RATING */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                mt-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-0.5
                                "
                            >
                                {[1, 2, 3, 4].map(
                                    (star) => (
                                        <Image
                                            key={
                                                star
                                            }
                                            className="
                                                h-4
                                                w-4
                                            "
                                            src={
                                                assets.star_icon
                                            }
                                            alt=""
                                        />
                                    )
                                )}

                                <Image
                                    className="
                                        h-4
                                        w-4
                                    "
                                    src={
                                        assets.star_dull_icon
                                    }
                                    alt=""
                                />
                            </div>

                            <p
                                className="
                                    text-sm
                                    text-[#5B4B75]/60
                                "
                            >
                                (4.5)
                            </p>
                        </div>

                        {/* DESCRIPTION */}

                        <p
                            className="
                                text-[#5B4B75]/70
                                mt-5
                                leading-relaxed
                            "
                        >
                            {
                                productData.description
                            }
                        </p>

                        {/* =================================================
                            PRICE CARD
                        ================================================= */}

                        <div
                            className="
                                mt-6
                                rounded-2xl
                                bg-gradient-to-br
                                from-[#FAF9FF]
                                to-white
                                border
                                border-[#EDEBFB]
                                p-5
                                shadow-sm
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-widest
                                    text-[#5B4B75]/50
                                    mb-1.5
                                "
                            >
                                {selectedSize
                                    ? `Price for ${selectedSize}`
                                    : "Special price"}
                            </p>

                            <div
                                className="
                                    flex
                                    items-baseline
                                    gap-3
                                    flex-wrap
                                "
                            >
                                <p
                                    className="
                                        text-4xl
                                        font-serif
                                        bg-gradient-to-r
                                        from-[#2E1A47]
                                        to-[#6D3FD6]
                                        bg-clip-text
                                        text-transparent
                                    "
                                >
                                    {currency}
                                    {
                                        currentOfferPrice
                                    }
                                </p>

                                {discountPercent >
                                    0 && (
                                    <>
                                        <p
                                            className="
                                                text-base
                                                text-[#5B4B75]/40
                                            "
                                        >
                                            M.R.P.:{" "}
                                            <span className="line-through">
                                                {
                                                    currency
                                                }
                                                {
                                                    currentPrice
                                                }
                                            </span>
                                        </p>

                                        <span
                                            className="
                                                text-sm
                                                font-semibold
                                                text-[#2E7D6B]
                                                px-2.5
                                                py-1
                                                rounded-full
                                                bg-[#2E7D6B]/8
                                            "
                                        >
                                            You save{" "}
                                            {
                                                currency
                                            }
                                            {(
                                                currentPrice -
                                                currentOfferPrice
                                            ).toFixed(
                                                2
                                            )}{" "}
                                            (
                                            {
                                                discountPercent
                                            }
                                            %)
                                        </span>
                                    </>
                                )}
                            </div>

                            <p
                                className="
                                    text-xs
                                    text-[#5B4B75]/40
                                    mt-2
                                "
                            >
                                Inclusive of all taxes
                            </p>
                        </div>

                        {/* =================================================
                            SIZE
                        ================================================= */}

                        {productData.sizes &&
                            productData.sizes
                                .length >
                                0 && (
                                <div className="mt-7">

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-[#2E1A47]
                                            mb-3
                                        "
                                    >
                                        {productData.sizingMode ===
                                        "age"
                                            ? "Select age"
                                            : "Select size"}

                                        <span className="text-[#E8578E]">
                                            {" "}
                                            *
                                        </span>
                                    </p>

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            gap-2.5
                                        "
                                    >
                                        {productData.sizes.map(
                                            (
                                                size
                                            ) => {

                                                const active =
                                                    selectedSize ===
                                                    size;

                                                return (
                                                    <button
                                                        key={
                                                            size
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedSize(
                                                                size
                                                            )
                                                        }
                                                        className={`
                                                            px-4
                                                            py-2
                                                            rounded-full
                                                            text-sm
                                                            font-medium
                                                            border
                                                            transition-all
                                                            ${
                                                                active
                                                                    ? "text-white border-transparent scale-105"
                                                                    : "text-[#2E1A47]/70 bg-white border-[#2E1A47]/15 hover:border-[#8B5CF6]"
                                                            }
                                                        `}
                                                        style={
                                                            active
                                                                ? {
                                                                      background:
                                                                          "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)",
                                                                  }
                                                                : undefined
                                                        }
                                                    >
                                                        {
                                                            size
                                                        }
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>

                                    {selectedSize && (
                                        <div
                                            className="
                                                mt-4
                                                flex
                                                items-center
                                                justify-between
                                                rounded-xl
                                                bg-[#FAF9FF]
                                                border
                                                border-[#EDEBFB]
                                                px-4
                                                py-3
                                            "
                                        >
                                            <div>
                                                <p
                                                    className="
                                                        text-xs
                                                        text-[#5B4B75]/50
                                                    "
                                                >
                                                    Selected{" "}
                                                    {
                                                        productData.sizingMode ===
                                                        "age"
                                                            ? "age"
                                                            : "size"
                                                    }
                                                </p>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-[#2E1A47]
                                                    "
                                                >
                                                    {
                                                        selectedSize
                                                    }
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p
                                                    className="
                                                        text-lg
                                                        font-bold
                                                        text-[#6D3FD6]
                                                    "
                                                >
                                                    {
                                                        currency
                                                    }
                                                    {
                                                        currentOfferPrice
                                                    }
                                                </p>

                                                {currentPrice >
                                                    currentOfferPrice && (
                                                    <p
                                                        className="
                                                            text-xs
                                                            text-[#5B4B75]/40
                                                            line-through
                                                        "
                                                    >
                                                        {
                                                            currency
                                                        }
                                                        {
                                                            currentPrice
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {!selectedSize && (
                                        <p
                                            className="
                                                text-xs
                                                text-[#5B4B75]/40
                                                mt-2.5
                                            "
                                        >
                                            {productData.sizingMode ===
                                            "age"
                                                ? "Please select an age range before adding to cart."
                                                : "Please select a size before adding to cart."}
                                        </p>
                                    )}
                                </div>
                            )}

                        {/* =================================================
                            PRODUCT DETAILS
                        ================================================= */}

                        <div
                            className="
                                mt-7
                                rounded-2xl
                                border
                                border-[#EDEBFB]
                                bg-[#FAF9FF]/60
                                p-5
                            "
                        >
                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-y-3
                                    text-sm
                                "
                            >
                                <p
                                    className="
                                        text-[#5B4B75]/60
                                        font-medium
                                    "
                                >
                                    Brand
                                </p>

                                <p className="text-[#2E1A47]">
                                    Generic
                                </p>

                                <p
                                    className="
                                        text-[#5B4B75]/60
                                        font-medium
                                    "
                                >
                                    Color
                                </p>

                                <p className="text-[#2E1A47]">
                                    Multi
                                </p>

                                <p
                                    className="
                                        text-[#5B4B75]/60
                                        font-medium
                                    "
                                >
                                    Category
                                </p>

                                <p className="text-[#2E1A47]">
                                    {
                                        productData.category
                                    }
                                </p>

                                {selectedSize && (
                                    <>
                                        <p
                                            className="
                                                text-[#5B4B75]/60
                                                font-medium
                                            "
                                        >
                                            {
                                                productData.sizingMode ===
                                                "age"
                                                    ? "Age"
                                                    : "Size"
                                            }
                                        </p>

                                        <p
                                            className="
                                                text-[#2E1A47]
                                                font-medium
                                            "
                                        >
                                            {
                                                selectedSize
                                            }
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* =================================================
                            CART BUTTONS
                        ================================================= */}

                        <div className="mt-8 w-full">
                            <CartAction />
                        </div>

                        {/* =================================================
                            BENEFITS
                        ================================================= */}

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-x-6
                                gap-y-2
                                mt-6
                                text-xs
                                text-[#5B4B75]/60
                            "
                        >
                            <span
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >
                                <span
                                    className="
                                        w-1.5
                                        h-1.5
                                        rounded-full
                                        bg-[#2E7D6B]
                                    "
                                />
                                Easy returns
                            </span>

                            <span
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >
                                <span
                                    className="
                                        w-1.5
                                        h-1.5
                                        rounded-full
                                        bg-[#2E7D6B]
                                    "
                                />
                                Secure checkout
                            </span>

                            <span
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >
                                <span
                                    className="
                                        w-1.5
                                        h-1.5
                                        rounded-full
                                        bg-[#2E7D6B]
                                    "
                                />
                                Quality checked
                            </span>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    REVIEWS
                ================================================= */}

                <ReviewSection
                    productId={productData._id}
                />

                {/* =================================================
                    RELATED PRODUCTS
                ================================================= */}

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        mt-20
                        md:mt-28
                    "
                >

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-[11px]
                            font-bold
                            tracking-[0.25em]
                            uppercase
                            text-[#8B5CF6]
                            mb-4
                        "
                    >
                        <span
                            className="
                                w-6
                                h-px
                                bg-gradient-to-r
                                from-transparent
                                to-[#8B5CF6]
                            "
                        />

                        You might also like

                        <span
                            className="
                                w-6
                                h-px
                                bg-gradient-to-l
                                from-transparent
                                to-[#8B5CF6]
                            "
                        />
                    </span>

                    <h2
                        className="
                            text-2xl
                            md:text-3xl
                            font-serif
                            tracking-tight
                            text-[#2E1A47]
                            text-center
                        "
                    >
                        More from{" "}
                        {
                            productData.category
                        }
                    </h2>

                    <div
                        className="
                            grid
                            grid-cols-2
                            md:grid-cols-3
                            lg:grid-cols-4
                            xl:grid-cols-5
                            gap-4
                            md:gap-6
                            mt-10
                            pb-14
                            w-full
                        "
                    >
                        {products
                            .filter(
                                (product) =>
                                    product.category ===
                                        productData.category &&
                                    product._id !==
                                        productData._id
                            )
                            .slice(0, 5)
                            .map(
                                (
                                    product
                                ) => (
                                    <div
                                        key={
                                            product._id
                                        }
                                        className="
                                            transition-transform
                                            duration-300
                                            hover:-translate-y-1.5
                                        "
                                    >
                                        <ProductCard
                                            product={
                                                product
                                            }
                                        />
                                    </div>
                                )
                            )}
                    </div>

                    {/* =================================================
                        SEE MORE
                    ================================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/all-products"
                            )
                        }
                        className="
                            group
                            flex
                            items-center
                            gap-2
                            mb-16
                            px-8
                            py-3
                            rounded-full
                            border
                            border-[#2E1A47]/15
                            text-[#2E1A47]
                            text-sm
                            font-semibold
                            hover:border-[#8B5CF6]
                            hover:bg-[#8B5CF6]/5
                            hover:text-[#8B5CF6]
                            hover:shadow-md
                            transition-all
                        "
                    >
                        See more

                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M5 12h14M13 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </main>

            {/* =================================================
                FOOTER
            ================================================= */}

            <Footer />
        </>
    );
};

export default Product;

