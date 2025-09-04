import React from "react"
import { motion } from "framer-motion"

const AboutSection = () => {
  return (
    <section className="relative w-full bg-[#0a0a0a] py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            About Prognos Health
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Healthcare today is often <span className="font-semibold text-purple-400">reactive</span>. 
            Care teams wait for a crisis to occur before they step in. 
            Prognos Health changes that story — by giving clinicians a proactive 
            co-pilot that surfaces hidden risks *before* they become emergencies.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Imagine Priya, a care manager, responsible for 500 patients. 
            Without Prognos, she only sees patients ranked by basic conditions. 
            With Prognos, subtle signals — like ER visits or late refills — 
            are analyzed by our AI overnight. 
          </p>
          <p className="text-gray-400 leading-relaxed">
            Suddenly, Mr. Sharma, who looked stable on paper, rises to the top of 
            her priority list. Prognos doesn’t just say <em>“high risk”</em> — it explains 
            <span className="font-medium text-pink-400"> why</span>, and even suggests the 
            <span className="font-medium text-pink-400"> right next action</span>.  
          </p>
          <button className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300">
            Explore the Platform
          </button>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-md">
            <img
              src="/About.jpg"
              alt="Healthcare AI dashboard"
              className="rounded-2xl shadow-2xl"
            />
            {/* Gradient Overlay Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500/30 to-pink-500/30 blur-2xl -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection