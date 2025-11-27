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

  // When owner clicks Confirm Return
  const handleReturn = async (borrowId) => {
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

    if (res.ok) {
      alert("Return confirmed!");

      // Locally update the returned borrow record
      setLentBorrows((prev) =>
        prev.map((b) =>
          b._id === borrowId ? { ...b, state: "Closed" } : b
        )
      );
    } else {
      alert("Failed to confirm return.");
    }
  };

  return (
    <div className="page-container my-items-container">
      <h2>My Listed Items</h2>

      {items.length === 0 ? (
        <p>You haven't listed any items yet.</p>
      ) : (
        items.map((item) => {
          // Find the borrow record related to this item
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

              {/* If not currently borrowed */}
              {!borrow && <p style={{color:"#888"}}>Not currently borrowed</p>}

              {/* If currently borrowed and still active */}
              {borrow && borrow.state === "Active" && (
                <button onClick={() => handleReturn(borrow._id)}>
                  Confirm Return
                </button>
              )}

              {/* If already returned */}
              {borrow && borrow.state === "Closed" && (
                <p className="returned-text">Returned ✅</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyItemsPage;
