import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NotificationBell = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/api/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          // Handle authentication errors
          if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return null;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!data) return; // Early return if authentication failed
        
        if (data.error === "Token invalid") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }
        
        if (!Array.isArray(data)) {
          console.warn("Notifications API returned non-array:", data);
          return setCount(0);
        }
    
        setCount(data.filter(n => !n.isRead).length);
      })
      .catch(err => {
        console.error("Error fetching notifications:", err);
        setCount(0);
      });
  }, []);

  return (
    <Link to="/profile" style={{ position: "relative", textDecoration: "none", color: "black" }}>
      <span style={{ fontSize: "22px" }}>🔔</span>

      {count > 0 && (
        <span style={{
          position: "absolute",
          top: "-6px",
          right: "-10px",
          backgroundColor: "red",
          color: "white",
          fontSize: "12px",
          padding: "2px 6px",
          borderRadius: "50%",
          fontWeight: "bold"
        }}>
          {count}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
