"use client"

import { useContext, useEffect, useRef, useState } from "react"
import {
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react"

import TopHeader from "./TopHeader"
import Link from "next/link"
import SeachBarwithDropDown from "./SeachBarwithDropDown"
import MegaMenuPanel from "./MegaMenuPanel"
import CartSideBar from "../CartSideBar/CartSideBar"
import WishListSideBar from "../WishListSidebar/WishListSidebar"

import { UserContext } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import whiteLogo from "@/assets/whiteLogo_.png"

export default function Header({ mainMenus, categories, notices }) {
  const { state, dispatch } = useContext(UserContext)
  const user = state?.user

  const router = useRouter()
  const dropdownRef = useRef(null)
  const toggleRef = useRef(null)
  const headerRef = useRef(null)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(prev => !prev)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !toggleRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMenuOpen])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    dispatch({ type: "LOGOUT" })
    router.push("/")
  }

  return (
    <div className="sticky top-0 z-50 bg-white">
      {/* Top Header */}
      <TopHeader notices={notices} />

      {/* Main Header */}
      <header ref={headerRef} className="bg-[#3A9E75] py-2 text-white relative">
        <div className="px-2 sm:px-4">
          <div className="flex items-center justify-between ">
            {/* Menu Toggle */}
            <button ref={toggleRef} onClick={toggleMenu} className="p-1">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <div className="w-107.5 flex justify-center">
              <Link href="/" className="text-xl sm:text-2xl font-bold">
                <img src={whiteLogo.src} alt="Lukaz shop" className="h-8 w-auto" />
              </Link>
            </div>

            {/* Search + Icons */}
            <div className="w-full flex justify-end items-center gap-2 ">
              <div className="hidden sm:flex w-full">
                <SeachBarwithDropDown />
              </div>

              <WishListSideBar />
              <CartSideBar />

              {user?.name && (
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2"
                >
                  <LogOut size={22} />
                </button>
              )}

              <Link
                href={user?.name ? "/dashboard" : "/login"}
                className="p-2"
              >
                <User size={22} />
              </Link>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        <div ref={dropdownRef}>
          <MegaMenuPanel
            isOpen={isMenuOpen}
            mainMenus={mainMenus}
            headerRef={headerRef}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>
      </header>

      {/* Mobile Search */}
      <div className="w-full py-2 px-4 flex sm:hidden bg-gray-50">
        <SeachBarwithDropDown categories={categories} />
      </div>
    </div>
  )
}
