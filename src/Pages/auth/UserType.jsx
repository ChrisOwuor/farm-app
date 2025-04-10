import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCartIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function UserType() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to FarmApp
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose how you want to use our platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Buyer Option */}
            <button
              onClick={() => navigate("/auth/signup?type=buyer")}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />I want to buy
              products
            </button>

            {/* Seller Option */}
            <button
              onClick={() => navigate("/auth/signup?type=farmer")}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserGroupIcon className="h-5 w-5 mr-2" />I want to sell products
            </button>
            {/* Seller Option */}
            <button
              onClick={() => navigate("/auth/signup?type=admin")}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Admin
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate("/auth/login")}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                I already have an account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
