"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-white">

      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div
        className="
          absolute
          inset-0
          -z-10
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -top-48
            left-1/2
            -translate-x-1/2
            w-[750px]
            h-[500px]
            rounded-full
            bg-gradient-to-br
            from-yellow-200
            via-pink-200
            to-purple-300
            blur-[120px]
            opacity-40
          "
        />
      </div>

      {/* =================================================
          FOUNDER SPOTLIGHT
      ================================================= */}

      <section className="px-6 md:px-16 lg:px-32 pt-20">

        <div
          className="
            max-w-5xl
            mx-auto
            flex
            flex-col
            md:flex-row
            items-center
            gap-10
            p-8
            md:p-12
            rounded-[36px]
            bg-white/70
            backdrop-blur-xl
            border
            border-black/[0.06]
            shadow-[0_30px_80px_rgba(0,0,0,0.08)]
          "
        >

          {/* OWNER IMAGE */}

          <div
            className="
              relative
              w-40
              h-40
              md:w-44
              md:h-44
              shrink-0
            "
          >

            <div
              className="
                absolute
                -inset-3
                rounded-full
                bg-gradient-to-br
                from-yellow-300
                via-red-300
                to-blue-300
                blur-md
                opacity-60
              "
            />

            <div
              className="
                relative
                w-full
                h-full
                overflow-hidden
                rounded-full
                border-[5px]
                border-white
                shadow-xl
              "
            >
              <Image
                src={assets.owner}
                alt="Founder"
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>

          </div>

          {/* OWNER CONTENT */}

          <div className="text-center md:text-left">

            <p
              className="
                text-xs
                uppercase
                tracking-[0.25em]
                font-semibold
                text-purple-500
              "
            >
              Founder & Creator
            </p>

            <h2
              className="
                mt-2
                text-4xl
                md:text-5xl
                font-semibold
                tracking-tight
                text-[#1D1D1F]
              "
            >
              Nagesh Shinde
            </h2>

            {/* LEGO COLOR STRIP */}

            <div
              className="
                flex
                justify-center
                md:justify-start
                gap-2
                mt-5
              "
            >
              <span className="w-10 h-2 rounded-full bg-yellow-400" />
              <span className="w-10 h-2 rounded-full bg-red-500" />
              <span className="w-10 h-2 rounded-full bg-blue-500" />
            </div>

            <p
              className="
                mt-5
                max-w-lg
                text-sm
                leading-relaxed
                text-[#6E6E73]
              "
            >
              Creating costumes that help every child become
              their favorite character — one adventure,
              one celebration, and one memory at a time.
            </p>

            {/* =================================================
                SOCIAL LINKS
            ================================================= */}

            <div
              className="
                flex
                justify-center
                md:justify-start
                gap-3
                mt-7
              "
            >

              {/* INSTAGRAM */}

              <a
                href="#"
                aria-label="Instagram"
                className="
                  group
                  w-11
                  h-11
                  rounded-xl
                  bg-gradient-to-br
                  from-yellow-400
                  via-pink-500
                  to-purple-600
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  hover:-translate-y-1
                  hover:shadow-lg
                  transition-all
                  duration-300
                "
              >
                <Image
                  src={assets.instagram_icon}
                  alt="Instagram"
                  className="
                    w-5
                    h-5
                    brightness-0
                    invert
                    group-hover:scale-110
                    transition-transform
                  "
                />
              </a>

              {/* FACEBOOK */}

              <a
                href="#"
                aria-label="Facebook"
                className="
                  group
                  w-11
                  h-11
                  rounded-xl
                  bg-blue-500
                  flex
                  items-center
                  justify-center
                  hover:-translate-y-1
                  hover:shadow-lg
                  transition-all
                  duration-300
                "
              >
                <Image
                  src={assets.facebook_icon}
                  alt="Facebook"
                  className="
                    w-5
                    h-5
                    brightness-0
                    invert
                    group-hover:scale-110
                    transition-transform
                  "
                />
              </a>

              {/* GOOGLE LINK */}

              <a
                href="https://share.google/Rwj7bhAEXCwLJcVpu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google"
                className="
                  group
                  w-11
                  h-11
                  rounded-xl
                  bg-white
                  border
                  border-black/10
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  hover:-translate-y-1
                  hover:shadow-lg
                  transition-all
                  duration-300
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  className="
                    w-5
                    h-5
                    group-hover:scale-110
                    transition-transform
                  "
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.27c0-.68-.06-1.34-.17-1.97H12v3.73h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.15Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 21.8c2.63 0 4.84-.87 6.45-2.38l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.8Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.54 13.87A5.86 5.86 0 0 1 6.23 12c0-.65.11-1.28.31-1.87V7.6H3.3A9.77 9.77 0 0 0 2.25 12c0 1.58.38 3.08 1.05 4.4l3.24-2.53Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 6.1c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.16 14.63 2.2 12 2.2a9.74 9.74 0 0 0-8.7 5.4l3.24 2.53C7.31 7.82 9.46 6.1 12 6.1Z"
                  />
                </svg>
              </a>

              {/* WHATSAPP */}

              <a
                href="#"
                aria-label="Whatsapp"
                className="
                  group
                  w-11
                  h-11
                  rounded-xl
                  bg-green-500
                  flex
                  items-center
                  justify-center
                  hover:-translate-y-1
                  hover:shadow-lg
                  transition-all
                  duration-300
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="
                    w-5
                    h-5
                    text-white
                    group-hover:scale-110
                    transition-transform
                  "
                >
                  <path
                    d="
                    M20.52 3.48A11.8 11.8 0 0 0 12.05 0
                    C5.5 0 .17 5.33.17 11.88
                    c0 2.09.55 4.13 1.6 5.93L0 24l6.36-1.67
                    a11.86 11.86 0 0 0 5.69 1.45h.01
                    c6.55 0 11.88-5.33 11.88-11.88
                    0-3.17-1.23-6.15-3.42-8.42Z
                    "
                  />
                </svg>
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN FOOTER GRID
      ================================================= */}

      <section
        className="
          max-w-[1400px]
          mx-auto
          px-6
          md:px-16
          lg:px-32
          py-20
          grid
          grid-cols-1
          md:grid-cols-3
          gap-14
        "
      >

        {/* BRAND */}

        <div>

          <Image
            src={assets.logo}
            alt="logo"
            className="w-52 h-auto"
          />

          <p
            className="
              mt-6
              max-w-sm
              text-sm
              leading-relaxed
              text-[#6E6E73]
            "
          >
            Costumes designed for imagination,
            creativity and unforgettable moments.
            From school plays to birthday adventures,
            we help every child become their favorite
            character.
          </p>

          <div
            className="
              flex
              gap-2
              mt-8
            "
          >
            <span className="w-9 h-9 rounded-xl bg-yellow-400 shadow-sm" />
            <span className="w-9 h-9 rounded-xl bg-red-500 shadow-sm" />
            <span className="w-9 h-9 rounded-xl bg-blue-500 shadow-sm" />
            <span className="w-9 h-9 rounded-xl bg-green-500 shadow-sm" />
          </div>

        </div>

        {/* EXPLORE */}

        <div>

          <h3
            className="
              text-base
              font-semibold
              text-[#1D1D1F]
              mb-6
            "
          >
            Explore
          </h3>

          <div
            className="
              space-y-4
              text-sm
              text-[#6E6E73]
            "
          >

            <Link
              href="/"
              className="block hover:text-black transition"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="block hover:text-black transition"
            >
              About Us
            </Link>

            <Link
              href="/all-products"
              className="block hover:text-black transition"
            >
              Shop
            </Link>

            <Link
              href="/contact"
              className="block hover:text-black transition"
            >
              Contact
            </Link>

            <Link
              href="/privacy"
              className="block hover:text-black transition"
            >
              Privacy Policy
            </Link>

          </div>

        </div>

        {/* CONTACT */}

        <div>

          <h3
            className="
              text-base
              font-semibold
              text-[#1D1D1F]
              mb-6
            "
          >
            Get in touch
          </h3>

          <div
            className="
              space-y-4
              text-sm
              text-[#6E6E73]
            "
          >

            <a
              href="tel:+919704022443"
              className="block hover:text-black transition"
            >
              +91-9704022443
            </a>

            <a
              href="mailto:contact@yourstore.com"
              className="block hover:text-black transition"
            >
              contact@yourstore.com
            </a>

            <p>
              Hyderabad, India
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          COPYRIGHT
      ================================================= */}

      <div
        className="
          border-t
          border-black/[0.06]
          py-6
          text-center
          text-xs
          text-[#86868B]
        "
      >
        © 2026 Sunshine Fancy Costumes.
        Crafted with imagination ❤️
      </div>

    </footer>
  );
};

export default Footer;
