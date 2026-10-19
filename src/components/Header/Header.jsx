"use client"

import { useContext, useEffect, useRef, useState } from "react"
import {
  User,
  X,
  LogOut,
  Search,
} from "lucide-react"

import TopHeader from "./TopHeader"
import Link from "next/link"
import SeachBarwithDropDown from "./SeachBarwithDropDown"
import MegaMenuPanel from "./MegaMenuPanel"
import { menuItems } from "./SecondMenu"
import CartSideBar from "../CartSideBar/CartSideBar"
import WishListSideBar from "../WishListSidebar/WishListSidebar"

import { UserContext } from "@/context/UserContext"
import { usePathname, useRouter } from "next/navigation"

export default function Header({ mainMenus, categories, notices }) {
  const { state, dispatch } = useContext(UserContext)
  const user = state?.user

  const router = useRouter()
  const pathname = usePathname()
  const dropdownRef = useRef(null)
  const toggleRef = useRef(null)
  const headerRef = useRef(null)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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

  // Active link = last URL segment matches, same rule SecondMenu uses
  const lastPath = pathname.split("/").filter(Boolean).pop()

  return (
    <div className="sticky top-0 z-50 bg-white">
      {/* Top Header */}
      <TopHeader notices={notices} />

      {/* Main Header */}
      <header ref={headerRef} className="bg-white text-[#09090C] border-b border-gray-200 relative">
        <div className="mx-auto max-w-[1640px] px-3 sm:px-4 md:px-10">
          <div className="grid h-14 md:h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Menu toggle + logo */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                ref={toggleRef}
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="flex items-center gap-2 p-1 cursor-pointer"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <span className="flex h-6 w-6 flex-col justify-center gap-[5px]">
                    <span className="h-0.5 w-full bg-current" />
                    <span className="h-0.5 w-full bg-current" />
                    <span className="h-0.5 w-full bg-current" />
                  </span>
                )}
                <span className="font-label hidden sm:inline text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Menu
                </span>
              </button>

              <Link
                href="/"
                aria-label="Lukaz shop"
                className="font-heading text-2xl md:text-3xl font-black tracking-tighter leading-none"
              >
                LUKAZ<span className="text-[#237A52]">.</span>
              </Link>
            </div>

            {/* Primary nav (desktop). Mobile gets the same links from SecondMenu. */}
            <nav className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => {
                const itemLastPath = item.href.split("/").filter(Boolean).pop()
                const isActive = lastPath === itemLastPath

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-[#237A52] ${
                      isActive ? "text-[#237A52] font-semibold" : "text-[#09090C]"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Icons */}
            <div className="col-start-3 flex items-center justify-end gap-1">
              <button
                onClick={() => setIsSearchOpen(prev => !prev)}
                aria-label="Search"
                className="hidden sm:block p-2 cursor-pointer hover:text-[#237A52] transition-colors"
              >
                {isSearchOpen ? <X size={22} /> : <Search size={22} />}
              </button>

              <WishListSideBar />
              <CartSideBar />

              {user?.name && (
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 cursor-pointer hover:text-[#237A52] transition-colors"
                >
                  <LogOut size={22} />
                </button>
              )}

              <Link
                href={user?.name ? "/dashboard" : "/login"}
                aria-label={user?.name ? "My account" : "Login"}
                className="p-2 hover:text-[#237A52] transition-colors"
              >
                <User size={22} />
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop search, opened from the search icon */}
        {isSearchOpen && (
          <div className="hidden sm:block border-t border-gray-100 bg-[#FAFAFC]">
            <div className="mx-auto max-w-[1640px] px-4 md:px-10 py-3">
              <SeachBarwithDropDown />
            </div>
          </div>
        )}

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
