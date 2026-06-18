// Lee cards.json (único origen de datos, generado por gen-cards.py).
// Agregás un .jpeg a images/ -> regenerás cards.json -> aparece solo.
const app = document.getElementById("app");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

let CATS = [];        // [{key,nombre,color,icono,descripcion}]
let BY_CAT = {};      // key -> [lamina,...]
let menuIndex = 0;

const IMG = file => "images/" + file;   // ruta relativa para el álbum

init();
async function init() {
  try {
    const data = await fetch("cards.json", { cache: "no-cache" }).then(r => r.json());
    CATS = data.categorias;
    BY_CAT = {};
    for (const l of data.laminas) (BY_CAT[l.categoria] ||= []).push(l);
    window.addEventListener("hashchange", render);
    render();
  } catch (e) {
    app.innerHTML = `<p style="padding:40px;font-size:10px">No pude cargar cards.json. Corré <code>python3 gen-cards.py</code> y serví por http (no abras el archivo directo).</p>`;
    console.error(e);
  }
}

function render() {
  if (location.hash.startsWith("#cat=")) {
    const cat = CATS.find(c => c.key === location.hash.slice(5));
    if (cat) return renderCategory(cat);
  }
  renderMenu();
}

function renderMenu() {
  app.innerHTML = `
    <header class="hero">
      <h1 class="title">ÁLBUM</h1>
      <p class="subtitle">SELECCIONÁ CATEGORÍA</p>
    </header>
    <ul class="grid-cats">
      ${CATS.map((c, i) => `
        <li>
          <button class="cat-tile${i === menuIndex ? " sel" : ""}" data-i="${i}"
                  style="--c:${c.color}" data-key="${c.key}">
            <span class="cat-ico">${c.icono}</span>
            <span class="cat-name">${c.nombre}</span>
            <span class="cat-count">${(BY_CAT[c.key] || []).length} LÁMINAS</span>
          </button>
        </li>`).join("")}
    </ul>
    <p class="hint">▲▼◀▶ mover · ENTER entrar · clic en una categoría</p>`;

  app.querySelectorAll(".cat-tile").forEach(btn => {
    btn.addEventListener("click", () => { location.hash = "cat=" + btn.dataset.key; });
    btn.addEventListener("mouseenter", () => setSel(+btn.dataset.i));
  });
}

function setSel(i) {
  menuIndex = (i + CATS.length) % CATS.length;
  app.querySelectorAll(".cat-tile").forEach((b, n) =>
    b.classList.toggle("sel", n === menuIndex));
}

function renderCategory(cat) {
  const laminas = BY_CAT[cat.key] || [];
  app.innerHTML = `
    <div class="cat-header" style="--c:${cat.color}">
      <button class="back" aria-label="Volver">← VOLVER</button>
      <div class="cat-head-main">
        <span class="cat-head-ico">${cat.icono}</span>
        <div>
          <h2 class="cat-head-name">${cat.nombre}</h2>
          <p class="cat-head-desc">${cat.descripcion}</p>
        </div>
      </div>
    </div>
    <ul class="grid-cards">
      ${laminas.map(l => `
        <li class="card" style="--c:${cat.color}" data-src="${IMG(l.file)}">
          <img loading="lazy" src="${IMG(l.file)}" alt="${l.nombre}">
          <span class="holo"></span>
        </li>`).join("")}
    </ul>`;

  app.querySelector(".back").addEventListener("click", () => { location.hash = ""; });
  app.querySelectorAll(".card").forEach(setupCard);
  window.scrollTo(0, 0);
}

// Tilt + brillo holográfico siguiendo el puntero
function setupCard(card) {
  const img = card.querySelector("img");
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.transform = `perspective(600px) rotateY(${(px - .5) * 16}deg) rotateX(${(.5 - py) * 16}deg) scale(1.05)`;
    card.style.setProperty("--mx", (px * 100) + "%");
    card.style.setProperty("--my", (py * 100) + "%");
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  img.addEventListener("click", () => openLightbox(card.dataset.src, img.alt));
}

function openLightbox(src, alt) {
  lightboxImg.src = src; lightboxImg.alt = alt; lightbox.hidden = false;
}
function closeLightbox() { lightbox.hidden = true; lightboxImg.src = ""; }
lightbox.addEventListener("click", closeLightbox);

document.addEventListener("keydown", e => {
  if (!lightbox.hidden) { if (e.key === "Escape") closeLightbox(); return; }
  const inMenu = !location.hash.startsWith("#cat=");
  if (e.key === "Escape" && !inMenu) { location.hash = ""; return; }
  if (!inMenu) return;
  const cols = window.matchMedia("(max-width:600px)").matches ? 2 : 4;
  if (e.key === "ArrowRight") setSel(menuIndex + 1);
  else if (e.key === "ArrowLeft") setSel(menuIndex - 1);
  else if (e.key === "ArrowDown") setSel(menuIndex + cols);
  else if (e.key === "ArrowUp") setSel(menuIndex - cols);
  else if (e.key === "Enter") location.hash = "cat=" + CATS[menuIndex].key;
  else return;
  e.preventDefault();
});
