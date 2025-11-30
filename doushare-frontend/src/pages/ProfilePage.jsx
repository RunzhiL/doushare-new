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
    <Link to="/login">
      <button>Login</button>
    </Link>
    Not logged in</div>;
 
 
  return (
    <div className="page-container profile-page">
      <div className="profile-wrapper">
        <h2 className="profile-title">My Profile</h2>
 
 
        {/* Account Info Card */}
        <div className="profile-card">
          <h3 className="card-title">Account Information</h3>
          <div className="info-row">
            <label className="info-label">Account Name</label>
            <p className="info-value">{user.fullName}</p>
          </div>
          <div className="info-row">
            <label className="info-label">Email</label>
            <p className="info-value">{user.email}</p>
          </div>
        </div>
 
 
        {/* Profile Details Card */}
        <div className="profile-card">
          <h3 className="card-title">Profile Details</h3>
          <div className="info-row">
            <label className="info-label">Display Name</label>
            {editMode ? (
              <input
                className="profile-input"
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                placeholder="Enter display name"
              />
            ) : (
              <p className="info-value">{profile.full_name || "Not provided"}</p>
            )}
          </div>
          <div className="info-row">
            <label className="info-label">Phone Number</label>
            {editMode ? (
              <input
                className="profile-input"
                value={profile.phone_number}
                onChange={(e) =>
                  setProfile({ ...profile, phone_number: e.target.value })
                }
                placeholder="Enter phone number"
              />
            ) : (
              <p className="info-value">{profile.phone_number || "Not provided"}</p>
            )}
          </div>
          <div className="info-row">
            <label className="info-label">Address</label>
            {editMode ? (
              <input
                className="profile-input"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                placeholder="Enter address"
              />
            ) : (
              <p className="info-value">{profile.address || "Not provided"}</p>
            )}
          </div>
          <div className="button-group">
            {editMode ? (
              <>
                <button className="btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn-secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn-primary" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
 
 
        {/* Notifications Card */}
        <div className="profile-card">
          <h3 className="card-title">System Notifications</h3>
          {notifications.length === 0 ? (
            <p className="no-notifications">No notifications</p>
          ) : (
            <div className="notifications-list">
              {notifications.map((note) => (
                <div key={note._id} className={`notification-card ${!note.isRead ? 'unread' : ''}`}>
                  <h4 className="notification-title">{note.title}</h4>
                  <p className="notification-body">{note.body}</p>
                  <span className="notification-time">
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
 
 
        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};
 
 
export default ProfilePage;