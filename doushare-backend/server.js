const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load all routes
app.use("/api/users", require("./routes/users"));
app.use("/api/items", require("./routes/items"));
app.use("/api/borrows", require("./routes/borrows"));
app.use("/api/requests", require("./routes/requests"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/deposits", require("./routes/deposites"));
app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/messages", require("./routes/massages"));
app.use("/api/profiles", require("./routes/profiles"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/stripe", require("./routes/stripe"));
console.log("Stripe route loaded!");

app.get("/", (req, res) => {
  res.send("DouShare Express + Mongoose API is running.");
});

console.log("Connecting to MongoDB:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error("MongoDB connection failed:", err);
});
