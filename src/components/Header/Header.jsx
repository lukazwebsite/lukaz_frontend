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

const SneakerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 16l2-8h4l2 4h8l2 4H2z" />
    <path d="M6 8l1-4h4l1 4" />
    <path d="M2 16h18a2 2 0 0 1 0 4H4a2 2 0 0 1-2-2v-2z" />
  </svg>
)

const OutfitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
  </svg>
)

const LuxuryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M5 20h14" />
  </svg>
)

const menuIcons = {
  Sneakers: SneakerIcon,
  Outfits: OutfitIcon,
  Luxury: LuxuryIcon,
}
import CartSideBar from "../CartSideBar/CartSideBar"
import WishListSideBar from "../WishListSidebar/WishListSidebar"

import { UserContext } from "@/context/UserContext"
import { usePathname, useRouter } from "next/navigation"

export default function Header({ mainMenus, categories, topBar, logoUrl }) {
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
      <TopHeader messages={topBar} />

      {/* Main Header */}
      <header ref={headerRef} className="bg-white text-[#09090C] border-b border-gray-200 relative">
        <div className="mx-auto max-w-[1640px] px-3 sm:px-4 md:px-10">
          <div className="grid h-14 md:h-16 lg:h-20 grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4">
            {/* Menu toggle + logo */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-6">
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
              </button>

              {/* Uploaded logo from Website Config -> Logo, else the text logo */}
              <Link
                href="/"
                aria-label="Lukaz shop"
                className="font-heading min-w-0 text-xl sm:text-2xl md:text-3xl font-black tracking-tighter leading-none"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="LUKAZ"
                    className="block h-8 md:h-10 w-auto max-w-[96px] min-[400px]:max-w-[130px] sm:max-w-[180px] object-contain"
                  />
                ) : (
                  <>LUKAZ<span className="text-[#237A52]">.</span></>
                )}
              </Link>
            </div>

            {/* Primary nav (desktop only), always visible */}
            <nav className="hidden md:flex items-center justify-center gap-2 lg:gap-4 min-w-0 px-1 lg:px-2">
              {menuItems.map((item) => {
                const itemLastPath = item.href.split("/").filter(Boolean).pop()
                const isActive = lastPath === itemLastPath
                const Icon = menuIcons[item.label]

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 lg:gap-2.5 px-3 py-2 lg:px-8 lg:py-3 rounded-xl lg:rounded-2xl border text-xs lg:text-base font-semibold transition-all duration-200 whitespace-nowrap
                      ${isActive
                        ? "bg-[#eaf7f1] border-[#3a9e74] text-[#2a7a57]"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-[#eaf7f1] hover:border-[#3a9e74] hover:text-[#2a7a57]"
                      }`}
                  >
                    {Icon && (
                      <span className={`hidden lg:inline ${isActive ? "text-[#2a7a57]" : "text-gray-500"}`}>
                        <Icon />
                      </span>
                    )}
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Icons */}
            <div className="col-start-2 md:col-start-3 flex items-center justify-end sm:gap-1">
              {/* Desktop search (with category dropdown): sits left of the icons, nav boxes shrink to make room */}
              {isSearchOpen && (
                <div className="hidden lg:block w-[320px] xl:w-[420px] mr-3">
                  <SeachBarwithDropDown
                    autoFocus
                    onClose={() => setIsSearchOpen(false)}
                  />
                </div>
              )}

              {/* Stays visible on mobile while open (active state); desktop swaps it for the inline bar */}
              <button
                onClick={() => setIsSearchOpen(prev => !prev)}
                aria-label="Search"
                aria-expanded={isSearchOpen}
                className={`p-2 cursor-pointer hover:text-[#237A52] transition-colors ${
                  isSearchOpen ? "text-[#237A52] lg:hidden" : ""
                }`}
              >
                <Search size={22} />
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
                className="hidden lg:block p-2 hover:text-[#237A52] transition-colors"
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

      {/* Mobile Search: opens from the header search icon */}
      {isSearchOpen && (
        <div className="w-full py-2 px-3 sm:px-4 flex lg:hidden bg-gray-50">
          <SeachBarwithDropDown autoFocus onClose={() => setIsSearchOpen(false)} />
        </div>
      )}
    </div>
  )
}
