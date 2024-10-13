import React, { useState } from "react";
import { useAuth } from "../../Context/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../Styles/CreatePackage.css";
import AdminComponent from "../../Componet/Layout/AdminComponent";

const CreatePackage = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [earningRate, setEarningRate] = useState("");
  const [numOfAds, setNumOfAds] = useState("");
  const [discount, setDiscount] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [Packagecurrency, setPackagecurrency] = useState("PKR"); // Add default currency

  const [isActive, setIsActive] = useState(true);

  // Package create
  const handleCreate = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !description ||
      !price ||
      !duration ||
      !earningRate ||
      !commissionRate ||
      !Packagecurrency
    ) {
      alert("Please fill all the fields");
      return;
    }
    try {
      const packageData = {
        name,
        description,
        price,
        duration,
        earningRate,
        numOfAds,
        discount,
        isActive,
        commissionRate,
        Packagecurrency, // Add currency in package data
      };

      const { data } = await axios.post(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/package/create-package",
        packageData
      );
      if (data?.success) {
        alert(data?.message);
        navigate("/dashboard/admin/all-package");
      } else {
        alert(data?.message || "Package creation failed");
      }

      // Reset form fields
      setName("");
      setDescription("");
      setPrice("");
      setDuration("");
      setEarningRate("");
      setNumOfAds("");
      setDiscount("");
      setCommissionRate("");
      setPackagecurrency("PKR"); // Reset currency to default
      setIsActive(true);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
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
          <h1>Create New Package</h1>
          <p>
            <span style={{ color: "#e0c10c", fontWeight: "bold" }}>
              👨 {auth?.user?.username}
            </span>
            !
          </p>
        </div>
      </div>

      <div className="">
        <div className="row">
          <div className="col-md-3">
            <AdminComponent />
          </div>
          <div className="col-md-8">
            <h1 className="text-center p-4 mb-4">Create Package</h1>

            <div className="card w-75 p-3 bg-dark text-white mb-3 p-5 w-100">
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Package name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="numOfAds"
                  value={numOfAds}
                  placeholder="Total Ads"
                  className="form-control"
                  onChange={(e) => setNumOfAds(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="Description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={duration}
                  placeholder="Duration (days)"
                  className="form-control"
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={earningRate}
                  placeholder="Earning Rate"
                  className="form-control"
                  onChange={(e) => setEarningRate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={discount}
                  placeholder="Any Discount"
                  className="form-control"
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={commissionRate}
                  placeholder="Referral Commission"
                  className="form-control"
                  onChange={(e) => setCommissionRate(e.target.value)}
                />
              </div>

              {/* Currency Dropdown */}
              <div className="mb-3">
                <label htmlFor="currency" className="form-label">
                  Currency:
                </label>
                <select
                  value={Packagecurrency}
                  className="form-control"
                  onChange={(e) => setPackagecurrency(e.target.value)}
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="isActive" className="form-label">
                  Active:
                </label>
                <select
                  value={isActive ? "Active" : "Inactive"}
                  className="form-control"
                  onChange={(e) => setIsActive(e.target.value === "Active")}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="isActive" className="form-label">
                  Active:
                </label>
                <select
                  value={isActive ? "Active" : "Inactive"}
                  className="form-control"
                  onChange={(e) => setIsActive(e.target.value === "Active")}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-3 ">
                <button
                  className="btn btn-primary"
                  style={{ fontSize: "15px", width: "200px" }}
                  onClick={handleCreate}
                >
                  CREATE PACKAGE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePackage;
