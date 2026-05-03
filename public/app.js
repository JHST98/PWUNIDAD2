// Conectar socket.io
const socket = io();

const API_BASE = "/api/productos";

// Elementos del DOM
const form = document.getElementById("formProducto");
const lista = document.getElementById("lista");

// Cargar productos al iniciar
async function cargarProductos() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error al cargar");
    const productos = await res.json();
    renderizarProductos(productos);
  } catch (error) {
    console.error("Error cargando:", error);
    lista.innerHTML = "<p style='color:red'>Error al cargar productos</p>";
  }
}

function renderizarProductos(productos) {
  if (!lista) return;
  if (productos.length === 0) {
    lista.innerHTML = "<p>No hay productos aún. Crea uno arriba.</p>";
    return;
  }

  lista.innerHTML = "";
  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "producto-card";
    card.innerHTML = `
      <h3>${escapeHtml(p.nombre)}</h3>
      <p class="precio"> $${p.precio}</p>
      <p>${escapeHtml(p.descripcion || "Sin descripción")}</p>
      ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" style="max-width:100%; border-radius:8px;">` : ""}
      <button onclick="eliminarProducto('${p._id}')">🗑️ Eliminar</button>
    `;
    lista.appendChild(card);
  });
}

// Eliminar producto (vía fetch)
window.eliminarProducto = async (id) => {
  if (!confirm("¿Eliminar este producto?")) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar");
    // No es necesario recargar, el socket actualizará
  } catch (error) {
    console.error("Error eliminando:", error);
    alert("No se pudo eliminar");
  }
};

// Envío del formulario con FormData (para imagen)
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("nombre", document.getElementById("nombre").value.trim());
    formData.append("precio", document.getElementById("precio").value);
    formData.append("descripcion", document.getElementById("descripcion").value.trim());
    const imagenFile = document.getElementById("imagen").files[0];
    if (imagenFile) {
      formData.append("imagen", imagenFile);
    }

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        body: formData  // No headers, el browser setea multipart boundary
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al crear");
      }
      form.reset();
      // El socket actualizará la lista automáticamente
    } catch (error) {
      console.error("Error creando:", error);
      alert(error.message);
    }
  });
}

// Escuchar eventos de socket.io para actualizar en tiempo real
socket.on("producto_creado", (producto) => {
  cargarProductos(); // recargar lista
});

socket.on("producto_actualizado", () => {
  cargarProductos();
});

socket.on("producto_eliminado", () => {
  cargarProductos();
});

// Helper
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>]/g, function(m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

// Inicializar
cargarProductos();