import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { categories } from "../constants/Products";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  ShoppingCartIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Products() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 8; // Number of products per page
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoverProduct, setHoverProduct] = useState(null);
  const { user } = useAuth();
  const observer = useRef();

  const fetchProducts = async (pageNum = 1, reset = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/products?page=${pageNum}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();

      if (reset) {
        setAllProducts(data.products);
      } else {
        setAllProducts((prev) => [...prev, ...data.products]);
      }

      // Check if we've reached the end
      setHasMore(data.products.length === limit);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts(1, true);
  }, []);

  // Reset and fetch when category changes
  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [selectedCategory]);

  const filteredProducts = allProducts.filter((product) => {
    const categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory;
    return categoryMatch;
  });

  // Set up the intersection observer for infinite scrolling
  const lastProductElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
          fetchProducts(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, page]
  );

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

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ToastContainer />

      {/* Sidebar - fixed position */}
      <div
        className={`fixed z-30 h-full bg-white shadow-xl transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64 left-0" : "w-0 -left-64"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-green-600">Categories</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="space-y-1 flex-1 p-4 overflow-y-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`group flex items-center w-full rounded-md px-4 py-3 text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group flex items-center w-full rounded-md px-4 py-3 text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area - adjusts based on sidebar state */}
      <div
        className={`flex flex-col overflow-hidden flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex h-16 items-center justify-between bg-white px-4 shadow-sm">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Open sidebar"
              >
                <AdjustmentsHorizontalIcon className="h-6 w-6 text-green-600" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedCategory === "all"
                ? "All Products"
                : categories.find((c) => c.id === selectedCategory)?.name ||
                  "Products"}
            </h2>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <span className="text-sm text-gray-600">Welcome back,</span>
                <span className="ml-1 font-medium text-green-600">
                  {user.name}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          )}
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto pb-8">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-l-2 border-green-600"></div>
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="text-3xl text-gray-400 mb-4">
                No products found
              </div>
              <p className="text-gray-500">
                Try selecting a different category or check back later.
              </p>
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <div className="grid px-4 sm:px-6 py-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => {
                // Apply ref to last element for infinite scroll
                const isLastElement = index === filteredProducts.length - 1;
                return (
                  <Link
                    ref={isLastElement ? lastProductElementRef : null}
                    to={`/products/${product._id}`}
                    key={product._id}
                    className="group relative rounded-xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onMouseEnter={() => setHoverProduct(product._id)}
                    onMouseLeave={() => setHoverProduct(null)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${
                          product.image
                        }`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div
                      className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 
                      ${hoverProduct === product._id ? "opacity-20" : ""}`}
                    ></div>
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {categories.find((c) => c.id === product.category)
                            ?.name || product.category}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold line-clamp-1 mb-2 text-gray-800">
                        {product.name}
                      </h2>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-600">
                          Ksh {product.price.toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="flex items-center bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                          aria-label="Add to cart"
                        >
                          <ShoppingCartIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Loading indicator for infinite scroll */}
          {loadingMore && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-green-600"></div>
            </div>
          )}

          {/* End of results message */}
          {!hasMore && allProducts.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              No more products to load
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
