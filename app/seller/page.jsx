"use client";

import React, { useState } from "react";
import axios from "axios";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const categories = [
    "Doctor",
    "Superhero",
    "Service",
    "Halloween",
    "Animals & Birds",
    "Indian State & Dance",
];

// Special dropdown value that means "let me type my own category"
const CUSTOM_CATEGORY = "__custom__";

const ageSizes = [
    "0-1Y",
    "1-2Y",
    "2-3Y",
    "3-4Y",
    "5-6Y",
    "7-8Y",
    "9-10Y",
    "11-12Y",
    "13-14Y",
    "15-17Y",
];

const clothingSizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
];

const AddProduct = () => {
    const { getToken } = useAppContext();

    const [files, setFiles] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [customCategory, setCustomCategory] = useState("");

    const [price, setPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");

    const [sizingMode, setSizingMode] = useState("age");

    const [selectedSizes, setSelectedSizes] = useState([]);

    const isCustomCategory = category === CUSTOM_CATEGORY;

    const activeOptions =
        sizingMode === "age"
            ? ageSizes
            : clothingSizes;

    const toggleOption = (value) => {
        setSelectedSizes((prev) => {
            const alreadySelected = prev.some(
                (item) => item.name === value
            );

            if (alreadySelected) {
                return prev.filter(
                    (item) => item.name !== value
                );
            }

            return [
                ...prev,
                {
                    name: value,
                    price: "",
                },
            ];
        });
    };

    const handleSizePriceChange = (
        sizeName,
        value
    ) => {
        setSelectedSizes((prev) =>
            prev.map((item) =>
                item.name === sizeName
                    ? {
                          ...item,
                          price: value,
                      }
                    : item
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            toast.error(
                "Please upload at least one product image"
            );
            return;
        }

        /*
         * -----------------------------------------
         * CATEGORY (dropdown or custom)
         * -----------------------------------------
         */

        let finalCategory = category;

        if (isCustomCategory) {
            const typed = customCategory
                .trim()
                .replace(/\s+/g, " ");

            if (!typed) {
                toast.error(
                    "Please enter a category name"
                );
                return;
            }

            // If it matches an existing category (ignoring
            // capitals), reuse that one so you don't end up
            // with both "Halloween" and "halloween".
            const existing = categories.find(
                (cat) =>
                    cat.toLowerCase() ===
                    typed.toLowerCase()
            );

            finalCategory = existing || typed;
        }

        if (selectedSizes.length === 0) {
            toast.error(
                `Please select at least one ${
                    sizingMode === "age"
                        ? "age range"
                        : "size"
                }`
            );
            return;
        }

        const missingPrice =
            selectedSizes.some(
                (item) =>
                    !item.price ||
                    Number(item.price) <= 0
            );

        if (missingPrice) {
            toast.error(
                "Please enter a price for every selected size"
            );
            return;
        }

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append(
                "description",
                description
            );
            formData.append(
                "category",
                finalCategory
            );

            formData.append(
                "price",
                price
            );

            formData.append(
                "offerPrice",
                offerPrice
            );

            formData.append(
                "sizingMode",
                sizingMode
            );

            /*
             * -----------------------------------------
             * SIZES
             * -----------------------------------------
             *
             * Example:
             *
             * ["S", "M", "L"]
             */

            const sizeNames =
                selectedSizes.map(
                    (item) => item.name
                );

            formData.append(
                "sizes",
                JSON.stringify(sizeNames)
            );

            /*
             * -----------------------------------------
             * SIZE PRICES
             * -----------------------------------------
             *
             * Example:
             *
             * {
             *   S: 499,
             *   M: 599,
             *   L: 699
             * }
             */

            const sizePrices = {};

            selectedSizes.forEach((item) => {
                sizePrices[item.name] =
                    Number(item.price);
            });

            formData.append(
                "sizePrices",
                JSON.stringify(sizePrices)
            );

            /*
             * -----------------------------------------
             * IMAGES
             * -----------------------------------------
             */

            files.forEach((file) => {
                if (file) {
                    formData.append(
                        "images",
                        file
                    );
                }
            });

            /*
             * -----------------------------------------
             * SEND REQUEST
             * -----------------------------------------
             */

            const token =
                await getToken();

            const { data } =
                await axios.post(
                    "/api/product/add",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            if (data.success) {
                toast.success(
                    data.message
                );

                /*
                 * RESET FORM
                 */

                setFiles([]);
                setName("");
                setDescription("");
                setCategory(categories[0]);
                setCustomCategory("");
                setPrice("");
                setOfferPrice("");
                setSizingMode("age");
                setSelectedSizes([]);
            } else {
                toast.error(
                    data.message
                );
            }
        } catch (error) {
            console.error(
                "ADD PRODUCT ERROR:",
                error
            );

            toast.error(
                error.response?.data
                    ?.message ||
                    error.message ||
                    "Something went wrong"
            );
        }
    };

    const inputClass =
        "outline-none md:py-2.5 py-2 px-3.5 rounded-lg border border-[#2E1A47]/15 text-[#2E1A47] placeholder:text-[#5B4B75]/40 focus:border-[#8B5CF6] transition-colors";

    return (
        <div className="flex-1 min-h-screen bg-[#FAF9FF]/40 flex flex-col justify-between">

            <form
                onSubmit={handleSubmit}
                className="md:p-10 p-5 max-w-2xl mx-auto md:mx-0 space-y-7"
            >

                {/* HEADER */}

                <div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
                        Seller dashboard
                    </span>

                    <h1 className="text-2xl font-serif tracking-tight text-[#2E1A47]">
                        Add a new product
                    </h1>
                </div>

                {/* IMAGE UPLOAD */}

                <div>
                    <p className="text-sm font-semibold text-[#2E1A47] mb-2">
                        Product images
                    </p>

                    <div className="flex flex-wrap items-center gap-3">

                        {[...Array(4)].map(
                            (_, index) => (
                                <label
                                    key={index}
                                    htmlFor={`image${index}`}
                                    className="relative w-24 h-24 rounded-xl border-2 border-dashed border-[#2E1A47]/15 bg-white overflow-hidden cursor-pointer group hover:border-[#8B5CF6] transition-colors"
                                >
                                    <input
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0];

                                            if (!file)
                                                return;

                                            setFiles(
                                                (prev) => {
                                                    const updated =
                                                        [
                                                            ...prev,
                                                        ];

                                                    updated[
                                                        index
                                                    ] =
                                                        file;

                                                    return updated;
                                                }
                                            );
                                        }}
                                        type="file"
                                        id={`image${index}`}
                                        accept="image/*"
                                        hidden
                                    />

                                    <Image
                                        className="w-full h-full object-cover"
                                        src={
                                            files[index]
                                                ? URL.createObjectURL(
                                                      files[
                                                          index
                                                      ]
                                                  )
                                                : assets.upload_area
                                        }
                                        alt=""
                                        width={100}
                                        height={100}
                                    />
                                </label>
                            )
                        )}

                    </div>
                </div>

                {/* PRODUCT NAME */}

                <div className="flex flex-col gap-1.5">

                    <label
                        className="text-sm font-semibold text-[#2E1A47]"
                        htmlFor="product-name"
                    >
                        Product name
                    </label>

                    <input
                        id="product-name"
                        type="text"
                        placeholder="e.g. Superhero Cape Costume"
                        className={inputClass}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        value={name}
                        required
                    />

                </div>

                {/* DESCRIPTION */}

                <div className="flex flex-col gap-1.5">

                    <label
                        className="text-sm font-semibold text-[#2E1A47]"
                        htmlFor="product-description"
                    >
                        Product description
                    </label>

                    <textarea
                        id="product-description"
                        rows={4}
                        className={`${inputClass} resize-none`}
                        placeholder="Fabric, fit, occasion — whatever helps a parent decide"
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        value={description}
                        required
                    />

                </div>

                {/* CATEGORY / PRICE */}

                <div className="flex items-start gap-5 flex-wrap">

                    {/* CATEGORY */}

                    <div className="flex flex-col gap-1.5 w-48">

                        <label
                            className="text-sm font-semibold text-[#2E1A47]"
                            htmlFor="category"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            className={inputClass}
                            onChange={(e) =>
                                setCategory(
                                    e.target.value
                                )
                            }
                            value={category}
                        >
                            {categories.map(
                                (cat) => (
                                    <option
                                        key={cat}
                                        value={cat}
                                    >
                                        {cat}
                                    </option>
                                )
                            )}

                            <option
                                value={
                                    CUSTOM_CATEGORY
                                }
                            >
                                + Custom category…
                            </option>
                        </select>

                    </div>

                    {/* BASE PRICE */}

                    <div className="flex flex-col gap-1.5 w-32">

                        <label
                            className="text-sm font-semibold text-[#2E1A47]"
                            htmlFor="product-price"
                        >
                            Price
                        </label>

                        <input
                            id="product-price"
                            type="number"
                            min="1"
                            placeholder="0"
                            className={inputClass}
                            onChange={(e) =>
                                setPrice(
                                    e.target.value
                                )
                            }
                            value={price}
                            required
                        />

                    </div>

                    {/* OFFER PRICE */}

                    <div className="flex flex-col gap-1.5 w-32">

                        <label
                            className="text-sm font-semibold text-[#2E1A47]"
                            htmlFor="offer-price"
                        >
                            Offer price
                        </label>

                        <input
                            id="offer-price"
                            type="number"
                            min="1"
                            placeholder="0"
                            className={inputClass}
                            onChange={(e) =>
                                setOfferPrice(
                                    e.target.value
                                )
                            }
                            value={offerPrice}
                            required
                        />

                    </div>

                </div>

                {/* CUSTOM CATEGORY NAME */}

                {isCustomCategory && (
                    <div className="flex flex-col gap-1.5">

                        <label
                            className="text-sm font-semibold text-[#2E1A47]"
                            htmlFor="custom-category"
                        >
                            Custom category name
                        </label>

                        <input
                            id="custom-category"
                            type="text"
                            maxLength={40}
                            placeholder="e.g. Wedding"
                            className={`${inputClass} sm:max-w-xs`}
                            onChange={(e) =>
                                setCustomCategory(
                                    e.target.value
                                )
                            }
                            value={customCategory}
                            autoFocus
                            required
                        />

                        <p className="text-xs text-[#5B4B75]/50">
                            This product will be saved under
                            the name you type.
                        </p>

                    </div>
                )}

                {/* SIZE SELECTOR */}

                <div className="flex flex-col gap-4">

                    <div className="flex items-center justify-between flex-wrap gap-3">

                        <div>
                            <label className="text-sm font-semibold text-[#2E1A47]">
                                Available sizes & prices
                            </label>

                            <p className="text-xs text-[#5B4B75]/50 mt-1">
                                Select a size and enter its price.
                            </p>
                        </div>

                        {/* MODE TOGGLE */}

                        <div className="inline-flex p-1 rounded-full bg-white border border-[#2E1A47]/15">

                            {["age", "size"].map(
                                (mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => {
                                            setSizingMode(
                                                mode
                                            );
                                            setSelectedSizes(
                                                []
                                            );
                                        }}
                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                                            sizingMode ===
                                            mode
                                                ? "text-white"
                                                : "text-[#5B4B75]/60 hover:text-[#2E1A47]"
                                        }`}
                                        style={
                                            sizingMode ===
                                            mode
                                                ? {
                                                      background:
                                                          "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)",
                                                  }
                                                : undefined
                                        }
                                    >
                                        By {mode}
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                    {/* SIZE OPTIONS */}

                    <div className="flex flex-wrap gap-2.5">

                        {activeOptions.map(
                            (option) => {
                                const active =
                                    selectedSizes.some(
                                        (item) =>
                                            item.name ===
                                            option
                                    );

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() =>
                                            toggleOption(
                                                option
                                            )
                                        }
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                                            active
                                                ? "text-white border-transparent"
                                                : "text-[#2E1A47]/70 bg-white border-[#2E1A47]/15 hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
                                        }`}
                                        style={
                                            active
                                                ? {
                                                      background:
                                                          "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)",
                                                  }
                                                : undefined
                                        }
                                    >
                                        {option}
                                    </button>
                                );
                            }
                        )}

                    </div>

                    {/* SELECTED SIZE PRICES */}

                    {selectedSizes.length >
                        0 && (
                            <div className="rounded-2xl border border-[#EDEBFB] bg-white p-4 space-y-3">

                                <p className="text-sm font-semibold text-[#2E1A47]">
                                    Set price for each{" "}
                                    {sizingMode ===
                                    "age"
                                        ? "age range"
                                        : "size"}
                                </p>

                                {selectedSizes.map(
                                    (item) => (
                                        <div
                                            key={
                                                item.name
                                            }
                                            className="flex items-center gap-3"
                                        >

                                            <div className="w-24 shrink-0">

                                                <span className="inline-flex px-3 py-2 rounded-lg bg-[#FAF9FF] border border-[#EDEBFB] text-sm font-semibold text-[#2E1A47]">
                                                    {
                                                        item.name
                                                    }
                                                </span>

                                            </div>

                                            <div className="flex-1 relative">

                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5B4B75]/50">
                                                    ₹
                                                </span>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder="Enter price"
                                                    value={
                                                        item.price
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleSizePriceChange(
                                                            item.name,
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    className={`${inputClass} w-full pl-8`}
                                                    required
                                                />

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    {selectedSizes.length ===
                        0 && (
                            <p className="text-xs text-[#5B4B75]/40">
                                Select at least one{" "}
                                {sizingMode ===
                                "age"
                                    ? "age range"
                                    : "size"}{" "}
                                this listing is available in.
                            </p>
                        )}

                </div>

                {/* SUBMIT */}

                <button
                    type="submit"
                    className="px-9 py-2.5 rounded-full font-semibold text-white shadow-md transition-transform hover:scale-105"
                    style={{
                        background:
                            "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)",
                    }}
                >
                    Add product
                </button>

            </form>

        </div>
    );
};

export default AddProduct;