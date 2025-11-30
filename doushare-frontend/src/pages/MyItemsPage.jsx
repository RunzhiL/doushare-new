import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/MyItemsPage.css";
import "../styles/PageContainer.css";

const MyItemsPage = () => {
  const [items, setItems] = useState([]);
  const [lentBorrows, setLentBorrows] = useState([]);

  useEffect(() => {
    // Load items I listed
    fetch("http://localhost:3000/api/items/my", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => res.json())
      .then((data) => setItems(data));

    // Load borrow records where I am the lender
    fetch("http://localhost:3000/api/borrows/lent", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => res.json())
      .then((data) => setLentBorrows(data));
  }, []);

  // Correct Confirm Return logic (Close + Refund)
  const handleReturn = async (borrow) => {
    const borrowId = borrow._id;

    // 1. Mark borrow as closed
    const res = await fetch(`http://localhost:3000/api/borrows/${borrowId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        state: "Closed",
        returned_at: new Date(),
      }),
    });

    if (!res.ok) {
      alert("Failed to confirm return.");
      return;
    }

    // 2. Refund deposit if exists
    if (borrow.deposit_id) {
      const refundRes = await fetch(
        `http://localhost:3000/api/stripe/deposit/${borrow.deposit_id}/refund`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!refundRes.ok) {
        alert("Return confirmed, but refund failed!");
        return;
      }
    }

    alert("Return confirmed & Deposit refunded!");

    // Update UI
    setLentBorrows((prev) =>
      prev.map((b) => (b._id === borrowId ? { ...b, state: "Closed" } : b))
    );
  };

  // Delete an item
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const res = await fetch(`http://localhost:3000/api/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      alert("Item deleted successfully!");
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    } else {
      alert("Failed to delete item.");
    }
  };

  return (
    <div className="page-container my-items-container">
      <h2>My Listed Items</h2>

      {items.length === 0 ? (
        <p>You haven't listed any items yet.</p>
      ) : (
        items.map((item) => {
          const borrow = lentBorrows.find(
            (b) => b.item_id?._id === item._id
          );

          return (
            <div key={item._id} className="item-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <p>
                <strong>Status:</strong> {item.status}
              </p>

              <Link to={`/item/${item._id}`}>
                <button>View Details</button>
              </Link>

              <Link to={`/chat/${item._id}/${item.owner_id}`}>
                <button>Chat</button>
              </Link>

              {!borrow && <p style={{ color: "#888" }}>Not currently borrowed</p>}

              {borrow && borrow.state === "Active" && (
                <button onClick={() => handleReturn(borrow)}>
                  Confirm Return
                </button>
              )}

              {borrow && borrow.state === "Closed" && (
                <p className="returned-text">Returned ✅</p>
              )}

              <button
                onClick={() => handleDelete(item._id)}
                style={{
                  marginTop: "10px",
                  backgroundColor: "#cc3333",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete Item
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyItemsPage;
