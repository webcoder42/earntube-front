import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/auth";
import axios from "axios";

import "../../Styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [currency, setCurrency] = useState("USD"); // New state for currency
  const [auth, setAuth] = useAuth();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [accountStatus, setAccountStatus] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const switchers = document.querySelectorAll(".switcher");
    switchers.forEach((item) => {
      item.addEventListener("click", function () {
        switchers.forEach((item) =>
          item.parentElement.classList.remove("is-active")
        );
        this.parentElement.classList.add("is-active");
      });
    });

    // Clean up event listeners
    return () => {
      switchers.forEach((item) => item.removeEventListener("click", () => {}));
    };
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("referralCode");
    if (code) {
      setReferralCode(code);
    }
  }, [location.search]);

  useEffect(() => {
    if (registerSuccess) {
      navigate("/login");
    }
  }, [registerSuccess, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrors({
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : "",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/users/login",
        {
          email,
          password,
        }
      );
      setLoading(false);
      if (res.data.success) {
        if (
          res.data.user.status === "banned" ||
          res.data.user.status === "suspended"
        ) {
          setAccountStatus(res.data.user.status);
          setErrors({ login: `Your account is ${res.data.user.status}.` });
        } else {
          setAuth({
            ...auth,
            user: res.data.user,
            token: res.data.token,
          });
          localStorage.setItem("auth", JSON.stringify(res.data));
          navigate(`/dashboard/${res.data.user.role === 1 ? "admin" : "user"}`);
        }
      } else {
        setErrors({ login: res.data.error });
      }
    } catch (error) {
      setLoading(false);
      setErrors({ login: "Something went wrong! User Not Found" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setErrors({
        username: !username ? "Username is required" : "",
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : "",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/users/register",
        {
          username,
          email,
          password,
          referralCode,
          currency, // Include currency in registration request
        }
      );
      setLoading(false);
      if (res.data.success) {
        setRegisterSuccess(true);
        alert("Register successfully! Please login");
      } else {
        setErrors({ register: res.data.error });
      }
    } catch (error) {
      setLoading(false);
      setErrors({ register: "Something went wrong" });
    }
  };

  return (
    <div className="login-container">
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              {/*  <div
                style={{
                  marginBottom: "50px",
                  backgroundColor: "#f0f8ff",
                  color: "#333",

                  border: "2px solid #0a74da",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "16px",
                  borderRadius: "5px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <marquee
                  style={{
                    padding: "5px 0",
                    fontSize: "28px",
                  }}
                >
                  Attention EarnTube💲 Members! We are excited to announce a new
                  update. We have introduced a free demo package for USD users
                  to try. You can test it and switch to any other package at
                  your convenience!
                </marquee>
              </div>*/}
              {/*  <div
                style={{
                  backgroundColor: "white",
                  marginTop: "-10px",
                  marginBottom: "30px",
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: "20px", // Padding add karein
                  border: "2px solid #ccc", // Border add karein
                  borderRadius: "8px", // Rounded corners
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
                  transition: "transform 0.3s ease-in-out", // Transition for hover effect
                }}
              >
                <h3
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "26px",
                    color: "#333", // Text color
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)", // Text shadow
                  }}
                  className="animated-text"
                >
                  Free Package only for USD user
                </h3>
              </div>*/}

              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3" style={{ fontSize: "20px" }}>
                  <span>Log In </span>
                  <span>Sign Up</span>
                </h6>
                <input
                  className="checkbox"
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                />
                <label htmlFor="reg-log" />
                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    <div className="card-front">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4
                            className="mb-4 pb-3"
                            style={{ fontSize: "20px" }}
                          >
                            Log In
                          </h4>
                          <form onSubmit={handleLogin}>
                            <div className="form-group">
                              <input
                                type="email"
                                name="logemail"
                                className={`form-style ${
                                  errors.email ? "is-invalid" : ""
                                }`}
                                placeholder="Your Email"
                                id="logemail"
                                autoComplete="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              <i className="input-icon uil uil-at" />
                              {errors.email && (
                                <div className="invalid-feedback">
                                  {errors.email}
                                </div>
                              )}
                            </div>
                            <div className="form-group mt-2">
                              <input
                                type="password"
                                name="logpass"
                                className={`form-style ${
                                  errors.password ? "is-invalid" : ""
                                }`}
                                placeholder="Your Password"
                                id="logpass"
                                autoComplete="off"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <i className="input-icon uil uil-lock-alt" />
                              {errors.password && (
                                <div className="invalid-feedback">
                                  {errors.password}
                                </div>
                              )}
                            </div>
                            {errors.login && (
                              <div className="error-message">
                                {errors.login}
                              </div>
                            )}
                            {accountStatus && (
                              <div
                                className="error-message"
                                style={{ color: "red" }}
                              >
                                Your account is {accountStatus}.
                              </div>
                            )}
                            <button
                              type="submit"
                              className="btn mt-4"
                              disabled={loading || accountStatus}
                            >
                              {loading ? "Loading..." : "Submit"}
                            </button>
                            <p className="mb-0 mt-4 text-center">
                              <Link to="/reset-password" className="link">
                                Forgot your password?
                              </Link>
                            </p>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="card-back">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4
                            className="mb-4 pb-3"
                            style={{ fontSize: "20px" }}
                          >
                            Sign Up
                          </h4>
                          <form onSubmit={handleSubmit}>
                            <div className="form-group">
                              <input
                                type="text"
                                name="logname"
                                className={`form-style ${
                                  errors.username ? "is-invalid" : ""
                                }`}
                                placeholder="Your Username"
                                id="logusername"
                                autoComplete="off"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                              />
                              <i className="input-icon uil uil-user" />
                              {errors.username && (
                                <div className="invalid-feedback">
                                  {errors.username}
                                </div>
                              )}
                            </div>
                            <div className="form-group mt-2">
                              <input
                                type="email"
                                name="logemail"
                                className={`form-style ${
                                  errors.email ? "is-invalid" : ""
                                }`}
                                placeholder="Your Email"
                                id="logemail"
                                autoComplete="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              <i className="input-icon uil uil-at" />
                              {errors.email && (
                                <div className="invalid-feedback">
                                  {errors.email}
                                </div>
                              )}
                            </div>
                            <div className="form-group mt-2">
                              <input
                                type="password"
                                name="logpass"
                                className={`form-style ${
                                  errors.password ? "is-invalid" : ""
                                }`}
                                placeholder="Your Password"
                                id="logpass"
                                autoComplete="off"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <i className="input-icon uil uil-lock-alt" />
                              {errors.password && (
                                <div className="invalid-feedback">
                                  {errors.password}
                                </div>
                              )}
                            </div>
                            <div className="form-group mt-2">
                              <select
                                className="form-style"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                              >
                                <option value="" disabled>
                                  Select your currency
                                </option>
                                <option value="USD">USD</option>
                                <option value="PKR">PKR</option>
                              </select>
                            </div>

                            <div className="form-group mt-2">
                              <input
                                type="text"
                                name="referralCode"
                                className="form-style"
                                placeholder="Referral Code (Optional)"
                                id="referralCode"
                                autoComplete="off"
                                value={referralCode}
                                onChange={(e) =>
                                  setReferralCode(e.target.value)
                                }
                              />
                              <i className="input-icon uil uil-user-plus" />
                            </div>

                            {errors.register && (
                              <div className="error-message">
                                {errors.register}
                              </div>
                            )}
                            <p className="mb-0 mt-4 text-center">
                              <Link to="/login" className="link">
                                Already have an account? Log In
                              </Link>
                            </p>
                            <button
                              type="submit"
                              className="btn mt-4"
                              disabled={loading}
                            >
                              {loading ? "Loading..." : "Submit"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
