# BeatSpace — Proyecto web (HTML, CSS, JS, JSON)

**Materia:** Desarrollo Web  
**Autor:** [Tu nombre]  
**Año:** 2025  
**Valor:** 20%

---

## 1. Descripción
BeatSpace es una plataforma ficticia para descubrir artistas y álbumes independientes. Permite filtrar y ordenar el catálogo, navegar un árbol colapsable de géneros, y ver detalles de cada álbum (título, artista, precio, etiquetas, descripción).

## 2. Objetivos
- Usar HTML semántico y accesible.
- Aplicar CSS con variables, paleta y tipografías coherentes.
- Consumir datos desde `data/datos.json` con `fetch()`.
- Implementar filtros, ordenamientos y árbol colapsable accesible.
- Añadir animaciones CSS y controladas por JS (IntersectionObserver).
- Garantizar responsive y contraste.

## 3. Estructura del proyecto

/beatspace/
├─ index.html
├─ /css/
│ ├─ base.css
│ └─ styles.css
├─ /js/
│ ├─ app.js
│ └─ tree.js
├─ /data/
│ └─ datos.json
├─ /img/ (opcional)
└─ README.md


## 4. Paleta de colores (psicología)
- **Primario — Azul eléctrico:** `#3B82F6` — energía, tecnología, juventud.
- **Secundario — Morado oscuro:** `#1E1B4B` — creatividad, misterio.
- **Acento — Fucsia:** `#EC4899` — pasión, arte.
- **Fondo — Negro azulado:** `#0F172A` — sofisticación.
- **Texto — Blanco humo:** `#E2E8F0` — legibilidad.

> Justificación: el público joven responde bien a contrastes vibrantes sobre fondos oscuros; el fucsia se usa como acento para llamadas a la acción y etiquetas.

## 5. Tipografías
- **Títulos:** Poppins (familia geométrica, moderna) — transmite energía y carácter.
- **Texto:** Inter (alta legibilidad en pantallas) — ideal para lecturas largas y UI.
Ambas cargadas vía Google Fonts.

## 6. Accesibilidad (WCAG AA - checklist)
- Contraste de texto sobre fondo principal apropiado (texto claro sobre fondo oscuro).
- Navegación por teclado: elementos interactivos (items, botones del árbol, close) son accesibles con Tab/Enter/Espacio.
- Roles ARIA: `role="tree"`, `role="treeitem"`, `aria-expanded` en nodos del árbol.
- `alt` en imágenes: Si añades imágenes en `/img/`, incluir `alt` descriptivo.
- Foco visible: outline y estilos de foco en controles.
- `aria-live="polite"` en catálogo y área de detalle para actualizaciones dinámicas.

## 7. Animaciones
- **CSS:** `.fade-in` para aparición suave.
- **JS:** IntersectionObserver para activar animaciones al hacer scroll.
- **JS (árbol):** rotación de icono y `aria-expanded` para accesibilidad.

> Nota: las animaciones están pensadas para no distraer; si se necesita reducir movimiento por accesibilidad, se puede detectar `prefers-reduced-motion`.

## 8. Cómo ejecutar
1. Descargar/copiar la carpeta `beatspace/` en tu equipo.
2. Abrir `index.html` en un navegador moderno.
3. Si `fetch('data/datos.json')` falla por políticas CORS/file://, usar un servidor local (recomendado):
   - En VSCode: instalar extensión *Live Server* y "Go Live".
   - O en terminal: `python -m http.server 8000` (Python 3), luego abrir `http://localhost:8000`.

## 9. Mapa del sitio
- `/` → `index.html` (Inicio)
  - `#catalogo` — listados (filtrar / ordenar)
  - `#arbol` — árbol de géneros
  - `#detalle` — vista de álbum seleccionado
  - `#acerca` — información del proyecto

## 10. Pruebas y checklist (rapido)
- [ ] Cargar 10+ items desde `data/datos.json`.
- [ ] Filtrar por texto y etiquetas (input).
- [ ] Ordenar A–Z / Z–A y por precio.
- [ ] Árbol colapsable con `aria-expanded` correcto.
- [ ] Navegación con teclado (Tab, Enter, Espacio, Arrow Up/Down).
- [ ] Contraste mínimo y foco visible.
- [ ] Responsive móvil / tablet / escritorio.

## 11. Capturas
*(Agrega capturas en `/img/` y enlaza aquí si las incluyes en la entrega.)*

---

### Notas finales
- Código en JS es Vanilla (sin librerías).
- Si quieres, puedo generar un **archivo ZIP** listo para descarga con todos los archivos (te doy instrucciones para crear el ZIP localmente o te muestro el contenido preparado para copiar).

