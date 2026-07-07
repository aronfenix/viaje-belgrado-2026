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
    toast(`Añadido al ${DIAS_SEM[((new Date(day + "T12:00:00").getDay() + 6) % 7) + 1]} ${+day.slice(8)} ✓`);
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
        toast(`Sello nuevo: ${PLANNABLES[id] ? PLANNABLES[id].nombre : id} 🛂`);
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
    { id: "barrios", sub: "La ciudad por capas y zonas", ico: "⌂" },
    { id: "paseos", sub: "6 rutas a pie con paradas en el mapa", ico: "➾" },
    { id: "ver", sub: "Museos con horarios en vivo y sellos", ico: "◈" },
    { id: "mapa", sub: "Todo geolocalizado + radios a pie", ico: "◎" },
    { id: "comer", sub: "Burek, grill y kafanas — con testimonios", ico: "♨" },
    { id: "noche", sub: "Cervezas, patios y el río", ico: "☾" },
    { id: "alrededores", sub: "Novi Sad y más allá, sin coche", ico: "⇢" },
    { id: "historia", sub: "Cinco capas de ciudad", ico: "◔" },
    { id: "costumbres", sub: "Rakija, cirílico y tu nombre en serbio", ico: "☕" },
    { id: "transporte", sub: "Gratis desde 2025 (en serio)", ico: "▷" },
    { id: "dilema", sub: "¿Subotica, Budapest o apurar?", ico: "⁇" },
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
  $("#homeGrid").innerHTML = SECCIONES.map(tile).join("");
  $("#guideGrid").innerHTML = SECCIONES.map(tile).join("");
  addEventListener("bg26:theme", () => { paintTiles($("#homeGrid")); paintTiles($("#guideGrid")); });
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

  /* ---------- PAGE SHELL ---------- */
  function pageShell(id, introHtml, bodyHtml) {
    const m = pageMeta(id);
    return `<div class="wrap">
      <div class="page-head">
        <span class="ph-cyr">${m.cyr}</span>
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
      "Sin itinerario impuesto: cada día, lo que abre, lo que cierra y lo que pasa. Con «＋ plan» en cualquier ficha construyes tu propio día — y con ↗ se lo mandas a Laura.",
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
    else { navigator.clipboard?.writeText(txt); toast("Día copiado al portapapeles ✓"); }
  }

  /* --- BARRIOS --- */
  function renderBarrios(el) {
    const cards = DATA.barrios.map((b) => `<article class="card reveal">
      <span class="chip chip-sec">${esc(b.tag)}</span> ${planBtn("b-" + b.id)}
      <h3>${esc(b.nombre)}</h3>
      <p>${esc(b.desc)}</p>
      <h4>Cerca</h4><p class="muted">${esc(b.cerca)}</p>
      <h4>Cómo llegar</h4><p class="muted">${esc(b.comoLlegar)}</p>
      <p><a href="#/mapa" data-fly="${b.coords.join(",")}">Ver en el mapa →</a></p>
    </article>`).join("");
    el.innerHTML = pageShell("barrios",
      "Belgrado no es una postal compacta: es una ciudad de capas. Estas son sus piezas, vistas desde vuestra base en Savski Venac.", cards);
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
      return `<article class="card reveal ${getSellos().includes(s.id) ? "sellado" : ""}">
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
      "El estado «abierto / cerrado» se calcula con la hora real de tu móvil. «＋ plan» lo manda a un día de la agenda; el sello, al pasaporte del viaje.", cards);
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
    const bloques = DATA.comer.bloques.map((b) => `<article class="card reveal">
      <h3>${esc(b.titulo)}</h3><p>${esc(b.texto)}</p>
      ${b.sitios.map((s) => `<h4>${esc(s.nombre)} ${fiab(s.fiab)} ${planBtn("c-" + slug(s.nombre))}</h4>
        <p class="muted small">📍 ${esc(s.zona)}</p>
        <p>${esc(s.nota)}</p>${testimonioHtml(s.testimonio)}
        ${s.coords ? `<p class="small"><a href="#/mapa" data-fly="${s.coords.join(",")}">mapa</a> · <a href="https://www.google.com/maps/search/?api=1&query=${s.coords.join(",")}" target="_blank" rel="noopener">navegar</a></p>` : ""}`).join("")}
    </article>`).join("");
    const glosario = `<article class="card reveal"><h3>📖 Diccionario para pedir sin miedo</h3>
      <p class="muted small">Los ${DATA.glosario.length} términos que agotan el 90% de cualquier carta serbia. También salen en el buscador (🔍).</p>
      <div class="glosario">${DATA.glosario.map((g) => `<div class="glo-item"><b>${esc(g.t)}</b><span>${esc(g.d)}</span></div>`).join("")}</div>
    </article>`;
    el.innerHTML = pageShell("comer", esc(DATA.comer.intro), bloques + glosario);
  }

  /* --- NOCHE --- */
  function renderNoche(el) {
    const zonas = DATA.noche.zonas.map((z) => `<article class="card reveal">
      <span class="hora-tag">${esc(z.cuando)}</span> ${planBtn("n-" + slug(z.nombre))}
      <h3>${esc(z.nombre)}</h3>
      <div class="sitio-meta">${walkChip(z.coords)}</div>
      <p>${esc(z.desc)}</p>
      ${testimonioHtml(z.testimonio)}
      <ul class="lista-sitios">${z.sitios.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <p class="small"><a href="#/mapa" data-fly="${z.coords.join(",")}">Ver zona en el mapa →</a></p>
    </article>`).join("");
    el.innerHTML = pageShell("noche", esc(DATA.noche.intro), zonas);
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
      "Escapadas realistas sin coche y sin palizas de bus — el criterio Laura se aplica de serie.", cards);
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
    el.innerHTML = pageShell("historia", esc(DATA.historia.intro), `<div class="tl">${capas}</div>${curio}${libros}`);
  }

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

  /* --- DILEMA --- */
  function renderDilema(el) {
    const d = DATA.dilema;
    const ctx = `<article class="card reveal"><h3>${esc(d.contexto.titulo)}</h3><p>${esc(d.contexto.texto)}</p>
      <p class="fuente">${fiab(d.contexto.fiab)} ${esc(d.contexto.fuente)}</p></article>`;
    const ops = `<div class="dilema-grid">${d.opciones.map((o) => `<article class="card dilema-card reveal">
      <h3>${esc(o.nombre)}</h3><p class="muted small">${esc(o.plan)}</p>
      <ul class="pc-list pros">${o.pros.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      <ul class="pc-list cons">${o.contras.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    </article>`).join("")}</div>`;
    const cons = `<article class="card reveal"><p>${esc(d.consejo.texto)}</p><p class="fuente">${fiab(d.consejo.fiab)}</p></article>`;
    el.innerHTML = pageShell("dilema", esc(d.intro), ctx + ops + cons);
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
      setNotas(notas); e.target.reset(); pintarNotas(); toast("Nota guardada ✓");
    });
    $("#pickMapa").addEventListener("click", () => {
      window.__pickingNote = true;
      location.hash = "#/mapa";
      toast("Toca el punto exacto en el mapa 📍");
    });
    $("#geoBtn").addEventListener("click", () => {
      navigator.geolocation?.getCurrentPosition(
        (p) => { $("#notaCoords").value = `${p.coords.latitude.toFixed(5)},${p.coords.longitude.toFixed(5)}`; },
        () => toast("No se pudo obtener la ubicación"));
    });
    $("#postalBtn").addEventListener("click", () => makePostal($("#postalMsg").value.trim()));
    $("#expBtn").addEventListener("click", () => {
      const payload = { app: "belgrado26", notas: getNotas(), plan: getPlan(), sellos: getSellos(), gastos: getGastos() };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "belgrado26.json" });
      a.click(); URL.revokeObjectURL(a.href);
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
        pintarNotas(); renderStamps(); toast("Importado ✓");
      } catch { toast("Archivo no válido"); }
    });
    $("#shareBtn").addEventListener("click", () => {
      const txt = getNotas().map((n) => `• ${n.nombre} (${n.cat})${n.zona ? " — " + n.zona : ""}${n.texto ? "\n  " + n.texto : ""}`).join("\n") || "Cuaderno vacío";
      if (navigator.share) navigator.share({ title: "Cuaderno Belgrado", text: txt }).catch(() => {});
      else { navigator.clipboard?.writeText(txt); toast("Copiado al portapapeles ✓"); }
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
      toast("Postal descargada 🖼");
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
    const lista = gastos.length ? gastos.map((g) => `<article class="card gasto-item reveal in">
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
      renderGastos(el); toast("Gasto apuntado 💶");
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
      if (done.size === p.checklist.length) { confetti(); toast("Maleta lista. Belgrado, allá vamos ✈"); }
    }));
    window.BGLive && BGLive.initFx();
  }

  /* ---------- ROUTER ---------- */
  const RENDER = {
    agenda: renderAgenda, barrios: renderBarrios, paseos: renderPaseos, ver: renderVer, mapa: renderMapa,
    comer: renderComer, noche: renderNoche, alrededores: renderAlrededores,
    historia: renderHistoria, costumbres: renderCostumbres, transporte: renderTransporte,
    dilema: renderDilema, cuaderno: renderCuaderno, practico: renderPractico, gastos: renderGastos,
  };
  const rendered = new Set();
  const LIVE_PAGES = new Set(["agenda", "ver", "cuaderno", "practico", "gastos"]);
  function applyRoute() {
    const id = (location.hash.replace(/^#\//, "") || "home").split("?")[0] || "home";
    const target = $(`.page[data-page="${id}"]`) ? id : "home";
    $$(".page").forEach((p) => p.classList.toggle("active", p.dataset.page === target));
    if (RENDER[target] && (!rendered.has(target) || LIVE_PAGES.has(target))) {
      RENDER[target]($(`.page[data-page="${target}"]`));
      rendered.add(target);
      observeReveals();
    }
    if (target === "home") { renderBoarding(); todayCard(); renderStamps(); observeReveals(); }
    if (target === "mapa") requestAnimationFrame(() => window.BGMap && BGMap.invalidate());
    if (target === "cuaderno" && window.__pendingCoords) {
      const c = window.__pendingCoords; window.__pendingCoords = null;
      requestAnimationFrame(() => { const i = $("#notaCoords"); if (i) i.value = c; });
    }
    $$(".bottomnav [data-nav]").forEach((a) => a.classList.toggle("active",
      a.dataset.nav === target || (a.dataset.nav === "home" && target === "home")));
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
})();
