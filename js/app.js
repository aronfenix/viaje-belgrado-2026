/* ============================================================
   БЕОГРАД 26 · app.js — núcleo: router, renderizado, plan, sellos
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const DIAS_SEM = ["", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const FIAB = {
    ok: '<span class="fiab fiab-ok">✓ confirmado</span>',
    ver: '<span class="fiab fiab-ver">⚠ verificar</span>',
    sug: '<span class="fiab fiab-sug">💡 sugerencia</span>',
  };
  const fiab = (k) => FIAB[k] || "";

  /* ---------- THEME ---------- */
  const themeMeta = $('meta[name="theme-color"]');
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    if (themeMeta) themeMeta.content = t === "dark" ? "#0d1220" : "#f4efe6";
    dispatchEvent(new CustomEvent("bg26:theme", { detail: t }));
  }
  const savedTheme = localStorage.getItem("bg26_theme");
  applyTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("#themeToggle").addEventListener("click", () => {
    const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("bg26_theme", t);
    applyTheme(t);
  });

  /* ---------- TOAST ---------- */
  let toastT;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.hidden = false; el.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => { el.classList.remove("show"); setTimeout(() => (el.hidden = true), 300); }, 2200);
  }

  /* ---------- COUNTDOWN ---------- */
  const T0 = new Date("2026-07-22T16:00:00+02:00");
  const T1 = new Date("2026-07-30T23:59:59+02:00");
  const pad = (n) => String(n).padStart(2, "0");
  function countdown() {
    const el = $("#countdown");
    const now = new Date();
    document.body.classList.toggle("pretrip", now < T0);
    if (now < T0) {
      const d = T0 - now;
      const dd = Math.floor(d / 864e5), hh = Math.floor(d / 36e5) % 24, mm = Math.floor(d / 6e4) % 60, ss = Math.floor(d / 1e3) % 60;
      el.innerHTML = [["Días", dd], ["Horas", pad(hh)], ["Min", pad(mm)], ["Seg", pad(ss)]]
        .map(([l, v]) => `<div class="cd-cell"><div class="cd-num">${v}</div><div class="cd-lab">${l}</div></div>`).join("");
    } else if (now <= T1) {
      const dia = Math.floor((now - new Date("2026-07-22T00:00:00+02:00")) / 864e5) + 1;
      el.innerHTML = `<p class="cd-msg">Día ${dia} de 9 · Ya estáis en Belgrado ✨</p>`;
    } else {
      el.innerHTML = `<p class="cd-msg">El viaje ya es memoria. Живели!</p>`;
    }
  }
  countdown();
  setInterval(countdown, 1000);

  /* ---------- STORES: PLAN + SELLOS ---------- */
  const PLAN_KEY = "bg26_plan", SELLO_KEY = "bg26_sellos";
  const getPlan = () => { try { return JSON.parse(localStorage.getItem(PLAN_KEY)) || {}; } catch { return {}; } };
  const setPlan = (p) => localStorage.setItem(PLAN_KEY, JSON.stringify(p));
  const getSellos = () => { try { return JSON.parse(localStorage.getItem(SELLO_KEY)) || []; } catch { return []; } };
  const setSellos = (s) => localStorage.setItem(SELLO_KEY, JSON.stringify(s));

  /* Registro de elementos planificables: id → {nombre, seccion, emoji, coords} */
  const PLANNABLES = {};
  function reg(id, nombre, seccion, emoji, coords) { PLANNABLES[id] = { nombre, seccion, emoji, coords: coords || null }; return id; }
  DATA.sitios.forEach((s) => reg(s.id, s.nombre, "ver", "◈", s.coords));
  DATA.comer.bloques.forEach((b) => b.sitios.forEach((s) => reg("c-" + slug(s.nombre), s.nombre, "comer", "♨", s.coords)));
  DATA.noche.zonas.forEach((z) => reg("n-" + slug(z.nombre), z.nombre, "noche", "☾", z.coords));
  DATA.alrededores.forEach((a) => reg(a.id, a.nombre, "alrededores", "⇢", a.coords));
  DATA.barrios.forEach((b) => reg("b-" + b.id, b.nombre, "barrios", "⌂", b.coords));
  DATA.paseos.forEach((p) => reg(p.id, "Paseo: " + p.nombre, "paseos", "➾", p.paradas[0].coords));
  DATA.mapaZonas.zonas.forEach((z) => ["ver", "comer", "beber"].forEach((tipo) => (z.extras?.[tipo] || []).forEach((s) => reg(s.planId || s.id, s.nombre, "zona", tipo === "ver" ? "◈" : tipo === "comer" ? "♨" : "☾", s.coords))));

  /* ---------- distancias a pie desde casa ---------- */
  const CASA = DATA.viaje.alojamiento.coords;
  function distKm(a, b) {
    const R = 6371, r = Math.PI / 180;
    const dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function walkChip(coords) {
    if (!coords) return "";
    const km = distKm(CASA, coords);
    if (km > 6) return `<span>🚶 lejos (${km.toFixed(0)} km) — transporte</span>`;
    const min = Math.round(km * 13); // ~4,6 km/h
    return `<span>🚶 ~${min} min desde casa</span>`;
  }

  /* ---------- confeti ---------- */
  function confetti(n = 34) {
    const w = document.createElement("div");
    w.className = "confetti";
    const cols = ["#e8a15c", "#5fc3b8", "#b5522c", "#e58aa8", "#d9b45e"];
    for (let i = 0; i < n; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "vw";
      s.style.background = cols[i % cols.length];
      s.style.animationDelay = (Math.random() * 0.35) + "s";
      s.style.setProperty("--dx", (Math.random() * 2 - 1).toFixed(2));
      w.appendChild(s);
    }
    document.body.appendChild(w);
    setTimeout(() => w.remove(), 2300);
  }

  const planBtn = (id) => `<button class="plan-btn" data-plan="${id}" title="Añadir a un día">＋ plan</button>`;
  const selloBtn = (id) => {
    const done = getSellos().includes(id);
    return `<button class="sello-btn ${done ? "on" : ""}" data-sello="${id}" title="Marcar como visitado">${done ? "✔ sellado" : "◻ sello"}</button>`;
  };

  /* Plan sheet */
  let pendingPlan = null;
  function openPlanSheet(id) {
    pendingPlan = id;
    $("#planSheetTitle").textContent = `«${PLANNABLES[id].nombre}» → ¿qué día?`;
    const plan = getPlan();
    $("#planDays").innerHTML = fechasViaje().map((f) => {
      const iso = f.toISOString().slice(0, 10);
      const wd = ((f.getDay() + 6) % 7) + 1;
      const n = (plan[iso] || []).length;
      return `<button class="plan-day" data-day="${iso}">
        <span class="pd-num">${f.getDate()}</span>
        <span class="pd-wd">${DIAS_SEM[wd].slice(0, 3)}</span>
        ${n ? `<span class="pd-count">${n}</span>` : ""}</button>`;
    }).join("");
    $("#planSheet").hidden = false;
  }
  $("#planDays").addEventListener("click", (e) => {
    const b = e.target.closest("[data-day]");
    if (!b || !pendingPlan) return;
    const plan = getPlan();
    const day = b.dataset.day;
    plan[day] = plan[day] || [];
    if (!plan[day].includes(pendingPlan)) plan[day].push(pendingPlan);
    setPlan(plan);
    $("#planSheet").hidden = true;
    toast(`Guardado para el ${DIAS_SEM[((new Date(day + "T12:00:00").getDay() + 6) % 7) + 1]} ${+day.slice(8)}. — Б.`);
    if (rendered.has("agenda")) renderAgenda($('.page[data-page="agenda"]'));
  });

  /* delegación global: plan, sello, cerrar sheets, fly */
  document.addEventListener("click", (e) => {
    const p = e.target.closest("[data-plan]");
    if (p) { openPlanSheet(p.dataset.plan); return; }
    const s = e.target.closest("[data-sello]");
    if (s) {
      const id = s.dataset.sello;
      let sellos = getSellos();
      const add = !sellos.includes(id);
      sellos = add ? [...sellos, id] : sellos.filter((x) => x !== id);
      setSellos(sellos);
      s.classList.toggle("on", add);
      s.textContent = add ? "✔ sellado" : "◻ sello";
      if (add) {
        navigator.vibrate && navigator.vibrate(18);
        toast(`Sellado: ${PLANNABLES[id] ? PLANNABLES[id].nombre : id}. — Б. 🛂`);
        if (sellos.length && sellos.length % 5 === 0) confetti();
      }
      renderStamps();
      return;
    }
    const rt = e.target.closest("[data-ruta]");
    if (rt) {
      const pts = (getPlan()[rt.dataset.ruta] || []).map((id) => PLANNABLES[id]).filter((p) => p && p.coords);
      window.__route = pts.map((p, i) => ({ coords: p.coords, n: i + 1, nombre: p.nombre }));
      location.hash = "#/mapa";
      return;
    }
    const c = e.target.closest("[data-close]");
    if (c) { $("#" + c.dataset.close).hidden = true; return; }
    const del = e.target.closest("[data-unplan]");
    if (del) {
      const [day, id] = del.dataset.unplan.split("|");
      const plan = getPlan();
      plan[day] = (plan[day] || []).filter((x) => x !== id);
      if (!plan[day].length) delete plan[day];
      setPlan(plan);
      renderAgenda($('.page[data-page="agenda"]'));
      return;
    }
    const a = e.target.closest("[data-fly]");
    if (a) {
      const [lat, lng] = a.dataset.fly.split(",").map(Number);
      window.__flyTo = [lat, lng];
      if (a.tagName === "BUTTON") location.hash = "#/mapa";
    }
  });

  /* ---------- SECTIONS INDEX ---------- */
  const SECCIONES = [
    { id: "agenda", sub: "Día a día + tu propio plan", ico: "▦" },
    { id: "cartas", sub: "Nueve cartas selladas — una por día", ico: "✉" },
    { id: "barrios", sub: "La ciudad por capas y zonas", ico: "⌂" },
    { id: "paseos", sub: "6 rutas a pie con paradas en el mapa", ico: "➾" },
    { id: "ver", sub: "Museos con horarios en vivo y sellos", ico: "◈" },
    { id: "mapa", sub: "Todo geolocalizado + radios a pie", ico: "◎" },
    { id: "comer", sub: "Burek, grill y kafanas — con testimonios", ico: "♨" },
    { id: "noche", sub: "Cervezas, patios y el río", ico: "☾" },
    { id: "escena", sub: "Cine en VO, Kinoteka y directos", ico: "▸" },
    { id: "alrededores", sub: "Novi Sad y más allá, sin coche", ico: "⇢" },
    { id: "historia", sub: "Cinco capas de ciudad", ico: "◔" },
    { id: "costumbres", sub: "Rakija, cirílico y tu nombre en serbio", ico: "☕" },
    { id: "transporte", sub: "Gratis desde 2025 (en serio)", ico: "▷" },
    { id: "cuaderno", sub: "Notas del viaje + postales", ico: "✎" },
    { id: "gastos", sub: "Quién pagó qué — cuentas claras", ico: "€" },
    { id: "practico", sub: "Dinero, eSIM, conversor, checklist", ico: "✚" },
  ];
  const pageMeta = (id) => { const p = $(`.page[data-page="${id}"]`); return { num: p.dataset.num, title: p.dataset.title, cyr: p.dataset.cyr }; };

  function tile(s) {
    const m = pageMeta(s.id);
    return `<a class="home-tile reveal" href="#/${s.id}" data-page-ref="${s.id}">
      <span class="ht-num">${m.num} · ${s.ico}</span>
      <span class="ht-title">${m.title}</span>
      <span class="ht-sub">${s.sub}</span>
      <span class="ht-cyr">${m.cyr}</span></a>`;
  }
  function paintTiles(root) {
    $$("[data-page-ref]", root).forEach((a) => {
      const probe = $(`.page[data-page="${a.dataset.pageRef}"]`);
      a.style.setProperty("--tile", getComputedStyle(probe).getPropertyValue("--sec"));
    });
  }
  /* Índice del río: navegación tipográfica, sin cajas */
  const RIO_GRANDES = new Set(["agenda", "cartas", "mapa", "comer", "cuaderno", "alrededores"]);
  function rioItem(s, i) {
    const m = pageMeta(s.id);
    return `<a class="rio-item reveal ${RIO_GRANDES.has(s.id) ? "ri-big" : ""} ${i % 2 ? "ri-alt" : ""}" href="#/${s.id}" data-page-ref="${s.id}">
      <span class="ri-num">${m.num}</span>
      <span class="ri-title">${m.title}</span>
      <span class="ri-sub">${s.sub}</span>
    </a>`;
  }
  $("#rioItems").innerHTML = SECCIONES.map(rioItem).join("");
  $("#guideGrid").innerHTML = SECCIONES.map(tile).join("");
  addEventListener("bg26:theme", () => { paintTiles($("#rioItems")); paintTiles($("#guideGrid")); });
  paintTiles(document);

  /* ---------- HOME: boarding pass + today + stamps ---------- */
  function renderBoarding() {
    const box = $("#boardingBox");
    if (new Date() >= T0) { box.innerHTML = ""; return; }
    box.innerHTML = `<div class="boarding reveal">
      <div class="bp-main">
        <div class="bp-route"><span class="bp-code">MAD</span><span class="bp-plane">✈</span><span class="bp-code">BEG</span></div>
        <div class="bp-row"><span>Pasajeros</span><b>ÁLVARO & LAURA</b></div>
        <div class="bp-row"><span>Fecha</span><b>22 JUL 2026 · ~16:00</b></div>
        <div class="bp-row"><span>Destino</span><b>Risanska 9 · Savski Venac</b></div>
      </div>
      <div class="bp-stub">
        <span class="bp-stub-cyr">ЛЕТ</span>
        <span class="bp-seat">Asiento<br><b>junto a<br>tu hermana</b></span>
        <div class="bp-barcode">${"▮▯▮▮▯▮▯▯▮▮▯▮▮▮▯▮▯▮▮▯".split("").map((c) => `<i class="${c === "▮" ? "w2" : "w1"}"></i>`).join("")}</div>
      </div>
    </div>`;
  }

  function todayCard() {
    const now = new Date();
    const iso = now.toISOString().slice(0, 10);
    const enViaje = iso >= "2026-07-22" && iso <= "2026-07-30";
    const wd = ((now.getDay() + 6) % 7) + 1;
    const regla = DATA.reglasSemana[wd];
    const evs = DATA.eventos.filter((e) => e.fecha === iso);
    let inner;
    if (enViaje) {
      inner = `<span class="today-tag">Hoy · ${DIAS_SEM[wd]} ${now.getDate()} de ${MESES[now.getMonth()]}</span>
        ${cartaHoyPendiente() ? '<p class="carta-aviso"><a href="#/cartas">✉ Hay una carta de Belgrado sin abrir — es de hoy</a></p>' : ""}
        <h3>${esc(regla.titulo)}</h3>
        ${regla.cierran.length ? `<p>✕ Cierran: ${esc(regla.cierran.slice(0, 4).join(", "))}${regla.cierran.length > 4 ? "…" : ""}</p>` : ""}
        ${regla.abren.length ? `<p>✓ ${esc(regla.abren[0])}</p>` : ""}
        ${evs.map((e) => `<p>♪ ${esc(e.nombre)} — ${esc(e.lugar)}</p>`).join("")}
        <p><a href="#/agenda">Ver el día completo →</a></p>`;
    } else {
      inner = `<span class="today-tag">El plan</span>
        <h3>Miércoles 22 → jueves 30 de julio</h3>
        <p>Vuelo Madrid → Belgrado (~16:00). Base: apartamento Elysian, Risanska 9, Savski Venac.</p>
        <p>9 días, dos ríos, una fortaleza y cero prisas. <a href="#/agenda">La agenda, día a día →</a></p>`;
    }
    $("#todayCard").innerHTML = `<div class="today-card reveal">${inner}</div>`;
  }

  /* Modo calle: atajos operativos durante el viaje */
  function renderCalle() {
    const box = $("#calleBar"); if (!box) return;
    const iso = new Date().toISOString().slice(0, 10);
    const enViaje = (iso >= "2026-07-22" && iso <= "2026-07-30") || localStorage.getItem("bg26_calle_demo");
    if (!enViaje) { box.innerHTML = ""; return; }
    const abiertos = DATA.sitios.filter((s) => s.horario && estadoSitio(s).open).length;
    box.innerHTML = `<div class="calle-bar reveal in">
      <span class="cb-tag">MODO CALLE</span>
      <a href="#/ver">◈ ${abiertos} abiertos ahora</a>
      <a href="#/mapa">◎ Mapa</a>
      <button id="cbFx">дин Cambio</button>
      <a href="#/agenda">▦ Hoy</a>
    </div>`;
    $("#cbFx").addEventListener("click", () => $("#cambioBox").scrollIntoView({ block: "center", behavior: "smooth" }));
  }

  /* Guía de instalación si aún no está en el bolsillo */
  function renderInstall() {
    const box = $("#installBox"); if (!box) return;
    const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    if (standalone) { box.innerHTML = ""; return; }
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    box.innerHTML = `<div class="install-card reveal">
      <span class="in-tag">📲 Llévame en el bolsillo</span>
      <p>${ios
        ? "En iPhone: toca <b>Compartir</b> (el cuadrado con flecha) y elige <b>«Añadir a pantalla de inicio»</b>. Icono propio, pantalla completa y funciono sin conexión."
        : "En Android: menú <b>⋮</b> del navegador → <b>«Instalar aplicación»</b> (o «Añadir a pantalla de inicio»). Icono propio, pantalla completa y funciono sin conexión."}</p>
    </div>`;
  }

  /* Recordatorio de respaldo (una vez por sesión) */
  function avisoRespaldo() {
    const items = getNotas().length + getGastos().length;
    const last = +(localStorage.getItem("bg26_lastexport") || 0);
    if (items >= 5 && Date.now() - last > 7 * 864e5) {
      setTimeout(() => toast("Consejo de Б.: exportad copia del cuaderno (✎ → Exportar). Los móviles se pierden; las ciudades, no."), 3500);
    }
  }

  function renderPrologo() {
    const box = $("#prologo"); if (!box || box.innerHTML) return;
    const p = DATA.viaje.prologo;
    box.innerHTML = `<div class="prologo-card reveal">
      <span class="pr-tag">${esc(p.titulo)}</span>
      ${p.texto.split("\n\n").map((t) => `<p>${esc(t)}</p>`).join("")}
      <span class="pr-firma">${esc(p.firma)}</span>
    </div>`;
  }

  /* ---------- MAPA INFOGRÁFICO DE ZONAS ---------- */
  const ZONE_COLORS = ["#d16d4b", "#458e87", "#d2a43a", "#6f72b8", "#b4587a", "#4d88b8", "#758f45", "#9b6c43"];
  let homeZoneMap = null;
  function zoneHref(id) { return `#/zona?id=${encodeURIComponent(id)}`; }
  function renderZoneMapHome() {
    const root = $("#zoneMapHome"); if (!root || !DATA.mapaZonas) return;
    if (homeZoneMap) { homeZoneMap.remove(); homeZoneMap = null; }
    const m = DATA.mapaZonas;
    const key = m.zonas.map((z, i) => `<a class="zone-key-link" href="${zoneHref(z.id)}" data-zone-id="${z.id}" style="--zone:${ZONE_COLORS[i % ZONE_COLORS.length]}"><span class="zone-dot"></span><span><b>${esc(z.nombre)}</b><br>${esc(z.sub)}</span></a>`).join("");
    root.innerHTML = `<section class="zone-map-card"><div class="zone-map-head"><h2>${esc(m.titulo)}</h2><p>${esc(m.intro)}</p></div><div class="zone-map-wrap"><div class="home-zone-map" id="homeZoneMap" role="img" aria-label="Mapa real interactivo de las zonas de Belgrado"></div><span class="zone-map-hint">Toca un contorno para abrir la zona</span></div><div class="zone-map-key">${key}</div></section>`;
    requestAnimationFrame(() => {
      if (!window.L || !$("#homeZoneMap")) return;
      homeZoneMap = L.map("homeZoneMap", { scrollWheelZoom: false, zoomControl: true, attributionControl: true, zoomSnap: .5 }).setView(DATA.viaje.alojamiento.coords, 12);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>' }).addTo(homeZoneMap);
      const bounds = L.latLngBounds([]);
      m.zonas.forEach((z, i) => {
        const color = ZONE_COLORS[i % ZONE_COLORS.length];
        const circle = L.circle(z.centro, { radius: (z.mapRadio || z.radio * .68) * 1000, color, weight: 3, opacity: .95, fillColor: color, fillOpacity: .07, dashArray: "7 6" }).addTo(homeZoneMap);
        circle.bindTooltip(z.corto, { permanent: true, direction: "center", className: "home-zone-label" });
        circle.on("click", () => { location.hash = zoneHref(z.id); });
        bounds.extend(circle.getBounds());
      });
      const homeIcon = L.divIcon({ className: "home-map-pin", html: "⌂", iconSize: [28, 28], iconAnchor: [14, 14] });
      L.marker(DATA.viaje.alojamiento.coords, { icon: homeIcon }).addTo(homeZoneMap).bindTooltip("Vuestra base", { direction: "top" });
      homeZoneMap.fitBounds(bounds, { padding: [24, 24] });
    });
  }

  function zoneIdFromHash() { return new URLSearchParams(location.hash.split("?")[1] || "").get("id") || ""; }
  function nearZone(coords, z) { return coords && distKm(z.centro, coords) <= z.radio; }
  function renderZona(el) {
    const z = DATA.mapaZonas.zonas.find((x) => x.id === zoneIdFromHash()) || DATA.mapaZonas.zonas[0];
    const barrios = DATA.barrios.filter((b) => z.barrios.includes(b.id));
    const sitios = [...DATA.sitios.filter((s) => nearZone(s.coords, z)), ...(z.extras?.ver || [])].sort((a, b) => distKm(z.centro, a.coords) - distKm(z.centro, b.coords));
    const comidas = [...DATA.comer.bloques.flatMap((b) => b.sitios.map((s) => ({ ...s, bloque: b.titulo }))).filter((s) => nearZone(s.coords, z)), ...(z.extras?.comer || []).map((s) => ({ ...s, bloque: "Recomendación de la zona" }))].sort((a, b) => distKm(z.centro, a.coords) - distKm(z.centro, b.coords));
    const noche = [...DATA.noche.zonas.filter((n) => nearZone(n.coords, z)).map((n) => ({ ...n, formato: "zona" })), ...(z.extras?.beber || []).map((s) => ({ ...s, formato: "sitio" }))].sort((a, b) => distKm(z.centro, a.coords) - distKm(z.centro, b.coords));
    const contexto = barrios.length ? barrios.map((b) => `<article class="card zone-detail-lead reveal"><span class="chip chip-sec">${esc(b.tag)}</span><h3>${esc(b.nombre)}</h3><p>${esc(b.desc)}</p><div class="zone-facts"><div class="zone-fact"><b>Qué hacer</b>${esc(b.hacer)}</div><div class="zone-fact"><b>Parada</b>${esc(b.parada)}</div><div class="zone-fact"><b>La capa histórica</b>${esc(b.dato)}</div><div class="zone-fact"><b>Cómo llegar</b>${esc(b.comoLlegar)}</div></div></article>`).join("") : `<article class="card zone-detail-lead"><h3>${esc(z.nombre)}</h3><p>${esc(z.sub)}</p></article>`;
    const visual = z.visual ? `<article class="card zone-visual reveal">${foto(z.visual, z.nombre, z.visualExt || "jpg")}<p class="foto-nota">Imagen editorial para situar el ambiente de la zona.</p></article>` : "";
    const group = (titulo, icono, items, render) => `<div class="zone-section-title"><h3>${icono} ${titulo}</h3><span>${items.length} cerca</span></div>${items.length ? items.map(render).join("") : '<p class="muted">No hay fichas cercanas todavía.</p>'}`;
    const ver = group("Qué ver", "◈", sitios, (s) => `<article class="zone-place reveal"><h4>${esc(s.nombre)} ${fiab(s.fiab)} ${planBtn(s.planId || s.id)}</h4><p>${esc(s.desc)}</p><p class="muted small">📍 ${esc(s.zona)} · ${esc(s.dur)} · ${esc(s.precio)}</p><p class="small"><a href="https://www.google.com/maps/search/?api=1&query=${s.coords.join(",")}" target="_blank" rel="noopener">navegar</a></p></article>`);
    const comer = group("Comer", "♨", comidas, (s) => `<article class="zone-place reveal"><h4>${esc(s.nombre)} ${fiab(s.fiab)} ${planBtn(s.planId || "c-" + slug(s.nombre))}</h4><p>${esc(s.nota)}</p><p class="muted small">${esc(s.bloque)} · 📍 ${esc(s.zona)}</p></article>`);
    const salir = group("Beber y salir", "☾", noche, (n) => n.formato === "zona" ? `<article class="zone-place reveal"><h4>${esc(n.nombre)} ${planBtn("n-" + slug(n.nombre))}</h4><p>${esc(n.desc)}</p><ul class="lista-sitios">${n.sitios.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></article>` : `<article class="zone-place reveal"><h4>${esc(n.nombre)} ${fiab(n.fiab)} ${planBtn(n.planId)}</h4><p>${esc(n.nota)}</p><p class="muted small">📍 ${esc(n.zona)}</p></article>`);
    el.innerHTML = pageShell("zona", `${esc(z.sub)} · selección automática en un radio aproximado de ${String(z.radio).replace(".", ",")} km.`, visual + contexto + ver + comer + salir);
    const h = el.querySelector(".page-head h2"); if (h) h.textContent = z.nombre;
  }

  function renderStamps() {
    const box = $("#stampsBox"); if (!box) return;
    const sellos = getSellos().filter((id) => DATA.sitios.some((s) => s.id === id));
    const total = DATA.sitios.length;
    if (!sellos.length) {
      box.innerHTML = `<div class="stamps-card reveal"><div class="st-head"><h3>🛂 Pasaporte del viaje</h3><span class="st-count">0 / ${total}</span></div>
      <p class="muted small">Cada sitio visitado se puede «sellar» desde su ficha. Los sellos aparecerán aquí.</p></div>`;
      return;
    }
    box.innerHTML = `<div class="stamps-card reveal in">
      <div class="st-head"><h3>🛂 Pasaporte del viaje</h3><span class="st-count">${sellos.length} / ${total}</span></div>
      <div class="st-grid">${sellos.map((id, i) => {
        const s = DATA.sitios.find((x) => x.id === id);
        return `<span class="st-stamp" style="--rot:${(i % 5) - 2}deg">${esc(s.nombre.split("·")[0].split(" de ")[0].trim().slice(0, 18))}<i>БЕОГРАД</i></span>`;
      }).join("")}</div>
      <div class="st-bar"><i style="width:${Math.round((sellos.length / total) * 100)}%"></i></div>
    </div>`;
  }

  /* ---------- VIÑETAS DE SECCIÓN (línea, mismo trazo que el skyline) ---------- */
  const V = (inner) => `<svg class="ph-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  const VINETAS = {
    agenda: V('<rect x="8" y="10" width="32" height="30" rx="3"/><line x1="8" y1="19" x2="40" y2="19"/><line x1="16" y1="6" x2="16" y2="13"/><line x1="32" y1="6" x2="32" y2="13"/><circle cx="24" cy="29" r="4"/>'),
    cartas: V('<rect x="6" y="12" width="36" height="26" rx="3"/><path d="M6 14 L24 28 L42 14"/><circle cx="24" cy="30" r="4" fill="currentColor" stroke="none" opacity=".5"/>'),
    barrios: V('<path d="M6 40 L6 26 L14 18 L22 26 L22 40"/><path d="M22 40 L22 22 L32 12 L42 22 L42 40"/><line x1="4" y1="40" x2="44" y2="40"/>'),
    paseos: V('<path d="M10 40 C 16 32, 8 26, 16 20 C 22 15, 30 20, 28 27"/><path d="M28 27 C 26 33, 34 34, 38 28"/><path d="M36 12 l4 -4 M40 16 l4 -4"/>'),
    ver: V('<polygon points="24,6 44,16 4,16"/><line x1="9" y1="20" x2="9" y2="36"/><line x1="19" y1="20" x2="19" y2="36"/><line x1="29" y1="20" x2="29" y2="36"/><line x1="39" y1="20" x2="39" y2="36"/><line x1="4" y1="40" x2="44" y2="40"/>'),
    mapa: V('<path d="M24 42 C 24 42, 38 28, 38 18 A 14 14 0 0 0 10 18 C 10 28, 24 42, 24 42 Z"/><circle cx="24" cy="18" r="5"/>'),
    comer: V('<circle cx="26" cy="26" r="14"/><circle cx="26" cy="26" r="7"/><path d="M8 8 L8 20 M5 8 L5 14 M11 8 L11 14 M8 20 L8 40"/>'),
    noche: V('<path d="M12 14 L14 40 L32 40 L34 14 Z"/><path d="M34 18 L40 18 A 4 5 0 0 1 40 28 L 33 28"/><path d="M13 20 Q 23 15, 33 20" opacity=".6"/>'),
    escena: V('<rect x="6" y="18" width="36" height="22" rx="3"/><path d="M6 18 L10 8 L42 12 L40 18"/><line x1="16" y1="9" x2="14" y2="16"/><line x1="24" y1="10" x2="22" y2="17"/><line x1="32" y1="11" x2="30" y2="18"/>'),
    alrededores: V('<rect x="10" y="8" width="28" height="26" rx="6"/><line x1="10" y1="22" x2="38" y2="22"/><circle cx="17" cy="28" r="2.4"/><circle cx="31" cy="28" r="2.4"/><path d="M14 40 l-3 4 M34 40 l3 4 M18 34 l-2 6 M30 34 l2 6"/>'),
    historia: V('<path d="M10 42 L10 20 L16 20 L16 14 L20 14 L20 20 L28 20 L28 14 L32 14 L32 20 L38 20 L38 42"/><line x1="6" y1="42" x2="42" y2="42"/><path d="M24 20 L24 8 L32 11 L24 14"/>'),
    costumbres: V('<path d="M14 20 L14 34 A 8 6 0 0 0 30 34 L30 20 Z"/><path d="M22 20 L22 12 A 4 3 0 0 1 30 12"/><path d="M14 26 L4 22"/><path d="M18 40 L28 40"/>'),
    transporte: V('<rect x="8" y="8" width="32" height="28" rx="5"/><line x1="8" y1="24" x2="40" y2="24"/><rect x="13" y="13" width="9" height="7" rx="1"/><rect x="26" y="13" width="9" height="7" rx="1"/><circle cx="15" cy="30" r="2.2"/><circle cx="33" cy="30" r="2.2"/><line x1="14" y1="40" x2="12" y2="44"/><line x1="34" y1="40" x2="36" y2="44"/>'),
    cuaderno: V('<rect x="10" y="6" width="28" height="36" rx="3"/><line x1="16" y1="6" x2="16" y2="42"/><line x1="22" y1="16" x2="33" y2="16"/><line x1="22" y1="23" x2="33" y2="23"/><line x1="22" y1="30" x2="29" y2="30"/>'),
    gastos: V('<ellipse cx="24" cy="14" rx="14" ry="5"/><path d="M10 14 L10 34 A 14 5 0 0 0 38 34 L38 14"/><path d="M10 24 A 14 5 0 0 0 38 24"/>'),
    practico: V('<rect x="8" y="16" width="32" height="24" rx="4"/><path d="M18 16 L18 10 A 3 3 0 0 1 21 7 L27 7 A 3 3 0 0 1 30 10 L30 16"/><line x1="16" y1="16" x2="16" y2="40"/><line x1="32" y1="16" x2="32" y2="40"/>'),
  };

  /* ---------- PAGE SHELL ---------- */
  function pageShell(id, introHtml, bodyHtml) {
    const m = pageMeta(id);
    return `<div class="wrap">
      <div class="page-head">
        <span class="ph-cyr">${m.cyr}</span>
        <span class="ph-outline" aria-hidden="true">${m.num}</span>
        ${VINETAS[id] || ""}
        <span class="ph-num">SECCIÓN ${m.num}</span>
        <h2>${m.title}</h2>
        <div class="ph-rule"></div>
        ${introHtml ? `<p class="page-intro">${introHtml}</p>` : ""}
      </div>
      ${bodyHtml}
    </div>`;
  }

  /* --- AGENDA --- */
  function fechasViaje() {
    const out = [];
    for (let d = 22; d <= 30; d++) out.push(new Date(`2026-07-${pad(d)}T12:00:00+02:00`));
    return out;
  }
  function metDia(iso) {
    try {
      const w = JSON.parse(localStorage.getItem("bg26_meteo"));
      const i = w.daily.time.indexOf(iso);
      if (i < 0) return "";
      const WMO2 = { 0: "☀️", 1: "🌤", 2: "⛅", 3: "☁️", 45: "🌫", 48: "🌫", 51: "🌦", 53: "🌦", 55: "🌧", 61: "🌧", 63: "🌧", 65: "🌧", 80: "🌦", 81: "🌧", 82: "⛈", 95: "⛈", 96: "⛈", 99: "⛈" };
      return `<span class="day-met">${WMO2[w.daily.weather_code[i]] || "🌡"} ${Math.round(w.daily.temperature_2m_max[i])}°<i>/${Math.round(w.daily.temperature_2m_min[i])}°</i></span>`;
    } catch { return ""; }
  }
  function renderAgenda(el) {
    const hoyIso = new Date().toISOString().slice(0, 10);
    const plan = getPlan();
    const cards = fechasViaje().map((f) => {
      const iso = f.toISOString().slice(0, 10);
      const wd = ((f.getDay() + 6) % 7) + 1;
      const regla = DATA.reglasSemana[wd];
      const evs = DATA.eventos.filter((e) => e.fecha === iso);
      const esp = DATA.dias.find((d) => d.fecha === iso);
      const mios = (plan[iso] || []).filter((id) => PLANNABLES[id]);
      const items = [
        ...(esp ? [`<li class="dl-open"><b>${esc(esp.nota)}</b></li>`] : []),
        ...regla.cierran.map((c) => `<li class="dl-close">Cierra: ${esc(c)}</li>`),
        ...regla.abren.map((a) => `<li class="dl-open">${esc(a)}</li>`),
        ...evs.map((e) => `<li class="dl-event">${esc(e.nombre)} · ${esc(e.lugar)} <span class="muted small">(${esc(e.genero)})</span> ${fiab(e.fiab)}</li>`),
        ...(regla.sug ? [`<li>💡 ${esc(regla.sug)}</li>`] : []),
      ].join("");
      const conCoords = mios.filter((id) => PLANNABLES[id].coords).length;
      const miPlan = mios.length ? `<div class="mi-plan"><span class="mp-tag">Tu plan</span><ul>
        ${mios.map((id) => `<li>${PLANNABLES[id].emoji} ${esc(PLANNABLES[id].nombre)}
          <button class="mp-x" data-unplan="${iso}|${id}" title="Quitar">✕</button></li>`).join("")}</ul>
        ${conCoords >= 2 ? `<button class="ruta-btn" data-ruta="${iso}">🗺 Ver la ruta del día en el mapa</button>` : ""}</div>` : "";
      return `<article class="card day-card reveal ${iso === hoyIso ? "today-hl" : ""}">
        <div class="day-date"><span class="day-num">${f.getDate()}</span>
        <span class="day-wd">${DIAS_SEM[wd]} · julio</span>
        ${metDia(iso)}
        ${iso === hoyIso ? '<span class="chip chip-sec">HOY</span>' : ""}
        <button class="share-day" data-share-day="${iso}" title="Compartir este día">↗</button></div>
        ${miPlan}
        <ul class="day-list">${items}</ul></article>`;
    }).join("");
    el.innerHTML = pageShell("agenda",
      "Los días buenos no se planifican: se preparan. Aquí está lo que abre, lo que cierra y lo que suena cada jornada — el resto se decide andando. Con «＋ plan» en cualquier ficha construís vuestro día; con ↗ se comparte.",
      cards + `<p class="muted small">${esc(DATA.eventosNota)}</p>`);
    $$("[data-share-day]", el).forEach((b) => b.addEventListener("click", () => shareDay(b.dataset.shareDay)));
  }
  function shareDay(iso) {
    const f = new Date(iso + "T12:00:00");
    const wd = ((f.getDay() + 6) % 7) + 1;
    const regla = DATA.reglasSemana[wd];
    const plan = (getPlan()[iso] || []).filter((id) => PLANNABLES[id]).map((id) => `· ${PLANNABLES[id].nombre}`);
    const evs = DATA.eventos.filter((e) => e.fecha === iso).map((e) => `♪ ${e.nombre} (${e.lugar})`);
    const txt = [`БЕОГРАД · ${DIAS_SEM[wd]} ${f.getDate()} de julio`,
      plan.length ? `\nNuestro plan:\n${plan.join("\n")}` : "",
      regla.cierran.length ? `\nOjo, cierra: ${regla.cierran.slice(0, 3).join(", ")}` : "",
      evs.length ? `\n${evs.join("\n")}` : ""].filter(Boolean).join("\n");
    if (navigator.share) navigator.share({ title: "Belgrado 26", text: txt }).catch(() => {});
    else { navigator.clipboard?.writeText(txt); toast("El día, copiado. — Б."); }
  }

  /* --- BARRIOS --- */
  function renderBarrios(el) {
    const cards = DATA.barrios.map((b) => `<article class="card reveal">
      <span class="chip chip-sec">${esc(b.tag)}</span> ${planBtn("b-" + b.id)}
      <h3>${esc(b.nombre)}</h3>
      <p>${esc(b.desc)}</p>
      ${b.hacer ? `<h4>Qué hacer</h4><p>${esc(b.hacer)}</p>` : ""}
      ${b.parada ? `<h4>Dónde parar</h4><p>${esc(b.parada)}</p>` : ""}
      ${b.dato ? `<p class="barrio-dato">✦ ${esc(b.dato)}</p>` : ""}
      <h4>Cerca</h4><p class="muted">${esc(b.cerca)}</p>
      <h4>Cómo llegar</h4><p class="muted">${esc(b.comoLlegar)}</p>
      <p><a href="#/mapa" data-fly="${b.coords.join(",")}">Ver en el mapa →</a></p>
    </article>`).join("");
    el.innerHTML = pageShell("barrios",
      "Belgrado no tiene un centro: tiene capas que no terminaron de irse. Cada barrio es una época con terraza. Estas son las piezas del tablero, medidas desde vuestra puerta de Savski Venac.", cards);
  }

  /* --- PASEOS --- */
  function renderPaseos(el) {
    const cards = DATA.paseos.map((p) => `<article class="card paseo-card reveal">
      <div class="paseo-head">
        <h3>${esc(p.nombre)}</h3>
        ${planBtn(p.id)}
      </div>
      <div class="sitio-meta"><span>⏱ <b>${esc(p.dur)}</b></span><span>📏 ${esc(p.dist)}</span></div>
      <p class="muted small">🕐 ${esc(p.cuando)}</p>
      <p>${esc(p.resumen)}</p>
      <ol class="paseo-paradas">
        ${p.paradas.map((s) => `<li><b>${esc(s.n)}</b><span>${esc(s.txt)}</span></li>`).join("")}
      </ol>
      <button class="ruta-btn" data-ruta-paseo="${p.id}">🗺 Dibujar este paseo en el mapa</button>
    </article>`).join("");
    el.innerHTML = pageShell("paseos",
      "Seis rutas a pie diseñadas para vosotros: paradas ordenadas, contexto en cada una y el trazado en el mapa con un toque. Son piezas, no obligaciones — combinadlas con la agenda como queráis.",
      cards);
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ruta-paseo]");
    if (!b) return;
    const p = DATA.paseos.find((x) => x.id === b.dataset.rutaPaseo);
    if (!p) return;
    window.__route = p.paradas.map((s, i) => ({ coords: s.coords, n: i + 1, nombre: s.n }));
    window.__routeSinCasa = p.id === "paseo-novisad"; // el de Novi Sad no arranca en casa
    location.hash = "#/mapa";
  });

  /* fotos (Wikimedia, con degradación silenciosa si falta el archivo) */
  const foto = (id, alt, ext = "jpg") => `<figure class="card-foto"><img src="imgs/${id}.${ext}" alt="${esc(alt || "")}" loading="lazy" onerror="this.parentElement.remove()"></figure>`;
  const syncFolds = (root) => requestAnimationFrame(() => root.querySelectorAll("details.fold-card").forEach((d) => { d.open = matchMedia("(min-width: 681px)").matches; }));
  matchMedia("(min-width: 681px)").addEventListener("change", () => syncFolds(document));

  /* --- QUÉ VER --- */
  function estadoSitio(s, ref) {
    const now = ref || new Date();
    const wd = ((now.getDay() + 6) % 7) + 1;
    const h = now.getHours() + now.getMinutes() / 60;
    if (!s.horario) return { cls: "abierto", txt: "Espacio abierto", hoy: s.siempre || "", open: true };
    const hoy = s.horario[wd];
    const fmt = (x) => `${Math.floor(x)}:${pad(Math.round((x % 1) * 60))}`;
    if (!hoy) return { cls: "cerrado", txt: "Hoy cerrado", hoy: s.soloDias || "Cierra este día de la semana", open: false };
    const rango = `Hoy: ${fmt(hoy[0])}–${fmt(hoy[1])}`;
    if (h >= hoy[0] && h < hoy[1]) {
      return h > hoy[1] - 1
        ? { cls: "pronto", txt: `Cierra pronto (${fmt(hoy[1])})`, hoy: rango, open: true }
        : { cls: "abierto", txt: "Abierto ahora", hoy: rango, open: true };
    }
    return { cls: "cerrado", txt: h < hoy[0] ? `Abre a las ${fmt(hoy[0])}` : "Ya cerrado hoy", hoy: rango, open: false };
  }
  function renderVer(el) {
    const cards = DATA.sitios.map((s) => {
      const st = estadoSitio(s);
      return `<article class="card entrada reveal ${getSellos().includes(s.id) ? "sellado" : ""}">
        ${foto(s.id, s.nombre)}
        <h3>${esc(s.nombre)}</h3>
        <div class="sitio-meta">
          <span class="estado ${st.cls}">${st.txt}</span>
          <span>📍 <b>${esc(s.zona)}</b></span><span>⏱ ${esc(s.dur)}</span>
        </div>
        <div class="sitio-meta"><span>🎟 <b>${esc(s.precio)}</b></span><span>${esc(st.hoy)}</span>${walkChip(s.coords)}</div>
        <p>${esc(s.desc)}</p>
        ${s.consejo ? `<p class="consejo">${esc(s.consejo)}</p>` : ""}
        <div class="card-actions">${planBtn(s.id)} ${selloBtn(s.id)}</div>
        <p class="fuente">${fiab(s.fiab)} ${esc(s.fuente || "")} · <a href="#/mapa" data-fly="${s.coords.join(",")}">mapa</a> · <a href="https://www.google.com/maps/search/?api=1&query=${s.coords.join(",")}" target="_blank" rel="noopener">navegar</a></p>
      </article>`;
    }).join("");
    el.innerHTML = pageShell("ver",
      `${DATA.sitios.length} lugares que justifican el billete, del coloso de mosaico al laboratorio urbano de Novi Beograd. El estado «abierto / cerrado» se calcula con la hora real de tu móvil; «＋ plan» lo manda a un día, y el sello, al pasaporte del viaje.`, cards);
  }

  /* --- MAPA --- */
  function renderMapa(el) {
    el.innerHTML = pageShell("mapa",
      "Alojamiento, museos, comida, noche y vuestras notas — con radios de tiempo a pie desde casa. El mapa necesita conexión; sin ella, usa los enlaces «navegar» de cada ficha.",
      `<div class="map-filtros" id="mapFiltros"></div>
       <div id="mapBox"></div>
       <p class="map-nota">📍 Posición del apartamento aproximada. Los anillos = ~10 / 20 / 30 min andando desde Risanska 9.</p>`);
    requestAnimationFrame(() => window.BGMap && BGMap.init());
  }

  /* --- COMER --- */
  const testimonioHtml = (t) => t ? `<blockquote class="testimonio">${esc(t.cita)}<span class="t-src">— ${esc(t.fuente)}</span></blockquote>` : "";
  function renderComer(el) {
    const open = matchMedia("(min-width: 681px)").matches ? " open" : "";
    const bloques = DATA.comer.bloques.map((b) => `<details class="card reveal fold-card food-block"${open}>
      <summary class="fold-summary"><span><span class="food-kind">${esc(b.tag || "Para comer")}</span><h3>${esc(b.titulo)}</h3><small>${esc(b.resumen || b.texto.split(".")[0] + ".")}</small></span><i aria-hidden="true">＋</i></summary>
      <div class="fold-body">
        ${b.img ? foto(b.img, b.titulo, b.imgExt || "jpg") : ""}
        <p>${esc(b.texto)}</p>
        ${b.sitios.map((s) => `<section class="food-place ${s.veredicto ? "food-picked" : ""}">
          <div class="food-place-head"><h4>${esc(s.nombre)} ${fiab(s.fiab)}</h4>${planBtn("c-" + slug(s.nombre))}</div>
          <div class="food-chips">${s.veredicto ? `<span>${esc(s.veredicto)}</span>` : ""}${s.precio ? `<span>${esc(s.precio)}</span>` : ""}<span>📍 ${esc(s.zona)}</span></div>
          ${s.pedir ? `<p class="food-order"><b>Pedid esto:</b> ${esc(s.pedir)}</p>` : ""}
          <p>${esc(s.nota)}</p>${testimonioHtml(s.testimonio)}
          ${s.coords ? `<p class="small"><a href="#/mapa" data-fly="${s.coords.join(",")}">mapa</a> · <a href="https://www.google.com/maps/search/?api=1&query=${s.coords.join(",")}" target="_blank" rel="noopener">navegar</a></p>` : ""}
        </section>`).join("")}
      </div>
    </details>`).join("");
    const glosario = `<article class="card reveal"><h3>📖 Diccionario para pedir sin miedo</h3>
      <p class="muted small">Los ${DATA.glosario.length} términos que agotan el 90% de cualquier carta serbia. También salen en el buscador (🔍).</p>
      <div class="glosario">${DATA.glosario.map((g) => `<div class="glo-item"><b>${esc(g.t)}</b><span>${esc(g.d)}</span></div>`).join("")}</div>
    </article>`;
    el.innerHTML = pageShell("comer", esc(DATA.comer.intro), bloques + glosario);
    syncFolds(el);
  }

  /* --- NOCHE --- */
  function renderNoche(el) {
    const zonas = DATA.noche.zonas.map((z) => `<details class="card reveal fold-card">
      <summary class="fold-summary"><span><span class="hora-tag">${esc(z.cuando)}</span><h3>${esc(z.nombre)}</h3><small>${esc(z.desc.split(".")[0] + ".")}</small></span><i aria-hidden="true">＋</i></summary>
      <div class="fold-body">${z.img ? foto(z.img, z.nombre, z.imgExt || "jpg") : ""}
        <div class="sitio-meta">${walkChip(z.coords)}</div><p>${esc(z.desc)}</p>${testimonioHtml(z.testimonio)}
        <ul class="lista-sitios">${z.sitios.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        <div class="card-actions">${planBtn("n-" + slug(z.nombre))}</div><p class="small"><a href="#/mapa" data-fly="${z.coords.join(",")}">Ver zona en el mapa →</a></p>
      </div>
    </details>`).join("");
    el.innerHTML = pageShell("noche", esc(DATA.noche.intro), zonas);
    syncFolds(el);
  }

  /* --- CARTAS DE BELGRADO --- */
  const CARTAS_KEY = "bg26_cartas";
  function renderCartas(el) {
    const leidas = new Set(JSON.parse(localStorage.getItem(CARTAS_KEY) || "[]"));
    const hoy = new Date().toISOString().slice(0, 10);
    const cards = DATA.cartas.items.map((c, i) => {
      const f = new Date(c.fecha + "T12:00:00");
      const wd = ((f.getDay() + 6) % 7) + 1;
      const abierta = hoy >= c.fecha;
      const leida = leidas.has(c.fecha);
      const mes = MESES[f.getMonth()];
      const etiqueta = c.extra ? "P. D." : `Carta ${i + 1} de 9`;
      if (!abierta) {
        return `<article class="card carta carta-sellada reveal">
          <div class="carta-solapa"></div>
          <div class="carta-lacre">А&Л</div>
          <span class="carta-num">${etiqueta}</span>
          <h3 class="carta-fecha">${c.extra ? "llega cuando tenga que llegar" : `${DIAS_SEM[wd]} ${f.getDate()} de ${mes}`}</h3>
          <p class="carta-cerrada-txt">${c.extra ? "El correo balcánico tiene sus tiempos." : "Sellada. Se abre sola la mañana de su día."}</p>
        </article>`;
      }
      return `<article class="card carta carta-abierta reveal ${leida ? "" : "carta-nueva"}" data-carta="${c.fecha}">
        <span class="carta-num">${etiqueta} · ${DIAS_SEM[wd]} ${f.getDate()} de ${mes} ${leida ? "" : '<span class="chip chip-sec">NUEVA</span>'}</span>
        <h3>${esc(c.titulo)}</h3>
        <div class="carta-cuerpo" ${leida ? "" : "hidden"}>
          ${c.texto.split("\n\n").map((t) => `<p>${esc(t)}</p>`).join("")}
          <span class="carta-firma">${esc(DATA.cartas.firma)}</span>
        </div>
        ${leida ? "" : `<button class="btn carta-abrir" data-abrir="${c.fecha}">Romper el sello ✉</button>`}
      </article>`;
    }).join("");
    el.innerHTML = pageShell("cartas", esc(DATA.cartas.intro), cards);
    $$("[data-abrir]", el).forEach((b) => b.addEventListener("click", () => {
      const fecha = b.dataset.abrir;
      leidas.add(fecha);
      localStorage.setItem(CARTAS_KEY, JSON.stringify([...leidas]));
      const card = b.closest(".carta");
      card.classList.remove("carta-nueva");
      card.querySelector(".carta-cuerpo").hidden = false;
      b.remove();
      navigator.vibrate && navigator.vibrate([12, 40, 12]);
    }));
  }
  /* aviso de carta nueva en portada durante el viaje */
  function cartaHoyPendiente() {
    const hoy = new Date().toISOString().slice(0, 10);
    if (!(hoy >= "2026-07-22" && hoy <= "2026-07-30")) return false;
    const leidas = new Set(JSON.parse(localStorage.getItem(CARTAS_KEY) || "[]"));
    return DATA.cartas.items.some((c) => c.fecha === hoy && !leidas.has(c.fecha));
  }

  /* --- ESCENA: CINE Y MÚSICA --- */
  function renderEscena(el) {
    const pl = DATA.escena.playlist;
    const playlist = `<article class="card playlist-card reveal">
      <span class="pl-tag">♫ La banda sonora del viaje</span>
      <h3>${esc(pl.nombre)}</h3>
      <p>${esc(pl.desc)}</p>
      <p class="consejo">${esc(pl.consejo)}</p>
      <p><a class="btn" href="${pl.url}" target="_blank" rel="noopener">▶ Abrir en Spotify</a></p>
    </article>`;
    const bloques = playlist + DATA.escena.bloques.map((b) => `<article class="card reveal">
      <h3>${esc(b.titulo)}</h3><p>${esc(b.texto)}</p>
      ${b.sitios.map((s) => `<h4>${esc(s.nombre)} ${fiab(s.fiab)}</h4>
        <p class="muted small">📍 ${esc(s.zona)}</p>
        <p>${esc(s.nota)}</p>
        ${s.fuente ? `<p class="fuente">${esc(s.fuente)}</p>` : ""}
        ${s.coords ? `<p class="small"><a href="#/mapa" data-fly="${s.coords.join(",")}">mapa</a> · <a href="https://www.google.com/maps/search/?api=1&query=${s.coords.join(",")}" target="_blank" rel="noopener">navegar</a></p>` : ""}`).join("")}
    </article>`).join("");
    // cartelera Kinoteka día a día
    const k = DATA.escena.kinoteka;
    const hoyIso = new Date().toISOString().slice(0, 10);
    const cartelera = k ? `<article class="card reveal">
      <h3>${esc(k.titulo)}</h3>
      <p class="muted small">${esc(k.nota)}</p>
      <div class="cartelera">${k.dias.map((d) => {
        const dd = new Date(d.f + "T12:00:00"); const wd = ((dd.getDay() + 6) % 7) + 1;
        return `<div class="cart-dia ${d.f === hoyIso ? "cart-hoy" : ""}">
          <div class="cart-fecha"><b>${dd.getDate()}</b><span>${DIAS_SEM[wd].slice(0, 3)}</span></div>
          <ul class="cart-films">${d.films.map((f) => `<li class="${f.joya ? "cart-joya" : ""}"><span class="cart-h">${esc(f.h)}</span> <b>${esc(f.t)}</b> <span class="cart-dir">${esc(f.dir)}</span></li>`).join("")}</ul>
        </div>`;
      }).join("")}</div>
    </article>` : "";
    el.innerHTML = pageShell("escena", esc(DATA.escena.intro), bloques + cartelera);
  }

  /* --- ALREDEDORES --- */
  function renderAlrededores(el) {
    const cards = DATA.alrededores.map((a) => `<article class="card reveal">
      <span class="chip chip-sec">${esc(a.nivel)}</span> ${planBtn(a.id)}
      <h3>${esc(a.nombre)}</h3>
      <div class="sitio-meta"><span>🚆 <b>${esc(a.dist)}</b></span></div>
      <h4>Cómo</h4><p>${esc(a.como)}</p>
      <h4>Qué</h4><p>${esc(a.que)}</p>
      ${a.nota ? `<p class="muted small">${esc(a.nota)}</p>` : ""}
      ${a.aviso ? `<p class="consejo">${esc(a.aviso)}</p>` : ""}
      <p class="fuente">${fiab(a.fiab)} ${esc(a.fuente || "")}</p>
    </article>`).join("");
    el.innerHTML = pageShell("alrededores",
      "Todo lo que merece la pena fuera de la ciudad, filtrado con dos criterios innegociables: sin coche y sin palizas de autobús. Lo que sobrevive a ese filtro — el criterio Laura — es esto.", cards);
  }

  /* --- HISTORIA --- */
  function renderHistoria(el) {
    const capas = DATA.historia.capas.map((c) => `<div class="tl-item reveal">
      <span class="tl-years">${esc(c.años)}</span><h3>${esc(c.epoca)}</h3>
      <p>${esc(c.texto)}</p>
      <p class="tl-donde"><b>Se ve en:</b> ${esc(c.donde)}</p>
    </div>`).join("");
    const curio = `<article class="card reveal"><h3>¿Sabíais que…?</h3>
      <ul class="curio-list">${DATA.historia.curiosidades.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    </article>`;
    const libros = `<article class="card reveal"><h3>Para leer antes (o durante)</h3>
      ${DATA.historia.libros.map((l) => `<p><b>${esc(l.titulo)}</b> — ${esc(l.autor)}<br><span class="muted small">${esc(l.nota)}</span></p>`).join("")}
    </article>`;
    const ruta = DATA.historia.ensayo?.ruta;
    const rutaHtml = ruta?.paradas ? `<article class="card memoria-route reveal">
      ${foto(ruta.img, ruta.titulo, ruta.imgExt || "jpg")}
      <span class="foto-nota">Imagen editorial generada · la ruta se dibuja sobre el mapa real</span>
      <span class="food-kind">Ruta temática</span><h3>${esc(ruta.titulo)}</h3>
      <div class="sitio-meta"><span>⏱ <b>${esc(ruta.dur)}</b></span><span>📏 ${esc(ruta.dist)}</span></div>
      <p>${esc(ruta.texto)}</p><ol class="memory-stops">${ruta.paradas.map((p) => `<li><b>${esc(p.n)}</b><span>${esc(p.txt)}</span></li>`).join("")}</ol>
      <button class="ruta-btn" data-ruta-memoria>🗺 Dibujar la ruta socialista en el mapa</button>
    </article>` : "";
    const ensayo = DATA.historia.ensayo ? `<article class="card historia-ensayo reveal">
      <img src="imgs/socialismo-yugoslavo.webp" alt="Interpretación visual de la vida cotidiana y la arquitectura de la Yugoslavia socialista">
      <span class="foto-nota">Imagen editorial generada · recreación histórica, no fotografía documental</span>
      <h3>${esc(DATA.historia.ensayo.titulo)}</h3>
      ${DATA.historia.ensayo.texto.split("\n\n").map((t) => `<p>${esc(t)}</p>`).join("")}
      <div class="glosario">${DATA.historia.ensayo.claves.map((g) => `<div class="glo-item"><b>${esc(g.t)}</b><span>${esc(g.d)}</span></div>`).join("")}</div>
    </article>` : "";
    el.innerHTML = pageShell("historia", esc(DATA.historia.intro), ensayo + rutaHtml + `<div class="tl">${capas}</div>${curio}${libros}`);
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-ruta-memoria]")) return;
    const r = DATA.historia.ensayo.ruta;
    window.__route = r.paradas.map((p, i) => ({ coords: p.coords, n: i + 1, nombre: p.n }));
    window.__routeSinCasa = true;
    location.hash = "#/mapa";
  });

  /* --- COSTUMBRES / IDIOMA --- */
  function renderCostumbres(el) {
    const cost = `<div class="cost-grid">${DATA.costumbres.map((c) => `<article class="card cost-card reveal">
      <span class="c-icon">${c.icono}</span><h3>${esc(c.titulo)}</h3><p>${esc(c.texto)}</p>
    </article>`).join("")}</div>`;
    const frases = `<article class="card reveal"><h3>Serbio de supervivencia <button class="tts-all" id="ttsHint" title="Toca 🔊 para oír la pronunciación">🔊 con voz</button></h3>
      <table class="frase-tabla">${DATA.idioma.frases.map((f) => `<tr>
        <td class="f-es">${esc(f.es)}</td>
        <td class="f-sr"><b>${esc(f.sr)}</b> <button class="tts-btn" data-tts="${esc(f.sr)}" aria-label="Escuchar">🔊</button>
        <span class="cir">${esc(f.cir)}</span><span class="pron">${esc(f.pron)}</span></td>
      </tr>`).join("")}</table></article>`;
    const translit = `<article class="card reveal"><h3>Tu nombre en cirílico</h3>
      <p class="muted small">Escribe cualquier nombre y míralo como lo escribiría un belgradense.</p>
      <div class="translit-row">
        <input id="translitIn" placeholder="Escribe un nombre…" maxlength="40" autocomplete="off">
        <output id="translitOut" class="translit-out">&nbsp;</output>
      </div>
      <div class="translit-chips">
        <button class="chip translit-eg" data-eg="Álvaro">Álvaro</button>
        <button class="chip translit-eg" data-eg="Laura">Laura</button>
        <button class="chip translit-eg" data-eg="Juan">Juan</button>
      </div></article>`;
    const cyr = `<article class="card reveal"><h3>El alfabeto de los carteles</h3>
      <p class="muted small">Los rótulos oficiales van en cirílico. Con esta tabla se descifra cualquier cartel en diez segundos.</p>
      <div class="cyr-grid">${DATA.idioma.cirilico.map(([c, l]) => `<div class="cyr-cell"><span class="c-cyr">${esc(c)}</span><span class="c-lat">${esc(l)}</span></div>`).join("")}</div>
    </article>`;
    const quiz = `<article class="card reveal quiz-card"><h3>🎯 Descifra el cartel</h3>
      <p class="muted small">Palabras que veréis de verdad por la calle. ¿Cuántas seguidas aciertas?</p>
      <div id="quizBox"></div></article>`;
    el.innerHTML = pageShell("costumbres", esc(DATA.idioma.intro), cost + frases + translit + quiz + cyr);
    initQuiz();
    const inp = $("#translitIn"), out = $("#translitOut");
    const upd = () => { out.textContent = window.BGFx ? BGFx.translit(inp.value) || " " : ""; };
    inp.addEventListener("input", upd);
    $$(".translit-eg", el).forEach((b) => b.addEventListener("click", () => { inp.value = b.dataset.eg; upd(); }));
    $$("[data-tts]", el).forEach((b) => b.addEventListener("click", () => window.BGFx && BGFx.speak(b.dataset.tts)));
  }

  /* --- QUIZ DE CIRÍLICO --- */
  const QUIZ_WORDS = [
    ["ПЕКАРА", "panadería"], ["УЛАЗ", "entrada"], ["ИЗЛАЗ", "salida"], ["МУЗЕЈ", "museo"],
    ["ПИВО", "cerveza"], ["ХЛЕБ", "pan"], ["КАФАНА", "taberna"], ["СТАНИЦА", "estación"],
    ["ТРГ", "plaza"], ["МОСТ", "puente"], ["РЕКА", "río"], ["ВОДА", "agua"],
    ["КАФА", "café"], ["ГРАД", "ciudad"], ["ТВРЂАВА", "fortaleza"], ["ПИЈАЦА", "mercado"],
    ["АПОТЕКА", "farmacia"], ["ПОШТА", "correos"], ["ЦРКВА", "iglesia"], ["ОТВОРЕНО", "abierto"],
  ];
  function initQuiz() {
    const box = $("#quizBox"); if (!box) return;
    let racha = 0, best = +(localStorage.getItem("bg26_quiz") || 0), last = -1, lock = false;
    function ronda() {
      lock = false;
      let qi; do { qi = Math.floor(Math.random() * QUIZ_WORDS.length); } while (qi === last);
      last = qi;
      const [cyr, ok] = QUIZ_WORDS[qi];
      const wrong = QUIZ_WORDS.filter((_, i) => i !== qi).sort(() => Math.random() - .5).slice(0, 2).map((w) => w[1]);
      const ops = [ok, ...wrong].sort(() => Math.random() - .5);
      box.innerHTML = `<div class="quiz-word">${cyr}</div>
        <div class="quiz-ops">${ops.map((o) => `<button class="quiz-op" data-q="${esc(o)}">${esc(o)}</button>`).join("")}</div>
        <div class="quiz-score"><span>Racha: <b>${racha}</b></span><span>Récord: <b>${best}</b></span></div>`;
      $$(".quiz-op", box).forEach((b) => b.addEventListener("click", () => {
        if (lock) return; lock = true;
        const acierto = b.dataset.q === ok;
        b.classList.add(acierto ? "hit" : "miss");
        if (acierto) {
          racha++;
          if (racha > best) { best = racha; localStorage.setItem("bg26_quiz", String(best)); if (best > 4) confetti(20); }
        } else {
          $$(".quiz-op", box).find((x) => x.dataset.q === ok)?.classList.add("hit");
          racha = 0;
        }
        setTimeout(ronda, 850);
      }));
    }
    ronda();
  }

  /* --- TRANSPORTE --- */
  function renderTransporte(el) {
    const t = DATA.transporte;
    const gran = `<article class="card reveal" style="border-left:5px solid var(--sec)">
      <h3>🎉 ${esc(t.granNoticia.titulo)}</h3><p>${esc(t.granNoticia.texto)}</p>
      <p class="fuente">${fiab(t.granNoticia.fiab)} ${esc(t.granNoticia.fuente)}</p></article>`;
    const aero = `<article class="card reveal"><h3>Del aeropuerto a casa</h3><p class="muted">${esc(t.aeropuerto.intro)}</p>
      ${t.aeropuerto.opciones.map((o) => `<h4>${esc(o.nombre)} ${o.tag ? `<span class="chip chip-sec">${esc(o.tag)}</span>` : ""}</h4>
        <div class="sitio-meta"><span>⏱ <b>${esc(o.tiempo)}</b></span><span>💶 <b>${esc(o.precio)}</b></span></div>
        <p>${esc(o.como)}</p><p class="fuente">${fiab(o.fiab)} ${esc(o.fuente || "")}</p>`).join("")}
    </article>`;
    const ciudad = `<article class="card reveal"><h3>Moverse por la ciudad</h3>
      ${t.ciudad.map((c) => `<p>· ${esc(c)}</p>`).join("")}</article>`;
    const tren = `<article class="card reveal"><h3>${esc(t.trenes.titulo)}</h3><p>${esc(t.trenes.texto)}</p>
      <p class="fuente">${fiab(t.trenes.fiab)}</p></article>`;
    el.innerHTML = pageShell("transporte", "", gran + aero + ciudad + tren);
  }

  /* --- CUADERNO --- */
  const NOTAS_KEY = "bg26_notas";
  const getNotas = () => { try { return JSON.parse(localStorage.getItem(NOTAS_KEY)) || []; } catch { return []; } };
  const setNotas = (n) => { localStorage.setItem(NOTAS_KEY, JSON.stringify(n)); window.BGMap && BGMap.refreshNotas(); };
  const CATS = ["Sitio recomendado", "Comer/beber", "Compra", "Idea", "Recuerdo"];

  function renderCuaderno(el) {
    el.innerHTML = pageShell("cuaderno",
      "Lo que os recomiende un camarero, un guía o la intuición. Las notas viven en este dispositivo — usad «Exportar» para pasarlas de un móvil a otro (el archivo incluye también vuestro plan y los sellos).",
      `<article class="card">
        <h3>Nueva nota</h3>
        <form class="nota-form" id="notaForm">
          <input name="nombre" placeholder="Nombre (p. ej. «Kafana que nos dijo el taxista»)" required maxlength="80">
          <select name="cat">${CATS.map((c) => `<option>${c}</option>`).join("")}</select>
          <input name="zona" placeholder="Zona / dirección (opcional)" maxlength="80">
          <textarea name="texto" placeholder="Notas, precios, por qué apuntarlo… (opcional)" maxlength="600"></textarea>
          <input name="coords" id="notaCoords" placeholder="Coordenadas (opcional) — o tocad «elegir en el mapa»" readonly>
          <div class="cuaderno-tools">
            <button class="btn" type="submit">Guardar nota</button>
            <button class="btn ghost" type="button" id="pickMapa">📍 Elegir en el mapa</button>
            <button class="btn ghost" type="button" id="geoBtn">📡 Mi ubicación</button>
          </div>
        </form>
      </article>
      <article class="card postal-card">
        <h3>🖼 Postal desde Belgrado</h3>
        <p class="muted small">Genera una postal con el skyline y vuestro mensaje, lista para WhatsApp.</p>
        <input id="postalMsg" placeholder="Mensaje (p. ej. «Sobrevivimos a la rakija»)" maxlength="60">
        <div class="cuaderno-tools">
          <button class="btn" id="postalBtn">Crear postal</button>
        </div>
        <canvas id="postalCanvas" width="1200" height="800" hidden></canvas>
      </article>
      <div class="cuaderno-tools">
        <button class="btn ghost small-btn" id="expBtn">⬇ Exportar todo</button>
        <label class="btn ghost small-btn" style="cursor:pointer">⬆ Importar<input type="file" id="impFile" accept=".json" hidden></label>
        <button class="btn ghost small-btn" id="shareBtn">✉ Compartir texto</button>
      </div>
      <div id="notasList"></div>`);
    pintarNotas();

    $("#notaForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const coords = (f.get("coords") || "").split(",").map(Number).filter((n) => !isNaN(n));
      const notas = getNotas();
      notas.unshift({
        id: Date.now(), nombre: f.get("nombre").trim(), cat: f.get("cat"),
        zona: (f.get("zona") || "").trim(), texto: (f.get("texto") || "").trim(),
        coords: coords.length === 2 ? coords : null, fecha: new Date().toISOString().slice(0, 10),
      });
      setNotas(notas); e.target.reset(); pintarNotas(); toast("Apuntado. — Б.");
    });
    $("#pickMapa").addEventListener("click", () => {
      window.__pickingNote = true;
      location.hash = "#/mapa";
      toast("Señala el sitio exacto en mi mapa. — Б. 📍");
    });
    $("#geoBtn").addEventListener("click", () => {
      navigator.geolocation?.getCurrentPosition(
        (p) => { $("#notaCoords").value = `${p.coords.latitude.toFixed(5)},${p.coords.longitude.toFixed(5)}`; },
        () => toast("No os encuentro. ¿Sin GPS? — Б."));
    });
    $("#postalBtn").addEventListener("click", () => makePostal($("#postalMsg").value.trim()));
    $("#expBtn").addEventListener("click", () => {
      const payload = { app: "belgrado26", notas: getNotas(), plan: getPlan(), sellos: getSellos(), gastos: getGastos() };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "belgrado26.json" });
      a.click(); URL.revokeObjectURL(a.href);
      localStorage.setItem("bg26_lastexport", String(Date.now()));
    });
    $("#impFile").addEventListener("change", async (e) => {
      const file = e.target.files[0]; if (!file) return;
      try {
        const raw = JSON.parse(await file.text());
        const nuevas = Array.isArray(raw) ? raw : raw.notas || [];
        const ids = new Set(getNotas().map((n) => n.id));
        setNotas([...nuevas.filter((n) => !ids.has(n.id)), ...getNotas()]);
        if (!Array.isArray(raw)) {
          if (raw.plan) { const p = getPlan(); Object.entries(raw.plan).forEach(([d, ids2]) => { p[d] = [...new Set([...(p[d] || []), ...ids2])]; }); setPlan(p); }
          if (raw.sellos) setSellos([...new Set([...getSellos(), ...raw.sellos])]);
          if (raw.gastos) { const ids2 = new Set(getGastos().map((g) => g.id)); setGastos([...getGastos(), ...raw.gastos.filter((g) => !ids2.has(g.id))]); }
        }
        pintarNotas(); renderStamps(); toast("Recibido y archivado. — Б.");
      } catch { toast("Ese papel no es mío. Archivo no válido."); }
    });
    $("#shareBtn").addEventListener("click", () => {
      const txt = getNotas().map((n) => `• ${n.nombre} (${n.cat})${n.zona ? " — " + n.zona : ""}${n.texto ? "\n  " + n.texto : ""}`).join("\n") || "Cuaderno vacío";
      if (navigator.share) navigator.share({ title: "Cuaderno Belgrado", text: txt }).catch(() => {});
      else { navigator.clipboard?.writeText(txt); toast("Copiado. Repartid. — Б."); }
    });
  }
  function pintarNotas() {
    const list = $("#notasList"); if (!list) return;
    const notas = getNotas();
    list.innerHTML = notas.length
      ? notas.map((n) => `<article class="card nota-item reveal in">
          <span class="n-cat">${esc(n.cat)} · ${esc(n.fecha)}</span>
          ${n.coords ? `<button class="n-pin" title="Ver en mapa" data-fly="${n.coords.join(",")}">📍</button>` : ""}
          <button class="n-del" data-del="${n.id}" title="Borrar">🗑</button>
          <h3>${esc(n.nombre)}</h3>
          ${n.zona ? `<p class="n-zona">📍 ${esc(n.zona)}</p>` : ""}
          ${n.texto ? `<p>${esc(n.texto)}</p>` : ""}
        </article>`).join("")
      : `<p class="vacio">Aún no hay notas. La primera caerá en cuanto alguien os diga «tenéis que ir a…»</p>`;
    $$("[data-del]", list).forEach((b) => b.addEventListener("click", () => {
      if (confirm("¿Borrar esta nota?")) { setNotas(getNotas().filter((n) => n.id !== +b.dataset.del)); pintarNotas(); }
    }));
  }
  window.BGNotas = { getNotas, setCoordsFromMap: (lat, lng) => { window.__pendingCoords = `${lat.toFixed(5)},${lng.toFixed(5)}`; } };

  /* --- POSTAL (canvas) --- */
  async function makePostal(msg) {
    const cv = $("#postalCanvas"); if (!cv) return;
    try { await document.fonts.load('800 74px "Playfair Display"'); } catch {}
    const x = cv.getContext("2d");
    const W = 1200, H = 800;
    // cielo atardecer
    const sky = x.createLinearGradient(0, 0, 0, H * .72);
    sky.addColorStop(0, "#1b2a52"); sky.addColorStop(.55, "#5d4a75"); sky.addColorStop(1, "#d97b41");
    x.fillStyle = sky; x.fillRect(0, 0, W, H);
    // sol
    x.fillStyle = "#ffd9a0"; x.beginPath(); x.arc(880, 300, 62, 0, 7); x.fill();
    // estrellas altas
    x.fillStyle = "rgba(255,255,255,.75)";
    [[100, 60], [300, 100], [520, 50], [760, 90], [1050, 70], [200, 150], [980, 160]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 2.2, 0, 7); x.fill(); });
    // skyline (escala 1.5 del hero)
    x.fillStyle = "#131a30";
    const k = 1.5, base = 40;
    // colina + murallas
    x.fillRect(80, 460, 190, 130);
    x.fillRect(96, 430, 26, 30); x.fillRect(150, 430, 26, 30); x.fillRect(210, 430, 26, 30);
    // Pobednik
    x.fillRect(320, 360, 12, 230); x.beginPath(); x.arc(326, 348, 9, 0, 7); x.fill();
    // catedral
    x.fillRect(560, 430, 30, 160);
    x.beginPath(); x.moveTo(553, 430); x.lineTo(597, 430); x.lineTo(575, 350); x.closePath(); x.fill();
    // San Sava
    x.beginPath(); x.arc(880, 590, 78, Math.PI, 0); x.fill(); x.fillRect(802, 590, 156, 4);
    x.fillRect(872, 480, 14, 34);
    // bloques Novi Beograd
    x.fillRect(1020, 470, 44, 120); x.fillRect(1080, 500, 56, 90);
    // río
    const rio = x.createLinearGradient(0, H * .74, 0, H);
    rio.addColorStop(0, "#1d3a4a"); rio.addColorStop(1, "#0e1e2c");
    x.fillStyle = rio; x.fillRect(0, 592, W, H - 592);
    x.strokeStyle = "rgba(127,182,201,.4)"; x.lineWidth = 3;
    [[140, 640, 260], [420, 680, 540], [760, 650, 900], [1000, 700, 1100]].forEach(([a, y, b]) => { x.beginPath(); x.moveTo(a, y); x.lineTo(b, y); x.stroke(); });
    // marco
    x.strokeStyle = "#f4efe6"; x.lineWidth = 26; x.strokeRect(13, 13, W - 26, H - 26);
    // textos
    x.fillStyle = "#f4efe6"; x.textAlign = "center";
    x.font = '800 84px "Playfair Display", Georgia, serif';
    x.fillText("Поздрав из Београда", W / 2, 150);
    x.font = 'italic 600 40px "Playfair Display", Georgia, serif';
    x.fillText("— saludos desde Belgrado —", W / 2, 205);
    if (msg) {
      x.font = 'italic 600 46px "Playfair Display", Georgia, serif';
      x.fillStyle = "#ffe9c9";
      x.fillText(`«${msg}»`, W / 2, 700);
    }
    x.font = '600 26px Inter, sans-serif';
    x.fillStyle = "rgba(244,239,230,.85)";
    x.fillText("Álvaro & Laura · julio 2026", W / 2, H - 44);
    // exportar
    cv.toBlob(async (blob) => {
      const file = new File([blob], "postal-belgrado.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: "Postal desde Belgrado" }); return; } catch {}
      }
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "postal-belgrado.png" });
      a.click(); URL.revokeObjectURL(a.href);
      toast("Postal lista. El sello lo pongo yo. — Б.");
    }, "image/png");
  }

  /* --- GASTOS A MEDIAS --- */
  const GASTOS_KEY = "bg26_gastos";
  const getGastos = () => { try { return JSON.parse(localStorage.getItem(GASTOS_KEY)) || []; } catch { return []; } };
  const setGastos = (g) => localStorage.setItem(GASTOS_KEY, JSON.stringify(g));
  const GCATS = ["🍽 Comida", "🍺 Bares", "🎟 Entradas", "🚕 Transporte", "🛍 Compras", "🏨 Alojamiento", "✚ Otro"];
  const fxRate = () => +(localStorage.getItem("bg26_fx") || 117.2);

  function renderGastos(el) {
    const gastos = getGastos();
    const enEur = (g) => (g.cur === "EUR" ? g.q : g.q / fxRate());
    const pagA = gastos.filter((g) => g.payer === "A").reduce((t, g) => t + enEur(g), 0);
    const pagL = gastos.filter((g) => g.payer === "L").reduce((t, g) => t + enEur(g), 0);
    const total = pagA + pagL;
    const dif = (pagA - pagL) / 2;
    const balanceTxt = Math.abs(dif) < 0.5
      ? "⚖️ Estáis en paz — hermandad ejemplar"
      : dif > 0 ? `Laura le debe <b>${dif.toFixed(2)} €</b> a Álvaro` : `Álvaro le debe <b>${(-dif).toFixed(2)} €</b> a Laura`;
    const balance = `<article class="card balance-card reveal">
      <div class="bal-row"><div><span class="ld-label">Total viaje</span><b>${total.toFixed(2)} €</b></div>
      <div><span class="ld-label">Pagó Álvaro</span><b>${pagA.toFixed(2)} €</b></div>
      <div><span class="ld-label">Pagó Laura</span><b>${pagL.toFixed(2)} €</b></div></div>
      <p class="bal-verdict">${balanceTxt}</p>
      <p class="muted small">Se asume todo a medias (50/50). Tipo usado: 1 € = ${fxRate().toFixed(1)} RSD.</p></article>`;
    const form = `<article class="card reveal"><h3>Apuntar gasto</h3>
      <form class="nota-form" id="gastoForm">
        <input name="desc" placeholder="Qué (p. ej. «cena en Tri šešira»)" required maxlength="60">
        <div class="gasto-row">
          <input name="q" type="number" step="0.01" min="0" inputmode="decimal" placeholder="Importe" required>
          <select name="cur"><option>RSD</option><option>EUR</option></select>
        </div>
        <div class="gasto-row">
          <select name="payer"><option value="A">Pagó Álvaro</option><option value="L">Pagó Laura</option></select>
          <select name="cat">${GCATS.map((c) => `<option>${c}</option>`).join("")}</select>
        </div>
        <button class="btn" type="submit">Apuntar</button>
      </form></article>`;
    const lista = gastos.length ? gastos.map((g) => `<article class="card gasto-item tique reveal in">
        <span class="n-cat">${esc(g.cat)} · ${esc(g.fecha)} · pagó ${g.payer === "A" ? "Álvaro" : "Laura"}</span>
        <button class="n-del" data-gdel="${g.id}" title="Borrar">🗑</button>
        <h3>${esc(g.desc)}</h3>
        <p><b>${g.q} ${g.cur}</b>${g.cur === "RSD" ? ` <span class="muted small">≈ ${enEur(g).toFixed(2)} €</span>` : ""}</p>
      </article>`).join("")
      : `<p class="vacio">Sin gastos aún. El primero será un burek, está escrito.</p>`;
    el.innerHTML = pageShell("gastos",
      "Cuentas claras sin apps de terceros: quién pagó qué, en dinares o euros, y el saldo entre vosotros al momento. Entra en «Exportar todo» del cuaderno.",
      balance + form + lista);
    $("#gastoForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      setGastos([{ id: Date.now(), desc: f.get("desc").trim(), q: +f.get("q"), cur: f.get("cur"), payer: f.get("payer"), cat: f.get("cat"), fecha: new Date().toISOString().slice(0, 10) }, ...getGastos()]);
      renderGastos(el); toast("Anotado en la cuenta común. — Б.");
    });
    $$("[data-gdel]", el).forEach((b) => b.addEventListener("click", () => {
      if (confirm("¿Borrar este gasto?")) { setGastos(getGastos().filter((g) => g.id !== +b.dataset.gdel)); renderGastos(el); }
    }));
  }

  /* --- PRÁCTICO --- */
  const CHECK_KEY = "bg26_check";
  function renderPractico(el) {
    const p = DATA.practico;
    const conversor = `<article class="card reveal"><h3>Conversor de dinares</h3>
      <div class="fx-row">
        <div class="fx-col"><label>EUR €</label><input id="fxEur" type="number" inputmode="decimal" value="10"></div>
        <span class="fx-eq">⇄</span>
        <div class="fx-col"><label>RSD дин</label><input id="fxRsd" type="number" inputmode="decimal"></div>
      </div>
      <p class="muted small" id="fxNota">Cargando tipo de cambio…</p>
      <div class="fx-refs" id="fxRefs"></div></article>`;
    const bloques = ["clima", "dinero", "conectividad", "documentos", "emergencias", "seguridad", "taxis", "fumar", "salud"].map((k) => {
      const b = p[k];
      return `<article class="card reveal"><h3>${esc(b.titulo)}</h3><p>${esc(b.texto)}</p><p class="fuente">${fiab(b.fiab)}</p></article>`;
    }).join("");
    const done = new Set(JSON.parse(localStorage.getItem(CHECK_KEY) || "[]"));
    const check = `<article class="card reveal"><h3>Checklist de maleta</h3>
      <ul class="check-list">${p.checklist.map((c, i) => `<li class="${done.has(i) ? "done" : ""}">
        <input type="checkbox" id="ck${i}" data-ck="${i}" ${done.has(i) ? "checked" : ""}><label for="ck${i}">${esc(c)}</label>
      </li>`).join("")}</ul></article>`;
    el.innerHTML = pageShell("practico", "", conversor + bloques + check);
    $$("[data-ck]", el).forEach((cb) => cb.addEventListener("change", () => {
      cb.checked ? done.add(+cb.dataset.ck) : done.delete(+cb.dataset.ck);
      localStorage.setItem(CHECK_KEY, JSON.stringify([...done]));
      cb.closest("li").classList.toggle("done", cb.checked);
      if (done.size === p.checklist.length) { confetti(); toast("Maleta lista. Os espero el 22. — Б. ✈"); }
    }));
    window.BGLive && BGLive.initFx();
  }

  /* ---------- ROUTER ---------- */
  const RENDER = {
    agenda: renderAgenda, barrios: renderBarrios, paseos: renderPaseos, ver: renderVer, mapa: renderMapa,
    comer: renderComer, noche: renderNoche, escena: renderEscena, alrededores: renderAlrededores,
    historia: renderHistoria, costumbres: renderCostumbres, transporte: renderTransporte,
    cuaderno: renderCuaderno, practico: renderPractico, gastos: renderGastos,
    cartas: renderCartas, zona: renderZona,
  };
  const rendered = new Set();
  const LIVE_PAGES = new Set(["agenda", "ver", "cuaderno", "practico", "gastos", "cartas", "zona"]);
  function applyRoute() {
    const id = (location.hash.replace(/^#\//, "") || "home").split("?")[0] || "home";
    const target = $(`.page[data-page="${id}"]`) ? id : "home";
    $$(".page").forEach((p) => p.classList.toggle("active", p.dataset.page === target));
    if (RENDER[target] && (!rendered.has(target) || LIVE_PAGES.has(target))) {
      RENDER[target]($(`.page[data-page="${target}"]`));
      rendered.add(target);
      observeReveals();
    }
    if (target === "home") { renderBoarding(); todayCard(); renderStamps(); renderPrologo(); renderCalle(); renderInstall(); renderZoneMapHome(); observeReveals(); }
    if (target === "mapa") requestAnimationFrame(() => window.BGMap && BGMap.invalidate());
    if (target === "cuaderno" && window.__pendingCoords) {
      const c = window.__pendingCoords; window.__pendingCoords = null;
      requestAnimationFrame(() => { const i = $("#notaCoords"); if (i) i.value = c; });
    }
    $$(".bottomnav [data-nav]").forEach((a) => {
      const on = a.dataset.nav === target || (a.dataset.nav === "home" && target === "home");
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    scrollTo({ top: 0, behavior: "instant" });
    $("#guideSheet").hidden = true;
  }
  function route() {
    if (document.startViewTransition) document.startViewTransition(applyRoute);
    else applyRoute();
  }
  addEventListener("hashchange", route);

  /* ---------- GUIDE SHEET ---------- */
  $("#guideBtn").addEventListener("click", () => { $("#guideSheet").hidden = false; });
  $$(".sheet").forEach((sh) => sh.addEventListener("click", (e) => { if (e.target === sh) sh.hidden = true; }));

  /* ---------- REVEALS ---------- */
  let io;
  function observeReveals() {
    io = io || new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .08 });
    $$(".reveal:not(.in)").forEach((r, i) => { r.style.transitionDelay = `${Math.min(i % 6, 4) * 60}ms`; io.observe(r); });
  }

  /* topbar shadow */
  addEventListener("scroll", () => $("#topbar").classList.toggle("scrolled", scrollY > 30), { passive: true });

  /* API para otros módulos */
  window.BGCore = { estadoSitio, toast, getPlan, getSellos, fechasViaje, esc, fiab, pageMeta };

  applyRoute();
  avisoRespaldo();
})();
