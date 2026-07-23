import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* ambient gradient background shape */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[8deg] bg-gradient-to-tr from-[#F5B700] to-[#8B5CF6] opacity-20 sm:w-[60rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* owner spotlight */}
      <div className="px-6 md:px-16 lg:px-32 pt-14">
        <div className="flex flex-col sm:flex-row items-center gap-8 bg-[#FAF9FF] border border-[#EDEBFB] rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto text-center sm:text-left">
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 shrink-0">
            {/* soft outer halo */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#F5B700]/20 to-[#8B5CF6]/20" />
            {/* photo */}
            <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-white shadow-xl">
              <Image
                src={assets.owner} // TODO: swap for real owner photo
                alt="Owner"
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
            {/* thin gold accent ring */}
            <div className="absolute inset-0 rounded-full ring-1 ring-[#F5B700]/50" />
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B5CF6]">
              Founder & Owner
            </p>
            <p className="font-serif text-3xl text-[#2E1A47] mt-1.5">
              Nagesh Shinde
            </p>
            <div className="w-8 h-px bg-[#F5B700] my-3" />
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              "Every costume we make is built to survive one more party, one more play date, one more encore."
              {/* TODO: replace with a real quote or short bio */}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="opacity-60 hover:opacity-100 transition">
                <Image className="w-4 h-4" src={assets.instagram_icon} alt="Instagram" />
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 transition">
                <Image className="w-4 h-4" src={assets.facebook_icon} alt="Facebook" />
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 transition">
                <Image className="w-4 h-4" src={assets.twitter_icon} alt="Twitter" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-72 md:w-84" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            Costumes and dress-up outfits for every character your kid wants to become —
            built for parties, festivals, school plays, and everything in between.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Contact us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+1-234-567-890</p>
              <p>contact@yourstore.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2026 © Sunshine fancy costumes. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;