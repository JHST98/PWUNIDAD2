import Mensaje from "../models/Mensaje.js";

export const mostrarChat = async (req, res) => {
  const mensajes = await Mensaje.find().sort({ fecha: 1 }).limit(50);
  res.render("chat", { 
    mensajes, 
    user: req.session.user,
    useClientJS: true 
  });
};