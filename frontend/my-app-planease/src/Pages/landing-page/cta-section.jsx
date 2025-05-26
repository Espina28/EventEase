"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function CTASection() {
  return (
    <section className="min-h-screen flex items-center py-16 bg-purple-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-4"
        >
          Your event deserves a smooth, professional experience from start to finish
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg mb-8 max-w-2xl mx-auto"
        >
          Let us help you create memorable moments without the stress of planning
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            to="#"
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-8 py-3 inline-block text-lg font-medium"
          >
            Start Planning Today
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
