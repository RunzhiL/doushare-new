const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");

// ✅ 创建新对话
router.post("/", async (req, res) => {
  try {
    const { item_id, borrower_id, owner_id } = req.body;
    const convo = await Conversation.create({ item_id, borrower_id, owner_id });
    res.status(201).json(convo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 获取所有对话（可选带条件）
router.get("/", async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate("item_id")
      .populate("borrower_id", "fullName email")
      .populate("owner_id", "fullName email");
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 获取特定用户的对话
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({
      $or: [{ borrower_id: userId }, { owner_id: userId }],
    }).populate("item_id");
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
