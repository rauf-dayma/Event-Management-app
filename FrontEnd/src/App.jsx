import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"; // Import CSS file

// Lazy Loaded Components
const Home = lazy(() => import("./components/Home.jsx"));
const Login = lazy(() => import("./components/Login.jsx"));
const Register = lazy(() => import("./components/Register.jsx"));
const EventDashboard = lazy(() => import("./components/EventDashboard.jsx"));
const EventDetails = lazy(() => import("./components/EventDetails.jsx"));
const EditEvent = lazy(() => import("./components/EditEvent.jsx"));

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar stays outside the gradient */}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="page-content"> {/* Wrapper for Background Gradient */}
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventDashboard />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
