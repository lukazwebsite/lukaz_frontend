"use client"

import { Icon } from "@iconify/react"

// Shown before an order is tracked: the regular order flow, all gray.
const DEFAULT_STEPS = [
  { name: "Pending", icon: "mdi:cart-check", state: "pending" },
  { name: "Confirmed", icon: "game-icons:confirmed", state: "pending" },
  { name: "Processing", icon: "mdi:timer-sand", state: "pending" },
  { name: "Packaging", icon: "octicon:package-dependencies-16", state: "pending" },
  { name: "Shipped", icon: "material-symbols:delivery-truck-speed-rounded", state: "pending" },
  { name: "Delivered", icon: "mdi:package-variant-closed-check", state: "pending" },
]

// Step states come from the /order/track API: completed, current, pending or cancelled.
const COLORS = {
  completed: { icon: "#3A9E75", dot: "bg-[#3A9E75]", text: "text-[#3A9E75]" },
  current: { icon: "#2563EB", dot: "bg-blue-500", text: "text-blue-600" },
  cancelled: { icon: "#DC2626", dot: "bg-red-600", text: "text-red-600" },
  pending: { icon: "#9CA3AF", dot: "bg-gray-300", text: "text-gray-400" },
}

export default function TrackOrder({ steps }) {
  const trackingSteps = steps?.length ? steps : DEFAULT_STEPS

  return (
    <div className=" ">
      <div className="px-6 ">
        <div className="relative">
          {trackingSteps.map((step, index) => {
            const isLast = index === trackingSteps.length - 1
            const color = COLORS[step.state] ?? COLORS.pending

            return (
              <div key={step.id ?? index} className="flex items-start gap-4 relative">
                {/* Timeline Line */}
                {!isLast && (
                  <div className="absolute left-3 top-10 w-0.5 h-16 bg-gray-300"></div>
                )}

                {/* Status Dot */}
                <div className={`w-6 h-6 rounded-full flex-shrink-0 mt-3 ${color.dot}`}></div>

                {/* Icon */}
                <div className="text-2xl mt-0.5 flex-shrink-0">
                  <Icon icon={step.icon} width="40" height="40" color={color.icon} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <h3 className={`font-medium text-lg mb-1 ${color.text}`}>{step.name}</h3>
                  <p className="text-gray-600 text-sm">{step.date ?? ""}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
