"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";

const InventoryPage = () => {
    const { getToken, user } = useAppContext();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // ============================================================
    // FETCH INVENTORY
    // ============================================================

    const fetchInventory = async () => {
        try {
            setLoading(true);

            const token = await getToken();

            const { data } = await axios.get(
                "/api/inventory/list",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                setProducts(data.products || []);
            } else {
                toast.error(
                    data.message ||
                        "Failed to load inventory"
                );
            }
        } catch (error) {
            console.error(
                "FETCH INVENTORY ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to load inventory"
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        if (user) {
            fetchInventory();
        } else {
            setLoading(false);
        }
    }, [user]);

    // ============================================================
    // GET STOCK
    // ============================================================

    const getStock = (product, size) => {
        return Number(
            product.inventory?.[size] || 0
        );
    };

    // ============================================================
    // TOTAL STOCK
    // ============================================================

    const getTotalStock = (product) => {
        return (product.sizes || []).reduce(
            (total, size) => {
                return (
                    total +
                    getStock(product, size)
                );
            },
            0
        );
    };

    // ============================================================
    // STOCK STATUS
    // ============================================================

    const getStockStatus = (product) => {
        const total = getTotalStock(product);

        if (total === 0) {
            return "out";
        }

        if (total <= 5) {
            return "low";
        }

        return "good";
    };

    // ============================================================
    // STATUS TEXT
    // ============================================================

    const getStatusText = (status) => {
        if (status === "out") {
            return "Out of stock";
        }

        if (status === "low") {
            return "Low stock";
        }

        return "In stock";
    };

    // ============================================================
    // STATUS STYLING
    // ============================================================

    const getStatusClass = (status) => {
        if (status === "out") {
            return "bg-red-50 text-red-600";
        }

        if (status === "low") {
            return "bg-amber-50 text-amber-700";
        }

        return "bg-green-50 text-green-700";
    };

    // ============================================================
    // UPDATE STOCK IN UI
    // ============================================================

    const handleStockChange = (
        productId,
        size,
        value
    ) => {
        let quantity = Number(value);

        if (Number.isNaN(quantity)) {
            quantity = 0;
        }

        quantity = Math.max(
            0,
            Math.floor(quantity)
        );

        setProducts((currentProducts) =>
            currentProducts.map((product) => {
                if (
                    product._id !== productId
                ) {
                    return product;
                }

                return {
                    ...product,

                    inventory: {
                        ...(product.inventory || {}),
                        [size]: quantity,
                    },
                };
            })
        );
    };

    // ============================================================
    // SAVE INVENTORY
    // ============================================================

    const handleSaveInventory = async (
        product
    ) => {
        try {
            setSavingId(product._id);

            const token = await getToken();

            const inventory = {};

            (product.sizes || []).forEach(
                (size) => {
                    const quantity = Number(
                        product.inventory?.[
                            size
                        ] ?? 0
                    );

                    inventory[size] =
                        Number.isInteger(
                            quantity
                        ) &&
                        quantity >= 0
                            ? quantity
                            : 0;
                }
            );

            const { data } =
                await axios.post(
                    "/api/inventory/update",
                    {
                        productId:
                            product._id,
                        inventory,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            if (data.success) {
                toast.success(
                    "Inventory updated"
                );

                setProducts(
                    (currentProducts) =>
                        currentProducts.map(
                            (item) =>
                                item._id ===
                                product._id
                                    ? {
                                          ...item,
                                          inventory:
                                              data.inventory,
                                      }
                                    : item
                        )
                );
            } else {
                toast.error(
                    data.message ||
                        "Failed to update inventory"
                );
            }
        } catch (error) {
            console.error(
                "UPDATE INVENTORY ERROR:",
                error
            );

            toast.error(
                error.response?.data
                    ?.message ||
                    error.message ||
                    "Failed to update inventory"
            );
        } finally {
            setSavingId(null);
        }
    };

    // ============================================================
    // SUMMARY
    // ============================================================

    const summary = useMemo(() => {
        let totalUnits = 0;
        let lowStock = 0;
        let outOfStock = 0;

        products.forEach((product) => {
            const stock =
                getTotalStock(product);

            totalUnits += stock;

            if (stock === 0) {
                outOfStock++;
            } else if (stock <= 5) {
                lowStock++;
            }
        });

        return {
            products: products.length,
            totalUnits,
            lowStock,
            outOfStock,
        };
    }, [products]);

    // ============================================================
    // FILTER PRODUCTS
    // ============================================================

    const filteredProducts = useMemo(() => {
        const searchValue =
            search.toLowerCase().trim();

        return products.filter(
            (product) => {
                const matchesSearch =
                    !searchValue ||
                    product.name
                        ?.toLowerCase()
                        .includes(
                            searchValue
                        ) ||
                    product.category
                        ?.toLowerCase()
                        .includes(
                            searchValue
                        );

                const status =
                    getStockStatus(product);

                const matchesFilter =
                    filter === "all" ||
                    (filter ===
                        "in-stock" &&
                        status ===
                            "good") ||
                    (filter ===
                        "low-stock" &&
                        status ===
                            "low") ||
                    (filter ===
                        "out-of-stock" &&
                        status ===
                            "out");

                return (
                    matchesSearch &&
                    matchesFilter
                );
            }
        );
    }, [
        products,
        search,
        filter,
    ]);

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return <Loading />;
    }

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="min-h-screen bg-[#FAF9FF]/40">

            <main className="w-full max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-8 md:py-10">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-8">

                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B5CF6] mb-2">
                        Seller Dashboard
                    </p>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

                        <div>

                            <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-[#2E1A47]">
                                Inventory
                            </h1>

                            <p className="text-sm text-[#5B4B75]/60 mt-2">
                                Manage your product stock and availability.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={fetchInventory}
                            className="self-start md:self-auto px-5 py-2.5 rounded-xl border border-[#E7E1F0] bg-white text-sm font-medium text-[#2E1A47] hover:border-[#8B5CF6]/40 hover:text-[#8B5CF6] transition"
                        >
                            Refresh
                        </button>

                    </div>

                </div>

                {/* ==================================================
                    SUMMARY
                ================================================== */}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-7">

                    <SummaryCard
                        label="Products"
                        value={summary.products}
                    />

                    <SummaryCard
                        label="Total units"
                        value={summary.totalUnits}
                    />

                    <SummaryCard
                        label="Low stock"
                        value={summary.lowStock}
                        valueClass="text-amber-600"
                    />

                    <SummaryCard
                        label="Out of stock"
                        value={summary.outOfStock}
                        valueClass="text-red-600"
                    />

                </div>

                {/* ==================================================
                    SEARCH / FILTER
                ================================================== */}

                <div className="bg-white border border-[#EDE7F4] rounded-2xl p-3 mb-6">

                    <div className="flex flex-col md:flex-row gap-3">

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search products..."
                            className="flex-1 h-11 px-4 rounded-xl bg-[#FAF9FF] border border-transparent outline-none text-sm text-[#2E1A47] placeholder:text-[#5B4B75]/40 focus:bg-white focus:border-[#8B5CF6]/30 transition"
                        />

                        <select
                            value={filter}
                            onChange={(e) =>
                                setFilter(
                                    e.target.value
                                )
                            }
                            className="h-11 px-4 rounded-xl bg-[#FAF9FF] border border-transparent outline-none text-sm text-[#2E1A47] focus:bg-white focus:border-[#8B5CF6]/30 transition"
                        >

                            <option value="all">
                                All products
                            </option>

                            <option value="in-stock">
                                In stock
                            </option>

                            <option value="low-stock">
                                Low stock
                            </option>

                            <option value="out-of-stock">
                                Out of stock
                            </option>

                        </select>

                    </div>

                </div>

                {/* ==================================================
                    PRODUCTS
                ================================================== */}

                <div className="space-y-4">

                    {filteredProducts.length ===
                    0 ? (

                        <div className="bg-white border border-[#EDE7F4] rounded-2xl py-16 text-center">

                            <h3 className="text-base font-semibold text-[#2E1A47]">
                                No products found
                            </h3>

                            <p className="text-sm text-[#5B4B75]/50 mt-1">
                                Try changing your search or filter.
                            </p>

                        </div>

                    ) : (

                        filteredProducts.map(
                            (product) => {

                                const totalStock =
                                    getTotalStock(
                                        product
                                    );

                                const status =
                                    getStockStatus(
                                        product
                                    );

                                return (

                                    <div
                                        key={
                                            product._id
                                        }
                                        className="bg-white border border-[#EDE7F4] rounded-2xl overflow-hidden"
                                    >

                                        {/* PRODUCT HEADER */}

                                        <div className="p-5 md:p-6">

                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                                <div className="flex items-center gap-4 min-w-0">

                                                    {/* IMAGE */}

                                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#FAF9FF] border border-[#EDE7F4] overflow-hidden shrink-0">

                                                        {product.image?.[0] ? (

                                                            <Image
                                                                src={
                                                                    product.image[
                                                                        0
                                                                    ]
                                                                }
                                                                alt={
                                                                    product.name ||
                                                                    "Product"
                                                                }
                                                                width={
                                                                    100
                                                                }
                                                                height={
                                                                    100
                                                                }
                                                                className="w-full h-full object-contain"
                                                            />

                                                        ) : (

                                                            <div className="w-full h-full flex items-center justify-center text-xs text-[#5B4B75]/40">
                                                                No image
                                                            </div>

                                                        )}

                                                    </div>

                                                    {/* NAME */}

                                                    <div className="min-w-0">

                                                        <h2 className="text-base md:text-lg font-semibold text-[#2E1A47] truncate">
                                                            {
                                                                product.name
                                                            }
                                                        </h2>

                                                        <p className="text-sm text-[#5B4B75]/55 mt-1">
                                                            {
                                                                product.category
                                                            }
                                                        </p>

                                                        <p className="text-xs text-[#5B4B75]/40 mt-1">
                                                            {product.sizingMode ===
                                                            "age"
                                                                ? "Age based"
                                                                : "Size based"}
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* STATUS */}

                                                <div className="flex items-center gap-4 md:pl-4">

                                                    <div className="text-right">

                                                        <p className="text-xs text-[#5B4B75]/40">
                                                            Total stock
                                                        </p>

                                                        <p className="text-lg font-semibold text-[#2E1A47] mt-0.5">
                                                            {
                                                                totalStock
                                                            }
                                                        </p>

                                                    </div>

                                                    <span
                                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(
                                                            status
                                                        )}`}
                                                    >
                                                        {getStatusText(
                                                            status
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                        {/* SIZE TABLE */}

                                        <div className="border-t border-[#F0EBF5]">

                                            {/* TABLE HEADER */}

                                            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_100px] gap-4 px-6 py-3 bg-[#FCFBFE] text-[11px] font-bold uppercase tracking-wider text-[#5B4B75]/45">

                                                <span>
                                                    {product.sizingMode ===
                                                    "age"
                                                        ? "Age range"
                                                        : "Size"}
                                                </span>

                                                <span>
                                                    Price
                                                </span>

                                                <span>
                                                    Stock
                                                </span>

                                                <span>
                                                    Status
                                                </span>

                                            </div>

                                            {/* SIZE ROWS */}

                                            <div>

                                                {(product.sizes ||
                                                    []).map(
                                                    (
                                                        size
                                                    ) => {

                                                        const quantity =
                                                            getStock(
                                                                product,
                                                                size
                                                            );

                                                        const sizeStatus =
                                                            quantity ===
                                                            0
                                                                ? "out"
                                                                : quantity <=
                                                                  5
                                                                ? "low"
                                                                : "good";

                                                        const price =
                                                            Number(
                                                                product.sizePrices?.[
                                                                    size
                                                                ] ??
                                                                    product.offerPrice ??
                                                                    0
                                                            );

                                                        return (

                                                            <div
                                                                key={
                                                                    size
                                                                }
                                                                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_100px] gap-3 md:gap-4 items-center px-5 md:px-6 py-4 border-t border-[#F4F0F7] first:border-t-0"
                                                            >

                                                                {/* SIZE */}

                                                                <div>

                                                                    <span className="text-sm font-semibold text-[#2E1A47]">
                                                                        {
                                                                            size
                                                                        }
                                                                    </span>

                                                                    <span className="md:hidden block text-[11px] text-[#5B4B75]/40 mt-1">
                                                                        {product.sizingMode ===
                                                                        "age"
                                                                            ? "Age range"
                                                                            : "Size"}
                                                                    </span>

                                                                </div>

                                                                {/* PRICE */}

                                                                <div>

                                                                    <span className="md:hidden block text-[11px] text-[#5B4B75]/40 mb-1">
                                                                        Price
                                                                    </span>

                                                                    <span className="text-sm text-[#5B4B75]">
                                                                        ₹
                                                                        {
                                                                            price
                                                                        }
                                                                    </span>

                                                                </div>

                                                                {/* STOCK */}

                                                                <div>

                                                                    <span className="md:hidden block text-[11px] text-[#5B4B75]/40 mb-1">
                                                                        Stock
                                                                    </span>

                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        step="1"
                                                                        value={
                                                                            quantity
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleStockChange(
                                                                                product._id,
                                                                                size,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="w-full md:max-w-[120px] h-10 px-3 rounded-lg bg-[#FAF9FF] border border-[#E7E1F0] outline-none text-sm font-medium text-[#2E1A47] focus:bg-white focus:border-[#8B5CF6]/40 transition"
                                                                    />

                                                                </div>

                                                                {/* STATUS */}

                                                                <div>

                                                                    <span
                                                                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusClass(
                                                                            sizeStatus
                                                                        )}`}
                                                                    >
                                                                        {sizeStatus ===
                                                                        "out"
                                                                            ? "Out"
                                                                            : sizeStatus ===
                                                                              "low"
                                                                            ? "Low"
                                                                            : "Good"}
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        );
                                                    }
                                                )}

                                            </div>

                                        </div>

                                        {/* FOOTER */}

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 md:px-6 py-4 bg-[#FCFBFE] border-t border-[#F0EBF5]">

                                            <p className="text-xs text-[#5B4B75]/45">
                                                Update the stock quantity for each{" "}
                                                {product.sizingMode ===
                                                "age"
                                                    ? "age range"
                                                    : "size"}{" "}
                                                and save your changes.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSaveInventory(
                                                        product
                                                    )
                                                }
                                                disabled={
                                                    savingId ===
                                                    product._id
                                                }
                                                className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition hover:scale-[1.01]"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)",
                                                }}
                                            >
                                                {savingId ===
                                                product._id
                                                    ? "Saving..."
                                                    : "Save Changes"}
                                            </button>

                                        </div>

                                    </div>

                                );
                            }
                        )

                    )}

                </div>

            </main>

        </div>
    );
};

// ============================================================
// SUMMARY CARD
// ============================================================

const SummaryCard = ({
    label,
    value,
    valueClass = "text-[#2E1A47]",
}) => {
    return (
        <div className="bg-white border border-[#EDE7F4] rounded-2xl p-4 md:p-5">

            <p className="text-xs md:text-sm text-[#5B4B75]/55">
                {label}
            </p>

            <p
                className={`text-2xl md:text-3xl font-semibold mt-1 ${valueClass}`}
            >
                {value}
            </p>

        </div>
    );
};

export default InventoryPage;