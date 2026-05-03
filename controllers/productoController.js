import Producto from "../models/Producto.js";
import fs from "fs";
import path from "path";

export const mostrarVistaProductos = (req, res) => {
  res.render("productos", { 
    user: req.session.user,
    useClientJS: true   // <-- para que se cargue cliente.js
  });
};
export const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    let imagen = "";
    if (req.file) imagen = `/uploads/${req.file.filename}`;
    const nuevo = new Producto({ nombre, precio: Number(precio), descripcion: descripcion || "", imagen });
    await nuevo.save();
    req.io.emit("producto_creado", nuevo);
    res.status(201).json(nuevo);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const obtenerProductos = async (req, res) => {
  const productos = await Producto.find().sort({ createdAt: -1 });
  res.json(productos);
};

export const obtenerProducto = async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  if (!producto) return res.status(404).json({ error: "No encontrado" });
  res.json(producto);
};

export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: "No encontrado" });
    const { nombre, precio, descripcion } = req.body;
    if (nombre) producto.nombre = nombre;
    if (precio !== undefined) producto.precio = Number(precio);
    if (descripcion !== undefined) producto.descripcion = descripcion;
    if (req.file) {
      if (producto.imagen) {
        const oldPath = path.join(process.cwd(), producto.imagen);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      producto.imagen = `/uploads/${req.file.filename}`;
    }
    await producto.save();
    req.io.emit("producto_actualizado", producto);
    res.json(producto);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Error al actualizar" });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto?.imagen) {
      const imagePath = path.join(process.cwd(), producto.imagen);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    await Producto.findByIdAndDelete(req.params.id);
    req.io.emit("producto_eliminado", { id: req.params.id });
    res.json({ mensaje: "Eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
};