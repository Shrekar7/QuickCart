"use client";

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

/* ============================================================
   STATUS STYLES
============================================================ */

const statusStyles = {
    "Order placed": {
        bg: "bg-[#F5B700]/10",
        text: "text-[#A47700]",
        dot: "bg-[#F5B700]",
        border: "border-[#F5B700]/20",
    },

    Shipped: {
        bg: "bg-[#2E7D6B]/10",
        text: "text-[#2E7D6B]",
        dot: "bg-[#2E7D6B]",
        border: "border-[#2E7D6B]/20",
    },

    Delivered: {
        bg: "bg-[#2E7D6B]/10",
        text: "text-[#2E7D6B]",
        dot: "bg-[#2E7D6B]",
        border: "border-[#2E7D6B]/20",
    },

    Cancelled: {
        bg: "bg-[#E8578E]/10",
        text: "text-[#C24672]",
        dot: "bg-[#E8578E]",
        border: "border-[#E8578E]/20",
    },
};

/* ============================================================
   HELPERS
============================================================ */

const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getOrderNumber = (id) => {
    if (!id) return "ORDER";

    return id
        .toString()
        .slice(-8)
        .toUpperCase();
};

/* ============================================================
   ORDER ICON
============================================================ */

const OrderIcon = () => (
    <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M7 3h10v4H7V3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />

        <path
            d="M5 7h14v13H5V7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />

        <path
            d="M8 11h8M8 15h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

/* ============================================================
   LOCATION ICON
============================================================ */

const LocationIcon = () => (
    <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
            stroke="currentColor"
            strokeWidth="1.5"
        />

        <circle
            cx="12"
            cy="10"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.5"
        />
    </svg>
);

/* ============================================================
   CHEVRON ICON
============================================================ */

const ChevronIcon = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="m9 18 6-6-6-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/* ============================================================
   MY ORDERS
============================================================ */

const MyOrders = () => {
    const { currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ========================================================
       FETCH ORDERS
    ======================================================== */

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const token = await getToken();

            const { data } = await axios.get(
                "/api/order/list",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                /*
                 * IMPORTANT:
                 * Latest order first.
                 *
                 * We create a new array before sorting so
                 * the original API response isn't mutated.
                 */
                const sortedOrders = [
                    ...(data.orders || []),
                ].sort((a, b) => {
                    return (
                        Number(b.date || 0) -
                        Number(a.date || 0)
                    );
                });

                setOrders(sortedOrders);
            } else {
                toast.error(
                    data.message ||
                        "Unable to load orders."
                );
            }
        } catch (error) {
            console.error(
                "FETCH ORDERS ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    /* ========================================================
       LOAD
    ======================================================== */

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    /* ========================================================
       PAGE
    ======================================================== */

    return (
        <>
            <Navbar />

            <main
                className="
                    min-h-screen
                    bg-[#FBFAF8]
                    px-4
                    py-8

                    sm:px-6
                    sm:py-10

                    md:px-10
                    md:py-14

                    lg:px-20
                "
            >
                <div className="mx-auto max-w-5xl">

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <header className="mb-8 md:mb-10">

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                gap-2
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
                                    font-semibold
                                    uppercase
                                    tracking-[0.28em]
                                    text-[#8A8179]
                                "
                            >
                                Your journey
                            </span>
                        </div>

                        <div
                            className="
                                flex
                                flex-col
                                gap-3

                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >
                            <div>
                                <h1
                                    className="
                                        font-serif
                                        text-[34px]
                                        leading-none
                                        tracking-[-0.035em]
                                        text-[#292624]

                                        sm:text-[40px]

                                        md:text-[46px]
                                    "
                                >
                                    My Orders
                                </h1>

                                <p
                                    className="
                                        mt-3
                                        max-w-md
                                        text-[13px]
                                        leading-6
                                        text-[#77716B]
                                    "
                                >
                                    Keep track of your
                                    costumes, deliveries
                                    and special moments.
                                </p>
                            </div>

                            {/* ORDER COUNT */}

                            {!loading &&
                                orders.length > 0 && (
                                    <div
                                        className="
                                            inline-flex
                                            w-fit
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-[#E8E2DB]
                                            bg-white
                                            px-4
                                            py-2
                                        "
                                    >
                                        <span
                                            className="
                                                text-[11px]
                                                font-medium
                                                text-[#77716B]
                                            "
                                        >
                                            {orders.length}
                                        </span>

                                        <span
                                            className="
                                                text-[10px]
                                                text-[#A29A92]
                                            "
                                        >
                                            {orders.length === 1
                                                ? "order"
                                                : "orders"}
                                        </span>
                                    </div>
                                )}
                        </div>
                    </header>

                    {/* ==================================================
                        LOADING
                    ================================================== */}

                    {loading ? (
                        <div
                            className="
                                rounded-[24px]
                                border
                                border-[#E8E2DB]
                                bg-white
                                py-20
                            "
                        >
                            <Loading />
                        </div>
                    ) : orders.length === 0 ? (

                        /* ==================================================
                           EMPTY STATE
                        ================================================== */

                        <div
                            className="
                                overflow-hidden
                                rounded-[26px]
                                border
                                border-[#E8E2DB]
                                bg-white
                                px-6
                                py-16
                                text-center

                                sm:py-20
                            "
                        >
                            <div
                                className="
                                    mx-auto
                                    mb-5
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#F8F6F3]
                                    text-[#77716B]
                                "
                            >
                                <OrderIcon />
                            </div>

                            <h2
                                className="
                                    font-serif
                                    text-[22px]
                                    text-[#292624]
                                "
                            >
                                No orders yet
                            </h2>

                            <p
                                className="
                                    mx-auto
                                    mt-2
                                    max-w-sm
                                    text-[13px]
                                    leading-6
                                    text-[#918981]
                                "
                            >
                                Your orders will appear
                                here once you place your
                                first costume order.
                            </p>
                        </div>

                    ) : (

                        /* ==================================================
                           ORDERS
                        ================================================== */

                        <div className="space-y-5">

                            {orders.map(
                                (order, index) => {

                                    const statusStyle =
                                        statusStyles[
                                            order.status
                                        ] ||
                                        statusStyles[
                                            "Order placed"
                                        ];

                                    const items =
                                        order.items ||
                                        [];

                                    return (
                                        <article
                                            key={
                                                order._id ||
                                                index
                                            }
                                            className="
                                                group
                                                overflow-hidden
                                                rounded-[24px]
                                                border
                                                border-[#E8E2DB]
                                                bg-white
                                                transition-all
                                                duration-300

                                                hover:-translate-y-[1px]
                                                hover:border-[#D9D1C9]
                                                hover:shadow-[0_16px_45px_rgba(45,38,32,0.07)]
                                            "
                                        >

                                            {/* ======================================
                                                ORDER HEADER
                                            ======================================= */}

                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    gap-3
                                                    border-b
                                                    border-[#EEEAE5]
                                                    bg-[#FCFBFA]
                                                    px-5
                                                    py-4

                                                    sm:flex-row
                                                    sm:items-center
                                                    sm:justify-between
                                                    sm:px-6
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            bg-white
                                                            border
                                                            border-[#E8E2DB]
                                                            text-[#77716B]
                                                        "
                                                    >
                                                        <OrderIcon />
                                                    </div>

                                                    <div>

                                                        <div
                                                            className="
                                                                flex
                                                                flex-wrap
                                                                items-center
                                                                gap-2
                                                            "
                                                        >
                                                            <span
                                                                className="
                                                                    text-[11px]
                                                                    font-semibold
                                                                    tracking-[0.04em]
                                                                    text-[#49433E]
                                                                "
                                                            >
                                                                Order #
                                                                {getOrderNumber(
                                                                    order._id
                                                                )}
                                                            </span>

                                                            {index ===
                                                                0 && (
                                                                <span
                                                                    className="
                                                                        rounded-full
                                                                        bg-[#F5B700]/10
                                                                        px-2
                                                                        py-0.5
                                                                        text-[8px]
                                                                        font-semibold
                                                                        uppercase
                                                                        tracking-[0.12em]
                                                                        text-[#A47700]
                                                                    "
                                                                >
                                                                    Latest
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p
                                                            className="
                                                                mt-0.5
                                                                text-[10px]
                                                                text-[#A29A92]
                                                            "
                                                        >
                                                            {formatDate(
                                                                order.date
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* STATUS */}

                                                <span
                                                    className={`
                                                        inline-flex
                                                        w-fit
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        border
                                                        px-3
                                                        py-1.5
                                                        text-[10px]
                                                        font-semibold
                                                        ${statusStyle.bg}
                                                        ${statusStyle.text}
                                                        ${statusStyle.border}
                                                    `}
                                                >
                                                    <span
                                                        className={`
                                                            h-1.5
                                                            w-1.5
                                                            rounded-full
                                                            ${statusStyle.dot}
                                                        `}
                                                    />

                                                    {order.status ||
                                                        "Order placed"}
                                                </span>

                                            </div>

                                            {/* ======================================
                                                ORDER BODY
                                            ======================================= */}

                                            <div
                                                className="
                                                    p-5

                                                    sm:p-6
                                                "
                                            >

                                                <div
                                                    className="
                                                        grid
                                                        gap-6

                                                        lg:grid-cols-[1fr_210px_140px]
                                                        lg:items-center
                                                    "
                                                >

                                                    {/* ==================================
                                                        PRODUCTS
                                                    =================================== */}

                                                    <div
                                                        className="
                                                            min-w-0
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                mb-3
                                                                text-[9px]
                                                                font-semibold
                                                                uppercase
                                                                tracking-[0.2em]
                                                                text-[#A29A92]
                                                            "
                                                        >
                                                            Ordered items
                                                        </p>

                                                        <div className="space-y-2.5">

                                                            {items.map(
                                                                (
                                                                    item,
                                                                    itemIndex
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            itemIndex
                                                                        }
                                                                        className="
                                                                            flex
                                                                            items-center
                                                                            gap-3
                                                                        "
                                                                    >

                                                                        <div
                                                                            className="
                                                                                flex
                                                                                h-9
                                                                                w-9
                                                                                shrink-0
                                                                                items-center
                                                                                justify-center
                                                                                rounded-lg
                                                                                bg-[#F8F6F3]
                                                                                text-[#77716B]
                                                                            "
                                                                        >
                                                                            <OrderIcon />
                                                                        </div>

                                                                        <div
                                                                            className="
                                                                                min-w-0
                                                                                flex-1
                                                                            "
                                                                        >
                                                                            <p
                                                                                className="
                                                                                    truncate
                                                                                    text-[12px]
                                                                                    font-medium
                                                                                    text-[#49433E]
                                                                                "
                                                                            >
                                                                                {item
                                                                                    .product
                                                                                    ?.name ||
                                                                                    "Product"}
                                                                            </p>

                                                                            <p
                                                                                className="
                                                                                    mt-0.5
                                                                                    text-[10px]
                                                                                    text-[#A29A92]
                                                                                "
                                                                            >
                                                                                Quantity{" "}
                                                                                {item.quantity ||
                                                                                    1}
                                                                            </p>
                                                                        </div>

                                                                    </div>
                                                                )
                                                            )}

                                                        </div>

                                                    </div>

                                                    {/* ==================================
                                                        ADDRESS
                                                    =================================== */}

                                                    {order.address ? (
                                                        <div
                                                            className="
                                                                border-t
                                                                border-[#EEEAE5]
                                                                pt-5

                                                                lg:border-l
                                                                lg:border-t-0
                                                                lg:pl-6
                                                                lg:pt-0
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    mb-2
                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                    text-[#918981]
                                                                "
                                                            >
                                                                <LocationIcon />

                                                                <p
                                                                    className="
                                                                        text-[9px]
                                                                        font-semibold
                                                                        uppercase
                                                                        tracking-[0.16em]
                                                                    "
                                                                >
                                                                    Delivery
                                                                </p>
                                                            </div>

                                                            <div
                                                                className="
                                                                    text-[11px]
                                                                    leading-[1.7]
                                                                    text-[#77716B]
                                                                "
                                                            >

                                                                <p
                                                                    className="
                                                                        font-semibold
                                                                        text-[#49433E]
                                                                    "
                                                                >
                                                                    {order
                                                                        .address
                                                                        ?.fullName ||
                                                                        "Customer"}
                                                                </p>

                                                                {order
                                                                    .address
                                                                    ?.area && (
                                                                    <p>
                                                                        {
                                                                            order
                                                                                .address
                                                                                .area
                                                                        }
                                                                    </p>
                                                                )}

                                                                {(order
                                                                    .address
                                                                    ?.city ||
                                                                    order
                                                                        .address
                                                                        ?.state) && (
                                                                    <p>
                                                                        {
                                                                            order
                                                                                .address
                                                                                .city
                                                                        }

                                                                        {order
                                                                            .address
                                                                            ?.city &&
                                                                            order
                                                                                .address
                                                                                ?.state
                                                                            ? ", "
                                                                            : ""}

                                                                        {
                                                                            order
                                                                                .address
                                                                                .state
                                                                        }
                                                                    </p>
                                                                )}

                                                                {order
                                                                    .address
                                                                    ?.pincode && (
                                                                    <p>
                                                                        {
                                                                            order
                                                                                .address
                                                                                .pincode
                                                                        }
                                                                    </p>
                                                                )}

                                                                {order
                                                                    .address
                                                                    ?.phoneNumber && (
                                                                    <p
                                                                        className="
                                                                            mt-1
                                                                            text-[#918981]
                                                                        "
                                                                    >
                                                                        {
                                                                            order
                                                                                .address
                                                                                .phoneNumber
                                                                        }
                                                                    </p>
                                                                )}

                                                            </div>

                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="
                                                                border-t
                                                                border-[#EEEAE5]
                                                                pt-5

                                                                lg:border-l
                                                                lg:border-t-0
                                                                lg:pl-6
                                                                lg:pt-0
                                                            "
                                                        >
                                                            <p
                                                                className="
                                                                    text-[10px]
                                                                    text-[#A29A92]
                                                                "
                                                            >
                                                                Delivery address
                                                                unavailable
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* ==================================
                                                        PRICE
                                                    =================================== */}

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-between
                                                            border-t
                                                            border-[#EEEAE5]
                                                            pt-5

                                                            lg:block
                                                            lg:border-t-0
                                                            lg:pt-0
                                                            lg:text-right
                                                        "
                                                    >

                                                        <div>

                                                            <p
                                                                className="
                                                                    text-[9px]
                                                                    font-semibold
                                                                    uppercase
                                                                    tracking-[0.16em]
                                                                    text-[#A29A92]
                                                                "
                                                            >
                                                                Total
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    font-serif
                                                                    text-[25px]
                                                                    leading-none
                                                                    tracking-[-0.02em]
                                                                    text-[#292624]
                                                                "
                                                            >
                                                                {currency}
                                                                {order.amount}
                                                            </p>

                                                        </div>

                                                        <div
                                                            className="
                                                                text-right
                                                                lg:mt-3
                                                            "
                                                        >
                                                            <p
                                                                className="
                                                                    text-[9px]
                                                                    text-[#A29A92]
                                                                "
                                                            >
                                                                Cash on Delivery
                                                            </p>

                                                            {order.status !==
                                                                "Cancelled" && (
                                                                <p
                                                                    className="
                                                                        mt-0.5
                                                                        text-[9px]
                                                                        font-medium
                                                                        text-[#A47700]
                                                                    "
                                                                >
                                                                    Payment
                                                                    pending
                                                                </p>
                                                            )}
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* ======================================
                                                FOOTER
                                            ======================================= */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    border-t
                                                    border-[#EEEAE5]
                                                    px-5
                                                    py-3

                                                    sm:px-6
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-[9px]
                                                        text-[#A29A92]
                                                    "
                                                >
                                                    Thank you for choosing
                                                    Sunshine
                                                </span>

                                                <span
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-1
                                                        text-[9px]
                                                        font-medium
                                                        text-[#77716B]
                                                    "
                                                >
                                                    Order details
                                                    <ChevronIcon />
                                                </span>

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>
            </main>
        </>
    );
};

export default MyOrders;