import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const updateLocalStorage = (items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  const addToCart = (product, quantity) => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1", {
        autoClose: 1000,
        position: "bottom-left",
      });
      return;
    }
    if (user === null) {
      toast.error("Please login to add items to the cart", {
        autoClose: 1000,
        position: "bottom-left",
      });
      return;
    }
    const existingItem = cartItems.find((item) => item._id === product._id);
    if (existingItem) {
      toast.error("Item already added to the cart", {
        autoClose: 1000,
        position: "bottom-left",
      });
    } else {
      const newItems = [...cartItems, { ...product, quantity }];
      setCartItems(newItems);
      updateLocalStorage(newItems);
      toast.success("Item added to the cart", {
        autoClose: 1000,
        position: "bottom-left",
      });
    }
  };

  const removeFromCart = (productId) => {
    const newItems = cartItems.filter((item) => item._id !== productId);
    setCartItems(newItems);
    updateLocalStorage(newItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };
  const updateCartItemQuantity = (itemId, quantity) => {
    const updatedItems = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    );

    setCartItems(updatedItems);
    updateLocalStorage(updatedItems); // Ensure localStorage is updated
  };

  const value = {
    updateCartItemQuantity,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
