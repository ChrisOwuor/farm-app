import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categories } from "../constants/Products";
  import {  ToastContainer } from "react-toastify";

import {
  UsersIcon,
  ChartBarIcon,
  CubeIcon,
  HomeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Products () {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of products per page
  const [allProducts, setAllProducts] = useState([]);
  const { addToCart } = useCart();

  const fetchProducts = async (page = 1) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/products?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();

      setAllProducts(data.products);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch products when the component mounts or page changes
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  const filteredProducts = allProducts.filter((product) => {
    const categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory;

    return categoryMatch;
  });
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call it initially to set the correct state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="h-screen">
      <ToastContainer />
      <div className="flex ">
        {/* Sidebar */}
        <div
          className={`absolute sm:relative lg:relative h-screen transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-0 hidden"
          }`}
        >
          <div className="bg-white h-screen">
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Categories</h1>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-1 flex-1 p-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group flex items-center w-full rounded-md px-3 py-2 text-sm font-medium ${
                    selectedCategory === category.id
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1   overflow-y-auto h-full  ">
          <div className="flex h-16 items-center justify-between bg-white px-4 shadow-sm">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-1 rounded-md hover:bg-gray-100 ${
                isSidebarOpen ? "hidden" : "block"
              }`}
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </button>

            {user !== null && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Welcome back {user.name}
                </span>
              </div>
            )}
          </div>
          <div className="grid px-6 py-8 grid-cols-1 mb-12 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                to={`/products/${product._id}`}
                key={product.id}
                className="rounded-lg s overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover cursor-pointer"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      Ksh {product.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, 1);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-white py-4  shadow-md">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-lg font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
