"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Brain, Zap } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Brain className="w-10 h-10 text-purple-400" />,
      title: "Predict",
      description: "AI models analyze data to forecast risks before they occur.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-pink-400" />,
      title: "Prevent",
      description: "Automated systems take action to neutralize threats in real-time.",
    },
    {
      icon: <Zap className="w-10 h-10 text-fuchsia-400" />,
      title: "Protect",
      description: "Your assets remain secure with continuous monitoring & defense.",
    },
  ];

  return (
    <section className="relative w-full py-20 bg-black">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
        
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          How It Works
        </motion.h2>

        {/* Steps Grid */}
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-8 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-800/30 border border-white/10 shadow-lg hover:shadow-fuchsia-500/30 transition"
            >
              <div className="mb-6 p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-md">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}