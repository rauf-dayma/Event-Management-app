import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./EditEvent.css";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  const [inputFields, setInputFields] = useState({
    name: "",
    description: "",
    image: "",
    date: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized! Please log in first.");
      navigate("/login");
    } else {
      fetchEventDetails();
    }
  }, [token, navigate]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch event details");

      const data = await response.json();
      setInputFields({
        name: data.name,
        description: data.description,
        image: data.image,
        date: data.date.split("T")[0], // Formatting date for input field
        location: data.location,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChangeInput = (event, name) => {
    setInputFields({
      ...inputFields,
      [name]: event.target.value,
    });
  };

  const uploadImage = async (e) => {
    setImageUploading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "assignment-task");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dy6dkn2m9/image/upload",
        data
      );
      setInputFields({ ...inputFields, image: response.data.url });
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleUpdateEvent = async () => {
    const { name, description, image, date, location } = inputFields;

    if (!name || !description || !date || !location) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, image, date, location }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Event updated successfully!");
        setTimeout(() => {
          navigate(`/event/${id}`);
        }, 1000);
      } else {
        toast.error(data.message || "Failed to update event.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) return <p className="loading-text">Loading event details...</p>;

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>
      <div className="event-form">
        <input
          type="text"
          value={inputFields.name}
          className="event-form-input"
          onChange={(e) => handleOnChangeInput(e, "name")}
          placeholder="Event Name"
        />
        <textarea
          value={inputFields.description}
          className="event-form-input"
          onChange={(e) => handleOnChangeInput(e, "description")}
          placeholder="Event Description"
        ></textarea>
        <input
          type="date"
          value={inputFields.date}
          className="event-form-input"
          onChange={(e) => handleOnChangeInput(e, "date")}
        />
        <input
          type="text"
          value={inputFields.location}
          className="event-form-input"
          onChange={(e) => handleOnChangeInput(e, "location")}
          placeholder="Location"
        />

        <div className="image-upload-section">
          <label>Event Image:</label>
          <input type="file" onChange={uploadImage} accept="image/*" />
          {imageUploading && (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          )}
          {inputFields.image && <img src={inputFields.image} alt="Event" className="event-image-preview" />}
        </div>

        <div className="event-btns">
          <button className="update-btn" onClick={handleUpdateEvent}>
            Update Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
