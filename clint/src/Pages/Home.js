import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/Home.css"; // Ensure this path is correct

import { useAuth } from "../Context/auth";
import axios from "axios";
import Swiper from "swiper";
import ScrollReveal from "scrollreveal";

import toast from "react-hot-toast";

import Layout from "./../Componet/Layout/Layout";
import Spinner from "./../Componet/Spinner";

const Home = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");

  useEffect(() => {
    const menuIcon = document.querySelector("#menu-icon");
    const navbar = document.querySelector(".navbar");
    const darkModeIcon = document.querySelector("#darkMode-icon");

    const handleMenuIconClick = () => {
      menuIcon.classList.toggle("bx-x");
      navbar.classList.toggle("active");
    };

    const handleDarkModeToggle = () => {
      darkModeIcon.classList.toggle("bx-sun");
      document.body.classList.toggle("dark-mode");
    };

    menuIcon?.addEventListener("click", handleMenuIconClick);
    darkModeIcon?.addEventListener("click", handleDarkModeToggle);

    const swiper = new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 50,
      loop: true,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    ScrollReveal({
      distance: "80px",
      duration: 2000,
      delay: 200,
    });

    ScrollReveal().reveal(".home-content, .heading", { origin: "top" });
    ScrollReveal().reveal(
      ".home-img img, .services-container, .portfolio-box, .testimonial-wrapper, .contact form",
      { origin: "bottom" }
    );
    ScrollReveal().reveal(".home-content h1, .about-img img", {
      origin: "left",
    });
    ScrollReveal().reveal(".home-content h3, .home-content p, .about-content", {
      origin: "right",
    });

    return () => {
      menuIcon?.removeEventListener("click", handleMenuIconClick);
      darkModeIcon?.removeEventListener("click", handleDarkModeToggle);
    };
  }, []);

  const getTitle = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/title/get-title"
      );
      setSiteTitle(data.titles[0]?.siteTitle || "Y-Ads");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTitle();
  }, []);

  return (
    <Layout title={"Home Page"}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <section className="home" id="home" style={{ marginTop: "100px" }}>
            <div className="home-content">
              <h3>Welcome To</h3>
              <h1>
                {siteTitle ? (
                  <NavLink to={"/"}>
                    <span style={{ color: "#00ffee" }}>{siteTitle}</span>
                  </NavLink>
                ) : (
                  ""
                )}
              </h1>
              <p>
                {siteDescription
                  ? siteDescription
                  : `Welcome to ${siteTitle}!.. Here you can earn unlimited money and make your future better. You can earn by watching ads, building a team, and getting a lot of bonuses along with a daily Sunday offer.
.`}
              </p>

              <div className="social-media">
                <a
                  href="https://www.facebook.com/profile.php?id=61564420751716"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/earntube_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.youtube.com/@earntubeofficial1?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube />
                </a>
              </div>
              {!auth.user ? (
                <div className="btn-group">
                  <a className="btn" onClick={() => navigate("/login")}>
                    Get Start
                  </a>
                </div>
              ) : (
                <div className="btn-group">
                  <a
                    className="btn"
                    onClick={() =>
                      navigate(
                        `/dashboard/${auth.user.role === 1 ? "admin" : "user"}`
                      )
                    }
                  >
                    Dashboard
                  </a>
                </div>
              )}
            </div>
            <div
              className="profession-container"
              style={{ overflow: "hidden", marginTop: "100px" }}
            >
              <div className="profession-box">
                <div className="profession" style={{ "--i": 0 }}>
                  <i className="bx bx-code-alt" />
                  <h3>Watch Ads</h3>
                </div>

                <div className="profession" style={{ "--i": 1 }}>
                  <i className="bx bx-camera" />
                  <h3>Referral Commission</h3>
                </div>
                <div className="profession" style={{ "--i": 2 }}>
                  <i className="bx bx-code" />
                  <h3>Daily Sunday Offers</h3>
                </div>
                <div className="profession" style={{ "--i": 3 }}>
                  <i className="bx bx-game" />
                  <h3>Unlimited Bonus</h3>
                </div>
              </div>
              <div className="overlay" />
            </div>
            <div className="home-img">
              <img src="images/logo.png" alt="Logo" />
            </div>
          </section>
          <section className="how-to-register" id="how-to-register">
            <h2 className="heading">
              How to <span>Register</span>
            </h2>
            <div className="how-to-register-container">
              <div className="step-box">
                <h3>Step 1</h3>
                <p>
                  Go to the registration page by clicking the "Register" button
                  on the top right corner.
                </p>
              </div>
              <div className="step-box">
                <h3>Step 2</h3>
                <p>
                  Fill in the required information such as your name, email, and
                  password.
                </p>
              </div>

              <div className="step-box">
                <h3>Step 3</h3>
                <p>
                  Log in with your email and password to start using the
                  platform.
                </p>
              </div>
            </div>
            <div class="ratio ratio-4x3">
              <iframe
                id="youtube-iframe"
                src="https://www.youtube.com/embed/uSk3UN4WRRU?autoplay=1&mute=1&loop=1&playlist=uSk3UN4WRRU"
                title="YouTube video"
                allowfullscreen
              ></iframe>
            </div>
          </section>
          <section className="about" id="about">
            <div className="about-content">
              <h2 className="heading">
                About <span>Me</span>
              </h2>
              <h3>
                Hi there, welcome to {siteTitle} . I'm CEO of this company, we
                give you all the great apportunity to money by home and make
                your future bridge. This is the golden chance to earn money with
                small investement.
              </h3>
              <p>
                On this site you can earn with different way like by watching
                ads , refferal commission , Sunday Offer , Bouses , and alot of
                prizes. So this is the great apportunity for all memebers tu
                generate a great income.
              </p>
              <p>
                Thank you for visiting my website and getting to know me better.
                I hope you enjoyed here.
              </p>
              <a href="#" className="btn">
                Read More
              </a>
            </div>
          </section>
          <section className="services" id="work">
            <h2 className="heading">
              Earn <span>By</span>
            </h2>
            <div className="services-container">
              <div className="services-box">
                <i className="bx bx-code-alt" />
                <h3>Short Earn</h3>
                <p>
                  In short earn you have some short ads almost depend on ypur
                  package that you watch daily and earn money
                </p>
              </div>
              <div className="services-box">
                <i className="bx bx-server" />
                <h3>Long Earn</h3>
                <p>Coming Soon</p>
              </div>
              <div className="services-box">
                <i className="bx bx-code-block" />
                <h3>Refferal Commission </h3>
                <p>Invite your friend and family and make your income fast.</p>
              </div>
              <div className="services-box">
                <i className="bx bx-code-block" />
                <h3>Bonus Commission </h3>
                <p>
                  We are also provide the bonus to different people as depend on
                  her record.
                </p>
              </div>
              <div className="services-box">
                <i className="bx bx-code-block" />
                <h3>Daily Sunday Offer </h3>
                <p>
                  We are also make a sunday offer on every week so this is also
                  the golden chance for make income fast
                </p>
              </div>
            </div>
          </section>

          {/* contact section design */}
          <section className="contact" id="contact">
            <h2 className="heading">
              Contact <span>Me!</span>
            </h2>
            <form action="#">
              <div className="input-box">
                <input type="text" placeholder="Full Name" />
                <input type="email" placeholder="Email" />
              </div>
              <div className="input-box">
                <input type="number" placeholder="Mobile Number" />
                <input type="text" placeholder="Email Subject" />
              </div>
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                placeholder="Message"
              />
              <input type="submit" value="Send Message" className="btn" />
            </form>
          </section>
        </>
      )}
    </Layout>
  );
};

export default Home;
