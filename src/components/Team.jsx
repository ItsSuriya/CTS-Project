"use client";

import React from "react";

const developers = [
  {
    name: "Pradeep Kumar",
    role: "Backend  Developer",
    img: "/pradeep.jpeg",
  },
  {
    name: "Suriya ",
    role: "Backend  Developer",
    img: "/suriya.jpeg",
  },
  {
    name: "Kishore",
    role: "Frontend Developer",
    img: "/kishoreR.jpeg",
  },
  {
    name: "Jayvanti",
    role: "UI/UX Designer",
    img: "/jayvanti.jpeg",
  },
  {
    name: "Bala Mohanan",
    role: "DevOps Engineer",
    img: "/bala.jpeg",
  },
];

export function DevelopersSection() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-[#0A0118] via-[#1A0733] to-[#2A0F4D] text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-[#7C29D0] via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Meet the Developers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-[#140122] rounded-2xl p-6 shadow-lg hover:shadow-purple-500/30 transition-shadow"
            >
              <img
                src={dev.img}
                alt={dev.name}
                className="w-28 h-28 rounded-full object-cover border-2 border-purple-500 shadow-md"
              />
              <h3 className="mt-4 text-lg font-semibold">{dev.name}</h3>
              <p className="text-sm text-gray-300">{dev.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}