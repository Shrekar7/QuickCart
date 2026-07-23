"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { assets, BagIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";


// Small circular icon button — same treatment as the social links in the
// Footer, so hover states feel consistent across the whole site.
const IconButton = ({ onClick, children, label }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F5B700]/10 transition-colors duration-300"
  >
    {children}
  </button>
);

const categories = [
  { href: "/category/doctor", label: "Doctor" },
  { href: "/category/superhero", label: "Superhero" },
  { href: "/category/service", label: "Service" },
];

const Navbar = () => {
  const { isSeller, router } = useAppContext();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-4 border-b border-[#2E1A47]/8 bg-white text-[#2E1A47]">
      {/* Logo */}
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

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link href="/" className="relative py-1 hover:text-[#8B5CF6] transition-colors">
          Home
        </Link>

        {/* Categories */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 py-1 hover:text-[#8B5CF6] transition-colors">
            Categories
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform duration-300 group-hover:rotate-180"
            >
              <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute left-0 top-full pt-3 hidden group-hover:block z-50">
            <div className="w-56 rounded-xl border border-[#EDEBFB] bg-white shadow-xl overflow-hidden py-1.5">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2E1A47]/80 hover:bg-[#FAF9FF] hover:text-[#2E1A47] transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Link href="/all-products" className="py-1 hover:text-[#8B5CF6] transition-colors">
          Shop
        </Link>
        <Link href="/about" className="py-1 hover:text-[#8B5CF6] transition-colors">
          About Us
        </Link>
        <Link href="/contact" className="py-1 hover:text-[#8B5CF6] transition-colors">
          Contact
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="border border-[#2E1A47]/15 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-[#F5B700] hover:bg-[#F5B700]/10 transition-colors"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-1.5">
        <IconButton label="Search">
          <Image src={assets.search_icon} alt="" width={17} height={17} />
        </IconButton>

        <IconButton onClick={() => router.push("/cart")} label="Cart">
          <Image src={assets.cart_icon} alt="" width={17} height={17} />
        </IconButton>

        <IconButton onClick={() => router.push("/myorders")} label="My orders">
          <BagIcon />
        </IconButton>

        {isSignedIn ? (
          <div className="ml-1.5">
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <button
            onClick={() => openSignIn()}
            className="flex items-center gap-2 ml-1.5 pl-3 pr-4 py-1.5 rounded-full hover:bg-[#FAF9FF] transition-colors"
          >
            <Image src={assets.user_icon} alt="" width={20} height={20} />
            <span className="text-sm font-medium">Account</span>
          </button>
        )}
      </div>

      {/* Mobile Right */}
      <div className="flex md:hidden items-center gap-0.5">
        <IconButton label="Search">
          <Image src={assets.search_icon} alt="" width={17} height={17} />
        </IconButton>

        <IconButton onClick={() => router.push("/cart")} label="Cart">
          <Image src={assets.cart_icon} alt="" width={20} height={20} />
        </IconButton>

        <IconButton onClick={() => router.push("/myorders")} label="My orders">
          <BagIcon />
        </IconButton>

        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <IconButton onClick={() => openSignIn()} label="Sign in">
            <Image src={assets.user_icon} alt="" width={20} height={20} />
          </IconButton>
        )}
      </div>
    </nav>
  );
};

export default Navbar;