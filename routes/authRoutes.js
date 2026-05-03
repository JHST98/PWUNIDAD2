import express from "express";
import { mostrarLogin, procesarLogin, mostrarRegistro, procesarRegistro, logout } from "../controllers/authController.js";
import { validarLogin, validarRegistro } from "../middlewares/validation.js";
import { isNotAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/login", isNotAuthenticated, mostrarLogin);
router.post("/login", isNotAuthenticated, validarLogin, procesarLogin);
router.get("/register", isNotAuthenticated, mostrarRegistro);
router.post("/register", isNotAuthenticated, validarRegistro, procesarRegistro);
router.get("/logout", logout);

export default router;