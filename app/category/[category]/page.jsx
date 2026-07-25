"use client";
import React from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { getCategoryBySlug } from "@/lib/categories";

const CategoryPage = () => {
  const { category: categorySlug } = useParams();
  const { products, router } = useAppContext();

  const categoryInfo = getCategoryBySlug(categorySlug);

  const filteredProducts = products.filter(
    (product) => product.category === categoryInfo?.label
  );

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#5B4B75]/60 mb-8">
          <span
            className="hover:text-[#8B5CF6] cursor-pointer transition-colors"
            onClick={() => router.push("/")}
          >
            Home
          </span>
          <span>/</span>
          <span className="text-[#2E1A47] font-medium">
            {categoryInfo?.label || "Category"}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
            Category
          </span>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-[#2E1A47]">
            {categoryInfo?.label || "Not found"}
          </h1>
          {categoryInfo && (
            <p className="text-[#5B4B75]/60 text-sm mt-2">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>

        {!categoryInfo ? (
          <div className="flex flex-col items-center text-center py-16">
            <p className="text-[#2E1A47] font-medium mb-1">Category not found</p>
            <p className="text-[#5B4B75]/60 text-sm mb-6">
              That category doesn't exist — try browsing all products instead.
            </p>
            <button
              onClick={() => router.push("/all-products")}
              className="px-7 py-2.5 rounded-full font-semibold text-white transition-transform hover:scale-105 shadow-md"
              style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)" }}
            >
              Browse all products
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16">
            <span className="w-12 h-12 rounded-full bg-[#F5B700]/10 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 7h18M3 12h18M3 17h10" stroke="#F5B700" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <p className="text-[#2E1A47] font-medium mb-1">No products here yet</p>
            <p className="text-[#5B4B75]/60 text-sm">Check back soon, or explore other categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div key={index} className="transition-transform duration-300 hover:-translate-y-1.5">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;