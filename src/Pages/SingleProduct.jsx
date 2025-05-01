import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ToastContainer } from "react-toastify";

// This would typically come from an API or database

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  React.useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/${product.image}`}
            alt={product.name}
            className="w-full h-[500px] object-cover"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-green-600 mb-4">
            Ksh {product.price}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Product Category</h2>
            <p className="text-gray-600">{product.category}</p>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="number"
              min={quantity}
              defaultValue={quantity}
              className="w-20 px-3 py-2 border rounded"
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button
              onClick={() => {
                addToCart(product, quantity);
              }}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
