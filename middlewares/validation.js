import { body, validationResult } from "express-validator";

export const validarProducto = [
  body("nombre").trim().notEmpty().withMessage("El nombre del producto es obligatorio"),
  body("precio").isNumeric().withMessage("El precio debe ser un número").isFloat({ min: 0.01 }).withMessage("El precio debe ser mayor a 0"),
  body("descripcion").optional().isLength({ max: 200 }).withMessage("La descripción no puede pasar de 200 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

export const validarRegistro = [
  body("username").trim().notEmpty().withMessage("El nombre de usuario es obligatorio").isLength({ min: 3 }).withMessage("El usuario debe tener al menos 3 caracteres"),
  body("email").trim().isEmail().withMessage("Debes ingresar un correo electrónico válido").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("register", { errors: errors.array(), old: req.body, user: null });
    }
    next();
  }
];

export const validarLogin = [
  body("email").trim().isEmail().withMessage("Ingresa un correo electrónico válido").normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", { errors: errors.array(), old: req.body, user: null });
    }
    next();
  }
];