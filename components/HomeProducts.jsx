import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();

  return (
    <section className="w-full flex flex-col items-center pt-16 md:pt-20">
      {/* Section header */}
      <div className="flex flex-col items-center text-center mb-10 md:mb-12">
        <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
          Handpicked for you
        </span>
        <h2 className="text-2xl md:text-3xl font-serif tracking-tight text-[#2E1A47]">
          Popular Products
        </h2>
        <p className="text-[#5B4B75]/60 text-sm md:text-base mt-2 max-w-md">
          The costumes everyone's grabbing right now
        </p>
      </div>

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-[#5B4B75]/50 text-sm py-10">No products to show yet.</p>
      )}

      {/* CTA */}
      <button
        onClick={() => router.push("/all-products")}
        className="group flex items-center gap-2 mt-12 mb-16 px-8 py-3 rounded-full border border-[#2E1A47]/15 text-[#2E1A47] text-sm font-semibold hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 hover:text-[#8B5CF6] transition-all duration-300"
      >
        See more
        <svg
          width="14"
          height="14"
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
    </section>
  );
};

export default HomeProducts;