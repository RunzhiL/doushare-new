// middleware/admin.js

module.exports = function (req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }
  
      // 必须是 admin 才能访问
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied: Admins only" });
      }
  
      next();
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  };
  