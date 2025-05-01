import React, { useEffect, useState } from "react";
import { FormatDateUTC } from "../utils";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/orders/buyer?page=${currentPage}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        if (data.orders) {
          setOrders(data.orders);
          setTotalPages(data.totalPages || 1);
        } else {
          setOrders([]);
        }
      } catch (error) {
        setError("Failed to load orders");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">No Orders Available</h2>
          <p className="text-gray-600">You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg p-6 shadow-md">
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
                        order.paymentStatus === "Unpaid"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
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
                    Ksh {(order.amount || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-2">
                  {order.subOrders.map((subOrder, subIndex) => (
                    <div key={subIndex} className="space-y-1">
                      {subOrder.products.map((product, prodIndex) => (
                        <div
                          key={prodIndex}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {product.quantity}x {product.name}
                          </span>
                          <span>
                            Ksh{(product.quantity * product.price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Other Charges</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Ksh{parseFloat(order.shipping).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Ksh{parseFloat(order.tax).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
