import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Payment() {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [farmerAccount, setFarmerAccount] = useState(null); // Store farmer's account data
  const [transactions, setTransactions] = useState([]); // Store transaction data
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // To handle loading state

  // Fetch farmer account data
  useEffect(() => {
    const fetchFarmerAccount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/farmer/account`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you're using JWT for authentication
            },
          }
        );
        setFarmerAccount(response.data);
        setTransactions(response.data.withdrawals);
        setLoading(false); // Done loading
      } catch (error) {
        console.error("Error fetching farmer account:", error);
        setLoading(false);
      }
    };

    fetchFarmerAccount();
  }, []);

  // Handle withdrawal request
  const handleWithdrawal = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/withdrawals/request`,
        {
          farmerId: user._id, // Assuming you have the farmer's ID in the user object
          amount: withdrawalAmount, // assumes you have `withdrawalAmount` state
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        // Handle successful withdrawal request
        // Update available earnings in the state
        alert("Withdrawal request successful!");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show a loading state
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-8">Farmer Payments</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Withdrawal Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Request Withdrawal</h2>
          <form onSubmit={handleWithdrawal} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Earnings
              </label>
              <p className="text-2xl font-bold text-green-600">
                Ksh {farmerAccount.totalEarnings.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Earnings
              </label>
              <p className="text-2xl font-bold text-purple-600">
                Ksh {farmerAccount.availableEarnings.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pending Earnings
              </label>
              <p className="text-xl font-bold text-yellow-600">
                Ksh {farmerAccount.pendingEarnings.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid Earnings
              </label>
              <p className="text-xl font-bold text-blue-600">
                Ksh {farmerAccount.paidEarnings.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount
              </label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 bg-gray-100 px-2 focus:border-green-500 focus:ring-green-500"
                placeholder="Enter amount"
                min="1"
                max={farmerAccount.availableEarnings}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Request Withdrawal
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Withdrawal History</h2>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Withdrawal</p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          transaction.status === "approved"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        - Ksh {transaction.amount.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No withdrawals available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
