import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/auth";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "../../Styles/UpdatePackage.css";

const UpdateWithdrawalAccount = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [method, setMethod] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [photo, setPhoto] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);

  // Function to fetch withdrawal account details
  const getAccountDetails = async () => {
    try {
      const { data } = await axios.get(
        `https://earning-site-fll-backend-code.onrender.com/api/v1/withdrawal/get-single-account/${id}`
      );
      console.log(data); // Add this line
      if (data?.success) {
        const account = data.withdrawalAccount;
        setMethod(account.method);
        setMinAmount(account.minAmount); // Check if this is being set
        setExistingPhoto(account.photo);
      } else {
        toast.error("Failed to fetch account details");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in fetching account details");
    }
  };

  useEffect(() => {
    getAccountDetails();
  }, [id]);

  // Update withdrawal account
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("method", method);
      formData.append("minAmount", minAmount);
      if (photo) {
        formData.append("photo", photo);
      }

      const { data } = await axios.put(
        `https://earning-site-fll-backend-code.onrender.com/api/v1/withdrawal/update-account/${id}`,
        formData
      );

      if (data?.success) {
        alert("Account updated successfully");
        navigate("/dashboard/admin/withdrawal-account");
      } else {
        toast.error(data?.message || "Failed to update account");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in updating account");
    }
  };

  // Delete withdrawal account
  const handleDelete = async () => {
    try {
      const answer = window.confirm(
        "Are you sure you want to delete this account?"
      );
      if (!answer) return;

      const { data } = await axios.delete(
        `https://earning-site-fll-backend-code.onrender.com/api/v1/withdrawal/delete-account/${id}`
      );

      if (data.success) {
        alert("Account deleted successfully");
        navigate("/dashboard/admin/withdrawal-account");
      } else {
        toast.error(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting account");
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
  };

  return (
    <>
      <div className="container-fluid m-3 p-3 dashboard">
        <button
          className="btn"
          style={{ width: "200px" }}
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-9">
            <h1>Update Withdrawal Account</h1>
            <form className="m-1 w-75" onSubmit={handleUpdate}>
              <div className="mb-3">
                <label htmlFor="method" className="form-label">
                  Method:
                </label>
                <input
                  type="text"
                  value={method}
                  placeholder="Enter Method Name"
                  className="form-control"
                  onChange={(e) => setMethod(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="minAmount" className="form-label">
                  Minimum Amount:
                </label>
                <input
                  type="text"
                  value={minAmount} // Ensure this is bound correctly
                  placeholder="Enter Minimum Amount"
                  className="form-control"
                  onChange={(e) => setMinAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="photo" className="form-label">
                  Photo:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {existingPhoto && !photo && (
                  <div>
                    <img
                      src={`data:image/jpeg;base64,${existingPhoto}`}
                      alt="Withdrawal Account"
                      style={{
                        width: "330px",
                        height: "105px",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="mb-3">
                <button className="btn btn-primary" type="submit">
                  UPDATE ACCOUNT
                </button>
              </div>
            </form>
            <div className="mb-3">
              <button className="btn btn-danger" onClick={handleDelete}>
                DELETE ACCOUNT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateWithdrawalAccount;
