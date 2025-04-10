import React from "react";

import { useEffect, useState } from "react";
import { FormatDateUTC } from "../utils";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/buyer`, // Adjust the endpoint as necessary
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        if (data.message) {
          setOrders([]); // Ensure empty array instead of throwing an error
        } else {
          setOrders(data);
        } // Assuming the response contains an 'orders' array
      } catch (error) {
        setError("Failed to load orders");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">No Orders Available</h2>
          <p className="text-gray-600">You have no placed any orders yet.</p>
        </div>
      ) : null}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg  p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{order._id}</h2>
                <p className="text-gray-600">
                  Placed on {FormatDateUTC(order.createdAt)}
                </p>
                <p>
                  Payment Status{" "}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      order.paymentStatus === "unpaid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <span>
                  Delivery{" "}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </span>
                <p className="mt-2 text-lg font-bold">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.product}
                    </span>
                    <span>Ksh{(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Other Charges</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Ksh{parseInt(order.shipping).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>Ksh{parseInt(order.tax).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
