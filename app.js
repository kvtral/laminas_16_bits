// Manifest: categoría -> {nombre, color, icono, desc, files[]}
// Generado desde la carpeta. Para agregar cards: dejá el .jpeg con prefijo y sumalo a la lista.
const CATS = [
  { key:"RE", nombre:"REBELDE", color:"#B82020", icono:"✊",
    desc:"Clubes ligados a la protesta, el antifascismo, la resistencia política o el rechazo al fútbol como simple negocio.",
    files:["RE_AFRICAIN","RE_CT_JUPITER","RE_LIVORNO","RE_RED_STAR","RE_R_VALLECANO","RE_ST_PAULI"] },
  { key:"ME", nombre:"MEMORIA", color:"#2F4D7A", icono:"🕯️",
    desc:"Equipos marcados por tragedias, guerras, persecuciones, desapariciones o historias que merecen seguir siendo contadas.",
    files:["ME_BAY_MUN","ME_CELTIC","ME_CHAPE","ME_HISROSHI","ME_PALESTINO","ME_SHAKHTAR","ME_START","ME_TORINO","ME_WIMBLEDON"] },
  { key:"CA", nombre:"CANTERA", color:"#2FA7D6", icono:"🌱",
    desc:"Clubes reconocidos por formar jugadores, desarrollar talentos y alimentar selecciones o grandes equipos.",
    files:["CA_AJAX","CA_ARGENTINOS_JR","CA_MIMOSAS","CA_NOB","CA_SPORTING"] },
  { key:"BA", nombre:"BARRIO", color:"#2E7D4F", icono:"🏘️",
    desc:"Equipos cuya identidad está profundamente unida a su ciudad, comunidad, territorio y vida cotidiana.",
    files:["BA_CA_CERRO","BA_CHACARITAS","BA_CONCEPCION","BA_IBERIA","BA_LIVERPOOL","BA_NAPOLI","BA_UNION_BERLIN"] },
  { key:"FO", nombre:"FÓSIL", color:"#C8B56E", icono:"🦴",
    desc:"Clubes pioneros o muy antiguos que conservan las raíces y los primeros capítulos de la historia del fútbol.",
    files:["FO_GREEN_CROSS","FO_GYEDLP","FO_HUELVA","FO_LIBERTAD","FO_MAGALLANES","FO_QUEENS_PARK","FO_SHEFFIELD","FO_S_WAND","FO_VERCELLI","FO_WREXHAM"] },
  { key:"HA", nombre:"HAZAÑA", color:"#D6A326", icono:"🏆",
    desc:"Equipos protagonistas de campeonatos inesperados, gestas improbables o noches en que derrotaron todos los pronósticos.",
    files:["HA_ABREE","HA_CRUFC","HA_HELLAS_VER","HA_IPSWICH","HA_KAISERSLAUTEN","HA_LEICESTER","HA_MALMO","HA_MONTPELLIER","HA_NOT_FOR","HA_ONCE_CALDAS","HA_RED_STAR","HA_STEAUA_BUCU","HA_WIGAN"] },
  { key:"OB", nombre:"OBRERO", color:"#A65A2A", icono:"🔧",
    desc:"Clubes nacidos de ferroviarios, mineros, portuarios, trabajadores industriales, sindicatos u otros oficios.",
    files:["OB_FERRO_OESTE","OB_F_VIAL","OB_LOTA_SCH","OB_NAVAL","OB_PEÑAROL","OB_TALLERES","OB_TRASANDINO","OB_VELEZ_MOSTAR"] },
  { key:"CU", nombre:"CULTO", color:"#1FA6B8", icono:"🔥",
    desc:"Equipos con una mitología particular, personajes icónicos y una devoción que supera sus resultados deportivos.",
    files:["CU_COR_CAS","CU_LEEDS","CU_RACING_FR"] },
];

const app = document.getElementById("app");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

const prettyName = f => f.replace(/^[A-Z]{2}_/, "").replace(/_/g, " ");

let menuIndex = 0; // selector arcade en el menú

function render() {
  if (location.hash.startsWith("#cat=")) {
    const key = location.hash.slice(5);
    const cat = CATS.find(c => c.key === key);
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
            <span class="cat-count">${c.files.length} LÁMINAS</span>
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
  app.innerHTML = `
    <div class="cat-header" style="--c:${cat.color}">
      <button class="back" aria-label="Volver">← VOLVER</button>
      <div class="cat-head-main">
        <span class="cat-head-ico">${cat.icono}</span>
        <div>
          <h2 class="cat-head-name">${cat.nombre}</h2>
          <p class="cat-head-desc">${cat.desc}</p>
        </div>
      </div>
    </div>
    <ul class="grid-cards">
      ${cat.files.map(f => `
        <li class="card" style="--c:${cat.color}" data-src="${f}.jpeg">
          <img loading="lazy" src="${f}.jpeg" alt="${prettyName(f)}">
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
    const px = (e.clientX - r.left) / r.width;   // 0..1
    const py = (e.clientY - r.top) / r.height;
    card.style.transform = `perspective(600px) rotateY(${(px - .5) * 16}deg) rotateX(${(.5 - py) * 16}deg) scale(1.05)`;
    card.style.setProperty("--mx", (px * 100) + "%");
    card.style.setProperty("--my", (py * 100) + "%");
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  img.addEventListener("click", () => openLightbox(card.dataset.src, img.alt));
}

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.hidden = false;
}
function closeLightbox() { lightbox.hidden = true; lightboxImg.src = ""; }
lightbox.addEventListener("click", closeLightbox);

// Teclado: menú (flechas + enter) y global (esc)
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

window.addEventListener("hashchange", render);
render();
