import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyBorrowsPage.css";
import "../styles/PageContainer.css";

const MyBorrowsPage = () => {
  const [borrows, setBorrows] = useState([]);
  const navigate = useNavigate();

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

            {/*Payment button (show only when NOT paid) */}
            {borrow.state === "Active" &&
              borrow.payment_status !== "completed" && (
                <button
                  onClick={() => navigate(`/payment/${borrow._id}`)}
                  className="pay-button"
                >
                  Proceed to Payment
                </button>
              )}

            {/*Paid */}
            {borrow.payment_status === "completed" && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                Paid ✔
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyBorrowsPage;
