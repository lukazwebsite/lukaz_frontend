"use client";

import { createContext, useEffect, useReducer } from "react";

export const CartContext = createContext();

const initialState = {
    items: [],
    // discount: 0,
};

function cartReducer(state, action) {
    switch (action.type) {
        case "ADD_ITEM": {
            const existingItem = state.items.find(
                (item) => (
                    item?.productData?.product_id === action?.payload?.productData?.product_id
                    && item?.selectedSize === action?.payload?.selectedSize
                    && item?.selectedColor === action?.payload?.selectedColor
                )
            );
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.product_id === action.payload.product_id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }
            return {
                ...state,
                items: [
                    ...state.items,
                    { ...action.payload, quantity: action.payload?.quantity || 1 },
                ],
            };
        }

        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter(
                    (item) =>
                        !(
                            item?.productData?.product_id === action.payload?.product_id &&
                            item?.selectedSize === action.payload?.selectedSize &&
                            item?.selectedColor === action.payload?.selectedColor
                        )
                ),
            };

        case "INCREASE_QUANTITY":
            return {
                ...state,
                items: state.items.map((item) =>
                    item?.productData?.product_id === action.payload?.product_id &&
                        item?.selectedSize === action.payload?.selectedSize &&
                        item?.selectedColor === action.payload?.selectedColor
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            };

        case "DECREASE_QUANTITY":
            return {
                ...state,
                items: state.items
                    .map((item) =>
                        item?.productData?.product_id === action.payload?.product_id &&
                            item?.selectedSize === action.payload?.selectedSize &&
                            item?.selectedColor === action.payload?.selectedColor
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    )
                    .filter((item) => item.quantity > 0),
            };
        case "SET_DISCOUNT": {
            return {
                ...state,
                discount: action.payload,
            };
        }

        case "CLEAR_CART":
            return initialState;

        case "HYDRATE":
            return { ...initialState, ...action.payload };

        default:
            console.warn(`Unhandled action: ${action.type}`);
            return state;
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load initial state from localStorage after hydration
    // (reading localStorage during render causes SSR hydration mismatch)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedState = localStorage.getItem("lukazCart");
            if (storedState) {
                dispatch({ type: "HYDRATE", payload: JSON.parse(storedState) });
            }
        }
    }, []);

    // Persist to localStorage on state change
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("lukazCart", JSON.stringify(state));
        }
    }, [state]);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}
