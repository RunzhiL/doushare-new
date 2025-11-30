const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Review = require("../models/review");

// Create a review
router.post("/", auth, async (req, res) => {
  try {
    const { borrow_id, reviewee_id, rating, comment } = req.body;

    const review = await Review.create({
      borrow_id,
      reviewer_id: req.user.id,
      reviewee_id,
      rating,
      comment,
    });


    const Borrow = require("../models/Borrow");
    const Item = require("../models/Item");

    const borrow = await Borrow.findById(borrow_id);
    if (!borrow) {
      return res.status(404).json({ error: "Borrow not found" });
    }

    const itemId = borrow.item_id;

    await Item.findByIdAndUpdate(itemId, {
      $push: { reviews: review._id },
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all reviews received by a specific user
router.get("/user/:id", async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee_id: req.params.id }).populate("reviewer_id", "fullName");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a review (only by the author or admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.reviewer_id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await review.remove();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
