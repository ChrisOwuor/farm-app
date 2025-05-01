import React, { useState, useEffect } from "react";
import axios from "axios";

export default function InventoryReport() {
  const [data, setData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/reports/all`
        );
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Loading inventory...
        </h3>
      </div>
    );
  }

  const filteredProducts =
    selectedCategory === "all"
      ? data.allProducts
      : data.allProducts.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Report</h1>
        <p className="text-sm text-gray-500">
          Comprehensive view of your inventory data
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-4 rounded shadow">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Filter by Category
        </label>
        <select
          className="w-full border-gray-300 rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {data.productsPerCategory.map((cat) => (
            <option key={cat._id} value={cat.category}>
              {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)} (
              {cat.totalProducts})
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Farmer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Ksh {item.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.farmerId?.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products per Farmer */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Inventory Summary by Farmer
        </h3>
        <ul className="space-y-2">
          {data.productsPerFarmer.map((farmer) => (
            <li key={farmer._id} className="flex justify-between">
              <span>{farmer.farmerName}</span>
              <span>
                {farmer.totalProducts} products, Total Stock:{" "}
                {farmer.totalStock}, Value: Ksh {farmer.totalValue}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Products per Category */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Inventory Summary by Category
        </h3>
        <ul className="space-y-2">
          {data.productsPerCategory.map((cat) => (
            <li key={cat._id} className="flex justify-between">
              <span>{cat.category}</span>
              <span>
                {cat.totalProducts} products, Stock: {cat.totalStock}, Value:
                Ksh {cat.totalValue}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Total Value per Farmer */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Total Inventory Value per Farmer
        </h3>
        <ul className="space-y-2">
          {data.totalInventoryPerFarmer.map((entry) => (
            <li key={entry._id} className="flex justify-between">
              <span>{entry.farmerName}</span>
              <span>Ksh {entry.totalValue}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
