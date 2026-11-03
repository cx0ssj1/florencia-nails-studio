/* Florencia Nails Studio — interacciones */

/* ⚠️ CONFIGURAR: número de WhatsApp en formato internacional, sin +, espacios ni guiones.
   Argentina celular: 549 + código de área sin 0 + número sin 15. Ej.: 5491123456789 */
const WA_NUMBER = "56994735440";

const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

/* Enlaces de WhatsApp con mensaje prearmado */
document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = waLink(a.dataset.waMsg || "Hola Florencia, quiero agendar un turno.");
  a.target = "_blank";
  a.rel = "noopener";
});

/* Header con borde al hacer scroll + botón flotante oculto en el hero y en el formulario */
const header = document.querySelector("[data-header]");
const floatBtn = document.querySelector(".wa-float");
const hero = document.querySelector(".hero");
const booking = document.querySelector("#agendar");
const visible = new Set();
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
  header.classList.toggle("is-scrolled", !visible.has(hero));
  floatBtn.classList.toggle("is-hidden", visible.has(hero) || visible.has(booking));
}, { threshold: 0.25 });
io.observe(hero);
io.observe(booking);

/* Selector de colores (tonos de la carta disponible) */
const CLASSIC = [
  ["Blanco", "#F6F3EF"],
  ["Durazno", "#F5B597"],
  ["Amarillo", "#F4D21C"],
  ["Rojo", "#D3141F"],
  ["Rosa coral", "#F2707F"],
  ["Lila", "#B88BDF"],
  ["Lavanda gris", "#B3B5CE"],
  ["Verde menta", "#39D287"],
  ["Azul francia", "#1C3FC2"],
  ["Negro", "#16121A"],
];
const CAT_EYE = [
  ["Cat eye magenta", "#8E1B5F"],
  ["Cat eye champagne", "#C8B987"],
  ["Cat eye galaxia", "#3D2522"],
  ["Cat eye rubí", "#7A1521"],
  ["Cat eye rosa perla", "#EBB2BB"],
];

const stage = document.querySelector(".nail-stage");
const chosenName = document.querySelector("[data-chosen-name]");
const colorBtn = document.querySelector("[data-wa-color]");
const colorInput = document.querySelector("#f-color");
let chosen = "Rosa coral";

function buildSwatches(container, list, isCat) {
  list.forEach(([name, hex]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "swatch" + (isCat ? " cat" : "");
    b.style.setProperty("--c", hex);
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", String(name === chosen));
    b.setAttribute("aria-label", name);
    b.title = name;
    b.tabIndex = name === chosen ? 0 : -1;
    b.addEventListener("click", () => select(name, hex, isCat, b));
    container.appendChild(b);
  });
}

function select(name, hex, isCat, btn) {
  chosen = name;
  document.querySelectorAll(".swatch").forEach((s) => {
    const on = s === btn;
    s.setAttribute("aria-checked", String(on));
    s.tabIndex = on ? 0 : -1;
  });
  document.documentElement.style.setProperty("--nail", hex);
  stage.classList.toggle("is-cat", isCat);
  chosenName.textContent = name;
  colorBtn.href = waLink(`Hola Florencia, quiero un turno con esmaltado permanente en color ${name}.`);
  if (colorInput && (!colorInput.value || colorInput.dataset.auto === "1")) {
    colorInput.value = name;
    colorInput.dataset.auto = "1";
  }
}

buildSwatches(document.querySelector("[data-swatches]"), CLASSIC, false);
buildSwatches(document.querySelector("[data-swatches-cat]"), CAT_EYE, true);
colorBtn.href = waLink(`Hola Florencia, quiero un turno con esmaltado permanente en color ${chosen}.`);
colorBtn.target = "_blank";
colorBtn.rel = "noopener";
colorInput?.addEventListener("input", () => (colorInput.dataset.auto = "0"));

/* Navegación con flechas dentro de cada grupo de colores */
document.querySelectorAll('[role="radiogroup"]').forEach((group) => {
  group.addEventListener("keydown", (e) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const items = [...group.querySelectorAll(".swatch")];
    const i = items.indexOf(document.activeElement);
    const next = items[(i + (keys.indexOf(e.key) < 2 ? 1 : -1) + items.length) % items.length];
    next.focus();
    next.click();
  });
});

/* Formulario → mensaje de WhatsApp */
const form = document.querySelector("[data-booking]");
const dateInput = form.querySelector("#f-dia");
const today = new Date();
dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const nombre = (d.get("nombre") || "").trim();
  const servicio = d.get("servicio");
  const horario = d.get("horario");
  const color = (d.get("color") || "").trim();
  let dia = "";
  if (d.get("dia")) {
    const [y, m, dd] = d.get("dia").split("-").map(Number);
    dia = new Date(y, m - 1, dd).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  }

  const lines = [
    `Hola Florencia${nombre ? `, soy ${nombre}` : ""}. Quiero agendar un turno.`,
    `• Servicio: ${servicio}`,
    `• Día: ${dia || "el que tengas disponible"}, ${horario}`,
  ];
  if (color) lines.push(`• Color o diseño: ${color}`);
  lines.push("¿Tenés disponibilidad?");

  window.open(waLink(lines.join("\n")), "_blank", "noopener");
});

/* Visor de fotos */
const dialog = document.querySelector("[data-lightbox-dialog]");
const lbImg = dialog.querySelector("[data-lightbox-img]");
const lbCap = dialog.querySelector("[data-lightbox-cap]");
document.querySelectorAll("[data-lightbox]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    lbImg.src = btn.dataset.src || img.src;
    lbImg.alt = img ? img.alt : btn.dataset.caption;
    lbCap.textContent = btn.dataset.caption || "";
    dialog.showModal();
  });
});
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

document.querySelector("[data-year]").textContent = new Date().getFullYear();
