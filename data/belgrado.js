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
  ],

  /* ---------- BARRIOS ---------- */
  barrios: [
    {
      id: "savski-venac", nombre: "Savski Venac · Savamala", tag: "Vuestra base",
      coords: [44.8050, 20.4560],
      desc: "Central, funcional, ferroviaria y administrativa. No es la postal, es el cuartel general: entre Slavija, la antigua estación (Savski trg), el Palacio de Justicia y el río. Panaderías, cafés de barrio, supermercados y casas de cambio a mano.",
      cerca: "Sava Promenada y Belgrade Waterfront (paseo del río, 10-15 min a pie), Savamala vieja, Casa de Manak, centro comercial Galerija.",
      comoLlegar: "Estáis en él. Todo el casco viejo queda a 20–30 min a pie o un bus corto (gratis).",
      fiab: "ok"
    },
    {
      id: "stari-grad", nombre: "Stari Grad · Knez Mihailova", tag: "El centro",
      coords: [44.8163, 20.4602],
      desc: "El corazón peatonal: plaza de la República, Museo Nacional, Teatro Nacional y la calle Knez Mihailova hasta Kalemegdan. Aquí se concentra el Belgrado clásico y también el más turístico.",
      cerca: "Kalemegdan al final de la calle, Kosančićev venac bajando hacia el Sava.",
      comoLlegar: "≈25 min a pie desde Risanska, o cualquier bus hacia Zeleni Venac (gratis).",
      fiab: "ok"
    },
    {
      id: "kosancicev", nombre: "Kosančićev venac", tag: "El rincón bonito",
      coords: [44.8155, 20.4530],
      desc: "Adoquines, la Catedral ortodoxa, el Patriarcado, la Residencia de Ljubica y vistas al Sava. La esquina con más encanto del casco viejo, y de camino entre vuestra zona y Kalemegdan.",
      cerca: "Kafana «?» (Znak pitanja), la más antigua de la ciudad, frente a la Catedral.",
      comoLlegar: "A pie: subida desde Savamala (cuestas, pero cortas).",
      fiab: "ok"
    },
    {
      id: "dorcol", nombre: "Dorćol", tag: "Para callejear",
      coords: [44.8215, 20.4620],
      desc: "El barrio viejo entre Knez Mihailova y el Danubio: cafés, bares con carácter, restos otomanos (mezquita Bajrakli), diseño y vida local. Probablemente el mejor barrio para perderse sin plan.",
      cerca: "Museo Etnográfico, Vuk y Dositej, Ciencia y Tecnología, Dorćol Platz, y bajando, el paseo del Danubio.",
      comoLlegar: "A pie desde el centro; desde casa ≈35 min o bus a Studentski trg.",
      fiab: "ok"
    },
    {
      id: "skadarlija", nombre: "Skadarlija · Cetinjska", tag: "Bohemia + noche",
      coords: [44.8172, 20.4653],
      desc: "Skadarlija es la calle bohemia de kafanas con música tradicional — bonita y sí, turística. Justo detrás, el complejo de la antigua cervecera en Cetinjska 15 es su contrapunto: bares alternativos, patios y música hasta tarde.",
      cerca: "Bajbokana, Dva jelena y Tri šešira (kafanas clásicas); Samo Pivo, Polet, Zaokret en Cetinjska.",
      comoLlegar: "≈30 min a pie desde casa o bus al centro + 10 min.",
      fiab: "ok"
    },
    {
      id: "vracar", nombre: "Vračar · Slavija", tag: "Residencial agradable",
      coords: [44.8000, 20.4720],
      desc: "El barrio burgués: el templo de San Sava, el museo Tesla, el mercado Kalenić y calles arboladas con cafés. Sube cuesta desde vuestra zona, pero Slavija queda a 10 minutos andando.",
      cerca: "San Sava, Tesla, Kalenić, cafeterías de especialidad.",
      comoLlegar: "A pie a Slavija (10 min) y desde ahí llano-suave; o trolebús desde Slavija.",
      fiab: "ok"
    },
    {
      id: "novi-beograd", nombre: "Novi Beograd · Ušće", tag: "La otra escala",
      coords: [44.8130, 20.4310],
      desc: "La ciudad socialista planificada al otro lado del Sava: bloques (blokovi), avenidas enormes, el parque Ušće en la confluencia, MoCAB y arquitectura yugoslava brutalista. Otro planeta a 20 minutos — para entender el siglo XX de la ciudad.",
      cerca: "MoCAB, Palata Srbija, Sava Centar, torre Genex (desde fuera).",
      comoLlegar: "Cruzar el puente Branko a pie hasta Ušće, o cualquier bus que cruce el Sava (gratis).",
      fiab: "ok"
    },
    {
      id: "zemun", nombre: "Zemun · Gardoš", tag: "Excursión urbana",
      coords: [44.8455, 20.4110],
      desc: "Hasta 1918 era otra ciudad — y otro imperio. Casco antiguo austrohúngaro, la torre de Gardoš con vistas al Danubio, mercado, pescado junto al río y ambiente de pueblo dentro de la capital.",
      cerca: "Paseo fluvial (kej), restaurantes de pescado, mercadillo dominical (buvljak) temprano.",
      comoLlegar: "Bus 83/78 desde Zeleni Venac (gratis), 25–35 min. Combinable con Novi Beograd.",
      fiab: "ok"
    },
    {
      id: "dedinje", nombre: "Dedinje · Topčider", tag: "Poder y memoria",
      coords: [44.7830, 20.4520],
      desc: "Colinas verdes de embajadas, villas y memoria política: el Museo de Yugoslavia y la tumba de Tito, el parque Topčider, el estadio del Estrella Roja y el complejo real.",
      cerca: "Museo de Yugoslavia, Casa de las Flores, Topčider, Arte Africano.",
      comoLlegar: "Trolebús 40/41 desde el centro (gratis), ≈20 min.",
      fiab: "ok"
    },
    {
      id: "ada", nombre: "Ada Ciganlija", tag: "La playa de Belgrado",
      coords: [44.7906, 20.4051],
      desc: "Isla-península en el Sava convertida en lago de baño con playas, chiringuitos y deporte. Con calor de julio (30-35 °C habituales), media jornada de remojo puede ser oro.",
      cerca: "Alquiler de bicis, kayak, y decenas de cafés-playa.",
      comoLlegar: "Buses hacia Ada desde el centro (gratis); en taxi ≈10 min desde casa.",
      fiab: "ok"
    },
  ],

  /* ---------- COMER Y BEBER (con testimonios) ---------- */
  comer: {
    intro: "Guía construida sobre lo que repiten viajeros independientes y locales (Reddit, blogs personales, Spotted by Locals), no sobre listas de agencia. Precios orientativos de julio de 2026: burek 150–300 RSD, pljeskavica 350–600 RSD, menú en kafana 1.200–2.500 RSD/persona con bebida, café 150–250 RSD.",
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
    intro: "El plan que os gusta —salir a tomar cervezas por la noche y charlar— es exactamente el punto fuerte de Belgrado. Cerveza artesana 250–600 RSD, terrazas hasta tarde (con el calor de julio la vida es nocturna), y cero prisa por cerrar. Las discotecas y splavovi de fiesta existen pero son otro deporte.",
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

  /* ---------- HISTORIA ---------- */
  historia: {
    intro: "Belgrado no es una ciudad de postal: es una ciudad de capas. Ha sido destruida y reconstruida decenas de veces — cada imperio dejó un estrato, y todos se ven paseando.",
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
    { icono: "✊", titulo: "Sobre las protestas", texto: "El movimiento estudiantil sigue activo en 2026. Son mayoritariamente pacíficas pero ha habido choques (mayo 2026). Consejo estándar: si veis concentración grande o policía antidisturbios, cambiar de calle y seguir con el día. Como turistas no os afecta más que algún corte de tráfico." },
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
    dinero: { titulo: "Dinero", texto: "Dinar serbio (RSD), 1 € ≈ 117 RSD. Serbia NO usa euro. Cambiar en menjačnica (mejor tipo, sin comisión habitualmente) o sacar de cajero de banco (evitar Euronet). Tarjeta va bien en restaurantes y súper; efectivo para pekare, mercados, A1 y museo Tesla.", fiab: "ver" },
    conectividad: { titulo: "Móvil y datos", texto: "Serbia está FUERA del roaming UE: ojo, los datos de vuestra tarifa española no valen (o cobran). Opciones: eSIM de viaje (Airalo/Holafly y similares, se activa antes de salir) o SIM local de prepago (Yettel, MTS, A1) en cualquier kiosco por pocos euros. El apartamento tendrá wifi.", fiab: "ok" },
    emergencias: { titulo: "Emergencias", texto: "Número general europeo 112 (funciona). Policía 192 · Bomberos 193 · Ambulancia 194. Embajada de España en Belgrado: Prote Mateje 45, +381 11 344 0231.", fiab: "ver" },
    documentos: { titulo: "Documentación", texto: "Serbia no es UE: se entra con DNI no — hace falta PASAPORTE en vigor (los españoles no necesitan visado, hasta 90 días). Comprobad los pasaportes YA. En teoría hay que registrar la estancia (el apartamento suele hacerlo — preguntad al anfitrión el «beli karton»).", fiab: "ok" },
    seguridad: { titulo: "Seguridad", texto: "Belgrado es una capital segura para el turista; delito violento contra visitantes, raro. Lo habitual: ojo con carteristas en buses llenos y taxis sin licencia. Protestas: ver la tarjeta en Costumbres.", fiab: "ok" },
    checklist: ["Pasaportes (¡no DNI!) y fotocopia/foto", "eSIM activada o plan de SIM local", "Dinares o euros en efectivo para cambiar", "Reserva Srbija Voz para Novi Sad (app)", "Calzado cómodo de verdad (adoquines + cuestas)", "Gorra y protector solar (33 °C)", "Botella de agua rellenable", "Adaptador no hace falta (enchufe europeo tipo F)", "Entradas/reservas: Royal Compound si interesa (sábado 25)", "Revisar vuelo de vuelta de Laura antes de decidir el día 30"]
  },
};

/* Export global */
window.DATA = DATA;
