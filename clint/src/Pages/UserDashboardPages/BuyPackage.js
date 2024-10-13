import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../Context/auth";
import { useNavigate } from "react-router-dom";
import "../../Styles/BuyPackage.css";
import toast from "react-hot-toast";
import Layout from "../../Componet/Layout/Layout";
import Spinner from "../../Componet/Spinner";
import logo from "../../Assets/sitelogo.png";

const BuyPackage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [earnings, setEarnings] = useState(null);

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
  const userCurrency = auth?.user?.currency || "PKR"; // Default to PKR if no currency is set

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const getAllPackages = async () => {
    try {
      const { data } = await axios.get(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/package/get-package"
      );

      if (data.success) {
        let filteredPackages = [];

        if (data.packages && data.packages.length > 0) {
          if (userCurrency === "USD") {
            filteredPackages = data.packages.filter(
              (pkg) => pkg.currency === "USD"
            );
          } else {
            filteredPackages = data.packages.filter(
              (pkg) => pkg.currency === "PKR" || !pkg.currency
            );
          }

          if (filteredPackages.length === 0) {
            toast.error("No packages available for the selected currency.");
          } else {
            setPackages(filteredPackages);
          }
        } else {
          toast.error("No packages found.");
        }
      } else {
        toast.error(data.message || "Failed to fetch packages");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong fetching packages");
    }
  };

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

  useEffect(() => {
    getAllPackages();
  }, [userCurrency]);

  useEffect(() => {
    fetchUserEarnings();
  }, []);

  return (
    <Layout title="Buy Membership - Y-Ads">
      {loading ? (
        <Spinner />
      ) : (
        <>
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
                  style={{
                    fontSize: "35px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  BUY PACKAGE
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
                        {earnings ? earnings.totalEarnings : "0"}{" "}
                        {displayCurrency}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="containerr p-4">
            <p className="alert alert-danger" role="alert">
              You can buy one package at a time. If any user buys any package
              until they have one active package, then the old one is
              deactivated, and the new one is active.
            </p>
            <h1
              className="text-center text-light bg-dark py-4 mb-5"
              style={{ fontSize: "40px" }}
            >
              Buy Package
            </h1>
            <div className="row justify-content-center">
              {packages.map((pkg) => (
                <div key={pkg._id} className="col-md-4 mb-4">
                  <div
                    className={`card rounded shadow text-center ${
                      !pkg.isActive ? "inactive-package" : ""
                    }`}
                  >
                    <div className="card-body">
                      <h5 className="card-title p-3 mb-3 bg-dark text-light">
                        {pkg.name}
                      </h5>
                      <div className="card-text p-3 mb-3">
                        {pkg.description.split(":").map((part, index) => (
                          <span key={index}>
                            {part.trim()}
                            <br />
                          </span>
                        ))}
                      </div>
                      <p
                        className="card-text p-3 mb-3"
                        style={{ fontWeight: "bold", fontSize: "15px" }}
                      >
                        Total Ads: {pkg.numOfAds}
                      </p>

                      <p
                        className="card-text p-3 mb-3"
                        style={{ fontWeight: "bold", fontSize: "15px" }}
                      >
                        Duration: {pkg.duration} days
                      </p>
                      <p
                        className="card-text p-3 mb-3"
                        style={{ fontWeight: "bold", fontSize: "15px" }}
                      >
                        Per Ads: {pkg.earningRate}{" "}
                        {earnings?.currency === "PKR"
                          ? "Rs"
                          : earnings?.currency === "USD"
                          ? "$"
                          : ""}
                      </p>
                      <p
                        className="card-text p-3 mb-3"
                        style={{ fontWeight: "bold", fontSize: "15px" }}
                      >
                        Package Discount: {pkg.discount}
                      </p>

                      {!pkg.isActive && (
                        <div className="coming-soon-overlay">Coming Soon</div>
                      )}
                      <p
                        className="card-text p-3 mb-3"
                        style={{
                          color: "green",
                          fontWeight: "bold",
                          fontSize: "20px",
                        }} // Price styling change
                      >
                        Price: {pkg.price} {displayCurrency}
                      </p>
                      <button
                        className="btn"
                        style={{ width: "200px" }}
                        disabled={!pkg.isActive}
                        onClick={() =>
                          pkg.isActive &&
                          navigate(`/dashboard/user/payment-method/${pkg.slug}`)
                        }
                      >
                        {pkg.isActive ? "Buy Package" : "Package Inactive"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default BuyPackage;
