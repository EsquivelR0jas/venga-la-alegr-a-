

// === Variables globales ===
const productos = [];
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const catalogo = document.getElementById("catalogo");
const buscador = document.getElementById("buscador");
const contadorCarrito = document.getElementById("contador-carrito");
const modalCarrito = document.getElementById("carrito-modal");
const itemsCarrito = document.getElementById("items-carrito");
const totalCarrito = document.getElementById("total-carrito");

// === Inicialización ===
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  actualizarCarrito();
});

// === Cargar productos desde el HTML existente ===
function cargarProductos() {
  const items = document.querySelectorAll(".producto");

  items.forEach((item, index) => {
    const titulo = item.querySelector("h2").textContent;
    const artista = item.querySelector(".artista").textContent;
    const descripcion = item.querySelector(".descripcion").textContent;
    const precio = parseInt(item.querySelector(".precio").textContent.replace(/[₡]/g, ""));
    const etiquetas = Array.from(item.querySelectorAll(".tag")).map(tag => tag.textContent);
    const imagen = item.querySelector("img").getAttribute("src");

    const producto = { id: index + 1, titulo, artista, descripcion, precio, etiquetas, imagen };
    productos.push(producto);

    const btn = item.querySelector(".btn-comprar");
    btn.textContent = "🛒 Añadir al carrito";
    btn.addEventListener("click", () => agregarAlCarrito(producto));
  });
}

// === Buscador dinámico ===
buscador.addEventListener("input", e => {
  const texto = e.target.value.toLowerCase();
  const items = document.querySelectorAll(".producto");

  items.forEach(item => {
    const titulo = item.querySelector("h2").textContent.toLowerCase();
    const artista = item.querySelector(".artista").textContent.toLowerCase();
    const etiquetas = Array.from(item.querySelectorAll(".tag")).map(t => t.textContent.toLowerCase());
    const coincide = titulo.includes(texto) || artista.includes(texto) || etiquetas.some(tag => tag.includes(texto));
    item.style.display = coincide ? "block" : "none";
  });
});

// === Agregar al carrito ===
function agregarAlCarrito(producto) {
  carrito.push(producto);
  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion(`${producto.titulo} añadido al carrito 🛒`);
}

// === Actualizar el carrito ===
function actualizarCarrito() {
  contadorCarrito.textContent = carrito.length;
  itemsCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((prod, index) => {
    total += prod.precio;
    const div = document.createElement("div");
    div.classList.add("carrito-item");
    div.innerHTML = `
      <span>${prod.titulo}</span>
      <span>₡${prod.precio}</span>
      <button class="eliminar" onclick="eliminarDelCarrito(${index})">X</button>
    `;
    itemsCarrito.appendChild(div);
  });

  totalCarrito.textContent = `Total: ₡${total}`;
}

// === Eliminar del carrito ===
function eliminarDelCarrito(i) {
  carrito.splice(i, 1);
  guardarCarrito();
  actualizarCarrito();
}

// === Guardar en localStorage ===
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// === Mostrar/ocultar modal del carrito ===
document.getElementById("ver-carrito").addEventListener("click", () => {
  modalCarrito.classList.add("mostrar");
});

document.getElementById("cerrar-carrito").addEventListener("click", () => {
  modalCarrito.classList.remove("mostrar");
});

// === Comprar ===
document.getElementById("comprar-todo").addEventListener("click", () => {
  if (carrito.length === 0) return alert("Tu carrito está vacío 😅");
  alert("¡Gracias por tu compra en BeatSpace! 🎶");
  carrito.length = 0;
  guardarCarrito();
  actualizarCarrito();
  modalCarrito.classList.remove("mostrar");
});

// === Notificación pequeña al agregar producto ===
function mostrarNotificacion(texto) {
  const noti = document.createElement("div");
  noti.textContent = texto;
  noti.style.position = "fixed";
  noti.style.bottom = "20px";
  noti.style.right = "20px";
  noti.style.background = "#EC4899";
  noti.style.color = "white";
  noti.style.padding = "10px 15px";
  noti.style.borderRadius = "8px";
  noti.style.boxShadow = "0 0 10px #000";
  noti.style.zIndex = "9999";
  document.body.appendChild(noti);

  setTimeout(() => noti.remove(), 2500);
}
