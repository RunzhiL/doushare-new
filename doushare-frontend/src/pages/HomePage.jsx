import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/HomePage.css";
import logo from "../assets/transparent-logo.png";

const heroTextVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.15 }
  },
};

const heroChildVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Failed to fetch items", err));
  }, []);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="homepage-container">
      
      {/* HERO */}
      <div className="hero-section">
        <img className="hero-image" src={logo} alt="DouShare logo" />

        <motion.div
          className="hero-text"
          variants={heroTextVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h5 className="hero-title" variants={heroChildVariants}>
            Share and Borrow with Ease
          </motion.h5>
        </motion.div>
      </div>

      {/* SEARCH BAR */}
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search items..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2 className="section-title">Available Items</h2>

      {/* GRID OF CARDS */}
      <div className="items-grid">
        {filteredItems.map((item) => (
          <motion.div 
            key={item._id} 
            className="item-card glass-card"
            whileHover={{ scale: 1.03 }}
          >
            <img
              className="item-thumb"
              src={item.image_url || "https://via.placeholder.com/100"}
            />

            <div className="item-content">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-description">{item.description}</p>

              <div className="item-meta">
                <span>{item.category || "Item"}</span>
                <span className="rating">★ 4.5</span>
              </div>

              <div className="item-buttons">
                <Link to={`/item/${item._id}`} className="item-btn detail-btn">
                  Details
                </Link>
                <button className="item-btn contact-btn">
                  Contact Owner
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
