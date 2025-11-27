import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ReviewFormPage.css";
import "../styles/PageContainer.css";

const ReviewFormPage = () => {
  const { borrowId } = useParams();
  const navigate = useNavigate();
  const [borrow, setBorrow] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/borrows/${borrowId}`)
      .then((res) => res.json())
      .then((data) => setBorrow(data));
  }, [borrowId]);

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      alert("Please log in first.");
      return;
    }

    const res = await fetch("http://localhost:3000/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        borrowId,
        rating,
        comment,
        reviewerId: user._id,
        revieweeId: borrow.lenderId,
      }),
    });

    if (res.ok) {
      alert("Review submitted successfully!");
      navigate("/my-borrows");
    } else {
      alert("Submission failed, please try again.");
    }
  };

  if (!borrow) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container review-form-container">
      <h2>Review: {borrow.item?.title || "Item"}</h2>
      <label>Rating (1–5) ⭐️:</label>
      <select
        value={rating}
        onChange={(e) => setRating(parseInt(e.target.value))}
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <label>Comment:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What was your experience like?"
        rows={4}
      />
      <button onClick={handleSubmit}>Submit Review</button>
    </div>
  );
};

export default ReviewFormPage;
