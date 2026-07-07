/* ============================================================
   БЕОГРАД 26 · live.js — reloj, clima, cambio y «¿y ahora qué?»
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const esc = (s) => window.BGCore.esc(s);

  const WMO = {
    0: ["☀️", "Despejado"], 1: ["🌤", "Casi despejado"], 2: ["⛅", "Nubes y claros"], 3: ["☁️", "Nublado"],
    45: ["🌫", "Niebla"], 48: ["🌫", "Niebla"], 51: ["🌦", "Llovizna"], 53: ["🌦", "Llovizna"], 55: ["🌧", "Llovizna"],
    61: ["🌧", "Lluvia débil"], 63: ["🌧", "Lluvia"], 65: ["🌧", "Lluvia fuerte"], 80: ["🌦", "Chubascos"],
    81: ["🌧", "Chubascos"], 82: ["⛈", "Chubascos fuertes"], 95: ["⛈", "Tormenta"], 96: ["⛈", "Tormenta"], 99: ["⛈", "Tormenta"],
  };
  const wmo = (c) => WMO[c] || ["🌡", "—"];

  /* ---------- Estado ---------- */
  let weather = null; // respuesta open-meteo
  try { weather = JSON.parse(localStorage.getItem("bg26_meteo") || "null"); } catch {}

  /* ---------- Reloj de Belgrado ---------- */
  const fmtHora = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Belgrade" });
  const mismaHora = new Date().getTimezoneOffset() === -120; // España peninsular en verano = CEST, como Belgrado

  /* ---------- Render del panel ---------- */
  function dashSkeleton() {
    const box = $("#liveDash"); if (!box) return;
    box.innerHTML = `<div class="live-dash reveal in">
      <div class="ld-row">
        <div class="ld-clock"><span class="ld-label">Ahora en Belgrado</span>
          <b id="ldTime">--:--:--</b>
          <span class="ld-sub" id="ldTz">${mismaHora ? "misma hora que en España" : "hora local serbia"}</span></div>
        <div class="ld-weather" id="ldWeather"><span class="ld-label">&nbsp;</span><b>…</b><span class="ld-sub">cargando clima</span></div>
        <div class="ld-sun" id="ldSun"><span class="ld-label">Atardecer</span><b>~20:30</b><span class="ld-sub" id="ldSunIn">hora dorada en Kalemegdan</span></div>
      </div>
      <div class="ld-strip" id="ldStrip"></div>
      <button class="btn ahora-btn" id="ahoraBtn">✨ ¿Y ahora qué hacemos?</button>
    </div>`;
    $("#ahoraBtn").addEventListener("click", abrirAhora);
    tick(); pintarClima();
  }

  function tick() {
    const t = $("#ldTime");
    if (t) t.textContent = fmtHora.format(new Date());
    // cuenta atrás al atardecer
    const si = $("#ldSunIn");
    if (si && weather && weather.daily) {
      try {
        const hoy = new Date().toISOString().slice(0, 10);
        const i = weather.daily.time.indexOf(hoy);
        const sunset = new Date(weather.daily.sunset[i]);
        const d = sunset - new Date();
        si.textContent = d > 0
          ? `en ${Math.floor(d / 36e5) ? Math.floor(d / 36e5) + " h " : ""}${Math.floor(d / 6e4) % 60} min · hora dorada en Kalemegdan`
          : "el sol ya se puso — hora de Cetinjska";
      } catch {}
    }
  }
  setInterval(tick, 1000);

  function pintarClima() {
    const w = weather, elW = $("#ldWeather"), elS = $("#ldSun"), strip = $("#ldStrip");
    if (!elW) return;
    if (!w || !w.current) { return; }
    const [ico, txt] = wmo(w.current.weather_code);
    elW.innerHTML = `<span class="ld-label">${ico} ${esc(txt)}</span>
      <b>${Math.round(w.current.temperature_2m)}°</b>
      <span class="ld-sub">sensación ${Math.round(w.current.apparent_temperature)}°</span>`;
    // atardecer de hoy
    const hoyIso = new Date().toISOString().slice(0, 10);
    const i = w.daily.time.indexOf(hoyIso);
    if (i >= 0 && elS) {
      elS.innerHTML = `<span class="ld-label">Atardecer</span><b>${w.daily.sunset[i].slice(11, 16)}</b>
        <span class="ld-sub" id="ldSunIn">hora dorada en Kalemegdan</span>`;
    }
    // tira de días: primero los del viaje si están en rango; si no, próximos 7
    const viaje = w.daily.time.map((d, ix) => ({ d, ix })).filter((x) => x.d >= "2026-07-22" && x.d <= "2026-07-30");
    const dias = (viaje.length ? viaje : w.daily.time.map((d, ix) => ({ d, ix })).slice(1, 8));
    strip.innerHTML = dias.map(({ d, ix }) => {
      const [i2] = wmo(w.daily.weather_code[ix]);
      const enViaje = d >= "2026-07-22" && d <= "2026-07-30";
      return `<div class="ld-day ${enViaje ? "trip" : ""}">
        <span>${+d.slice(8)}<i>${["L","M","X","J","V","S","D"][(new Date(d + "T12:00").getDay() + 6) % 7]}</i></span>
        <b>${i2}</b>
        <span>${Math.round(w.daily.temperature_2m_max[ix])}°<i>${Math.round(w.daily.temperature_2m_min[ix])}°</i></span>
      </div>`;
    }).join("");
    if (viaje.length) strip.insertAdjacentHTML("afterbegin", '<p class="ld-strip-tag">Vuestros días ↓</p>');
  }

  async function cargarClima() {
    try {
      const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=44.8125&longitude=20.4550&current=temperature_2m,apparent_temperature,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=Europe%2FBelgrade&forecast_days=16");
      if (!r.ok) throw 0;
      weather = await r.json();
      localStorage.setItem("bg26_meteo", JSON.stringify(weather));
      pintarClima();
    } catch { /* sin red: se queda el cache o el esqueleto */ }
  }

  /* ---------- Conversor EUR ⇄ RSD ---------- */
  let rate = +(localStorage.getItem("bg26_fx") || 117.2);
  let rateFecha = localStorage.getItem("bg26_fx_date") || null;
  async function cargarFx() {
    const hoy = new Date().toISOString().slice(0, 10);
    if (rateFecha === hoy) return; // cache diario
    try {
      const r = await fetch("https://open.er-api.com/v6/latest/EUR");
      if (!r.ok) throw 0;
      const j = await r.json();
      if (j && j.rates && j.rates.RSD) {
        rate = j.rates.RSD;
        localStorage.setItem("bg26_fx", String(rate));
        localStorage.setItem("bg26_fx_date", hoy);
        rateFecha = hoy;
        pintaFxNota();
      }
    } catch {}
  }
  function pintaFxNota() {
    const n = $("#fxNota");
    if (n) n.textContent = `1 € = ${rate.toFixed(1)} RSD · ${rateFecha ? "tipo de hoy (open.er-api.com)" : "tipo aproximado guardado"} · las menjačnica del centro rondan este cambio`;
    const refs = $("#fxRefs");
    if (refs) refs.innerHTML = [["☕ café", 200], ["🥐 burek", 250], ["🍺 caña craft", 400], ["🍔 pljeskavica", 500], ["🍽 kafana (2 pers.)", 4000]]
      .map(([t, v]) => `<span class="fx-ref">${t}<b>${v} din ≈ ${(v / rate).toFixed(1)} €</b></span>`).join("");
  }
  function initFx() {
    const eur = $("#fxEur"), rsd = $("#fxRsd");
    if (!eur) return;
    const upd = (from) => {
      if (from === "eur") rsd.value = Math.round((+eur.value || 0) * rate);
      else eur.value = ((+rsd.value || 0) / rate).toFixed(2);
    };
    eur.addEventListener("input", () => upd("eur"));
    rsd.addEventListener("input", () => upd("rsd"));
    upd("eur"); pintaFxNota(); cargarFx();
  }

  /* ---------- «¿Y ahora qué?» ---------- */
  function abrirAhora() {
    const D = window.DATA, C = window.BGCore;
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    const temp = weather && weather.current ? weather.current.temperature_2m : null;
    const lluvia = weather && weather.current && [51,53,55,61,63,65,80,81,82,95,96,99].includes(weather.current.weather_code);
    const abiertos = D.sitios.filter((s) => C.estadoSitio(s).open && s.horario);
    const sug = [];

    if (lluvia) {
      sug.push({ t: "☔ Está lloviendo: plan bajo techo", d: abiertos.length ? `Ahora mismo están abiertos: ${abiertos.slice(0, 3).map((s) => s.nombre).join(" · ")}.` : "Kafana, café largo y esperar a que escampe — muy belgradense.", h: "#/ver" });
    }
    if (h >= 7 && h < 11) {
      sug.push({ t: "🥐 Hora de pekara", d: "Burek con yogur en Trpković (5 min de casa) antes de que la cola dé la vuelta. Después, mercado: por la mañana es cuando viven.", h: "#/comer" });
      if (abiertos.length) sug.push({ t: "◈ Los museos acaban de abrir", d: `Sin colas a primera hora: ${abiertos.slice(0, 3).map((s) => s.nombre).join(" · ")}.`, h: "#/ver" });
    } else if (h >= 11 && h < 17) {
      if (temp != null && temp >= 31) {
        sug.push({ t: `🥵 ${Math.round(temp)}° ahora mismo: plan anti-calor`, d: "Ada Ciganlija (el lago-playa) o un museo con aire: Tesla, Yugoslavia o el MoCAB. La calle, mejor dejarla para las 18:00.", h: "#/barrios" });
      } else {
        sug.push({ t: "🚶 Buena hora para callejear", d: "Dorćol y Kosančićev venac sin el sol de plomo. O cruzar el puente a Novi Beograd para ver la otra ciudad.", h: "#/barrios" });
      }
      if (abiertos.length) sug.push({ t: "◈ Abierto ahora", d: abiertos.slice(0, 4).map((s) => s.nombre).join(" · "), h: "#/ver" });
    } else if (h >= 17 && h < 20.5) {
      const sunset = (() => { try { const i = weather.daily.time.indexOf(now.toISOString().slice(0, 10)); return weather.daily.sunset[i].slice(11, 16); } catch { return "~20:30"; } })();
      sug.push({ t: `🌇 Atardecer a las ${sunset}: Kalemegdan`, d: "La puesta de sol sobre la confluencia es EL momento del día en Belgrado. Llegad 30-40 min antes y buscad el muro oeste.", h: "#/ver" });
      sug.push({ t: "🍺 O primera caña en el río", d: "Sava Promenada o el kej de Zemun: cerveza fría mirando el agua mientras baja el calor.", h: "#/noche" });
    } else if (h >= 20.5 || h < 2) {
      sug.push({ t: "🍻 Noche cervecera", d: "Cetinjska 15 para saltar entre bares (Samo Pivo primero), o Dorćol si apetece más calma y conversación.", h: "#/noche" });
      sug.push({ t: "🥘 ¿Aún sin cenar?", d: "En Serbia se cena tarde: kafana con calma o una pljeskavica de Walter. A estas horas sois muy locales.", h: "#/comer" });
    } else {
      sug.push({ t: "🌙 Belgrado duerme (más o menos)", d: "Si estáis despiertos a estas horas, o acabáis de llegar de Cetinjska o mañana toca madrugar para Novi Sad. Ambas son buenas señales.", h: "#/agenda" });
    }
    // comodín
    const wild = [
      { t: "🎲 Comodín: Zemun", d: "Bus 83 gratis, torre de Gardoš y pescado junto al Danubio. Media jornada redonda.", h: "#/alrededores" },
      { t: "🎲 Comodín: tu nombre en cirílico", d: "Dos minutos de risas garantizadas en la sección de idioma.", h: "#/costumbres" },
      { t: "🎲 Comodín: mercado Kalenić", d: "Fruta de julio (sandía, frambuesa) y el barrio más agradable para un café después.", h: "#/comer" },
      { t: "🎲 Comodín: las cinco capas", d: "Diez minutos de la sección Historia y la ciudad se entiende el doble.", h: "#/historia" },
    ];
    sug.push(wild[Math.floor(Math.random() * wild.length)]);

    $("#ahoraBody").innerHTML = sug.map((s) => `<a class="ahora-card" href="${s.h}">
      <b>${s.t}</b><p>${s.d}</p></a>`).join("") +
      `<p class="muted small" style="margin-top:10px">Generado con la hora${temp != null ? " y el clima reales" : " real"} de Belgrado. Son sugerencias, no órdenes 💡</p>`;
    $("#ahoraSheet").hidden = false;
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest(".ahora-card")) $("#ahoraSheet").hidden = true;
  });

  /* ---------- init ---------- */
  dashSkeleton();
  cargarClima();
  cargarFx();
  setInterval(cargarClima, 30 * 60 * 1000);

  window.BGLive = { initFx };
})();
