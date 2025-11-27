const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Item = require("../models/Item");

// Create a new item (requires authentication)
router.post("/", auth, async (req, res) => {
  try {
    const item = new Item({ ...req.body, owner_id: req.user.id });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all items created by the current user
router.get("/my", auth, async (req, res) => {
  try {
    const myItems = await Item.find({ owner_id: req.user.id });
    res.json(myItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all items (public access)
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific item by ID (public access)
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an item (only the owner can update)
router.put("/:id", auth, async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, owner_id: req.user.id },
      req.body,
      { new: true }
    );
    if (!item) {
      return res.status(403).json({ error: "Not authorized or item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an item (only the owner can delete)
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, owner_id: req.user.id });
    if (!item) {
      return res.status(403).json({ error: "Not authorized or item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Handle item borrow request (example route)
router.post("/:id/request", async (req, res) => {
  const { requestedFrom, requestedTo, message } = req.body;

  console.log("Received borrow request:", {
    itemId: req.params.id,
    requestedFrom,
    requestedTo,
    message,
  });

  // In future: save to Request or Borrow collection
  res.status(201).json({ message: "Borrow request received" });
});

module.exports = router;
