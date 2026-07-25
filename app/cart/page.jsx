"use client";
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { currency } from "@/lib/constants";

const Cart = () => {
  const {
    products,
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
  } = useAppContext();

  const cartEntries = Object.keys(cartItems).filter((itemId) => {
    const product = products.find((p) => p._id === itemId);
    return product && cartItems[itemId] > 0;
  });

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-[#2E1A47]/10 pb-6">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
                Your bag
              </span>
              <h1 className="text-2xl md:text-3xl font-serif tracking-tight text-[#2E1A47]">
                Cart
              </h1>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FAF9FF] border border-[#EDEBFB] text-sm font-medium text-[#5B4B75]">
              {getCartCount()} {getCartCount() === 1 ? "item" : "items"}
            </span>
          </div>

          {cartEntries.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center text-center py-20">
              <span className="w-14 h-14 rounded-full bg-[#F5B700]/10 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6"
                    stroke="#F5B700"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="text-[#2E1A47] font-medium mb-1">Your cart is empty</p>
              <p className="text-[#5B4B75]/60 text-sm mb-6">
                Looks like you haven't added anything yet.
              </p>
              <button
                onClick={() => router.push("/all-products")}
                className="px-7 py-2.5 rounded-full font-semibold text-white transition-transform hover:scale-105 shadow-md"
                style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)" }}
              >
                Start shopping
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#EDEBFB]">
              <table className="min-w-full table-auto">
                <thead className="text-left bg-[#FAF9FF]">
                  <tr>
                    <th className="text-nowrap py-4 md:px-5 px-3 text-[#5B4B75] text-xs font-bold uppercase tracking-wider">
                      Product
                    </th>
                    <th className="py-4 md:px-5 px-3 text-[#5B4B75] text-xs font-bold uppercase tracking-wider">
                      Price
                    </th>
                    <th className="py-4 md:px-5 px-3 text-[#5B4B75] text-xs font-bold uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="py-4 md:px-5 px-3 text-[#5B4B75] text-xs font-bold uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartEntries.map((itemId) => {
                    const product = products.find((p) => p._id === itemId);

                    return (
                      <tr
                        key={itemId}
                        className="border-t border-[#EDEBFB] hover:bg-[#FAF9FF]/60 transition-colors"
                      >
                        <td className="flex items-center gap-4 py-5 md:px-5 px-3">
                          <div className="rounded-xl overflow-hidden bg-[#FAF9FF] border border-[#EDEBFB] p-2 shrink-0">
                            <Image
                              src={product.image[0]}
                              alt={product.name}
                              className="w-16 h-auto object-cover mix-blend-multiply"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <div className="text-sm">
                            <p className="text-[#2E1A47] font-medium">{product.name}</p>
                            <button
                              className="text-xs font-medium text-[#E8578E] mt-1.5 hover:underline"
                              onClick={() => updateCartQuantity(product._id, 0)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                        <td className="py-5 md:px-5 px-3 text-[#5B4B75]">
                          {currency}{product.offerPrice}
                        </td>
                        <td className="py-5 md:px-5 px-3">
                          <div className="flex items-center gap-1 bg-[#FAF9FF] border border-[#EDEBFB] rounded-full w-fit px-1 py-1">
                            <button
                              onClick={() =>
                                updateCartQuantity(product._id, cartItems[itemId] - 1)
                              }
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            >
                              <Image
                                src={assets.decrease_arrow}
                                alt="decrease"
                                className="w-3.5 h-3.5"
                              />
                            </button>
                            <input
                              onChange={(e) =>
                                updateCartQuantity(product._id, Number(e.target.value))
                              }
                              type="number"
                              value={cartItems[itemId]}
                              className="w-8 bg-transparent text-center text-sm font-medium text-[#2E1A47] outline-none appearance-none"
                            />
                            <button
                              onClick={() => addToCart(product._id)}
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                            >
                              <Image
                                src={assets.increase_arrow}
                                alt="increase"
                                className="w-3.5 h-3.5"
                              />
                            </button>
                          </div>
                        </td>
                        <td className="py-5 md:px-5 px-3 text-[#2E1A47] font-semibold">
                          {currency}{(product.offerPrice * cartItems[itemId]).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={() => router.push("/all-products")}
            className="group flex items-center mt-8 gap-2 text-[#8B5CF6] font-medium hover:text-[#6D3FD6] transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Continue Shopping
          </button>
        </div>

        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;