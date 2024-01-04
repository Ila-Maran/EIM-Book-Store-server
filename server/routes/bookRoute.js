import express from "express";
const router = express.Router();
import {
  getAllBooks,
  createBooks,
  deleteBook,
  updateBook,
} from "../controllers/bookController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.get("/", protect, getAllBooks);
router.post("/create", protect, createBooks);
router.post("/delete", protect, deleteBook);
router.put("/edit", protect, updateBook);

export default router;
