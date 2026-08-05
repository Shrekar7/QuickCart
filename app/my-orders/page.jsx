"use client";

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const statusStyles = {
    "Order placed": {
        bg: "bg-[#8B5CF6]/10",
        text: "text-[#8B5CF6]",
        dot: "bg-[#8B5CF6]",
    },
    Shipped: {
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

const MyOrders = () => {
    const { currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = await getToken();

            const { data } = await axios.get("/api/order/list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                setOrders(data.orders.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#FAF9FF]/50 px-5 md:px-10 lg:px-20 py-10 md:py-14">
                <div className="max-w-5xl mx-auto">

                    {/* ========================================
                        PAGE HEADER
                    ======================================== */}

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />

                            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8B5CF6]">
                                Order History
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-serif text-[#2E1A47] tracking-tight">
                            My Orders
                        </h1>

                        <p className="text-sm text-[#5B4B75]/55 mt-2">
                            View and track your recent orders.
                        </p>
                    </div>

                    {/* ========================================
                        LOADING
                    ======================================== */}

                    {loading ? (
                        <div className="py-16">
                            <Loading />
                        </div>
                    ) : orders.length === 0 ? (

                        /* ========================================
                           EMPTY STATE
                        ======================================== */

                        <div className="bg-white border border-[#EDEBFB] rounded-2xl py-16 px-6 text-center">
                            <div className="w-12 h-12 mx-auto rounded-full bg-[#8B5CF6]/8 flex items-center justify-center mb-4">
                                <Image
                                    src={assets.box_icon}
                                    alt=""
                                    width={24}
                                    height={24}
                                />
                            </div>

                            <h2 className="text-base font-medium text-[#2E1A47]">
                                No orders yet
                            </h2>

                            <p className="text-sm text-[#5B4B75]/55 mt-1">
                                Your orders will appear here once you place one.
                            </p>
                        </div>

                    ) : (

                        /* ========================================
                           ORDERS
                        ======================================== */

                        <div className="space-y-4">

                            {orders.map((order, index) => {

                                const statusStyle =
                                    statusStyles[order.status] ||
                                    statusStyles["Order placed"];

                                return (
                                    <div
                                        key={order._id || index}
                                        className="bg-white border border-[#EDEBFB] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#DCD6F4] hover:shadow-[0_6px_24px_rgba(46,26,71,0.05)]"
                                    >

                                        {/* ========================================
                                            ORDER TOP BAR
                                        ======================================== */}

                                        <div className="flex flex-wrap items-center justify-between gap-3 px-5 md:px-6 py-3.5 bg-[#FAF9FF]/70 border-b border-[#EDEBFB]">

                                            <div className="flex items-center gap-3 text-xs text-[#5B4B75]/55">

                                                <span>
                                                    Order #
                                                    {(order._id || "")
                                                        .toString()
                                                        .slice(-8)
                                                        .toUpperCase()}
                                                </span>

                                                <span className="w-1 h-1 rounded-full bg-[#5B4B75]/25" />

                                                <span>
                                                    {new Date(order.date).toLocaleDateString(
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
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${statusStyle.bg} ${statusStyle.text}`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                                                />

                                                {order.status}
                                            </span>

                                        </div>

                                        {/* ========================================
                                            ORDER CONTENT
                                        ======================================== */}

                                        <div className="p-5 md:p-6">

                                            <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-7">

                                                {/* ========================================
                                                    PRODUCTS
                                                ======================================== */}

                                                <div className="flex items-center gap-4 flex-1 min-w-0">

                                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-[#FAF9FF] border border-[#EDEBFB] flex items-center justify-center">
                                                        <Image
                                                            src={assets.box_icon}
                                                            alt="Order"
                                                            width={24}
                                                            height={24}
                                                        />
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="text-sm font-medium text-[#2E1A47] leading-relaxed">
                                                            {order.items
                                                                ?.map(
                                                                    (item) =>
                                                                        `${item.product?.name || "Product"} × ${item.quantity}`
                                                                )
                                                                .join(", ")}
                                                        </p>

                                                        <p className="text-xs text-[#5B4B75]/45 mt-1">
                                                            {order.items?.length || 0}{" "}
                                                            {order.items?.length === 1
                                                                ? "item"
                                                                : "items"}
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* ========================================
                                                    ADDRESS
                                                ======================================== */}

                                                {order.address && (
                                                    <div className="md:w-52 shrink-0 text-xs text-[#5B4B75]/65 leading-relaxed">

                                                        <p className="text-[10px] uppercase tracking-wider font-semibold text-[#5B4B75]/40 mb-1">
                                                            Delivery Address
                                                        </p>

                                                        <p className="font-medium text-[#2E1A47]">
                                                            {order.address.fullName}
                                                        </p>

                                                        <p>
                                                            {order.address.area}
                                                        </p>

                                                        <p>
                                                            {order.address.city},{" "}
                                                            {order.address.state}
                                                        </p>

                                                        <p>
                                                            {order.address.phoneNumber}
                                                        </p>

                                                    </div>
                                                )}

                                                {/* ========================================
                                                    PRICE
                                                ======================================== */}

                                                <div className="md:w-32 shrink-0 md:text-right">

                                                    <p className="text-xl font-serif text-[#2E1A47]">
                                                        {currency}
                                                        {order.amount}
                                                    </p>

                                                    <p className="text-[11px] text-[#5B4B75]/45 mt-1">
                                                        Cash on Delivery
                                                    </p>

                                                    <p className="text-[11px] text-[#F5B700] font-medium mt-0.5">
                                                        Payment Pending
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </div>
            </main>
        </>
    );
};

export default MyOrders;