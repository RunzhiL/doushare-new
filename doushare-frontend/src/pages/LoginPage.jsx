import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      console.log("Login successful", data);

      // const userData = {
      //   ...data.user,
      //   _id: data.user.id
      // };

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err.message);
      alert("Login failed");
    }
  };

  return (
    <div className="login-page">
      <h1>Borrow. Share. Connect.</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome Back to DouShare</h2>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
        <p>
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
