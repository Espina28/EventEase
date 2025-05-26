"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const Testimonial = ({ name, location, quote, avatarUrl, backgroundColor = "#f8fafc" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-gray-800 text-white p-6 rounded-xl"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white" style={{ backgroundColor }}>
            <img src={avatarUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
          </div>
        </div>
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-sm text-amber-400 mb-4">{location}</p>
        <p className="text-gray-300 text-sm">"{quote}"</p>
      </div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Ivy Madrid Tumblod",
      location: "Wedding Client",
      quote:
        "Thank you po sa team nyo super masayang party ang mga stress-free choices. Thank you po sa wedding gown. Thank you!",
      avatarUrl: "/profile1.png?height=200&width=200",
      backgroundColor: "#f97316",
    },
    {
      name: "Lyka Padera - Esguerra",
      location: "Corporate Event",
      quote: "...it was truly worth it! I almost didn't do anything and yet I was really satisfied with everything.",
      avatarUrl: "/profile2.png?height=200&width=200",
      backgroundColor: "#22c55e",
    },
    {
      name: "Ann Aganan Salvacion",
      location: "Birthday Party",
      quote:
        "Maaah is all in one. As in hassle free! Problema ko lang is kung kelan ako magset up to the last detail, very timely on all reminders. Never kang papabayaan.",
      avatarUrl: "/profile3.png?height=200&width=200",
      backgroundColor: "#eab308",
    },
  ]

  return (
    <section className="min-h-screen flex items-center py-16 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-amber-100 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-amber-100 opacity-50"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-amber-500 uppercase tracking-wider font-medium"
          >
            TESTIMONIALS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mt-2"
          >
            Feedback from Our Clients
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              name={testimonial.name}
              location={testimonial.location}
              quote={testimonial.quote}
              avatarUrl={testimonial.avatarUrl}
              backgroundColor={testimonial.backgroundColor}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gray-700 rounded-xl p-8 text-center"
        >
          <p className="text-amber-400 text-sm font-medium mb-2">Ready to Plan with Confidence?</p>
          <h3 className="text-white text-2xl md:text-3xl font-bold mb-8 max-w-2xl mx-auto">
            Your event deserves a smooth, professional experience from start to finish
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-md text-sm font-medium transition-colors"
            >
              Register Now!
            </Link>
            <Link
              to="/login"
              className="border border-gray-600 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Already have an account?
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
