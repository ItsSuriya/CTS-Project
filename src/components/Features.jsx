import React from "react"
import { motion } from "framer-motion"
import { Brain, Activity, Stethoscope } from "lucide-react" // modern icons

const FeaturesGrid = () => {
  const features = [
    {
      icon: <Brain className="w-10 h-10 text-purple-400" />,
      title: "AI-Powered Risk Detection",
      description:
        "Our machine learning models analyze subtle patient signals like ER visit velocity, medication refill delays, and care gaps — before they turn into emergencies.",
    },
    {
      icon: <Activity className="w-10 h-10 text-pink-400" />,
      title: "Explainable Insights",
      description:
        "Not just predictions — clear SHAP explanations tell care managers exactly *why* a patient is high risk, helping them take action with confidence.",
    },
    {
      icon: <Stethoscope className="w-10 h-10 text-purple-300" />,
      title: "Actionable Recommendations",
      description:
        "From scheduling pharmacist reviews to targeted outreach, Prognos suggests the right intervention at the right time — improving outcomes while reducing costs.",
    },
  ]

  return (
    <section className="relative w-full bg-[#0a0a0a] py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Why Choose Hope Care?
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Our platform empowers care teams to move from <span className="text-pink-400 font-semibold">reactive firefighting</span> 
          to <span className="text-purple-400 font-semibold">proactive prevention</span>.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-10">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20 shadow-lg hover:shadow-pink-500/30 hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-6">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default FeaturesGrid