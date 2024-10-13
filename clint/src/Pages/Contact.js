import React, { useState, useEffect } from "react";
import Layout from "../Componet/Layout/Layout";
import "../Styles/Contact.css";
import Spinner from "../Componet/Spinner";

const Contact = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulating a 2-second delay, replace with actual loading logic

    return () => clearTimeout(timer);
  }, []);
  return (
    <Layout title={"Contact Us  Y -Ads"}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <section className="contact" id="contact">
            <h2 className="heading">
              Contact <span>Me!</span>
            </h2>
            <form action="#">
              <div className="input-box">
                <input type="text" placeholder="Full Name" />
                <input type="email" placeholder="Email Address" />
              </div>
              <div className="input-box">
                <input type="number" placeholder="Mobile Number" />
                <input type="text" placeholder="Email Subject" />
              </div>
              <textarea
                name
                id
                cols={30}
                rows={10}
                placeholder="Your Message"
                defaultValue={""}
              />
              <input
                type="submit"
                defaultValue="Send Message"
                className="btn"
              />
            </form>
          </section>
        </>
      )}
    </Layout>
  );
};

export default Contact;
