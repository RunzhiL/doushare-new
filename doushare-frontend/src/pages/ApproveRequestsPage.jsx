import React, { useEffect, useState } from "react";
import "../styles/ApproveRequestPage.css";
import "../styles/PageContainer.css";

const ApproveRequestsPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/requests/received", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setRequests(data));
  }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`http://localhost:3000/api/requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      setRequests(prev =>
        prev.map(r => (r._id === id ? { ...r, status } : r))
      );
      alert("Status updated successfully!");
    } else {
      alert("Update failed");
    }
  };

  return (
    <div className="page-container approve-requests-container">
      <h2 className="approve-title">Approve Borrow Requests</h2>

      {requests.length === 0 && (
        <p className="no-requests">No pending requests</p>
      )}

      {requests.map(req => (
        <div key={req._id} className="request-card">

          <p><strong>Item:</strong> {req.item_id?.title}</p>
          <p>
            <strong>Borrow Period:</strong>{" "}
            {req.requested_from?.slice(0, 10)} → {req.requested_to?.slice(0, 10)}
          </p>
          <p><strong>Message:</strong> {req.message}</p>

          <p className={`request-status status-${req.status}`}>
            <strong>Status:</strong> {req.status}
          </p>

          {req.status === "pending" && (
            <div className="request-buttons">
              <button
                className="request-btn btn-approve"
                onClick={() => updateStatus(req._id, "approved")}
              >
                Approve
              </button>

              <button
                className="request-btn btn-reject"
                onClick={() => updateStatus(req._id, "rejected")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApproveRequestsPage;
