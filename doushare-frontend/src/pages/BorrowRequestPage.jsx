import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/BorrowRequestPage.css";
import "../styles/PageContainer.css";

const BorrowRequestPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [requestedFrom, setRequestedFrom] = useState("");
  const [requestedTo, setRequestedTo] = useState("");
  const [message, setMessage] = useState("");

  // Load item details
  useEffect(() => {
    fetch(`http://localhost:3000/api/items/${itemId}`)
      .then((res) => res.json())
      .then((data) => setItem(data))
      .catch((err) => console.error("Failed to load item", err));
  }, [itemId]);

  const handleSubmit = async () => {

    // ✔ Ensure dates are filled
    if (!requestedFrom || !requestedTo) {
      alert("Please select both start and end dates.");
      return;
    }

    const res = await fetch("http://localhost:3000/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        item_id: itemId,
        requested_from: requestedFrom,
        requested_to: requestedTo,
        message,
      }),
    });

    if (!res.ok) {
      alert("Request failed. Please make sure all fields are filled correctly.");
      return;
    }

    alert("Borrow request submitted! Please wait for the owner's approval.");

    // ✔ redirect to My Borrows (not MyRequests)
    navigate("/my-borrows");
  };

  if (!item) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container borrow-request-container">
      <h2>Borrow: {item.title}</h2>

      <label>
        Start Date:
        <input
          type="date"
          value={requestedFrom}
          onChange={(e) => setRequestedFrom(e.target.value)}
        />
      </label>

      <label>
        End Date:
        <input
          type="date"
          value={requestedTo}
          onChange={(e) => setRequestedTo(e.target.value)}
        />
      </label>

      <label>Message:</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Optional message..."
      />

      <button className="submit-btn" onClick={handleSubmit}>
        Submit Borrow Request
      </button>
    </div>
  );
};

export default BorrowRequestPage;
