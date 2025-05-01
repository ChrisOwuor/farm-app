import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();
  console.log(cartItems);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const increaseQuantity = (id) => {
    const item = cartItems.find((item) => item._id === id);
    if (item) {
      updateCartItemQuantity(id, item.quantity + 1);
    }
  };

  const decreaseQuantity = (id) => {
    const item = cartItems.find((item) => item._id === id);
    if (item && item.quantity > 1) {
      updateCartItemQuantity(id, item.quantity - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6">
            {cartItems.length === 0 && <p>Your cart is empty</p>}
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center py-4 border-b last:border-b-0"
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${item.image}`}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Ksh{item.price}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="px-2 py-1 border rounded-l hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="px-2 py-1 border rounded-r hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Ksh{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>Ksh{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Ksh{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded mt-6 hover:bg-green-700 transition-colors">
              <Link to={"/checkout"}>Place Order</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
