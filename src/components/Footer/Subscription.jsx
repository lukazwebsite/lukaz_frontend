"use client"

import Link from "next/link"
import React, { useState } from "react"
import { ArrowRight } from "lucide-react"
import axiosInstance from "@/utils/axiosInstance"
import toast from 'react-hot-toast';

export default function Subscription() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email address.")
      return
    }

    try {
      setLoading(true)
      setMessage("")

      await axiosInstance.post("/subscribe", {
        email,
      })

    toast.success(` Subscription successful!`);
    setEmail("")

    } catch (error) {
     console.log("error on subscription", error)
      toast.error(`Something went wrong. Please try again.`);
      setMessage(error.response?.data?.message || "Failed to subscribe.")

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid items-center gap-8 rounded-[28px] border border-white/10 bg-[#1A573A] p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
      <div>
        <h2 className="section-title font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-white">
          Subscribe our newsletter
        </h2>
        <p className="mt-3 text-sm sm:text-base text-white/85">
          Get exclusive news, drop releases, and seasonal offers directly to your inbox.
        </p>
      </div>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
            placeholder="Your email address"
            className="min-w-0 flex-1 rounded-2xl bg-white px-5 py-3.5 text-gray-700 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#8DE8B8]"
          />
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="font-label flex items-center justify-center gap-2 rounded-2xl bg-[#123F2B] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg transition hover:bg-black disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Subscribing..." : "Subscribe"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </div>

        {message && (
          <p className="mt-3 text-sm text-red-200">{message}</p>
        )}

        <p className="mt-4 text-[11px] leading-relaxed text-white/75">
          By signing up you consent to receive updates by email about our latest new releases
          and our best special offers. We will never share your personal information with
          third parties for their marketing purposes and you can unsubscribe at any time. For
          more information please see our{" "}
          <Link href="/privacy-policy" className="underline">
            privacy policy
          </Link>.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Previous newsletter block, kept for reference.
// ---------------------------------------------------------------------------
// "use client"
// 
// import Link from "next/link"
// import React, { useState } from "react"
// import axiosInstance from "@/utils/axiosInstance"
// import toast from 'react-hot-toast';
// 
// export default function Subscription() {
//   const [email, setEmail] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState("")
// 
//   const handleSubscribe = async () => {
//     if (!email) {
//       setMessage("Please enter your email address.")
//       return
//     }
// 
//     try {
//       setLoading(true)
//       setMessage("")
// 
//       await axiosInstance.post("/subscribe", {
//         email,
//       })
// 
//     toast.success(` Subscription successful!`);
//     setEmail("")
//      
//     } catch (error) {
//      console.log("error on subscription", error)
//       toast.error(`Something went wrong. Please try again.`);
//       setMessage(error.response?.data?.message || "Failed to subscribe.")
//       
//     } finally {
//       setLoading(false)
//     }
//   }
// 
//   return (
//     <div className="pb-10 md:mb-4 grid md:grid-cols-2 justify-around gap-6">
//       <div>
//         <h2 className="text-4xl font-bold">Subscribe our newsletter</h2>
//         <p className="mt-2 text-gray-200">Get exclusive news and offers</p>
//       </div>
//       <div>
//         <div className="flex items-stretch sm:items-center gap-0.5">
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Your email address"
//             className="px-4 py-2 rounded-l-md bg-white text-gray-600 placeholder-gray-400 
//             flex-1 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#3A9E75]
//             focus:border-transparent outline-none transition-all"
//           />
//           <button
//             onClick={handleSubscribe}
//             disabled={loading}
//             className="bg-white text-gray-800 px-3 py-2 rounded-r-md hover:bg-gray-100 transition"
//           >
//             {loading ? "Subscribing..." : "Subscribe"}
//           </button>
//         </div>
// 
//         {message && (
//           <p className="text-sm mt-3 text-red-900">{message}</p>
//         )}
// 
//         <p className="text-sm text-white mt-3">
//           By signing up you consent to receive updates by email about our latest new releases
//           and our best special offers. We will never share your personal information with
//           third parties for their marketing purposes and you can unsubscribe at any time. For
//           more information please see our{" "}
//           <Link href="/privacy-policy" className="underline font-semibold">
//             privacy policy
//           </Link>.
//         </p>
//       </div>
//     </div>
//   )
// }
