import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./EventDashboard.css";

const EventDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized! Please login first.", {
        position: "top-right",
      });
      navigate("/login");
    }
  }, [token, navigate]);

  const [loader, setLoader] = useState(false);
  const [inputFields, setInputFields] = useState({
    name: "",
    description: "",
    image: "",
    date: "",
    location: ""
  });

  const handleOnChangeInput = (event, name) => {
    setInputFields({
      ...inputFields,
      [name]: event.target.value,
    });
  };

  const uploadImage = async (e) => {
    setLoader(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "assignment-task");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dy6dkn2m9/image/upload",
        data
      );
      const url = response.data.url;
      setLoader(false);
      setInputFields({ ...inputFields, image: url });
    } catch (err) {
      setLoader(false);
      toast.error("Image upload failed, please try again.", {
        position: "top-right",
      });
    }
  };

  const handleCreateEvent = async () => {
    const { name, description, image, date, location } = inputFields;

    if (!name || !description || !image || !date || !location ) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
      });
      return;
    }

    try {
      const API_BASE_URL = "https://event-management-app-0.onrender.com";

      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, image, date, location }),
      });

      const data = await response.json()

      if (response.ok) {
        toast.success("Event created successfully!", { position: "top-right" });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        console.log("hehe")
        toast.error(data.message || "Failed to create event.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="EventDashboard">
      <div className="eventBox">
        <h2>Create Event</h2>

        <div className="eventForm">
          <input
            type="text"
            value={inputFields.name}
            className="eventFormInput"
            onChange={(e) => handleOnChangeInput(e, "name")}
            placeholder="Event Name"
          />
          <textarea
            value={inputFields.description}
            className="eventFormInput"
            onChange={(e) => handleOnChangeInput(e, "description")}
            placeholder="Event Description"
          ></textarea>
          <input
            type="date"
            value={inputFields.date}
            className="eventFormInput"
            onChange={(e) => handleOnChangeInput(e, "date")}
          />
          <input
            type="text"
            value={inputFields.location}
            className="eventFormInput"
            onChange={(e) => handleOnChangeInput(e, "location")}
            placeholder="Location"
          />
          <div>
            Upload Image:
            <input type="file" onChange={uploadImage} accept="image/*" />
          </div>

          {loader && (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          )}
        </div>

        <div className="eventBtns">
          <button className="eventBtn" onClick={handleCreateEvent}>
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
