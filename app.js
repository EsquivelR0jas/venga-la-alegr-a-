/* app.js — renderiza catálogo, filtros, orden y detalle */
const lista = document.getElementById('lista');
const filtro = document.getElementById('filtro');
const orden = document.getElementById('orden');
const detalleSection = document.getElementById('detalle');
const detalleCard = document.getElementById('detalle-card');

let itemsFlat = []; // aplanado de items
let rawData = null;

{
  try {
    const res = await fetch('data/datos.json');
    rawData = await res.json();

    // aplanar items: añadimos género y subgénero para contexto
    itemsFlat = rawData.generos.flatMap(g =>
      g.subgeneros.flatMap(s =>
        s.items.map(it => ({...it, genero: g.nombre, subgenero: s.nombre}))
      )
    );

    render();
    // animación de entrada
    document.querySelectorAll('#lista li').forEach((li,i) => {
      li.style.animationDelay = `${i*40}ms`;
      li.classList.add('fade-in');
    });
  } catch (err) {
    console.error('Error cargando datos:', err);
    lista.innerHTML = '<li>Error al cargar datos. Revisa data/datos.json</li>';
  }
}

function render() {
  const q = (filtro.value || '').toLowerCase().trim();

  let sorted = [...itemsFlat];
  const ord = orden.value;
  if (ord === 'az') sorted.sort((a,b)=> a.titulo.localeCompare(b.titulo));
  else if (ord === 'za') sorted.sort((a,b)=> b.titulo.localeCompare(a.titulo));
  else if (ord === 'precio-asc') sorted.sort((a,b)=> a.precio - b.precio);
  else if (ord === 'precio-desc') sorted.sort((a,b)=> b.precio - a.precio);

  const filtrados = sorted.filter(it =>
    it.titulo.toLowerCase().includes(q) ||
    it.artista.toLowerCase().includes(q) ||
    (it.etiquetas || []).some(t => t.toLowerCase().includes(q))
  );

  lista.innerHTML = '';
  if (filtrados.length === 0) {
    lista.innerHTML = '<li class="muted">No se encontraron resultados.</li>';
    return;
  }

  filtrados.forEach(it => {
    const li = document.createElement('li');
    li.className = 'item';
    li.tabIndex = 0;
    li.setAttribute('role','button');
    li.innerHTML = `
      <div>
        <div class="title">${escapeHtml(it.titulo)}</div>
        <div class="meta">${escapeHtml(it.artista)} • ${escapeHtml(it.genero)} / ${escapeHtml(it.subgenero)}</div>
      </div>
      <div style="text-align:right">
        <div>₡${it.precio}</div>
        <div class="tags">${(it.etiquetas||[]).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      </div>
    `;
    li.addEventListener('click', ()=> showDetail(it));
    li.addEventListener('keydown', (e)=> { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showDetail(it); } });
    lista.appendChild(li);
  });
}

function showDetail(item){
  detalleSection.classList.remove('hidden');
  detalleCard.innerHTML = `
    <h3>${escapeHtml(item.titulo)}</h3>
    <p class="muted">${escapeHtml(item.artista)} • ${escapeHtml(item.genero)} / ${escapeHtml(item.subgenero)}</p>
    <p>${escapeHtml(item.descripcion || 'Sin descripción.')}</p>
    <p><strong>Precio:</strong> ₡${item.precio}</p>
    <p class="tags">${(item.etiquetas||[]).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</p>
    <p><button id="close-detail">Cerrar</button></p>
  `;
  document.getElementById('close-detail').addEventListener('click', ()=> detalleSection.classList.add('hidden'));
  detalleSection.scrollIntoView({behavior:'smooth'});
}

/* escape básico para evitar inyección cuando se inserta texto */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'", '&#39;');
}

/* Observador de intersección para animar secciones cuando hacen scroll */
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('fade-in');
  });
},{threshold:0.12});
document.querySelectorAll('.panel, .hero').forEach(el => obs.observe(el));

/* Eventos */
filtro.addEventListener('input', render);
orden.addEventListener('change', render);

/* Menu toggle mobile simple */
const menuToggle = document.getElementById('menu-toggle');
menuToggle?.addEventListener('click', ()=> {
  const nav = document.querySelector('.nav-list');
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  if (nav) nav.style.display = expanded ? 'none' : 'flex';
});

/* Cargar datos y árbol (tree.js também inicializa árbol) */
cargar();

/* === Sección "Lo más destacado" === */
async function cargarDestacados() {
  if (!rawData) return;
  const destacadosList = document.getElementById('destacados-list');
  destacadosList.innerHTML = '';

  // Tomamos los primeros 3 álbumes del JSON para ejemplo
  const destacados = itemsFlat.slice(0, 3);

  destacados.forEach(it => {
    const li = document.createElement('li');
    li.className = 'item fade-in';
    li.innerHTML = `
      <div>
        <div class="title">${escapeHtml(it.titulo)}</div>
        <div class="meta">${escapeHtml(it.artista)} • ${escapeHtml(it.genero)}</div>
      </div>
      <div>₡${it.precio}</div>
    `;
    li.addEventListener('click', ()=> showDetail(it));
    destacadosList.appendChild(li);
  });
}
setTimeout(cargarDestacados, 600);

/* === Animación de texto tipo "escritura" === */
const typedText = document.getElementById('typed-text');
const cursor = document.getElementById('cursor');
const message = "BeatSpace: Descubre tu ritmo.";
let index = 0;
function typeEffect() {
  if (index < message.length) {
    typedText.textContent = message.substring(0, index + 1);
    index++;
    setTimeout(typeEffect, 90);
  } else {
    cursor.style.display = 'none';
  }
}
window.addEventListener('load', typeEffect);

/* === Fondo animado del Hero === */
const canvas = document.getElementById('hero-bg');
const ctx = canvas.getContext('2d');
function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.85;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let t = 0;
function drawWave(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const gradient = ctx.createLinearGradient(0,0,canvas.width,0);
  gradient.addColorStop(0, "#3B82F6");
  gradient.addColorStop(1, "#EC4899");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  for(let x=0; x<canvas.width; x+=8){
    const y = Math.sin((x+t)/50)*15 + Math.cos((x+t)/25)*8 + canvas.height/2.5;
    ctx.lineTo(x,y);
  }
  ctx.stroke();
  t += 2;
  requestAnimationFrame(drawWave);
}
drawWave();



// Mostrar alerta al comprar un producto
const botones = document.querySelectorAll('.btn-comprar');

botones.forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const nombre = btn.parentElement.querySelector('h2').textContent;
    alert(`🛒 "${nombre}" se agregó al carrito.`);
  });
});
