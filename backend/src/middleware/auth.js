// src/middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// Authenticate JWT
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.setHeader(
      "WWW-Authenticate",
      'Bearer realm="Access to the protected resource"'
    );
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.setHeader(
      "WWW-Authenticate",
      'Bearer realm="Access to the protected resource"'
    );
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Role-based access (403)
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      res.setHeader(
        "WWW-Authenticate",
        'Bearer realm="Access to the protected resource"'
      );
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient role" });
    }

    next();
  };
}

// Sign JWT
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}
  
