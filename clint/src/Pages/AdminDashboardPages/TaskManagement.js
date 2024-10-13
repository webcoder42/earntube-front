import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/Task.css";
import AdminComponent from "./../../Componet/Layout/AdminComponent";

function TaskManagement() {
  const [taskType, setTaskType] = useState("");
  const [currency, setCurrency] = useState("USD"); // Default currency
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    referralRequirement: "",
    offerDay: "",
    Links: "",
    monthlyDay: "",
    price: "",
    reward: "",
    followLink: "",
  });
  const [tasks, setTasks] = useState([]); // To store tasks fetched from backend
  const [loading, setLoading] = useState(false);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/v1/task/get-task"
      );
      setTasks(response.data.tasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when component loads
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle task creation
  const handleCreateTask = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/task/create-task",
        {
          taskType,
          currency, // Include currency in the request
          ...formData,
        }
      );
      alert("Task created successfully!");
      fetchTasks(); // Refetch tasks after creation
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    }
  };

  // Handle task deletion

  // Separate tasks by currency
  const usdTasks = tasks.filter((task) => task.currency === "USD");
  const pkrTasks = tasks.filter((task) => task.currency === "PKR");
  const handleDelete = async (taskId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/task/delete-task/${taskId}`
      );
      setSuccess(response.data.message);
      setError("");
      fetchTasks(); // Refresh the task list
    } catch (error) {
      setError(error.response.data.error || "Internal server error");
      setSuccess("");
    }
  };
  return (
    <div>
      <AdminComponent />
      {/* Task Type and Currency Selection */}
      <div>
        <label htmlFor="taskType">Select Task Type:</label>
        <select
          id="taskType"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
        >
          <option value="">Select a task type</option>
          <option value="referral">Referral</option>
          <option value="sundayOffer">Sunday Offer</option>
          <option value="link">Link</option>
          <option value="monthlyOffer">Monthly Offer</option>
        </select>

        <label htmlFor="currency">Select Currency:</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="PKR">PKR</option>
        </select>
      </div>

      {/* Dynamic Form Based on Task Type */}
      {taskType && (
        <div>
          {taskType === "referral" && (
            <div>
              <label htmlFor="referralRequirement">Referral Requirement:</label>
              <input
                type="number"
                id="referralRequirement"
                name="referralRequirement"
                value={formData.referralRequirement}
                onChange={handleInputChange}
              />
            </div>
          )}

          {taskType === "link" && (
            <div>
              <label htmlFor="Links">Link:</label>
              <input
                type="text"
                id="Links"
                name="Links"
                value={formData.Links}
                onChange={handleInputChange}
              />
            </div>
          )}

          {taskType === "sundayOffer" && (
            <div>
              <label htmlFor="offerDay">Offer Day:</label>
              <input
                type="text"
                id="offerDay"
                name="offerDay"
                value={formData.offerDay}
                onChange={handleInputChange}
              />
            </div>
          )}

          {taskType === "monthlyOffer" && (
            <div>
              <label htmlFor="monthlyDay">Monthly Day:</label>
              <input
                type="text"
                id="monthlyDay"
                name="monthlyDay"
                value={formData.monthlyDay}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Common Fields */}
          <div>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="reward">Reward:</label>
            <input
              type="text"
              id="reward"
              name="reward"
              value={formData.reward}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="followLink">Follow Link (Optional):</label>
            <input
              type="text"
              id="followLink"
              name="followLink"
              value={formData.followLink}
              onChange={handleInputChange}
            />
          </div>

          {/* Create Task Button */}
          <button onClick={handleCreateTask}>Create Task</button>
        </div>
      )}

      {/* Display USD Tasks */}
      <div>
        <h3>Created Tasks (USD)</h3>
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Task Type</th>
                <th>Referral Requirement</th>
                <th>Link</th>
                <th>Offer Day</th>
                <th>Monthly Day</th>
                <th>Price</th>
                <th>Reward</th>
                <th>Follow Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usdTasks.length > 0 ? (
                usdTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.taskType}</td>
                    <td>{task.referralRequirement || "N/A"}</td>
                    <td>{task.Links || "N/A"}</td>
                    <td>{task.offerDay || "N/A"}</td>
                    <td>{task.monthlyDay || "N/A"}</td>
                    <td>{task.price}</td>
                    <td>{task.reward}</td>
                    <td>{task.followLink || "N/A"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No USD tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Display PKR Tasks */}
      <div>
        <h3>Created Tasks (PKR)</h3>
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Task Type</th>
                <th>Referral Requirement</th>
                <th>Link</th>
                <th>Offer Day</th>
                <th>Monthly Day</th>
                <th>Price</th>
                <th>Reward</th>
                <th>Follow Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pkrTasks.length > 0 ? (
                pkrTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.taskType}</td>
                    <td>{task.referralRequirement || "N/A"}</td>
                    <td>{task.Links || "N/A"}</td>
                    <td>{task.offerDay || "N/A"}</td>
                    <td>{task.monthlyDay || "N/A"}</td>
                    <td>{task.price}</td>
                    <td>{task.reward}</td>
                    <td>{task.followLink || "N/A"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No PKR tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TaskManagement;
