"use client";

import React, { useState } from "react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setStatus("error");
      return;
    }
    // hook up to your actual subscribe endpoint here
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="relative w-full py-16 md:py-20 px-4">
      {/* Backdrop panel, consistent with HomeProducts' ambient style */}
      <div className="absolute inset-0 -z-10 mx-4 rounded-[2.5rem] bg-[#FAF9FF] overflow-hidden">
        <div
          className="absolute -top-20 left-1/4 w-72 h-72 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #F5B700 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
        />
      </div>

      <div className="flex flex-col items-center text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] uppercase text-[#8B5CF6] mb-4">
          <span className="w-6 h-px bg-[#8B5CF6]" />
          Stay in the loop
          <span className="w-6 h-px bg-[#8B5CF6]" />
        </span>

        <h2 className="text-3xl md:text-4xl font-serif tracking-tight text-[#2E1A47] leading-tight">
          Subscribe & get 20% off
        </h2>

        <p className="text-[#5B4B75]/70 text-sm md:text-base mt-3 max-w-md">
          New costume drops, early access to sales, and a welcome discount — straight to your inbox, no spam.
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full mt-8"
          noValidate
        >
          <div className="flex items-stretch w-full h-12 md:h-14 rounded-full bg-white border border-[#2E1A47]/15 focus-within:border-[#8B5CF6] transition-colors shadow-sm overflow-hidden">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Enter your email address"
              className="flex-1 bg-transparent outline-none px-5 md:px-6 text-sm md:text-base text-[#2E1A47] placeholder:text-[#5B4B75]/40"
            />
            <button
              type="submit"
              className="shrink-0 px-6 md:px-9 font-semibold text-white text-sm md:text-base transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D3FD6 100%)" }}
            >
              Subscribe
            </button>
          </div>

          <div className="h-6 mt-3">
            {status === "success" && (
              <p className="text-sm font-medium text-[#2E7D6B]">
                You're in — check your inbox for the discount code.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm font-medium text-[#E8578E]">
                That doesn't look like a valid email — mind trying again?
              </p>
            )}
          </div>
        </form>

        <p className="text-xs text-[#5B4B75]/40 mt-1">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default NewsLetter;