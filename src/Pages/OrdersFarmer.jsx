import React, { useEffect, useState } from "react";
import { FormatDateUTC } from "../utils";

export default function OrdersFarmer() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/orders/farmer?page=${page}&limit=2`, // Adjust the limit as needed
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data.orders || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError("Failed to load orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]); // Re-fetch data when page changes

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">No Orders Available</h2>
          <p className="text-gray-600">You have no orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order._id}</h2>
                  <p className="text-gray-600">
                    Placed on {FormatDateUTC(order.createdAt)}
                  </p>
                  <p className="text-gray-600">
                    Placed by {order?.buyerId.name}
                  </p>
                  <p className="text-gray-600">
                    Contact Information {order?.buyerId.phoneNumber}
                  </p>
                  <p>
                    Payment Status{" "}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        order.paymentStatus === "Unpaid"
                          ? "bg-red-100 text-red-800"
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
                    Ksh {order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Delivery Details</h3>
                <div className="space-y-2">
                  <div className="flex flex-col text-sm">
                    <span> County :{order?.buyerId.address.county}</span>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span> Street :{order?.buyerId.address.street}</span>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span> Town :{order?.buyerId.address.town}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.quantity}x {item.productId.name}
                      </span>
                      <span>
                        Ksh {(item.quantity * item.productId.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Other Charges</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Ksh {order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Ksh {order.tax.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                <button className="text-green-600 hover:text-green-700 font-medium">
                  View Details
                </button>
                <button className="text-green-600 hover:text-green-700 font-medium">
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>

          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
