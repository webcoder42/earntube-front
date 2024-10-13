import React, { useEffect, useState } from "react";
import axios from "axios"; // Axios for API requests
import logo from "../../Assets/sitelogo.png";
import { useAuth } from "../../Context/auth";
import Layout from "./../../Componet/Layout/Layout";

function UserTasks() {
  const [auth] = useAuth();

  const [tasks, setTasks] = useState([]); // State to hold tasks
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [claimedTasks, setClaimedTasks] = useState([]); // State to track claimed tasks
  const [earnings, setEarnings] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referrals, setReferrals] = useState([]);
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
    const fetchUserReferrals = async () => {
      try {
        const response = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/users/total-referrals"
        );
        setTotalReferrals(response.data.totalReferrals);
        setReferrals(response.data.referralDetails);

        // Calculate active and inactive users
        const activeCount = response.data.referralDetails.filter(
          (referral) => referral.packageStatus === "Active"
        ).length;
        const inactiveCount =
          response.data.referralDetails.length - activeCount;

        setActiveUsers(activeCount);
        setInactiveUsers(inactiveCount);
      } catch (err) {
        setError("Failed to fetch referrals.");
      }
    };
    fetchUserReferrals();
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

  // Function to fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/usertask/get" // Replace with your actual endpoint
      );

      setTasks(response.data); // Set the tasks in state
      setLoading(false); // Set loading to false after fetching
    } catch (err) {
      setError("Failed to fetch tasks"); // Set error message if fetching fails
      setLoading(false);
    }
  };

  // Function to claim a task
  const claimTask = async (taskId) => {
    try {
      const response = await axios.post(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/usertask/claim-task",
        { taskId }, // Send task ID in request body
        {}
      );

      // Update claimed tasks
      setClaimedTasks((prevClaimed) => [...prevClaimed, taskId]);

      alert("Task claimed successfully!");
    } catch (err) {
      console.error("Failed to claim task:", err.response?.data?.message);
      alert("Task already claimed Try next one.");
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading while tasks are being fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error if fetching fails
  }

  // Function to calculate active referrals for a user
  const getActiveReferralsCount = (task) => {
    const activeReferrals = referrals.filter(
      (referral) => referral.packageStatus === "Active"
    ).length;
    return activeReferrals >= task.referralRequirement
      ? `${task.referralRequirement}/${activeReferrals}`
      : `${task.referralRequirement}/${activeReferrals}`;
  };

  // Separate tasks based on type
  const sundayTasks = tasks.filter((task) => task.taskType === "sundayOffer");
  const monthlyTasks = tasks.filter((task) => task.taskType === "monthlyOffer");
  const referralTasks = tasks.filter((task) => task.taskType === "referral");
  const linkTasks = tasks.filter((task) => task.taskType === "link");

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
              style={{ fontSize: "35px", fontWeight: "bold", color: "black" }}
            >
              Tasks
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
                <span style={{ color: "black" }}>
                  {earnings ? earnings.earnings : "0"}{" "}
                  {earnings?.currency === "PKR"
                    ? "Rs"
                    : earnings?.currency === "USD"
                    ? "$"
                    : ""}
                </span>
              </p>
              <p className="text-muted mb-0">
                <span className="fw-bold" style={{ color: "black" }}>
                  Total Earnings:
                </span>{" "}
                <span style={{ color: "black" }}>
                  {earnings ? earnings.totalEarnings : "0"}{" "}
                  {earnings?.currency === "PKR"
                    ? "Rs"
                    : earnings?.currency === "USD"
                    ? "$"
                    : ""}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sunday Tasks */}
      <div className="card mb-5 mt-5">
        <h1 style={{ color: "black", fontWeight: "bold" }}>
          Sunday Super Offers
        </h1>
        {sundayTasks.length > 0 ? (
          <ul>
            {sundayTasks.map((task) => (
              <li key={task._id}>
                <h3 style={{ color: "black" }}>{task.reward}</h3>

                <p>
                  {task.referralRequirement
                    ? getActiveReferralsCount(task)
                    : null}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: "center" }}>
            This task only avaliable on weekend.
          </p>
        )}
      </div>

      {/* Monthly Tasks */}
      <div className="card mb-5 mt-5">
        <h1 style={{ color: "black", fontWeight: "bold" }}>
          Monthly Boom Offers
        </h1>
        {monthlyTasks.length > 0 ? (
          <ul>
            {monthlyTasks.map((task) => (
              <li key={task._id}>
                <h3 style={{ color: "black" }}>{task.reward}</h3>

                <p>
                  {task.referralRequirement
                    ? getActiveReferralsCount(task)
                    : null}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Monthly tasks available.</p>
        )}
      </div>

      {/* Referral Requirement Tasks */}
      {/* Referral Requirement Tasks */}
      <div className="card mb-5 mt-5">
        <h1 style={{ color: "black", fontWeight: "bold" }}>Referral Tasks</h1>
        {referralTasks.length > 0 ? (
          <ul>
            {referralTasks.map((task, index) => {
              const activeReferrals = getActiveReferralsCount(task);
              const isButtonEnabled =
                activeUsers >= task.referralRequirement && !task.claimed;

              return (
                <li key={task._id}>
                  <h3 style={{ color: "black" }}>
                    <strong> {index + 1}.</strong> {task.reward}
                  </h3>
                  <p>
                    Price: {task.price} {displayCurrency}
                  </p>
                  <p>
                    Complete your active referral and get : {activeReferrals}
                  </p>

                  {/* Button logic */}
                  <button
                    onClick={() => claimTask(task._id)}
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      border: "none",
                      backgroundColor: isButtonEnabled ? "green" : "gray",
                      color: "white",
                      cursor: isButtonEnabled ? "pointer" : "not-allowed",
                    }}
                    disabled={!isButtonEnabled} // Disable button if conditions are not met
                  >
                    {task.claimed ? "Claimed" : "Claim"}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No Referral Requirement tasks available.</p>
        )}
      </div>

      {/* Link Tasks */}
      <div className="card mb-5 mt-5">
        <h1 style={{ color: "black", fontWeight: "bold" }}>
          Follow Us On Social Media Tasks
        </h1>
        {linkTasks.length > 0 ? (
          <ul>
            {linkTasks.map((task) => (
              <li key={task._id}>
                <h3 style={{ color: "black" }}>{task.reward}</h3>

                <p>
                  Price: {task.price} {displayCurrency}
                </p>

                {/* Button to claim the task */}
                <button
                  onClick={() => {
                    // Open the link in a new tab
                    window.open(task.Links, "_blank");

                    // Show the Claim Reward button
                    setClaimedTasks((prev) => [...prev, task._id]); // Assuming you have a state to manage claimed tasks
                  }}
                >
                  Start
                </button>

                {/* Conditionally render the Claim Reward button */}
                {claimedTasks.includes(task._id) && (
                  <button
                    onClick={() => claimTask(task._id)} // Call your claimTask function
                    style={{ marginLeft: "10px", backgroundColor: "black" }}
                  >
                    Claim
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Link tasks available.</p>
        )}
      </div>
    </Layout>
  );
}

export default UserTasks;
