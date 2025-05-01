import React, { useState, useEffect } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const reportTypes = [
    { id: "sales", name: "Sales Report" },
    { id: "user_activity", name: "User Activity Report" },
    { id: "inventory", name: "Inventory Report" },
  ];

  const getReportEndpoint = (reportType) => {
    const base = `${import.meta.env.VITE_BACKEND_URL}`;

    switch (reportType) {
      case "sales":
        return `${base}/api/orders/sales/pdf`;
      case "user_activity":
        return `${base}/api/users/download/pdf`;
      case "inventory":
        return `${base}/api/products/reports/download`;
      default:
        return `${base}/api/orders/sales/pdf`; 
    }
  };
 ;

  useEffect(() => {
    if (!startDate || !endDate) {
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      setStartDate(lastMonth.toISOString().split("T")[0]);
      setEndDate(today.toISOString().split("T")[0]);
    }
  }, [startDate, endDate]);

  const handlePreviewReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/reports/${reportType}?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) throw new Error("Failed to fetch report data");
      const data = await response.json();
      setPreviewData({
        type: reportType,
        dateRange: `${startDate} to ${endDate}`,
        summary: `${
          reportType.charAt(0).toUpperCase() + reportType.slice(1)
        } report for selected period`,
        sampleData: data.sampleData,
      });
    } catch (err) {
      console.error(err);
      alert("Error generating preview.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(getReportEndpoint(reportType), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          reportType: reportType,
          startDate: startDate,
          endDate: endDate,
        }),
      });
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportType}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download report.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-600" />
          Generate Reports
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
          {/* Report Configuration Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Report Configuration
            </h3>

            {/* Report Type Selection */}
            <div className="mb-4">
              <label
                htmlFor="report-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Report Type
              </label>
              <select
                id="report-type"
                name="report-type"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                {reportTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Selection */}
            <div className="mb-6">
              <p className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="start-date"
                    className="block text-xs text-gray-500"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    name="start-date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="end-date"
                    className="block text-xs text-gray-500"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    name="end-date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {/* <button
                type="button"
                className="flex-1 inline-flex justify-center items-center rounded-md border border-transparent px-4 py-2 bg-blue-600 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handlePreviewReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                Preview Report
              </button> */}
              <button
                type="button"
                className="flex-1 inline-flex justify-center items-center rounded-md border border-transparent px-4 py-2 bg-green-600 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={handleDownloadReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                Download Report
              </button>
            </div>
          </div>

          {/* Report Preview Section */}
          {/* <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Report Preview
            </h3>

            {previewData ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {reportTypes.find((r) => r.id === previewData.type)?.name}
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Period: {previewData.dateRange}
                  </p>
                  <p className="text-sm text-gray-700">{previewData.summary}</p>

                  <div className="mt-4 overflow-x-auto">
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
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewData.sampleData.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${item.value.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No report preview available.
              </p>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
