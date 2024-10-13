import React, { useState } from "react";
import axios from "axios";
import AdminComponent from "./../../Componet/Layout/AdminComponent";

const SliderImg = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      alert("Please select an image");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("photo", image);

    try {
      const response = await axios.post(
        "https://earning-site-fll-backend-code.onrender.com/api/v1/img/image",
        formData
      );
      alert("Image uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      setError("Image upload failed.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminComponent />
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default SliderImg;
