"use client";

import { createContext, useEffect, useReducer } from "react";

export const WishListContext = createContext();

const initialState = {
  items: [],
};

function wishListReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find(
        (item) => item?.productData?.slug === action?.payload?.productData?.slug
      );

      if (exists) {
        // Already in wishlist, do nothing
        return state;
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item?.productData?.slug !== action?.payload
        ),
      };

    case "CLEAR_WISHLIST":
      return initialState;

    case "HYDRATE":
      return { ...initialState, ...action.payload };

    default:
      console.warn(`Unhandled action: ${action.type}`);
      return state;
  }
}

export function WishListProvider({ children }) {
  const [state, dispatch] = useReducer(wishListReducer, initialState);

  // Load initial state from localStorage after hydration
  // (reading localStorage during render causes SSR hydration mismatch)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedState = localStorage.getItem("lukazWishList");
      if (storedState) {
        dispatch({ type: "HYDRATE", payload: JSON.parse(storedState) });
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lukazWishList", JSON.stringify(state));
    }
  }, [state]);

  return (
    <WishListContext.Provider value={{ state, dispatch }}>
      {children}
    </WishListContext.Provider>
  );
}
