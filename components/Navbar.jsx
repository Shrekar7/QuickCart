"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { assets, BagIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { categories } from "@/lib/categories";

// ======================================================
// ICON BUTTON
// ======================================================

const IconButton = ({ onClick, children, label, badge }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="
      relative
      w-9 h-9
      rounded-full
      flex items-center justify-center
      text-[#3A3028]
      hover:bg-[#F7F3EC]
      transition-all duration-200
      shrink-0
    "
  >
    {children}

    {badge > 0 && (
      <span
        className="
          absolute -top-0.5 -right-0.5
          min-w-[17px] h-[17px]
          px-1
          rounded-full
          bg-[#D96B7A]
          text-white
          text-[9px]
          font-bold
          flex items-center justify-center
          border-2 border-white
        "
      >
        {badge > 99 ? "99+" : badge}
      </span>
    )}
  </button>
);

// ======================================================
// NAV LINK
// ======================================================

const NavLink = ({ href, children }) => (
  <Link
    href={href}
    className="
      relative
      py-2
      text-[13px]
      font-medium
      text-[#4B4038]
      hover:text-[#17130F]
      transition-colors
      group/link
    "
  >
    {children}

    <span
      className="
        absolute
        left-1/2
        -bottom-0.5
        h-[2px]
        w-0
        -translate-x-1/2
        rounded-full
        bg-[#C9973E]
        transition-all duration-300
        group-hover/link:w-4/5
      "
    />
  </Link>
);

// ======================================================
// SEARCH BAR
// ======================================================

const SearchBar = ({ className = "" }) => {
  const router = useAppContext().router;

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);

  // ------------------------------------------------------
  // FETCH PRODUCTS
  // ------------------------------------------------------

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get("/api/product/list");

        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Search products error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ------------------------------------------------------
  // CLOSE SEARCH
  // ------------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ------------------------------------------------------
  // FILTER PRODUCTS
  // ------------------------------------------------------

  useEffect(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filteredProducts = products
      .filter((product) =>
        product.name?.toLowerCase().includes(trimmedQuery)
      )
      .slice(0, 6);

    setSuggestions(filteredProducts);
    setShowSuggestions(true);
  }, [query, products]);

  // ------------------------------------------------------
  // KEYBOARD
  // ------------------------------------------------------

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) return;

      setShowSuggestions(false);

      router.push(
        `/all-products?search=${encodeURIComponent(
          trimmedQuery
        )}`
      );
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // ------------------------------------------------------
  // PRODUCT CLICK
  // ------------------------------------------------------

  const handleProductClick = (productId) => {
    setQuery("");
    setShowSuggestions(false);

    router.push(`/product/${productId}`);
  };

  return (
    <div
      ref={searchRef}
      className={`relative group/search ${className}`}
    >
      {/* SEARCH ICON */}

      <svg
        className="
          absolute
          left-3.5
          top-1/2
          -translate-y-1/2
          pointer-events-none
          z-10
        "
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="11"
          cy="11"
          r="7"
          stroke="#756B61"
          strokeWidth="1.8"
        />

        <path
          d="M21 21l-3.5-3.5"
          stroke="#756B61"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      {/* INPUT */}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (query.trim()) {
            setShowSuggestions(true);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search costumes..."
        autoComplete="off"
        className="
          w-full
          pl-10
          pr-4
          py-2.5
          rounded-full
          bg-[#F8F6F2]
          border border-transparent
          outline-none
          text-[13px]
          text-[#29231E]
          placeholder:text-[#8C8379]
          transition-all duration-300
          focus:bg-white
          focus:border-[#D8C7A8]
          focus:shadow-[0_4px_18px_rgba(80,60,30,0.06)]
        "
      />

      {/* ==================================================
          SUGGESTIONS
      ================================================== */}

      {showSuggestions && query.trim() && (
        <div
          className="
            absolute
            top-[calc(100%+9px)]
            left-0
            w-full
            min-w-[290px]
            md:min-w-[350px]
            bg-white
            border border-[#EAE5DC]
            rounded-2xl
            shadow-[0_18px_50px_rgba(50,40,25,0.12)]
            overflow-hidden
            z-[100]
          "
        >
          {/* LOADING */}

          {loading && (
            <div className="px-4 py-5 text-sm text-[#756B61] text-center">
              Searching...
            </div>
          )}

          {/* RESULTS */}

          {!loading && suggestions.length > 0 && (
            <div className="py-2">
              <div
                className="
                  px-4
                  py-2
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  font-semibold
                  text-[#9A9187]
                "
              >
                Products
              </div>

              {suggestions.map((product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() =>
                    handleProductClick(product._id)
                  }
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    hover:bg-[#FAF8F4]
                    transition-colors
                    group
                  "
                >
                  {/* IMAGE */}

                  <div
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-[#F8F6F2]
                      border border-[#EEE9E0]
                      flex items-center justify-center
                      overflow-hidden
                      shrink-0
                    "
                  >
                    {product.image?.[0] ? (
                      <Image
                        src={product.image[0]}
                        alt={product.name}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-[#9A9187]">
                        IMG
                      </span>
                    )}
                  </div>

                  {/* INFO */}

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        text-[13px]
                        font-medium
                        text-[#302921]
                        truncate
                        group-hover:text-[#B27B27]
                        transition-colors
                      "
                    >
                      {product.name}
                    </p>

                    <p className="text-[11px] text-[#958B80] mt-0.5">
                      {product.category}
                    </p>
                  </div>

                  {/* ARROW */}

                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="
                      shrink-0
                      text-[#A49B91]
                      opacity-40
                      group-hover:opacity-100
                      group-hover:translate-x-0.5
                      transition-all
                    "
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}

              {/* ALL RESULTS */}

              <div className="border-t border-[#EEE9E0] mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);

                    router.push(
                      `/all-products?search=${encodeURIComponent(
                        query.trim()
                      )}`
                    );
                  }}
                  className="
                    w-full
                    px-4
                    py-3
                    text-[12px]
                    font-medium
                    text-[#B27B27]
                    text-center
                    hover:bg-[#FAF8F4]
                    transition-colors
                  "
                >
                  View all results for "{query}"
                </button>
              </div>
            </div>
          )}

          {/* NO RESULTS */}

          {!loading && suggestions.length === 0 && (
            <div className="px-5 py-7 text-center">
              <div
                className="
                  w-10
                  h-10
                  mx-auto
                  mb-3
                  rounded-full
                  bg-[#F8F6F2]
                  flex
                  items-center
                  justify-center
                "
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="#958B80"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M21 21l-3.5-3.5"
                    stroke="#958B80"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <p className="text-[13px] font-medium text-[#302921]">
                No products found
              </p>

              <p className="text-[11px] text-[#958B80] mt-1">
                Try searching for something else
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ======================================================
// NAVBAR
// ======================================================

const Navbar = () => {
  const { isSeller, router, getCartCount } =
    useAppContext();

  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  const cartCount = getCartCount();

  return (
    <nav
      className="
        sticky
        top-0
        z-40
        w-full
        bg-[#FFFDF9]/95
        backdrop-blur-xl
        border-b border-[#EAE4DA]
      "
    >
      {/* =================================================
          MAIN NAV
      ================================================= */}

      <div
        className="
          max-w-[1500px]
          mx-auto
          flex
          items-center
          justify-between
          px-5
          sm:px-8
          lg:px-12
          xl:px-16
          py-3
          gap-5
        "
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          href="/"
          className="
            shrink-0
            flex
            items-center
            transition-transform
            duration-200
            hover:scale-[1.02]
          "
        >
          <Image
            src={assets.logo}
            alt="Logo"
            width={140}
            height={40}
            priority
            className="
              w-[105px]
              sm:w-[115px]
              md:w-[125px]
              h-auto
            "
          />
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <div
          className="
            hidden
            lg:flex
            items-center
            gap-7
            xl:gap-8
            text-sm
          "
        >
          <NavLink href="/">Home</NavLink>

          {/* CATEGORIES */}

          <div className="relative group">
            <button
              className="
                flex
                items-center
                gap-1.5
                py-2
                text-[13px]
                font-medium
                text-[#4B4038]
                hover:text-[#17130F]
                transition-colors
              "
            >
              Categories

              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                className="
                  opacity-60
                  transition-transform
                  duration-300
                  group-hover:rotate-180
                "
              >
                <path
                  d="M19 9l-7 7-7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* DROPDOWN */}

            <div
              className="
                absolute
                left-1/2
                -translate-x-1/2
                top-full
                pt-3
                hidden
                group-hover:block
                z-50
              "
            >
              <div
                className="
                  w-64
                  rounded-2xl
                  border border-[#EAE4DA]
                  bg-white
                  shadow-[0_20px_55px_rgba(50,40,25,0.13)]
                  overflow-hidden
                  p-2
                "
              >
                <div
                  className="
                    px-3
                    py-2
                    text-[10px]
                    uppercase
                    tracking-[0.18em]
                    font-semibold
                    text-[#A09588]
                  "
                >
                  Shop by category
                </div>

                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-[13px]
                      text-[#51463C]
                      hover:bg-[#FAF7F1]
                      hover:text-[#A97124]
                      transition-all
                    "
                  >
                    <span
                      className="
                        w-1.5
                        h-1.5
                        rounded-full
                        bg-[#C9973E]
                        shrink-0
                      "
                    />

                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <NavLink href="/all-products">
            Shop
          </NavLink>

          <NavLink href="/about">
            About Us
          </NavLink>

          <NavLink href="/contact">
            Contact
          </NavLink>

          {/* SELLER */}

          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="
                ml-1
                px-3.5
                py-1.5
                rounded-full
                border border-[#D8C7A8]
                text-[10px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-[#76582E]
                hover:bg-[#F8F2E8]
                transition-colors
                whitespace-nowrap
              "
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div
          className="
            hidden
            md:flex
            items-center
            gap-1
          "
        >
          {/* SEARCH */}

          <SearchBar
            className="
              w-32
              xl:w-40
              focus-within:w-52
              xl:focus-within:w-60
              transition-all
              duration-300
            "
          />

          {/* DIVIDER */}

          <div className="w-px h-6 bg-[#E5DED3] mx-2" />

          {/* CART */}

          <IconButton
            onClick={() => router.push("/cart")}
            label="Cart"
            badge={cartCount}
          >
            <Image
              src={assets.cart_icon}
              alt=""
              width={17}
              height={17}
            />
          </IconButton>

          {/* ORDERS */}

          <IconButton
            onClick={() => router.push("/my-orders")}
            label="My orders"
          >
            <BagIcon />
          </IconButton>

          {/* ACCOUNT */}

          {isSignedIn ? (
            <div className="ml-1">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <button
              onClick={() => openSignIn()}
              className="
                ml-1
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-full
                text-[13px]
                font-medium
                text-[#40362F]
                hover:bg-[#F7F3EC]
                transition-colors
              "
            >
              <Image
                src={assets.user_icon}
                alt=""
                width={18}
                height={18}
              />

              <span className="hidden xl:block">
                Account
              </span>
            </button>
          )}
        </div>

        {/* =================================================
            MOBILE RIGHT SIDE
        ================================================= */}

        <div
          className="
            flex
            md:hidden
            items-center
            gap-0.5
            shrink-0
          "
        >
          {/* SELLER */}

          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              aria-label="Seller Dashboard"
              className="
                px-2.5
                py-1.5
                mr-0.5
                rounded-full
                border border-[#D8C7A8]
                text-[9px]
                font-bold
                uppercase
                tracking-wide
                text-[#76582E]
                hover:bg-[#F8F2E8]
                transition-colors
              "
            >
              Seller
            </button>
          )}

          {/* CART */}

          <IconButton
            onClick={() => router.push("/cart")}
            label="Cart"
            badge={cartCount}
          >
            <Image
              src={assets.cart_icon}
              alt=""
              width={19}
              height={19}
            />
          </IconButton>

          {/* ORDERS */}

          <IconButton
            onClick={() => router.push("/my-orders")}
            label="My orders"
          >
            <BagIcon />
          </IconButton>

          {/* ACCOUNT */}

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <IconButton
              onClick={() => openSignIn()}
              label="Sign in"
            >
              <Image
                src={assets.user_icon}
                alt=""
                width={19}
                height={19}
              />
            </IconButton>
          )}
        </div>
      </div>

      {/* =================================================
          MOBILE SEARCH
      ================================================= */}

      <div
        className="
          md:hidden
          px-5
          sm:px-8
          pb-3.5
        "
      >
        <SearchBar className="w-full" />
      </div>
    </nav>
  );
};

export default Navbar;