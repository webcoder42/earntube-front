import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../../Componet/Spinner";
import AdminComponent from "./../../Componet/Layout/AdminComponent";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [referralDetails, setReferralDetails] = useState([]);
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralError, setReferralError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [adDetails, setAdDetails] = useState({}); // State for ad details of the selected user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/users/all-user"
        );
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filteredUsers with all users
      } catch (error) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (userId) => {
    setReferralLoading(true);
    setSelectedUser(userId); // Set the selected user ID

    try {
      // Fetch ad details

      const response = await axios.get(
        `https://earning-site-fll-backend-code.onrender.com/api/v1/users/referrals/details/${userId}`
      );
      setReferralDetails(response.data.referralDetails);
    } catch (error) {
      setReferralError("Error fetching referral details");
    } finally {
      setReferralLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users); // Reset to all users if search query is empty
    } else {
      const filtered = users.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminComponent />
          </div>
          <div className="col-md-9">
            <div className="">
              <div className="card-header bg-dark text-white">
                <h1>All Users</h1>
              </div>

              {/* Search Bar */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>

              {error ? (
                <p>{error}</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Available Earnings</th>
                        <th>Total Earnings</th>
                        <th>Total Referrals</th>
                        <th>Total Ads Watched</th>
                        <th>Total Earnings from Ads</th>
                        <th>Referred By</th>
                        <th>Account Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                          <tr
                            key={user._id}
                            onClick={() => handleUserClick(user._id)}
                            style={{ cursor: "pointer" }}
                          >
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.earnings} Rs</td>
                            <td>{user.TotalEarnings} Rs</td>
                            <td>{user.totalReferred || 0}</td>
                            <td>{adDetails.totalAdsWatched || 0}</td>
                            <td>{adDetails.totalEarnings || 0} Rs</td>
                            <td>{user.referredBy || "N/A"}</td>
                            <td>
                              <select value={user.accountStatus} readOnly>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="banned">Banned</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10">No users found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selectedUser && (
              <div className="card mt-3 p-3">
                <div className="card-header bg-dark text-white">
                  <h3>Referral Details</h3>
                </div>
                {referralLoading ? (
                  <p>Loading referral details...</p>
                ) : referralError ? (
                  <p>{referralError}</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Package Name</th>
                          <th>Package Status</th>
                          <th>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referralDetails.length > 0 ? (
                          referralDetails.map((referral, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{referral.username}</td>
                              <td>{referral.email}</td>
                              <td>{referral.packageName || "N/A"}</td>
                              <td>{referral.packageStatus || "N/A"}</td>
                              <td>
                                {new Date(
                                  referral.createdAt
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6">No referral details available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllUser;
