import React from "react";

import { useEffect, useState } from "react";

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Adding the authorization header
            },
          }
        );
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="w-full px-3 ">
                {userInfo ? userInfo?.user.name : "Loading..."}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="w-full px-3 ">
                {userInfo ? userInfo?.user.email : "Loading..."}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="w-full px-3 ">
                {userInfo ? userInfo?.user.phoneNumber : "Loading..."}
              </div>
            </div>
          </div>
        </div>

        {userInfo?.addressAvailable ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <div className="w-full px-3 ">
                  {userInfo ? userInfo.address.street : "Loading..."}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Town
                  </label>
                  <div className="w-full px-3 ">
                    {userInfo ? userInfo.address.town : "Loading..."}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    County
                  </label>
                  <div className="w-full px-3 ">
                    {userInfo ? userInfo.address.county : "Loading..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <p>No address Available</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Account Security</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="w-full px-3 ">••••••••</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
