import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("type") || "buyer";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "+254",
    role: userType,
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          errorMessage = `${
            name === "firstName" ? "First" : "Last"
          } name is required.`;
        } else if (/\d/.test(value)) {
          errorMessage = `${
            name === "firstName" ? "First" : "Last"
          } name should not contain numbers.`;
        }
        break;
      case "phoneNumber":
        if (!value.trim()) {
          errorMessage = "Phone number is required.";
        } else if (!value.startsWith("+254")) {
          errorMessage = "Phone number must start with +254.";
        } else if (value.length !== 13) {
          errorMessage = "Please enter 9 digits after +254.";
        } else if (!/^\+254\d{9}$/.test(value)) {
          errorMessage = "Phone number must contain only digits after +254.";
        }
        break;
      case "email":
        if (!value.trim()) {
          errorMessage = "Email address is required.";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = "Please enter a valid email address.";
          }
        }
        break;
      case "password":
        if (!value) {
          errorMessage = "Password is required.";
        } else if (value.length < 6) {
          errorMessage = "Password must be at least 6 characters long.";
        }
        break;
      case "confirmPassword":
        if (!value) {
          errorMessage = "Please confirm your password.";
        } else if (value !== formData.password) {
          errorMessage = "Passwords do not match.";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number to maintain the +254 prefix
    if (name === "phoneNumber") {
      // If user tries to delete the +254 prefix, prevent it
      if (!value.startsWith("+254")) {
        return;
      }

      // Limit to +254 plus 9 digits
      if (value.length > 13) {
        return;
      }

      // Only allow digits after +254
      if (value.length > 4 && !/^\+254\d*$/.test(value)) {
        return;
      }
    }

    // Prevent numbers in name fields
    if ((name === "firstName" || name === "lastName") && /\d/.test(value)) {
      setFieldErrors({
        ...fieldErrors,
        [name]: `${
          name === "firstName" ? "First" : "Last"
        } name should not contain numbers.`,
      });
      return;
    }

    const errorMessage = validateField(name, value);

    setFieldErrors({
      ...fieldErrors,
      [name]: errorMessage,
    });

    setFormData({
      ...formData,
      [name]: value,
    });

    // If updating password, also validate confirmPassword
    if (name === "password" && formData.confirmPassword) {
      const confirmPasswordError =
        formData.confirmPassword !== value ? "Passwords do not match." : "";
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: confirmPasswordError,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    let hasErrors = false;
    const newFieldErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "role") {
        const errorMessage = validateField(key, value);
        newFieldErrors[key] = errorMessage;
        if (errorMessage) {
          hasErrors = true;
        }
      }
    });

    setFieldErrors(newFieldErrors);

    if (hasErrors) {
      setError("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Create the request body with combined name
      const requestBody = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success(data.message || "Account created successfully!", {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    } catch (err) {
      toast.error(
        err.message || "Failed to create account. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/auth/login"
            className="font-medium text-green-600 hover:text-green-500"
          >
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={`appearance-none block w-full px-3 py-2 border ${
                      fieldErrors.firstName
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="John"
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={`appearance-none block w-full px-3 py-2 border ${
                      fieldErrors.lastName
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="Doe"
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    fieldErrors.phoneNumber
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  placeholder="+254700000000"
                />
                {fieldErrors.phoneNumber ? (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.phoneNumber}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    Format: +254 followed by 9 digits
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    fieldErrors.email ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  placeholder="example@email.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    fieldErrors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  placeholder="Min 6 characters"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    fieldErrors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  placeholder="Confirm your password"
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
