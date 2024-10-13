import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import "../../Styles/CreatePackage.css";
import AdminComponent from "../../Componet/Layout/AdminComponent";

const CreateNotification = () => {
  const [auth] = useAuth();
  const [notification, setNotification] = useState("");
  const [heading, setHeading] = useState("");
  const [titles, setTitles] = useState([]);
  const [isCreating, setIsCreating] = useState(false); // To show loader

  // Check for existing notifications
  const checkExistingNotifications = async () => {
    try {
      const { data } = await axios.get(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/notifiication/get-notify"
      );
      return data.announcements.length > 0;
    } catch (error) {
      console.log(error);
      toast.error("Failed to check notifications");
      return false;
    }
  };

  // Handle Create Notification
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setIsCreating(true);

      const hasExistingNotifications = await checkExistingNotifications();
      if (hasExistingNotifications) {
        toast.error(
          "A notification already exists. Please delete it before adding a new one."
        );
        setIsCreating(false);
        return;
      }

      // Create new notification
      const NotificationMessage = { heading, notification };
      const { data } = await axios.post(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/notifiication/add",
        NotificationMessage
      );

      if (data?.success) {
        toast.success(data?.message);
        getAllTitles(); // Refresh titles list
      } else {
        toast.error(data?.message || "Notification creation failed");
      }

      // Reset form fields
      setNotification("");
      setHeading("");
      setIsCreating(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
      setIsCreating(false);
    }
  };

  // Get all Notifications
  const getAllTitles = async () => {
    try {
      const { data } = await axios.get(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/notifiication/get-notify"
      );
      // Ensure data.notifications is an array of objects with a 'notification' string property
      if (Array.isArray(data.announcements)) {
        setTitles(data.announcements);
      } else {
        toast.error("Unexpected data format");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Handle Delete Notification
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/notifiication/delete-notify",
        { data: { id } }
      );
      if (data?.success) {
        toast.success(data?.message);
        getAllTitles(); // Refresh titles list after deletion
      } else {
        toast.error(data?.message || "Notification deletion failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Truncate text to 100 words
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  // Lifecycle method
  useEffect(() => {
    getAllTitles();
  }, []);

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
          <h1>Make Notification</h1>
          <p>
            <span style={{ color: "#e0c10c", fontWeight: "bold" }}>
              👨 {auth?.user?.username}
            </span>
            !
          </p>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <AdminComponent />
          </div>
          <div className="col-md-9">
            <h1 className="text-center p-4 mb-4">Create Notification</h1>

            <div className="notification-form card w-75 p-3 bg-dark text-white mb-3 p-5 w-100">
              <div className="mb-3">
                <input
                  type="text"
                  value={heading}
                  placeholder="Notification heading"
                  className="form-control"
                  onChange={(e) => setHeading(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={notification}
                  placeholder="Notification message"
                  className="form-control"
                  onChange={(e) => setNotification(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <button
                  className="btn btn-primary"
                  style={{ fontSize: "15px", width: "200px" }}
                  onClick={handleCreate}
                  disabled={isCreating} // Disable button while creating
                >
                  {isCreating ? "Creating..." : "CREATE Notification"}
                </button>
              </div>
            </div>

            <h1 className="text-center">Notifications</h1>
            <div className="notification-list">
              {titles.length === 0 ? (
                <p className="text-center">No Notifications</p>
              ) : (
                titles.map((p) => (
                  <div
                    key={p._id}
                    className="notification-item mb-3 p-3 bg-light border rounded"
                  >
                    <h2 style={{ color: "black" }}>{p.heading}</h2>
                    <p>{truncateText(p.notification, 100)}</p>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      DELETE
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNotification;
