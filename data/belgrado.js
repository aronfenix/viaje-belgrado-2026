/* ============================================================
   BELGRADO 2026 · Álvaro & Laura
   Datos del viaje. Cada dato lleva una etiqueta de fiabilidad:
     'ok'  → confirmado (fuente y fecha de verificación)
     'ver' → verificar cerca de la fecha / en destino
     'sug' → sugerencia u opinión, no un hecho
   Verificado online: 6 de julio de 2026.
   ============================================================ */

const DATA = {

  viaje: {
    ciudad: "Belgrado",
    cirilico: "БЕОГРАД",
    viajeros: ["Álvaro", "Laura"],
    inicio: "2026-07-22",       // miércoles — vuelo Madrid ~16:00
    fin: "2026-07-30",          // jueves — transición hacia Budapest
    vueloNota: "Salida de Madrid ≈ 16:00 (hora por confirmar en la tarjeta de embarque).",
    alojamiento: {
      nombre: "Apartamento Elysian",
      direccion: "Risanska 9, Savski Venac, 11000 Beograd",
      coords: [44.8014, 20.4611], coordsAprox: true,
      zona: "Savski Venac — zona central y funcional entre Slavija, Savamala y la estación Beograd Centar. Más útil que monumental: la base perfecta, no la postal.",
    },
    moneda: { codigo: "RSD", nombre: "dinar serbio", cambioAprox: "1 € ≈ 117 RSD", cambioNota: "Cambio orientativo (jul 2026). Casas de cambio (menjačnica) por toda la ciudad, mejor tipo que en el aeropuerto.", fiab: "ver" },
    prologo: {
      titulo: "Prólogo",
      texto: "Hay ciudades que se visitan y ciudades que se atraviesan, como se atraviesa una historia. Belgrado es de las segundas. La han quemado, sitiado y bombardeado unas cuarenta veces —celtas, romanos, turcos, austríacos, nazis, la OTAN— y las cuarenta veces ha vuelto a ponerse en pie, cada vez con menos postal y más verdad encima.\n\nA una ciudad así no se viene a tachar monumentos. Se viene a andarla —y vosotros andáis—, a sentarse donde se sientan los que la habitan, a pedir la segunda cerveza cuando la noche empieza a estar de acuerdo, a leerla en sus fachadas quemadas y en sus mercados de julio. Nueve días, dos ríos, un hermano y una hermana. No hay lista de deberes en estas páginas: hay materiales para construir cada día a vuestra manera, que es la única que importa.",
      firma: "— Vuestra guía, que estuvo leyendo mucho para esto"
    },
  },

  /* ---------- AGENDA: reglas semanales + eventos por día ---------- */
  reglasSemana: {
    // weekday: 1=lunes ... 7=domingo (ISO)
    1: { titulo: "Lunes: día trampa de museos", cierran: ["Museo Nacional", "Museo de Yugoslavia", "Museo Militar", "Ciencia y Tecnología", "Casa de Manak", "Residencia de la Princesa Ljubica", "Vuk y Dositej", "MoCAB no (cierra martes)"], abren: ["Museo Tesla", "Museo Etnográfico", "Arte Africano", "Kalemegdan (exteriores, siempre)"], sug: "Buen día para: Kalemegdan, barrios, Zemun, Ada Ciganlija o el Museo Tesla." },
    2: { titulo: "Martes", cierran: ["Museo de Arte Contemporáneo (MoCAB)"], abren: ["Casi todo lo demás"], sug: null },
    3: { titulo: "Miércoles", cierran: ["Museo Etnográfico"], abren: ["Casi todo lo demás"], sug: null },
    4: { titulo: "Jueves", cierran: [], abren: ["Museo Nacional 12:00–20:00 (horario tarde)"], sug: null },
    5: { titulo: "Viernes", cierran: [], abren: ["Todo lo habitual"], sug: null },
    6: { titulo: "Sábado", cierran: [], abren: ["Museo Nacional 12:00–20:00", "Royal Compound: visitas públicas (reservar)"], sug: "Único día de visita ordinaria al complejo real de Dedinje." },
    7: { titulo: "Domingo", cierran: ["Casa de Manak"], abren: ["Museo Nacional GRATIS los domingos", "Rastro de Zemun (buvljak) por la mañana temprano"], sug: "Domingo = Museo Nacional gratis. Y mercadillo si apetece madrugar." },
  },

  dias: [
    { fecha: "2026-07-22", nota: "Llegada. Vuelo desde Madrid ~16:00 → Belgrado. Tarde/noche para instalarse y primer paseo por Savamala o cena cerca.", tipo: "llegada" },
    { fecha: "2026-07-30", nota: "Último día en Belgrado. Transición hacia Budapest — ver «El dilema del 30».", tipo: "salida" },
  ],

  eventos: [
    { fecha: "2026-07-22", nombre: "Joss Stone", lugar: "Port of Belgrade", genero: "Pop/Soul", fiab: "ver", fuente: "Songkick, jul 2026" },
    { fecha: "2026-07-23", nombre: "Sina Bathaie", lugar: "Grad", genero: "Electrónica", fiab: "ver", fuente: "Songkick" },
    { fecha: "2026-07-25", nombre: "Panzerfaust", lugar: "Klub Fest", genero: "Metal", fiab: "ver", fuente: "Songkick" },
    { fecha: "2026-07-25", nombre: "Emi Galvan", lugar: "Mama Shelter", genero: "Dance", fiab: "ver", fuente: "Songkick" },
    { fecha: "2026-07-26", nombre: "Godsmack", lugar: "Hangar, Luka Beograd", genero: "Hard rock", fiab: "ver", fuente: "Songkick" },
    { fecha: "2026-07-28", nombre: "Crowbar", lugar: "Klub studenata tehnike", genero: "Metal", fiab: "ver", fuente: "Songkick" },
    { fecha: "2026-07-29", nombre: "Nogu Svelo!", lugar: "Zappa Barka (barcaza)", genero: "Rock ruso", fiab: "ver", fuente: "Songkick" },
    { fecha: "2026-07-29", nombre: "Kaaper", lugar: "Dorćol Platz", genero: "Metal", fiab: "ver", fuente: "Songkick" },
  ],
  eventosNota: "Son eventos listados en agregadores (Songkick/Bandsintown) a 6-jul-2026 — datos localizados, no un plan. La programación pequeña (clubes, kafanas con música) aparece la misma semana: mirar Belgradist y Resident Advisor allí. BELEF 2026 terminó el 7 de julio; el Beer Fest suele caer en agosto.",

  /* ---------- QUÉ VER ---------- */
  // horario: por día ISO 1-7, [apertura, cierre] en horas, null = cerrado
  sitios: [
    {
      id: "kalemegdan", nombre: "Fortaleza de Belgrado · Kalemegdan", zona: "Stari Grad",
      coords: [44.8232, 20.4504], dur: "2–3 h", precio: "Exteriores gratis",
      horario: null, siempre: "Parque y murallas abiertos siempre; interiores de temporada ~11:00–19:00 (algunos de pago).",
      desc: "El punto donde se entiende Belgrado: la fortaleza sobre la confluencia del Sava y el Danubio. Miradores, murallas romanas-otomanas-austríacas superpuestas, el Pobednik, y Novi Beograd y Zemun al otro lado del agua.",
      consejo: "Ir al atardecer: la puesta de sol sobre la confluencia es el momento. En julio anochece ~20:30.",
      fiab: "ok", fuente: "beogradskatvrdjava.co.rs · ver. 6-jul-2026"
    },
    {
      id: "museo-nacional", nombre: "Museo Nacional de Serbia", zona: "Trg Republike",
      coords: [44.8165, 20.4600], dur: "1.5–2 h", precio: "≈300 RSD · domingos GRATIS",
      horario: { 1: null, 2: [10, 18], 3: [10, 18], 4: [12, 20], 5: [10, 18], 6: [12, 20], 7: [10, 18] },
      desc: "La pinacoteca del país en la plaza de la República: arqueología, iconos, pintura serbia y europea.",
      consejo: "Domingo gratis (y el 26 de julio es domingo).",
      fiab: "ver", fuente: "Horarios trabajados previamente; confirmar en narodnimuzej.rs"
    },
    {
      id: "tesla", nombre: "Museo Nikola Tesla", zona: "Vračar · Krunska 51",
      coords: [44.8048, 20.4707], dur: "1–1.5 h", precio: "≈800 RSD con visita guiada en inglés · SOLO EFECTIVO",
      horario: { 1: [10, 18], 2: [10, 20], 3: [10, 20], 4: [10, 20], 5: [10, 20], 6: [10, 20], 7: [10, 20] },
      desc: "Pequeño pero mítico: la urna con las cenizas de Tesla, sus cuadernos y demostraciones en vivo con la bobina de Tesla. Las visitas guiadas en inglés salen a horas fijas.",
      consejo: "Abre incluso los lunes (raro en Belgrado). Llevar dinares en efectivo: no aceptan tarjeta.",
      fiab: "ok", fuente: "tesla-museum.org · ver. 6-jul-2026 (precio exacto 'ver')"
    },
    {
      id: "museo-yugoslavia", nombre: "Museo de Yugoslavia · Casa de las Flores", zona: "Dedinje",
      coords: [44.7866, 20.4520], dur: "2 h", precio: "≈600 RSD (fuentes dan 400–600)",
      horario: { 1: null, 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], 6: [10, 18], 7: [10, 18] },
      desc: "La tumba de Tito, los relevos de la juventud, los regalos de medio mundo al mariscal. La mejor puerta de entrada a la historia yugoslava — conecta con la sección Historia.",
      consejo: "Se llega en trolebús 40/41 desde el centro (gratis). Exposición «BELGRADE: 7+1» hasta el 2 de agosto (verificar).",
      fiab: "ok", fuente: "muzej-jugoslavije.org · ver. 6-jul-2026"
    },
    {
      id: "san-sava", nombre: "Templo de San Sava", zona: "Vračar",
      coords: [44.7981, 20.4689], dur: "45 min", precio: "Gratis (cripta puede tener horario propio)",
      horario: null, siempre: "Abierto a diario, aprox. 07:00–19:00 o más.",
      desc: "Uno de los templos ortodoxos más grandes del mundo, visible desde media ciudad. El interior de mosaico dorado se terminó hace pocos años y es apabullante.",
      consejo: "Combinable con el mercado Kalenić y los cafés de Vračar.",
      fiab: "ver", fuente: "Horario amplio habitual; sin web oficial fiable"
    },
    {
      id: "museo-militar", nombre: "Museo Militar", zona: "Kalemegdan",
      coords: [44.8225, 20.4515], dur: "1–1.5 h", precio: "≈350 RSD",
      horario: { 1: null, 2: [10, 17], 3: [10, 17], 4: [10, 17], 5: [10, 17], 6: [10, 17], 7: [10, 17] },
      desc: "En la propia fortaleza: tanques y cañones fuera (gratis), dentro toda la historia militar balcánica, incluidos restos del F-117 derribado en 1999.",
      fiab: "ver", fuente: "Datos previos; confirmar en muzej.mod.gov.rs"
    },
    {
      id: "etnografico", nombre: "Museo Etnográfico", zona: "Studentski trg",
      coords: [44.8189, 20.4576], dur: "1 h", precio: "≈300 RSD",
      horario: { 1: [10, 20], 2: [10, 20], 3: null, 4: [10, 20], 5: [10, 20], 6: [10, 20], 7: [10, 20] },
      desc: "Trajes, casas y vida tradicional de los Balcanes. Abre los lunes — apunte útil.",
      fiab: "ver", fuente: "Datos previos; confirmar en etnografskimuzej.rs"
    },
    {
      id: "ljubica", nombre: "Residencia de la Princesa Ljubica", zona: "Kosančićev venac",
      coords: [44.8158, 20.4529], dur: "45 min", precio: "≈200–400 RSD",
      horario: { 1: null, 2: [10, 17], 3: [10, 17], 4: [10, 17], 5: [10, 18], 6: [10, 17], 7: [10, 14] },
      desc: "Palacete otomano-balcánico de 1830: el Belgrado de antes de las avenidas. En el barrio más bonito del casco viejo.",
      fiab: "ver", fuente: "Datos previos; confirmar en mgb.org.rs"
    },
    {
      id: "manak", nombre: "Casa de Manak", zona: "Savamala",
      coords: [44.8125, 20.4551], dur: "30 min", precio: "Entrada baja",
      horario: { 1: null, 2: [10, 17], 3: [10, 17], 4: [10, 17], 5: [10, 17], 6: [10, 17], 7: null },
      desc: "Casita tradicional del s. XIX a 10 minutos del apartamento. Visita corta y agradable de camino a otra cosa.",
      fiab: "ver", fuente: "Datos previos"
    },
    {
      id: "mocab", nombre: "Museo de Arte Contemporáneo (MoCAB)", zona: "Ušće · Novi Beograd",
      coords: [44.8180, 20.4430], dur: "1.5 h", precio: "≈600 RSD (reducida 300)",
      horario: { 1: [11, 19], 2: null, 3: [11, 19], 4: [12, 20], 5: [11, 19], 6: [12, 20], 7: [11, 19] },
      desc: "Edificio modernista precioso en el parque Ušće, junto a la confluencia. Arte yugoslavo y serbio del s. XX. Cruzar el puente Branko a pie ya es parte del plan.",
      fiab: "ver", fuente: "Datos previos; confirmar en msub.org.rs"
    },
    {
      id: "royal", nombre: "Royal Compound (Palacio Real)", zona: "Dedinje",
      coords: [44.7770, 20.4560], dur: "2 h (visita guiada)", precio: "≈1.500 RSD",
      horario: { 6: [9.5, 12.5] }, soloDias: "Solo sábados (9:30 y 12:30), con reserva; salida organizada desde Terazije.",
      desc: "Residencia de los Karađorđević: palacios, capilla y jardines. Solo visitable en visita organizada de sábado.",
      consejo: "Los sábados del viaje son el 25. Reservar con antelación en royalfamily.org si interesa.",
      fiab: "ver", fuente: "Datos previos; reservar/confirmar en royalfamily.org"
    },
    {
      id: "africano", nombre: "Museo de Arte Africano", zona: "Senjak",
      coords: [44.7930, 20.4430], dur: "45 min", precio: "≈300 RSD",
      horario: { 1: [10, 18], 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], 6: [10, 18], 7: [10, 18] },
      desc: "Único en los Balcanes, herencia de la Yugoslavia de los No Alineados. Pequeño y curioso; abre a diario.",
      fiab: "ver", fuente: "Datos previos"
    },
    {
      id: "vuk-dositej", nombre: "Museo de Vuk y Dositej", zona: "Dorćol",
      coords: [44.8195, 20.4585], dur: "40 min", precio: "≈200 RSD",
      horario: { 1: null, 2: [10, 18], 3: [10, 18], 4: [12, 20], 5: [10, 18], 6: [12, 20], 7: [10, 18] },
      desc: "La reforma de la lengua serbia y la Ilustración balcánica, en una casa otomana del s. XVIII.",
      fiab: "ver", fuente: "Marco del Museo Nacional"
    },
    {
      id: "ciencia", nombre: "Museo de Ciencia y Tecnología", zona: "Dorćol",
      coords: [44.8230, 20.4610], dur: "1 h", precio: "≈300–400 RSD",
      horario: { 1: null, 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], 6: [10, 18], 7: [10, 18] },
      desc: "En una antigua central eléctrica. Complemento natural del Tesla si el tema engancha.",
      fiab: "ver", fuente: "Datos previos"
    },
    {
      id: "ruzica", nombre: "Iglesia Ružica y Sveta Petka", zona: "Kalemegdan",
      coords: [44.8245, 20.4525], dur: "30 min", precio: "Gratis",
      horario: null, siempre: "A diario, aprox. 08:00–18:00 (horario de templo).",
      desc: "Escondida en la ladera de la fortaleza: la iglesia más antigua de Belgrado, con lámparas hechas con casquillos de balas de la I Guerra Mundial, y al lado la capilla de Sveta Petka con su manantial. Casi nadie la encuentra; vosotros sí.",
      consejo: "Bajando desde el Pobednik hacia el Danubio, lado noreste. Hombros cubiertos.",
      fiab: "ver", fuente: "Horario de templo habitual"
    },
    {
      id: "gardos", nombre: "Torre de Gardoš (Zemun)", zona: "Zemun",
      coords: [44.8497, 20.4046], dur: "45 min + paseo", precio: "≈200–300 RSD subir",
      horario: null, siempre: "Verano aprox. 10:00–20:00 (verificar).",
      desc: "La torre del Milenio húngara (1896) sobre el casco viejo de Zemun. La mejor vista del Danubio y de los tejados austrohúngaros. El barrio de callejuelas que la rodea es la mitad del plan.",
      consejo: "Subir al atardecer y bajar a cenar pescado al kej.",
      fiab: "ver", fuente: "Confirmar horario en destino"
    },
    {
      id: "nebojsa", nombre: "Torre Nebojša", zona: "Kalemegdan (pie del Danubio)",
      coords: [44.8270, 20.4480], dur: "45 min", precio: "≈300 RSD",
      horario: { 1: null, 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], 6: [10, 18], 7: [10, 18] },
      desc: "El torreón medieval junto al Danubio: fue prisión otomana (aquí murió el héroe griego Rigas Feraios) y hoy museo pequeño y digno. Se visita al pasar por el paseo fluvial.",
      fiab: "ver", fuente: "Datos previos; confirmar"
    },
    {
      id: "sava-promenada", nombre: "Sava Promenada y Belgrade Waterfront", zona: "Vuestro barrio",
      coords: [44.8065, 20.4520], dur: "1 h de paseo", precio: "Gratis",
      horario: null, siempre: "Siempre abierto; terrazas hasta tarde.",
      desc: "El megaproyecto polémico frente a vuestra puerta: rascacielos nuevos, paseo fluvial impecable y terrazas. Los belgradenses discuten sobre él; mientras discuten, pasean por él. Atardecer estupendo sobre el Sava y Ada.",
      consejo: "Es vuestro «paseo de después de cenar» natural: 10 min de casa.",
      fiab: "ok"
    },
    {
      id: "generalstab", nombre: "Ruinas del Generalštab", zona: "Kneza Miloša (5 min de casa)",
      coords: [44.8058, 20.4620], dur: "15 min (exterior)", precio: "Solo exterior",
      horario: null, siempre: "Se ve desde la calle, a cualquier hora.",
      desc: "El Estado Mayor yugoslavo, obra maestra de Nikola Dobrović, bombardeado por la OTAN en 1999 y dejado en ruina deliberada como memorial no declarado. Impresiona más que muchos museos y lo tenéis de camino a todo.",
      consejo: "Miradlo desde la acera de enfrente; no intentéis entrar (vigilado).",
      fiab: "ok"
    },
  ],

  /* ---------- PASEOS AUTOGUIADOS ---------- */
  paseos: [
    {
      id: "paseo-esencial", nombre: "El eje esencial", dur: "3–4 h", dist: "≈4 km", cuando: "Mejor por la tarde, acabando en Kalemegdan al atardecer",
      resumen: "El corazón de Belgrado en una tarde: del monumento gigante de Savski trg a la puesta de sol sobre la confluencia. Es EL paseo del primer día.",
      paradas: [
        { n: "Savski trg", coords: [44.8086, 20.4562], txt: "Empezad bajo el Stefan Nemanja de 23 metros, frente a la antigua estación de tren (hoy Museo Histórico en obras eternas). A 8 min de casa." },
        { n: "Casa de Manak", coords: [44.8125, 20.4551], txt: "Casita balcánica de 1830 superviviente entre bloques. Si está abierta, visita de 20 min; si no, la foto vale." },
        { n: "Savamala · Karađorđeva", coords: [44.8140, 20.4520], txt: "La calle del puerto: fachadas decadentes, murales y el contraste con el Waterfront nuevo al otro lado de las vías." },
        { n: "Kosančićev venac", coords: [44.8155, 20.4530], txt: "Subida corta a los adoquines del barrio más antiguo. Aquí ardió la Biblioteca Nacional en el bombardeo nazi de 1941 (el solar es memorial)." },
        { n: "Catedral y kafana «?»", coords: [44.8152, 20.4536], txt: "La Saborna crkva y enfrente la kafana más antigua (1823), que se llama «?» porque nunca acordaron el nombre. Parada de café o limonada." },
        { n: "Residencia de la Princesa Ljubica", coords: [44.8158, 20.4529], txt: "El Belgrado otomano-serbio en un palacete. 45 min si entra en horario; cierra lunes." },
        { n: "Knez Mihailova", coords: [44.8175, 20.4570], txt: "La peatonal austrohúngara: palacetes, librerías, helado. Dejaos llevar hacia el parque." },
        { n: "Plaza de la República", coords: [44.8163, 20.4602], txt: "El caballo (punto de quedada nacional: «kod konja»), el Museo Nacional y el Teatro. Desvío de 3 min si queréis verla y volver." },
        { n: "Kalemegdan · Pobednik", coords: [44.8232, 20.4504], txt: "Entrad con calma: murallas, el Pobednik y la confluencia Sava-Danubio a vuestros pies. Buscad sitio en el muro oeste ~40 min antes del atardecer." },
        { n: "Iglesia Ružica", coords: [44.8245, 20.4525], txt: "Remate secreto: la iglesia de las lámparas de balas, escondida en la ladera noreste. Si ya anochece, dejadla para otro día." },
      ],
    },
    {
      id: "paseo-dorcol", nombre: "Dorćol profundo", dur: "2,5–3 h", dist: "≈3 km", cuando: "Mañana (mercado y cafés) o última hora de la tarde",
      resumen: "El barrio viejo entre Knez Mihailova y el Danubio: capas otomanas, judías y austrohúngaras, y la mejor densidad de cafés de la ciudad.",
      paradas: [
        { n: "Studentski trg", coords: [44.8185, 20.4577], txt: "La plaza universitaria, antaño mercado turco. El Museo Etnográfico hace esquina (cierra miércoles)." },
        { n: "Mezquita Bajrakli", coords: [44.8189, 20.4592], txt: "La única superviviente de las ~80 mezquitas otomanas de Belgrado (s. XVII). Se contempla desde fuera con respeto; sigue en culto." },
        { n: "Calle Jevremova", coords: [44.8195, 20.46], txt: "La calle más señorial del viejo Dorćol: palacetes, la casa de Mika Alas (el matemático pescador) y silencio de barrio." },
        { n: "Museo de Vuk y Dositej", coords: [44.8196, 20.4585], txt: "Casa otomana del XVIII donde nació la lengua serbia moderna. 30 min si abre." },
        { n: "Cara Dušana", coords: [44.8215, 20.463], txt: "El eje popular: panaderías, ćevapi en Walter si el hambre aprieta, vida de barrio de verdad." },
        { n: "Dorćol Platz", coords: [44.8225, 20.466], txt: "Patio industrial reconvertido en espacio cultural: mercadillos, conciertos, cerveza. Mirad qué hay esa tarde." },
        { n: "Kej del Danubio", coords: [44.827, 20.462], txt: "Bajada al río: paseo fluvial con barcazas-bar tranquilas. El Danubio aquí ya es enorme." },
        { n: "Torre Nebojša", coords: [44.827, 20.448], txt: "Remate en el torreón-prisión otomano al pie de la fortaleza. Desde aquí se sube a Kalemegdan en 10 min si queda cuerda." },
      ],
    },
    {
      id: "paseo-novibeograd", nombre: "Hormigón y utopía", dur: "3 h", dist: "≈4 km + tranvía de vuelta", cuando: "Mañana o tarde; evitad el mediodía en julio (poca sombra)",
      resumen: "Novi Beograd: la ciudad socialista construida de cero sobre el barro. Bloques heroicos, el museo más bello de Yugoslavia y una escala que no existe en Europa occidental.",
      paradas: [
        { n: "Puente Branko (a pie)", coords: [44.8155, 20.45], txt: "Cruzad el Sava andando: la vista de Kalemegdan a la izquierda y del skyline nuevo a la derecha es el prólogo perfecto." },
        { n: "Parque Ušće", coords: [44.8205, 20.439], txt: "El gran parque de la confluencia. A la derecha, la torre Ušće (antigua sede del Partido, bombardeada en el 99 y reconstruida como oficinas)." },
        { n: "MoCAB", coords: [44.818, 20.443], txt: "El Museo de Arte Contemporáneo, joya modernista de 1965 entre árboles. Cierra martes. Aunque no entréis, rodeadlo." },
        { n: "Punta de la confluencia", coords: [44.8265, 20.435], txt: "El punto exacto donde el Sava muere en el Danubio, mirando a Kalemegdan desde abajo. Pocos turistas llegan aquí." },
        { n: "Palata Srbija", coords: [44.82, 20.418], txt: "El palacio federal gigante de la Yugoslavia no alineada (1959): 5.500 habitaciones de mármol para recibir a Nasser y Nehru. Exterior monumental." },
        { n: "Blokovi 21–23", coords: [44.813, 20.402], txt: "Los bloques residenciales brutalistas más fotogénicos. No es un decorado: aquí viven 30.000 personas. Tranvía 7/9/11 de vuelta al centro (gratis)." },
      ],
    },
    {
      id: "paseo-zemun", nombre: "Zemun, el otro imperio", dur: "3–4 h", dist: "≈3 km", cuando: "Mañana de mercado o tarde con remate al atardecer en Gardoš",
      resumen: "Hasta 1918, la frontera austrohúngara pasaba por aquí: Zemun era otro país. Sigue pareciéndolo — casco bajo de pueblo danubiano, mercado, pescado y la torre del Milenio.",
      paradas: [
        { n: "Mercado de Zemun", coords: [44.8446, 20.4116], txt: "Bus 83 desde Zeleni Venac (gratis, ~30 min). Empezar en el mercado: quesos, kajmak, fruta de Vojvodina. Domingo temprano, buvljak (rastro) al lado." },
        { n: "Glavna ulica", coords: [44.844, 20.41], txt: "La calle mayor austrohúngara con sus fachadas de colores desconchados. Panaderías legendarias (buscad la kremšnita, el pastel de crema)." },
        { n: "Gospodska", coords: [44.8455, 20.4085], txt: "La peatonal señorial hacia el río. Zemun presume de ser más «centroeuropea» que Belgrado, y aquí se entiende." },
        { n: "Kej del Danubio", coords: [44.848, 20.409], txt: "El paseo fluvial: pescadores, cisnes, barcazas-café. Enfrente, la Gran Isla de Guerra, reserva natural salvaje en plena capital." },
        { n: "Subida a Gardoš", coords: [44.8492, 20.406], txt: "Callejuelas empedradas de casas bajas trepando la colina. Cada esquina es una foto." },
        { n: "Torre de Gardoš", coords: [44.8497, 20.4046], txt: "La torre húngara del Milenio (1896). Subid si está abierta (~200-300 RSD): el Danubio entero a los pies." },
        { n: "Pescado en el kej", coords: [44.8475, 20.4095], txt: "Remate: riblja čorba (sopa de pescado picante) y pescado de río en cualquier terraza del kej con la puesta de sol." },
      ],
    },
    {
      id: "paseo-vracar", nombre: "Vračar burgués", dur: "2–2,5 h", dist: "≈3 km (con cuestas suaves)", cuando: "Mañana: mercado vivo + templo con luz",
      resumen: "El barrio de clase media de toda la vida: el templo colosal, el mercado más querido, la casa de Tesla y las mejores calles arboladas para el café de después.",
      paradas: [
        { n: "Slavija", coords: [44.8028, 20.466], txt: "La rotonda-caos con la fuente musical (sí, canta). Desde casa: 10 min andando. Solo hay que cruzarla, no amarla." },
        { n: "Templo de San Sava", coords: [44.7981, 20.4689], txt: "El coloso ortodoxo, visible desde media Serbia. El interior de mosaico dorado (terminado en 2020) deja mudo. Gratis; hombros cubiertos." },
        { n: "Mercado Kalenić", coords: [44.7998, 20.477], txt: "El mercado más bonito de Belgrado: abuelas de Šumadija, kajmak casero, frambuesas de julio. Mejor antes de las 13:00." },
        { n: "Museo Nikola Tesla", coords: [44.8048, 20.4707], txt: "Krunska 51: las cenizas, las bobinas y las demos en directo. Efectivo. Visita guiada en inglés a horas fijas — mirad la ficha." },
        { n: "Njegoševa y alrededores", coords: [44.802, 20.47], txt: "Remate de café de especialidad o limunada en las calles arboladas entre Njegoševa y Molerova. Vračar es esto." },
      ],
    },
    {
      id: "paseo-novisad", nombre: "Novi Sad en un día", dur: "Día completo (tren 36 min)", dist: "≈5 km andando allí", cuando: "Cualquier día; el Soko de las 8-9h da la mañana entera",
      resumen: "La excursión redonda: capital de Vojvodina, elegante y llana, con la fortaleza de Petrovaradin al otro lado del Danubio. Cero coche, cero bus: tren rápido y pies.",
      paradas: [
        { n: "Beograd Centar → Novi Sad", coords: [44.7959, 20.4519], txt: "Soko de Srbija Voz (36 min, ≈603 RSD, asiento reservado). Comprad ida y vuelta en la app la víspera." },
        { n: "Estación → centro", coords: [45.2671, 19.8335], txt: "Del andén al centro: bus urbano o 25 min andando por el Bulevar oslobođenja. Novi Sad es plana como Vojvodina entera." },
        { n: "Trg Slobode", coords: [45.2551, 19.8447], txt: "La plaza de la Libertad: ayuntamiento neorrenacentista y la catedral católica del Nombre de María. Aquí se ve que esto fue Hungría." },
        { n: "Zmaj Jovina y Dunavska", coords: [45.2554, 19.8452], txt: "Las dos calles doradas del centro: terrazas, heladerías, el palacio del obispo al fondo. Comed aquí o aguantad hasta Petrovaradin." },
        { n: "Puente Varadin", coords: [45.253, 19.85], txt: "Cruzad el Danubio a pie. A la izquierda, la playa Štrand (si apetece baño en julio, es LA playa fluvial de Serbia)." },
        { n: "Fortaleza de Petrovaradin", coords: [45.2519, 19.8615], txt: "El «Gibraltar del Danubio»: subid a los bastiones, buscad el reloj con las agujas cambiadas (la grande marca las horas, para verla desde el río) y quedaos un rato. Vistas inolvidables." },
        { n: "Vuelta (o Sremski Karlovci)", coords: [45.2671, 19.8335], txt: "Trenes de vuelta hasta la noche. Con energía extra: taxi o regional a Sremski Karlovci (15 min) para bermet y barroco, y vuelta a Belgrado desde allí." },
      ],
    },
  ],

  /* ---------- GLOSARIO GASTRONÓMICO ---------- */
  glosario: [
    { t: "Burek · бурек", d: "Hojaldre en espiral relleno (queso «sa sirom», carne «sa mesom», espinacas). Desayuno nacional; se acompaña de yogur líquido." },
    { t: "Pljeskavica · пљескавица", d: "La «hamburguesa» balcánica a la brasa, en pan somun. La versión punjena va rellena de queso y jamón." },
    { t: "Ćevapi · ћевапи", d: "Rollitos de carne picada a la brasa, por 5 o 10, con cebolla cruda y somun. Los de estilo sarajevés son canon." },
    { t: "Kajmak · кајмак", d: "Crema láctea entre nata y queso, ligeramente fermentada. Pedidla SIEMPRE sobre la pljeskavica. Cambia la vida." },
    { t: "Ajvar · ајвар", d: "Pasta de pimiento rojo asado (a veces con berenjena). En septiembre es religión; en julio, de bote pero rica." },
    { t: "Sarma · сарма", d: "Rollitos de col fermentada rellenos de carne y arroz, cocidos lento. Plato de kafana con alma de abuela." },
    { t: "Karađorđeva šnicla", d: "Escalope enrollado relleno de kajmak, empanado y frito. Bautizado como el líder del primer levantamiento serbio. Contundencia máxima." },
    { t: "Gibanica · гибаница", d: "Pastel de capas de masa filo con queso y huevo. En cualquier pekara; caliente es otra cosa." },
    { t: "Prebranac · пребранац", d: "Alubias blancas al horno con mucha cebolla. El plato humilde que borda cualquier kafana. Apto vegetarianos." },
    { t: "Punjena paprika", d: "Pimientos rellenos de carne y arroz en salsa de tomate. Comida de casa que sale en los menús del día (dnevni meni)." },
    { t: "Pasulj · пасуљ", d: "Potaje de alubias, normalmente con ahumados. El «cocido» serbio. En julio quizá no, pero sabedlo." },
    { t: "Riblja čorba", d: "Sopa de pescado de río, rojiza y con picante suave. Pedidla en el kej de Zemun mirando al Danubio." },
    { t: "Šopska salata", d: "Tomate, pepino, cebolla y una nevada de queso blanco rallado por encima. La ensalada de cabecera con todo grill." },
    { t: "Urnebes · урнебес", d: "«Caos» literal: crema picante de queso y pimiento. Untad en somun mientras llega la carne." },
    { t: "Palačinke · палачинке", d: "Crepes, dulces (eurokrem, plazma, nueces) o saladas. Merienda-cena nacional; hay palačinkarnice por todas partes." },
    { t: "Moskva šnit", d: "El pastel del Hotel Moskva (1974): almendra, guindas y nata. Se merienda en la terraza del propio hotel, con siglo y cuarto de historia alrededor." },
    { t: "Rakija · ракија", d: "El aguardiente. Šljivovica (ciruela) es la clásica; dunja (membrillo) y kajsija (albaricoque) las amables. Chupito lento, nunca de golpe, con «živeli!»." },
    { t: "Bermet · бермет", d: "Vino dulce especiado de Sremski Karlovci que viajaba en la carta del Titanic. Souvenir líquido perfecto." },
    { t: "Domaća kafa", d: "Café «doméstico» al estilo turco: molido fino, cocido en džezva, con posos. Se espera, se bebe despacio, no se remueve el fondo." },
    { t: "Cerveza local", d: "Industriales: Jelen y Lav (de grifo, baratísimas). Craft serbia que merece caza: Kabinet, Dogma, Salto — en Samo Pivo tienen media carta." },
  ],

  /* ---------- BARRIOS ---------- */
  barrios: [
    {
      id: "savski-venac", nombre: "Savski Venac · Savamala", tag: "Vuestra base",
      coords: [44.8050, 20.4560],
      desc: "Vuestro barrio no sale en las postales, y eso es una ventaja: aquí Belgrado hace su vida sin actuar para nadie. Es la ciudad ferroviaria y administrativa de hace un siglo —la estación que recibía al Orient Express, los ministerios, el Palacio de Justicia— conviviendo con el megaproyecto más polémico del país, el Waterfront, que le crece enfrente. Entre ambos, Savamala: el viejo barrio del puerto que fue capital alternativa y de murales antes de que llegaran las grúas.",
      hacer: "Pasear la Sava Promenada al anochecer (vuestro «paseo de después de cenar»), pararse ante la ruina del Generalštab en Kneza Miloša, buscar los murales que quedan en Savamala, y usar Galerija para lo prosaico: súper, cine con aire, cajero decente.",
      parada: "El burek de Trpković a cinco minutos de casa — la cola de las 8:00 es el mejor espectáculo gratuito del barrio.",
      dato: "En la antigua estación de Savski trg paraba el Orient Express camino de Estambul. Hoy la plaza la preside un Stefan Nemanja de 23 metros que los belgradenses discutieron durante meses. Ganó la costumbre.",
      cerca: "Sava Promenada y Belgrade Waterfront (10-15 min a pie), Savamala vieja, Casa de Manak, Galerija.",
      comoLlegar: "Estáis en él. Todo el casco viejo queda a 20–30 min a pie o un bus corto (gratis).",
      fiab: "ok"
    },
    {
      id: "stari-grad", nombre: "Stari Grad · Knez Mihailova", tag: "El centro",
      coords: [44.8163, 20.4602],
      desc: "El salón de la ciudad. Knez Mihailova es una de las peatonales más antiguas de Europa del Este y lo tiene todo a la vez: palacetes académicos, librerías centenarias, franquicias, músicos callejeros y medio Belgrado paseando arriba y abajo porque pasear aquí es un deporte local con siglo y medio de historia. En la plaza de la República, el caballo del príncipe Mihailo es EL punto de encuentro nacional: «kod konja» — «donde el caballo».",
      hacer: "Recorrerla entera sin prisa de plaza a parque (20 min si no picáis en nada; una hora si sois humanos), entrar al Museo Nacional, desviarse dos calles a la Kinoteka, y rematar en Kalemegdan, que espera al final como un premio.",
      parada: "La terraza del Hotel Moskva con una Moskva šnit: merienda de 1908, precios de 2026 pero razonables.",
      dato: "Bajo vuestros pies hay una ciudad romana: Singidunum asoma en cada obra de metro que empiezan y no acaban. Los escaparates cambian; la calle lleva 150 años siendo la misma pasarela.",
      cerca: "Kalemegdan al final de la calle, Kosančićev venac bajando hacia el Sava, Kinoteka.",
      comoLlegar: "≈25 min a pie desde Risanska, o cualquier bus hacia Zeleni Venac (gratis).",
      fiab: "ok"
    },
    {
      id: "kosancicev", nombre: "Kosančićev venac", tag: "El rincón bonito",
      coords: [44.8155, 20.4530],
      desc: "Si Belgrado tuviera que enseñar una sola esquina para enamorar, sería esta: la colina de adoquines sobre el Sava donde nació la ciudad serbia moderna. Casas bajas del XIX, la Catedral ortodoxa con su torre barroca, el Patriarcado, faroles, silencio — y de pronto, un solar vacío con una placa: aquí ardió la Biblioteca Nacional el 6 de abril de 1941, con 350.000 libros y manuscritos medievales dentro, el primer día del bombardeo nazi. El barrio entero es belleza con memoria.",
      hacer: "Subir desde Savamala al atardecer, asomarse al mirador sobre el río, visitar la Residencia de la Princesa Ljubica (cierra lunes) y sentarse donde llevan sentándose belgradenses desde 1823.",
      parada: "La kafana «?» (Znak pitanja), frente a la Catedral: la más antigua de la ciudad, comida serbia honesta bajo un techo otomano. Turística, sí; impostada, no.",
      dato: "El solar de la Biblioteca sigue vacío a propósito. Hay ciudades que construyen encima de sus heridas; esta prefirió dejarla a la vista.",
      cerca: "Catedral, Patriarcado, Residencia de Ljubica, y Kalemegdan a cinco minutos.",
      comoLlegar: "A pie: subida desde Savamala (cuestas, pero cortas).",
      fiab: "ok"
    },
    {
      id: "dorcol", nombre: "Dorćol", tag: "Para callejear",
      coords: [44.8215, 20.4620],
      desc: "El nombre lo dice todo: «dört yol», cuatro caminos en turco, el cruce donde durante siglos se mezclaron serbios, turcos, judíos sefardíes y austríacos. Hoy es el barrio con mejor pulso de la ciudad: señoras regando geranios sobre bares de vinos naturales, la única mezquita superviviente a la vuelta de un tostadero de specialty coffee, palacetes cansados y patios que de noche se encienden. Es el Belgrado que los belgradenses jóvenes eligen para vivir.",
      hacer: "Perderse sin mapa entre Jevremova y Cara Dušana (el paseo «Dorćol profundo» de esta guía ordena ese caos si lo preferís), respetar la Bajrakli desde la acera, curiosear Dorćol Platz y bajar hasta el Danubio cuando el barrio se acabe.",
      parada: "Café en Pržionica D59 y, si el hambre es seria, los ćevapi de Walter — institución del barrio con colas de fe.",
      dato: "La calle Jevremova era el corazón del Belgrado sefardí: aquí se habló judeoespañol —ladino, el castellano del siglo XV— hasta la Segunda Guerra Mundial. Escuchad los nombres de las placas.",
      cerca: "Museo Etnográfico, Vuk y Dositej, Ciencia y Tecnología, Dorćol Platz, el kej del Danubio.",
      comoLlegar: "A pie desde el centro; desde casa ≈35 min o bus a Studentski trg.",
      fiab: "ok"
    },
    {
      id: "skadarlija", nombre: "Skadarlija · Cetinjska", tag: "Bohemia + noche",
      coords: [44.8172, 20.4653],
      desc: "Una sola calle empedrada y en cuesta que fue el Montmartre balcánico: aquí vivieron y bebieron los poetas y actores del Belgrado de 1900 —Đura Jakšić murió en su casa, hoy museo— y las kafanas conservan los nombres de entonces: Tri šešira (Tres Sombreros), Dva jelena (Dos Ciervos). ¿Es turística? Completamente. ¿Es falsa? Para nada: las orquestas tocan de verdad, la comida es seria y los serbios también vienen a emocionarse con las canciones viejas. Y justo detrás, la jugada maestra: Cetinjska 15, la antigua fábrica de cerveza tomada por los bares de la generación siguiente.",
      hacer: "Reservar una noche para el ritual completo: cena con orquesta en Skadarlija (pedid una canción, se dejan 200-500 RSD en la funda del violín) y después cruzar la trasera a Cetinjska para el contraste generacional en veinte pasos.",
      parada: "Tri šešira si buscáis el clásico; Samo Pivo en Cetinjska si la sed es de grifos.",
      dato: "El truco de local: en Skadarlija se cena; en Cetinjska se sigue. Los dos mundos se dan la espalda y comparten manzana, y esa esquizofrenia ES Belgrado.",
      cerca: "Bajbokana, Dva jelena y Tri šešira; Samo Pivo, Polet, Zaokret en Cetinjska.",
      comoLlegar: "≈30 min a pie desde casa o bus al centro + 10 min.",
      fiab: "ok"
    },
    {
      id: "vracar", nombre: "Vračar · Slavija", tag: "Residencial agradable",
      coords: [44.8000, 20.4720],
      desc: "El barrio donde a los belgradenses les gustaría vivir: calles arboladas, fachadas burguesas de entreguerras, el mercado más querido y una densidad de buenos cafés que compite con Dorćol. Todo orbita alrededor del coloso: el templo de San Sava, levantado justo donde los otomanos quemaron las reliquias del santo en 1595 — la venganza arquitectónica más paciente de Europa, cuatro siglos después y con la cúpula de mosaico dorado más grande del mundo ortodoxo moderno.",
      hacer: "Entrar a San Sava dos veces (de día por el mosaico, al atardecer por la luz), comprar fruta en Kalenić antes de las 13:00, peregrinar al museo Tesla y dejarse caer por las terrazas de Njegoševa.",
      parada: "Cualquier café de especialidad entre Njegoševa y Molerova; el barrio inventó la sobremesa de dos horas con un solo cortado.",
      dato: "Vračar significa «brujo» — la colina de los adivinos medievales. Hoy los únicos oráculos son los fruteros de Kalenić, y aciertan más.",
      cerca: "San Sava, Tesla, Kalenić, cafeterías de especialidad.",
      comoLlegar: "A pie a Slavija (10 min) y desde ahí llano-suave; o trolebús desde Slavija.",
      fiab: "ok"
    },
    {
      id: "novi-beograd", nombre: "Novi Beograd · Ušće", tag: "La otra escala",
      coords: [44.8130, 20.4310],
      desc: "En 1948, donde solo había pantano, Yugoslavia decidió construir su ciudad del futuro: brigadas de jóvenes voluntarios drenaron el barro y levantaron una capital nueva de bloques heroicos, avenidas de ocho carriles y hormigón con ambición de eternidad. Hoy viven aquí 200.000 personas y el brutalismo yugoslavo que el MoMA expuso en Nueva York se ve gratis desde el tranvía. No es «bonito»: es sobrecogedor, que dura más.",
      hacer: "Cruzar el puente Branko a pie (el ritual de entrada), pasear el parque Ušće hasta la punta de la confluencia, entrar al MoCAB si no es martes, y fotografiar los blokovi sabiendo que dentro hay vida de barrio de lo más normal.",
      parada: "Los cafés del parque Ušće o un chiringuito del kej: cerveza mirando la fortaleza desde el lado que casi ningún turista pisa.",
      dato: "La torre Genex —la «Puerta del Oeste» que visteis al llegar del aeropuerto— tiene un restaurante giratorio en la cima que casi nunca giró. Como metáfora de Yugoslavia funciona dolorosamente bien.",
      cerca: "MoCAB, Palata Srbija, Sava Centar, torre Genex (desde fuera).",
      comoLlegar: "Cruzar el puente Branko a pie hasta Ušće, o cualquier bus que cruce el Sava (gratis).",
      fiab: "ok"
    },
    {
      id: "zemun", nombre: "Zemun · Gardoš", tag: "Excursión urbana",
      coords: [44.8455, 20.4110],
      desc: "Durante dos siglos, el río que veis desde Gardoš fue la frontera entre dos mundos: enfrente, el Belgrado otomano; aquí, el último pueblo del Imperio austrohúngaro, con sus campanarios católicos, su cuartel de cuarentena y sus espías de ambos bandos. Zemun no se unió a Belgrado hasta 1934 y todavía no se ha enterado del todo: tiene su propio casco viejo, su propio mercado, su propio orgullo y pescadores que saludan como en un pueblo del Danubio, porque eso es exactamente lo que es.",
      hacer: "Bus 83 y el circuito clásico: mercado, la calle Glavna con sus fachadas desconchadas de colores, subida por las callejuelas empedradas a la torre de Gardoš, y bajada al kej para la sopa de pescado. Si es domingo temprano, el buvljak (rastro) es un viaje en el tiempo.",
      parada: "Riblja čorba (sopa de pescado picante) en cualquier terraza del kej con el Danubio a dos metros. De postre, krempita de panadería vieja: el pastel de crema herencia del imperio.",
      dato: "La torre de Gardoš la construyó Hungría en 1896 para celebrar sus mil años de reino... en su frontera más lejana. Veintidós años después el imperio no existía. La torre sigue ahí, encantada de conocerse.",
      cerca: "Paseo fluvial (kej), restaurantes de pescado, mercadillo dominical (buvljak) temprano, la Gran Isla de Guerra enfrente.",
      comoLlegar: "Bus 83/78 desde Zeleni Venac (gratis), 25–35 min. Combinable con Novi Beograd.",
      fiab: "ok"
    },
    {
      id: "dedinje", nombre: "Dedinje · Topčider", tag: "Poder y memoria",
      coords: [44.7830, 20.4520],
      desc: "La colina donde vive el poder desde hace dos siglos, sea cual sea el poder: los príncipes Obrenović plantaron su palacete en Topčider, los reyes Karađorđević construyeron sus palacios, Tito eligió la misma ladera para su residencia —y para su tumba, entre las flores de su invernadero—, y hoy la comparten embajadas, futbolistas y políticos. Verde, silenciosa y llena de historia incómoda: el barrio donde Serbia guarda lo que no sabe si celebrar o enterrar.",
      hacer: "El Museo de Yugoslavia y la Casa de las Flores piden dos horas largas y las devuelven con intereses. Después, el parque Topčider para digerirlo bajo los plátanos más viejos de la ciudad. Los del fútbol: el Marakana del Estrella Roja está en la falda de la colina.",
      parada: "El café del parque Topčider, junto al palacete de Miloš: donde meriendan las familias del barrio desde hace generaciones.",
      dato: "En la Casa de las Flores no hay guardia de honor ni mármol soviético: Tito está enterrado en su jardín de invierno, entre plantas. Lo visitaron cien jefes de Estado; hoy lo visitan nostálgicos de un país que ya no existe y curiosos como vosotros.",
      cerca: "Museo de Yugoslavia, Casa de las Flores, Topčider, Arte Africano.",
      comoLlegar: "Trolebús 40/41 desde el centro (gratis), ≈20 min.",
      fiab: "ok"
    },
    {
      id: "ada", nombre: "Ada Ciganlija", tag: "La playa de Belgrado",
      coords: [44.7906, 20.4051],
      desc: "«El mar de Belgrado», y lo dicen sin ironía: una isla del Sava convertida en lago de siete kilómetros de playas, con bandera azul, agua sorprendentemente limpia y la infraestructura de una ciudad costera entera — chiringuitos, alquiler de kayaks, wakeboard con cable, canchas de todo. En julio es donde está la mitad de la ciudad, y la otra mitad está llegando. No es un plan de relleno: es antropología serbia en bañador.",
      hacer: "Baño de mediodía cuando el asfalto queme, vuelta a la isla en bici alquilada (una hora tranquila), y caña al atardecer en un café-playa viendo el desfile de remeros, abuelos nadadores y adolescentes eternos.",
      parada: "Cualquier chiringuito de la orilla norte; se paga la cerveza, no la tumbona del árbol de al lado.",
      dato: "Ada fue prisión, astillero y coto de caza real antes que playa. La palabra «ciganlija» probablemente viene del celta y no de los gitanos, pero la etimología perdió contra la leyenda hace décadas.",
      cerca: "Alquiler de bicis, kayak, y decenas de cafés-playa.",
      comoLlegar: "Buses hacia Ada desde el centro (gratis); en taxi ≈10 min desde casa.",
      fiab: "ok"
    },
  ],

  /* ---------- COMER Y BEBER (con testimonios) ---------- */
  comer: {
    intro: "En Serbia no se come: se insiste. Las raciones dan para dos, el pan llega sin pedirlo y a la tercera visita el camarero ya os trata de sobrinos. Esta guía está construida sobre lo que repiten viajeros independientes y locales — Reddit, blogs personales, Spotted by Locals —, no sobre listas de agencia. Precios de referencia (jul. 2026): burek 150–300 RSD, pljeskavica 350–600, menú de kafana 1.200–2.500 por cabeza con bebida, café 150–250.",
    bloques: [
      {
        titulo: "Desayuno: pekara + yogur",
        texto: "El desayuno serbio es de panadería: burek (hojaldre relleno de queso, carne o espinacas) con yogur líquido. Se pide en mostrador, se paga en efectivo casi siempre, y a las 8:00 ya hay cola de gente yendo a trabajar.",
        sitios: [
          { nombre: "Pekara Trpković", zona: "Nemanjina (≈5 min de casa)", coords: [44.8027, 20.4638], nota: "La panadería más famosa de la ciudad, con colas que dan la vuelta a la esquina. Y os pilla de camino a todo.", testimonio: { cita: "Trpković se ha convertido en la meca del burek; las colas constantes lo dicen todo.", fuente: "Beyond Belgrade (guía local), 2026" }, fiab: "ok" },
          { nombre: "Pekara Čeda", zona: "Vračar", coords: [44.7995, 20.4700], nota: "El clásico de barrio que los locales citan cuando quieren llevar la contraria a Trpković.", testimonio: { cita: "Una joya escondida: el burek de carne repartida uniformemente, el de queso cremoso de verdad.", fuente: "Beyond Belgrade, 2026" }, fiab: "sug" },
        ]
      },
      {
        titulo: "Grill: pljeskavica y ćevapi",
        texto: "La comida nacional es la parrilla. Pljeskavica = hamburguesa balcánica en pan somun, mejor con kajmak (crema láctea). Ćevapi = rollitos de carne a la brasa. Ración enorme, precio pequeño.",
        sitios: [
          { nombre: "Walter", zona: "Dorćol (Cara Dušana)", coords: [44.8225, 20.4630], nota: "Ćevapi estilo Sarajevo. Institución.", testimonio: { cita: "Porciones generosas, carne jugosa a la perfección con su pan somun recién hecho.", fuente: "Guía local Now in Belgrade, 2026" }, fiab: "ok" },
          { nombre: "Pljeskavica Kod Milana", zona: "Vračar", coords: [44.7960, 20.4750], nota: "Pequeño, sin pretensiones, con fama desproporcionada.", testimonio: { cita: "La mayoría de los locales coinciden: Mile es el rey absoluto de la pljeskavica.", fuente: "Spotted by Locals Belgrado", }, fiab: "sug" },
          { nombre: "Ćirino Drvce", zona: "Centro", coords: [44.8140, 20.4620], nota: "Puesto callejero con cola permanente.", testimonio: { cita: "A pesar de la cola constante, la espera merece la pena por ese sabor ahumado.", fuente: "Now in Belgrade, 2026" }, fiab: "sug" },
        ]
      },
      {
        titulo: "Kafanas: la institución",
        texto: "La kafana es taberna, salón social y patrimonio emocional serbio: manteles de cuadros, raciones contundentes, rakija y a veces música en vivo. En Skadarlija son bonitas y turísticas; las de barrio son más baratas y verdaderas.",
        sitios: [
          { nombre: "Znak pitanja «?»", zona: "Frente a la Catedral", coords: [44.8152, 20.4535], nota: "La kafana más antigua (1823), en casa otomana. Turística pero legítima: comida serbia de verdad.", fiab: "ok" },
          { nombre: "Tri šešira", zona: "Skadarlija", coords: [44.8175, 20.4650], nota: "El clásico de la calle bohemia, con orquesta. Para vivir el cliché una noche, sabiendo lo que es.", fiab: "sug" },
          { nombre: "Kafana de barrio en Vračar/Dorćol", zona: "—", nota: "El consejo repetido en Reddit: entrar en cualquier kafana llena de locales, sin carta en inglés. Ahí está el país.", testimonio: { cita: "Salta Skadarlija para comer: ve donde no haya carta en inglés y pide lo que tenga la mesa de al lado.", fuente: "Hilo r/serbia (parafraseado), 2025" }, fiab: "sug" },
        ]
      },
      {
        titulo: "El ritual de la kafana, explicado",
        texto: "Para que la primera vez no sea a ciegas: se empieza con meze —kajmak, proja, urnebes, algo de pan— y una rakija de apertura (la šljivovica es la canónica; la dunja, más amable para empezar). Después llega la parrilla o el plato de cuchara, con ensalada šopska de guarnición y vino o cerveza. Nadie os traerá la cuenta hasta que la pidáis: la sobremesa es sagrada y «račun, molim» es la única llave. Dos trucos de oro: el «dnevni meni» (menú del día laborable) baja la cuenta a la mitad en muchos sitios, y si hay orquesta, pedir una canción con 200-500 RSD en la funda del violín es costumbre, no cursilada.",
        sitios: []
      },
      {
        titulo: "Sentarse de verdad: restaurantes",
        texto: "Para las noches de mantel y sin prisa — la gama alta belgradense cuesta lo que una pizzería madrileña. Reservar por Instagram o teléfono funciona en todos.",
        sitios: [
          { nombre: "Manufaktura", zona: "Kralja Petra (centro)", coords: [44.8178, 20.4565], nota: "El túnel de paraguas rojos más fotografiado de Serbia esconde cocina serbia moderna hecha en serio: producto local, carta que explica de dónde viene todo. 2.000-3.500 RSD/persona.", testimonio: { cita: "Es donde llevo a todo el que me visita: serbio de verdad pero sin manteles de cuadros ni folclore forzado.", fuente: "Síntesis de recomendaciones locales en Reddit, 2025-26" }, fiab: "sug" },
          { nombre: "Ambar", zona: "Beton hala, junto al río", coords: [44.8155, 20.4485], nota: "Cocina balcánica contemporánea en la hilera de restaurantes del muelle: pequeños platos para compartir y la terraza mirando al agua. El sitio para la cena «de celebración». 3.000-4.500 RSD/persona.", fiab: "sug" },
          { nombre: "Radost Fina Kuhinjica", zona: "Cerca del Sava", coords: [44.8110, 20.4560], nota: "El vegetariano querido de la ciudad, casero y con alma — un respiro si la parrilla os pide tregua a mitad de semana.", fiab: "sug" },
        ]
      },
      {
        titulo: "Dulces y cafés de especialidad",
        texto: "Belgrado meriende fuerte: palačinke (crepes), tartas de hotel con historia y una escena de café de especialidad sorprendentemente buena y barata (flat white 250–350 RSD).",
        sitios: [
          { nombre: "Hotel Moskva", zona: "Terazije", coords: [44.8135, 20.4605], nota: "El café del hotel Secesión de 1908: la tarta Moskva šnit (almendra, guindas, nata) en la terraza donde merendó medio siglo XX balcánico.", fiab: "ok" },
          { nombre: "Kafeterija (Kralja Petra)", zona: "Stari Grad", coords: [44.8180, 20.4570], nota: "La casa madre del specialty coffee serbio, en un patio precioso del casco viejo.", testimonio: { cita: "El mejor flat white de los Balcanes está escondido en un patio de Kralja Petra.", fuente: "Síntesis de reseñas de viajeros, 2025-26" }, fiab: "sug" },
          { nombre: "Pržionica D59 by Zaokret", zona: "Dorćol", coords: [44.8225, 20.4655], nota: "Tostadero de barrio con bancos al sol; parada natural del paseo de Dorćol.", fiab: "sug" },
        ]
      },
      {
        titulo: "Mercados",
        texto: "Los mercados (pijaca) funcionan a diario ~06:00–19:00, mejor por la mañana. Fruta de temporada de julio: sandía, melocotón, frambuesa. Kalenić (Vračar) es el grande y bonito; Zeleni Venac el céntrico; Zemun el de ambiente de pueblo.",
        sitios: [
          { nombre: "Kalenić pijaca", zona: "Vračar", coords: [44.7998, 20.4770], nota: "El mercado más querido de la ciudad. Combinable con San Sava y café en Vračar.", fiab: "ok" },
          { nombre: "Zeleni Venac", zona: "Centro", coords: [44.8137, 20.4562], nota: "El nudo de buses con mercado histórico encima. De paso a todas partes.", fiab: "ok" },
        ]
      },
    ]
  },

  /* ---------- LA NOCHE (cervezas, no discotecas) ---------- */
  noche: {
    intro: "Vuestro plan favorito —cervezas nocturnas y conversación larga— tiene aquí su capital europea no oficial. En julio Belgrado vive de noche: las terrazas se llenan cuando cae el calor y nadie, jamás, os pedirá la mesa. Cerveza artesana a 250–600 RSD, craft serbio serio (Kabinet, Dogma, Salto) y cero prisa institucional. Las discotecas y los splavovi de fiesta existen, pero son otro deporte; el vuestro se juega en patios.",
    zonas: [
      {
        nombre: "Cetinjska 15", cuando: "De 20:00 a muy tarde", coords: [44.8180, 20.4660],
        desc: "Antigua fábrica de cerveza convertida en patio de bares alternativos: en un solo complejo puedes saltar entre 6–8 locales distintos. El epicentro de la noche cervecera.",
        testimonio: { cita: "Samo Pivo es el bar de craft más recomendado en todos los hilos de Reddit sobre Belgrado: 20+ grifos rotando lo mejor serbio e internacional.", fuente: "Síntesis de hilos r/beer y r/serbia, 2025-26" },
        sitios: ["Samo Pivo (craft, 20+ grifos)", "Polet", "Bluz i pivo (blues en vivo)", "Zaokret"]
      },
      {
        nombre: "Dorćol", cuando: "Tarde-noche", coords: [44.8215, 20.4620],
        desc: "Bares con más diseño, vinos naturales, brewpubs y cócteles. Más tranquilo que Cetinjska, perfecto para empezar la noche cenando y beber sin ruido.",
        sitios: ["Dorćol Platz (patio cultural)", "Cervecerías y bares de Cara Dušana y alrededores"]
      },
      {
        nombre: "Skadarlija", cuando: "Cena + primera copa", coords: [44.8172, 20.4653],
        desc: "Para una noche: cena en kafana con orquesta y rakija. Turístico y encantador a partes iguales; después, Cetinjska está literalmente detrás.",
        sitios: ["Tri šešira", "Dva jelena"]
      },
      {
        nombre: "Savamala y el río", cuando: "Atardecer", coords: [44.8065, 20.4520],
        desc: "Vuestro barrio: la Sava Promenada tiene terrazas nuevas y cómodas (más caras, más internacionales) con la puesta de sol sobre el río. Los splavovi (barcazas) van del bar tranquilo al turbofolk a las 4 a.m. — mirar antes cuál es cuál.",
        testimonio: { cita: "Los splavovi son clubes flotantes en el Sava y el Danubio: abiertos de mayo a septiembre, ruidosos y hasta las 5. Los de Zemun kej son la versión tranquila para una cerveza al fresco.", fuente: "Guías locales + Reddit, 2026" },
        sitios: ["Terrazas de Sava Promenada", "Barcazas-bar del kej de Zemun (tranquilas)"]
      },
    ]
  },

  /* ---------- ALREDEDORES ---------- */
  alrededores: [
    {
      id: "novi-sad", nombre: "Novi Sad", dist: "36 min en tren Soko", coords: [45.2551, 19.8452],
      nivel: "La excursión clara — casi obligada",
      como: "Tren rápido Soko desde Beograd Centar (Prokop): 36 min, ≈603 RSD por trayecto en 2ª clase. Salidas frecuentes (aprox. cada 30–60 min). Comprar en la app/web de Srbija Voz (5% descuento) o en la estación. Reserva de asiento obligatoria.",
      que: "Capital de Vojvodina, elegante y austrohúngara: centro peatonal (Zmaj Jovina, plaza de la Libertad, catedral católica), y cruzando el Danubio la fortaleza de Petrovaradin — el «Gibraltar del Danubio» — con su reloj de torre y vistas al río. Día completo sin agobio; el centro es llano y compacto (bien para Laura: cero bus).",
      nota: "Novi Sad es también el origen de las protestas de 2024 (la marquesina de la estación). La estación nueva funciona con normalidad.",
      fiab: "ok", fuente: "seat61 + Srbija Voz + serbianmonitor · ver. 6-jul-2026"
    },
    {
      id: "sremski", nombre: "Sremski Karlovci", dist: "+15 min desde Novi Sad", coords: [45.2029, 19.9337],
      nivel: "Complemento de Novi Sad",
      como: "Tren regional o taxi corto (≈15 min) desde Novi Sad. Verificar horarios del regional en Srbija Voz para no quedar colgados a la vuelta.",
      que: "Pueblo barroco de postal: plaza con la catedral ortodoxa, el instituto más antiguo de Serbia, y bodegas familiares de bermet, el vino dulce local que viajaba en el Titanic. Dos-tres horas.",
      fiab: "ver", fuente: "Logística por confirmar en srbvoz.rs"
    },
    {
      id: "golubac", nombre: "Golubac y las Puertas de Hierro (Đerdap)", dist: "130 km, sin tren", coords: [44.6633, 21.6311],
      nivel: "Espectacular pero exigente sin coche",
      como: "No hay tren. Opciones reales: excursión organizada en grupo pequeño (día completo, se reserva online, suele incluir Lepenski Vir), o conductor privado. El bus regular existe pero son 2h30+ por trayecto con horarios incómodos — exactamente el plan que no quiere Laura.",
      que: "Fortaleza medieval de 9 torres clavada donde el Danubio se estrecha contra los Cárpatos. En julio ≈10:00–18:00, cierra lunes (verificar). Lepenski Vir (asentamiento mesolítico) cae de camino.",
      fiab: "ver", fuente: "Horarios y tours por confirmar cerca de la fecha",
      aviso: "Sugerencia honesta: solo merece la pena como excursión organizada con recogida en hotel. Si no, mejor invertir el día en Novi Sad o Zemun."
    },
    {
      id: "subotica", nombre: "Subotica y lago Palić", dist: "≈1h15 en Soko", coords: [46.1005, 19.6650],
      nivel: "Lejos para ir y volver — tiene sentido ligada al viaje a Budapest",
      como: "Tren Soko Beograd Centar → Subotica por la línea nueva (abierta oct. 2025): salidas aprox. 07:37, 10:37, 13:37, 16:37 en sentido contrario — verificar sentido ida en Srbija Voz. ≈9 € en 2ª clase.",
      que: "La ciudad más húngara de Serbia: art nouveau delirante (ayuntamiento, sinagoga restaurada), y a 8 km el lago Palić con su balneario de 1900. Medio día-día.",
      fiab: "ver", fuente: "seat61 · ver. 6-jul-2026; horarios exactos en srbvoz.rs",
      aviso: "Ver «El dilema del 30»: Subotica encaja mejor como escala hacia Budapest que como ida-y-vuelta."
    },
    {
      id: "zemun-exc", nombre: "Zemun (dentro de la ciudad)", dist: "25–35 min en bus urbano gratis", coords: [44.8455, 20.4110],
      nivel: "La excursión sin logística",
      como: "Bus 83 o 78 desde Zeleni Venac (gratis). O paseo largo por el kej del Danubio desde Ušće.",
      que: "Media jornada perfecta: subir a Gardoš, mercado, pescado o cerveza junto al Danubio. Si es domingo, el buvljak (rastro) por la mañana temprano.",
      fiab: "ok"
    },
  ],

  /* ---------- CARTAS DE BELGRADO (selladas por fecha) ---------- */
  cartas: {
    intro: "Nueve cartas, una por día. Las escribe la ciudad y cada una está sellada hasta la mañana de su fecha: no se pueden abrir antes, y esa es exactamente la gracia. (Sí, se puede engañar al reloj del móvil. También se puede abrir un regalo en noviembre. Vosotros sabréis.)",
    firma: "— Б.",
    items: [
      {
        fecha: "2026-07-22", titulo: "La del aterrizaje",
        texto: "Bienvenidos. Os vi desde arriba mientras el avión bajaba siguiendo el Danubio, aunque vosotros aún no me veíais a mí. No intentéis conquistarme esta tarde: llevo dos mil años resistiendo asedios y el vuestro no va a ser distinto por ir con maletas. Dejad las cosas en Risanska, salid sin plan y bajad hacia el río, que para eso está a diez minutos. Un paseo corto, una cerveza fría, una pljeskavica si el hambre aprieta. Yo mañana sigo aquí. Llevo siglos siguiendo aquí.\n\nUna cosa más: esta noche canta una inglesa en mi puerto. No es de las mías, pero tiene voz. Si os quedan fuerzas, ya sabéis."
      },
      {
        fecha: "2026-07-23", titulo: "La de las capas",
        texto: "Hoy empezad por donde empiezo yo: la fortaleza. Pero id andando y sin prisa, que el camino es la mitad del asunto — Savski trg, los adoquines de Kosančićev venac, la kafana que se llama pregunta. En Kalemegdan buscad el muro que mira a los ríos y entended de una vez mi geografía: todo lo que soy pasó por ese cruce de aguas.\n\nMi Museo Nacional hoy abre de doce a ocho, por si el calor aprieta a media tarde y queréis mármol fresco y pintura. Y cuando anochezca, recordad: el atardecer desde mis murallas no se cuenta. Se manda por foto a los que no vinieron, para que les duela un poco."
      },
      {
        fecha: "2026-07-24", titulo: "La de los patios",
        texto: "Viernes. Hoy os presento a mi barrio favorito, y no se lo digáis a los otros: Dorćol. Callejead sin mapa por Jevremova y Cara Dušana, mirad la única mezquita que me queda de las ochenta que tuve — tratadla con cariño, ha visto demasiado —, tomad café donde lo tuestan y dejad que el barrio haga su trabajo, que es no tener nada obligatorio.\n\nY cuando caiga el sol, Cetinjska 15. Era una fábrica de cerveza; ahora es un patio donde mi juventud discute, brinda y pone música. Empezad en el bar de los veinte grifos. El resto de la noche se organiza sola, siempre lo hace."
      },
      {
        fecha: "2026-07-25", titulo: "La del sábado",
        texto: "Sábado: día de mercados y de reyes, elegid vosotros el orden. Si madrugáis algo, Kalenić está en su mejor hora — compradle fruta a la señora más seria que encontréis, es siempre la que mejor fruta tiene — y el templo de San Sava queda a un paseo, con su bóveda de oro que no se acaba nunca.\n\nSi hoy tocaba palacio — el complejo real solo recibe los sábados, con reserva — ya lo sabíais de antes. Si no, no habéis perdido nada que no pueda esperar a otra vida. Por la noche, si el cuerpo pide río, mi Sava Promenada está a diez minutos de vuestra cama, y en verano pongo cine gratis en ella. Miradlo."
      },
      {
        fecha: "2026-07-26", titulo: "La del domingo",
        texto: "Domingo, y os hago dos regalos. El primero: mi Museo Nacional hoy es gratis — sí, gratis, entrad aunque sea media hora, que Paja Jovanović no se ve todos los días por cero dinares. El segundo es más raro: si sois capaces de madrugar, en Zemun hay un rastro dominical donde mis vecinos venden de todo desde hace décadas. No es bonito. Es verdadero, que vale más.\n\nY ya que estáis allí: quedaos. Gardoš, el kej, los cisnes, una sopa de pescado con el Danubio delante. Zemun fue de otro imperio y todavía se le nota el acento. Es mi manera de mandaros de viaje sin que salgáis de mí."
      },
      {
        fecha: "2026-07-27", titulo: "La del lunes",
        texto: "Lunes: hoy mis museos duermen, casi todos, y no pienso disculparme — hasta las ciudades necesitan cerrar por dentro un día a la semana. Pero os dejé abiertos los importantes para un lunes: el de Tesla, con sus rayos y sus cenizas, que abre cuando los demás no. Y el etnográfico, por si queréis saber cómo vestía yo antes de todo esto.\n\nO ninguno. También está Ada, mi lago de los veranos, donde mis habitantes fingen que el mar existe y casi lo consiguen. Con el calor que hace, un lunes de agua y chiringuito no es escaparse del viaje: es entenderlo. Los sellos del pasaporte pueden esperar un día."
      },
      {
        fecha: "2026-07-28", titulo: "La de la hermana pequeña",
        texto: "Hoy os presto a mi hermana pequeña, Novi Sad. Treinta y seis minutos de tren — cuando yo era joven eso era un día a caballo, no os quejéis de nada. Ella es más ordenada que yo, más austrohúngara, más de plaza con catedral de colores. No se lo tengáis en cuenta: alguien en la familia tenía que salir formal.\n\nCruzad su puente hasta Petrovaradin y buscad el reloj de la torre: la aguja grande marca las horas y la pequeña los minutos, al revés del mundo entero, para que los barcos lo leyeran de lejos. Llevo trescientos años riéndome de esa solución. Volved en el tren de la tarde y contadme si mi hermana os trató bien. Siempre lo hace."
      },
      {
        fecha: "2026-07-29", titulo: "La penúltima",
        texto: "Penúltimo día, y las penúltimas veces son las mejores: ya sin nervios de estreno y todavía sin pena de final. Hoy no os mando a ningún sitio. Hoy es el día de las deudas pequeñas: ese barrio que os quedó a medias, esa pekara a la que dijisteis «mañana volvemos», ese museo que cerró en vuestras narices el lunes. Saldadlas sin prisa.\n\nY esta noche, si os apetece algo raro, unos rusos tocan en una barcaza amarrada en mi río. O simplemente buscad el patio que más os gustó esta semana y repetid. Repetir es la forma más seria de decir que algo estuvo bien."
      },
      {
        fecha: "2026-07-30", titulo: "La última",
        texto: "Ya está. Nueve días, y os vais como se van los buenos huéspedes: sabiendo dónde está el pan y a qué hora entra la luz en la fortaleza. Hoy no os organizo nada; solo os pido el final de siempre: subid una última vez a Kalemegdan, mirad los dos ríos y no digáis nada durante un minuto. Es mi manera de firmar.\n\nCuidaos ese equipaje nuevo que no pesa: los nueve días andados juntos, las cervezas de los patios, el idioma de carteles que ya medio leéis. Los hermanos que viajan juntos se llevan algo que no vendo en ninguna tienda de recuerdos. Buen viaje a Budapest, Álvaro. Buen regreso, Laura. Aquí se os quiere. Volved."
      },
    ]
  },

  /* ---------- ESCENA: CINE Y MÚSICA ---------- */
  escena: {
    intro: "Preguntasteis por el cine y la música en directo, y Belgrado responde con generosidad: aquí no se dobla ni una película, la cinemateca es de las grandes de Europa y en julio la ciudad entera se convierte en sala de verano. Esto es lo verificado.",
    playlist: {
      nombre: "Rock y Nueva Ola Yugoslava",
      url: "https://open.spotify.com/playlist/6PCo2PsZxV0jDPzCWcr4an",
      desc: "La banda sonora del viaje, creada para vosotros y ya viva en el Spotify de Álvaro: Ekatarina Velika, Idoli, Šarlo Akrobata, Električni Orgazam, Partibrejkers, trompetas de Boban Marković… El novi talas (la nueva ola yugoslava de los 80) fue una de las escenas más brillantes de Europa, y nació en gran parte en estas calles. Para el tren a Novi Sad, para las cenas, para después.",
      consejo: "Descargadla antes de salir (Serbia está fuera del roaming UE) y dadle al modo aleatorio cruzando el puente Branko.",
    },
    bloques: [
      {
        titulo: "La regla de oro: nada doblado",
        texto: "Serbia subtitula todo el cine extranjero (solo se dobla el infantil). Cualquier estreno americano o europeo se ve en versión original con subtítulos en serbio — que, spoiler, no molestan nada. Entrada de multicine: ≈500–700 RSD, la mitad que en Madrid.",
        sitios: [
          { nombre: "Cineplexx Galerija", zona: "A 10 min de casa", coords: [44.8036, 20.4487], nota: "El multicine del centro comercial junto al río: estrenos en VO, aire acondicionado de emergencia para la siesta de las 15:00.", fiab: "ok" },
        ]
      },
      {
        titulo: "Kinoteka: el templo",
        texto: "La Cinemateca Yugoslava (1949) es una de las grandes filmotecas de Europa — Hitchcock llegó a donarle material. Ciclos temáticos que cambian cada mes, clásicos restaurados y entradas a precio de café. El programa de julio, en kinoteka.org.rs.",
        sitios: [
          { nombre: "Jugoslovenska kinoteka", zona: "Uzun Mirkova 1, junto a Kalemegdan", coords: [44.8190, 20.4565], nota: "El edificio histórico, de camino a la fortaleza. Sesión de tarde + Kalemegdan al salir = combinación perfecta.", fiab: "ok", fuente: "kinoteka.org.rs · ver. 7-jul-2026" },
        ]
      },
      {
        titulo: "Cine bajo las estrellas (gratis)",
        texto: "En julio, Belgrado proyecta gratis al aire libre. Dos pantallas verificadas — la programación exacta sale semana a semana:",
        sitios: [
          { nombre: "Admiral Open Air Cinema", zona: "Sava Promenada, junto a Galerija", coords: [44.8045, 20.4500], nota: "Viernes y sábados de verano, clásicos y taquillazos gratis EN VUESTRA CALLE. Difícil ponerlo más fácil.", fiab: "ver", fuente: "galerijabelgrade.com · ver. 7-jul-2026" },
          { nombre: "Smoki Open Air Cinema", zona: "Kalemegdan (tras el Museo de Historia Natural)", coords: [44.8225, 20.4535], nota: "Jueves a domingo a las 20:00, gratis, dentro del parque de la fortaleza. Peliculón + murallas + anochecer.", fiab: "ver", fuente: "Programación en su página; verificar semana del viaje" },
        ]
      },
      {
        titulo: "Música en directo",
        texto: "Vuestra semana ya tiene cartel (está cruzado en la Agenda, día a día). Para lo demás: Belgradist y Resident Advisor publican la programación pequeña con pocos días de antelación — mirad ya en la ciudad.",
        sitios: [
          { nombre: "Zappa Barka", zona: "Barcaza en el Sava", coords: [44.7990, 20.4430], nota: "Conciertos en una barcaza amarrada: rock, balkan, cosas raras y buenas. El 29-jul toca Nogu Svelo! aquí.", fiab: "ver" },
          { nombre: "Dorćol Platz", zona: "Dorćol", coords: [44.8225, 20.4660], nota: "El patio industrial-cultural: conciertos, mercadillos, cerveza. Programación en su Instagram.", fiab: "ver" },
          { nombre: "KC Grad", zona: "Savamala", coords: [44.8135, 20.4515], nota: "Centro cultural pionero de Savamala: exposiciones, DJ, conciertos íntimos. A 12 min de casa.", fiab: "sug" },
          { nombre: "Kafanas con música", zona: "Skadarlija", coords: [44.8172, 20.4653], nota: "La versión tradicional: orquestas de kafana tocando starogradska (música urbana vieja) entre mesas. Turístico y auténtico a la vez — pasa poco, aquí pasa.", fiab: "ok" },
        ]
      },
    ]
  },

  /* ---------- HISTORIA ---------- */
  historia: {
    intro: "Belgrado significa «ciudad blanca», pero su color verdadero es el de la ceniza de la que lleva dos mil años levantándose. Destruida y reconstruida unas cuarenta veces — no es retórica de guía turística: es su biografía documentada. Cada reconstrucción dejó una capa, y las cinco se ven paseando.",
    capas: [
      {
        epoca: "La fortaleza eterna", años: "s. I – 1867",
        texto: "Singidunum romana, plaza bizantina, otomana durante siglos con intervalos húngaros y austríacos. La frontera entre imperios pasaba literalmente por aquí: por eso Kalemegdan es un sándwich de murallas romanas, torres medievales y bastiones austríacos.",
        donde: "Kalemegdan, mezquita Bajrakli (Dorćol), Residencia de la Princesa Ljubica, kafana «?»"
      },
      {
        epoca: "El reino serbio y la Europa central", años: "1867 – 1941",
        texto: "Serbia independiente mira a Viena y París: se trazan Knez Mihailova y Terazije, se levantan palacetes académicos. Zemun, en cambio, fue Austria-Hungría hasta 1918 — por eso parece otra ciudad: lo era.",
        donde: "Knez Mihailova, Skadarlija, Zemun, los dos palacios reales de Dedinje"
      },
      {
        epoca: "Yugoslavia de Tito", años: "1945 – 1980",
        texto: "Capital de un país que ya no existe y que inventó su propia vía: socialismo no alineado entre los dos bloques. Novi Beograd se construye de cero sobre el barro — bloques, hormigón heroico y la sede de los No Alineados. Tito muere en 1980 y un millón de personas pasa ante su tumba.",
        donde: "Museo de Yugoslavia y Casa de las Flores, Novi Beograd (blokovi, Palata Srbija, torre Genex), MoCAB, Museo de Arte Africano"
      },
      {
        epoca: "Los 90 y las bombas", años: "1991 – 2000",
        texto: "Las guerras de disolución yugoslava, las sanciones, la hiperinflación (récord mundial en 1993) y el bombardeo de la OTAN en 1999: 78 días. Los edificios del Estado Mayor en la calle Nemanjina —a cinco minutos de vuestro apartamento— siguen en ruina deliberada, como memorial no declarado.",
        donde: "Ruinas del Generalštab (Nemanjina/Kneza Miloša), restos del F-117 en el Museo Militar"
      },
      {
        epoca: "El presente inquieto", años: "2000 – hoy",
        texto: "Democracia imperfecta, capital creativa barata y vibrante, y megaproyectos polémicos como Belgrade Waterfront frente a vuestra puerta. Desde noviembre de 2024 (colapso de la marquesina de Novi Sad, 16 muertos) el país vive el mayor movimiento de protesta de su historia moderna, liderado por estudiantes.",
        donde: "Belgrade Waterfront y Sava Promenada, pintadas y carteles por toda la ciudad"
      },
    ],
    curiosidades: [
      "Belgrado ha sido destruida y reconstruida alrededor de 40 veces: es de las capitales más arrasadas de la historia. «Beograd» significa «ciudad blanca».",
      "Kalemegdan viene del turco: kale (fortaleza) + meydan (campo de batalla). El parque más romántico de la ciudad se llama, literalmente, «campo de batalla de la fortaleza».",
      "El cine llegó pronto: los operadores de los Lumière proyectaron en Belgrado en 1896, seis meses después del estreno de París, en una kafana llamada Zlatni krst.",
      "En el Museo Militar hay restos del F-117 «invisible» derribado en 1999. La broma serbia del momento: «Perdón, no sabíamos que era invisible».",
      "La hiperinflación de 1993-94 fue de las peores jamás registradas: llegó a imprimirse un billete de 500.000 millones de dinares. Los precios se doblaban cada día y medio.",
      "La torre Genex (1977), la puerta oeste de la ciudad, es el icono brutalista que veréis al venir del aeropuerto: dos torres unidas por un puente con un restaurante giratorio que nunca giró demasiado.",
      "La kafana «?» se llama así desde 1892: la Iglesia protestó porque el bar se llamaba «Junto a la Catedral», el dueño colgó un interrogante «provisional»… y ahí sigue, 130 años después.",
      "En 1991 el Estrella Roja ganó la Copa de Europa y su estadio, el Marakana, metía 100.000 personas. A finales de julio suele haber previas europeas: si os pica el fútbol, mirad el calendario de crvenazvezdafk.com esa semana.",
    ],
    libros: [
      { titulo: "El puente sobre el Drina", autor: "Ivo Andrić (Nobel 1961)", nota: "LA novela de los Balcanes: cuatro siglos alrededor de un puente. Andrić vivía junto a Kalemegdan." },
      { titulo: "Diario de invierno / colecciones de Kiš", autor: "Danilo Kiš", nota: "El gran escritor yugoslavo-belgradense del s. XX." },
      { titulo: "Café Europa", autor: "Slavenka Drakulić", nota: "Crónicas ácidas de la vida cotidiana postcomunista. Se lee en el avión." },
      { titulo: "Los tiempos de los prodigios / obra de Pekić", autor: "Borislav Pekić", nota: "Otra cima belgradense, más exigente." },
    ]
  },

  /* ---------- COSTUMBRES E IDIOMA ---------- */
  costumbres: [
    { icono: "☕", titulo: "El café es un ritual", texto: "Domaća kafa (café turco/serbio) se sirve con vaso de agua y sin prisa. Sentarse dos horas con un café es normal y nadie os echará. Los cafés de especialidad también abundan." },
    { icono: "🥃", titulo: "Rakija con respeto", texto: "El aguardiente nacional (de ciruela = šljivovica, de membrillo = dunja). Se ofrece como gesto de hospitalidad: se acepta, se brinda mirando a los ojos («živeli!») y se bebe despacio, no de golpe." },
    { icono: "💵", titulo: "Efectivo aún manda", texto: "Tarjeta aceptada en casi todo, pero pekare, mercados, kafanas viejas y el museo Tesla van en efectivo. Llevar siempre 2.000–3.000 RSD encima. Cambiar en menjačnica del centro, no en el aeropuerto." },
    { icono: "🪙", titulo: "Propina sencilla", texto: "No es obligatoria; lo normal es redondear o dejar ~5-10% si el servicio fue bueno. Se deja en efectivo en la mesa." },
    { icono: "🚰", titulo: "Agua del grifo: sí", texto: "El agua de Belgrado es potable y segura. Con 33 °C en julio, botella rellenable siempre encima. Fuentes públicas en parques." },
    { icono: "🕰️", titulo: "Ritmo balcánico", texto: "Se cena tarde (21:00 es normal), las terrazas se llenan aún más tarde y «polako» (despacio) es filosofía nacional. Encajaréis bien." },
    { icono: "⛪", titulo: "En iglesias ortodoxas", texto: "Hombros cubiertos, silencio, y las velas se encienden abajo (por los difuntos) o arriba (por los vivos). Entrar es libre y bienvenido." },
    { icono: "✊", titulo: "Sobre las protestas (importante)", texto: "El movimiento estudiantil que nació con la tragedia de Novi Sad (nov. 2024) sigue muy activo en 2026: grandes concentraciones, y en episodios recientes bloqueos de calles y puentes en Belgrado con presencia policial fuerte. A los turistas no os busca nadie, pero sí puede tocaros logística: cortes de tráfico, buses desviados, un puente cerrado una tarde. Regla doble: (1) si veis concentración grande o antidisturbios, cambiad de calle y seguid con vuestro día; (2) la semana del viaje, echad un ojo a las noticias locales (N1info.rs tiene edición en inglés) por si hay convocatorias grandes. Verificado el 7-jul-2026; la situación evoluciona." },
  ],
  idioma: {
    intro: "El serbio usa cirílico y latino indistintamente — los carteles oficiales suelen ir en cirílico, así que reconocer las letras ayuda de verdad. Con inglés os entendéis con casi todo el mundo joven; una palabra en serbio abre sonrisas.",
    frases: [
      { es: "Hola / Buenos días", sr: "Zdravo / Dobar dan", cir: "Здраво / Добар дан", pron: "ZDRA-vo / DO-bar dan" },
      { es: "Gracias", sr: "Hvala", cir: "Хвала", pron: "JVA-la" },
      { es: "Por favor / De nada", sr: "Molim", cir: "Молим", pron: "MO-lim" },
      { es: "Sí / No", sr: "Da / Ne", cir: "Да / Не", pron: "da / ne" },
      { es: "¿Cuánto cuesta?", sr: "Koliko košta?", cir: "Колико кошта?", pron: "ko-LI-ko KOSH-ta" },
      { es: "La cuenta, por favor", sr: "Račun, molim", cir: "Рачун, молим", pron: "RA-chun MO-lim" },
      { es: "Una cerveza / dos cervezas", sr: "Jedno pivo / dva piva", cir: "Једно пиво / два пива", pron: "YED-no PI-vo / dva PI-va" },
      { es: "¡Salud!", sr: "Živeli!", cir: "Живели!", pron: "ZHI-ve-li" },
      { es: "Perdón / disculpe", sr: "Izvinite", cir: "Извините", pron: "iz-VI-ni-te" },
      { es: "No hablo serbio", sr: "Ne govorim srpski", cir: "Не говорим српски", pron: "ne GO-vo-rim SRP-ski" },
      { es: "¿Dónde está…?", sr: "Gde je…?", cir: "Где је…?", pron: "gde ye" },
      { es: "Estación de tren", sr: "Železnička stanica", cir: "Железничка станица", pron: "zhe-LEZ-nich-ka STA-ni-tsa" },
      { es: "Una mesa para dos", sr: "Sto za dvoje", cir: "Сто за двоје", pron: "sto za DVO-ye" },
      { es: "¿Puedo pagar con tarjeta?", sr: "Mogu li karticom?", cir: "Могу ли картицом?", pron: "MO-gu li KAR-ti-tsom" },
      { es: "¿Dónde está el baño?", sr: "Gde je toalet?", cir: "Где је тоалет?", pron: "gde ye to-a-LET" },
      { es: "Sin carne, por favor", sr: "Bez mesa, molim", cir: "Без меса, молим", pron: "bez ME-sa MO-lim" },
      { es: "¡Está buenísimo!", sr: "Odlično je!", cir: "Одлично је!", pron: "OD-lich-no ye" },
      { es: "¡Ayuda!", sr: "Upomoć!", cir: "Упомоћ!", pron: "U-po-moch" },
    ],
    cirilico: [
      ["А а", "a"], ["Б б", "b"], ["В в", "v"], ["Г г", "g"], ["Д д", "d"], ["Ђ ђ", "dj"], ["Е е", "e"],
      ["Ж ж", "zh"], ["З з", "z"], ["И и", "i"], ["Ј ј", "y"], ["К к", "k"], ["Л л", "l"], ["Љ љ", "ly"],
      ["М м", "m"], ["Н н", "n"], ["Њ њ", "ny"], ["О о", "o"], ["П п", "p"], ["Р р", "r"], ["С с", "s"],
      ["Т т", "t"], ["Ћ ћ", "ch (suave)"], ["У у", "u"], ["Ф ф", "f"], ["Х х", "j (suave)"], ["Ц ц", "ts"],
      ["Ч ч", "ch"], ["Џ џ", "dzh"], ["Ш ш", "sh"]
    ]
  },

  /* ---------- TRANSPORTE ---------- */
  transporte: {
    granNoticia: { titulo: "El transporte urbano es GRATIS", texto: "Desde el 1 de enero de 2025 todo el transporte público de Belgrado (buses, tranvías, trolebuses y tren urbano BG Voz) es gratuito para todos, turistas incluidos. Se sube y ya está: sin billete, sin app, sin validar. Belgrado es la mayor ciudad europea con transporte gratuito. Únicas excepciones de pago: el minibús A1 del aeropuerto (400 RSD) y las líneas exprés E (200 RSD), que se pagan en efectivo a bordo.", fiab: "ok", fuente: "EU Urban Mobility Observatory + guías 2026 · ver. 6-jul-2026" },
    aeropuerto: {
      intro: "Del aeropuerto Nikola Tesla (BEG) a Risanska 9 — llegáis el 22 por la tarde-noche, con maletas y calor. Opciones de más cómoda a más barata:",
      opciones: [
        { nombre: "Taxi oficial con voucher", tiempo: "25–35 min", precio: "Tarifa fija por zonas, ≈2.000–3.000 RSD a Savski Venac (15–25 €)", como: "En llegadas, mostrador oficial de taxi: decís la dirección, os dan un voucher con precio cerrado y os asignan taxi. Sin regateos ni sorpresas. Siendo dos y llegando de viaje, es la opción sensata.", fiab: "ver", tag: "Recomendada al llegar" },
        { nombre: "Bus 72 (GRATIS)", tiempo: "50–60 min hasta Zeleni Venac + 15–20 min a pie o bus corto", precio: "0 RSD", como: "Sale de la terminal hacia Zeleni Venac (mercado central). Desde ahí a Risanska: cuesta abajo-arriba con maleta, o un bus por Karađorđeva. Frecuencia ~30 min.", fiab: "ok" },
        { nombre: "Minibús A1 → Slavija", tiempo: "≈30 min + 10 min a pie", precio: "400 RSD (efectivo a bordo)", como: "Exprés del aeropuerto a la plaza Slavija. De Slavija a Risanska son ~10-12 min andando, bajada suave. Buena relación comodidad/precio si no vais muy cargados.", fiab: "ok", fuente: "Guías 2026: A1 = 400 RSD" },
      ]
    },
    ciudad: [
      "A pie: el casco viejo entero es caminable desde casa (20–35 min a casi todo). Cuestas: de Savamala hacia arriba (Kosančićev venac, Vračar) se sube; con 33 °C, mejor por la mañana o al caer la tarde.",
      "Bus/tranvía/trolebús gratis: cualquier duda de cuesta o calor se resuelve subiéndose a lo primero que pase en la dirección correcta. Google Maps funciona bien con las rutas.",
      "Taxis: baratos (bajada de bandera ~270 RSD). Usar apps locales (Yandex Go/CarGo, o pedir por teléfono) o taxis con matrícula TX; evitar los que abordan en la calle en zonas turísticas.",
      "BG Voz (tren urbano): útil sobre todo para Zemun/Novi Beograd desde Beograd Centar. Gratis también.",
    ],
    trenes: { titulo: "Trenes de largo recorrido", texto: "Todos salen de Beograd Centar (Prokop), a 15–20 min a pie de casa (o un bus corto). Billetes: app/web de Srbija Voz (srbvoz.rs, 5% dto.), máquinas o taquilla. Para el Soko la reserva de asiento es obligatoria.", fiab: "ok" }
  },

  /* ---------- EL DILEMA DEL 30 ---------- */
  dilema: {
    intro: "El 30 de julio termina la parte de Belgrado y el 31 llega Juan a Budapest. Hay tres formas razonables de jugar esa carta — datos primero, la decisión es tuya.",
    contexto: { titulo: "Dato clave sobre el tren a Budapest", texto: "El tren directo Belgrado–Budapest (Soko, ~3h15) debía estrenarse en marzo de 2026 y a fecha de esta verificación (6 jul) seguía pospuesto «al menos hasta junio, posiblemente más» por la señalización del lado húngaro. Si arranca antes del viaje, cambia todo el dilema a mejor. La ruta segura hoy: Soko Beograd Centar → Subotica (≈1h15–1h30, ≈9 €) + tren local Subotica → Szeged (≈2 h, ≈6 €) + InterCity Szeged → Budapest (≈2h30, desde 11 €). Total realista: 7–9 h con transbordos. Verificar en srbvoz.rs y jegy.mav.hu la semana del viaje.", fiab: "ver", fuente: "seat61.com · ver. 6-jul-2026" },
    opciones: [
      {
        nombre: "A · Noche en Subotica con Laura",
        plan: "30: Soko por la mañana a Subotica, tarde de art nouveau y quizá lago Palić, noche allí. 31: tren local a Szeged + IC a Budapest (llegada mediodía-tarde).",
        pros: ["Rompe el viaje largo en dos tramos suaves — cero palizas (bien para Laura si te acompaña hasta ahí)", "Subotica es la escala natural: ya está de camino", "Ciudad pequeña y vistosa, cómoda de ver en una tarde"],
        contras: ["Una noche de hotel extra que gestionar", "Laura tendría que volver a Belgrado o volar desde otro sitio — revisar su vuelta", "Los horarios del tramo Subotica–Szeged son pocos y mandan ellos"]
      },
      {
        nombre: "B · Ir antes a Budapest (día extra allí)",
        plan: "30: viaje completo Belgrado → Budapest (tren con transbordos 7–9 h, o directo ~3h15 si ya funciona; también hay buses directos ~5-6 h y vuelo). Día 31 entero libre en Budapest antes de que llegue Juan.",
        pros: ["Un día entero para instalarte y ver Budapest a tu aire", "Si el tren directo ya circula, es la opción redonda (3h15 y listo)", "Sin noche de hotel intermedia que organizar"],
        contras: ["Si el directo no funciona, el día 30 se va entero en transbordos", "Pagas noche del 30 en Budapest (¿está ya reservada? — revisar)", "Menos tiempo en Belgrado"]
      },
      {
        nombre: "C · Apurar Belgrado hasta el 31",
        plan: "30: día completo en Belgrado (lo que quedó pendiente, Ada con calor, última noche en Cetinjska). 31: madrugar y viajar a Budapest para llegar cuando llega Juan.",
        pros: ["Un día más en la ciudad, sin mover maletas", "La despedida de Laura sin prisas (según su vuelo)", "Cero logística nueva"],
        contras: ["El 31 es día de tránsito completo y llegas justo/cansado a la llegada de Juan", "Si algo falla en el tren, llegas tarde a Budapest", "Madrugón asegurado"]
      }
    ],
    consejo: { texto: "Sugerencia (solo eso): la variable que decide es el tren directo. Si a mediados de julio Srbija Voz confirma que circula, la opción B se vuelve muy fácil; si no circula, la A convierte una paliza en dos días agradables. Mirar también el vuelo de vuelta de Laura antes de decidir.", fiab: "sug" }
  },

  /* ---------- PRÁCTICO ---------- */
  practico: {
    clima: { titulo: "Clima a finales de julio", texto: "Pleno verano continental: máximas habituales 30–35 °C (olas de calor por encima), mínimas 18–22 °C, tormentas de tarde ocasionales. Anochece ~20:30. Estrategia local: mañanas y noches en la calle, museos o siesta a mediodía.", fiab: "ok" },
    dinero: { titulo: "Dinero", texto: "Dinar serbio (RSD), 1 € ≈ 117 RSD. Serbia NO usa euro. Cambiar en menjačnica (mejor tipo, sin comisión habitualmente) o sacar de cajero de banco serbio (evitar Euronet: comisiones piratas). Truco importante: si un datáfono o cajero ofrece cobrar «en euros» (DCC), decid siempre QUE NO — en dinares sale entre un 3 y un 8% mejor. Tarjeta va bien en restaurantes y súper; efectivo para pekare, mercados, el A1 y el museo Tesla.", fiab: "ok" },
    conectividad: { titulo: "Móvil y datos", texto: "Serbia está FUERA del roaming UE: ojo, los datos de vuestra tarifa española no valen (o cobran). Opciones: eSIM de viaje (Airalo/Holafly y similares, se activa antes de salir) o SIM local de prepago (Yettel, MTS, A1) en cualquier kiosco por pocos euros. El apartamento tendrá wifi.", fiab: "ok" },
    emergencias: { titulo: "Emergencias", texto: "Número general europeo 112 (funciona). Policía 192 · Bomberos 193 · Ambulancia 194. Embajada de España en Belgrado: Prote Mateje 45, +381 11 344 0231.", fiab: "ver" },
    documentos: { titulo: "Documentación", texto: "Serbia no es UE: se entra con DNI no — hace falta PASAPORTE en vigor (los españoles no necesitan visado, hasta 90 días). Comprobad los pasaportes YA. En teoría hay que registrar la estancia (el apartamento suele hacerlo — preguntad al anfitrión el «beli karton»).", fiab: "ok" },
    seguridad: { titulo: "Seguridad", texto: "Belgrado es una capital segura para el turista; delito violento contra visitantes, raro. Lo habitual: ojo con carteristas en buses llenos y taxis sin licencia. Protestas: ver la tarjeta en Costumbres.", fiab: "ok" },
    fumar: { titulo: "Se fuma dentro (en serio)", texto: "Serbia es de los últimos países europeos donde se fuma en interiores de bares y muchas kafanas. En julio se vive en terrazas y apenas se nota, pero si un local cerrado os pica los ojos, ya sabéis por qué. Los restaurantes suelen tener zona; preguntad «nepušačka zona» (zona de no fumadores).", fiab: "ok" },
    taxis: { titulo: "Taxis: lo único con truco", texto: "El único timo clásico de Belgrado son los taxis piratas del aeropuerto y de zonas turísticas: sin taxímetro y tarifa inventada. Regla simple: en el aeropuerto, SOLO mostrador de vouchers; en ciudad, apps (Yandex Go, CarGo, Pink Taxi) o taxis con matrícula TX y taxímetro corriendo. Un trayecto normal por el centro: 300–600 RSD.", fiab: "ok" },
    salud: { titulo: "Botiquín y farmacias", texto: "Farmacias (apoteka, АПОТЕКА, cruz verde) por todas partes, con guardias 24 h en el centro. El agua del grifo es potable y hay fuentes públicas. Con 33 °C: sales/electrolitos, gorra y las visitas gordas antes de las 12:00. Sanidad: la Tarjeta Sanitaria Europea NO cubre Serbia (no es UE) — un seguro de viaje básico es buena idea; verificad si alguna tarjeta bancaria vuestra ya lo incluye.", fiab: "ok" },
    checklist: ["Pasaportes (¡no DNI!) y fotocopia/foto", "eSIM activada o plan de SIM local", "Dinares o euros en efectivo para cambiar", "Reserva Srbija Voz para Novi Sad (app)", "Calzado cómodo de verdad (adoquines + cuestas)", "Gorra y protector solar (33 °C)", "Botella de agua rellenable", "Adaptador no hace falta (enchufe europeo tipo F)", "Entradas/reservas: Royal Compound si interesa (sábado 25)", "Revisar vuelo de vuelta de Laura antes de decidir el día 30"]
  },
};

/* Export global */
window.DATA = DATA;
