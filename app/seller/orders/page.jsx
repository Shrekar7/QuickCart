"use client";

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const statusStyles = {
    "Order placed": {
        bg: "bg-[#F5B700]/10",
        text: "text-[#B18400]",
        dot: "bg-[#F5B700]",
    },

    Dispatched: {
        bg: "bg-[#2E7D6B]/10",
        text: "text-[#2E7D6B]",
        dot: "bg-[#2E7D6B]",
    },

    Delivered: {
        bg: "bg-[#2E7D6B]/10",
        text: "text-[#2E7D6B]",
        dot: "bg-[#2E7D6B]",
    },

    Cancelled: {
        bg: "bg-[#E8578E]/10",
        text: "text-[#E8578E]",
        dot: "bg-[#E8578E]",
    },
};

const Orders = () => {
    const {
        currency,
        getToken,
        user,
    } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ============================================================
       FETCH SELLER ORDERS
    ============================================================ */

    const fetchSellerOrders = async () => {
        try {
            const token = await getToken();

            const { data } = await axios.get(
                "/api/order/seller-orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                // Latest orders first
                const sortedOrders = [...data.orders].sort(
                    (a, b) => Number(b.date) - Number(a.date)
                );

                setOrders(sortedOrders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(
                "SELLER ORDERS ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch orders"
            );
        } finally {
            setLoading(false);
        }
    };

    /* ============================================================
       UPDATE ORDER STATUS
    ============================================================ */

    const updateOrderStatus = async (
        orderId,
        status
    ) => {
        try {
            const token = await getToken();

            const { data } = await axios.post(
                "/api/order/update-status",
                {
                    orderId,
                    status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message);

                await fetchSellerOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(
                "UPDATE ORDER STATUS ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to update order status"
            );
        }
    };

    /* ============================================================
       FETCH WHEN SELLER LOGS IN
    ============================================================ */

    useEffect(() => {
        if (user) {
            fetchSellerOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    /* ============================================================
       LOADING
    ============================================================ */

    if (loading) {
        return (
            <div className="flex-1 min-h-screen flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    /* ============================================================
       PAGE
    ============================================================ */

    return (
        <div className="flex-1 min-h-screen overflow-y-auto bg-[#FAF9FF]/40 text-sm">

            <div className="p-4 sm:p-6 md:p-8 lg:p-10">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-7">

                    <div className="flex items-center gap-2 mb-2">

                        <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B5CF6]">
                            Store Management
                        </span>

                    </div>

                    <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-[#2E1A47]">
                        Orders
                    </h1>

                    <p className="mt-1.5 text-xs sm:text-sm text-[#5B4B75]/55">
                        Manage customer orders and update their delivery status.
                    </p>

                </div>

                {/* ==================================================
                    EMPTY STATE
                ================================================== */}

                {orders.length === 0 ? (

                    <div className="rounded-2xl border border-[#EDEBFB] bg-white px-6 py-16 text-center">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#8B5CF6]/10">

                            <Image
                                src={assets.box_icon}
                                alt="Orders"
                                width={27}
                                height={27}
                            />

                        </div>

                        <h2 className="text-base font-medium text-[#2E1A47]">
                            No orders yet
                        </h2>

                        <p className="mt-1 text-sm text-[#5B4B75]/50">
                            Customer orders will appear here once they place an order.
                        </p>

                    </div>

                ) : (

                    /* ==================================================
                       ORDERS LIST
                    ================================================== */

                    <div className="space-y-4">

                        {orders.map((order, index) => {

                            const statusStyle =
                                statusStyles[order.status] ||
                                statusStyles["Order placed"];

                            return (

                                <div
                                    key={
                                        order._id ||
                                        index
                                    }
                                    className="
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-[#EDEBFB]
                                        bg-white
                                        shadow-[0_4px_20px_rgba(46,26,71,0.025)]
                                        transition-all
                                        duration-300
                                        hover:border-[#DCD6F4]
                                        hover:shadow-[0_8px_30px_rgba(46,26,71,0.06)]
                                    "
                                >

                                    {/* ==================================================
                                        ORDER HEADER
                                    ================================================== */}

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            justify-between
                                            gap-3
                                            border-b
                                            border-[#EDEBFB]
                                            bg-[#FAF9FF]/70
                                            px-4
                                            py-3.5
                                            sm:px-5
                                        "
                                    >

                                        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-[#5B4B75]/55">

                                            <span className="font-medium text-[#5B4B75]/70">
                                                Order #
                                                {(order._id || "")
                                                    .toString()
                                                    .slice(-8)
                                                    .toUpperCase()}
                                            </span>

                                            <span className="h-1 w-1 rounded-full bg-[#5B4B75]/25" />

                                            <span>
                                                {new Date(
                                                    order.date
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </span>

                                        </div>

                                        {/* STATUS */}

                                        <span
                                            className={`
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                px-2.5
                                                py-1
                                                text-[10px]
                                                font-medium
                                                ${statusStyle.bg}
                                                ${statusStyle.text}
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

                                            {order.status}

                                        </span>

                                    </div>

                                    {/* ==================================================
                                        ORDER BODY
                                    ================================================== */}

                                    <div className="p-4 sm:p-5">

                                        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr_auto_auto] md:items-center">

                                            {/* ==================================================
                                                PRODUCTS
                                            ================================================== */}

                                            <div className="min-w-0">

                                                <div className="flex items-start gap-4">

                                                    {/* BOX ICON */}

                                                    <div
                                                        className="
                                                            flex
                                                            h-12
                                                            w-12
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            border
                                                            border-[#EDEBFB]
                                                            bg-[#FAF9FF]
                                                        "
                                                    >

                                                        <Image
                                                            src={
                                                                assets.box_icon
                                                            }
                                                            alt="Order"
                                                            width={24}
                                                            height={24}
                                                        />

                                                    </div>

                                                    {/* PRODUCTS */}

                                                    <div className="min-w-0 flex-1">

                                                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#5B4B75]/40">
                                                            Products
                                                        </p>

                                                        <div className="space-y-2">

                                                            {order.items?.map(
                                                                (
                                                                    item,
                                                                    itemIndex
                                                                ) => (

                                                                    <div
                                                                        key={
                                                                            item._id ||
                                                                            itemIndex
                                                                        }
                                                                        className="
                                                                            rounded-xl
                                                                            border
                                                                            border-[#F0EDF8]
                                                                            bg-[#FCFBFF]
                                                                            px-3
                                                                            py-2.5
                                                                        "
                                                                    >

                                                                        {/* PRODUCT NAME */}

                                                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

                                                                            <span className="text-sm font-medium text-[#2E1A47]">
                                                                                {item.product?.name ||
                                                                                    "Product"}
                                                                            </span>

                                                                            <span className="text-xs text-[#5B4B75]/35">
                                                                                ×
                                                                            </span>

                                                                            <span className="text-xs text-[#5B4B75]/65">
                                                                                {item.quantity}
                                                                            </span>

                                                                        </div>

                                                                        {/* SIZE */}

                                                                        <div className="mt-1.5 flex items-center gap-2">

                                                                            <span className="text-[10px] uppercase tracking-[0.12em] text-[#5B4B75]/40">
                                                                                Size
                                                                            </span>

                                                                            <span
                                                                                className="
                                                                                    inline-flex
                                                                                    min-w-[30px]
                                                                                    items-center
                                                                                    justify-center
                                                                                    rounded-md
                                                                                    border
                                                                                    border-[#DDD6F3]
                                                                                    bg-white
                                                                                    px-2
                                                                                    py-1
                                                                                    text-[11px]
                                                                                    font-semibold
                                                                                    text-[#6D4DB3]
                                                                                "
                                                                            >
                                                                                {item.size ||
                                                                                    "N/A"}
                                                                            </span>

                                                                        </div>

                                                                    </div>

                                                                )
                                                            )}

                                                        </div>

                                                        <p className="mt-2 text-[11px] text-[#5B4B75]/40">

                                                            {order.items?.length ||
                                                                0}{" "}

                                                            {order.items?.length ===
                                                            1
                                                                ? "product"
                                                                : "products"}

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* ==================================================
                                                ADDRESS
                                            ================================================== */}

                                            <div className="text-xs leading-relaxed text-[#5B4B75]/60">

                                                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B4B75]/35">
                                                    Delivery Address
                                                </p>

                                                {order.address ? (
                                                    <>
                                                        <p className="font-medium text-[#2E1A47]">
                                                            {
                                                                order
                                                                    .address
                                                                    .fullName
                                                            }
                                                        </p>

                                                        <p>
                                                            {
                                                                order
                                                                    .address
                                                                    .area
                                                            }
                                                        </p>

                                                        <p>
                                                            {
                                                                order
                                                                    .address
                                                                    .city
                                                            }
                                                            ,{" "}
                                                            {
                                                                order
                                                                    .address
                                                                    .state
                                                            }
                                                        </p>

                                                        <p>
                                                            {
                                                                order
                                                                    .address
                                                                    .phoneNumber
                                                            }
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-[#5B4B75]/40">
                                                        Address unavailable
                                                    </p>
                                                )}

                                            </div>

                                            {/* ==================================================
                                                AMOUNT
                                            ================================================== */}

                                            <div className="md:min-w-[110px] md:text-right">

                                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B4B75]/35">
                                                    Total
                                                </p>

                                                <p className="mt-1 text-xl font-serif text-[#2E1A47]">
                                                    {currency}
                                                    {order.amount}
                                                </p>

                                                <p className="mt-1 text-[10px] text-[#5B4B75]/40">
                                                    Cash on Delivery
                                                </p>

                                                <p className="mt-0.5 text-[10px] font-medium text-[#F5B700]">
                                                    Payment Pending
                                                </p>

                                            </div>

                                            {/* ==================================================
                                                STATUS / ACTION
                                            ================================================== */}

                                            <div className="md:min-w-[150px]">

                                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B4B75]/35">
                                                    Order Status
                                                </p>

                                                <p
                                                    className={`
                                                        mb-3
                                                        text-xs
                                                        font-medium
                                                        ${statusStyle.text}
                                                    `}
                                                >
                                                    {order.status}
                                                </p>

                                                {/* DISPATCH */}

                                                {order.status ===
                                                    "Order placed" && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateOrderStatus(
                                                                order._id,
                                                                "Dispatched"
                                                            )
                                                        }
                                                        className="
                                                            w-full
                                                            rounded-full
                                                            bg-[#2E7D6B]
                                                            px-4
                                                            py-2.5
                                                            text-[11px]
                                                            font-semibold
                                                            text-white
                                                            transition-all
                                                            duration-300
                                                            hover:-translate-y-0.5
                                                            hover:bg-[#246654]
                                                            hover:shadow-[0_8px_20px_rgba(46,125,107,0.18)]
                                                            active:scale-[0.98]
                                                        "
                                                    >
                                                        Dispatch Order
                                                    </button>

                                                )}

                                                {/* DELIVER */}

                                                {order.status ===
                                                    "Dispatched" && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateOrderStatus(
                                                                order._id,
                                                                "Delivered"
                                                            )
                                                        }
                                                        className="
                                                            w-full
                                                            rounded-full
                                                            bg-[#2E7D6B]
                                                            px-4
                                                            py-2.5
                                                            text-[11px]
                                                            font-semibold
                                                            text-white
                                                            transition-all
                                                            duration-300
                                                            hover:-translate-y-0.5
                                                            hover:bg-[#246654]
                                                            hover:shadow-[0_8px_20px_rgba(46,125,107,0.18)]
                                                            active:scale-[0.98]
                                                        "
                                                    >
                                                        Mark as Delivered
                                                    </button>

                                                )}

                                                {/* DELIVERED */}

                                                {order.status ===
                                                    "Delivered" && (

                                                    <div className="
                                                        flex
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-full
                                                        bg-[#2E7D6B]/8
                                                        px-4
                                                        py-2.5
                                                        text-[11px]
                                                        font-medium
                                                        text-[#2E7D6B]
                                                    ">

                                                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2E7D6B] text-[9px] text-white">
                                                            ✓
                                                        </span>

                                                        Delivered

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>

        </div>
    );
};

export default Orders;