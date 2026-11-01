"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import TrackOrder from "./TrackOrder"
import axiosInstance from "@/utils/axiosInstance"

export default function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("")
  const [phone, setPhone] = useState("")
  // Timeline from the API: regular orders and pre-orders have different steps.
  const [track, setTrack] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault()
    const payloadData={
      order_no:orderNumber,
      phone
    }

    setLoading(true)
    setError("")

    try {
      const {data} = await axiosInstance.post("/order/track", payloadData);
      setTrack(data)
    } catch (error) {
      setTrack(null)
      setError(error?.response?.data?.message ?? "Could not track this order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white  w-full ">
        <h1 className="text-2xl font-bold  text-gray-800 mb-3">
          Track Your Order
        </h1>
       <div className=" flex flex-col sm:flex-row gap-4">
         <div className="w-full sm:w-2/4">
          <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
              Order Number
            </label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
               className="mt-1 block w-full bg-white px-3 py-1.5 sm:py-2 border
                   border-gray-300 rounded-sm shadow-sm placeholder-gray-400
                    focus:outline-none
                   focus:ring-1 focus:ring-[#3A9E75] focus:border-[#3A9E75]
                    sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone 
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
               className="mt-1 block w-full bg-white px-3 py-1.5 sm:py-2 border
                   border-gray-300 rounded-sm shadow-sm placeholder-gray-400
                    focus:outline-none
                   focus:ring-1 focus:ring-[#3A9E75] focus:border-[#3A9E75]
                    sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2 bg-[#3A9E75] text-white rounded-sm font-semibold hover:bg-[#338b65] disabled:opacity-60"
          >
            {loading ? "TRACKING..." : "TRACK"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
        </div>
        <div className="w-full sm:w-2/4">
          {track && (
            <p className="px-6 mb-4 text-sm text-gray-700">
              Order <b>{track.order_no}</b>
              {track.is_pre_order && <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">Pre-Order</span>}
              <span className="ml-2">Status: <b>{track.status?.name}</b></span>
            </p>
          )}
          <TrackOrder steps={track?.steps}/>
        </div>
       </div>
       
      </div>
    </div>
  )
}
