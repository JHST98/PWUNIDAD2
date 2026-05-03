import express from "express";
import { mostrarChat } from "../controllers/chatController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/chat", isAuthenticated, mostrarChat);

export default router;