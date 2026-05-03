import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  precio: { type: Number, required: true, min: 0 },
  descripcion: { type: String, default: "" },
  imagen: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Producto", productoSchema);