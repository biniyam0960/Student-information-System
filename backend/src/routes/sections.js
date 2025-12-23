import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import {
  createSectionValidators,
  updateSectionValidators,
  createSectionHandler,
  listSectionsHandler,
  getSectionHandler,
  updateSectionHandler,
  deleteSectionHandler,
} from "../controllers/sectionController.js";

export const sectionRouter = express.Router();

sectionRouter.use(authMiddleware);

sectionRouter.get("/", requireRole("admin", "teacher", "student"), listSectionsHandler);
sectionRouter.get("/:id", requireRole("admin", "teacher", "student"), getSectionHandler);


sectionRouter.post(
  "/",
  requireRole("admin"),
  createSectionValidators,
  validateRequest,
  createSectionHandler
);

sectionRouter.put(
  "/:id",
  requireRole("admin"),
  updateSectionValidators,
  validateRequest,
  updateSectionHandler
);

sectionRouter.delete(
  "/:id",
  requireRole("admin"),
  deleteSectionHandler
);


