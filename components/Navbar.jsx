"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { assets, BagIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const Navbar = () => {
  const { isSeller, router } = useAppContext();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 bg-white text-gray-700">

      {/* Logo */}
      <Link href="/">
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
      <div className="hidden md:flex items-center gap-6">

        <Link href="/" className="hover:text-black transition">
          Home
        </Link>

        {/* Categories */}
        <div className="relative group">

          <button className="flex items-center gap-1 hover:text-black transition">
            Categories

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
            <div className="w-52 rounded-lg border bg-white shadow-lg">

              <Link
                href="/category/doctor"
                className="block px-4 py-3 hover:bg-gray-100"
              >
                👨‍⚕️ Doctor
              </Link>

              <Link
                href="/category/superhero"
                className="block px-4 py-3 hover:bg-gray-100"
              >
                🦸 Superhero
              </Link>

              <Link
                href="/category/service"
                className="block px-4 py-3 hover:bg-gray-100"
              >
                👔 Service
              </Link>

            </div>
          </div>
        </div>

        <Link href="/all-products" className="hover:text-black transition">
          Shop
        </Link>

        <Link href="/about" className="hover:text-black transition">
          About Us
        </Link>

        <Link href="/contact" className="hover:text-black transition">
          Contact
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="border rounded-full px-4 py-2 text-sm hover:bg-gray-100 transition"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-5">

        {/* Search */}
        <button>
          <Image
            src={assets.search_icon}
            alt="Search"
            width={18}
            height={18}
          />
        </button>

        {/* Cart */}
        <button onClick={() => router.push("/cart")}>
          <Image
            src={assets.cart_icon}
            alt="Cart"
            width={18}
            height={18}
          />
        </button>

        {/* My Orders */}
        <button onClick={() => router.push("/myorders")}>
          <BagIcon />
        </button>

        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="flex items-center gap-2"
          >
            <Image
              src={assets.user_icon}
              alt="User"
              width={22}
              height={22}
            />
            <span>Account</span>
          </button>
        )}
      </div>

      {/* Mobile Right */}
      <div className="flex md:hidden items-center gap-4">

        {/* Search */}
        <button>
          <Image
            src={assets.search_icon}
            alt="Search"
            width={18}
            height={18}
          />
        </button>

        {/* Cart */}
        <button onClick={() => router.push("/cart")}>
          <Image
            src={assets.cart_icon}
            alt="Cart"
            width={22}
            height={22}
          />
        </button>

        {/* My Orders */}
        <button onClick={() => router.push("/myorders")}>
          <BagIcon />
        </button>

        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <button onClick={() => openSignIn()}>
            <Image
              src={assets.user_icon}
              alt="User"
              width={22}
              height={22}
            />
          </button>
        )}
      </div>

    </nav>
  );
};

export default Navbar;