/* tree.js — crea árbol accesible Género → Subgénero → Items */
async function initTree(){
  try {
    const res = await fetch('data/datos.json');
    const data = await res.json();
    const tree = document.getElementById('tree');
    tree.innerHTML = '';
    data.generos.forEach(g => {
      const nodeG = makeNode(g.nombre, 'genre');
      const ulSub = document.createElement('ul'); ulSub.setAttribute('role','group');
      g.subgeneros.forEach(s => {
        const nodeS = makeNode(s.nombre, 'subgenre');
        const ulItems = document.createElement('ul'); ulItems.setAttribute('role','group');
        s.items.forEach(it => {
          const li = document.createElement('li');
          li.setAttribute('role','treeitem');
          li.tabIndex = 0;
          li.className = 'leaf';
          li.innerHTML = `${escapeHtml(it.titulo)} <span class="muted">— ${escapeHtml(it.artista)}</span>`;
          li.addEventListener('click', ()=> dispatchSelect(it));
          li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatchSelect(it); }});
          ulItems.appendChild(li);
        });
        nodeS.appendChild(ulItems);
        ulSub.appendChild(nodeS);
      });
      nodeG.appendChild(ulSub);
      tree.appendChild(nodeG);
    });
  } catch (err) {
    console.error('Error inicializando árbol:', err);
  }
}

function makeNode(text, type){
  const li = document.createElement('li');
  li.setAttribute('role','treeitem');
  li.setAttribute('aria-expanded','false');
  li.tabIndex = 0;
  const btn = document.createElement('button');
  btn.setAttribute('aria-label', `Alternar ${text}`);
  btn.innerHTML = `<span class="toggle-icon">▶</span> ${escapeHtml(text)}`;
  btn.addEventListener('click', ()=> toggleNode(li));
  btn.addEventListener('keydown', (e)=> {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNode(li); }
    if (e.key === 'ArrowDown') { e.preventDefault(); focusNext(li); }
    if (e.key === 'ArrowUp') { e.preventDefault(); focusPrev(li); }
  });
  li.appendChild(btn);
  return li;
}

function toggleNode(li){
  const expanded = li.getAttribute('aria-expanded') === 'true';
  li.setAttribute('aria-expanded', String(!expanded));
}

function focusNext(el){
  const all = Array.from(document.querySelectorAll('[role="treeitem"]'));
  const i = all.indexOf(el);
  if (i >=0 && i < all.length -1) all[i+1].focus();
}
function focusPrev(el){
  const all = Array.from(document.querySelectorAll('[role="treeitem"]'));
  const i = all.indexOf(el);
  if (i > 0) all[i-1].focus();
}

function dispatchSelect(item){
  // Reutiliza showDetail si existe en app.js
  if (window.showDetail) window.showDetail(item);
}

/* pequeño escape igual que en app.js (evitar dependencia circular en copy) */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'", '&#39;');
}

document.addEventListener('DOMContentLoaded', initTree);
