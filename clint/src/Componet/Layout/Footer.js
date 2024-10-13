import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import logo from "../../Assets/sitelogo.png";
const Footer = () => {
  const [loading, setLoading] = useState(true);
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");

  const getSiteData = async () => {
    try {
      const { data } = await axios.get(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/title/get-title"
      );
      if (data.titles.length > 0) {
        setSiteTitle(data.titles[0].siteTitle);
        setSiteDescription(data.titles[0].siteDescription); // Corrected siteDescription
      }
    } catch (error) {
      console.error("Something went wrong while fetching site data", error);
    }
  };

  useEffect(() => {
    getSiteData();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulating a 2-second delay, replace with actual loading logic

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="container-fluid bg-white mt-5">
        <div className="row">
          <div className="col-lg-4 p-4">
            <h3 className="h-font fw-bold fs-3 mb-2">
              <h1 style={{ fontSize: "30px" }}>
                {siteTitle ? siteTitle : "Y-Ads"}
              </h1>
            </h3>
            <p className="text-dark">
              <p>
                {siteDescription
                  ? siteDescription
                  : "Welcome to EᵃʳⁿTᵘᵇᵉ💲!.. Here you can earn unlimited money and make your future better. You can earn by watching ads, building a team, and getting a lot of bonuses along with a daily Sunday offer."}
              </p>
            </p>
          </div>

          <div className="col-lg-4 p-4">
            <h5 className="mb-3 text-dark">Follow Us</h5>
            <a
              href="#"
              className="d-inline-block mb-2 text-dark text-decoration-none"
            >
              <FaTwitter /> Twitter
            </a>
            <br />
            <a
              href="#"
              className="d-inline-block mb-2 text-dark text-decoration-none"
            >
              <FaFacebook /> Facebook
            </a>
            <br />
            <a
              href="#"
              className="d-inline-block mb-2 text-dark text-decoration-none"
            >
              <FaInstagram /> Instagram
            </a>
          </div>
          <img
            src={logo}
            alt="Dashboard Logo"
            className="dashboard-logo"
            style={{
              marginTop: "40px",
              borderRadius: "10px",
              width: "200px",
              height: "100px",
              marginLeft: "20px",
            }}
          />
        </div>
      </div>
      <h3 className="text-center bg-dark text-white p-3 m-0">
        Design and Developed by {siteTitle ? siteTitle : "Y-Ads"} WEBDEV
      </h3>
    </>
  );
};

export default Footer;
