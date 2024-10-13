import React, { useState } from "react";
import axios from "axios";
import AdminComponent from "../../Componet/Layout/AdminComponent";

function UserAdsInteraction() {
  const [email, setEmail] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setUserDetails(null);

    try {
      const response = await axios.get(
        `https://earning-site-fll-backend-code.onrender.com/api/v1/ads/admin-get?email=${email}`
      );
      setUserDetails(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching user details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminComponent />
      <h1>User Ads Interaction</h1>
      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {userDetails && (
        <div>
          <h2>User Details</h2>
          <p>
            <strong>Username:</strong> {userDetails.user.username}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.user.email}
          </p>
          <p>
            <strong>Total Ads Watched:</strong> {userDetails.totalAdsWatched}
          </p>
          <p>
            <strong>Total Earnings:</strong> {userDetails.totalEarnings}
          </p>

          <h3>Ad Details</h3>
          <ul>
            {userDetails.adDetails.map((ad) => (
              <li key={ad.adId}>
                <strong>Ad ID:</strong> {ad.adId} -
                <strong> Viewed Seconds:</strong> {ad.viewedSeconds} -
                <strong> Earned Amount:</strong> {ad.earnedAmount} -
                <strong> Viewed Date:</strong>{" "}
                {new Date(ad.viewedDate).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserAdsInteraction;
