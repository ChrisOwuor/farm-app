import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  UsersIcon,
  ChartBarIcon,
  CubeIcon,
  HomeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: "Users", href: "/dashboard/users", icon: UsersIcon },
    { name: "Sales Report", href: "/dashboard/sales", icon: ChartBarIcon },
    { name: "Inventory", href: "/dashboard/inventory", icon: CubeIcon },
    { name: "Reports", href: "/dashboard/reports", icon: DocumentTextIcon }, // New Reports navigation item
  ];

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
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <div
        className={`lg:relative sm:relative absolute h-screen bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0 hidden"
        }`}
      >
        {/* Sidebar Content */}
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      isActive
                        ? "text-gray-900"
                        : "text-gray-400 group-hover:text-gray-900"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile Section */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between bg-white px-4 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-1 rounded-md hover:bg-gray-100 ${
              isSidebarOpen ? "hidden" : "block"
            }`}
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Welcome back, Admin</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
