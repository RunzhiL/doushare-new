import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddItemPage.css";
import "../styles/PageContainer.css";
import defaultItemImage from "../assets/default-item.jpg"

const AddItemPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [location, setLocation] = useState("");
  const [deposit, setDeposit] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");

    try {
      const res = await fetch("http://localhost:3000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          image_url: imageURL.trim() || defaultItemImage,
          pickup_location: location,
          security_deposit: Number(deposit),
          price_per_day: Number(pricePerDay),
        }),
      });

      if (!res.ok) throw new Error("Failed to add item");

      alert("Item added successfully!");
      navigate("/my-items");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="page-container add-item-page">
      <h2>Add a New Item</h2>
      <form onSubmit={handleSubmit} className="add-item-form">
        <input
          type="text"
          placeholder="Item Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="url"
          placeholder="Image URL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Deposit (optional)"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price Per Day"
          value={pricePerDay}
          onChange={(e) => setPricePerDay(e.target.value)}
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItemPage;
