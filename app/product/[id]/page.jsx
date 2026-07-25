"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { currency } from "@/lib/constants";
import React from "react";

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const fetchProductData = async () => {
    const product = products.find((product) => product._id === id);
    setProductData(product);
  };

  useEffect(() => {
    fetchProductData();
  }, [id, products.length]);

  useEffect(() => {
    setSelectedSize(null);
    setMainImage(null);
  }, [productData?._id]);

  const requireSize = () => {
    if (!productData?.sizes || productData.sizes.length === 0) return true;
    if (!selectedSize) {
      toast.error(
        productData.sizingMode === "age"
          ? "Please select an age range"
          : "Please select a size"
      );
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!requireSize()) return;
    addToCart(productData._id);
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    if (!requireSize()) return;
    addToCart(productData._id);
    router.push("/cart");
  };

  const discountPercent =
    productData && productData.price > productData.offerPrice
      ? Math.round(
          ((productData.price - productData.offerPrice) / productData.price) * 100
        )
      : 0;

  return productData ? (
    <>
      <Navbar />

      <div className="px-6 md:px-16 lg:px-32 pt-10 md:pt-14 pb-24 md:pb-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#5B4B75]/60 mb-8">
          <span className="hover:text-[#8B5CF6] cursor-pointer transition-colors" onClick={() => router.push("/")}>
            Home
          </span>
          <span>/</span>
          <span className="hover:text-[#8B5CF6] cursor-pointer transition-colors" onClick={() => router.push("/all-products")}>
            Shop
          </span>
          <span>/</span>
          <span className="text-[#2E1A47] font-medium">{productData.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Gallery */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-[#FAF9FF] border border-[#EDEBFB] mb-4 aspect-square">
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, #E8578E 0%, #C23A6F 100%)" }}
                >
                  {discountPercent}% OFF
                </span>
              )}

              {/* Wishlist toggle */}
              <button
                onClick={() => setIsWishlisted((prev) => !prev)}
                aria-label="Add to wishlist"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "#E8578E" : "none"}>
                  <path
                    d="M12 21s-6.7-4.35-9.5-8.1C.6 10.1 1.2 6.3 4.4 4.9c2.2-1 4.7-.3 6.1 1.6l1.5 2 1.5-2c1.4-1.9 3.9-2.6 6.1-1.6 3.2 1.4 3.8 5.2 1.9 8-2.8 3.75-9.5 8.1-9.5 8.1z"
                    stroke={isWishlisted ? "#E8578E" : "#2E1A47"}
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <Image
                src={mainImage || productData.image[0]}
                alt={productData.name}
                fill
                className="object-contain mix-blend-multiply p-6"
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {productData.image.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-[#FAF9FF] border-2 transition-colors ${
                    (mainImage || productData.image[0]) === image
                      ? "border-[#8B5CF6]"
                      : "border-[#EDEBFB] hover:border-[#8B5CF6]/50"
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-contain mix-blend-multiply p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-3 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
              {productData.category}
            </span>

            <h1 className="text-3xl md:text-[38px] font-serif tracking-tight text-[#2E1A47] leading-tight">
              {productData.name}
            </h1>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-0.5">
                <Image className="h-4 w-4" src={assets.star_icon} alt="" />
                <Image className="h-4 w-4" src={assets.star_icon} alt="" />
                <Image className="h-4 w-4" src={assets.star_icon} alt="" />
                <Image className="h-4 w-4" src={assets.star_icon} alt="" />
                <Image className="h-4 w-4" src={assets.star_dull_icon} alt="" />
              </div>
              <p className="text-sm text-[#5B4B75]/60">(4.5)</p>
            </div>

            <p className="text-[#5B4B75]/70 mt-5 leading-relaxed">
              {productData.description}
            </p>

            {/* Price block, relabeled */}
            <div className="mt-6 rounded-2xl bg-[#FAF9FF] border border-[#EDEBFB] p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#5B4B75]/50 mb-1.5">
                Special price
              </p>
              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="text-4xl font-serif text-[#2E1A47]">
                  {currency}{productData.offerPrice}
                </p>
                {discountPercent > 0 && (
                  <>
                    <p className="text-base text-[#5B4B75]/40">
                      M.R.P.:{" "}
                      <span className="line-through">
                        {currency}{productData.price}
                      </span>
                    </p>
                    <span className="text-sm font-semibold text-[#2E7D6B]">
                      You save {currency}{(productData.price - productData.offerPrice).toFixed(2)} ({discountPercent}%)
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#5B4B75]/40 mt-2">Inclusive of all taxes</p>
            </div>

            {/* Size / age selector */}
            {productData.sizes && productData.sizes.length > 0 && (
              <div className="mt-7">
                <p className="text-sm font-semibold text-[#2E1A47] mb-3">
                  {productData.sizingMode === "age" ? "Select age" : "Select size"}
                  <span className="text-[#E8578E]"> *</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {productData.sizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
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
                        {size}
                      </button>
                    );
                  })}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-[#5B4B75]/40 mt-2.5">
                    {productData.sizingMode === "age"
                      ? "Please select an age range before adding to cart."
                      : "Please select a size before adding to cart."}
                  </p>
                )}
              </div>
            )}

            {/* Details card */}
            <div className="mt-7 rounded-2xl border border-[#EDEBFB] bg-[#FAF9FF]/60 p-5">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <p className="text-[#5B4B75]/60 font-medium">Brand</p>
                <p className="text-[#2E1A47]">Generic</p>

                <p className="text-[#5B4B75]/60 font-medium">Color</p>
                <p className="text-[#2E1A47]">Multi</p>

                <p className="text-[#5B4B75]/60 font-medium">Category</p>
                <p className="text-[#2E1A47]">{productData.category}</p>

                {selectedSize && (
                  <>
                    <p className="text-[#5B4B75]/60 font-medium">
                      {productData.sizingMode === "age" ? "Age" : "Size"}
                    </p>
                    <p className="text-[#2E1A47] font-medium">{selectedSize}</p>
                  </>
                )}
              </div>
            </div>

            {/* Actions — hidden on mobile, sticky bar takes over there */}
            <div className="hidden md:flex items-center gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-full font-semibold text-[#2E1A47] bg-white border border-[#2E1A47]/15 hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 rounded-full font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)" }}
              >
                Buy Now
              </button>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-xs text-[#5B4B75]/60">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D6B]" />
                Easy returns
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D6B]" />
                Secure checkout
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D6B]" />
                Quality checked
              </span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ReviewSection productId={productData._id} />

        {/* Featured products */}
        <div className="flex flex-col items-center mt-20 md:mt-28">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] uppercase text-[#8B5CF6] mb-4">
            <span className="w-6 h-px bg-[#8B5CF6]" />
            You might also like
            <span className="w-6 h-px bg-[#8B5CF6]" />
          </span>
          <h2 className="text-2xl md:text-3xl font-serif tracking-tight text-[#2E1A47]">
            Featured Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-10 pb-14 w-full">
            {products.slice(0, 5).map((product, index) => (
              <div key={index} className="transition-transform duration-300 hover:-translate-y-1.5">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/all-products")}
            className="group flex items-center gap-2 mb-16 px-8 py-3 rounded-full border border-[#2E1A47]/15 text-[#2E1A47] text-sm font-semibold hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 hover:text-[#8B5CF6] transition-all duration-300"
          >
            See more
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sticky mobile action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EDEBFB] px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(46,26,71,0.06)]">
        <div className="shrink-0">
          <p className="text-lg font-serif text-[#2E1A47] leading-none">
            {currency}{productData.offerPrice}
          </p>
          {discountPercent > 0 && (
            <p className="text-[11px] text-[#5B4B75]/40 line-through leading-none mt-0.5">
              {currency}{productData.price}
            </p>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 rounded-full font-semibold text-sm text-[#2E1A47] bg-white border border-[#2E1A47]/15"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 rounded-full font-semibold text-sm text-white"
          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)" }}
        >
          Buy Now
        </button>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Product;