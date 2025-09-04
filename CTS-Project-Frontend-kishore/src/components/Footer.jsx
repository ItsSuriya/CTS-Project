"use client";

import React from "react";

export function ParallaxFooter() {
  return (
    <footer className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
      {/* Background Parallax Image */}
      <div
        className="absolute inset-0 bg-fixed bg-bottom bg-cover"
        style={{
          backgroundImage:
            "url('/Footer.jpg')",
        }}
      ></div>

      {/* Overlay with your gradient palette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#7C29D0]/90 via-purple-600/70 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#7C29D0] via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Together for a Healthier Future
        </h2>

        <p className="text-gray-200 max-w-xl">
          Empowering healthcare through innovation, prevention, and protection.
        </p>

        <div className="mt-6 flex space-x-6">
          <a
            href="#"
            className="text-white/80 hover:text-[#7C29D0] transition-colors font-medium"
          >
            About Us
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-[#7C29D0] transition-colors font-medium"
          >
            Contact
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-[#7C29D0] transition-colors font-medium"
          >
            Careers
          </a>
        </div>

        <p className="mt-8 text-sm text-white/60">
          © {new Date().getFullYear()} HealthAI. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}