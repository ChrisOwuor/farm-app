import React from "react";
import { Link } from "react-router-dom";
import HelpRequestForm from "../components/HelpRequestForm";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative z-10">
        <div className="absolute inset-0 ">
          <img
            className="h-full w-full object-cover "
            src="/public/bg.jpg"
            alt="Farm landscape"
          />
          <div className="absolute inset-0 bg-gray-900/50 z-0" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Fresh From Our Farm
          </h1>
          <p className="mt-6 max-w-lg text-xl text-white">
            Discover fresh, organic produce delivered straight from our local
            farm to your table.
          </p>
          <div className="mt-10">
            <Link
              to="/products"
              className="inline-block rounded-md border border-transparent bg-gray-600 px-8 py-3 text-center font-medium text-white hover:bg-green-700"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <HelpRequestForm />
      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Organic Produce
              </h3>
              <p className="mt-2 text-base text-gray-500">
                All our products are grown using organic farming methods
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Local Delivery
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Fresh delivery to your doorstep within 24 hours
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Quality Guaranteed
              </h3>
              <p className="mt-2 text-base text-gray-500">
                100% satisfaction guarantee on all products
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
