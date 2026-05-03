import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model("Mensaje", mensajeSchema);