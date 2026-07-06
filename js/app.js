/* ============================================================
   БЕОГРАД 26 · app.js
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const DIAS_SEM = ["", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

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
  }
  const savedTheme = localStorage.getItem("bg26_theme");
  applyTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("#themeToggle").addEventListener("click", () => {
    const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("bg26_theme", t);
    applyTheme(t);
  });

  /* ---------- HERO: sky by hour + parallax ---------- */
  function heroSky() {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    // key skies: night, dawn, day, dusk
    let top, mid, low, sun = "#ffd9a0", night = false, sunY;
    if (h < 5.5 || h >= 21.5)      { top = "#070b1c"; mid = "#101a38"; low = "#1b2947"; sun = "#e8ecf5"; night = true; sunY = 120; }
    else if (h < 8)                { top = "#25355e"; mid = "#7a6a8e"; low = "#e79a5e"; sunY = 250; }
    else if (h < 18)               { top = "#3a7bd5"; mid = "#7db3e8"; low = "#cfe4f4"; sun = "#fff3c4"; sunY = 110; }
    else if (h < 21.5)             { top = "#1b2a52"; mid = "#5d4a75"; low = "#d97b41"; sunY = 265; }
    $("#skyTop").setAttribute("stop-color", top);
    $("#skyMid").setAttribute("stop-color", mid);
    $("#skyLow").setAttribute("stop-color", low);
    const s = $("#heroSun");
    s.setAttribute("fill", sun);
    s.setAttribute("cy", sunY);
    s.setAttribute("r", night ? 22 : 34);
    $("#stars").classList.toggle("on", night);
    $("#hero").classList.toggle("night", night || h >= 20.5 || h < 6);
  }
  heroSky();
  setInterval(heroSky, 5 * 60 * 1000);

  let ticking = false;
  addEventListener("scroll", () => {
    $("#topbar").classList.toggle("scrolled", scrollY > 30);
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = scrollY;
        if (y < innerHeight * 1.2) {
          $$(".hero-svg .layer").forEach((l) => {
            l.style.transform = `translateY(${y * parseFloat(l.dataset.speed || 0)}px)`;
          });
          const copy = $(".hero-copy");
          if (copy) { copy.style.transform = `translateY(${y * 0.42}px)`; copy.style.opacity = Math.max(0, 1 - y / (innerHeight * 0.62)); }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---------- COUNTDOWN ---------- */
  const T0 = new Date("2026-07-22T16:00:00+02:00");
  const T1 = new Date("2026-07-30T23:59:59+02:00");
  function pad(n) { return String(n).padStart(2, "0"); }
  function countdown() {
    const el = $("#countdown");
    const now = new Date();
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

  /* ---------- SECTIONS INDEX (home + sheet) ---------- */
  const SECCIONES = [
    { id: "agenda", sub: "Día a día: qué abre y qué cierra", ico: "▦" },
    { id: "barrios", sub: "La ciudad por capas y zonas", ico: "⌂" },
    { id: "ver", sub: "Museos y monumentos, con horarios en vivo", ico: "◈" },
    { id: "mapa", sub: "Todo geolocalizado", ico: "◎" },
    { id: "comer", sub: "Burek, grill y kafanas — con testimonios", ico: "♨" },
    { id: "noche", sub: "Cervezas, patios y el río", ico: "☾" },
    { id: "alrededores", sub: "Novi Sad y más allá, sin coche", ico: "⇢" },
    { id: "historia", sub: "Cinco capas de ciudad", ico: "◔" },
    { id: "costumbres", sub: "Rakija, café y cirílico", ico: "☕" },
    { id: "transporte", sub: "Gratis desde 2025 (en serio)", ico: "▷" },
    { id: "dilema", sub: "¿Subotica, Budapest o apurar?", ico: "⁇" },
    { id: "cuaderno", sub: "Vuestras notas del viaje", ico: "✎" },
    { id: "practico", sub: "Dinero, eSIM, checklist", ico: "✚" },
  ];
  const pageMeta = (id) => { const p = $(`.page[data-page="${id}"]`); return { num: p.dataset.num, title: p.dataset.title, cyr: p.dataset.cyr }; };

  function tile(s) {
    const m = pageMeta(s.id);
    return `<a class="home-tile reveal" href="#/${s.id}" style="--tile:var(--sec)" data-page-ref="${s.id}">
      <span class="ht-num">${m.num} · ${s.ico}</span>
      <span class="ht-title">${m.title}</span>
      <span class="ht-sub">${s.sub}</span>
      <span class="ht-cyr">${m.cyr}</span></a>`;
  }
  // tiles adopt each section's colour
  function paintTiles(root) {
    $$("[data-page-ref]", root).forEach((a) => {
      const probe = $(`.page[data-page="${a.dataset.pageRef}"]`);
      a.style.setProperty("--tile", getComputedStyle(probe).getPropertyValue("--sec"));
    });
  }
  $("#homeGrid").innerHTML = SECCIONES.map(tile).join("");
  $("#guideGrid").innerHTML = SECCIONES.map(tile).join("");
  new MutationObserver(() => { paintTiles($("#homeGrid")); paintTiles($("#guideGrid")); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  paintTiles(document);

  /* ---------- TODAY CARD ---------- */
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
      const wd22 = 3; // 22-jul-2026 es miércoles
      inner = `<span class="today-tag">El plan</span>
        <h3>Miércoles 22 → jueves 30 de julio</h3>
        <p>Vuelo Madrid → Belgrado (~16:00). Base: apartamento Elysian, Risanska 9, Savski Venac.</p>
        <p>9 días, dos ríos, una fortaleza y cero prisas. <a href="#/agenda">La agenda, día a día →</a></p>`;
    }
    $("#todayCard").innerHTML = `<div class="today-card reveal">${inner}</div>`;
  }
  todayCard();

  /* ---------- RENDERERS ---------- */
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
  function renderAgenda(el) {
    const hoyIso = new Date().toISOString().slice(0, 10);
    const cards = fechasViaje().map((f) => {
      const iso = f.toISOString().slice(0, 10);
      const wd = ((f.getDay() + 6) % 7) + 1;
      const regla = DATA.reglasSemana[wd];
      const evs = DATA.eventos.filter((e) => e.fecha === iso);
      const esp = DATA.dias.find((d) => d.fecha === iso);
      const items = [
        ...(esp ? [`<li class="dl-open"><b>${esc(esp.nota)}</b></li>`] : []),
        ...regla.cierran.map((c) => `<li class="dl-close">Cierra: ${esc(c)}</li>`),
        ...regla.abren.map((a) => `<li class="dl-open">${esc(a)}</li>`),
        ...evs.map((e) => `<li class="dl-event">${esc(e.nombre)} · ${esc(e.lugar)} <span class="muted small">(${esc(e.genero)})</span> ${fiab(e.fiab)}</li>`),
        ...(regla.sug ? [`<li>💡 ${esc(regla.sug)}</li>`] : []),
      ].join("");
      return `<article class="card day-card reveal ${iso === hoyIso ? "today-hl" : ""}">
        <div class="day-date"><span class="day-num">${f.getDate()}</span>
        <span class="day-wd">${DIAS_SEM[wd]} · julio</span>
        ${iso === hoyIso ? '<span class="chip chip-sec">HOY</span>' : ""}</div>
        <ul class="day-list">${items}</ul></article>`;
    }).join("");
    el.innerHTML = pageShell("agenda",
      "Sin itinerario impuesto: cada día, lo que abre, lo que cierra y lo que pasa. Tú decides.",
      cards + `<p class="muted small">${esc(DATA.eventosNota)}</p>`);
  }

  /* --- BARRIOS --- */
  function renderBarrios(el) {
    const cards = DATA.barrios.map((b) => `<article class="card reveal">
      <span class="chip chip-sec">${esc(b.tag)}</span>
      <h3>${esc(b.nombre)}</h3>
      <p>${esc(b.desc)}</p>
      <h4>Cerca</h4><p class="muted">${esc(b.cerca)}</p>
      <h4>Cómo llegar</h4><p class="muted">${esc(b.comoLlegar)}</p>
      <p><a href="#/mapa" data-fly="${b.coords.join(",")}">Ver en el mapa →</a></p>
    </article>`).join("");
    el.innerHTML = pageShell("barrios",
      "Belgrado no es una postal compacta: es una ciudad de capas. Estas son sus piezas, vistas desde vuestra base en Savski Venac.", cards);
  }

  /* --- QUÉ VER: open-now ---- */
  function estadoSitio(s) {
    const now = new Date();
    const wd = ((now.getDay() + 6) % 7) + 1;
    const h = now.getHours() + now.getMinutes() / 60;
    if (!s.horario) return { cls: "abierto", txt: "Espacio abierto", hoy: s.siempre || "" };
    const hoy = s.horario[wd];
    const fmt = (x) => `${Math.floor(x)}:${pad(Math.round((x % 1) * 60))}`;
    if (!hoy) return { cls: "cerrado", txt: "Hoy cerrado", hoy: s.soloDias || "Cierra este día de la semana" };
    const rango = `Hoy: ${fmt(hoy[0])}–${fmt(hoy[1])}`;
    if (h >= hoy[0] && h < hoy[1]) {
      return h > hoy[1] - 1
        ? { cls: "pronto", txt: `Cierra pronto (${fmt(hoy[1])})`, hoy: rango }
        : { cls: "abierto", txt: "Abierto ahora", hoy: rango };
    }
    return { cls: "cerrado", txt: h < hoy[0] ? `Abre a las ${fmt(hoy[0])}` : "Ya cerrado hoy", hoy: rango };
  }
  function renderVer(el) {
    const cards = DATA.sitios.map((s) => {
      const st = estadoSitio(s);
      return `<article class="card reveal">
        <h3>${esc(s.nombre)}</h3>
        <div class="sitio-meta">
          <span class="estado ${st.cls}">${st.txt}</span>
          <span>📍 <b>${esc(s.zona)}</b></span><span>⏱ ${esc(s.dur)}</span>
        </div>
        <div class="sitio-meta"><span>🎟 <b>${esc(s.precio)}</b></span><span>${esc(st.hoy)}</span></div>
        <p>${esc(s.desc)}</p>
        ${s.consejo ? `<p class="consejo">${esc(s.consejo)}</p>` : ""}
        <p class="fuente">${fiab(s.fiab)} ${esc(s.fuente || "")} · <a href="#/mapa" data-fly="${s.coords.join(",")}">mapa</a> · <a href="https://www.google.com/maps/search/?api=1&query=${s.coords.join(",")}" target="_blank" rel="noopener">navegar</a></p>
      </article>`;
    }).join("");
    el.innerHTML = pageShell("ver",
      "El estado «abierto / cerrado» se calcula con la hora real de tu móvil. Los horarios marcados ⚠ conviene confirmarlos en la web oficial antes de cruzar la ciudad.", cards);
  }

  /* --- MAPA --- */
  function renderMapa(el) {
    el.innerHTML = pageShell("mapa",
      "Alojamiento, museos, comida, noche y vuestras notas. El mapa necesita conexión; sin ella, usa los enlaces «navegar» de cada ficha.",
      `<div class="map-filtros" id="mapFiltros"></div>
       <div id="mapBox"></div>
       <p class="map-nota">📍 La posición del apartamento es aproximada (Risanska 9). Toca cualquier punto para más info.</p>`);
    requestAnimationFrame(() => window.BGMap && BGMap.init());
  }

  /* --- COMER --- */
  const testimonioHtml = (t) => t ? `<blockquote class="testimonio">${esc(t.cita)}<span class="t-src">— ${esc(t.fuente)}</span></blockquote>` : "";
  function renderComer(el) {
    const bloques = DATA.comer.bloques.map((b) => `<article class="card reveal">
      <h3>${esc(b.titulo)}</h3><p>${esc(b.texto)}</p>
      ${b.sitios.map((s) => `<h4>${esc(s.nombre)} ${fiab(s.fiab)}</h4>
        <p class="muted small">📍 ${esc(s.zona)}</p>
        <p>${esc(s.nota)}</p>${testimonioHtml(s.testimonio)}
        ${s.coords ? `<p class="small"><a href="#/mapa" data-fly="${s.coords.join(",")}">mapa</a> · <a href="https://www.google.com/maps/search/?api=1&query=${s.coords.join(",")}" target="_blank" rel="noopener">navegar</a></p>` : ""}`).join("")}
    </article>`).join("");
    el.innerHTML = pageShell("comer", esc(DATA.comer.intro), bloques);
  }

  /* --- NOCHE --- */
  function renderNoche(el) {
    const zonas = DATA.noche.zonas.map((z) => `<article class="card reveal">
      <span class="hora-tag">${esc(z.cuando)}</span>
      <h3>${esc(z.nombre)}</h3><p>${esc(z.desc)}</p>
      ${testimonioHtml(z.testimonio)}
      <ul class="lista-sitios">${z.sitios.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <p class="small"><a href="#/mapa" data-fly="${z.coords.join(",")}">Ver zona en el mapa →</a></p>
    </article>`).join("");
    el.innerHTML = pageShell("noche", esc(DATA.noche.intro), zonas);
  }

  /* --- ALREDEDORES --- */
  function renderAlrededores(el) {
    const cards = DATA.alrededores.map((a) => `<article class="card reveal">
      <span class="chip chip-sec">${esc(a.nivel)}</span>
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
    const libros = `<article class="card reveal"><h3>Para leer antes (o durante)</h3>
      ${DATA.historia.libros.map((l) => `<p><b>${esc(l.titulo)}</b> — ${esc(l.autor)}<br><span class="muted small">${esc(l.nota)}</span></p>`).join("")}
    </article>`;
    el.innerHTML = pageShell("historia", esc(DATA.historia.intro), `<div class="tl">${capas}</div>${libros}`);
  }

  /* --- COSTUMBRES / IDIOMA --- */
  function renderCostumbres(el) {
    const cost = `<div class="cost-grid">${DATA.costumbres.map((c) => `<article class="card cost-card reveal">
      <span class="c-icon">${c.icono}</span><h3>${esc(c.titulo)}</h3><p>${esc(c.texto)}</p>
    </article>`).join("")}</div>`;
    const frases = `<article class="card reveal"><h3>Serbio de supervivencia</h3>
      <table class="frase-tabla">${DATA.idioma.frases.map((f) => `<tr>
        <td class="f-es">${esc(f.es)}</td>
        <td class="f-sr"><b>${esc(f.sr)}</b><span class="cir">${esc(f.cir)}</span><span class="pron">${esc(f.pron)}</span></td>
      </tr>`).join("")}</table></article>`;
    const cyr = `<article class="card reveal"><h3>El alfabeto de los carteles</h3>
      <p class="muted small">Los rótulos oficiales van en cirílico. Con esta tabla se descifra cualquier cartel en diez segundos.</p>
      <div class="cyr-grid">${DATA.idioma.cirilico.map(([c, l]) => `<div class="cyr-cell"><span class="c-cyr">${esc(c)}</span><span class="c-lat">${esc(l)}</span></div>`).join("")}</div>
    </article>`;
    el.innerHTML = pageShell("costumbres", esc(DATA.idioma.intro), cost + frases + cyr);
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
      "Lo que os recomiende un camarero, un guía o la intuición. Las notas viven en este dispositivo — usad «Exportar» para pasarlas de un móvil a otro.",
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
      <div class="cuaderno-tools">
        <button class="btn ghost small-btn" id="expBtn">⬇ Exportar</button>
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
      setNotas(notas); e.target.reset(); pintarNotas();
    });
    $("#pickMapa").addEventListener("click", () => {
      window.__pickingNote = true;
      location.hash = "#/mapa";
      setTimeout(() => alert("Toca el punto exacto en el mapa: se guardará para tu nota y volverás al cuaderno."), 250);
    });
    $("#geoBtn").addEventListener("click", () => {
      navigator.geolocation?.getCurrentPosition(
        (p) => { $("#notaCoords").value = `${p.coords.latitude.toFixed(5)},${p.coords.longitude.toFixed(5)}`; },
        () => alert("No se pudo obtener la ubicación."));
    });
    $("#expBtn").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(getNotas(), null, 2)], { type: "application/json" });
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "cuaderno-belgrado.json" });
      a.click(); URL.revokeObjectURL(a.href);
    });
    $("#impFile").addEventListener("change", async (e) => {
      const file = e.target.files[0]; if (!file) return;
      try {
        const nuevas = JSON.parse(await file.text());
        if (!Array.isArray(nuevas)) throw 0;
        const ids = new Set(getNotas().map((n) => n.id));
        setNotas([...nuevas.filter((n) => !ids.has(n.id)), ...getNotas()]);
        pintarNotas();
      } catch { alert("Archivo no válido."); }
    });
    $("#shareBtn").addEventListener("click", () => {
      const txt = getNotas().map((n) => `• ${n.nombre} (${n.cat})${n.zona ? " — " + n.zona : ""}${n.texto ? "\n  " + n.texto : ""}`).join("\n") || "Cuaderno vacío";
      if (navigator.share) navigator.share({ title: "Cuaderno Belgrado", text: txt });
      else { navigator.clipboard?.writeText(txt); alert("Copiado al portapapeles."); }
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

  /* --- PRÁCTICO --- */
  const CHECK_KEY = "bg26_check";
  function renderPractico(el) {
    const p = DATA.practico;
    const bloques = ["clima", "dinero", "conectividad", "documentos", "emergencias", "seguridad"].map((k) => {
      const b = p[k];
      return `<article class="card reveal"><h3>${esc(b.titulo)}</h3><p>${esc(b.texto)}</p><p class="fuente">${fiab(b.fiab)}</p></article>`;
    }).join("");
    const done = new Set(JSON.parse(localStorage.getItem(CHECK_KEY) || "[]"));
    const check = `<article class="card reveal"><h3>Checklist de maleta</h3>
      <ul class="check-list">${p.checklist.map((c, i) => `<li class="${done.has(i) ? "done" : ""}">
        <input type="checkbox" id="ck${i}" data-ck="${i}" ${done.has(i) ? "checked" : ""}><label for="ck${i}">${esc(c)}</label>
      </li>`).join("")}</ul></article>`;
    el.innerHTML = pageShell("practico", "", bloques + check);
    $$("[data-ck]", el).forEach((cb) => cb.addEventListener("change", () => {
      cb.checked ? done.add(+cb.dataset.ck) : done.delete(+cb.dataset.ck);
      localStorage.setItem(CHECK_KEY, JSON.stringify([...done]));
      cb.closest("li").classList.toggle("done", cb.checked);
    }));
  }

  /* ---------- ROUTER ---------- */
  const RENDER = {
    agenda: renderAgenda, barrios: renderBarrios, ver: renderVer, mapa: renderMapa,
    comer: renderComer, noche: renderNoche, alrededores: renderAlrededores,
    historia: renderHistoria, costumbres: renderCostumbres, transporte: renderTransporte,
    dilema: renderDilema, cuaderno: renderCuaderno, practico: renderPractico,
  };
  const rendered = new Set();
  function route() {
    const id = (location.hash.replace(/^#\//, "") || "home").split("?")[0] || "home";
    const target = $(`.page[data-page="${id}"]`) ? id : "home";
    $$(".page").forEach((p) => p.classList.toggle("active", p.dataset.page === target));
    if (RENDER[target] && (!rendered.has(target) || target === "agenda" || target === "ver" || target === "cuaderno")) {
      RENDER[target]($(`.page[data-page="${target}"]`));
      rendered.add(target);
      observeReveals();
    }
    if (target === "mapa") requestAnimationFrame(() => window.BGMap && BGMap.invalidate());
    if (target === "cuaderno" && window.__pendingCoords) {
      const c = window.__pendingCoords; window.__pendingCoords = null;
      requestAnimationFrame(() => { const i = $("#notaCoords"); if (i) i.value = c; });
    }
    $$(".bottomnav [data-nav]").forEach((a) => a.classList.toggle("active",
      a.dataset.nav === target || (a.dataset.nav === "home" && target === "home")));
    scrollTo({ top: 0, behavior: "instant" });
    closeSheet();
  }
  addEventListener("hashchange", route);

  /* fly-to links (mapa) */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-fly]");
    if (a) {
      const [lat, lng] = a.dataset.fly.split(",").map(Number);
      window.__flyTo = [lat, lng];
      if (a.tagName === "BUTTON") location.hash = "#/mapa";
    }
  });

  /* ---------- GUIDE SHEET ---------- */
  const sheet = $("#guideSheet");
  $("#guideBtn").addEventListener("click", () => { sheet.hidden = false; });
  $("#guideClose").addEventListener("click", closeSheet);
  sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });
  function closeSheet() { sheet.hidden = true; }

  /* ---------- REVEALS ---------- */
  let io;
  function observeReveals() {
    io = io || new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .08 });
    $$(".reveal:not(.in)").forEach((r) => io.observe(r));
  }
  observeReveals();

  route();
})();
