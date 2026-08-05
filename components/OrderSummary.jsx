"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    getToken,
    user,
    cartItems,
    setCartItems,
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [promoCode, setPromoCode] = useState("");

  // ========================================
  // FETCH USER ADDRESSES
  // ========================================

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/user/get-address", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserAddresses(data.addresses);

        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch addresses");
    }
  };

  // ========================================
  // ADDRESS SELECT
  // ========================================

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  // ========================================
  // CREATE ORDER
  // ========================================

  const createOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      /*
       * Convert cart object into order items.
       *
       * Your cart currently contains product IDs such as:
       *
       * 6a63b70d595ce26df62b34de::S
       *
       * MongoDB expects only:
       *
       * 6a63b70d595ce26df62b34de
       *
       * So we remove anything after "::".
       */

      let cartItemsArray = Object.keys(cartItems)
        .map((key) => {
          const productId = key.split("::")[0];
          const quantity = Number(cartItems[key]);

          return {
            product: productId,
            quantity,
          };
        })
        .filter((item) => item.quantity > 0);

      // Remove duplicate product IDs if the corrupted cart
      // happens to contain both ID and ID::S.
      const mergedItems = {};

      cartItemsArray.forEach((item) => {
        if (mergedItems[item.product]) {
          mergedItems[item.product] += item.quantity;
        } else {
          mergedItems[item.product] = item.quantity;
        }
      });

      cartItemsArray = Object.entries(mergedItems).map(
        ([product, quantity]) => ({
          product,
          quantity,
        })
      );

      // Check whether cart is actually empty
      if (cartItemsArray.length === 0) {
        return toast.error("Cart is empty");
      }

      console.log("ORDER ITEMS:", cartItemsArray);

      const token = await getToken();

      const { data } = await axios.post(
        "/api/order/create",
        {
          address: selectedAddress._id,
          items: cartItemsArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        // Clear frontend cart after successful order
        setCartItems({});

        router.push("/order-placed");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("CREATE ORDER FRONTEND ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    }
  };

  // ========================================
  // FETCH ADDRESSES WHEN USER LOADS
  // ========================================

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  // ========================================
  // PRICE CALCULATIONS
  // ========================================

  const cartAmount = getCartAmount();
  const tax = Math.floor(cartAmount * 0.02);
  const total = cartAmount + tax;

  return (
    <div className="w-full md:w-[390px] bg-[#FAF9FF] border border-[#EDEBFB] rounded-3xl p-5 md:p-6 shadow-[0_12px_40px_rgba(46,26,71,0.07)]">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-[#2E1A47]">
            Order Summary
          </h2>

          <p className="text-xs text-[#5B4B75]/55 mt-1">
            Review your order before placing it
          </p>
        </div>

        <div className="w-9 h-9 rounded-full bg-[#F5B700]/10 flex items-center justify-center">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 7h12l-1 13H7L6 7Z"
              stroke="#F5B700"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />

            <path
              d="M9 7a3 3 0 0 1 6 0"
              stroke="#F5B700"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="h-px bg-[#E8E4F5] my-5" />

      {/* ========================================
          ADDRESS
      ======================================== */}

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#5B4B75]/70">
            Delivery Address
          </label>

          <button
            type="button"
            onClick={() => router.push("/add-address")}
            className="text-xs font-semibold text-[#8B5CF6] hover:text-[#6D3FE0] transition-colors"
          >
            + Add New
          </button>
        </div>

        <div className="relative w-full">

          {/* SELECTED ADDRESS */}

          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full text-left px-4 py-3.5 bg-white border rounded-2xl transition-all duration-200 ${
              isDropdownOpen
                ? "border-[#8B5CF6]/50 shadow-[0_0_0_4px_rgba(139,92,246,0.08)]"
                : "border-[#E5E1F1] hover:border-[#8B5CF6]/30"
            }`}
          >
            <div className="flex items-start gap-3">

              {/* Location icon */}

              <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center shrink-0">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                    stroke="#8B5CF6"
                    strokeWidth="1.8"
                  />

                  <circle
                    cx="12"
                    cy="10"
                    r="2.5"
                    stroke="#8B5CF6"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0 pr-2">

                {selectedAddress ? (
                  <>
                    <p className="text-sm font-semibold text-[#2E1A47] truncate">
                      {selectedAddress.fullName}
                    </p>

                    <p className="text-xs text-[#5B4B75]/60 mt-1 leading-5">
                      {selectedAddress.area}, {selectedAddress.city},{" "}
                      {selectedAddress.state}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-[#5B4B75]/55">
                    Select a delivery address
                  </p>
                )}
              </div>

              {/* Chevron */}

              <svg
                className={`w-4 h-4 mt-1 text-[#5B4B75]/50 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {/* ========================================
              ADDRESS DROPDOWN
          ======================================== */}

          {isDropdownOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-[#EDEBFB] rounded-2xl shadow-2xl z-30 overflow-hidden">

              <div className="px-4 py-3 border-b border-[#EDEBFB]">
                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#5B4B75]/40">
                  Your Addresses
                </p>
              </div>

              <div className="max-h-56 overflow-y-auto">

                {userAddresses.length > 0 ? (
                  userAddresses.map((address, index) => (
                    <button
                      key={address._id || index}
                      type="button"
                      onClick={() => handleAddressSelect(address)}
                      className="w-full text-left px-4 py-3 hover:bg-[#FAF9FF] transition-colors border-b border-[#F2F0F8] last:border-b-0"
                    >
                      <div className="flex items-start gap-3">

                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            selectedAddress?._id === address._id
                              ? "bg-[#8B5CF6]/10"
                              : "bg-[#F7F5FC]"
                          }`}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                              stroke={
                                selectedAddress?._id === address._id
                                  ? "#8B5CF6"
                                  : "#5B4B75"
                              }
                              strokeWidth="1.8"
                            />
                          </svg>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#2E1A47]">
                            {address.fullName}
                          </p>

                          <p className="text-xs text-[#5B4B75]/55 mt-1 leading-5">
                            {address.area}, {address.city},{" "}
                            {address.state}
                          </p>
                        </div>

                        {selectedAddress?._id === address._id && (
                          <div className="mt-1">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="m5 12 4 4L19 6"
                                stroke="#8B5CF6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm text-[#5B4B75]/60">
                      No saved addresses
                    </p>
                  </div>
                )}

              </div>

              <button
                type="button"
                onClick={() => router.push("/add-address")}
                className="w-full px-4 py-3 text-sm font-semibold text-[#8B5CF6] bg-[#FAF9FF] hover:bg-[#F3F0FF] transition-colors border-t border-[#EDEBFB]"
              >
                + Add New Address
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================
          PROMO CODE
      ======================================== */}

      <div className="mt-6">

        <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#5B4B75]/70 block mb-2.5">
          Promo Code
        </label>

        <div className="flex gap-2">

          <div className="relative flex-1">

            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20 12V6a2 2 0 0 0-2-2h-6L4 12l8 8 8-8Z"
                stroke="#5B4B75"
                strokeOpacity="0.45"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              <circle
                cx="15.5"
                cy="8.5"
                r="1"
                fill="#5B4B75"
                fillOpacity="0.45"
              />
            </svg>

            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E5E1F1] rounded-xl outline-none text-sm text-[#2E1A47] placeholder:text-[#5B4B75]/35 focus:border-[#8B5CF6]/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.07)] transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (!promoCode.trim()) {
                return toast.error("Enter a promo code");
              }

              toast("Promo codes are coming soon");
            }}
            className="px-4 py-2.5 rounded-xl bg-[#2E1A47] text-white text-sm font-semibold hover:bg-[#3C245B] active:scale-95 transition-all"
          >
            Apply
          </button>

        </div>
      </div>

      {/* ========================================
          PRICE BREAKDOWN
      ======================================== */}

      <div className="h-px bg-[#E8E4F5] my-6" />

      <div className="space-y-4">

        {/* Items */}

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-[#5B4B75]">
              Items
            </p>

            <p className="text-xs text-[#5B4B75]/40 mt-0.5">
              {getCartCount()} item{getCartCount() !== 1 ? "s" : ""}
            </p>
          </div>

          <p className="text-sm font-semibold text-[#2E1A47]">
            {currency}
            {cartAmount}
          </p>
        </div>

        {/* Shipping */}

        <div className="flex justify-between items-center">
          <p className="text-sm text-[#5B4B75]">
            Shipping Fee
          </p>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D6B]" />

            <p className="text-sm font-semibold text-[#2E7D6B]">
              Free
            </p>
          </div>
        </div>

        {/* Tax */}

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[#5B4B75]">
              Tax
            </p>

            <p className="text-[10px] text-[#5B4B75]/40 mt-0.5">
              2% applicable tax
            </p>
          </div>

          <p className="text-sm font-semibold text-[#2E1A47]">
            {currency}
            {tax}
          </p>
        </div>

      </div>

      {/* ========================================
          TOTAL
      ======================================== */}

      <div className="mt-5 pt-5 border-t border-[#E8E4F5]">

        <div className="flex items-end justify-between">

          <div>
            <p className="text-sm font-semibold text-[#2E1A47]">
              Total
            </p>

            <p className="text-xs text-[#5B4B75]/45 mt-1">
              Including taxes
            </p>
          </div>

          <p className="text-2xl font-bold text-[#2E1A47]">
            {currency}
            {total}
          </p>

        </div>

      </div>

      {/* ========================================
          PLACE ORDER
      ======================================== */}

      <button
        type="button"
        onClick={createOrder}
        disabled={getCartCount() === 0}
        className={`group relative w-full mt-6 py-3.5 rounded-2xl text-white font-semibold transition-all duration-200 overflow-hidden ${
          getCartCount() === 0
            ? "bg-gray-300 cursor-not-allowed shadow-none"
            : "bg-[#8B5CF6] shadow-[0_8px_20px_rgba(139,92,246,0.22)] hover:bg-[#7C4DE8] hover:shadow-[0_10px_25px_rgba(139,92,246,0.3)] active:scale-[0.98]"
        }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Place Order

          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            className={
              getCartCount() > 0
                ? "group-hover:translate-x-1 transition-transform duration-200"
                : ""
            }
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Security note */}

      <div className="flex items-center justify-center gap-1.5 mt-4">

        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect
            x="5"
            y="10"
            width="14"
            height="10"
            rx="2"
            stroke="#5B4B75"
            strokeOpacity="0.4"
            strokeWidth="1.7"
          />

          <path
            d="M8 10V7a4 4 0 0 1 8 0v3"
            stroke="#5B4B75"
            strokeOpacity="0.4"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>

        <p className="text-[10px] text-[#5B4B75]/45">
          Your order information is securely processed
        </p>

      </div>

    </div>
  );
};

export default OrderSummary;