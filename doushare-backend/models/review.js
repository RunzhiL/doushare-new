const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  borrow_id: { type: mongoose.Schema.Types.ObjectId, ref: "Borrow", required: true },
  reviewer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviewee_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
