import React, { useState, useEffect, useRef } from "react";
import Layout from "../../Componet/Layout/Layout";
import axios from "axios";
import moment from "moment";
import "../../Styles/Ads.css";
import { useAuth } from "../../Context/auth";
import { FaYoutube } from "react-icons/fa";
import toast from "react-hot-toast";
import logo from "../../Assets/sitelogo.png";

const Ads = () => {
  const [auth] = useAuth();

  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0); // For ad's duration
  const [submitTimer, setSubmitTimer] = useState(0); // For submit button visibility
  const [showTimer, setShowTimer] = useState(false);
  const [message, setMessage] = useState("");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalAdsViewed, setTotalAdsViewed] = useState(0);
  const [remainingAds, setRemainingAds] = useState(0);
  const [nextAvailableTime, setNextAvailableTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [earnings, setEarnings] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [isAdWatched, setIsAdWatched] = useState(false);

  const currencySymbol = () => {
    if (!earnings?.currency || earnings.currency === "") {
      return "Rs"; // Default to Rs if currency is null, undefined, or empty
    } else if (earnings.currency === "PKR") {
      return "Rs";
    } else if (earnings.currency === "USD") {
      return "$";
    } else {
      return ""; // Default case for unsupported currencies
    }
  };

  const displayCurrency = currencySymbol();
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/ads/user-ads"
        );
        let availableAds = response.data.ads;

        // Get viewed ads from local storage
        const viewedAds = JSON.parse(localStorage.getItem("viewedAds")) || [];

        // Filter out viewed ads
        availableAds = availableAds.filter((ad) => !viewedAds.includes(ad._id));

        setAds(availableAds);

        if (availableAds.length > 0) {
          const adDuration = availableAds[0].duration;
          setRemainingTime(adDuration);
          setSubmitTimer(adDuration); // Initialize submit timer
          setShowTimer(true);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
        setMessage("Error fetching ads. Please First buy package.");
      }
    };

    fetchAds();
  }, []);
  const fetchsubscriberlink = async () => {
    try {
      const { data } = await axios.get(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/subscribe/get-link"
      );

      // Ensure data.links is an array of objects with a 'link' string property
      if (Array.isArray(data.links)) {
        setContacts(data.links);
      } else {
        toast.error("Unexpected data format");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Something went wrong");
    }
  };

  // Lifecycle method
  useEffect(() => {
    fetchsubscriberlink();
  }, []);
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const earningsResponse = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/ads/user-ads-earnings"
        );
        setTotalEarnings(earningsResponse.data.totalEarnings);

        const statsResponse = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/ads/user-total-ads-viewed"
        );
        const { totalAdsViewed, remainingAdsToday } = statsResponse.data;
        setTotalAdsViewed(totalAdsViewed);
        setRemainingAds(remainingAdsToday);

        // Calculate next available time
        const now = moment();
        const nextAdTime = now.add(24, "hours").startOf("day").toDate();
        setNextAvailableTime(nextAdTime);

        if (remainingAdsToday <= 0) {
          setMessage(
            "You have viewed all ads for today. Please come back tomorrow."
          );
          setShowTimer(false);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, []);

  useEffect(() => {
    const fetchUserEarnings = async () => {
      try {
        const response = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/users/earnings"
        );
        setEarnings(response.data);
      } catch (err) {
        setError("Failed to fetch earnings.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEarnings();
  }, []);

  useEffect(() => {
    if (showTimer && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showTimer, remainingTime]);

  useEffect(() => {
    if (submitTimer > 0) {
      const timer = setInterval(() => {
        setSubmitTimer((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [submitTimer]);

  useEffect(() => {
    const now = moment();
    const lastReset = localStorage.getItem("lastResetDate");
    const today = now.startOf("day").format("YYYY-MM-DD");

    if (lastReset !== today) {
      // Reset viewed ads list
      localStorage.removeItem("viewedAds");
      localStorage.setItem("lastResetDate", today);
    }
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/ads/user-ads"
        );
        let availableAds = response.data.ads;

        // Get viewed ads from local storage
        const viewedAds = JSON.parse(localStorage.getItem("viewedAds")) || [];
        availableAds = availableAds.filter((ad) => !viewedAds.includes(ad._id));

        setAds(availableAds);
        if (availableAds.length > 0) {
          const adDuration = availableAds[0].duration;
          setRemainingTime(adDuration);
          setSubmitTimer(adDuration); // Initialize submit timer
          setShowTimer(true);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
        setMessage("Error fetching ads. Please First buy package.");
      }
    };

    fetchAds();
  }, []);

  // Timer logic
  useEffect(() => {
    if (showTimer && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showTimer, remainingTime]);

  useEffect(() => {
    if (submitTimer > 0) {
      const timer = setInterval(() => {
        setSubmitTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [submitTimer]);

  const handleSubmit = async () => {
    const currentAd = ads[currentAdIndex];

    try {
      await axios.post(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/ads/create-user-ads",
        {
          adId: currentAd._id,
          viewedSeconds: currentAd.duration,
        }
      );

      // Logic for navigating to the next ad...
      if (currentAdIndex < ads.length - 1) {
        const nextIndex = currentAdIndex + 1;
        setCurrentAdIndex(nextIndex);
        setIsAdWatched(false); // Reset ad watched state for next ad
        setRemainingTime(ads[nextIndex].duration);
        setSubmitTimer(ads[nextIndex].duration);
        setShowTimer(true);
      } else {
        setMessage("No more ads available.");
        setShowTimer(false);
      }
    } catch (error) {
      console.error("Error recording ad view:", error);
      setMessage(error.response.data.message || "Error recording ad view.");
    }
  };
  useEffect(() => {
    if (showTimer && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showTimer, remainingTime]);

  useEffect(() => {
    if (submitTimer > 0) {
      const timer = setInterval(() => {
        setSubmitTimer((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [submitTimer]);

  useEffect(() => {
    const fetchUserEarnings = async () => {
      try {
        const response = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/users/earnings"
        );
        setEarnings(response.data);
      } catch (err) {
        setError("Failed to fetch earnings.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEarnings();
  }, []);
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const currentAd = ads[currentAdIndex];
  const timerTime = nextAvailableTime
    ? Math.max(moment(nextAvailableTime).unix() - moment().unix(), 0)
    : 0;
  useEffect(() => {
    const now = moment();
    const lastReset = localStorage.getItem("lastResetDate");
    const today = now.startOf("day").format("YYYY-MM-DD");

    if (lastReset !== today) {
      // Reset viewed ads list
      localStorage.removeItem("viewedAds");
      localStorage.setItem("lastResetDate", today);
    }
  }, []);
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const earningsResponse = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/ads/user-ads-earnings"
        );

        setTotalEarnings(earningsResponse.data.totalEarnings);

        const statsResponse = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/ads/user-total-ads-viewed"
        );
        const { totalAdsViewed, remainingAdsToday } = statsResponse.data;
        setTotalAdsViewed(totalAdsViewed);
        setRemainingAds(remainingAdsToday);

        // Calculate next available time
        const now = moment();
        const nextAdTime = now.add(24, "hours").startOf("day").toDate();
        setNextAvailableTime(nextAdTime);

        if (remainingAdsToday <= 0) {
          setMessage(
            "You have viewed all ads for today. Please come back tomorrow."
          );
          setShowTimer(false);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <Layout>
      <div
        className="dashboard-container bg-light text-center py-4 p-5 position-relative"
        style={{
          height: "auto",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginTop: "130px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center h-100 flex-wrap">
          <div>
            <h1
              style={{ fontSize: "35px", fontWeight: "bold ", color: "black" }}
            >
              WATCH ADS
            </h1>
          </div>
          <div className="d-flex align-items-center details-container">
            <img
              src={logo}
              alt="Dashboard Logo"
              className="dashboard-logo"
              style={{
                borderRadius: "10px",
                width: "100px",
                height: "100px",
                marginLeft: "20px",
              }}
            />
            <div
              className="mt-5 mb-5 p-5"
              style={{
                background: "white",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                marginRight: "30px",
              }}
            >
              <p className="text-muted mb-1">
                <span
                  className="fw-bold"
                  style={{ fontSize: "30px", color: "black" }}
                >
                  👨 {auth?.user?.username}
                </span>
              </p>
              <p className="text-muted mb-1">
                <span className="fw-bold" style={{ color: "black" }}>
                  Earnings:
                </span>{" "}
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <span style={{ color: "black" }}>
                    {earnings ? earnings.earnings : "0"} {displayCurrency}
                  </span>
                )}
              </p>
              <p className="text-muted mb-0">
                <span className="fw-bold" style={{ color: "black" }}>
                  Total Earnings:
                </span>{" "}
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <span style={{ color: "black" }}>
                    {earnings ? earnings.totalEarnings : "0"} {displayCurrency}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5">
        {nextAvailableTime && (
          <div
            className="card p-3"
            style={{
              width: "300px",
              margin: "0 10px",
              background: "#f8f9fa",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5>Next Ad Available In:</h5>
            <h3>{formatTime(timerTime)}</h3>
          </div>
        )}
      </div>

      <div
        className="alert alert-success"
        role="alert"
        style={{ padding: "20px", borderRadius: "10px", marginTop: "20px" }}
      >
        <h2
          style={{ color: "black", textAlign: "center", marginBottom: "20px" }}
        >
          Ads Watching Rules
        </h2>
        <ol style={{ fontSize: "16px", lineHeight: "1.6" }}>
          <li>Must watch video as given duration.</li>
          <li>
            You have only 20 ads per day if you watch more than 20 ads in a day
            then your amount is deducted, keep in your mind
          </li>
          <li>
            Click on watch now and watch the video as given duration and then
            back and submit.
          </li>
        </ol>
      </div>

      {/*  <div className="col-md-9">
        <div
          className="alert alert-warning"
          role="alert"
          style={{ padding: "20px", borderRadius: "10px", marginTop: "20px" }}
        >
          <p style={{ fontWeight: "bold", fontSize: "16px", color: "red" }}>
            Dear {auth.user.username} !! You need to subscribe this channal
            first, This is compulsory for your income.
            <div className="contact-list">
              {contacts.length === 0 ? (
                <p className="text-center">No Links Available</p>
              ) : (
                contacts.map((p) => (
                  <div key={p._id} className="col-md-4 mb-3">
                    <div className="contact-card">
                      <div className="d-flex align-items-center">
                        <FaYoutube size={24} className="mr-2 text-danger" />
                        <a
                          href={p.subscribechannallink}
                          className="link-secondary"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "15px" }}
                        >
                          Subscribe over Channel
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </p>
        </div>
      </div>*/}

      <div className="mt-4">
        {currentAd ? (
          <>
            <div
              className="card d-flex justify-content-center align-items-center p-4 shadow"
              style={{
                backgroundColor: "#282c34",
                borderRadius: "15px",
                maxWidth: "600px",
                margin: "20px auto",
                color: "#00ffee",
              }}
            >
              <h1
                style={{
                  textAlign: "center",
                  fontSize: "45px",
                  marginBottom: "20px",
                  color: "#00ffee",
                }}
              >
                {currentAd.title}
              </h1>
              <p style={{ fontSize: "20px", color: "#fff" }}>
                Duration: {currentAd.duration} seconds
              </p>

              <button
                onClick={() => {
                  window.open(currentAd.videoLink, "_blank"); // Open the video link in a new tab
                  setIsAdWatched(true); // Set ad as watched when clicked
                }}
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#00ffee",
                  border: "none",
                  padding: "10px 20px",
                  color: "#282c34",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "20px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  width: "200px",
                }}
              >
                <FaYoutube /> Watch Now
              </button>
            </div>
            {remainingAds > 0 && isAdWatched && showTimer && (
              <div className="text-center mt-4">
                <button
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={submitTimer > 0} // Disable until timer finishes
                  style={{
                    borderRadius: "12px",
                    padding: "10px 25px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    backgroundColor: "#28a745",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {submitTimer > 0 ? (
                    <>
                      <span className="mr-2">Submitting...</span>
                      <span>{formatTime(submitTimer)}</span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p>No ads available at the moment. Please check back later.</p>
          </div>
        )}
      </div>
      <div className="mt-5 text-center">
        {message && <p className="text-danger">{message}</p>}
      </div>
    </Layout>
  );
};

export default Ads;
