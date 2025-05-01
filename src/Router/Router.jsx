import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Home from "../Pages/Home";
import Hero from "../Pages/Hero";
import Navbar from "../components/Navbar";
import Profile from "../pages/Profile";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import SingleProduct from "../pages/SingleProduct";
import Products from "../Pages/Products";
import Settings from "../pages/Settings";
import Orders from "../pages/Orders";
import Payment from "../pages/Payment";
import AddProduct from "../pages/AddProduct";
import MyProducts from "../pages/MyProducts";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import SalesReport from "../pages/admin/SalesReport";
import InventoryReport from "../pages/admin/InventoryReport";
import UserType from "../pages/auth/UserType";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ProtectedRoute from "../components/ProtectedRoute";
import OrdersFarmer from "../Pages/OrdersFarmer";
import Reports from "../Pages/admin/Reports";
import HelpRequestsPage from "../Pages/HelpRequestsPage";
import WithdrawalsPage from "../Pages/Withdrawals";
import AllOrders from "../Pages/AllOrders";

export default function Router() {
  return (
    <AuthProvider>
      <CartProvider>
        <div>
          <Navbar />
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/user-type" element={<UserType />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />

            {/* Main Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/farmer" element={<OrdersFarmer />} />
            <Route path="/help" element={<HelpRequestsPage />} />
            <Route path="/farmer/withdrawal" element={<WithdrawalsPage />} />
            <Route path="/all/orders" element={<AllOrders/>} />

            <Route path="/payment" element={<Payment />} />
            <Route
              path="/add-product"
              element={
                <ProtectedRoute allowedRoles={["farmer"]}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route path="/my-products" element={<MyProducts />} />

            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              {" "}
              <Route path="reports" element={<Reports />} />{" "}
              <Route index element={<Users />} />
              <Route path="users" element={<Users />} />
              <Route path="sales" element={<SalesReport />} />
              <Route path="inventory" element={<InventoryReport />} />
            </Route>
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
