import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/auth";
import axios from "axios";
import AdminComponent from "../../Componet/Layout/AdminComponent";
import Spinner from "../../Componet/Spinner";

const AllTransaction = () => {
  const [auth] = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "https://earning-site-fll-backend-code.onrender.com/api/v1/purchase/get-all-tarnsaction"
        );
        console.log(response.data); // Log the response data

        const sortedTransactions = response.data.transactions.sort((a, b) => {
          if (a.packageStatus === "pending" && b.packageStatus !== "pending") {
            return -1;
          } else if (
            a.packageStatus !== "pending" &&
            b.packageStatus === "pending"
          ) {
            return 1;
          } else {
            return new Date(b.purchaseDate) - new Date(a.purchaseDate);
          }
        });

        setTransactions(sortedTransactions);
      } catch (error) {
        setError("Error fetching transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleChangeStatus = async (transactionId, newStatus) => {
    try {
      const response = await axios.put(
        `https://earning-site-fll-backend-code.onrender.com/api/v1/purchase/update-status/${transactionId}`,
        { packageStatus: newStatus }
      );
      console.log(response.data); // Log the response data

      const updatedTransactions = transactions.map((tx) =>
        tx._id === transactionId ? { ...tx, packageStatus: newStatus } : tx
      );

      const sortedTransactions = updatedTransactions.sort((a, b) => {
        if (a.packageStatus === "pending" && b.packageStatus !== "pending") {
          return -1;
        } else if (
          a.packageStatus !== "pending" &&
          b.packageStatus === "pending"
        ) {
          return 1;
        } else {
          return new Date(b.purchaseDate) - new Date(a.purchaseDate);
        }
      });

      setTransactions(sortedTransactions);
    } catch (error) {
      console.error(error);
      setError("Error updating transaction status");
    }
  };

  // Filter transactions based on the search term
  const filteredTransactions = transactions.filter((tx) =>
    tx.userId?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="dashboard-container bg-light">
            <img
              src="images/spinnerlogo.jpeg"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt="Loading..."
            />
            <div className="right-content">
              <h1>All Transactions</h1>
              <p>
                <span style={{ color: "#e0c10c", fontWeight: "bold" }}>
                  👨{auth?.user?.username}
                </span>
                !
              </p>
            </div>
          </div>

          <div className="container-fluid m-3 p-3">
            <div className="row">
              <div className="col-md-3">
                <AdminComponent />
              </div>
              <div className="col-md-8">
                <div className="card w-75 p-3">
                  <div className="card w-75 p-3 bg-dark text-white mb-3 p-5 w-100">
                    <h1>All Transactions</h1>
                  </div>

                  {/* Add Search Bar */}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {error ? (
                    <p>{error}</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-dark table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Package</th>
                            <th>Price</th>
                            <th>Transaction ID</th>
                            <th>Sender Number</th>
                            <th>Purchase Date</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Referral By</th>{" "}
                            {/* Add the new column header */}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTransactions.map((tx, index) => (
                            <tr key={tx._id}>
                              <td>{index + 1}</td>
                              <td>{tx.userId ? tx.userId.email : "N/A"}</td>
                              <td>{tx.packagesId.name}</td>
                              <td>{tx.packagesId.price} Rs</td>
                              <td>{tx.transactionId}</td>
                              <td>{tx.sendernumber}</td>
                              <td>
                                {new Date(tx.purchaseDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                              <td>
                                {new Date(tx.expiryDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                              <td>
                                <select
                                  value={tx.packageStatus}
                                  onChange={(e) =>
                                    handleChangeStatus(tx._id, e.target.value)
                                  }
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="Active">Active</option>
                                  <option value="cancel">Cancel</option>
                                  <option value="Expired">Expired</option>
                                </select>
                              </td>
                              <td>{tx.userId?.referredBy || "N/A"}</td>{" "}
                              {/* Add this line to display referred by */}
                            </tr>
                          ))}
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

export default AllTransaction;
