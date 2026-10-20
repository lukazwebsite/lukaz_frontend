"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { useFilter } from "@/context/FilterContext";
import { useRouter } from "next/navigation";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://admin.lukazshop.com";

export default function SearchBarWithDropdown({ showDropdown = true, onClose, autoFocus = false }) {

  const {  dispatch: dispatchFilterProduct } = useFilter();
  const [categoriesData, setCategoriesData] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [categoryId, setCategoryId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const typingTimeoutRef = useRef(null);



  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/api/categories`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();
        setCategoriesData(data?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSetCategory = (cat) => {
    setCategoryId(cat?.id || "");
    setCategory(cat?.name || "All");
    setIsOpen(false);
    dispatchFilterProduct({ type: "SET_CATEGORIES", payload: cat?.id || "" });
    // Only navigate when a category is picked without a search query
    if (!query.trim()) {
      router.push("/shop");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    dispatchFilterProduct({ type: "SET_SEARCH", payload: query });
    dispatchFilterProduct({ type: "SET_CATEGORIES", payload: categoryId });
    router.push("/shop");
  };

  // Clear search term when input is emptied
  useEffect(() => {
    if (query === "") {
      dispatchFilterProduct({ type: "SET_SEARCH", payload: "" });
    }
  }, [query]);

  // Auto-navigate after user stops typing (800ms debounce)
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (query.trim() !== "") {
      typingTimeoutRef.current = setTimeout(() => {
        dispatchFilterProduct({ type: "SET_SEARCH", payload: query });
        dispatchFilterProduct({ type: "SET_CATEGORIES", payload: categoryId });
        router.push("/shop");
      }, 800);
    }

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [query]);

  // Clear search, and close the bar when the parent owns its visibility
  const clearSearch = () => {
    setQuery("");
    dispatchFilterProduct({ type: "SET_SEARCH", payload: "" });
    if (onClose) onClose();
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 w-full rounded-full border border-gray-200
       bg-gray-100 px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-[#237A52]/40
        focus-within:bg-white transition"
    >
      {/* Search icon */}
      <button
        type="submit"
        aria-label="Search"
        className="shrink-0 cursor-pointer text-[#237A52]"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer flex items-center gap-1 pr-2 text-sm text-gray-700
             hover:text-[#237A52] transition border-r border-gray-300 max-w-[96px]"
          >
            <span className="truncate">{category}</span>
            <ChevronDown className="w-4 h-4 shrink-0 text-gray-500" />
          </button>
          {isOpen && (
            <ul className="absolute z-10 top-full left-0 mt-2 w-40 bg-white border
             border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto">
              {/* Loading State */}
              {loading && (
                <li className="px-4 py-2 text-sm text-gray-500">Loading...</li>
              )}

              {/* Default "All" Option */}
              <li
                onClick={() => handleSetCategory({ name: "All" })}
                className={`px-4 py-2 text-sm hover:bg-[#ecfdf5] hover:text-[#237A52] cursor-pointer transition ${
                  category === "All"
                    ? "bg-[#ecfdf5] text-[#237A52]"
                    : "text-gray-800"
                }`}
              >
                All
              </li>

              {/* Dynamic Categories */}
              {categoriesData.map((cat, i) => (
                <li
                  key={i}
                  onClick={() => handleSetCategory(cat)}
                  className={`px-4 py-2 text-sm hover:bg-[#ecfdf5] hover:text-[#237A52] cursor-pointer transition ${
                    cat?.name === category
                      ? "bg-[#ecfdf5] text-[#237A52]"
                      : "text-gray-800"
                  }`}
                >
                  {cat?.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Input */}
      <input
        type="text"
        autoFocus={autoFocus}
        placeholder="Search Air Force 1, Jordan, Polos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="min-w-0 flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
      />

      {/* Clear (and close, when the parent passes onClose) */}
      {(query || onClose) && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="shrink-0 cursor-pointer text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
