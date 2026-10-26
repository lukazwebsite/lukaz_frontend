"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Package, Clock, CreditCard } from "lucide-react"

export default function PreOrderPolicy() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const policies = [
    {
      icon: Package,
      title: "Pre-Order Process",
      description: "Placing a pre-order reserves your item prior to release. While estimated shipping dates are provided, timelines may vary based on stock availability. We will notify you as soon as your order dispatches.",
    },
    {
      icon: Clock,
      title: "Estimated Delivery",
      sections: [
        {
          title: "⚡ Express Delivery (7 Days):",
          items: [
            { label: "Applicable for:", text: "Caps, Wallets, Sunglasses, and Watches." },
            { label: "Timeline:", text: "Delivered within 7 days." },
          ],
        },
        {
          title: "📦 Flexible Delivery (7 Days or 15 Days):",
          items: [
            { label: "Applicable for:", text: "Footwear, Outfits, Travel Bags, etc." },
            { label: "15-Day Delivery:", text: "FREE / No extra charge (Standard timeline)." },
            { label: "7-Day Fast Delivery:", text: "Available upon request with an additional delivery charge." },
          ],
        },
      ],
    },
    {
      icon: CreditCard,
      title: "Payment & Cancellations",
      sections: [
        {
          title: "Booking and Payment:",
          text: "To confirm an order, a specific 10% advance payment of the total product price must be paid.",
        },
        {
          title: "Cancellation and Refund Policy (3-Day Rule):",
          text: "If a customer wishes to cancel an order within the first 3 days of placing it, they will receive a full refund. However, cancellation or refunds will not be accepted after 3 days.",
        },
        {
          title: "Delivery Timeline:",
          text: "Our standard delivery timeframe is 15 to 18 days from the date of order confirmation.",
        },
        {
          title: "Delayed Delivery Refund:",
          text: "If we fail to deliver within the specified 15–18 day timeframe and the customer chooses to cancel the order due to this delay, we will issue a full refund.",
        },
      ],
    },
  ]

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Hero Section */}
      <div className="relative flex items-center justify-center overflow-hidden bg-[#3A9E75] text-white py-14">
        <div className="absolute inset-0 bg-gradient-to-t from-[#2E8B57]/70 to-transparent"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
        >
          <ShieldCheck className="mx-auto mb-4 text-white" size={60} />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Pre-Order Policy</h1>
          <p className="mt-6 leading-relaxed max-w-2xl mx-auto">
            Our pre-order policy ensures transparency on timelines, payments, and cancellations.  
            Please review the details before placing your order.
          </p>
        </motion.div>
      </div>

      {/* Info Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants}
        className="py-8 sm:py-12 px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            variants={fadeInVariants}
            className="relative overflow-hidden rounded-lg shadow-xl aspect-video group"
          >
            <img
              src="/images/others/preorder5.webp"
              alt="Pre-order"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </motion.div>
          <motion.div variants={fadeInVariants}>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#3A9E75] mb-2 leading-tight">
              Why Pre-Order with LUKAZ?
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Pre-ordering allows you to reserve high-demand, limited-stock items before they officially hit the shelves.
            </p>
            <ul className="list-none text-gray-600 space-y-2">
              <li>🔒 <span className="font-semibold">Guaranteed Allocation:</span> Secure exclusive products in advance—zero risk of sold-out items.</li>
              <li>🚀 <span className="font-semibold">Priority Shipping:</span> Be the first in line to receive your order as soon as stock arrives.</li>
              <li>📦 <span className="font-semibold">Smarter Inventory:</span> Helps us tailor stock levels to bring you the exact styles and sizes you love.</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Policies */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-8 sm:py-12  bg-[#E6F4EF]"
      >
        <motion.div variants={fadeInVariants} className="mx-auto max-w-[1640px] px-3 sm:px-4 md:px-16 text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Pre-Order Terms</h3>
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {policies.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInVariants}
                className="flex flex-col items-center text-center py-8 px-6 rounded-xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-6 group-hover:bg-[#3A9E75] transition-colors duration-300">
                  <value.icon className="w-8 h-8 text-[#3A9E75] group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                {value.description && <p className="text-gray-700 leading-relaxed">{value.description}</p>}
                {value.sections && (
                  <div className="w-full text-left text-gray-700 leading-relaxed space-y-4">
                    {value.sections.map((section) => (
                      <div key={section.title}>
                        <p className="font-semibold text-gray-900">{section.title}</p>
                        {section.text && <p className="mt-1">{section.text}</p>}
                        {section.items && (
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {section.items.map((item) => (
                              <li key={item.label}>
                                <span className="font-semibold">{item.label}</span> {item.text}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  )
}
