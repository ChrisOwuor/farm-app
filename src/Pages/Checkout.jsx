import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const [userInfo, setUserInfo] = useState({
    userData: { name: "", email: "", phoneNumber: "" },
    addressData: { street: "", town: "", county: "" },
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { cartItems, clearCart } = useCart();
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
        setErrorMessage("Failed to load user information");
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

  const validateFields = () => {
    // Check if address fields are filled
    const { street, town, county } = userInfo.addressData;
    const { phoneNumber } = userInfo.userData;

    if (!street || !town || !county) {
      setErrorMessage("Please complete your shipping address");
      return false;
    }

    if (!phoneNumber) {
      setErrorMessage("Please provide a phone number for payment");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const orderDetails = {
      items: cartItems,
      user: userInfo,
      total,
      tax,
      shipping,
      paymentMethod: "M-PESA",
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      // Show success popup and clear cart
      setShowSuccessPopup(true);
      clearCart();

      // Automatically hide success popup after 5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage(
        error.message ||
          "There was an error placing your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Success popup component
  const SuccessPopup = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl transform transition-all animate-fadeIn">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h3>
          <p className="text-center text-gray-600 mb-6">
            Thank you for your order. You will receive payment instructions on
            your phone shortly.
          </p>
          <button
            onClick={() => setShowSuccessPopup(false)}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 animate-fadeIn">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div>
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  disabled
                  value={userInfo.userData.name}
                  onChange={(e) => handleChange(e, "userData")}
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  disabled
                  value={userInfo.userData.email}
                  onChange={(e) => handleChange(e, "userData")}
                  type="email"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street <span className="text-red-500">*</span>
                </label>
                <input
                  name="street"
                  value={userInfo.addressData.street}
                  onChange={(e) => handleChange(e, "addressData")}
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="town"
                    value={userInfo.addressData.town}
                    onChange={(e) => handleChange(e, "addressData")}
                    type="text"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    County <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="county"
                    value={userInfo.addressData.county}
                    onChange={(e) => handleChange(e, "addressData")}
                    type="text"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (M-PESA) <span className="text-red-500">*</span>
                </label>
                <input
                  name="phoneNumber"
                  value={userInfo.userData.phoneNumber}
                  onChange={(e) => handleChange(e, "userData")}
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  You will receive payment instructions on this number
                </p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                <p className="text-sm text-yellow-700">
                  Payment Method: <span className="font-medium">M-PESA</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg p-6 sticky top-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <>
                <div className="max-h-60 overflow-y-auto mb-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-2 border-b"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p>Ksh{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Ksh{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Ksh{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Ksh{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>Ksh{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || cartItems.length === 0}
                  className="w-full bg-green-600 text-white py-3 rounded mt-6 hover:bg-green-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && <SuccessPopup />}
    </div>
  );
}
