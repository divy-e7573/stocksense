const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies JWT from `Authorization: Bearer <token>` and attaches req.user.
async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email createdAt");

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    req.user = { id: user._id, name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = auth;
