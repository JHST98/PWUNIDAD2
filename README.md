# MiInventarioExpress - Gestión de Productos y Chat en Tiempo Real

Este proyecto es una aplicación web completa desarrollada para la **Tarea de la Unidad 2**. Permite gestionar un inventario de productos, autenticar usuarios y comunicarse a través de un chat en tiempo real.

## 🚀 Funcionalidades Principales

### 1. Autenticación y Seguridad
*   **Registro y Login:** Sistema completo de usuarios con manejo de sesiones mediante `express-session`.
*   **Encriptación:** Las contraseñas se almacenan de forma segura utilizando `bcrypt`.
*   **Protección de Rutas:** Solo los usuarios autenticados pueden acceder a la gestión de productos y al chat.

### 2. Gestión de Inventario (CRUD Completo)
*   **Crear:** Formulario con soporte para carga de imágenes.
*   **Leer:** Visualización dinámica de productos en tarjetas (cards).
*   **Actualizar:** Funcionalidad para editar datos de productos existentes.
*   **Eliminar:** Borrado físico de productos y de sus imágenes asociadas en el servidor.

### 3. Carga de Imágenes con Multer
*   Módulo de carga configurado para aceptar únicamente formatos de imagen (`jpg`, `png`, `webp`, etc.).
*   Límite de tamaño de archivo (2MB) para optimizar el almacenamiento.

### 4. Tiempo Real con Socket.io
*   **Chat Comunitario:** Módulo de mensajería instantánea entre usuarios conectados.
*   **Actualizaciones Automáticas:** Si un usuario agrega, edita o elimina un producto, los cambios se reflejan instantáneamente en las pantallas de todos los demás usuarios sin necesidad de recargar la página.

### 5. Validaciones de Datos
*   Implementación de `express-validator` para validar correos electrónicos, longitud de contraseñas y campos obligatorios de productos.
*   Control de errores robusto que muestra mensajes amigables al usuario.

### 6. Interfaz de Usuario (UI/UX)
*   Diseño moderno basado en **Glassmorphism**.
*   Uso de **Handlebars** como motor de plantillas para renderizado dinámico desde el servidor.
*   Estilos premium con transiciones, sombras suaves y diseño responsivo.

## 🛠️ Tecnologías Utilizadas

*   **Backend:** Node.js, Express.js.
*   **Base de Datos:** MongoDB y Mongoose.
*   **Tiempo Real:** Socket.io.
*   **Vistas:** Handlebars (HBS).
*   **Seguridad:** Bcrypt, Express-Session.
*   **Middleware:** Multer, Express-Validator.

## 📦 Instalación y Ejecución

1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar el archivo `.env` con tu `MONGO_URI` y `PORT`.
4. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```
5. Abrir en el navegador: `http://localhost:3000`

---
**Desarrollado como parte de la evaluación de Programación Web - Unidad 2.**
