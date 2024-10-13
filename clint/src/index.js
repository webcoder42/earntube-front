import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./Context/auth";
import ReactGA from "react-ga4";

ReactGA.initialize("G-P42V6XJVC1");

function TrackPageViews() {
  const location = useLocation();

  React.useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <TrackPageViews />
      <App />
    </BrowserRouter>
  </AuthProvider>
);

reportWebVitals();
