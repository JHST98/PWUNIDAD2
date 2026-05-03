const API_BASE = "/api/productos";

async function cargarProductos() {
  const lista = document.getElementById("lista");
  if (!lista) return;

  const res = await fetch(API_BASE);
  if (res.redirected) return;
  
  const productos = await res.json();
  renderizar(productos);
}

function renderizar(productos) {
  const lista = document.getElementById("lista");
  if (!lista) return;
  lista.innerHTML = "";
  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "producto-card";
    card.innerHTML = `
      ${p.imagen ? `<img src="${p.imagen}">` : '<div style="height:200px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; color:#94a3b8; border-radius:12px; margin-bottom:1rem;">Sin imagen</div>'}
      <div class="precio">$${p.precio}</div>
      <h3>${escapeHtml(p.nombre)}</h3>
      <p style="color:var(--text-muted); margin-bottom:1.5rem;">${escapeHtml(p.descripcion || "")}</p>
      <div class="card-actions">
        <button onclick="prepararEdicion('${p._id}', '${escapeHtml(p.nombre)}', ${p.precio}, '${escapeHtml(p.descripcion || "")}')" style="background:#f1f5f9; color:var(--text-main);">Editar</button>
        <button onclick="eliminar('${p._id}')" class="btn-danger">Eliminar</button>
      </div>
    `;
    lista.appendChild(card);
  });
}

window.prepararEdicion = (id, nombre, precio, descripcion) => {
  document.getElementById("productoId").value = id;
  document.getElementById("nombre").value = nombre;
  document.getElementById("precio").value = precio;
  document.getElementById("descripcion").value = descripcion;
  
  document.getElementById("formTitle").innerText = "Editar producto";
  document.getElementById("btnSubmit").innerText = "Guardar cambios";
  document.getElementById("btnCancelar").style.display = "block";
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.getElementById("btnCancelar")?.addEventListener("click", () => {
  resetForm();
});

function resetForm() {
  document.getElementById("formProducto").reset();
  document.getElementById("productoId").value = "";
  document.getElementById("formTitle").innerText = "Agregar nuevo producto";
  document.getElementById("btnSubmit").innerText = "Crear producto";
  document.getElementById("btnCancelar").style.display = "none";
}

window.eliminar = async (id) => {
  if (confirm("¿Eliminar?")) {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    cargarProductos();
  }
};

const form = document.getElementById("formProducto");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("productoId").value;
    const fd = new FormData();
    fd.append("nombre", document.getElementById("nombre").value);
    fd.append("precio", document.getElementById("precio").value);
    fd.append("descripcion", document.getElementById("descripcion").value);
    const file = document.getElementById("imagen").files[0];
    if (file) fd.append("imagen", file);

    const url = id ? `${API_BASE}/${id}` : API_BASE;
    const method = id ? "PUT" : "POST";

    await fetch(url, { method, body: fd });
    resetForm();
    cargarProductos();
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m] || m));
}

cargarProductos();

// Sockets para actualización en tiempo real y Chat
const socket = io();

socket.on("producto_creado", cargarProductos);
socket.on("producto_actualizado", cargarProductos);
socket.on("producto_eliminado", cargarProductos);

// --- LÓGICA DE CHAT ---
const chatBox = document.getElementById("chat-mensajes");
const msgInput = document.getElementById("mensajeInput");
const btnEnviar = document.getElementById("enviarBtn");

if (chatBox) {
  // Recibir historial al conectar
  socket.on("historial", (mensajes) => {
    chatBox.innerHTML = "";
    mensajes.forEach(appendMessage);
    scrollToBottom();
  });

  // Recibir nuevo mensaje
  socket.on("chat message", (data) => {
    appendMessage(data);
    scrollToBottom();
  });

  // Enviar mensaje
  const enviarMsg = () => {
    const mensaje = msgInput.value.trim();
    if (mensaje) {
      socket.emit("chat message", { mensaje });
      msgInput.value = "";
    }
  };

  btnEnviar.addEventListener("click", enviarMsg);
  msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMsg();
  });
}

function appendMessage(data) {
  if (!chatBox) return;
  const div = document.createElement("div");
  div.className = "msg";
  const fecha = new Date(data.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  div.innerHTML = `<b>${escapeHtml(data.usuario)}</b> <small style="color:var(--text-muted)">${fecha}</small><br> ${escapeHtml(data.mensaje)}`;
  chatBox.appendChild(div);
}

function scrollToBottom() {
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}