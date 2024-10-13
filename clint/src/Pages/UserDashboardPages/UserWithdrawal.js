import React, { useState, useEffect } from "react";
import Layout from "./../../Componet/Layout/Layout";
import { useAuth } from "../../Context/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../Assets/sitelogo.png";

import "../../Styles/Withdrawal.css";
import { FaYoutube } from "react-icons/fa";

const UserWithdrawal = () => {
  const [auth] = useAuth();
  const [selectedMethod, setSelectedMethod] = useState("");
  const [titles, setTitles] = useState([]);
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [singleAccount, setSingleAccount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [minAmount] = useState();

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
    const fetchUserEarnings = async () => {
      try {
        const response = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/users/earnings",
          {}
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

  const fetchWithdrawalAccounts = async () => {
    try {
      const { data } = await axios.get(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/withdrawal/get-withdrawal-account"
      );
      setTitles(data.withdrawalAccounts);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching the payment accounts");
    }
  };

  const fetchAccountDetail = async (id) => {
    try {
      const { data } = await axios.get(
        `https://earning-site-fll-backend-code.onrender.com/api/v1/withdrawal/get-single-account/${id}`
      );
      setSingleAccount(data.singleAccount);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching the package details");
    }
  };

  useEffect(() => {
    fetchWithdrawalAccounts();
  }, []);

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    fetchAccountDetail(methodId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};
    if (!amount.trim()) {
      errors.amount = "Amount is required";
    } else if (parseFloat(amount) < 1) {
      errors.amount = `Minimum amount is 0 ${displayCurrency}`;
    } else if (parseFloat(amount) > parseFloat(auth.user.availableEarnings)) {
      errors.amount = "Insufficient available funds";
    }
    if (!accountName.trim()) {
      errors.accountName = "Account Name is required";
    }
    if (!accountNumber.trim()) {
      errors.accountNumber = "Account Number is required";
    }
    if (!selectedMethod) {
      errors.selectedMethod = "Please select a payment method";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        amount,
        paymentMethod: selectedMethod,
        accountNumber,
        accountName,
      };
      let answer = window.prompt(
        "Make sure your detail  is correct and your package is Active, in any wrong detail or apply withdrawal without active package then your withdrawal rejected and no refund and no excuses  so please check its carefully and wait 24hour for approved ?    Enter any key for continuous "
      );
      if (!answer) return;

      const { data } = await axios.post(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/userwithdrawal/create-withdrawal",
        formData
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/dashboard/user/withdrawalhistory");
      } else {
        toast.error(data.message || "Failed to submit form");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while processing the payment");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Fetch all Contacts
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
              MAKE WITHDRAWAL REQUEST
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
                          Click here
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </p>
        </div>
      </div>
*/}
      <div
        className="alert alert-success"
        role="alert"
        style={{ padding: "20px", borderRadius: "10px", marginTop: "20px" }}
      >
        <h2
          style={{ color: "black", textAlign: "center", marginBottom: "20px" }}
        >
          Withdrawal Rules
        </h2>
        <ol style={{ fontSize: "16px", lineHeight: "1.6" }}>
          <li>
            After applying for a withdrawal, you will receive it within 12 to 24
            hours.
          </li>
          <li>
            To receive a withdrawal, it is mandatory to subscribe to the channel
            first. Otherwise, your withdrawal will be rejected.
          </li>
          <li>
            After applying for a withdrawal, please wait up to 24 hours to
            receive it.
          </li>
          <li>
            Contact the withdrawal handler only in serious situations. If your
            withdrawal is delayed beyond 24 hours, then you may message the
            withdrawal handler.
          </li>
        </ol>
      </div>

      <div className="withdrawal-container">
        <h1 className="text-center mb-4">SELECT PAYMENT METHOD</h1>
        <div className="row justify-content-center">
          {titles.length === 0 ? (
            <p className="text-center"></p>
          ) : (
            <div className="col-md-8">
              <div className="d-flex flex-wrap justify-content-center">
                {titles.map((account) => (
                  <div
                    key={account._id}
                    className={`card bg-dark text-white m-2 p-3 ${
                      selectedMethod === account._id ? "border-primary" : ""
                    }`}
                    style={{ width: "200px", cursor: "pointer" }}
                    onClick={() => handleMethodSelect(account._id)}
                  >
                    <img
                      src={`https://earning-site-fll-backend-code.onrender.com/api/v1/withdrawal/account-photo/${account._id}`}
                      alt="Withdrawal Account"
                      className="card-img-top"
                      style={{ height: "100px", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>

              {selectedMethod && (
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.amount ? "border-danger" : ""
                      }`}
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setErrors({ ...errors, amount: null });
                      }}
                    />
                    {errors.amount && (
                      <div className="text-danger">{errors.amount}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Account Name /Network</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.accountName ? "border-danger" : ""
                      }`}
                      placeholder="Account Name / TRX Tron (TRC20)"
                      value={accountName}
                      onChange={(e) => {
                        setAccountName(e.target.value);
                        setErrors({ ...errors, accountName: null });
                      }}
                    />
                    {errors.accountName && (
                      <div className="text-danger">{errors.accountName}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Account Number/Wallet</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.accountNumber ? "border-danger" : ""
                      }`}
                      placeholder="123456789/TJsdCRJ1Kpk9w32SvS7fVqFerx6iz2fFP4"
                      value={accountNumber}
                      onChange={(e) => {
                        setAccountNumber(e.target.value);
                        setErrors({ ...errors, accountNumber: null });
                      }}
                    />
                    {errors.accountNumber && (
                      <div className="text-danger">{errors.accountNumber}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary  btn-block"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {singleAccount && (
          <div className="mt-4">
            <h3>Selected Account Details</h3>
            <p>Account Name: {singleAccount.accountName}</p>
            <p>Account Number: {singleAccount.accountNumber}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserWithdrawal;
