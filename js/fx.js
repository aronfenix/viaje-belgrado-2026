/* ============================================================
   БЕОГРАД 26 · fx.js — hero vivo, buscador, voz, cirílico
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- HERO: cielo por hora ---------- */
  function heroSky() {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
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
    $("#hero").classList.toggle("day", h >= 8 && h < 18);
  }
  heroSky();
  setInterval(heroSky, 5 * 60 * 1000);

  /* ---------- HERO: parallax compuesto (scroll + ratón + giroscopio) ---------- */
  /* Bucle bajo demanda: solo corre mientras hay movimiento pendiente
     (scroll o parallax de ratón/giroscopio); en reposo no consume frames. */
  let mx = 0, tx = 0, lastY = -1, running = false;
  const layers = $$(".hero-svg .layer");
  const copy = $(".hero-copy");
  function paint() {
    const y = scrollY;
    if (y < innerHeight * 1.3) {
      layers.forEach((l) => {
        const sy = y * parseFloat(l.dataset.speed || 0);
        const sx = -mx * parseFloat(l.dataset.mx || 0);
        l.style.transform = `translate(${sx}px, ${sy}px)`;
      });
      if (copy) {
        copy.style.transform = `translateY(${y * 0.42}px)`;
        copy.style.opacity = Math.max(0, 1 - y / (innerHeight * 0.62));
      }
    }
    lastY = y;
  }
  function loop() {
    mx += (tx - mx) * 0.08; // lerp suave
    const settled = Math.abs(tx - mx) < 0.002 && lastY === scrollY;
    paint();
    if (settled) { running = false; return; }
    requestAnimationFrame(loop);
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }
  addEventListener("scroll", kick, { passive: true });
  addEventListener("mousemove", (e) => { tx = (e.clientX / innerWidth) * 2 - 1; kick(); }, { passive: true });
  addEventListener("deviceorientation", (e) => {
    if (e.gamma != null) { tx = Math.max(-1, Math.min(1, e.gamma / 30)); kick(); }
  }, { passive: true });
  paint();

  /* ---------- BUSCADOR GLOBAL ---------- */
  const D = window.DATA;
  const INDEX = [];
  const add = (titulo, sub, hash, extra) => INDEX.push({ t: titulo, s: sub, h: hash, x: (extra || "") });
  D.sitios.forEach((s) => add(s.nombre, `Qué ver · ${s.zona} · ${s.precio}`, "#/ver", s.desc));
  D.barrios.forEach((b) => add(b.nombre, `Barrio · ${b.tag}`, "#/barrios", b.desc));
  D.comer.bloques.forEach((b) => { add(b.titulo, "Comer", "#/comer", b.texto); b.sitios.forEach((s) => add(s.nombre, `Comer · ${s.zona}`, "#/comer", s.nota)); });
  D.noche.zonas.forEach((z) => add(z.nombre, `La noche · ${z.cuando}`, "#/noche", z.desc + " " + z.sitios.join(" ")));
  D.alrededores.forEach((a) => add(a.nombre, `Alrededores · ${a.dist}`, "#/alrededores", a.que));
  D.historia.capas.forEach((c) => add(c.epoca, `Historia · ${c.años}`, "#/historia", c.texto));
  D.historia.libros.forEach((l) => add(l.titulo, `Libro · ${l.autor}`, "#/historia", l.nota));
  D.costumbres.forEach((c) => add(c.titulo, "Costumbres", "#/costumbres", c.texto));
  D.idioma.frases.forEach((f) => add(`${f.es} → ${f.sr}`, "Frase", "#/costumbres", f.cir));
  D.eventos.forEach((e) => add(e.nombre, `Evento ${e.fecha.slice(8)}/jul · ${e.lugar}`, "#/agenda", e.genero));
  D.paseos.forEach((p) => { add("Paseo: " + p.nombre, `${p.dur} · ${p.dist}`, "#/paseos", p.resumen + " " + p.paradas.map((s) => s.n).join(" ")); });
  D.glosario.forEach((g) => add(g.t, "Diccionario para pedir", "#/comer", g.d));
  D.escena.bloques.forEach((b) => { add(b.titulo, "Cine y música", "#/escena", b.texto); b.sitios.forEach((s) => add(s.nombre, `Cine y música · ${s.zona}`, "#/escena", s.nota)); });
  add("Playlist: " + D.escena.playlist.nombre, "La banda sonora del viaje (Spotify)", "#/escena", "musica yugoslava ekv idoli spotify");
  add("Cartas de Belgrado", "Nueve cartas selladas, una por día", "#/cartas", "cartas sorpresa sellos dias");
  D.transporte.aeropuerto.opciones.forEach((o) => add(o.nombre, "Aeropuerto → casa", "#/transporte", o.como));
  add("El dilema del 30 de julio", "Subotica vs Budapest vs Belgrado", "#/dilema", "tren subotica szeged budapest");
  add("Conversor EUR ⇄ RSD", "Práctico", "#/practico", "dinares cambio dinero");
  add("Checklist de maleta", "Práctico", "#/practico", "pasaporte esim");
  add("Gastos a medias", "Quién pagó qué, saldo Álvaro/Laura", "#/gastos", "dinero cuentas dividir pagar deber");
  add("Postal desde Belgrado", "Crea una imagen para compartir", "#/cuaderno", "postal foto whatsapp recuerdo");
  add("Descifra el cartel (juego)", "Entrena el cirílico jugando", "#/costumbres", "quiz juego cirilico alfabeto");
  add("Tu nombre en cirílico", "Transliterador", "#/costumbres", "nombre cirilico");

  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  function buscar(q) {
    q = norm(q.trim());
    if (q.length < 2) return [];
    const terms = q.split(/\s+/);
    return INDEX.map((e) => {
      const hayT = norm(e.t), hayS = norm(e.s), hayX = norm(e.x);
      let score = 0;
      for (const t of terms) {
        if (hayT.startsWith(t)) score += 5;
        else if (hayT.includes(t)) score += 3;
        else if (hayS.includes(t)) score += 2;
        else if (hayX.includes(t)) score += 1;
        else return null;
      }
      return { e, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 12).map((r) => r.e);
  }
  const sheet = $("#searchSheet"), input = $("#searchInput"), results = $("#searchResults");
  function openSearch() {
    sheet.hidden = false; input.value = ""; results.innerHTML =
      '<p class="vacio">Museos, barrios, burek, frases, eventos… todo está indexado.</p>';
    setTimeout(() => input.focus(), 60);
  }
  $("#searchBtn").addEventListener("click", openSearch);
  addEventListener("keydown", (e) => {
    if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
    if (e.key === "Escape") $$(".sheet").forEach((s) => (s.hidden = true));
  });
  input.addEventListener("input", () => {
    const found = buscar(input.value);
    results.innerHTML = found.length
      ? found.map((e) => `<a class="search-hit" href="${e.h}"><b>${e.t}</b><span>${e.s}</span></a>`).join("")
      : (input.value.trim().length >= 2 ? '<p class="vacio">Nada con ese nombre. ¿En cirílico quizá? 😉</p>' : "");
  });
  results.addEventListener("click", (e) => { if (e.target.closest("a")) sheet.hidden = true; });

  /* ---------- VOZ (serbio) ---------- */
  let voces = [];
  const cargaVoces = () => {
    voces = speechSynthesis.getVoices();
    // si el sistema ya cargó voces y no hay ninguna eslava, ocultamos los altavoces
    if (voces.length) {
      const hay = voces.some((v) => /^(sr|hr|bs|ru)/i.test(v.lang));
      document.body.classList.toggle("no-tts", !hay);
    }
  };
  if ("speechSynthesis" in window) { cargaVoces(); speechSynthesis.onvoiceschanged = cargaVoces; }
  else document.body.classList.add("no-tts");
  function speak(txt) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    const v = voces.find((v) => /^sr/i.test(v.lang)) || voces.find((v) => /^(hr|bs)/i.test(v.lang)) || voces.find((v) => /^ru/i.test(v.lang));
    if (v) u.voice = v;
    u.lang = v ? v.lang : "sr-RS";
    u.rate = 0.85;
    speechSynthesis.speak(u);
  }

  /* ---------- TRANSLITERADOR es → cirílico serbio ---------- */
  function translit(s) {
    if (!s) return "";
    const digraphs = [["ch", "ч"], ["ll", "љ"], ["sh", "ш"], ["zh", "ж"], ["dj", "ђ"], ["dž", "џ"], ["nj", "њ"], ["lj", "љ"], ["qu", "к"]];
    const map = {
      a: "а", á: "а", à: "а", b: "б", c: "ц", d: "д", e: "е", é: "е", è: "е", f: "ф",
      g: "г", h: "х", i: "и", í: "и", j: "х", k: "к", l: "л", m: "м", n: "н", ñ: "њ",
      o: "о", ó: "о", p: "п", q: "к", r: "р", s: "с", t: "т", u: "у", ú: "у", ü: "у",
      v: "в", w: "в", x: "кс", y: "ј", z: "з", " ": " ", "-": "-", "'": "’",
    };
    let out = "";
    let low = s.toLowerCase().replace(/\by\b/g, "i"); // «y» suelta = «и»
    for (let i = 0; i < low.length;) {
      const two = low.slice(i, i + 2);
      const dg = digraphs.find(([d]) => d === two);
      let piece;
      if (dg) { piece = dg[1]; i += 2; }
      else { piece = map[low[i]] ?? low[i]; i += 1; }
      // conservar mayúscula inicial de cada palabra
      const origIdx = i - (dg ? 2 : 1);
      if (s[origIdx] && s[origIdx] === s[origIdx].toUpperCase() && s[origIdx] !== s[origIdx].toLowerCase()) {
        piece = piece.charAt(0).toUpperCase() + piece.slice(1);
      }
      out += piece;
    }
    return out;
  }

  /* ---------- SPLASH primera visita ---------- */
  const splash = $("#splash");
  if (splash && !localStorage.getItem("bg26_seen")) {
    splash.hidden = false;
    document.body.style.overflow = "hidden";
    $("#splashGo").addEventListener("click", () => {
      localStorage.setItem("bg26_seen", "1");
      splash.classList.add("out");
      document.body.style.overflow = "";
      setTimeout(() => (splash.hidden = true), 650);
    });
  }

  window.BGFx = { speak, translit, openSearch };
})();
