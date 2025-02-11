import { toast } from "react-toastify";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; 

function Register() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      toast.error("All fields are required.", { position: "top-right" });
      return;
    }

    console.log("Registering user:", name, email, password);
    try {
      const url = `http://localhost:5000/api/auth/register`; // Adjust API endpoint
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();

      if (response.status === 201) {
        toast.success("Registration successful! Please login.", {
          position: "top-right",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(result.message || "Registration failed. Try again.", {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Signup</h1>
      <form onSubmit={handleSignup} className="login-form">
        <div>
          <label className="login-label" htmlFor="name">
            Name
          </label>
          <input
            onChange={handleChange}
            className="login-input-field"
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={signupInfo.name}
          />
        </div>
        <div>
          <label className="login-label" htmlFor="email">
            Email
          </label>
          <input
            onChange={handleChange}
            className="login-input-field"
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={signupInfo.email}
          />
        </div>
        <div>
          <label className="login-label" htmlFor="password">
            Password
          </label>
          <input
            onChange={handleChange}
            className="login-input-field"
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={signupInfo.password}
          />
        </div>
        <button type="submit" className="login-button">
          Signup
        </button>
        <span className="login-span">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Register;
