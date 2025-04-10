import React, { useEffect, useState } from "react";

export default function Settings() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    street: "",
    town: "",
    county: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend API URL from environment variables

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/user`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        let temp = await response.json();
        let userData = temp.user;
        let addressData = temp.address;
        console.log({ userData });
        setUser((prevUser) => ({
          ...prevUser,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          street: addressData?.street || "",
          town: addressData?.town || "",
          county: addressData?.county || "",
        }));
      } catch (error) {
        setError("Failed to load user data");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit function triggered");

    if (user.newPassword && user.newPassword !== user.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    const updatedUserData = {
      name: user.name,
      phoneNumber: user.phoneNumber,
      street: user.street,
      town: user.town,
      email: user.email,
      county: user.county,
      newPassword: user.newPassword,
    };
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUserData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      alert("Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile");
      console.log(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 bg-gray-100 px-2 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 bg-gray-100 px-2 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={user.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 bg-gray-100 px-2 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={user.street}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 bg-gray-100 px-2 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Town
                  </label>
                  <input
                    type="text"
                    name="town"
                    value={user.town}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 bg-gray-100 px-2 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    County
                  </label>
                  <input
                    type="text"
                    name="county"
                    value={user.county}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 bg-gray-100 px-2 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={user.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 bg-gray-100 px-2 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 bg-gray-100 px-2 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
