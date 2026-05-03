import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";

import productoRoutes from "./routes/productoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import Mensaje from "./models/Mensaje.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);
const io = new Server(server);

// ========== CONFIGURACIÓN HANDLEBARS ==========
app.engine("hbs", engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
// =============================================

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Sesiones (Configuración compartida)
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "secreto_default",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
});

app.use(sessionMiddleware);

// Inyectar io en cada request (para emitir eventos desde controladores)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use("/", authRoutes);
app.use("/", productoRoutes);   // incluye vista productos y API (productos.js)
app.use("/", chatRoutes);

// Redirección raíz
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/productos");
  } else {
    res.redirect("/login");
  }
});

// ========== SOCKET.IO (chat y productos) ==========
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  // Obtener usuario de la sesión
  const session = socket.request.session;
  const usuario = session?.user?.username || "Anónimo";

  // Enviar historial de mensajes al conectarse
  const mensajes = await Mensaje.find().sort({ fecha: 1 }).limit(50);
  socket.emit("historial", mensajes);

  socket.on("chat message", async (data) => {
    const nuevo = new Mensaje({ usuario, mensaje: data.mensaje });
    await nuevo.save();
    io.emit("chat message", { usuario, mensaje: data.mensaje, fecha: nuevo.fecha });
  });

  socket.on("disconnect", () => console.log("Cliente desconectado"));
});
// ===============================================

// Middleware de error 404
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error interno del servidor");
});

// Conexión a MongoDB y arranque
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    server.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  });