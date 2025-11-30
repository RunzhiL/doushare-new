const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const User = require("../models/User");
const Item = require("../models/Item");
const Borrow = require("../models/Borrow");


// 1. APPROVE ITEM  (approveItem())
router.put("/items/:id/approve", auth, admin, async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "available" }, // change to available after approval
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Item not found" });

    res.json({
      message: "Item approved successfully",
      item: updated,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// 2. REMOVE USER  (removeUser())
router.delete("/users/:id", auth, admin, async (req, res) => {
  try {
    const removed = await User.findByIdAndDelete(req.params.id);

    if (!removed)
      return res.status(404).json({ error: "User not found" });

    res.json({
      message: "User removed successfully",
      removedUser: removed,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// 3. END BORROW TRANSACTION (endTransaction())
router.put("/borrows/:id/end", auth, admin, async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow)
      return res.status(404).json({ error: "Borrow record not found" });

    borrow.state = "Closed";
    borrow.returned_at = new Date();
    await borrow.save();

    res.json({
      message: "Borrow transaction ended by admin",
      borrow,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// 4. SYSTEM REPORTS (viewReports())
router.get("/reports", auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const activeBorrows = await Borrow.countDocuments({ state: "Active" });
    const closedBorrows = await Borrow.countDocuments({ state: "Closed" });
    const overdueBorrows = await Borrow.countDocuments({
      due_date: { $lt: new Date() },
      state: "Active",
    });

    res.json({
      totalUsers,
      totalItems,
      activeBorrows,
      closedBorrows,
      overdueBorrows,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// OPTIONAL: Get all users (for admin user management UI)
router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// OPTIONAL: Get all borrows (for Borrow Management table)
router.get("/borrows", auth, admin, async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("item_id")
      .populate("borrower_id");

    res.json(borrows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
