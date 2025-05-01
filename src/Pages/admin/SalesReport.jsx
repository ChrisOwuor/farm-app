import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SalesReport() {
  const [timeRange, setTimeRange] = useState("week");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch sales report based on selected category
  useEffect(() => {
    async function fetchSalesReport() {
      try {
        // Fetch sales data based on the selected category
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/sales`,
          {
            params: {
              category: selectedCategory, // Send selected category as a parameter
              timeRange, // You can also send the time range if needed
            },
          }
        );
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSalesReport();
  }, [timeRange, selectedCategory]); // Re-fetch when timeRange or selectedCategory changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading sales data...</p>
      </div>
    );
  }

  if (!salesData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Failed to load sales data</p>
      </div>
    );
  }

  const {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    pendingOrders,
    canceledOrders,
    paymentMethodStats,
    revenueTrend,
  } = salesData;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track sales performance and revenue metrics
        </p>
      </div>

      {/* Sales Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            Ksh{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Completed Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Average Order Value
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            Ksh{averageOrderValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {pendingOrders}
          </p>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Canceled Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {canceledOrders}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalOrders - canceledOrders}
          </p>
        </div>
      </div>

      {/* Sales Trend */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-500">Daily revenue </h3>
        <ul>
          {revenueTrend.map((item) => (
            <li key={item._id} className="py-2">
              <span className="text-gray-700">{item._id}</span>:{" "}
              <span className="font-semibold">
                Ksh{item.dailyRevenue.toLocaleString()}
              </span>{" "}
              (Orders: {item.count})
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-500">Payment Methods</h3>
        <ul>
          {paymentMethodStats.map((method) => (
            <li key={method._id} className="py-2">
              <span className="text-gray-700">{method._id}</span>:{" "}
              <span className="font-semibold">{method.count} orders</span>{" "}
              (Revenue: Ksh{method.revenue.toLocaleString()})
            </li>
          ))}
        </ul>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 hidden">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Time Range</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setTimeRange("day")}
            className={`px-4 py-2 rounded ${
              timeRange === "day"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setTimeRange("week")}
            className={`px-4 py-2 rounded ${
              timeRange === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-4 py-2 rounded ${
              timeRange === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`px-4 py-2 rounded ${
              timeRange === "year"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Year
          </button>
        </div>
      </div>
    </div>
  );
}
