import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const [userInfo, setUserInfo] = useState({
    userData: { name: "", email: "", phoneNumber: "" },
    addressData: { street: "", town: "", county: "" },
  });

  const { cartItems } = useCart();
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const shipping = 10;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        let temp = await response.json();
        let userData = temp.user;
        let addressData = temp.address;
        setUserInfo({ userData, addressData });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Handle input changes
  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handlePlaceOrder = async () => {
    if (!userInfo) {
      alert(
        "Please fill in your shipping information before placing an order."
      );
      return;
    }

    const orderDetails = {
      items: cartItems,
      user: userInfo,
      total,
      tax,
      shipping
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderDetails),
        }
      );

      if (!response.ok) throw new Error("Failed to place order");

      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div>
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={userInfo.userData.name}
                  onChange={(e) => handleChange(e, "userData")}
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  value={userInfo.userData.email}
                  onChange={(e) => handleChange(e, "userData")}
                  type="email"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street
                </label>
                <input
                  name="street"
                  value={userInfo.addressData.street}
                  onChange={(e) => handleChange(e, "addressData")}
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Town
                  </label>
                  <input
                    name="town"
                    value={userInfo.addressData.town}
                    onChange={(e) => handleChange(e, "addressData")}
                    type="text"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    County
                  </label>
                  <input
                    name="county"
                    value={userInfo.addressData.county}
                    onChange={(e) => handleChange(e, "addressData")}
                    type="text"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  name="phoneNumber"
                  value={userInfo.userData.phoneNumber}
                  onChange={(e) => handleChange(e, "userData")}
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Ksh{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Ksh{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Ksh{tax}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Ksh{total}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white py-3 rounded mt-6 hover:bg-green-700 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
