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

// Two sizing scales, toggled like clothing sites let you pick either.
const ageSizes = [
  "0-1Y", "1-2Y", "2-3Y", "3-4Y", "5-6Y", "7-8Y",
  "9-10Y", "11-12Y", "13-14Y", "15-17Y",
];
const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const [sizingMode, setSizingMode] = useState("age"); // "age" | "size"
  const [selectedAges, setSelectedAges] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const activeOptions = sizingMode === "age" ? ageSizes : clothingSizes;
  const activeSelected = sizingMode === "age" ? selectedAges : selectedSizes;
  const setActiveSelected = sizingMode === "age" ? setSelectedAges : setSelectedSizes;

  const toggleOption = (value) => {
    setActiveSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("sizingMode", sizingMode);
    activeSelected.forEach((s) => formData.append("sizes", s));

    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        formData.append("images", files[i]);
      }
    }

    try {
      const token = await getToken();

      const { data } = await axios.post("/api/product/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setFiles([]);
        setName("");
        setDescription("");
        setCategory(categories[0]);
        setPrice("");
        setOfferPrice("");
        setSizingMode("age");
        setSelectedAges([]);
        setSelectedSizes([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const inputClass =
    "outline-none md:py-2.5 py-2 px-3.5 rounded-lg border border-[#2E1A47]/15 text-[#2E1A47] placeholder:text-[#5B4B75]/40 focus:border-[#8B5CF6] transition-colors";

  return (
    <div className="flex-1 min-h-screen bg-[#FAF9FF]/40 flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-5 max-w-2xl mx-auto md:mx-0 space-y-7">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
            Seller dashboard
          </span>
          <h1 className="text-2xl font-serif tracking-tight text-[#2E1A47]">
            Add a new product
          </h1>
        </div>

        {/* Image upload */}
        <div>
          <p className="text-sm font-semibold text-[#2E1A47] mb-2">Product images</p>
          <div className="flex flex-wrap items-center gap-3">
            {[...Array(4)].map((_, index) => (
              <label
                key={index}
                htmlFor={`image${index}`}
                className="relative w-24 h-24 rounded-xl border-2 border-dashed border-[#2E1A47]/15 bg-white overflow-hidden cursor-pointer group hover:border-[#8B5CF6] transition-colors"
              >
                <input
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                  type="file"
                  id={`image${index}`}
                  hidden
                />
                <Image
                  className="w-full h-full object-cover"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#2E1A47]" htmlFor="product-name">
            Product name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="e.g. Superhero Cape Costume"
            className={inputClass}
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#2E1A47]" htmlFor="product-description">
            Product description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Fabric, fit, occasion — whatever helps a parent decide"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
        </div>

        {/* Category / Price / Offer price */}
        <div className="flex items-start gap-5 flex-wrap">
          <div className="flex flex-col gap-1.5 w-40">
            <label className="text-sm font-semibold text-[#2E1A47]" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className={inputClass}
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 w-32">
            <label className="text-sm font-semibold text-[#2E1A47]" htmlFor="product-price">
              Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className={inputClass}
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5 w-32">
            <label className="text-sm font-semibold text-[#2E1A47]" htmlFor="offer-price">
              Offer price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className={inputClass}
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>

        {/* Age / Size selector with mode toggle */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <label className="text-sm font-semibold text-[#2E1A47]">
              Available sizes
            </label>

            {/* Mode toggle — pill switch, like a clothing site's size-scale toggle */}
            <div className="inline-flex p-1 rounded-full bg-white border border-[#2E1A47]/15">
              {["age", "size"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSizingMode(mode)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                    sizingMode === mode
                      ? "text-white"
                      : "text-[#5B4B75]/60 hover:text-[#2E1A47]"
                  }`}
                  style={
                    sizingMode === mode
                      ? { background: "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)" }
                      : undefined
                  }
                >
                  By {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {activeOptions.map((option) => {
              const active = activeSelected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(option)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    active
                      ? "text-white border-transparent"
                      : "text-[#2E1A47]/70 bg-white border-[#2E1A47]/15 hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
                  }`}
                  style={
                    active
                      ? { background: "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)" }
                      : undefined
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>

          {activeSelected.length === 0 && (
            <p className="text-xs text-[#5B4B75]/40">
              Select at least one {sizingMode === "age" ? "age range" : "size"} this listing is available in.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="px-9 py-2.5 rounded-full font-semibold text-white shadow-md transition-transform hover:scale-105"
          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)" }}
        >
          Add product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;