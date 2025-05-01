import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  HelpCircle,
  Mail,
  User,
  MessageSquare,
  Tag,
  CheckCircle,
  Clock,
  Search,
  Calendar,
  AlertTriangle,
  EyeIcon,
  Loader,
} from "lucide-react";

const HelpRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchHelpRequests();
  }, []);

  const fetchHelpRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/help`
      );
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load help requests.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, event) => {
    event.stopPropagation();
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/help/${id}/read`
      );
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "read" } : r))
      );
      // If the request being marked as read is currently selected, update the selectedRequest too
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest({ ...selectedRequest, status: "read" });
      }
    } catch (err) {
      alert("Failed to mark as read.");
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  const toggleExpandMessage = (id) => {
    if (expandedMessage === id) {
      setExpandedMessage(null);
    } else {
      setExpandedMessage(id);
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl  overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                <HelpCircle size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Help Requests</h1>
                <p className="text-blue-100 mt-1">
                  Manage user support tickets
                </p>
              </div>
            </div>
            =
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <Loader size={36} className="text-blue-500 animate-spin" />
                <p className="mt-4 text-gray-600 font-medium">
                  Loading help requests...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle size={48} className="mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No help requests found
              </h3>
              <p className="mt-1 text-gray-500">
                There are currently no help requests in the system.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredRequests.length} of {requests.length}{" "}
                  requests
                </div>
                <div className="flex space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock size={12} className="mr-1" />
                    Unread: {requests.filter((r) => r.status !== "read").length}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    Read: {requests.filter((r) => r.status === "read").length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Requester
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Subject
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Message
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
                    {filteredRequests.map((req, index) => (
                      <tr
                        key={req._id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          req.status !== "read" ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleViewDetails(req)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <User size={14} className="text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                {req.name}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Mail size={14} className="text-gray-400 mr-1" />
                              <span className="text-sm text-gray-500">
                                {req.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Tag size={14} className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {req.subject}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <MessageSquare
                              size={14}
                              className="text-gray-400 mr-1 mt-1 flex-shrink-0"
                            />
                            <div className="text-sm text-gray-500">
                              {expandedMessage === req._id ? (
                                <div>
                                  {req.message}
                                  <button
                                    className="ml-2 text-blue-500 hover:text-blue-700 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleExpandMessage(req._id);
                                    }}
                                  >
                                    Show Less
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  {req.message.length > 50 ? (
                                    <>
                                      {req.message.slice(0, 50)}...
                                      <button
                                        className="ml-2 text-blue-500 hover:text-blue-700 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleExpandMessage(req._id);
                                        }}
                                      >
                                        Show More
                                      </button>
                                    </>
                                  ) : (
                                    req.message
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {req.status === "read" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              Read
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock size={12} className="mr-1" />
                              Unread
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar
                              size={14}
                              className="text-gray-400 mr-1"
                            />
                            <span className="text-sm text-gray-500">
                              {new Date(req.createdAt).toLocaleDateString()}
                              <br />
                              {new Date(req.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => markAsRead(req._id, e)}
                              disabled={req.status === "read"}
                              className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                req.status === "read"
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              <EyeIcon size={14} className="mr-1" />
                              Mark Read
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <HelpCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      Help Request Details
                    </h3>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-500">
                          Name
                        </div>
                        <div className="text-sm">{selectedRequest.name}</div>
                      </div>
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-500">
                          Email
                        </div>
                        <div className="text-sm">{selectedRequest.email}</div>
                      </div>
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-500">
                          Subject
                        </div>
                        <div className="text-sm font-medium">
                          {selectedRequest.subject}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-500">
                          Status
                        </div>
                        <div className="mt-1">
                          {selectedRequest.status === "read" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              Read
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock size={12} className="mr-1" />
                              Unread
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-500">
                          Date
                        </div>
                        <div className="text-sm">
                          {new Date(selectedRequest.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">
                        Message
                      </div>
                      <div className="mt-2 bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                        {selectedRequest.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedRequest.status !== "read" && (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() =>
                      markAsRead(selectedRequest._id, {
                        stopPropagation: () => {},
                      })
                    }
                  >
                    <EyeIcon size={16} className="mr-1" />
                    Mark as Read
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDetailsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpRequestsPage;
