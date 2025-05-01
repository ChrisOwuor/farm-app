import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

const WithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [systemBalance, setSystemBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [selectedWithdrawalData, setSelectedWithdrawalData] = useState(null);

  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/withdrawals/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setWithdrawals(res.data.withdrawals);
      setSystemBalance(res.data.systemBalance || 0);
      setLoading(false);
    } catch (err) {
      setError("Failed to load withdrawals");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleActionClick = (withdrawal, action) => {
    setSelectedWithdrawal(withdrawal._id);
    setSelectedWithdrawalData(withdrawal);
    setSelectedAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/withdrawals/update-status`,
        {
          withdrawalId: selectedWithdrawal,
          action: selectedAction,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Withdrawal status updated:", res.data);
      setShowModal(false);
      fetchWithdrawals(); // Refresh data after action
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      setShowModal(false);
    }
  };

  const cancelAction = () => {
    setShowModal(false);
    setSelectedAction(null);
    setSelectedWithdrawal(null);
    setSelectedWithdrawalData(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={14} className="mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={14} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={14} className="mr-1" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading withdrawals...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <AlertTriangle size={24} className="text-red-500 mr-3" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Withdrawal Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage farmer withdrawal requests
          </p>
        </div>
      </div>

      {/* System Balance Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center">
          <div className="bg-white bg-opacity-25 rounded-full p-3 mr-4">
            <Wallet size={28} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">System Balance</p>
            <h3 className="text-white text-2xl font-bold">
              Ksh {systemBalance.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 m-4">
            <div className="flex items-center justify-center mb-4">
              {selectedAction === "approve" ? (
                <div className="bg-green-100 rounded-full p-2">
                  <CheckCircle size={28} className="text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 rounded-full p-2">
                  <XCircle size={28} className="text-red-600" />
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              {selectedAction === "approve"
                ? "Approve Withdrawal"
                : "Reject Withdrawal"}
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Farmer:</span>
                <span className="font-medium">
                  {selectedWithdrawalData?.farmer?.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Amount:</span>
                <span className="font-medium">
                  Ksh {selectedWithdrawalData?.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-6 text-center">
              {selectedAction === "approve"
                ? "Are you sure you want to approve this withdrawal request? This will initiate the payment process."
                : "Are you sure you want to reject this withdrawal request? This action cannot be undone."}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelAction}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  selectedAction === "approve"
                    ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                }`}
              >
                {selectedAction === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawals List */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">
            Withdrawal Requests
          </h3>
        </div>

        {withdrawals.length === 0 ? (
          <div className="text-center p-12">
            <Wallet className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No withdrawal requests
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no pending withdrawal requests at this time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Farmer Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawals.map((withdrawal, index) => (
                  <tr key={withdrawal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <User size={14} className="text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {withdrawal.farmer?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Mail size={14} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">
                            {withdrawal.farmer?.email || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone size={14} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">
                            {withdrawal.farmer?.phoneNumber || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          Ksh {withdrawal.amount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(withdrawal.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                          <br />
                          {new Date(withdrawal.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleActionClick(withdrawal, "approve")
                          }
                          disabled={withdrawal.status === "approved"}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                            withdrawal.status === "approved"
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleActionClick(withdrawal, "reject")
                          }
                          disabled={withdrawal.status === "rejected"}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                            withdrawal.status === "rejected"
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          <XCircle size={14} className="mr-1" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalsPage;
