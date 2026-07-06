/* ============================================================
   БЕОГРАД 26 · map.js — Leaflet + capas de puntos
   ============================================================ */
(function () {
  "use strict";
  let map, groups = {}, notaLayer;

  const COLORES = {
    casa: "#c0392b", ver: "#7a5aa0", comer: "#c07a2c", noche: "#4a5fc9",
    barrio: "#2e7d76", tren: "#3a7ca5", nota: "#5e8d5a",
  };
  const ETIQ = {
    casa: "🏠 Casa", ver: "◈ Qué ver", comer: "♨ Comer", noche: "☾ Noche",
    barrio: "⌂ Barrios", tren: "🚆 Estaciones", nota: "✎ Notas",
  };

  function pin(color, emoji) {
    return L.divIcon({
      className: "", iconSize: [26, 26], iconAnchor: [13, 24], popupAnchor: [0, -22],
      html: `<div class="pin-dot" style="background:${color}"><span>${emoji}</span></div>`,
    });
  }
  const gmaps = (c) => `<a href="https://www.google.com/maps/search/?api=1&query=${c.join(",")}" target="_blank" rel="noopener">Cómo llegar ↗</a>`;

  function puntos() {
    const D = window.DATA;
    const pts = [];
    pts.push({ cap: "casa", coords: D.viaje.alojamiento.coords, emoji: "🏠", pop: `<b>${D.viaje.alojamiento.nombre}</b><br>${D.viaje.alojamiento.direccion}<br><i>Posición aproximada</i><br>` });
    D.sitios.forEach((s) => pts.push({ cap: "ver", coords: s.coords, emoji: "◈", pop: `<b>${s.nombre}</b><br>${s.zona} · ${s.precio}<br>` }));
    D.comer.bloques.forEach((b) => b.sitios.forEach((s) => { if (s.coords) pts.push({ cap: "comer", coords: s.coords, emoji: "♨", pop: `<b>${s.nombre}</b><br>${s.zona}<br>${s.nota}<br>` }); }));
    D.noche.zonas.forEach((z) => pts.push({ cap: "noche", coords: z.coords, emoji: "☾", pop: `<b>${z.nombre}</b><br>${z.cuando}<br>` }));
    D.barrios.forEach((b) => pts.push({ cap: "barrio", coords: b.coords, emoji: "⌂", pop: `<b>${b.nombre}</b><br>${b.tag}<br>` }));
    pts.push({ cap: "tren", coords: [44.7959, 20.4519], emoji: "🚆", pop: "<b>Beograd Centar (Prokop)</b><br>Trenes a Novi Sad, Subotica y Budapest<br>" });
    pts.push({ cap: "tren", coords: [44.8195, 20.2925], emoji: "✈", pop: "<b>Aeropuerto Nikola Tesla</b><br>Bus 72 (gratis) · A1 (400 RSD) · taxi voucher<br>" });
    return pts;
  }

  function refreshNotas() {
    if (!map || !notaLayer) return;
    notaLayer.clearLayers();
    (window.BGNotas ? BGNotas.getNotas() : []).forEach((n) => {
      if (!n.coords) return;
      L.marker(n.coords, { icon: pin(COLORES.nota, "✎") })
        .bindPopup(`<b>${n.nombre}</b><br>${n.cat}${n.zona ? "<br>📍 " + n.zona : ""}${n.texto ? "<br>" + n.texto : ""}<br>` + gmaps(n.coords))
        .addTo(notaLayer);
    });
  }

  function init() {
    const box = document.getElementById("mapBox");
    if (!box || map) { invalidate(); return; }
    map = L.map(box, { zoomControl: true }).setView([44.8125, 20.4550], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "© OpenStreetMap",
    }).addTo(map);

    Object.keys(ETIQ).forEach((k) => { groups[k] = L.layerGroup().addTo(map); });
    notaLayer = groups.nota;
    puntos().forEach((p) => {
      L.marker(p.coords, { icon: pin(COLORES[p.cap], p.emoji) })
        .bindPopup(p.pop + gmaps(p.coords)).addTo(groups[p.cap]);
    });
    refreshNotas();

    // filtros
    const filtros = document.getElementById("mapFiltros");
    filtros.innerHTML = Object.entries(ETIQ).map(([k, v]) => `<button class="on" data-cap="${k}">${v}</button>`).join("");
    filtros.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const g = groups[b.dataset.cap];
      if (map.hasLayer(g)) { map.removeLayer(g); b.classList.remove("on"); }
      else { map.addLayer(g); b.classList.add("on"); }
    });

    // elegir punto para nota del cuaderno
    map.on("click", (e) => {
      if (!window.__pickingNote) return;
      window.__pickingNote = false;
      window.BGNotas && BGNotas.setCoordsFromMap(e.latlng.lat, e.latlng.lng);
      location.hash = "#/cuaderno";
    });

    setTimeout(invalidate, 120);
  }

  function invalidate() {
    if (!map) return;
    map.invalidateSize();
    if (window.__flyTo) { map.flyTo(window.__flyTo, 15, { duration: .9 }); window.__flyTo = null; }
  }

  window.BGMap = { init, invalidate, refreshNotas };
})();
