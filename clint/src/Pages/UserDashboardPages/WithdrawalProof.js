import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/auth";
import axios from "axios";
import Spinner from "../../Componet/Spinner";

const WithdrawalProof = () => {
  const [auth] = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/userwithdrawal/get-user-withdrawals"
        );

        // Filter only approved withdrawals and limit to top 40
        const approvedWithdrawals = response.data.withdrawals
          .filter((tx) => tx.status === "approved")
          .slice(0, 40); // Show only top 40

        setWithdrawals(approvedWithdrawals);
      } catch (error) {
        setError("Error fetching withdrawals");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  // Helper function to partially hide the email address
  const formatEmail = (email) => {
    if (!email) return "N/A";
    const [name, domain] = email.split("@");
    return `${name.slice(0, 2)}...@${domain}`;
  };

  // Helper function to return currency symbol based on withdrawal amount
  const getCurrencySymbol = (amount) => {
    if (amount >= 1 && amount <= 10) {
      return "$"; // For withdrawals between 1 and 10, display USD
    } else {
      return "Rs"; // For other amounts, display PKR
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="dashboard-container bg-white p-4 shadow-sm rounded">
            <div className="d-flex align-items-center mb-4">
              <img
                src="images/spinnerlogo.jpeg"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "10px",
                }}
                alt="Logo"
              />
              <div className="right-content">
                <h1 className="text-dark">Approved Withdrawals</h1>
                <p>
                  Welcome,{" "}
                  <span style={{ color: "#007BFF", fontWeight: "bold" }}>
                    👨 {auth?.user?.username}
                  </span>
                  !
                </p>
              </div>
            </div>
          </div>

          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="">
                  <h2 className="text-center mb-4">
                    Some Approved Withdrawals
                  </h2>
                  {error ? (
                    <p className="text-danger text-center">{error}</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead className="thead-light">
                          <tr>
                            <th style={{ width: "5%" }}>#</th>
                            <th style={{ width: "40%" }}>Email</th>
                            <th style={{ width: "25%" }}>Amount</th>
                            <th style={{ width: "30%" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {withdrawals.length > 0 ? (
                            withdrawals.map((tx, index) => (
                              <tr key={tx._id}>
                                <td>{index + 1}</td>
                                <td>{formatEmail(tx.userId?.email)}</td>
                                <td>
                                  {tx.amount} {getCurrencySymbol(tx.amount)}
                                </td>
                                <td>
                                  <span
                                    style={{
                                      color: "green",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Approved
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center">
                                No approved withdrawals found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WithdrawalProof;
