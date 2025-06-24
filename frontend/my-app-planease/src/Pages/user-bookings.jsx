import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Components/AuthProvider";
import { AlertCircle, CheckCircle, Clock, Calendar, ChevronLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState({
    pending: [],
    ongoing: [],
    completed: [],
    cancelled: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all, pending, ongoing, completed
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);

  // Check for authentication and redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated && isAuthenticated !== undefined) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Get user email from auth context only
  useEffect(() => {
    console.log("User Bookings Page - User state:", user);
    
    if (user?.email) {
      console.log("User Bookings Page - User email found from context:", user.email);
      setUserEmail(user.email);
    } else {
      // If no user in context but we're authenticated, try to get email from local storage token
      if (isAuthenticated && localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        // Use a fallback if you can access the token directly
        console.log("User Bookings Page - Trying to fetch user data directly");
        
        // Make a direct API call to get user info
        axios.get("http://localhost:8080/user/getuser", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          console.log("User data fetched directly:", response.data);
          if (response.data?.email) {
            setUserEmail(response.data.email);
          }
        })
        .catch(error => {
          console.log("Failed to fetch user data directly:", error);
        });
      } else {
        console.log("User Bookings Page - No user email available in auth context");
      }
    }
  }, [user, isAuthenticated]);
  
  // Fetch bookings once we have the email
  useEffect(() => {
    if (userEmail) {
      console.log("User Bookings Page - Fetching with email:", userEmail);
      const token = localStorage.getItem("token");
      console.log("User Bookings Page - Token exists:", !!token);
      fetchUserBookings(token, userEmail);
    }
  }, [userEmail]);

  const fetchUserBookings = async (token, email) => {
    setLoading(true);
    try {
      console.log("User Bookings Page - Fetching bookings for email:", email);
      
      const apiUrl = `${API_BASE_URL}/api/transactions/getAllUserTransactionsByEmail/${email}`;
      console.log("User Bookings Page - API URL:", apiUrl);
      console.log("User Bookings Page - Using token:", token?.substring(0, 10) + "...");
      
      // Ensure headers are properly set for the request
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      // Use the correct API endpoint for fetching user transactions
      console.log("User Bookings Page - About to make API call with headers:", headers);
      const response = await axios.get(apiUrl, { headers });
      
      console.log("User Bookings Page - API response received:", response.status);
      console.log("User Bookings Page - API response data:", response.data);
      
      // Categorize bookings by status
      const transactions = response.data || [];
      console.log("User Bookings Page - Total transactions found:", transactions.length);
      
      // The backend is filtering out PENDING, CANCELLED, and DECLINED statuses already
      // So we need to categorize what we get, which is only ONGOING and COMPLETED bookings
      
      // Try both casing variations for status field and both field names (status or transactionStatus)
      const ongoingBookings = transactions.filter(transaction => {
        const status = (
          transaction.status?.toUpperCase() || 
          transaction.Status?.toUpperCase() || 
          transaction.transactionStatus?.toUpperCase()
        );
        return status === "ONGOING" || status === "CONFIRMED" || status === "IN_PROGRESS" || status === "PROCESSING";
      });
         
      const completedBookings = transactions.filter(transaction => {
        const status = (
          transaction.status?.toUpperCase() || 
          transaction.Status?.toUpperCase() || 
          transaction.transactionStatus?.toUpperCase()
        );
        return status === "COMPLETED";
      });
      
      // Now we also get PENDING status bookings
      const pendingBookings = transactions.filter(transaction => {
        const status = (
          transaction.status?.toUpperCase() || 
          transaction.Status?.toUpperCase() || 
          transaction.transactionStatus?.toUpperCase()
        );
        return status === "PENDING";
      });
      
      // Get CANCELLED and DECLINED status bookings to show in cancelled tab
      const cancelledBookings = transactions.filter(transaction => {
        const status = (
          transaction.status?.toUpperCase() || 
          transaction.Status?.toUpperCase() || 
          transaction.transactionStatus?.toUpperCase()
        );
        return status === "CANCELLED" || status === "DECLINED";
      });
      
      console.log("User Bookings Page - Pending bookings:", pendingBookings.length);
      console.log("User Bookings Page - Ongoing bookings:", ongoingBookings.length);
      console.log("User Bookings Page - Completed bookings:", completedBookings.length);
      console.log("User Bookings Page - Cancelled bookings:", cancelledBookings.length);
      
      // Log a sample booking to see its structure
      if (transactions.length > 0) {
        console.log("User Bookings Page - Sample booking data structure:", transactions[0]);
        
        // Find the exact status field name used in the backend response
        const statusField = transactions[0].status ? "status" : 
                           transactions[0].Status ? "Status" : 
                           transactions[0].transactionStatus ? "transactionStatus" : "unknown";
        console.log("User Bookings Page - Status field name being used:", statusField);
      } else {
        console.log("User Bookings Page - No transactions returned from backend. Note: Pending, Cancelled, and Declined bookings are filtered out by the backend.");
      }
      
      setBookings({
        pending: pendingBookings,
        ongoing: ongoingBookings,
        completed: completedBookings,
        cancelled: cancelledBookings
      });
      setLoading(false);
    } catch (error) {
      console.error("User Bookings Page - Failed to fetch bookings:", error);
      console.log("User Bookings Page - Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setLoading(false);
    }
  };

  const getDisplayedBookings = () => {
    switch (activeTab) {
      case "pending":
        return bookings.pending;
      case "ongoing":
        return bookings.ongoing;
      case "completed":
        return bookings.completed;
      case "cancelled":
        return bookings.cancelled;
      case "all":
      default:
        return [...bookings.pending, ...bookings.ongoing, ...bookings.completed, ...bookings.cancelled];
    }
  };

  const displayedBookings = getDisplayedBookings();

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Helper to get status badge styles
  const getStatusBadge = (booking) => {
    const status = (
      booking.status?.toUpperCase() || 
      booking.Status?.toUpperCase() || 
      booking.transactionStatus?.toUpperCase() || 
      ""
    );
    
    if (status === "PENDING" || status === "PENDING_PAYMENT") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-600">
          <AlertCircle size={12} />
          {status === "PENDING_PAYMENT" ? "Payment Pending" : "Pending"}
        </span>
      );
    } else if (status === "CONFIRMED" || status === "IN_PROGRESS" || status === "PROCESSING" || status === "ONGOING") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
          <Clock size={12} />
          {status === "CONFIRMED" ? "Confirmed" : status === "IN_PROGRESS" ? "In Progress" : status === "ONGOING" ? "Ongoing" : "Processing"}
        </span>
      );
    } else if (status === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
          <CheckCircle size={12} />
          Completed
        </span>
      );
    } else if (status === "CANCELLED" || status === "DECLINED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
          <AlertCircle size={12} />
          {status === "DECLINED" ? "Declined" : "Cancelled"}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-600">
          {status || "Unknown"}
        </span>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex items-center">
        <Link to="/home" className="text-gray-600 hover:text-blue-600 mr-4">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <Calendar className="mr-2" /> My Bookings
        </h1>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-4 px-1 ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } font-medium flex items-center`}
          >
            All Bookings ({bookings.pending.length + bookings.ongoing.length + bookings.completed.length + bookings.cancelled.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-4 px-1 ${
              activeTab === "pending"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } font-medium flex items-center`}
          >
            Pending ({bookings.pending.length})
          </button>
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`py-4 px-1 ${
              activeTab === "ongoing"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } font-medium flex items-center`}
          >
            <Clock size={16} className="mr-2" /> Ongoing ({bookings.ongoing.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`py-4 px-1 ${
              activeTab === "completed"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } font-medium flex items-center`}
          >
            <CheckCircle size={16} className="mr-2" /> Completed ({bookings.completed.length})
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`py-4 px-1 ${
              activeTab === "cancelled"
                ? "border-b-2 border-red-500 text-red-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } font-medium flex items-center`}
          >
            <AlertCircle size={16} className="mr-2" /> Cancelled ({bookings.cancelled.length})
          </button>
        </nav>
      </div>

      {/* Bookings Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading your bookings...</span>
        </div>
      ) : displayedBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-gray-500">
            {activeTab === "all"
              ? "You don't have any active bookings yet. Note: Pending bookings are not shown here until approved."
              : `You don't have any ${activeTab} bookings.`}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {userEmail ? `Searched for email: ${userEmail}` : "Email not available"}
          </p>
          <div className="mt-6">
            <Link to="/events-dashboard"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Browse Events
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Event Details
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
                  Status
                </th>
              
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                        <Calendar size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.event_name || booking.eventName || 'Unnamed Booking'}
                        </div>
                        <div className="text-sm text-gray-500">
                         
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.transactionDate || booking.date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.time || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;
