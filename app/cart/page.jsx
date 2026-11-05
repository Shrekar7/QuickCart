"use client";

import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {
    const {
        products = [],
        router,
        cartItems = {},
        addToCart,
        updateCartQuantity,
        getCartCount,
        getProductPrice,
    } = useAppContext();

    // =========================================================
    // GET VALID CART ITEMS
    // =========================================================

    const cartEntries = Object.keys(cartItems || {}).filter((itemId) => {
        const product = products.find(
            (p) => String(p._id) === String(itemId)
        );

        const cartEntry = cartItems[itemId];

        const quantity =
            cartEntry && typeof cartEntry === "object"
                ? Number(cartEntry.quantity) || 0
                : Number(cartEntry) || 0;

        return product && quantity > 0;
    });

    // =========================================================
    // TOTAL CART ITEMS
    // =========================================================

    const totalCartCount =
        typeof getCartCount === "function"
            ? getCartCount()
            : 0;

    // =========================================================
    // CURRENCY
    // =========================================================

    const currency =
        process.env.NEXT_PUBLIC_CURRENCY || "₹";

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#FCFBFF]">

                {/* =====================================================
                    PAGE HEADER
                ===================================================== */}

                <div className="relative overflow-hidden">

                    {/* Decorative background */}

                    <div
                        aria-hidden
                        className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full opacity-[0.055] blur-3xl"
                        style={{
                            background:
                                "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
                        }}
                    />

                    <div
                        aria-hidden
                        className="pointer-events-none absolute top-20 -left-40 w-[360px] h-[360px] rounded-full opacity-[0.04] blur-3xl"
                        style={{
                            background:
                                "radial-gradient(circle, #F5B700 0%, transparent 70%)",
                        }}
                    />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 pt-8 md:pt-14">

                        {/* Breadcrumb */}

                        <div className="flex items-center gap-2 text-xs text-[#5B4B75]/50 mb-7">

                            <button
                                type="button"
                                onClick={() => router.push("/")}
                                className="hover:text-[#8B5CF6] transition-colors"
                            >
                                Home
                            </button>

                            <span className="text-[#2E1A47]/20">
                                /
                            </span>

                            <span className="text-[#2E1A47] font-medium">
                                Cart
                            </span>

                        </div>

                        {/* Title */}

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8">

                            <div>

                                <div className="inline-flex items-center gap-2 text-[10px] md:text-[11px] font-bold tracking-[0.22em] uppercase text-[#8B5CF6] mb-2">

                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />

                                    Your bag

                                </div>

                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight text-[#2E1A47]">
                                    Your Cart
                                </h1>

                                <p className="text-sm text-[#5B4B75]/55 mt-2">
                                    Review your items before you continue.
                                </p>

                            </div>

                            {/* Item count */}

                            <div className="flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-white border border-[#EDEBFB] shadow-sm">

                                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />

                                <span className="text-sm font-semibold text-[#2E1A47]">
                                    {totalCartCount}
                                </span>

                                <span className="text-sm text-[#5B4B75]/60">
                                    {totalCartCount === 1
                                        ? "item"
                                        : "items"}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    CART CONTENT
                ===================================================== */}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 pb-20">

                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px] gap-8 lg:gap-10 items-start">

                        {/* =================================================
                            CART SECTION
                        ================================================= */}

                        <div>

                            {cartEntries.length === 0 ? (

                                /* =================================================
                                   EMPTY CART
                                ================================================= */

                                <div className="bg-white rounded-[28px] border border-[#EDEBFB] shadow-[0_12px_45px_rgba(46,26,71,0.06)]">

                                    <div className="flex flex-col items-center text-center px-6 py-16 md:py-24">

                                        {/* Icon */}

                                        <div className="relative mb-6">

                                            <div className="w-20 h-20 rounded-full bg-[#FAF9FF] border border-[#EDEBFB] flex items-center justify-center">

                                                <svg
                                                    width="32"
                                                    height="32"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6"
                                                        stroke="#8B5CF6"
                                                        strokeWidth="1.7"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />

                                                    <circle
                                                        cx="10"
                                                        cy="20"
                                                        r="1"
                                                        fill="#F5B700"
                                                    />

                                                    <circle
                                                        cx="18"
                                                        cy="20"
                                                        r="1"
                                                        fill="#F5B700"
                                                    />
                                                </svg>

                                            </div>

                                            <span className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-[#F5B700] border-4 border-white" />

                                        </div>

                                        <h2 className="text-xl md:text-2xl font-serif text-[#2E1A47]">
                                            Your cart is empty
                                        </h2>

                                        <p className="text-sm text-[#5B4B75]/55 max-w-sm mt-2 mb-7 leading-relaxed">
                                            Looks like you haven't found your
                                            perfect costume yet. Explore our
                                            collection and find something special.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    "/all-products"
                                                )
                                            }
                                            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white shadow-lg shadow-[#8B5CF6]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)",
                                            }}
                                        >
                                            Start Shopping

                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="group-hover:translate-x-1 transition-transform"
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

                                </div>

                            ) : (

                                <div className="space-y-4">

                                    {/* =================================================
                                        DESKTOP CART
                                    ================================================= */}

                                    <div className="hidden md:block bg-white rounded-[24px] border border-[#EDEBFB] shadow-[0_10px_40px_rgba(46,26,71,0.05)] overflow-hidden">

                                        {/* Header */}

                                        <div className="px-6 py-4 bg-[#FAF9FF] border-b border-[#EDEBFB] flex items-center justify-between">

                                            <div>

                                                <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#8B5CF6]">
                                                    Shopping bag
                                                </p>

                                                <p className="text-xs text-[#5B4B75]/50 mt-1">
                                                    Your selected products
                                                </p>

                                            </div>

                                            <span className="text-xs font-medium text-[#5B4B75]/50">
                                                {cartEntries.length}{" "}
                                                {cartEntries.length === 1
                                                    ? "product"
                                                    : "products"}
                                            </span>

                                        </div>

                                        <div className="overflow-x-auto">

                                            <table className="min-w-full table-auto">

                                                <thead>

                                                    <tr className="border-b border-[#EDEBFB]">

                                                        <th className="text-left py-4 px-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5B4B75]/50">
                                                            Product
                                                        </th>

                                                        <th className="text-left py-4 px-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5B4B75]/50">
                                                            Price
                                                        </th>

                                                        <th className="text-left py-4 px-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5B4B75]/50">
                                                            Quantity
                                                        </th>

                                                        <th className="text-right py-4 px-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5B4B75]/50">
                                                            Subtotal
                                                        </th>

                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {cartEntries.map(
                                                        (itemId) => {

                                                            const product =
                                                                products.find(
                                                                    (p) =>
                                                                        String(
                                                                            p._id
                                                                        ) ===
                                                                        String(
                                                                            itemId
                                                                        )
                                                                );

                                                            if (!product)
                                                                return null;

                                                            const rawCartEntry =
                                                                cartItems[
                                                                    itemId
                                                                ];

                                                            let quantity =
                                                                0;

                                                            let selectedSize =
                                                                null;

                                                            if (
                                                                rawCartEntry &&
                                                                typeof rawCartEntry ===
                                                                    "object"
                                                            ) {
                                                                quantity =
                                                                    Number(
                                                                        rawCartEntry.quantity
                                                                    ) || 0;

                                                                selectedSize =
                                                                    rawCartEntry.size ||
                                                                    null;
                                                            } else {
                                                                quantity =
                                                                    Number(
                                                                        rawCartEntry
                                                                    ) || 0;
                                                            }

                                                            if (
                                                                quantity <=
                                                                0
                                                            )
                                                                return null;

                                                            const unitPrice =
                                                                typeof getProductPrice ===
                                                                "function"
                                                                    ? getProductPrice(
                                                                          product,
                                                                          selectedSize
                                                                      )
                                                                    : Number(
                                                                          product.offerPrice
                                                                      ) ||
                                                                      0;

                                                            const subtotal =
                                                                Number(
                                                                    unitPrice
                                                                ) *
                                                                Number(
                                                                    quantity
                                                                );

                                                            return (
                                                                <tr
                                                                    key={String(
                                                                        itemId
                                                                    )}
                                                                    className="border-b border-[#EDEBFB] last:border-b-0 hover:bg-[#FCFBFF] transition-colors"
                                                                >

                                                                    {/* PRODUCT */}

                                                                    <td className="py-5 px-6">

                                                                        <div className="flex items-center gap-4 min-w-[260px]">

                                                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#FAF9FF] border border-[#EDEBFB] p-2 shrink-0">

                                                                                <Image
                                                                                    src={
                                                                                        product
                                                                                            .image?.[0]
                                                                                    }
                                                                                    alt={
                                                                                        product.name ||
                                                                                        "Product"
                                                                                    }
                                                                                    width={
                                                                                        160
                                                                                    }
                                                                                    height={
                                                                                        160
                                                                                    }
                                                                                    className="w-full h-full object-contain mix-blend-multiply"
                                                                                />

                                                                            </div>

                                                                            <div className="min-w-0">

                                                                                <p className="font-semibold text-sm text-[#2E1A47] truncate max-w-[250px]">
                                                                                    {
                                                                                        product.name
                                                                                    }
                                                                                </p>

                                                                                {selectedSize && (
                                                                                    <span className="inline-flex items-center mt-1.5 px-2 py-1 rounded-full bg-[#FAF9FF] border border-[#EDEBFB] text-[10px] font-medium text-[#5B4B75]">
                                                                                        {product.sizingMode ===
                                                                                        "age"
                                                                                            ? "Age"
                                                                                            : "Size"}
                                                                                        :{" "}
                                                                                        {
                                                                                            selectedSize
                                                                                        }
                                                                                    </span>
                                                                                )}

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        updateCartQuantity(
                                                                                            product._id,
                                                                                            0
                                                                                        )
                                                                                    }
                                                                                    className="block text-xs font-medium text-[#E8578E] mt-2 hover:underline"
                                                                                >
                                                                                    Remove
                                                                                </button>

                                                                            </div>

                                                                        </div>

                                                                    </td>

                                                                    {/* PRICE */}

                                                                    <td className="py-5 px-5 whitespace-nowrap">

                                                                        <span className="text-sm font-medium text-[#5B4B75]">
                                                                            {
                                                                                currency
                                                                            }
                                                                            {Number(
                                                                                unitPrice
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                        </span>

                                                                    </td>

                                                                    {/* QUANTITY */}

                                                                    <td className="py-5 px-5">

                                                                        <div className="inline-flex items-center gap-1 bg-[#FAF9FF] border border-[#EDEBFB] rounded-full p-1">

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    updateCartQuantity(
                                                                                        product._id,
                                                                                        quantity -
                                                                                            1
                                                                                    )
                                                                                }
                                                                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
                                                                            >
                                                                                <Image
                                                                                    src={
                                                                                        assets.decrease_arrow
                                                                                    }
                                                                                    alt="decrease"
                                                                                    width={
                                                                                        14
                                                                                    }
                                                                                    height={
                                                                                        14
                                                                                    }
                                                                                    className="w-3.5 h-3.5"
                                                                                />
                                                                            </button>

                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                value={
                                                                                    quantity
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    const value =
                                                                                        Number(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        );

                                                                                    updateCartQuantity(
                                                                                        product._id,
                                                                                        Number.isNaN(
                                                                                            value
                                                                                        )
                                                                                            ? 0
                                                                                            : value
                                                                                    );
                                                                                }}
                                                                                className="w-9 bg-transparent text-center text-sm font-semibold text-[#2E1A47] outline-none appearance-none"
                                                                            />

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    addToCart(
                                                                                        product._id,
                                                                                        selectedSize
                                                                                    )
                                                                                }
                                                                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
                                                                            >
                                                                                <Image
                                                                                    src={
                                                                                        assets.increase_arrow
                                                                                    }
                                                                                    alt="increase"
                                                                                    width={
                                                                                        14
                                                                                    }
                                                                                    height={
                                                                                        14
                                                                                    }
                                                                                    className="w-3.5 h-3.5"
                                                                                />
                                                                            </button>

                                                                        </div>

                                                                    </td>

                                                                    {/* SUBTOTAL */}

                                                                    <td className="py-5 px-6 text-right whitespace-nowrap">

                                                                        <span className="text-sm font-bold text-[#2E1A47]">
                                                                            {
                                                                                currency
                                                                            }
                                                                            {subtotal.toFixed(
                                                                                2
                                                                            )}
                                                                        </span>

                                                                    </td>

                                                                </tr>
                                                            );
                                                        }
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                    {/* =================================================
                                        MOBILE CART
                                    ================================================= */}

                                    <div className="md:hidden space-y-3">

                                        {cartEntries.map((itemId) => {

                                            const product =
                                                products.find(
                                                    (p) =>
                                                        String(
                                                            p._id
                                                        ) ===
                                                        String(
                                                            itemId
                                                        )
                                                );

                                            if (!product)
                                                return null;

                                            const rawCartEntry =
                                                cartItems[itemId];

                                            let quantity = 0;
                                            let selectedSize = null;

                                            if (
                                                rawCartEntry &&
                                                typeof rawCartEntry ===
                                                    "object"
                                            ) {
                                                quantity =
                                                    Number(
                                                        rawCartEntry.quantity
                                                    ) || 0;

                                                selectedSize =
                                                    rawCartEntry.size ||
                                                    null;
                                            } else {
                                                quantity =
                                                    Number(
                                                        rawCartEntry
                                                    ) || 0;
                                            }

                                            if (quantity <= 0)
                                                return null;

                                            const unitPrice =
                                                typeof getProductPrice ===
                                                "function"
                                                    ? getProductPrice(
                                                          product,
                                                          selectedSize
                                                      )
                                                    : Number(
                                                          product.offerPrice
                                                      ) || 0;

                                            const subtotal =
                                                Number(
                                                    unitPrice
                                                ) *
                                                Number(
                                                    quantity
                                                );

                                            return (
                                                <div
                                                    key={String(
                                                        itemId
                                                    )}
                                                    className="bg-white rounded-[22px] border border-[#EDEBFB] shadow-[0_8px_30px_rgba(46,26,71,0.05)] p-4"
                                                >

                                                    {/* TOP */}

                                                    <div className="flex gap-4">

                                                        {/* IMAGE */}

                                                        <div className="w-24 h-24 rounded-2xl bg-[#FAF9FF] border border-[#EDEBFB] p-2 shrink-0">

                                                            <Image
                                                                src={
                                                                    product
                                                                        .image?.[0]
                                                                }
                                                                alt={
                                                                    product.name ||
                                                                    "Product"
                                                                }
                                                                width={
                                                                    160
                                                                }
                                                                height={
                                                                    160
                                                                }
                                                                className="w-full h-full object-contain mix-blend-multiply"
                                                            />

                                                        </div>

                                                        {/* INFO */}

                                                        <div className="flex-1 min-w-0">

                                                            <div className="flex items-start justify-between gap-2">

                                                                <h3 className="text-sm font-semibold text-[#2E1A47] leading-snug">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </h3>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateCartQuantity(
                                                                            product._id,
                                                                            0
                                                                        )
                                                                    }
                                                                    aria-label="Remove product"
                                                                    className="w-7 h-7 rounded-full bg-[#FFF4F7] flex items-center justify-center text-[#E8578E] shrink-0"
                                                                >
                                                                    ×
                                                                </button>

                                                            </div>

                                                            {selectedSize && (
                                                                <span className="inline-flex items-center mt-2 px-2.5 py-1 rounded-full bg-[#FAF9FF] border border-[#EDEBFB] text-[10px] font-medium text-[#5B4B75]">
                                                                    {product.sizingMode ===
                                                                    "age"
                                                                        ? "Age"
                                                                        : "Size"}
                                                                    :{" "}
                                                                    {
                                                                        selectedSize
                                                                    }
                                                                </span>
                                                            )}

                                                            <p className="text-sm font-semibold text-[#6D3FD6] mt-2">
                                                                {
                                                                    currency
                                                                }
                                                                {Number(
                                                                    unitPrice
                                                                ).toFixed(
                                                                    2
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>

                                                    {/* DIVIDER */}

                                                    <div className="border-t border-[#EDEBFB] my-4" />

                                                    {/* BOTTOM */}

                                                    <div className="flex items-center justify-between gap-3">

                                                        {/* QUANTITY */}

                                                        <div>

                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5B4B75]/45 mb-1.5">
                                                                Quantity
                                                            </p>

                                                            <div className="inline-flex items-center gap-1 bg-[#FAF9FF] border border-[#EDEBFB] rounded-full p-1">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateCartQuantity(
                                                                            product._id,
                                                                            quantity -
                                                                                1
                                                                        )
                                                                    }
                                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-all"
                                                                >
                                                                    <Image
                                                                        src={
                                                                            assets.decrease_arrow
                                                                        }
                                                                        alt="decrease"
                                                                        width={
                                                                            14
                                                                        }
                                                                        height={
                                                                            14
                                                                        }
                                                                        className="w-3.5 h-3.5"
                                                                    />
                                                                </button>

                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={
                                                                        quantity
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const value =
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            );

                                                                        updateCartQuantity(
                                                                            product._id,
                                                                            Number.isNaN(
                                                                                value
                                                                            )
                                                                                ? 0
                                                                                : value
                                                                        );
                                                                    }}
                                                                    className="w-8 bg-transparent text-center text-sm font-semibold text-[#2E1A47] outline-none appearance-none"
                                                                />

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        addToCart(
                                                                            product._id,
                                                                            selectedSize
                                                                        )
                                                                    }
                                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-all"
                                                                >
                                                                    <Image
                                                                        src={
                                                                            assets.increase_arrow
                                                                        }
                                                                        alt="increase"
                                                                        width={
                                                                            14
                                                                        }
                                                                        height={
                                                                            14
                                                                        }
                                                                        className="w-3.5 h-3.5"
                                                                    />
                                                                </button>

                                                            </div>

                                                        </div>

                                                        {/* SUBTOTAL */}

                                                        <div className="text-right">

                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5B4B75]/45 mb-1.5">
                                                                Subtotal
                                                            </p>

                                                            <p className="text-lg font-bold text-[#2E1A47]">
                                                                {
                                                                    currency
                                                                }
                                                                {subtotal.toFixed(
                                                                    2
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>
                                            );
                                        })}

                                    </div>

                                    {/* =================================================
                                        CONTINUE SHOPPING
                                    ================================================= */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(
                                                "/all-products"
                                            )
                                        }
                                        className="group inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[#8B5CF6] hover:text-[#6D3FD6] transition-colors"
                                    >

                                        <span className="w-8 h-8 rounded-full bg-[#FAF9FF] border border-[#EDEBFB] flex items-center justify-center group-hover:-translate-x-1 transition-transform">

                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <path
                                                    d="M19 12H5M12 19l-7-7 7-7"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>

                                        </span>

                                        Continue Shopping

                                    </button>

                                </div>
                            )}

                        </div>

                        {/* =================================================
                            ORDER SUMMARY
                        ================================================= */}

                        <div className="lg:sticky lg:top-6">

                            <OrderSummary />

                        </div>

                    </div>

                </div>

            </main>
        </>
    );
};

export default Cart;