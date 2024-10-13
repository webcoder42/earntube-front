import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/auth";
import toast from "react-hot-toast";
import "../../Styles/Header.css";
import { Link } from "react-scroll";
import { FaMoneyBillWave, FaTasks, FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
const Header = () => {
  const [auth, setAuth] = useAuth();
  const [siteTitle, setSiteTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [packageMembershipDropdownOpen, setPackageMembershipDropdownOpen] =
    useState(false);
  const [Ads, setAds] = useState(false);
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    alert("Logout Successfully");
  };

  const getTitle = async () => {
    try {
      const { data } = await axios.get(
        "https://full-backend-earning-site.onrender.com/api/v1/title/get-title"
      );
      setSiteTitle(data.titles[0]?.siteTitle || "Y-Ads");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getTitle();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleAdsDropdown = () => {
    setAds(!Ads);
  };
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const togglePackageMembershipDropdown = () => {
    setPackageMembershipDropdownOpen(!packageMembershipDropdownOpen);
  };

  return (
    <header className="header" style={{ backgroundColor: "black" }}>
      <NavLink to="/">
        <div className="site-title">{siteTitle}</div>
      </NavLink>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <nav className={`nav ${isOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={closeMenu}>
          ✖
        </button>
        <ul>
          {!auth.user ? (
            <>
              <li>
                <Link
                  to="home"
                  smooth={true}
                  duration={500}
                  className="nav-link"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="how-to-register"
                  smooth={true}
                  duration={500}
                  className="nav-link"
                >
                  How to register
                </Link>
              </li>
              <li>
                <Link
                  to="work"
                  smooth={true}
                  duration={500}
                  className="nav-link"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  to="about"
                  smooth={true}
                  duration={500}
                  className="nav-link"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="contact"
                  smooth={true}
                  duration={500}
                  className="nav-link"
                >
                  Contact Us
                </Link>
              </li>
            </>
          ) : (
            <>
              {auth.user.role === 1 ? (
                <li>
                  <NavLink to="/dashboard/admin" activeclassname="active">
                    Admin Dashboard
                  </NavLink>
                </li>
              ) : (
                <li>
                  <NavLink to="/dashboard/user" activeclassname="active">
                    🏠 User Dashboard
                  </NavLink>
                </li>
              )}
              <li
                className={`dropdown ${
                  packageMembershipDropdownOpen ? "open" : ""
                }`}
              >
                <span
                  className="dropdown-toggle"
                  onClick={togglePackageMembershipDropdown}
                >
                  🏦 Deposite
                </span>
                {packageMembershipDropdownOpen && (
                  <ul className="dropdown-men">
                    <li>
                      <NavLink
                        to="/dashboard/user/buy-package"
                        activeClassName="active"
                      >
                        🎫 Buy Package
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/user/membership"
                        activeClassName="active"
                      >
                        💎 Membership
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`dropdown ${dropdownOpen ? "open" : ""}`}>
                <span className="dropdown-toggle" onClick={toggleDropdown}>
                  💵 Cash Out
                </span>
                {dropdownOpen && (
                  <ul className="dropdown-men">
                    <li>
                      <NavLink
                        to="/dashboard/user/withdrawal"
                        activeClassName="active"
                      >
                        💰 Withdrawal
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/user/withdrawalhistory"
                        activeClassName="active"
                      >
                        📜 Withdrawal History
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/user/proof"
                        activeClassName="active"
                      >
                        📜 Withdrawal Proof
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`dropdown ${Ads ? "open" : ""}`}>
                <span className="dropdown-toggle" onClick={toggleAdsDropdown}>
                  💲Earn Money
                </span>
                {Ads && (
                  <ul className="dropdown-men">
                    <li>
                      <NavLink
                        to="/dashboard/user/ads"
                        activeClassName="active"
                      >
                        <FaYoutube /> Short Earn
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/user/longearn"
                        activeClassName="active"
                      >
                        <FaYoutube /> Long Earn
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/user/usertask"
                        activeClassName="active"
                      >
                        <FaTasks /> Tasks
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/user/longearn"
                        activeClassName="active"
                      >
                        <FaMoneyBillWave /> Auto Earn
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <NavLink
                  to="/dashboard/user/totel-team"
                  activeclassname="active"
                >
                  🤝Teams
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/user/contact-user"
                  activeclassname="active"
                >
                  📞 Contact Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/user/profile" activeClassName="active">
                  👨🏻 {auth.user.username}
                </NavLink>
              </li>
            </>
          )}
        </ul>
        {!auth.user ? (
          <NavLink to="/login">
            <button className="btn login-btn" style={{ marginLeft: "20px" }}>
              Login
            </button>
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className="btn logout-btn "
            style={{ marginLeft: "20px", backgroundColor: "red" }}
            onClick={handleLogout}
            type="Loyout"
          >
            {loading ? "Logout..." : "Logout"}
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Header;
