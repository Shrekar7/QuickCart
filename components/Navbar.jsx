"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { assets, BagIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { categories } from "@/lib/categories";

// Small circular icon button
const IconButton = ({ onClick, children, label, badge }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F5B700]/10 transition-colors duration-300 shrink-0"
  >
    {children}

    {badge > 0 && (
      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E8578E] text-white text-[10px] font-bold flex items-center justify-center">
        {badge > 99 ? "99+" : badge}
      </span>
    )}
  </button>
);

// Desktop nav link with an animated underline on hover
const NavLink = ({ href, children }) => (
  <Link
    href={href}
    className="relative py-1 text-[#2E1A47]/80 hover:text-[#2E1A47] transition-colors group/link"
  >
    {children}
    <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-[#8B5CF6] transition-all duration-300 group-hover/link:w-full" />
  </Link>
);

// Elongated search bar — pill-shaped, widens on focus (desktop only)
const SearchBar = ({ className = "" }) => (
  <div className={`relative group/search ${className}`}>
    <svg
      className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
      width="15" height="15" viewBox="0 0 24 24" fill="none"
    >
      <circle cx="11" cy="11" r="7" stroke="#5B4B75" strokeOpacity="0.5" strokeWidth="2" />
      <path d="M21 21l-3.5-3.5" stroke="#5B4B75" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <input
      type="text"
      placeholder="Search costumes..."
      className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FAF9FF] border border-transparent focus:border-[#8B5CF6]/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(139,92,246,0.08)] outline-none text-sm text-[#2E1A47] placeholder:text-[#5B4B75]/40 transition-all"
    />
  </div>
);

const Navbar = () => {
  const { isSeller, router, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  const cartCount = getCartCount();

  return (
    <nav className="sticky top-0 z-40 border-b border-[#2E1A47]/8 bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-4 gap-6">

        {/* =========================
            LOGO
        ========================== */}
        <Link href="/" className="shrink-0">
          <Image
            src={assets.logo}
            alt="Logo"
            width={140}
            height={40}
            priority
            className="cursor-pointer w-28 md:w-32 h-auto"
          />
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium">

          <NavLink href="/">Home</NavLink>

          {/* Categories */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 py-1 text-[#2E1A47]/80 hover:text-[#2E1A47] transition-colors">
              Categories

              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-300 group-hover:rotate-180 opacity-60"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Category Dropdown */}
            <div className="absolute left-0 top-full pt-3 hidden group-hover:block z-50">
              <div className="w-60 rounded-2xl border border-[#EDEBFB] bg-white shadow-2xl overflow-hidden py-2">

                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2E1A47]/75 hover:bg-[#FAF9FF] hover:text-[#2E1A47] hover:pl-5 transition-all duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
                    {cat.label}
                  </Link>
                ))}

              </div>
            </div>
          </div>

          <NavLink href="/all-products">Shop</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/contact">Contact</NavLink>

          {/* Seller Dashboard - Desktop */}
          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="border border-[#2E1A47]/15 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-[#F5B700] hover:bg-[#F5B700]/10 transition-colors whitespace-nowrap"
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {/* =========================
            DESKTOP RIGHT SIDE
        ========================== */}
        <div className="hidden md:flex items-center gap-1 bg-[#FAF9FF]/60 rounded-full pl-3 pr-1.5 py-1.5">

          <SearchBar className="w-36 focus-within:w-64 transition-all duration-300" />

          <div className="w-px h-5 bg-[#2E1A47]/10 mx-1.5" />

          {/* Cart */}
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

          {/* My Orders */}
          <IconButton
            onClick={() => router.push("/myorders")}
            label="My orders"
          >
            <BagIcon />
          </IconButton>

          {/* Account */}
          {isSignedIn ? (
            <div className="ml-1 mr-0.5">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <button
              onClick={() => openSignIn()}
              className="flex items-center gap-2 ml-1 pl-3 pr-4 py-1.5 rounded-full hover:bg-white transition-colors"
            >
              <Image
                src={assets.user_icon}
                alt=""
                width={20}
                height={20}
              />

              <span className="text-sm font-medium whitespace-nowrap">
                Account
              </span>
            </button>
          )}
        </div>

        {/* =========================
            MOBILE RIGHT SIDE
        ========================== */}
        <div className="flex md:hidden items-center gap-0.5 shrink-0">

          {/* Seller Dashboard - Mobile */}
          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              aria-label="Seller Dashboard"
              className="shrink-0 whitespace-nowrap px-2.5 py-1.5 mr-0.5 rounded-full border border-[#2E1A47]/15 text-[10px] font-bold uppercase tracking-wide text-[#2E1A47] hover:border-[#F5B700] hover:bg-[#F5B700]/10 transition-colors"
            >
              Seller
            </button>
          )}

          {/* Cart */}
          <IconButton
            onClick={() => router.push("/cart")}
            label="Cart"
            badge={cartCount}
          >
            <Image
              src={assets.cart_icon}
              alt=""
              width={20}
              height={20}
            />
          </IconButton>

          {/* My Orders */}
          <IconButton
            onClick={() => router.push("/myorders")}
            label="My orders"
          >
            <BagIcon />
          </IconButton>

          {/* Account */}
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
                width={20}
                height={20}
              />
            </IconButton>
          )}

        </div>
      </div>

      {/* Mobile search row — always visible below the main nav row */}
      <div className="md:hidden px-6 pb-4 -mt-1">
        <SearchBar className="w-full" />
      </div>
    </nav>
  );
};

export default Navbar;