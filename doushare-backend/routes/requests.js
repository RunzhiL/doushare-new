const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Request = require("../models/Request");
const Item = require("../models/Item");
const Borrow = require("../models/Borrow");
const Notification = require("../models/Notification");

// ----------------------------------------------------------
// 1. Create a borrow request (Submit Borrow Request)
// ----------------------------------------------------------
router.post("/", auth, async (req, res) => {
  try {
    const { item_id, requested_from, requested_to, message } = req.body;

    const item = await Item.findById(item_id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    const request = await Request.create({
      item_id,
      borrower_id: req.user.id, // user from JWT token
      owner_id: item.owner_id,
      requested_from,
      requested_to,
      message,
      status: "pending"
    });

    // Notify the owner
    await Notification.create({
      user_id: item.owner_id,
      title: "New Borrow Request",
      body: `${req.user.fullName || "A user"} wants to borrow your item: ${item.title}`
    });

    res.status(201).json(request);

  } catch (err) {
    console.error(" CREATE REQUEST ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------------
// 2. Borrower: View their own submitted requests
// ----------------------------------------------------------
router.get("/myrequests", auth, async (req, res) => {
  try {
    const requests = await Request.find({ borrower_id: req.user.id })
      .populate("item_id");

    res.json(requests);
  } catch (err) {
    console.error(" ERROR in /myrequests:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------
// 3. Owner: View all incoming requests (for approval page)
// ----------------------------------------------------------
router.get("/received", auth, async (req, res) => {
  try {
    const received = await Request.find({ owner_id: req.user.id })
      .populate("item_id")
      .populate("borrower_id");

    res.json(received);
  } catch (err) {
    console.error("🔥 ERROR in /received:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------
// 4. Get a single request (used by PaymentPage)
// ----------------------------------------------------------
router.get("/:id", auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("item_id")
      .populate("borrower_id");

    if (!request) return res.status(404).json({ error: "Request not found" });

    res.json(request);

  } catch (err) {
    console.error("🔥 ERROR in GET /:id", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------
// 5. Owner approves / rejects the request
// ----------------------------------------------------------
router.put("/:id", auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("item_id");

    if (!request) return res.status(404).json({ error: "Request not found" });

    // Only the item owner can approve/reject
    if (request.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const newStatus = req.body.status;

    if (!["approved", "rejected"].includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Update request status
    request.status = newStatus;
    await request.save();

    // ------------------------------------------------------
    // ⭐⭐⭐ Approve → Automatically create Borrow record ⭐⭐⭐
    // ------------------------------------------------------
    if (newStatus === "approved") {

      await Borrow.create({
        request_id: request._id,
        item_id: request.item_id._id,
        borrower_id: request.borrower_id,
        lender_id: request.owner_id,
        start_date: request.requested_from,
        due_date: request.requested_to,
        state: "Active",
        payment_status: "pending"
      });

      // Optionally update item status
      request.item_id.status = "borrowed";
      await request.item_id.save();

      // Notify borrower
      await Notification.create({
        user_id: request.borrower_id,
        title: "Borrow Request Approved",
        body: `Your borrow request for "${request.item_id.title}" has been approved! Please proceed to the “My Borrows” page to complete the payment.`
      });
    }

    // ------------------------------------------------------
    // Reject
    // ------------------------------------------------------
    if (newStatus === "rejected") {
      await Notification.create({
        user_id: request.borrower_id,
        title: "Borrow Request Rejected",
        body: `Your borrow request for "${request.item_id.title}" has been rejected.`
      });
    }

    res.json(request);

  } catch (err) {
    console.error("🔥 ERROR in APPROVE/REJECT:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
