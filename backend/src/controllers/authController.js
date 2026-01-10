

import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { signToken } from "../middleware/auth.js";
import { findUserByEmail, findUserById, createUser } from "../models/userModel.js";

// ---------------------
// REGISTER
// ---------------------
export async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password, email, role = "student", first_name, last_name } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const password_hash = await bcrypt.hash(password, 10);

    // Only admin can create non-student roles
    let finalRole = role;
    if (!req.user || req.user.role !== "admin") finalRole = "student";

    const user = await createUser({ username, password_hash, email, role: finalRole, first_name, last_name });

    const token = signToken({ user_ID: user.user_ID, role: user.role, email: user.email });

    res.status(201).json({
      token,
      user: {
        user_ID: user.user_ID,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------
// LOGIN
// ---------------------
export async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    console.log("User at login:", user);

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ user_ID: user.user_ID, role: user.role, email: user.email });

    res.json({
      token,
      user: {
        user_ID: user.user_ID,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------
// CURRENT USER
// ---------------------
export async function me(req, res, next) {
  try {
    const userId = req.user?.user_ID;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      user_ID: user.user_ID,
      username: user.username,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (err) {
    next(err);
  }
}

