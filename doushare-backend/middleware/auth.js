const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
      const authHeader = req.header("Authorization");
      if (!authHeader) {
          return res.status(401).json({ error: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
          return res.status(401).json({ error: "Invalid token format" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
          algorithms: ["HS256"]
      });

      req.user = decoded;
      next();
  } catch (err) {
      console.error("JWT ERROR:", err.message);
      return res.status(401).json({ error: "Token invalid" });
  }

};
