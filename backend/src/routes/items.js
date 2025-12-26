/**
 * Items Router - Express router for general item management
 * Handles CRUD operations for user items
 */

import express from "express";
import  db  from "../config/db.js";
import { authMiddleware } from "../middleware/auth.js";

export const itemsRouter = express.Router();

itemsRouter.use(authMiddleware);

/**
 * Gets all items for authenticated user
 */
itemsRouter.get("/", async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, description, created_at FROM items WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Creates a new item for authenticated user
 */
itemsRouter.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const [result] = await db.query(
      "INSERT INTO items (user_id, name, description) VALUES (?, ?, ?)",
      [req.user.userId, name, description || null]
    );

    const [rows] = await db.query(
      "SELECT id, name, description, created_at FROM items WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * Gets a specific item by ID for authenticated user
 */
itemsRouter.get("/:id", async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, description, created_at FROM items WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * Updates an item for authenticated user
 */
itemsRouter.put("/:id", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const [result] = await db.query(
      "UPDATE items SET name = ?, description = ? WHERE id = ? AND user_id = ?",
      [name, description || null, req.params.id, req.user.userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    const [rows] = await db.query(
      "SELECT id, name, description, created_at FROM items WHERE id = ?",
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * Deletes an item for authenticated user
 */
itemsRouter.delete("/:id", async (req, res, next) => {
  try {
    const [result] = await db.query(
      "DELETE FROM items WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});


