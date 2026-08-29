"use client"

import { createContext, useContext, useState, useEffect } from "react"

const DashboardContext = createContext()

export function DashboardProvider({ children }) {
  const [activeSection, setActiveSection] = useState("overview")

  // load saved section after hydration (localStorage is client-only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboardActiveSection")
      setActiveSection(saved || "overview")
    }
  }, [])

  // whenever activeSection changes, update localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardActiveSection", activeSection)
    }
  }, [activeSection])

  return (
    <DashboardContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </DashboardContext.Provider>
  )
}

// custom hook for easy access
export function useDashboard() {
  return useContext(DashboardContext)
}
