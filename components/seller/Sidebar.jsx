"use client";

import React from "react";
import Link from "next/link";
import { assets } from "../../assets/assets";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SideBar = () => {
    const pathname = usePathname();

    const menuItems = [
        {
            name: "Add Product",
            path: "/seller",
            icon: assets.add_icon,
        },
        {
            name: "Product List",
            path: "/seller/product-list",
            icon: assets.product_list_icon,
        },
        {
            name: "Inventory",
            path: "/seller/inventory",
            icon: assets.inventory_icon || assets.product_list_icon,
        },
        {
            name: "Orders",
            path: "/seller/orders",
            icon: assets.order_icon,
        },
    ];

    return (
        <aside className="md:w-64 w-[68px] min-h-screen border-r border-[#EDEBFB] bg-white text-sm flex flex-col">

            {/* =====================================================
                BRAND
            ===================================================== */}

            <div className="hidden md:flex items-center gap-3 px-6 py-6 border-b border-[#F0EDF7]">

                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">

                    <span className="w-2 h-2 rounded-full bg-[#F5B700]" />

                </div>

                <div className="leading-tight">
                    <p className="font-semibold text-[#2E1A47]">
                        Sunshine
                    </p>

                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#8B5CF6]/60 mt-0.5">
                        Seller Panel
                    </p>
                </div>

            </div>


            {/* =====================================================
                NAVIGATION LABEL
            ===================================================== */}

            <div className="hidden md:block px-6 pt-7 pb-3">

                <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#8B5CF6]/50">
                    Management
                </p>

            </div>


            {/* =====================================================
                MENU
            ===================================================== */}

            <nav className="flex flex-col gap-1 px-2 md:px-3">

                {menuItems.map((item) => {

                    const isActive =
                        pathname === item.path ||
                        (
                            item.path !== "/seller" &&
                            pathname.startsWith(`${item.path}/`)
                        );

                    return (
                        <Link
                            href={item.path}
                            key={item.name}
                            className="group"
                        >

                            <div
                                className={`
                                    relative
                                    flex
                                    items-center
                                    md:gap-3
                                    gap-0
                                    justify-center
                                    md:justify-start
                                    px-3
                                    md:px-4
                                    py-3
                                    rounded-xl
                                    transition-all
                                    duration-200

                                    ${
                                        isActive
                                            ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                                            : "text-[#6F667A] hover:bg-[#FAF9FF] hover:text-[#2E1A47]"
                                    }
                                `}
                            >

                                {/* ACTIVE INDICATOR */}

                                {isActive && (
                                    <span
                                        className="
                                            absolute
                                            left-0
                                            top-1/2
                                            -translate-y-1/2
                                            w-1
                                            h-7
                                            rounded-r-full
                                            bg-[#8B5CF6]
                                        "
                                    />
                                )}


                                {/* ICON */}

                                <div
                                    className={`
                                        flex
                                        items-center
                                        justify-center
                                        w-9
                                        h-9
                                        rounded-lg
                                        transition-all
                                        duration-200

                                        ${
                                            isActive
                                                ? "bg-white shadow-sm"
                                                : "group-hover:bg-white"
                                        }
                                    `}
                                >

                                    <Image
                                        src={item.icon}
                                        alt={`${item.name} icon`}
                                        width={22}
                                        height={22}
                                        className={`
                                            w-5
                                            h-5
                                            object-contain
                                            transition-transform
                                            duration-200
                                            ${
                                                isActive
                                                    ? "scale-105"
                                                    : "group-hover:scale-105"
                                            }
                                        `}
                                    />

                                </div>


                                {/* NAME */}

                                <p
                                    className={`
                                        hidden
                                        md:block
                                        font-medium
                                        text-[13px]
                                        ${
                                            isActive
                                                ? "text-[#2E1A47]"
                                                : ""
                                        }
                                    `}
                                >
                                    {item.name}
                                </p>

                            </div>

                        </Link>
                    );
                })}

            </nav>


            {/* =====================================================
                BOTTOM INFO
            ===================================================== */}

            <div className="hidden md:block mt-auto p-4">

                <div className="rounded-2xl bg-[#FAF9FF] border border-[#EDEBFB] p-4">

                    <div className="flex items-center gap-2 mb-2">

                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D6B]" />

                        <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[#2E7D6B]">
                            Store active
                        </span>

                    </div>

                    <p className="text-xs leading-relaxed text-[#6F667A]">
                        Manage your products, inventory and orders from here.
                    </p>

                </div>

            </div>

        </aside>
    );
};

export default SideBar;