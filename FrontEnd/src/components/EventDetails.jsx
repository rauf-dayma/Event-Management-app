import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!token) {
        toast.error("Unauthorized! Please login first.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await res.json();
        setEvent(data);
        setAttendeeCount(data.attendees.length);
      } catch (err) {
        console.error("Error fetching event:", err);
        toast.error("Failed to load event details. Please try again later.");
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, token, navigate]);

  const handleJoinEvent = async () => {
    if (!event) {
      toast.error("Event details not found.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: "dummy-user-id" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to join event.");
      }

      setAttendeeCount((prevCount) => prevCount + 1);
      toast.success("You have successfully joined the event!");
    } catch (err) {
      console.error("Error joining event:", err);
      toast.error(err.message || "Failed to join the event. Please try again.");
    }
  };

  const handleEditEvent = () => {
    if (!event) {
      toast.error("Event details not found.");
      return;
    }
    navigate(`/edit-event/${id}`);
  };

  const handleDeleteEvent = async () => {
    if (!event) {
      toast.error("Event details not found.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete event.");
      }

      toast.success("Event deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error(err.message || "Failed to delete event. Please try again.");
    }
  };

  if (loading) return <p className="loading-text">Loading event details...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="event-details-container">
      {event && (
        <>
          <img src={event.image} alt={event.name} className="event-image" />
          <h2>{event.name}</h2>
          <p className="event-description">{event.description}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {new Date(event.date).toLocaleTimeString()}</p>
          <p><strong>Attendees:</strong> {attendeeCount}</p>
          <div className="button-group">
            <button className="join-button" onClick={handleJoinEvent}>Join Event</button>
            <button className="edit-button" onClick={handleEditEvent}>Edit</button>
            <button className="delete-button" onClick={handleDeleteEvent}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventDetails;
