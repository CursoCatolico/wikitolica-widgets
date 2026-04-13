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

    const T = {
        ord: { tiempo: 'Tiempo Ordinario', color: '#2d6a4f', icono: '📖', p: '/t/tiempo-ordinario/' },
        adv: { tiempo: 'Adviento', color: '#5b21b6', icono: '🕯️', p: '/a/adviento/' },
        nav: { tiempo: 'Navidad', color: '#8b5e0a', icono: '⭐', p: '/n/navidad/' },
        cua: { tiempo: 'Cuaresma', color: '#5b21b6', icono: '✝️', p: '/c/cuaresma/' },
        sem: { tiempo: 'Semana Santa', color: '#7f1d1d', icono: '🌿', p: '/s/semana-santa/' },
        tri: { tiempo: 'Triduo Pascual', color: '#1e1b4b', icono: '🕯️', p: '/t/triduo-pascual/' },
        pas: { tiempo: 'Tiempo de Pascua', color: '#78350f', icono: '✨', p: '/t/tiempo-de-pascua/' },
    };

    const SOLEM = {
        '1-1':  { n: 'Santa María Madre de Dios',             i: '👑', p: '/s/santa-maria-madre-de-dios/' },
        '1-6':  { n: 'Epifanía del Señor',                    i: '⭐', p: '/e/epifania/' },
        '2-2':  { n: 'Presentación del Señor',                i: '🕯️', p: '/f/fiesta-de-la-presentacion-del-senor/' },
        '2-11': { n: 'Nuestra Señora de Lourdes',             i: '💧', p: '/n/nuestra-senora-de-lourdes/' },
        '3-19': { n: 'San José, Esposo de la Virgen',         i: '⚒️', p: '/s/san-jose/' },
        '3-25': { n: 'Anunciación del Señor',                 i: '🕊️', p: '/s/solemnidad-de-la-anunciacion-del-senor/' },
        '6-24': { n: 'Natividad de San Juan Bautista',        i: '💧', p: '/s/san-juan-bautista/' },
        '6-29': { n: 'Santos Pedro y Pablo',                  i: '⚓', p: '/s/san-pedro/' },
        '7-16': { n: 'Nuestra Señora del Carmen',             i: '🌹', p: '/v/virgen-del-carmen/' },
        '8-6':  { n: 'Transfiguración del Señor',             i: '✨', p: '/t/transfiguracion/' },
        '8-15': { n: 'Asunción de la Virgen María',           i: '☁️', p: '/d/dogma-de-asuncion-en-cuerpo-y-alma-de-maria/' },
        '8-22': { n: 'Bienaventurada Virgen María Reina',     i: '👑', p: '/m/memoria-de-la-virgen-maria-reina/' },
        '9-8':  { n: 'Natividad de la Virgen María',          i: '🌸', p: '/n/natividad-de-maria/' },
        '9-14': { n: 'Exaltación de la Santa Cruz',           i: '✝️', p: '/f/fiesta-de-la-exaltacion-de-la-santa-cruz/' },
        '10-7': { n: 'Nuestra Señora del Rosario',            i: '📿', p: '/r/rosario/' },
        '11-1': { n: 'Todos los Santos',                      i: '😇', p: '/t/todos-los-santos-festividad/' },
        '11-2': { n: 'Fieles Difuntos',                       i: '🕯️', p: '/p/purgatorio/' },
        '11-21':{ n: 'Presentación de María',                 i: '🕯️', p: '/p/presentacion-de-la-virgen-maria-en-el-templo/' },
        '12-8': { n: 'Inmaculada Concepción de la Virgen',    i: '🌙', p: '/d/dogma-de-la-inmaculada-concepcion-de-maria/' },
        '12-12':{ n: 'Nuestra Señora de Guadalupe',           i: '🌹', p: '/n/nuestra-senora-de-guadalupe/' },
        '12-25':{ n: 'Natividad del Señor',                   i: '⭐', p: '/n/navidad/' },
    };

    const SAINTS = {
        "1-1":  [{ n: "San Basilio de Cesarea", p: "/s/san-basilio-de-cesarea/" }, { n: "Guillermo de Saint‑Benignus", p: "/s/san-guillermo-de-saint-benignus/" }],
        "1-2":  [{ n: "Gregorio Nacianceno", p: "/s/san-gregorio-nacianceno/" }],
        "1-3":  [{ n: "Genoveva", p: "/s/santa-genoveva-de-paris/" }],
        "1-6":  [{ n: "Nuestra Señora de los Reyes", p: "/n/nuestra-senora-de-los-reyes/" }, { n: "San Juan de Ribera", p: "/s/san-juan-de-ribera/" }],
        "1-7":  [{ n: "Raimundo de Peñafort", p: "/s/san-raimundo-de-penafort/" }],
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
        "2-1":  [{ n: "Santa Brígida de Irlanda", p: "/s/santa-brigida-de-irlanda/" }],
        "2-2":  [{ n: "Nuestra Señora de la Candelaria de Copiapó", p: "/n/nuestra-senora-de-la-candelaria-de-copiapo/" }, { n: "Nuestra Señora del Buen Suceso", p: "/n/nuestra-senora-del-buen-suceso/" }],
        "2-3":  [{ n: "San Blas", p: "/s/san-blas/" }],
        "2-4":  [{ n: "Juana de Valois", p: "/s/santa-juana-de-valois/" }],
        "2-5":  [{ n: "Santa Águeda", p: "/s/santa-agueda/" }],
        "2-6":  [{ n: "Dorotea de Cesarea", p: "/s/santa-dorotea/" }, { n: "San Pablo Miki y compañeros", p: "/s/san-pablo-miki-y-companeros/" }],
        "2-8":  [{ n: "San Jerónimo Emiliani", p: "/s/san-jeronimo-emiliani/" }, { n: "Josefina Bakhita", p: "/s/santa-josefina-bakhita/" }],
        "2-10": [{ n: "Santa Escolástica", p: "/s/santa-escolastica/" }],
        "2-12": [{ n: "Santa Eulalia", p: "/s/santa-eulalia/" }],
        "2-14": [{ n: "San Valentín", p: "/s/san-valentin/" }, { n: "San Cirilo", p: "/s/san-cirilo/" }, { n: "San Metodio", p: "/s/san-metodio/" }],
        "2-17": [{ n: "Siete Santos Fundadores de la Orden de los Siervos de María", p: "/s/siete-santos-fundadores-de-la-orden-de-los-siervos-de-maria/" }],
        "2-21": [{ n: "San Pedro Damián", p: "/s/san-pedro-damian/" }],
        "2-22": [{ n: "Cátedra de San Pedro", p: "/s/san-simon-pedro/" }],
        "2-23": [{ n: "Policarpo", p: "/s/san-policarpo/" }, { n: "Pedro Frelichowski", p: "/b/beato-pedro-frelichowski/" }],
        "2-27": [{ n: "San Leandro", p: "/s/san-leandro/" }, { n: "Mechtilde de Hackeborn", p: "/s/santa-mechtilde/" }],
        "3-1":  [{ n: "San David", p: "/s/san-david/" }, { n: "Félix III", p: "/p/papa-felix-iii-ii/" }],
        "3-3":  [{ n: "Katharine Drexel", p: "/s/santa-katherine-drexel/" }],
        "3-4":  [{ n: "Lucio I", p: "/p/papa-lucio-i/" }, { n: "San Casimiro", p: "/s/san-casimiro/" }],
        "3-7":  [{ n: "Santa Felicidad", p: "/s/santa-felicidad/" }, { n: "Perpetua", p: "/s/santa-perpetua/" }],
        "3-8":  [{ n: "San Juan de Dios", p: "/s/san-juan-de-dios/" }],
        "3-9":  [{ n: "Santa Francesca Romana", p: "/s/santa-francisca-romana/" }],
        "3-15": [{ n: "San Clemente María Hofbauer", p: "/s/san-clemente-maria-hofbauer/" }, { n: "Luisa de Marillac", p: "/s/santa-luisa-de-marillac/" }],
        "3-17": [{ n: "San Patricio", p: "/s/san-patricio/" }],
        "3-18": [{ n: "San Eduardo", p: "/s/san-eduardo/" }, { n: "Cirilo de Jerusalén", p: "/s/san-cirilo-de-jerusalen/" }],
        "3-19": [{ n: "San José", p: "/s/san-jose/" }],
        "3-23": [{ n: "San Toribio de Mogrovejo", p: "/s/san-toribio-de-mogrovejo/" }],
        "3-24": [{ n: "Óscar Romero", p: "/s/san-oscar-romero/" }],
        "3-25": [{ n: "Virgen de la Encarnación", p: "/v/virgen-de-la-encarnacion/" }],
        "3-28": [{ n: "Sixto III", p: "/p/papa-sixto-iii/" }],
        "4-2":  [{ n: "San Francisco de Paula", p: "/s/san-francisco-de-paula/" }],
        "4-7":  [{ n: "Juan Bautista de la Salle", p: "/s/san-juan-bautista-de-la-salle/" }],
        "4-8":  [{ n: "Julie Billiart", p: "/s/santa-julie-billiart/" }],
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
        "5-1":  [{ n: "San José Obrero", p: "/s/san-jose/" }],
        "5-2":  [{ n: "San Atanasio", p: "/s/san-atanasio/" }],
        "5-3":  [{ n: "Cruz de Caravaca", p: "/c/cruz-de-caravaca/" }, { n: "San Santiago el Menor", p: "/f/fiesta-de-san-santiago-el-menor/" }, { n: "San Felipe Apóstol", p: "/s/san-felipe/" }],
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
        "6-1":  [{ n: "Justino Mártir", p: "/s/san-justino-martir/" }],
        "6-3":  [{ n: "San Carlos Lwanga y compañeros", p: "/s/san-carlos-lwanga-y-companeros/" }],
        "6-4":  [{ n: "San Quirino de Siscia", p: "/s/san-quirino-de-sescia/" }],
        "6-5":  [{ n: "San Bonifacio", p: "/s/san-bonifacio/" }],
        "6-6":  [{ n: "Norberto", p: "/s/san-norberto/" }],
        "6-9":  [{ n: "San Efrén de Nísibe", p: "/s/san-efren-de-nisibe/" }],
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
        "7-1":  [{ n: "Sangre de Cristo", p: "/s/sangre-de-cristo/" }],
        "7-3":  [{ n: "Santo Tomás Apóstol", p: "/s/santo-tomas-apostol/" }],
        "7-4":  [{ n: "Pier Giorgio Frassati", p: "/s/san-pier-giorgio-frassati/" }, { n: "Isabel de Portugal", p: "/s/santa-isabel-de-portugal/" }],
        "7-5":  [{ n: "Antonio María Zaccaría", p: "/s/san-antonio-maria-zaccaria/" }],
        "7-6":  [{ n: "María Goretti", p: "/s/santa-maria-goretti/" }],
        "7-7":  [{ n: "Benedicto XI", p: "/p/papa-benedicto-xi/" }],
        "7-8":  [{ n: "San Kilian", p: "/s/san-kilian/" }],
        "7-9":  [{ n: "Estigmas de Santa Verónica Giuliani", p: "/e/estigmas-de-santa-veronica-giuliani/" }, { n: "San Agustín Zhao Rong y compañeros", p: "/s/san-agustin-zhao-rong-y-companeros/" }],
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
        "8-1":  [{ n: "Alfonso María de Ligorio", p: "/s/san-alfonso-maria-de-ligorio/" }],
        "8-2":  [{ n: "San Pedro Julián Eymard", p: "/s/san-pedro-julian-eymard/" }, { n: "San Eusebio de Vercelli", p: "/s/san-eusebio-de-vercelli/" }],
        "8-4":  [{ n: "San Juan María Vianney", p: "/s/san-juan-maria-vianney/" }],
        "8-6":  [{ n: "Nuestra Señora de Copacabana", p: "/n/nuestra-senora-de-copacabana/" }, { n: "Moisés", p: "/m/moises/" }],
        "8-7":  [{ n: "San Cayetano", p: "/s/san-cayetano/" }, { n: "San Sixto II", p: "/s/san-sixto-ii/" }],
        "8-8":  [{ n: "Domingo de Guzmán", p: "/s/santo-domingo-de-guzman/" }],
        "8-9":  [{ n: "Santa Teresa Benedicta de la Cruz", p: "/s/santa-teresa-benedicta-de-la-cruz/" }],
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
        "9-1":  [{ n: "Milagro eucarístico de Daroca", p: "/m/milagro-eucaristico-de-daroca-espana/" }],
        "9-2":  [{ n: "San Emerico", p: "/s/san-emerico/" }],
        "9-3":  [{ n: "San Gregorio I Magno", p: "/s/san-gregorio-i-magno/" }],
        "9-5":  [{ n: "Santa Teresa de Calcuta", p: "/s/santa-teresa-de-calcuta/" }],
        "9-8":  [{ n: "Tomás de Villanueva", p: "/s/santo-tomas-de-villanueva/" }],
        "9-9":  [{ n: "Pedro Claver", p: "/s/san-pedro-claver/" }],
        "9-10": [{ n: "Nicolás de Tolentino", p: "/s/san-nicolas-de-tolentino/" }],
        "9-13": [{ n: "Juan Crisóstomo", p: "/s/san-juan-crisostomo/" }],
        "9-15": [{ n: "María Santísima del Mayor Dolor", p: "/m/maria-santisima-del-mayor-dolor/" }, { n: "Catalina de Génova", p: "/s/santa-catalina-de-genova/" }, { n: "San Pedro de Arbués", p: "/s/san-pedro-de-arbues/" }],
        "9-16": [{ n: "San Juan Macías", p: "/s/san-juan-macias/" }, { n: "San Cornelio", p: "/p/papa-cornelio/" }],
        "9-17": [{ n: "San Roberto Belarmino", p: "/s/san-roberto-belarmino/" }, { n: "Estigmas de San Francisco", p: "/e/estigmas-de-san-francisco-de-asis/" }],
        "9-19": [{ n: "Jenaro de Benevento", p: "/s/san-jenaro/" }],
        "9-20": [{ n: "San Andrés Kim Taegon", p: "/s/san-andres-kim-taegon/" }],
        "9-21": [{ n: "San Mateo", p: "/s/san-mateo-apostol/" }],
        "9-22": [{ n: "San Mauricio", p: "/s/san-mauricio/" }],
        "9-23": [{ n: "San Pío de Pietrelcina", p: "/s/san-pio-de-pietrelcina/" }],
        "9-26": [{ n: "Cosme y Damián", p: "/s/san-cosme-y-san-damian/" }],
        "9-27": [{ n: "San Vicente de Paúl", p: "/s/san-vicente-de-paul/" }],
        "9-28": [{ n: "San Wenceslao", p: "/s/san-wenceslao/" }, { n: "San Lorenzo Ruiz", p: "/s/san-lorenzo-ruiz/" }],
        "9-29": [{ n: "San Miguel Arcángel", p: "/s/san-miguel-arcangel/" }, { n: "San Gabriel Arcángel", p: "/s/san-gabriel-arcangel/" }, { n: "San Rafael Arcángel", p: "/s/san-rafael-arcangel/" }],
        "9-30": [{ n: "San Jerónimo", p: "/s/san-jeronimo/" }],
        "10-1": [{ n: "Santa Teresita del Niño Jesús", p: "/s/santa-teresita-del-nino-jesus/" }],
        "10-2": [{ n: "Ángel de la Guarda", p: "/a/angel-de-la-guarda/" }],
        "10-4": [{ n: "San Francisco de Asís", p: "/s/san-francisco-de-asis/" }],
        "10-5": [{ n: "Santa Faustina Kowalska", p: "/s/santa-maria-faustina-kowalska/" }],
        "10-6": [{ n: "San Bruno", p: "/s/san-bruno/" }],
        "10-9": [{ n: "San Dionisio Areopagita", p: "/s/san-dionisio-areopagita/" }, { n: "San Juan Leonardi", p: "/s/san-juan-leonardi/" }],
        "10-11":[{ n: "San Juan XXIII", p: "/s/san-juan-xxiii/" }],
        "10-13":[{ n: "Milagro del Sol de Fátima", p: "/m/milagro-del-sol-de-fatima-portugal/" }],
        "10-14":[{ n: "San Calixto I", p: "/p/papa-calixto-i/" }],
        "10-15":[{ n: "Santa Teresa de Jesús", p: "/s/santa-teresa-de-jesus/" }],
        "10-16":[{ n: "San Galo", p: "/s/san-galo/" }, { n: "Santa Margarita María de Alacoque", p: "/s/santa-margarita-maria-de-alacoque/" }],
        "10-17":[{ n: "San Ignacio de Antioquía", p: "/s/san-ignacio-de-antioquia/" }],
        "10-18":[{ n: "San Lucas Evangelista", p: "/s/san-lucas-evangelista/" }],
        "10-19":[{ n: "San Juan de Brébeuf", p: "/s/san-juan-de-brebeuf/" }, { n: "San Isaac Jogues", p: "/s/san-isaac-jogues/" }],
        "10-22":[{ n: "San Juan Pablo II", p: "/s/san-juan-pablo-ii/" }],
        "10-23":[{ n: "San Juan de Capistrano", p: "/s/san-juan-de-capistrano/" }],
        "10-24":[{ n: "San Antonio María Claret", p: "/s/san-antonio-maria-claret/" }],
        "10-28":[{ n: "San Simón Apóstol", p: "/s/san-simon-apostol/" }, { n: "San Judas Tadeo", p: "/s/san-judas-tadeo/" }],
        "11-3": [{ n: "San Martín de Porres", p: "/s/san-martin-de-porres/" }],
        "11-4": [{ n: "San Carlos Borromeo", p: "/s/san-carlos-borromeo/" }],
        "11-5": [{ n: "San Zacarías", p: "/s/san-zacarias/" }],
        "11-9": [{ n: "Dedicación de la Basílica de Letrán", p: "/b/basilica-de-san-juan-de-letran/" }],
        "11-10":[{ n: "San León Magno", p: "/s/san-leon-i-magno/" }],
        "11-11":[{ n: "San Martín de Tours", p: "/s/san-martin-de-tours/" }],
        "11-12":[{ n: "San Josafat", p: "/s/san-josafat/" }],
        "11-13":[{ n: "San Leandro", p: "/s/san-leandro/" }],
        "11-15":[{ n: "San Alberto Magno", p: "/s/san-alberto-magno/" }],
        "11-16":[{ n: "Santa Margarita de Escocia", p: "/s/santa-margarita-de-escocia/" }, { n: "Santa Gertrudis", p: "/s/santa-gertrudis-la-grande/" }],
        "11-17":[{ n: "Santa Isabel de Hungría", p: "/s/santa-isabel-de-hungria/" }],
        "11-18":[{ n: "Dedicación de la Basílica de San Pedro", p: "/b/basilica-de-san-pedro/" }],
        "11-22":[{ n: "Santa Cecilia", p: "/s/santa-cecilia/" }],
        "11-23":[{ n: "San Clemente I", p: "/p/papa-clemente-i/" }, { n: "San Columbano", p: "/s/san-columbano/" }],
        "11-24":[{ n: "San Andrés Dung-Lac y compañeros", p: "/s/san-andres-dung-lac/" }],
        "11-25":[{ n: "Santa Catalina de Alejandría", p: "/s/santa-catalina-de-alejandria/" }],
        "11-26":[{ n: "San Silvestre Gozzolini", p: "/s/san-silvestre-gozzolini/" }],
        "11-27":[{ n: "Nuestra Señora de la Medalla Milagrosa", p: "/n/nuestra-senora-de-la-medalla-milagrosa/" }],
        "11-30":[{ n: "San Andrés", p: "/s/san-andres-apostol/" }],
        "12-3": [{ n: "San Francisco Javier", p: "/s/san-francisco-javier/" }],
        "12-4": [{ n: "Juan Damasceno", p: "/s/san-juan-damasceno/" }],
        "12-6": [{ n: "San Nicolás", p: "/p/papa-noel-san-nicolas/" }],
        "12-7": [{ n: "San Ambrosio de Milán", p: "/s/san-ambrosio-de-milan/" }],
        "12-8": [{ n: "Nuestra Señora de la Inmaculada Pureza", p: "/n/nuestra-senora-de-la-inmaculada-pureza/" }, { n: "Nuestra Señora de Andacollo", p: "/n/nuestra-senora-de-andacollo/" }, { n: "Narcisa de Jesús", p: "/s/santa-narcisa-de-jesus/" }, { n: "Purísima Virgen de Cotoca", p: "/p/purisima-virgen-de-cotoca/" }],
        "12-9": [{ n: "San Juan Diego Cuauhtlatoatzin", p: "/s/san-juan-diego-cuauhtlatoatzin/" }],
        "12-10":[{ n: "Nuestra Señora de Loreto", p: "/n/nuestra-senora-de-loreto/" }],
        "12-11":[{ n: "San Dámaso I", p: "/s/san-damaso-i/" }],
        "12-13":[{ n: "Santa Lucía", p: "/s/santa-lucia/" }],
        "12-14":[{ n: "San Juan de la Cruz", p: "/s/san-juan-de-la-cruz/" }],
        "12-21":[{ n: "San Pedro Canisio", p: "/s/san-pedro-canisio/" }],
        "12-26":[{ n: "San Esteban", p: "/s/san-esteban/" }],
        "12-27":[{ n: "San Juan Apóstol", p: "/s/san-juan-evangelista/" }],
        "12-28":[{ n: "Samuel", p: "/s/samuel-profeta/" }, { n: "Fiesta de los Santos Inocentes", p: "/f/fiesta-de-los-santos-inocentes/" }],
        "12-29":[{ n: "Tomás Becket", p: "/s/santo-tomas-becket/" }],
        "12-30":[{ n: "Virgen de la Nube", p: "/v/virgen-de-la-nube/" }],
        "12-31":[{ n: "San Silvestre I", p: "/s/san-silvestre-i/" }],
    };

    const _yc = {};
    function ydata(y) {
        if (_yc[y]) return _yc[y];
        const E = easter(y), adv = advent1(y), bap = baptism(y);
        const ashWed = addDays(E, -46), dec25 = new Date(y, 11, 25);
        return _yc[y] = {
            E, adv,
            ashWed: addDays(E, -46),
            palm: addDays(E, -7),
            holyThu: addDays(E, -3),
            pent: addDays(E, 49),
            bap: baptism(y),
            dec25: new Date(y, 11, 25),
            mov: [
                [addDays(adv, -7), { fiesta: 'Cristo Rey del Universo', ...T.ord, color: '#78350f', icono: '👑', p: '/s/solemnidad-de-cristo-rey/' }],
                [addDays(adv, 14), { fiesta: 'Domingo de Gaudete',      ...T.adv, color: '#e11d48', icono: '🌹', p: '/d/domingo-de-gaudete/' }],
                [addDays(dec25, (7 - dec25.getDay() + 7) % 7), 
                       { fiesta: 'Fiesta de la Sagrada Familia',   ...T.nav, color: '#78350f', icono: '👨‍👩‍👧', p: '/f/fiesta-de-la-sagrada-familia/' }],
                [bap,              { fiesta: 'Bautismo del Señor',      ...T.ord, color: '#78350f', icono: '💧', p: '/s/solemnidad-del-bautismo-del-senor/' }],
                [ashWed,           { fiesta: 'Miércoles de Ceniza',     ...T.cua, color: '#1f2937', icono: '⚱️', p: '/m/miercoles-de-ceniza/' }],
                [addDays(ashWed, 28),{ fiesta: 'Domingo Laetare',       ...T.cua, color: '#e11d48', icono: '🌹', p: '/d/domingo-laetare/' }],
                [addDays(E, -7),   { fiesta: 'Domingo de Ramos',        ...T.sem, p: '/d/domingo-de-ramos/' }],
                [addDays(E, -3),   { fiesta: 'Jueves Santo',            ...T.tri, p: '/j/jueves-santo/' }],
                [addDays(E, -2),   { fiesta: 'Viernes Santo',           ...T.tri, color: '#111827', p: '/v/viernes-santo/' }],
                [addDays(E, -1),   { fiesta: 'Sábado Santo',            ...T.tri, p: '/s/sabado-santo/' }],
                [E,                { fiesta: 'Domingo de Resurrección', ...T.pas, icono: '✨', p: '/d/domingo-de-resurreccion/' }],
                [addDays(E, 7),    { fiesta: 'Domingo de Misericordia', ...T.pas, color: '#7f1d1d', icono: '❤️', p: '/d/domingo-de-la-divina-misericordia/' }],
                [addDays(E, 8),    { fiesta: 'San Vicente Ferrer',      ...T.pas, icono: '✝️', p: '/s/san-vicente-ferrer/' }],
                [addDays(E, 21),   { fiesta: 'Domingo del Buen Pastor', ...T.pas, icono: '🐑', p: '/d/domingo-del-buen-pastor/' }],
                [addDays(E, 39),   { fiesta: 'Ascensión del Señor',     ...T.pas, icono: '☁️', p: '/s/solemnidad-de-la-ascension/' }],
                [addDays(E, 49),   { fiesta: 'Pentecostés',             ...T.pas, color: '#7f1d1d', icono: '🔥', p: '/s/solemnidad-de-pentecostes/' }],
                [addDays(E, 56),   { fiesta: 'Santísima Trinidad',      ...T.ord, color: '#78350f', icono: '✝️', p: '/s/solemnidad-de-la-santisima-trinidad/' }],
                [addDays(E, 60),   { fiesta: 'Corpus Christi',          ...T.ord, color: '#78350f', icono: '🍞', p: '/s/solemnidad-de-corpus-christi/' }],
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

    function basePeriod(date) {
        const y = date.getFullYear(), m = date.getMonth() + 1;
        const { E, adv, ashWed, palm, holyThu, pent, bap, dec25 } = ydata(y);
        if (date >= adv && date < dec25) return T.adv;
        if (date >= dec25) return T.nav;
        if (m === 1 && date <= bap) return T.nav;
        if (date >= ashWed && date < palm) return T.cua;
        if (date >= palm && date < holyThu) return T.sem;
        if (date >= holyThu && date < E) return T.tri;
        if (date >= E && date <= pent) return T.pas;
        return T.ord;
    }

    function descargarICS() {
        const ahora = new Date();
        const yActual = ahora.getFullYear();
        const stamp = ahora.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const seq = Math.floor(ahora.getTime() / 1000);
        const pad = n => n.toString().padStart(2, '0');
        const fDate = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

        const esc = str => {
            if (!str) return '';
            return str.replace(/<\/?[^>]+(>|$)/g, '')
                      .replace(/\\/g, '\\\\')
                      .replace(/;/g, '\\;')
                      .replace(/,/g, '\\,')
                      .replace(/\n/g, '\\n')
                      .trim();
        };

        const generarUID = (prefix, texto) => {
            const clean = texto.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]/g, '')
                .substring(0, 40);
            return `${prefix}-${clean}@wikitolica.com`;
        };

        const crearEvento = (id, fecha, titulo, desc, url, esFijo) => {
            const dStart = fDate(fecha);
            const dNext = new Date(fecha); dNext.setDate(dNext.getDate() + 1);
            const dEnd = fDate(dNext);
            const resumen = esc(titulo);
            const ev = [
                'BEGIN:VEVENT',
                `UID:${id}`,
                `DTSTAMP:${stamp}`,
                `SEQUENCE:${seq}`,
                `DTSTART;VALUE=DATE:${dStart}`,
                `DTEND;VALUE=DATE:${dEnd}`,
                'TRANSP:TRANSPARENT',
                'CATEGORIES:Wikitólica',
                `SUMMARY:${resumen}`,
                `ORGANIZER;CN="Wikitólica":mailto:contacto@wikitolica.com`,
                `DESCRIPTION:${esc(desc)}`,
                `URL;VALUE=URI:${url}`,
                'STATUS:CONFIRMED',
                'CLASS:PUBLIC'
            ];
            if (esFijo) ev.splice(8, 0, 'RRULE:FREQ=YEARLY');
            ev.push(
                'BEGIN:VALARM',
                'ACTION:DISPLAY',
                `DESCRIPTION:Recordatorio: ${resumen}`,
                'TRIGGER;VALUE=DURATION:PT10H',
                'END:VALARM',
                'END:VEVENT'
            );
            return ev;
        };

        const lineas = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Wikitolica//Calendario Wikitólica//2026',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:Calendario Wikitólica',
            'X-WR-CALDESC:Calendario Litúrgico Católico Romano (Rito Romano) - Wikitólica',
            'X-WR-TIMEZONE:Europe/Madrid',
        ];

        // 1. SOLEM fijas con RRULE:FREQ=YEARLY
        for (const [key, s] of Object.entries(SOLEM)) {
            const [m, d] = key.split('-').map(Number);
            const link = BASE + s.p;
            const id = generarUID(`fijo-${pad(m)}${pad(d)}`, s.n);
            lineas.push(...crearEvento(id, new Date(2024, m - 1, d), s.n,
                `Grado: Solemnidad\nMás info: ${link}`, link, true));
        }

        // 2. SAINTS fijos con RRULE:FREQ=YEARLY
        for (const [key, saints] of Object.entries(SAINTS)) {
            const [m, d] = key.split('-').map(Number);
            for (const s of saints) {
                const link = BASE + s.p;
                const id = generarUID(`fijo-${pad(m)}${pad(d)}`, s.n);
                lineas.push(...crearEvento(id, new Date(2024, m - 1, d), s.n,
                    `Grado: Santoral\nMás info: ${link}`, link, true));
            }
        }

        // 3. Móviles: año actual -1 hasta +9 (10 años vista + histórico reciente)
        for (let y = yActual - 1; y < yActual + 10; y++) {
            try {
                const { mov } = ydata(y);
                for (const [fecha, info] of mov) {
                    const link = info.p ? (BASE + info.p) : BASE;
                    const id = generarUID(`mov-${y}`, info.fiesta);
                    lineas.push(...crearEvento(id, fecha, info.fiesta,
                        `${info.tiempo || 'Liturgia'}\nMás info: ${link}`, link, false));
                }
            } catch (e) {
                console.warn(`Error procesando año ${y}:`, e);
            }
        }

        lineas.push('END:VCALENDAR');

        try {
            const blob = new Blob([lineas.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const lnk = document.createElement('a');
            lnk.href = url;
            lnk.download = 'calendario_wikitolica.ics';
            lnk.style.display = 'none';
            document.body.appendChild(lnk);
            lnk.click();
            setTimeout(() => {
                if (lnk.parentNode) document.body.removeChild(lnk);
                URL.revokeObjectURL(url);
            }, 1000);
        } catch (err) {
            console.error('Fallo en la descarga del ICS:', err);
        }
    }

    const CSS = `
#wikitolica-calendario,.wikitolica-calendario{display:block;margin:0;padding:0;box-sizing:border-box}
.wikitolica-calendario-wt{
  all:initial;display:block;box-sizing:border-box;container-type:inline-size;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size:16px;line-height:1.5;-webkit-text-size-adjust:100%;text-size-adjust:100%;
  color:var(--wt-tx);background:var(--wt-bg);border:1px solid var(--wt-bd);border-radius:4px;overflow:hidden;width:100%;
  --wt-bg:#fafafa;--wt-bg-s:#f8f9fa;--wt-bd:#ddd;--wt-tx:#333;--wt-mu:#666;--wt-dow:#999;--wt-lk:#0d6efd;--wt-lkh:#0a58ca
}
@media(prefers-color-scheme:dark){.wikitolica-calendario-wt{
  --wt-bg:#1a1a1a;--wt-bg-s:#2d2d2d;--wt-bd:#444;--wt-tx:#c0c0c0;--wt-mu:#888;--wt-dow:#666;--wt-lk:#4dabf7;--wt-lkh:#74c0fc;
  font-weight:300;letter-spacing:.01ch
}}
.wikitolica-calendario-wt *,.wikitolica-calendario-wt *::before,.wikitolica-calendario-wt *::after{
  box-sizing:border-box;margin:0;padding:0;
  font-family:inherit;font-size:inherit;font-weight:inherit;font-style:normal;
  line-height:inherit;letter-spacing:inherit;word-spacing:normal;
  text-transform:none;text-decoration:none;vertical-align:baseline;color:inherit
}
.wikitolica-calendario-wt .wikitolica-calendario-a{color:var(--wt-lk);text-decoration:none;cursor:pointer}
.wikitolica-calendario-wt .wikitolica-calendario-a:hover{text-decoration:underline;color:var(--wt-lkh)}
.wikitolica-calendario-wt .wikitolica-calendario-hoy{background:var(--wt-bg-s);border-bottom:1px solid var(--wt-bd);padding:.7em .85em;display:flex;gap:.75em;align-items:center;min-width:0}
.wikitolica-calendario-wt .wikitolica-calendario-stripe{width:3px;align-self:stretch;border-radius:2px;flex-shrink:0;transition:background .3s}
.wikitolica-calendario-wt .wikitolica-calendario-body{flex:1;min-width:0;overflow:hidden}
.wikitolica-calendario-wt .wikitolica-calendario-fecha{font-size:.67em;color:var(--wt-mu);margin-bottom:.15em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wikitolica-calendario-wt .wikitolica-calendario-tiempo{font-size:.97em;font-weight:700;line-height:1.2;color:var(--wt-tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wikitolica-calendario-wt .wikitolica-calendario-tiempo .wikitolica-calendario-a{color:inherit}
.wikitolica-calendario-wt .wikitolica-calendario-fiesta{font-size:.78em;color:var(--wt-lk);margin-top:.1em;display:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wikitolica-calendario-wt .wikitolica-calendario-fiesta .wikitolica-calendario-a{color:inherit}
.wikitolica-calendario-wt .wikitolica-calendario-icono{font-size:1.35em;line-height:1;flex-shrink:0}
.wikitolica-calendario-wt .wikitolica-calendario-addcal{padding:.38em .85em;border-bottom:1px solid var(--wt-bd);text-align:center;font-size:.7em;color:var(--wt-mu);background:var(--wt-bg)}
.wikitolica-calendario-wt .wikitolica-calendario-addcal .wikitolica-calendario-a{color:var(--wt-mu)}
.wikitolica-calendario-wt .wikitolica-calendario-addcal .wikitolica-calendario-a:hover{color:var(--wt-lk)}
.wikitolica-calendario-wt .wikitolica-calendario-lista{padding:.3em 0}
.wikitolica-calendario-wt .wikitolica-calendario-row{display:grid;grid-template-columns:42px 1fr;gap:0 .65em;padding:.35em .85em;transition:background .1s;min-width:0}
.wikitolica-calendario-wt .wikitolica-calendario-row:hover{background:var(--wt-bg-s)}
.wikitolica-calendario-wt .wikitolica-calendario-dt{font-size:.7em;color:var(--wt-mu);font-style:italic;text-align:right;padding-top:.1em;line-height:1.35;flex-shrink:0}
.wikitolica-calendario-wt .wikitolica-calendario-dow{display:block;font-size:.59em;font-style:normal;text-transform:uppercase;letter-spacing:.06em;color:var(--wt-dow)}
.wikitolica-calendario-wt .wikitolica-calendario-cel{min-width:0;overflow:hidden}
.wikitolica-calendario-wt .wikitolica-calendario-en{font-size:.82em;font-weight:600;line-height:1.4;color:var(--wt-tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wikitolica-calendario-wt .wikitolica-calendario-en .wikitolica-calendario-a{color:var(--wt-lk)}
.wikitolica-calendario-wt .wikitolica-calendario-en .wikitolica-calendario-a:hover{color:var(--wt-lkh)}
.wikitolica-calendario-wt .wikitolica-calendario-foot{padding:.45em .85em;border-top:1px solid var(--wt-bd);text-align:center;font-size:.67em;color:var(--wt-mu);background:var(--wt-bg-s);white-space:nowrap;overflow:hidden}
.wikitolica-calendario-wt .wikitolica-calendario-foot .wikitolica-calendario-a{color:var(--wt-lk)}
.wikitolica-calendario-wt .wikitolica-calendario-foot .wikitolica-calendario-a:hover{color:var(--wt-lkh);text-decoration:underline}
.wikitolica-calendario-wt[data-wt-narrow] .wikitolica-calendario-hoy{padding:.55em .55em;gap:.55em}
.wikitolica-calendario-wt[data-wt-narrow] .wikitolica-calendario-addcal{padding:.35em .55em}
.wikitolica-calendario-wt[data-wt-narrow] .wikitolica-calendario-row{grid-template-columns:34px 1fr;gap:0 .35em;padding:.3em .55em}
.wikitolica-calendario-wt[data-wt-narrow] .wikitolica-calendario-foot{padding:.4em .55em}
`;

    const MO  = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const DOW = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

    const SELF = /^(www\.)?wikitolica\.com$/.test(typeof location !== 'undefined' ? location.hostname : '');
    const TA = SELF ? '' : ' target="_blank" rel="noopener"';
    const a = (href, text) => `<a href="${href}"${TA} class="wikitolica-calendario-a">${text}</a>`;

    function init(host) {
        if (host.dataset.loaded) return;
        host.dataset.loaded = '1';

        const raw = parseInt(host.dataset.days, 10);
        const days = Math.max(0, Math.min(365, isNaN(raw) ? 14 : raw));

        if (!document.getElementById('wikitolica-calendario-style')) {
            const s = document.createElement('style');
            s.id = 'wikitolica-calendario-style';
            s.textContent = CSS;
            document.head.appendChild(s);
        }

        const today = new Date(); today.setHours(0, 0, 0, 0);
        const lit = getLit(today);
        const bp = basePeriod(today);
        const todayKey = `${today.getMonth() + 1}-${today.getDate()}`;

        const fiestaItems = [];
        if (lit.fiesta) fiestaItems.push({ n: lit.fiesta, p: lit.p });
        if (SOLEM[todayKey] && !lit.fiesta) fiestaItems.push({ n: SOLEM[todayKey].n, p: SOLEM[todayKey].p });
        (SAINTS[todayKey] || []).forEach(s => fiestaItems.push(s));

        const fiestaHTML = fiestaItems.length
            ? `<div class="wikitolica-calendario-fiesta" style="display:block">${fiestaItems.map(e => a(u(e.p), e.n)).join('<br>')}</div>`
            : `<div class="wikitolica-calendario-fiesta"></div>`;

        const rows = [], events = [];
        for (let i = 1; i <= days; i++) {
            const d = addDays(today, i);
            const m = d.getMonth() + 1, day = d.getDate();
            const key = `${m}-${day}`;
            const dl = getLit(d);
            const isMov = !!dl.fiesta;
            const isSolem = !!SOLEM[key] && !dl.fiesta;
            const saints = SAINTS[key] || [];
            if (!isMov && !isSolem && !saints.length) continue;
            const items = [];
            if (isMov) items.push({ n: dl.fiesta, p: dl.p });
            if (isSolem) items.push({ n: SOLEM[key].n, p: SOLEM[key].p });
            saints.forEach(s => items.push(s));
            events.push({ date: d, items });
            rows.push(
                `<div class="wikitolica-calendario-row">` +
                `<div class="wikitolica-calendario-dt">${day}&nbsp;${MO[m - 1]}<span class="wikitolica-calendario-dow">${DOW[d.getDay()]}</span></div>` +
                `<div class="wikitolica-calendario-cel">${items.map(e => `<div class="wikitolica-calendario-en">${a(u(e.p), e.n)}</div>`).join('')}</div>` +
                `</div>`
            );
        }

        const addcalHTML = events.length
            ? `<div class="wikitolica-calendario-addcal"><a href="#" class="wikitolica-calendario-a wikitolica-calendario-addcal-btn">📅 Añade todo a tu calendario personal</a></div>`
            : '';

        host.innerHTML =
            `<div class="wikitolica-calendario-wt">` +
                `<div class="wikitolica-calendario-hoy">` +
                    `<div class="wikitolica-calendario-stripe" style="background:${lit.color}"></div>` +
                    `<div class="wikitolica-calendario-body">` +
                        `<div class="wikitolica-calendario-fecha">${DOW[today.getDay()]}, ${today.getDate()} de ${MES[today.getMonth()]} de ${today.getFullYear()}</div>` +
                        `<div class="wikitolica-calendario-tiempo">${a(u(bp.p), bp.tiempo)}</div>` +
                        fiestaHTML +
                    `</div>` +
                    `<div class="wikitolica-calendario-icono">${lit.icono}</div>` +
                `</div>` +
                addcalHTML +
                `<div class="wikitolica-calendario-lista">${rows.join('')}</div>` +
                `<div class="wikitolica-calendario-foot">${a(BASE, 'Wikitólica')} · ${a(`${BASE}/w/widget-calendario/`, 'Ponlo en tu web')}</div>` +
            `</div>`;

        const btn = host.querySelector('.wikitolica-calendario-addcal-btn');
        if (btn) {
            btn.addEventListener('click', e => { e.preventDefault(); descargarICS(); });
        }

        if (typeof ResizeObserver !== 'undefined') {
            const wt = host.firstElementChild;
            new ResizeObserver(([e]) => {
                wt.toggleAttribute('data-wt-narrow', e.contentRect.width < 280);
            }).observe(wt);
        }
    }

    function bootstrap() {
        document.querySelectorAll('#wikitolica-calendario,.wikitolica-calendario').forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

    if (typeof window !== 'undefined') {
        window.WtCalendario = window.WtCalendario || {};
        window.WtCalendario.init = bootstrap;
        window.WtCalendario.initEl = init;
        window.WtCalendario.descargarICS = descargarICS;
    }

})();
