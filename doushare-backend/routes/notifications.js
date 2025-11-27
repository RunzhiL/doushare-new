const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Notification = require("../models/Notification");

// Get all notifications for the current user
router.get("/", auth, async (req, res) => {
  const notes = await Notification.find({ user_id: req.user.id })
    .sort({ createdAt: -1 });
  res.json(notes);
});

// Mark a notification as read
router.put("/:id/read", auth, async (req, res) => {
  const note = await Notification.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user.id },
    { isRead: true },
    { new: true }
  );
  res.json(note);
});

module.exports = router;
