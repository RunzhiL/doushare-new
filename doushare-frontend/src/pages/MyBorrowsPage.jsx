import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyBorrowsPage.css";
import "../styles/PageContainer.css";

const MyBorrowsPage = () => {
  const [borrows, setBorrows] = useState([]);
  const navigate = useNavigate();

  // Load all borrows for current user
  useEffect(() => {
    fetch("http://localhost:3000/api/borrows/my", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBorrows(data))
      .catch((err) => console.error("Failed to load borrows", err));
  }, []);

  // Cancel borrow function
  const handleCancel = async (borrowId) => {
    if (!window.confirm("Are you sure you want to cancel this borrow?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/borrows/${borrowId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        alert("Failed to cancel borrow.");
        return;
      }

      alert("Borrow cancelled successfully!");

      // Remove cancelled borrow from list
      setBorrows((prev) => prev.filter((b) => b._id !== borrowId));
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Error canceling borrow.");
    }
  };

  return (
    <div className="page-container my-borrows-container">
      <h2>My Borrowed Items</h2>

      {borrows.length === 0 ? (
        <p>No borrow records yet.</p>
      ) : (
        borrows.map((borrow) => (
          <div key={borrow._id} className="borrow-card">
            <h3>{borrow.item_id?.title}</h3>

            <p>
              Borrow Period: {borrow.start_date?.slice(0, 10)} →{" "}
              {borrow.due_date?.slice(0, 10)}
            </p>

            <p>
              Status: <strong>{borrow.state}</strong>
            </p>

            {/* Payment + Cancel Buttons (only before payment) */}
            {borrow.state === "Active" &&
              borrow.payment_status !== "completed" && (
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => navigate(`/payment/${borrow._id}`)}
                    className="pay-button"
                  >
                    Proceed to Payment
                  </button>

                  <button
                    className="cancel-button"
                    onClick={() => handleCancel(borrow._id)}
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "#cc3333",
                      color: "white",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Cancel Borrow
                  </button>
                </div>
              )}

            {/* Paid Status */}
            {borrow.payment_status === "completed" && (
              <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
                Paid ✔
              </p>
            )}

            {/* Write Review button (only when returned) */}
            {borrow.state === "Closed" && (
              <button
                className="review-button"
                onClick={() => navigate(`/review/${borrow._id}`)}
                style={{
                marginTop: "10px",
                backgroundColor: "#0077cc",
                color: "white",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
           >
             Write a Review
            </button>
          )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyBorrowsPage;
