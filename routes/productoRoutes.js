import express from "express";
import { upload } from "../middlewares/upload.js";
import { validarProducto } from "../middlewares/validation.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  mostrarVistaProductos,
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productoController.js";

const router = express.Router();

// Vistas
router.get("/productos", isAuthenticated, mostrarVistaProductos);

// API (protegida)
router.use("/api/productos", isAuthenticated);
router.post("/api/productos", upload.single("imagen"), validarProducto, crearProducto);
router.get("/api/productos", obtenerProductos);
router.get("/api/productos/:id", obtenerProducto);
router.put("/api/productos/:id", upload.single("imagen"), validarProducto, actualizarProducto);
router.delete("/api/productos/:id", eliminarProducto);

export default router;