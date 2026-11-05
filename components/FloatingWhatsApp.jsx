"use client";

import React, { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "919704022443";
const MESSAGE =
  "Hi SGN Costume World, I'd like to know more about your costumes.";

const SHOW_AFTER_MS = 1200; // wait before it opens
const OPEN_FOR_MS = 4500; // how long it stays open

const FloatingWhatsApp = () => {
  const [expanded, setExpanded] = useState(false);

  // Open automatically once, then fold back into a circle.
  useEffect(() => {
    const openTimer = setTimeout(() => setExpanded(true), SHOW_AFTER_MS);
    const closeTimer = setTimeout(
      () => setExpanded(false),
      SHOW_AFTER_MS + OPEN_FOR_MS
    );

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    MESSAGE
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`group fixed right-4 z-[60] flex h-[52px] items-center overflow-hidden rounded-full bg-[#00d757] shadow-[2px_2px_10px_rgba(0,0,0,0.25)] transition-all duration-500 hover:w-[165px] focus-visible:w-[165px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00d757] active:scale-95 bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:right-6 sm:bottom-6 ${
        expanded ? "w-[165px]" : "w-[52px]"
      }`}
    >
      {/* Icon (always visible) */}
      <span className="flex h-full w-[52px] shrink-0 items-center justify-center">
        <svg
          viewBox="0 0 16 16"
          className="h-[26px] w-[26px] fill-white"
          aria-hidden="true"
        >
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
        </svg>
      </span>

      {/* Text (shows when the button is open) */}
      <span
        className={`whitespace-nowrap pr-4 text-[15px] font-semibold text-white transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${
          expanded ? "opacity-100" : "opacity-0"
        }`}
      >
        WhatsApp
      </span>
    </a>
  );
};

export default FloatingWhatsApp;