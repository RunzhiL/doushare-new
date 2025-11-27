const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Message = require("../models/Message");

// Create a new message
router.post("/", auth, async (req, res) => {
  try {
    const { conversation_id, receiver_id, content } = req.body;

    const message = await Message.create({
      conversation_id,
      sender_id: req.user.id,
      receiver_id,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all messages in a conversation
router.get("/:conversationId", auth, async (req, res) => {
  try {
    const messages = await Message.find({ conversation_id: req.params.conversationId })
      .sort({ sent_at: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark message as read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { is_read: true },
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
