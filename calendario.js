(function () {
    'use strict';

    const BASE = 'https://www.wikitolica.com';
    const u = p => BASE + p;
    const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
    const sameDay = (a, b) => a.toDateString() === b.toDateString();

    function easter(y) {
        const a = y % 19, b = (y / 100) | 0, c = y % 100, d = (b / 4) | 0, e = b % 4;
        const f = ((b + 8) / 25) | 0, g = ((b - f + 1) / 3) | 0;
        const h = (19 * a + b - d - g + 15) % 30, i = (c / 4) | 0, k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7, m = ((a + 11 * h + 22 * l) / 451) | 0;
        return new Date(y, (((h + l - 7 * m + 114) / 31) | 0) - 1, ((h + l - 7 * m + 114) % 31) + 1);
    }
    const advent1 = y => { const n = new Date(y, 10, 27); return addDays(n, (7 - n.getDay()) % 7); };
    const baptism = y => { const j = new Date(y, 0, 6); return j.getDay() === 0 ? new Date(y, 0, 13) : addDays(j, 7 - j.getDay()); };

    /* Tiempos litúrgicos */
    const T = {
        ord: { tiempo: 'Tiempo Ordinario', color: '#2d6a4f', icono: '📖', p: '/t/tiempo-ordinario/' },
        adv: { tiempo: 'Adviento', color: '#5b21b6', icono: '🕯️', p: '/a/adviento/' },
        nav: { tiempo: 'Navidad', color: '#8b5e0a', icono: '⭐', p: '/n/navidad/' },
        cua: { tiempo: 'Cuaresma', color: '#5b21b6', icono: '✝️', p: '/c/cuaresma/' },
        sem: { tiempo: 'Semana Santa', color: '#7f1d1d', icono: '🌿', p: '/s/semana-santa/' },
        tri: { tiempo: 'Triduo Pascual', color: '#1e1b4b', icono: '🕯️', p: '/t/triduo-pascual/' },
        pas: { tiempo: 'Tiempo de Pascua', color: '#78350f', icono: '✨', p: '/t/tiempo-de-pascua/' },
    };

    /* Solemnidades fijas */
    const SOLEM = {
        '1-1': { n: 'Santa María Madre de Dios', i: '👑', p: '/m/maria-madre-de-dios/' },
        '1-6': { n: 'Epifanía del Señor', i: '⭐', p: '/e/epifania/' },
        '2-2': { n: 'Presentación del Señor', i: '🕯️', p: '/p/presentacion-del-senor/' },
        '2-11': { n: 'Nuestra Señora de Lourdes', i: '💧', p: '/l/lourdes/' },
        '3-19': { n: 'San José, Esposo de la Virgen', i: '⚒️', p: '/s/san-jose/' },
        '3-25': { n: 'Anunciación del Señor', i: '🕊️', p: '/a/anunciacion/' },
        '6-24': { n: 'Natividad de San Juan Bautista', i: '💧', p: '/s/san-juan-bautista/' },
        '6-29': { n: 'Santos Pedro y Pablo', i: '⚓', p: '/s/san-pedro/' },
        '7-16': { n: 'Nuestra Señora del Carmen', i: '🌹', p: '/v/virgen-del-carmen/' },
        '8-6': { n: 'Transfiguración del Señor', i: '✨', p: '/t/transfiguracion/' },
        '8-15': { n: 'Asunción de la Virgen María', i: '☁️', p: '/d/dogma-de-asuncion-en-cuerpo-y-alma-de-maria/' },
        '8-22': { n: 'Bienaventurada Virgen María Reina', i: '👑', p: '/m/maria-reina/' },
        '9-8': { n: 'Natividad de la Virgen María', i: '🌸', p: '/n/natividad-de-maria/' },
        '9-14': { n: 'Exaltación de la Santa Cruz', i: '✝️', p: '/e/exaltacion-de-la-santa-cruz/' },
        '10-7': { n: 'Nuestra Señora del Rosario', i: '📿', p: '/r/rosario/' },
        '11-1': { n: 'Todos los Santos', i: '😇', p: '/t/todos-los-santos/' },
        '11-2': { n: 'Fieles Difuntos', i: '🕯️', p: '/p/purgatorio/' },
        '11-21': { n: 'Presentación de María', i: '🕯️', p: '/p/presentacion-de-la-virgen-maria-en-el-templo/' },
        '12-8': { n: 'Inmaculada Concepción de la Virgen', i: '🌙', p: '/d/dogma-de-la-inmaculada-concepcion/' },
        '12-12': { n: 'Nuestra Señora de Guadalupe', i: '🌹', p: '/n/nuestra-senora-de-guadalupe/' },
        '12-25': { n: 'Natividad del Señor', i: '⭐', p: '/n/navidad/' },
    };

    const SAINTS = {
        "1-1": [{ n: "San Basilio de Cesarea", p: "/s/san-basilio-de-cesarea/" }, { n: "Guillermo de Saint‑Benignus", p: "/s/san-guillermo-de-saint-benignus/" }],
        "1-2": [{ n: "Gregorio Nacianceno", p: "/s/san-gregorio-nacianceno/" }],
        "1-3": [{ n: "Genoveva", p: "/s/santa-genoveva-de-paris/" }],
        "1-6": [{ n: "Nuestra Señora de los Reyes", p: "/n/nuestra-senora-de-los-reyes/" }, { n: "San Juan de Ribera", p: "/s/san-juan-de-ribera/" }],
        "1-7": [{ n: "Raimundo de Peñafort", p: "/s/san-raimundo-de-penafort/" }],
        "1-10": [{ n: "San Marcos de Trache", p: "/s/san-marcos-de-trache/" }],
        "1-13": [{ n: "Hilario de Poitiers", p: "/s/san-hilario-de-poitiers/" }],
        "1-15": [{ n: "Arnold Janssen", p: "/s/san-arnold-janssen/" }, { n: "San Macario el Viejo", p: "/s/san-macario-el-viejo/" }],
        "1-16": [{ n: "Primeros Mártires de la Iglesia de Roma", p: "/p/primeros-martires-de-la-iglesia-de-roma/" }],
        "1-17": [{ n: "San Antonio Abad", p: "/s/san-antonio-abad/" }],
        "1-19": [{ n: "San Odilo de Cluny", p: "/s/san-odilo-de-cluny/" }],
        "1-20": [{ n: "San Fabián", p: "/s/san-fabian/" }, { n: "San Sebastián", p: "/s/san-sebastian/" }],
        "1-21": [{ n: "Santa Inés", p: "/s/santa-ines/" }],
        "1-22": [{ n: "San Valero", p: "/s/san-valero/" }, { n: "San Vicente Mártir", p: "/s/san-vicente-martir/" }],
        "1-23": [{ n: "San Ildefonso de Toledo", p: "/s/san-ildefonso-de-toledo/" }],
        "1-24": [{ n: "San Francisco de Sales", p: "/s/san-francisco-de-sales/" }],
        "1-25": [{ n: "Conversión de Saulo (San Pablo)", p: "/c/conversion-de-saulo-san-pablo/" }],
        "1-26": [{ n: "Timoteo", p: "/s/san-timoteo/" }, { n: "San Tito", p: "/s/san-tito/" }],
        "1-27": [{ n: "Ángela Merici", p: "/s/santa-angela-merici/" }],
        "1-28": [{ n: "Tomás de Aquino", p: "/s/santo-tomas-de-aquino/" }, { n: "San Pedro Nolasco", p: "/s/san-pedro-nolasco/" }],
        "1-30": [{ n: "Félix IV (III)", p: "/p/papa-felix-iv-iii/" }],
        "1-31": [{ n: "San Juan Bosco", p: "/s/san-juan-bosco/" }],
        "2-1": [{ n: "Santa Brígida de Irlanda", p: "/s/santa-brigida-de-irlanda/" }],
        "2-2": [{ n: "Nuestra Señora de la Candelaria de Copiapó", p: "/n/nuestra-senora-de-la-candelaria-de-copiapo/" }, { n: "Nuestra Señora del Buen Suceso", p: "/n/nuestra-senora-del-buen-suceso/" }],
        "2-3": [{ n: "San Blas", p: "/s/san-blas/" }],
        "2-4": [{ n: "Juana de Valois", p: "/s/santa-juana-de-valois/" }],
        "2-5": [{ n: "Santa Águeda", p: "/s/santa-agueda/" }],
        "2-6": [{ n: "Dorotea de Cesarea", p: "/s/santa-dorotea/" }, { n: "San Pablo Miki y compañeros", p: "/s/san-pablo-miki-y-companeros/" }],
        "2-8": [{ n: "San Jerónimo Emiliani", p: "/s/san-jeronimo-emiliani/" }, { n: "Josefina Bakhita", p: "/s/santa-josefina-bakhita/" }],
        "2-10": [{ n: "Santa Escolástica", p: "/s/santa-escolastica/" }],
        "2-12": [{ n: "Santa Eulalia", p: "/s/santa-eulalia/" }],
        "2-14": [{ n: "San Valentín", p: "/s/san-valentin/" }, { n: "San Cirilo", p: "/s/san-cirilo/" }, { n: "San Metodio", p: "/s/san-metodio/" }],
        "2-17": [{ n: "Siete Santos Fundadores de la Orden de los Siervos de María", p: "/s/siete-santos-fundadores-de-la-orden-de-los-siervos-de-maria/" }],
        "2-21": [{ n: "San Pedro Damián", p: "/s/san-pedro-damian/" }],
        "2-22": [{ n: "Cátedra de San Pedro", p: "/s/san-simon-pedro/" }],
        "2-23": [{ n: "Policarpo", p: "/s/san-policarpo/" }, { n: "Pedro Frelichowski", p: "/b/beato-pedro-frelichowski/" }],
        "2-27": [{ n: "San Leandro", p: "/s/san-leandro/" }, { n: "Mechtilde de Hackeborn", p: "/s/santa-mechtilde/" }],
        "3-1": [{ n: "San David", p: "/s/san-david/" }, { n: "Félix III", p: "/p/papa-felix-iii-ii/" }],
        "3-3": [{ n: "Katharine Drexel", p: "/s/santa-katherine-drexel/" }],
        "3-4": [{ n: "Lucio I", p: "/p/papa-lucio-i/" }, { n: "San Casimiro", p: "/s/san-casimiro/" }],
        "3-7": [{ n: "Santa Felicidad", p: "/s/santa-felicidad/" }, { n: "Perpetua", p: "/s/santa-perpetua/" }],
        "3-8": [{ n: "San Juan de Dios", p: "/s/san-juan-de-dios/" }],
        "3-9": [{ n: "Santa Francesca Romana", p: "/s/santa-francisca-romana/" }],
        "3-15": [{ n: "San Clemente María Hofbauer", p: "/s/san-clemente-maria-hofbauer/" }, { n: "Luisa de Marillac", p: "/s/santa-luisa-de-marillac/" }],
        "3-17": [{ n: "San Patricio", p: "/s/san-patricio/" }],
        "3-18": [{ n: "San Eduardo", p: "/s/san-eduardo/" }, { n: "Cirilo de Jerusalén", p: "/s/san-cirilo-de-jerusalen/" }],
        "3-19": [{ n: "San José", p: "/s/san-jose/" }],
        "3-23": [{ n: "San Toribio de Mogrovejo", p: "/s/san-toribio-de-mogrovejo/" }],
        "3-24": [{ n: "Óscar Romero", p: "/s/san-oscar-romero/" }],
        "3-25": [{ n: "Virgen de la Encarnación", p: "/v/virgen-de-la-encarnacion/" }],
        "3-28": [{ n: "Sixto III", p: "/p/papa-sixto-iii/" }],
        "4-2": [{ n: "San Francisco de Paula", p: "/s/san-francisco-de-paula/" }],
        "4-7": [{ n: "Juan Bautista de la Salle", p: "/s/san-juan-bautista-de-la-salle/" }],
        "4-8": [{ n: "Julie Billiart", p: "/s/santa-julie-billiart/" }],
        "4-11": [{ n: "San Estanislao", p: "/s/san-estanislao/" }],
        "4-13": [{ n: "Martín I", p: "/p/papa-martin-i/" }],
        "4-15": [{ n: "San Damián de Molokai", p: "/s/san-damian-de-molokai/" }],
        "4-18": [{ n: "San Apolonio", p: "/s/san-apolonio/" }],
        "4-21": [{ n: "San Anselmo de Canterbury", p: "/s/san-anselmo-de-canterbury/" }],
        "4-23": [{ n: "San Jorge", p: "/s/san-jorge/" }],
        "4-24": [{ n: "San Francisco Coll", p: "/s/san-francisco-coll/" }, { n: "Fidelis de Sigmaringen", p: "/s/san-fidelis-de-sigmaringen/" }],
        "4-25": [{ n: "San Marcos Evangelista", p: "/s/san-marcos-evangelista/" }],
        "4-26": [{ n: "San Marcelino", p: "/s/san-marcelino/" }],
        "4-27": [{ n: "Nuestra Señora de Montserrat", p: "/n/nuestra-senora-de-monserrat/" }],
        "4-28": [{ n: "San Pedro Chanel", p: "/s/san-pedro-chanel/" }, { n: "San Luis Grignion de Montfort", p: "/s/san-luis-grignion-de-montfort/" }],
        "4-29": [{ n: "Santa Endelienta", p: "/s/santa-endelienta/" }, { n: "San Pedro mártir", p: "/s/san-pedro-martir/" }, { n: "Santa Catalina de Siena", p: "/s/santa-catalina-de-siena/" }],
        "4-30": [{ n: "Pío V", p: "/p/papa-pio-v/" }],
        "5-1": [{ n: "San José Obrero", p: "/s/san-jose/" }],
        "5-2": [{ n: "San Atanasio", p: "/s/san-atanasio/" }],
        "5-3": [{ n: "Cruz de Caravaca", p: "/c/cruz-de-caravaca/" }, { n: "San Santiago el Menor", p: "/f/fiesta-de-san-santiago-el-menor/" }, { n: "San Felipe Apóstol", p: "/s/san-felipe/" }],
        "5-10": [{ n: "San Juan de Ávila", p: "/s/san-juan-de-avila/" }],
        "5-13": [{ n: "Nuestra Señora de Fátima", p: "/n/nuestra-senora-de-fatima/" }],
        "5-14": [{ n: "San Matías", p: "/s/san-matias-apostol/" }],
        "5-16": [{ n: "San Ubaldo", p: "/s/san-ubaldo/" }],
        "5-17": [{ n: "Pascual Baylón", p: "/s/san-pascual-baylon/" }, { n: "San Pedro Pascual", p: "/s/san-pedro-pascual/" }],
        "5-19": [{ n: "San Celestino V", p: "/s/san-celestino-v/" }],
        "5-20": [{ n: "San Bernardino de Siena", p: "/s/san-bernardino-de-siena/" }],
        "5-21": [{ n: "San Cristóbal Magallanes", p: "/s/san-cristobal-magallanes/" }, { n: "Ezequiel", p: "/p/profeta-ezequiel/" }],
        "5-22": [{ n: "Santa Rita de Cascia", p: "/s/santa-rita-de-cascia/" }],
        "5-24": [{ n: "María Auxiliadora", p: "/m/maria-auxiliadora/" }],
        "5-25": [{ n: "Bonifacio IV", p: "/p/papa-bonifacio-iv/" }, { n: "Beda", p: "/s/san-beda-el-venerable/" }, { n: "Gregorio VII", p: "/s/san-gregorio-vii/" }],
        "5-26": [{ n: "Matías Maulumba Kalemba", p: "/s/san-matias-maulumba-kalemba/" }, { n: "San Felipe Neri", p: "/s/san-felipe-neri/" }],
        "5-27": [{ n: "San Agustín de Canterbury", p: "/s/san-agustin-de-cantorbery/" }],
        "5-30": [{ n: "Juana de Arco", p: "/s/santa-juana-de-arco/" }, { n: "Félix I", p: "/p/papa-felix-i/" }],
        "6-1": [{ n: "Justino Mártir", p: "/s/san-justino-martir/" }],
        "6-3": [{ n: "San Carlos Lwanga y compañeros", p: "/s/san-carlos-lwanga-y-companeros/" }],
        "6-4": [{ n: "San Quirino de Siscia", p: "/s/san-quirino-de-sescia/" }],
        "6-5": [{ n: "San Bonifacio", p: "/s/san-bonifacio/" }],
        "6-6": [{ n: "Norberto", p: "/s/san-norberto/" }],
        "6-9": [{ n: "San Efrén de Nísibe", p: "/s/san-efren-de-nisibe/" }],
        "6-11": [{ n: "San Bernabé", p: "/s/san-bernabe/" }],
        "6-13": [{ n: "San Antonio de Padua", p: "/s/san-antonio-de-padua/" }],
        "6-15": [{ n: "San Bernardo de Menthon", p: "/s/san-bernardo-de-menthon/" }],
        "6-19": [{ n: "San Protasio", p: "/s/san-protasio/" }, { n: "San Romualdo", p: "/s/san-romualdo/" }],
        "6-20": [{ n: "Silverio", p: "/p/papa-silverio/" }],
        "6-21": [{ n: "Luis Gonzaga", p: "/s/san-luis-gonzaga/" }],
        "6-22": [{ n: "San Juan Fisher", p: "/s/san-juan-fisher/" }, { n: "San Paulino de Nola", p: "/s/san-paulino-de-nola/" }],
        "6-26": [{ n: "San Josemaría Escrivá de Balaguer", p: "/s/san-josemaria-escriva-de-balaguer/" }],
        "6-27": [{ n: "San Cirilo de Alejandría", p: "/s/san-cirilo-de-alejandria/" }],
        "6-28": [{ n: "San Ireneo de Lyon", p: "/s/san-ireneo-de-lyon/" }],
        "6-29": [{ n: "San Pedro", p: "/s/san-pedro/" }, { n: "San Pablo Apóstol", p: "/s/san-pablo-apostol/" }, { n: "Santos Protomártires de Roma", p: "/s/santos-protomartires-de-roma/" }],
        "7-1": [{ n: "Sangre de Cristo", p: "/s/sangre-de-cristo/" }],
        "7-3": [{ n: "Santo Tomás Apóstol", p: "/s/santo-tomas-apostol/" }],
        "7-4": [{ n: "Pier Giorgio Frassati", p: "/s/san-pier-giorgio-frassati/" }, { n: "Isabel de Portugal", p: "/s/santa-isabel-de-portugal/" }],
        "7-5": [{ n: "Antonio María Zaccaría", p: "/s/san-antonio-maria-zaccaria/" }],
        "7-6": [{ n: "María Goretti", p: "/s/santa-maria-goretti/" }],
        "7-7": [{ n: "Benedicto XI", p: "/p/papa-benedicto-xi/" }],
        "7-8": [{ n: "San Kilian", p: "/s/san-kilian/" }],
        "7-9": [{ n: "Estigmas de Santa Verónica Giuliani", p: "/e/estigmas-de-santa-veronica-giuliani/" }, { n: "San Agustín Zhao Rong y compañeros", p: "/s/san-agustin-zhao-rong-y-companeros/" }],
        "7-11": [{ n: "San Benito de Nursia", p: "/s/san-benito-de-nursia/" }],
        "7-12": [{ n: "San Juan Gualberto", p: "/s/san-juan-gualberto/" }],
        "7-14": [{ n: "Camilo de Lellis", p: "/s/san-camilo-de-lelis/" }],
        "7-15": [{ n: "San Buenaventura", p: "/s/san-buenaventura/" }],
        "7-20": [{ n: "Elías", p: "/e/elias-profeta/" }],
        "7-21": [{ n: "San Lorenzo de Brindisi", p: "/s/san-lorenzo-de-brindisi/" }],
        "7-22": [{ n: "María Magdalena", p: "/s/santa-maria-magdalena/" }],
        "7-23": [{ n: "Brígida de Suecia", p: "/s/santa-brigida/" }],
        "7-24": [{ n: "San Charbel Makhluf", p: "/s/san-sarbelio-makhluf/" }],
        "7-25": [{ n: "Santiago Apóstol", p: "/s/santiago-apostol/" }],
        "7-26": [{ n: "San Joaquín", p: "/s/san-joaquin/" }, { n: "Santa Ana", p: "/s/santa-ana/" }],
        "7-28": [{ n: "Víctor I", p: "/p/papa-victor-i/" }],
        "7-29": [{ n: "Marta", p: "/s/santa-marta/" }],
        "7-30": [{ n: "San Pedro Crisólogo", p: "/s/san-pedro-crisologo/" }],
        "7-31": [{ n: "San Ignacio de Loyola", p: "/s/san-inigo/" }, { n: "San Germán de Auxerre", p: "/s/san-german-de-auxerre/" }],
        "8-1": [{ n: "Alfonso María de Ligorio", p: "/s/san-alfonso-maria-de-ligorio/" }],
        "8-2": [{ n: "San Pedro Julián Eymard", p: "/s/san-pedro-julian-eymard/" }, { n: "San Eusebio de Vercelli", p: "/s/san-eusebio-de-vercelli/" }],
        "8-4": [{ n: "San Juan María Vianney", p: "/s/san-juan-maria-vianney/" }],
        "8-6": [{ n: "Nuestra Señora de Copacabana", p: "/n/nuestra-senora-de-copacabana/" }, { n: "Moisés", p: "/m/moises/" }],
        "8-7": [{ n: "San Cayetano", p: "/s/san-cayetano/" }, { n: "San Sixto II", p: "/s/san-sixto-ii/" }],
        "8-8": [{ n: "Domingo de Guzmán", p: "/s/santo-domingo-de-guzman/" }],
        "8-9": [{ n: "Santa Teresa Benedicta de la Cruz", p: "/s/santa-teresa-benedicta-de-la-cruz/" }],
        "8-10": [{ n: "San Lorenzo", p: "/s/san-lorenzo/" }],
        "8-11": [{ n: "Santa Clara de Asís", p: "/s/santa-clara-de-asis/" }],
        "8-12": [{ n: "Juana Francisca de Chantal", p: "/s/santa-juana-francisca-de-chantal/" }],
        "8-13": [{ n: "San Ponciano", p: "/p/papa-ponciano/" }],
        "8-14": [{ n: "Maximiliano María Kolbe", p: "/s/san-maximiliano-maria-kolbe/" }, { n: "Milagro eucarístico de Florencia", p: "/m/milagro-eucaristico-de-florencia-italia/" }],
        "8-15": [{ n: "Virgen de Covadonga", p: "/v/virgen-de-covadonga/" }, { n: "Virgen Negra de Le Puy", p: "/v/virgen-negra-de-le-puy/" }, { n: "Virgen de Lluc", p: "/v/virgen-de-lluc/" }, { n: "Nuestra Señora de Budslau", p: "/n/nuestra-senora-de-budslau/" }],
        "8-16": [{ n: "San Roque", p: "/s/san-roque/" }, { n: "San Esteban de Hungría", p: "/s/san-esteban-de-hungria/" }],
        "8-17": [{ n: "Beatriz de Silva", p: "/s/santa-beatriz-de-silva/" }],
        "8-18": [{ n: "Santa Elena", p: "/s/santa-elena/" }],
        "8-19": [{ n: "San Luis de Toulouse", p: "/s/san-luis-obispo/" }, { n: "San Juan Eudes", p: "/s/san-juan-eudes/" }],
        "8-20": [{ n: "San Bernardo de Clairvaux", p: "/s/san-bernardo-de-clairvaux/" }],
        "8-21": [{ n: "San Pío X", p: "/s/san-pio-x/" }],
        "8-23": [{ n: "Santa Rosa de Lima", p: "/s/santa-rosa-de-lima/" }],
        "8-24": [{ n: "San Bartolomé", p: "/s/san-bartolome/" }],
        "8-25": [{ n: "San Luis de Francia", p: "/s/san-luis-de-francia/" }, { n: "María Micaela del Santísimo Sacramento", p: "/s/santa-maria-micaela-del-santisimo-sacramento/" }, { n: "San José de Calasanz", p: "/s/san-jose-de-calasanz/" }],
        "8-26": [{ n: "Virgen de Czestochowa", p: "/m/milagro-de-la-virgen-de-czestochowa-polonia/" }],
        "8-27": [{ n: "César de Arlés", p: "/c/cesar-de-arles/" }, { n: "Mónica", p: "/s/santa-monica/" }],
        "8-28": [{ n: "San Agustín de Hipona", p: "/s/san-agustin-de-hipona/" }],
        "8-29": [{ n: "Nuestra Señora de Atocha", p: "/n/nuestra-senora-de-atocha/" }],
        "8-31": [{ n: "San Raimundo Nonato", p: "/s/san-raimundo-nonato/" }],
        "9-1": [{ n: "Milagro eucarístico de Daroca", p: "/m/milagro-eucaristico-de-daroca-espana/" }],
        "9-2": [{ n: "San Emerico", p: "/s/san-emerico/" }],
        "9-3": [{ n: "San Gregorio I Magno", p: "/s/san-gregorio-i-magno/" }],
        "9-5": [{ n: "Santa Teresa de Calcuta", p: "/s/santa-teresa-de-calcuta/" }],
        "9-8": [{ n: "Tomás de Villanueva", p: "/s/santo-tomas-de-villanueva/" }],
        "9-9": [{ n: "Pedro Claver", p: "/s/san-pedro-claver/" }],
        "9-10": [{ n: "Nicolás de Tolentino", p: "/s/san-nicolas-de-tolentino/" }],
        "9-13": [{ n: "Juan Crisóstomo", p: "/s/san-juan-crisostomo/" }],
        "9-15": [{ n: "María Santísima del Mayor Dolor", p: "/m/maria-santisima-del-mayor-dolor/" }, { n: "Catalina de Génova", p: "/s/santa-catalina-de-genova/" }, { n: "San Pedro de Arbués", p: "/s/san-pedro-de-arbues/" }],
        "9-16": [{ n: "San Juan Macías", p: "/s/san-juan-macias/" }, { n: "San Cornelio", p: "/p/papa-cornelio/" }],
        "9-17": [{ n: "Estigmas de San Francisco de Asís", p: "/e/estigmas-de-san-francisco-de-asis/" }, { n: "Hildegarda de Bingen", p: "/s/santa-hildegarda-de-bingen/" }, { n: "San Roberto Belarmino", p: "/s/san-roberto-belarmino/" }],
        "9-18": [{ n: "San José de Cupertino", p: "/l/levitacion-de-san-jose-de-cupertino/" }],
        "9-19": [{ n: "San Jenaro", p: "/s/san-jenaro/" }],
        "9-20": [{ n: "San Andrés Kim Taegon y compañeros", p: "/s/san-andres-kim-taegon-y-companeros/" }],
        "9-21": [{ n: "San Mateo", p: "/s/san-mateo-evangelista/" }],
        "9-23": [{ n: "Lino", p: "/p/papa-lino/" }, { n: "Padre Pío", p: "/p/padre-pio/" }],
        "9-24": [{ n: "Santa Tecla", p: "/s/santa-tecla/" }],
        "9-26": [{ n: "San Cosme", p: "/s/san-cosme/" }, { n: "San Damián", p: "/s/san-damian/" }],
        "9-27": [{ n: "San Vicente de Paúl", p: "/s/san-vicente-de-paul/" }],
        "9-28": [{ n: "San Venceslao", p: "/s/san-venceslao/" }, { n: "Lorenzo Ruiz", p: "/s/san-lorenzo-ruiz/" }],
        "9-29": [{ n: "Arcángeles Miguel, Gabriel y Rafael", p: "/s/santos-arcangeles-miguel-gabriel-y-rafael/" }],
        "9-30": [{ n: "San Jerónimo", p: "/s/san-jeronimo/" }],
        "10-1": [{ n: "Santa Teresa del Niño Jesús", p: "/s/santa-teresa-de-lisieux/" }],
        "10-2": [{ n: "Ángeles Custodios", p: "/s/santos-angeles-custodios/" }],
        "10-4": [{ n: "San Amón de Nitria", p: "/s/san-amon-de-nitria/" }, { n: "San Francisco de Asís", p: "/s/san-francisco-de-asis/" }],
        "10-5": [{ n: "Santa María Faustina Kowalska", p: "/s/santa-maria-faustina-kowalska/" }],
        "10-6": [{ n: "San Bruno", p: "/s/san-bruno/" }],
        "10-9": [{ n: "Juan Leonardi", p: "/s/san-juan-leonardi/" }, { n: "San Dionisio y compañeros", p: "/s/san-dionisio-y-companeros/" }],
        "10-10": [{ n: "San Francisco de Borja", p: "/s/san-francisco-de-borja/" }],
        "10-11": [{ n: "Nuestra Señora de Begoña", p: "/n/nuestra-senora-de-begona/" }, { n: "San Juan XXIII", p: "/s/san-juan-xxiii/" }],
        "10-12": [{ n: "Nuestra Señora del Pilar", p: "/n/nuestra-senora-del-pilar/" }, { n: "San Cornelio", p: "/s/san-cornelio/" }],
        "10-13": [{ n: "San Eduardo", p: "/s/san-eduardo/" }],
        "10-14": [{ n: "San Calixto I", p: "/p/papa-calixto-i/" }],
        "10-15": [{ n: "Virgen de Estíbaliz", p: "/v/virgen-de-estibaliz/" }, { n: "Santa Teresa de Ávila", p: "/s/santa-teresa-de-avila/" }],
        "10-16": [{ n: "Margarita María de Alacoque", p: "/s/santa-margarita-maria-de-alacoque/" }, { n: "Santa Eduvigis", p: "/s/santa-eduvigis/" }],
        "10-17": [{ n: "Ignacio de Antioquía", p: "/s/san-ignacio-de-antioquia/" }],
        "10-18": [{ n: "San Lucas Evangelista", p: "/s/san-lucas-evangelista/" }],
        "10-19": [{ n: "San Pedro de Alcántara", p: "/s/san-pedro-de-alcantara/" }, { n: "San Isaac Jogues y compañeros", p: "/s/san-isaac-jogues-y-companeros/" }],
        "10-22": [{ n: "San Juan Pablo II", p: "/s/san-juan-pablo-ii/" }],
        "10-23": [{ n: "San Juan de Capistrano", p: "/s/san-juan-de-capistrano/" }],
        "10-24": [{ n: "San Antonio María Claret", p: "/s/san-antonio-maria-claret/" }],
        "10-28": [{ n: "San Simón el Zelote", p: "/s/san-simon-zelote/" }, { n: "San Judas Tadeo", p: "/s/san-judas-tadeo/" }, { n: "San Simeón", p: "/s/san-simeon/" }],
        "10-29": [{ n: "Chiara Badano", p: "/b/beata-chiara-badano/" }],
        "11-1": [{ n: "Nuno Álvares Pereira", p: "/s/san-nuno-alvares-pereira/" }],
        "11-3": [{ n: "San Martín de Porres", p: "/s/san-martin-de-porres/" }],
        "11-4": [{ n: "Carlos Borromeo", p: "/s/san-carlos-borromeo/" }],
        "11-5": [{ n: "Zacarías", p: "/z/zacarias/" }],
        "11-8": [{ n: "Deusdedit", p: "/p/papa-deusdedit-adeodato-i/" }],
        "11-9": [{ n: "Dedicación de la Basílica de Letrán", p: "/b/basilica-de-san-juan-de-letran/" }],
        "11-10": [{ n: "San León Magno", p: "/s/san-leon-magno/" }],
        "11-11": [{ n: "San Martín", p: "/s/san-martin/" }],
        "11-12": [{ n: "San Nilo Sinaíta", p: "/s/san-nilo-sinaita/" }, { n: "San Josafat", p: "/s/san-josafat/" }],
        "11-15": [{ n: "San Alberto Magno", p: "/s/san-alberto-magno/" }, { n: "Milagro de la Virgen de Kibeho", p: "/m/milagro-de-la-virgen-de-kibeho-ruanda/" }],
        "11-16": [{ n: "Margarita de Escocia", p: "/s/santa-margarita-de-escocia/" }, { n: "Gertrudis la Grande", p: "/s/santa-gertrudis-la-grande/" }],
        "11-17": [{ n: "San Hugh el Grande", p: "/s/san-hugh-el-grande/" }, { n: "Isabel de Hungría", p: "/s/santa-isabel-de-hungria/" }],
        "11-18": [{ n: "Odo", p: "/s/san-odo/" }],
        "11-19": [{ n: "Ponciano", p: "/p/papa-ponciano/" }],
        "11-22": [{ n: "Santa Cecilia", p: "/s/santa-cecilia/" }],
        "11-23": [{ n: "San Clemente I", p: "/s/san-clemente-i/" }, { n: "Columbano", p: "/s/san-columbano/" }],
        "11-24": [{ n: "San Andrés Dung‑Lac", p: "/s/san-andres-dung-lac/" }],
        "11-25": [{ n: "Santa Catalina de Alejandría", p: "/s/santa-catalina-de-alejandria/" }],
        "11-26": [{ n: "San Silvestre Gozzolini", p: "/s/san-silvestre-gozzolini/" }],
        "11-27": [{ n: "Nuestra Señora de la Medalla Milagrosa", p: "/n/nuestra-senora-de-la-medalla-milagrosa/" }],
        "11-30": [{ n: "San Andrés", p: "/s/san-andres-apostol/" }],
        "12-3": [{ n: "San Francisco Javier", p: "/s/san-francisco-javier/" }],
        "12-4": [{ n: "Juan Damasceno", p: "/s/san-juan-damasceno/" }],
        "12-6": [{ n: "San Nicolás", p: "/p/papa-noel-san-nicolas/" }],
        "12-7": [{ n: "San Ambrosio de Milán", p: "/s/san-ambrosio-de-milan/" }],
        "12-8": [{ n: "Nuestra Señora de la Inmaculada Pureza", p: "/n/nuestra-senora-de-la-inmaculada-pureza/" }, { n: "Nuestra Señora de Andacollo", p: "/n/nuestra-senora-de-andacollo/" }, { n: "Narcisa de Jesús", p: "/s/santa-narcisa-de-jesus/" }, { n: "Purísima Virgen de Cotoca", p: "/p/purisima-virgen-de-cotoca/" }],
        "12-9": [{ n: "San Juan Diego Cuauhtlatoatzin", p: "/s/san-juan-diego-cuauhtlatoatzin/" }],
        "12-10": [{ n: "Nuestra Señora de Loreto", p: "/n/nuestra-senora-de-loreto/" }],
        "12-11": [{ n: "San Dámaso I", p: "/s/san-damaso-i/" }],
        "12-13": [{ n: "Santa Lucía", p: "/s/santa-lucia/" }],
        "12-14": [{ n: "San Juan de la Cruz", p: "/s/san-juan-de-la-cruz/" }],
        "12-21": [{ n: "San Pedro Canisio", p: "/s/san-pedro-canisio/" }],
        "12-26": [{ n: "San Esteban", p: "/s/san-esteban/" }],
        "12-27": [{ n: "San Juan Apóstol", p: "/s/san-juan-evangelista/" }],
        "12-28": [{ n: "Samuel", p: "/s/samuel-profeta/" }, { n: "Fiesta de los Santos Inocentes", p: "/f/fiesta-de-los-santos-inocentes/" }],
        "12-29": [{ n: "Tomás Becket", p: "/s/santo-tomas-becket/" }],
        "12-30": [{ n: "Virgen de la Nube", p: "/v/virgen-de-la-nube/" }],
        "12-31": [{ n: "San Silvestre I", p: "/s/san-silvestre-i/" }]
    };

    /* Cache por año: evita recalcular easter/advent en cada getLit */
    const _yc = {};
    function ydata(y) {
        if (_yc[y]) return _yc[y];
        const E = easter(y), adv = advent1(y);
        return _yc[y] = {
            E, adv,
            ashWed: addDays(E, -46),
            palm: addDays(E, -7),
            holyThu: addDays(E, -3),
            pent: addDays(E, 49),
            bap: baptism(y),
            dec25: new Date(y, 11, 25),
            mov: [
                [addDays(adv, -7), { fiesta: 'Cristo Rey del Universo', ...T.ord, color: '#78350f', icono: '👑', p: '/c/cristo-rey/' }],
                [addDays(E, -7), { fiesta: 'Domingo de Ramos', ...T.sem, p: '/d/domingo-de-ramos/' }],
                [addDays(E, -3), { fiesta: 'Jueves Santo', ...T.tri, p: '/j/jueves-santo/' }],
                [addDays(E, -2), { fiesta: 'Viernes Santo', ...T.tri, color: '#111827', p: '/v/viernes-santo/' }],
                [addDays(E, -1), { fiesta: 'Sábado Santo', ...T.tri, p: '/s/sabado-santo/' }],
                [E, { fiesta: 'Domingo de Resurrección', ...T.pas, icono: '✨', p: '/r/resurreccion/' }],
                [addDays(E, 8), { fiesta: 'San Vicente Ferrer', ...T.pas, icono: '✝️', p: '/s/san-vicente-ferrer/' }],
                [addDays(E, 39), { fiesta: 'Ascensión del Señor', ...T.pas, icono: '☁️', p: '/a/ascension/' }],
                [addDays(E, 49), { fiesta: 'Pentecostés', ...T.pas, color: '#7f1d1d', icono: '🔥', p: '/p/pentecostes/' }],
                [addDays(E, 56), { fiesta: 'Santísima Trinidad', ...T.ord, color: '#78350f', icono: '✝️', p: '/t/trinidad/' }],
                [addDays(E, 60), { fiesta: 'Corpus Christi', ...T.ord, color: '#78350f', icono: '🍞', p: '/c/corpus-christi/' }],
            ],
        };
    }

    function getLit(date) {
        const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
        const { E, adv, ashWed, palm, holyThu, pent, bap, dec25, mov } = ydata(y);
        for (const [day, data] of mov) if (sameDay(date, day)) return data;
        const s = SOLEM[`${m}-${d}`];
        if (s) return { tiempo: 'Solemnidad', color: '#b91c1c', icono: s.i, fiesta: s.n, p: s.p };
        if (date >= adv && date < dec25) return T.adv;
        if (date >= dec25) return T.nav;
        if (m === 1 && date <= bap) return T.nav;
        if (date >= ashWed && date < palm) return T.cua;
        if (date >= palm && date < holyThu) return T.sem;
        if (date >= holyThu && date < E) return T.tri;
        if (date >= E && date <= pent) return T.pas;
        return T.ord;
    }

    /* basePeriod: tiempo litúrgico subyacente sin fiestas ni solemnidades */
    function basePeriod(date) {
        const y = date.getFullYear(), m = date.getMonth() + 1;
        const { E, adv, ashWed, palm, holyThu, pent, bap, dec25 } = ydata(y);
        if (date >= adv && date < dec25) return T.adv;
        if (date >= dec25) return T.nav;
        if (m === 1 && date <= bap) return T.nav;
        if (date >= ashWed && date < palm) return T.cua;
        if (date >= palm && date < holyThu) return T.sem;  // Lun-Mié Semana Santa
        if (date >= holyThu && date < E) return T.tri;  // Jue-Sáb Triduo
        if (date >= E && date <= pent) return T.pas;  // Pascua inclusive Pentecostés
        return T.ord;
    }

    /* CSS aislado en Shadow DOM */
    const CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:host{display:block;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
font-size:16px;line-height:1.5;-webkit-text-size-adjust:100%;text-size-adjust:100%;--bg:#fafafa;--bg-s:#f8f9fa;--bd:#ddd;--tx:#333;--mu:#666;--lk:#0d6efd;--lkh:#0a58ca;--lit:#2d6a4f;--ph:#e0e9f9}
@media(prefers-color-scheme:dark){:host{--bg:#1a1a1a;--bg-s:#2d2d2d;--bd:#444;--tx:#c0c0c0;--mu:#ccc;--lk:#4dabf7;--lkh:#74c0fc;--lit:#4a8a6a;font-weight:300;letter-spacing:.01ch}}
#wt-ph{display:flex;flex-direction:column;gap:.5em;padding:.75em .85em;border:1px solid var(--bd);border-radius:4px;background:var(--bg)}
.ph-line{height:.75em;border-radius:3px;background:var(--ph);animation:ph-pulse 1.4s ease-in-out infinite}
.ph-line.w60{width:60%}.ph-line.w40{width:40%}.ph-line.w80{width:80%}.ph-line.w50{width:50%}
@keyframes ph-pulse{0%,100%{opacity:.45}50%{opacity:.9}}
@media(prefers-color-scheme:dark){#wt-ph,#wt-ph .ph-line{--ph:#383838}}
#wt{background:var(--bg);border:1px solid var(--bd);border-radius:4px;overflow:hidden;width:100%}
#hoy{background:var(--bg-s);border-bottom:1px solid var(--bd);padding:.7em .85em;display:flex;gap:.75em;align-items:center;min-width:0}
#stripe{width:3px;align-self:stretch;border-radius:2px;background:var(--lit);flex-shrink:0;transition:background .3s}
#body{flex:1;min-width:0;overflow:hidden}
#fecha{font-size:.67em;color:var(--mu);margin-bottom:.15em}
#tiempo{font-size:.97em;font-weight:700;line-height:1.2;color:var(--tx)}
#fiesta{font-size:.78em;color:var(--lk);margin-top:.1em;display:none}
#fecha,#tiempo,#fiesta,.en{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#tiempo a{color:inherit;text-decoration:none}
#tiempo a:hover,#fiesta a:hover,.en a:hover{text-decoration:underline}
#fiesta a{color:inherit;text-decoration:none}
#icono{font-size:1.35em;line-height:1;flex-shrink:0}
#lista{padding:.3em 0}
.row{display:grid;grid-template-columns:42px 1fr;gap:0 .65em;padding:.35em .85em;transition:background .1s;min-width:0}
.row:hover{background:var(--bg-s)}
.dt{font-size:.7em;color:var(--mu);font-style:italic;text-align:right;padding-top:.1em;line-height:1.35;flex-shrink:0}
.dow{display:block;font-size:.59em;font-style:normal;text-transform:uppercase;letter-spacing:.06em;color:var(--bd)}
.cel{min-width:0;overflow:hidden}
.en{font-size:.82em;font-weight:600;line-height:1.4;color:var(--tx)}
.en a{color:var(--lk);text-decoration:none}
.en a:hover{color:var(--lkh)}
#foot{padding:.45em .85em;border-top:1px solid var(--bd);text-align:center;font-size:.67em;color:var(--mu);background:var(--bg-s);white-space:nowrap;overflow:hidden}
#foot a{color:var(--lk);text-decoration:none}
#foot a:hover{color:var(--lkh);text-decoration:underline}
@media(max-width:220px){.row{grid-template-columns:30px 1fr;gap:0 .4em;padding:.3em .5em}#hoy{padding:.6em .5em}}`;

    const MO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    function render(root, days) {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const lit = getLit(today);

        root.querySelector('#stripe').style.background = lit.color;
        root.querySelector('#fecha').textContent =
            `${DOW[today.getDay()]}, ${today.getDate()} de ${MES[today.getMonth()]} de ${today.getFullYear()}`;

        // Siempre mostramos el periodo litúrgico real (sin fiestas ni solemnidades)
        const bp = basePeriod(today);
        root.querySelector('#tiempo').innerHTML = `<a href="${u(bp.p)}">${bp.tiempo}</a>`;

        // Build all today's items: moveable feast + fixed solemnity + saints
        {
            const todayM = today.getMonth() + 1, todayD = today.getDate();
            const todayKey = `${todayM}-${todayD}`;
            const items = [];
            if (lit.fiesta) items.push({ n: lit.fiesta, p: lit.p });
            if (SOLEM[todayKey] && !lit.fiesta) items.push({ n: SOLEM[todayKey].n, p: SOLEM[todayKey].p });
            (SAINTS[todayKey] || []).forEach(s => items.push(s));
            if (items.length) {
                const f = root.querySelector('#fiesta');
                f.style.display = 'block';
                f.innerHTML = items.map(e => `<a href="${u(e.p)}">${e.n}</a>`).join(' · ');
            }
        }
        root.querySelector('#icono').textContent = lit.icono;

        // Lista: construir HTML en string array, un solo innerHTML al final
        const rows = [];
        for (let i = 1; i <= days; i++) {
            const d = addDays(today, i);
            const m = d.getMonth() + 1, day = d.getDate();
            const key = `${m}-${day}`;
            const dl = getLit(d);
            // getLit ya prioriza móviles sobre SOLEM; confiamos en su resultado
            const isMov = !!dl.fiesta;
            const isSolem = !!SOLEM[key] && !dl.fiesta;
            const saints = SAINTS[key] || [];
            if (!isMov && !isSolem && !saints.length) continue;

            const items = [];
            if (isMov) items.push({ n: dl.fiesta, p: dl.p });
            if (isSolem) items.push({ n: SOLEM[key].n, p: SOLEM[key].p });
            saints.forEach(s => items.push(s));

            rows.push(
                `<div class="row"><div class="dt">${day} ${MO[m - 1]}<span class="dow">${DOW[d.getDay()]}</span></div>` +
                `<div class="cel">${items.map(e => `<div class="en"><a href="${u(e.p)}">${e.n}</a></div>`).join('')}</div></div>`
            );
        }
        root.querySelector('#lista').innerHTML = rows.join('');
    }

    function init(host) {
        if (host.shadowRoot) return; // ya inicializado
        const raw = parseInt(host.dataset.days, 10);
        const days = Math.max(0, Math.min(365, isNaN(raw) ? 14 : raw));

        const shadow = host.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = CSS;

        const wt = document.createElement('div');
        wt.id = 'wt';
        wt.innerHTML =
            `<div id="hoy"><div id="stripe"></div><div id="body">` +
            `<div id="fecha"></div><div id="tiempo"></div><div id="fiesta"></div>` +
            `</div><div id="icono"></div></div>` +
            `<div id="lista"></div>` +
            `<div id="foot"><a href="${BASE}">Wikitólica</a> · ` +
            `<a href="${BASE}/w/widget-calendario/">Ponlo en tu web</a></div>`;

        shadow.append(style, wt);
        render(shadow, days);
    }

    // Funciona en todos los casos: defer, async, inline, y carga post-onload
    function bootstrap() {
        document.querySelectorAll('#wikitolica-calendario').forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        // defer + readyState 'interactive'/'complete': DOM ya disponible
        bootstrap();
    }

    // Por si el script carga dinámicamente después del onload
    if (typeof window !== 'undefined') {
        window.WtCalendario = { init: bootstrap, initEl: init };
    }

})();
