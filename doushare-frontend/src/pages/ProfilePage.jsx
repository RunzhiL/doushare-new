import React, { useEffect, useState } from "react";
import "../styles/ProfilePage.css";
import "../styles/PageContainer.css";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    phone_number: "",
    address: "",
  });


  // Load profile & notifications
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) return;

    setUser(stored);

    // Load notifications
    fetch("http://localhost:3000/api/notifications", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch(() => {});

    // Load profile
    fetch("http://localhost:3000/api/profiles/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (res) => {
        if (res.status === 404) return null; // no profile yet
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setProfile({
            full_name: data.full_name || "",
            phone_number: data.phone_number || "",
            address: data.address || "",
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);


  // Save profile updates
  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/profiles/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        alert("Update failed.");
        return;
      }

      const data = await res.json();

      setProfile({
        full_name: data.full_name || "",
        phone_number: data.phone_number || "",
        address: data.address || "",
      });

      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <div className="page-container">
    <Link to="/login" className="navbar-link">
                <button>Log in</button>
              </Link>
    Not logged in</div>;

  return (
    <div className="page-container profile-page">
      <h2>My Profile</h2>

      <label>Account Name (user.fullName):</label>
      <p>{user.fullName}</p>

      <label>Email:</label>
      <p>{user.email}</p>

      <label>Display Name (Profile.full_name):</label>
      {editMode ? (
        <input
          value={profile.full_name}
          onChange={(e) =>
            setProfile({ ...profile, full_name: e.target.value })
          }
        />
      ) : (
        <p>{profile.full_name || "Not provided"}</p>
      )}

      <label>Phone Number:</label>
      {editMode ? (
        <input
          value={profile.phone_number}
          onChange={(e) =>
            setProfile({ ...profile, phone_number: e.target.value })
          }
        />
      ) : (
        <p>{profile.phone_number || "Not provided"}</p>
      )}

      <label>Address:</label>
      {editMode ? (
        <input
          value={profile.address}
          onChange={(e) =>
            setProfile({ ...profile, address: e.target.value })
          }
        />
      ) : (
        <p>{profile.address || "Not provided"}</p>
      )}

      {editMode ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
      )}

      <hr />

      <button className="logout-btn" onClick={handleLogout}>
        Log Out
      </button>

      <h3>System Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((note) => (
          <div key={note._id} className="notification-card">
            <h4>{note.title}</h4>
            <p>{note.body}</p>
            <span>{new Date(note.createdAt).toLocaleString()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default ProfilePage;
