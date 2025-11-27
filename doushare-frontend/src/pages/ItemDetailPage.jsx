import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/ItemDetailPage.css";
import "../styles/PageContainer.css";

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/items/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data))
      .catch((err) => console.error("Failed to obtain the item.", err));
  }, [id]);

  if (!item)
    return <div className="page-container item-detail-page">Loading...</div>;

  console.log("Detail item:", item);

  return (
    <div className="page-container item-detail-page">
  
      <div className="item-detail-card">
  
        <div className="item-detail-left">
          <img
            className="item-image-large"
            src={item.image_url || "https://via.placeholder.com/600"}
            alt={item.title}
          />
        </div>
  
        <div className="item-detail-right">
          <h1 className="item-title-large">{item.title}</h1>
  
          <div className="price-section">
            <p className="item-price">${item.price_per_day} / day</p>
            <p className="item-deposit">Deposit: ${item.security_deposit}</p>
          </div>
  
          <span
            className={`item-status-tag ${
              item.status === "available" ? "available" : "unavailable"
            }`}
          >
            {item.status === "available" ? "Available" : "Unavailable"}
          </span>
  
          <Link to={`/borrow/${item._id}`}>
            <button className="borrow-btn">Borrow Now</button>
          </Link>
  
          <div className="info-block">
            <h3 className="section-title">Description</h3>
            <p>{item.description}</p>
          </div>
  
          <div className="info-block">
            <h3 className="section-title">Pickup Location</h3>
            <p>{item.pickup_location}</p>
          </div>
        </div>
  
      </div>
  
      <div className="reviews-section">
        <Link to={`/chat/${item._id}/${item.owner_id}`} className="chat-link">
          Chat with Owner →
        </Link>
  
        <h3 className="section-title">Reviews</h3>
  
        {item.reviews?.length > 0 ? (
          item.reviews.map((review, i) => (
            <div key={i} className="review-block">
              <strong>{review.reviewerName}</strong> ⭐ {review.rating}/5
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
  
    </div>
  );
  
};

export default ItemDetailPage;
