"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import sgnLogo from "@/assets/SNG-logo2.png";

const GOOGLE_URL = "https://share.google/Rwj7bhAEXCwLJcVpu";

// Replace these placeholder URLs with your actual social profiles.
const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M13.4 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.2c-.8-.1-1.6-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.2v3.2H10V21h3.4Z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/919704022443",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.2 11.8a8.2 8.2 0 0 1-12.1 7.1L4 20l1.2-4a8.2 8.2 0 1 1 15-4.2Z" />
        <path d="M9 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .3.1.4.4l.7 1.7c.1.3 0 .5-.2.7l-.5.6c-.2.2-.2.4 0 .7.6 1 1.5 1.9 2.5 2.4.3.2.5.2.7-.1l.8-.9c.2-.2.4-.2.7-.1l1.7.8c.3.1.4.3.4.5 0 .3-.2 1.1-.8 1.5-.6.5-1.4.7-2.3.5-1-.2-2.2-.7-3.7-2-1.8-1.6-2.7-3.4-2.8-4.4-.1-.8.2-1.5.6-1.9Z" />
      </svg>
    ),
  },
  {
    name: "Google",
    href: GOOGLE_URL,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v3.9h5.4a4.7 4.7 0 0 1-2 3.1v2.5h3.2c1.9-1.8 3-4.3 3-7.4Z"
          fill="#4285F4"
        />
        <path
          d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"
          fill="#34A853"
        />
        <path
          d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z"
          fill="#FBBC05"
        />
        <path
          d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 2.9 14.7 2 12 2a10 10 0 0 0-8.9 5.5l3.3 2.6C7.2 7.7 9.4 6 12 6Z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
];

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Shop all costumes", href: "/all-products" },
  { label: "Contact us", href: "/contact" },
  { label: "Privacy policy", href: "/privacy" },
];

const ArrowUpRight = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M5 15 15 5M6 5h9v9" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-[#EAE7E1] bg-[#FCFBF8] text-[#242321]">

      {/* Subtle decorative background */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[min(90%,800px)] -translate-x-1/2 rounded-full bg-[#F5E9D4]/50 blur-[100px]"
        aria-hidden="true"
      />

      {/* Brand introduction */}
      <section className="relative px-5 pb-12 pt-16 sm:px-8 sm:pb-16 sm:pt-20 lg:px-16 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#C49A53]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#96713A] sm:text-xs">
              SNG Costume World
            </span>
            <span className="h-px w-8 bg-[#C49A53]" />
          </div>

          <h2 className="mx-auto max-w-3xl text-3xl font-medium leading-tight tracking-[-0.045em] text-[#242321] sm:text-4xl md:text-5xl">
            Every costume tells
            <span className="font-serif italic text-[#A47B3F]">
              {" "}a story.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#73716B] sm:text-base sm:leading-8">
            From little dreamers to big adventures, we bring
            imagination to life with costumes that inspire
            creativity, celebrate individuality, and make
            every special moment unforgettable.
          </p>

          <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#99948A] sm:text-xs">
            Made for little dreams. Designed for big adventures.
          </p>

          {/* Social media links */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit us on ${social.name}`}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-[#E6E0D6] bg-white text-[#555149] transition-all duration-300 hover:-translate-y-1 hover:border-[#B9975B] hover:bg-[#B9975B] hover:text-white hover:shadow-md sm:h-12 sm:w-12"
              >
                <span className="h-[19px] w-[19px] transition-transform duration-300 group-hover:scale-110">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Elegant divider */}
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-16">
        <div className="h-px bg-gradient-to-r from-transparent via-[#E5DED2] to-transparent" />
      </div>

      {/* Main footer */}
      <section className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 sm:py-14 md:gap-12 lg:grid-cols-12 lg:gap-10 lg:px-16 lg:py-16">

        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-5">
          <Link
            href="/"
            aria-label="Sunshine Fancy Costumes homepage"
            className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9975B]"
          >
            <Image
              src={sgnLogo}
              alt="SGN Costume World"
              width={220}
              height={90}
              className="h-auto w-56 object-contain object-left sm:w-64 lg:w-72"
            />
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-7 text-[#73716B]">
            Discover costumes for every character, celebration,
            and unforgettable occasion. Helping families turn
            imaginative ideas into extraordinary memories.
          </p>

          <a
            href={GOOGLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#88652F] transition-colors hover:text-[#5F451F]"
          >
            Discover our store
            <ArrowUpRight />
          </a>
        </div>

        {/* Navigation column */}
        <div className="lg:col-span-3">
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#242321]">
            Explore
          </h3>

          <nav aria-label="Footer navigation">
            <ul className="space-y-4">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#73716B] transition-colors duration-200 hover:text-[#88652F]"
                  >
                    <span>{item.label}</span>
                    <span className="opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                      <ArrowUpRight />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Contact column */}
        <div className="lg:col-span-4">
          <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#242321]">
            Get in touch
          </h3>

          <div className="space-y-5">

            {/* Phone */}
            <a
              href="tel:+919704022443"
              className="group flex items-start gap-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8E1D6] bg-white text-[#88652F] transition-colors group-hover:border-[#B9975B]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                >
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 8.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1Z" />
                </svg>
              </span>

              <span className="pt-0.5">
                <span className="block text-xs text-[#99948A]">
                  Call us
                </span>
                <span className="mt-1 block text-sm font-medium text-[#393730] transition-colors group-hover:text-[#88652F]">
                  +91 97040 22443
                </span>
              </span>
            </a>

            {/* Location */}
            <a
              href={GOOGLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8E1D6] bg-white text-[#88652F] transition-colors group-hover:border-[#B9975B]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>

              <span className="pt-0.5">
                <span className="block text-xs text-[#99948A]">
                  Find our store
                </span>
                <span className="mt-1 block text-sm font-medium text-[#393730] transition-colors group-hover:text-[#88652F]">
                  Hyderabad, India
                </span>
                <span className="mt-1 block text-xs text-[#99948A]">
                  View location on Google
                </span>
              </span>
            </a>

            {/* WhatsApp contact */}
            <a
              href="https://wa.me/919704022443"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#D9C8A8] px-4 py-2.5 text-xs font-semibold text-[#88652F] transition-all duration-200 hover:border-[#88652F] hover:bg-[#88652F] hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M20.2 11.8a8.2 8.2 0 0 1-12.1 7.1L4 20l1.2-4a8.2 8.2 0 1 1 15-4.2Z" />
                <path d="M9 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .3.1.4.4l.7 1.7c.1.3 0 .5-.2.7l-.5.6c-.2.2-.2.4 0 .7.6 1 1.5 1.9 2.5 2.4.3.2.5.2.7-.1l.8-.9c.2-.2.4-.2.7-.1l1.7.8c.3.1.4.3.4.5 0 .3-.2 1.1-.8 1.5-.6.5-1.4.7-2.3.5-1-.2-2.2-.7-3.7-2-1.8-1.6-2.7-3.4-2.8-4.4-.1-.8.2-1.5.6-1.9Z" />
              </svg>
              Chat with us
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <div className="relative border-t border-[#EAE5DC]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-5 py-5 text-center sm:px-8 md:flex-row md:text-left lg:px-16">

          <p className="text-xs leading-5 text-[#89857D]">
            © {new Date().getFullYear()} Sunshine Fancy Costumes.
            All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-[#89857D]">
            Made with
            <span className="text-[#B78C4A]" aria-label="love">
              ♥
            </span>
            for little dreamers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;