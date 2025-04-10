import React, { useState } from "react";

export default function Payment() {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  // Mock data for transaction history
  const transactions = [
    {
      id: "TRX001",
      date: "2024-03-15",
      type: "Withdrawal",
      amount: 500.0,
      status: "Completed",
      bankAccount: "****1234",
    },
    {
      id: "TRX002",
      date: "2024-03-10",
      type: "Sale",
      amount: 250.0,
      status: "Completed",
      bankAccount: "****1234",
    },
    {
      id: "TRX003",
      date: "2024-03-05",
      type: "Withdrawal",
      amount: 1000.0,
      status: "Processing",
      bankAccount: "****1234",
    },
  ];

  // Mock data for bank accounts
  const bankAccounts = [
    { id: "bank1", name: "Bank of America", last4: "1234" },
    { id: "bank2", name: "Chase", last4: "5678" },
    { id: "bank3", name: "Wells Fargo", last4: "9012" },
  ];

  const handleWithdrawal = (e) => {
    e.preventDefault();
    // Handle withdrawal logic here
    console.log("Withdrawal request:", {
      amount: withdrawalAmount,
      bank: selectedBank,
    });
  };

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
                Available Balance
              </label>
              <p className="text-2xl font-bold text-green-600">$2,750.00</p>
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
                max="2750"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Bank Account
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 bg-gray-100 px-2 focus:border-green-500 focus:ring-green-500"
                required
              >
                <option value="">Select a bank account</option>
                {bankAccounts.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name} (****{bank.last4})
                  </option>
                ))}
              </select>
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
          <h2 className="text-xl font-semibold mb-6">Transaction History</h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {transaction.type === "Withdrawal"
                        ? "Withdrawal"
                        : "Sale"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.date} • {transaction.bankAccount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transaction.type === "Withdrawal"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.type === "Withdrawal" ? "-" : "+"}$
                      {transaction.amount.toFixed(2)}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
