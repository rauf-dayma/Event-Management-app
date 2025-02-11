import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from backend API
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <div className="home-container">
      <h2 className="home-title">Upcoming Events</h2>
      <div className="event-list">
        {events.length === 0 ? (
          <p>No events available</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(event.date).toLocaleTimeString()}</p>
              <Link to={`/event/${event._id}`} className="event-button">View Details</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
