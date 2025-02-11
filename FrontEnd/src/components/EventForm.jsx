import React, { useState } from "react";
import "./EventForm.css";

const EventForm = ({ onEventCreated }) => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    image: "",
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    setImageUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setEventData({ ...eventData, image: data.url });
      setImageUploading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://event-management-app-0.onrender.com/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Event created successfully") {
          setMessage("Event created successfully!");
          setEventData({ name: "", description: "", date: "", time: "", image: "" });
          if (onEventCreated) {
            onEventCreated();
          }
        } else {
          setMessage("Failed to create event");
        }
      })
      .catch((err) => {
        console.error("Error creating event:", err);
        setMessage("Error creating event");
      });
  };

  return (
    <div className="event-form-container">
      <h2>Create an Event</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Event Name:</label>
        <input type="text" name="name" value={eventData.name} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={eventData.description} onChange={handleChange} required />

        <label>Date:</label>
        <input type="date" name="date" value={eventData.date} onChange={handleChange} required />

        <label>Time:</label>
        <input type="time" name="time" value={eventData.time} onChange={handleChange} required />

        <label>Event Image:</label>
        <input type="file" onChange={handleImageUpload} accept="image/*" required />
        {imageUploading && <p>Uploading...</p>}

        <button type="submit" className="submit-button">Create Event</button>
      </form>
    </div>
  );
};

export default EventForm;
