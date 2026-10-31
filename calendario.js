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
    const holyFamily = y => { const d = new Date(y, 11, 25); return d.getDay() === 0 ? new Date(y, 11, 30) : addDays(d, 7 - d.getDay()); };

    // Solemnidades fijas que ceden ante la Semana Santa, la Octava de Pascua, un domingo de Cuaresma o el Sagrado Corazón.
    // No cubre la Pascua del 22 de abril (primera vez, 2057): Corpus coincide con San Juan y el Sagrado Corazón con San Pedro.
    function traslados(y, E) {
        const r = {};
        const jose = new Date(y, 2, 19), anun = new Date(y, 2, 25), juan = new Date(y, 5, 24);
        if (jose >= addDays(E, -7) && jose < E) r['3-19'] = addDays(E, -8);
        else if (jose.getDay() === 0) r['3-19'] = addDays(jose, 1);
        if (anun >= addDays(E, -7) && anun <= addDays(E, 7)) r['3-25'] = addDays(E, 8);
        else if (anun.getDay() === 0) r['3-25'] = addDays(anun, 1);
        if (sameDay(juan, addDays(E, 68))) r['6-24'] = new Date(y, 5, 23);
        return r;
    }

    const GRADO = { S: 'Solemnidad', F: 'Fiesta', M: 'Memoria', m: 'Memoria libre', C: 'Conmemoración' };

    const T = {
        ord: { tiempo: 'Tiempo Ordinario', color: '#2d6a4f', icono: '📖', p: '/t/tiempo-ordinario/' },
        adv: { tiempo: 'Adviento', color: '#5b21b6', icono: '🕯️', p: '/a/adviento/' },
        nav: { tiempo: 'Navidad', color: '#8b5e0a', icono: '⭐', p: '/f/fiesta-de-navidad/' },
        cua: { tiempo: 'Cuaresma', color: '#5b21b6', icono: '✝️', p: '/c/cuaresma/' },
        sem: { tiempo: 'Semana Santa', color: '#7f1d1d', icono: '🌿', p: '/s/semana-santa/' },
        tri: { tiempo: 'Triduo Pascual', color: '#1e1b4b', icono: '🕯️', p: '/t/triduo-pascual/' },
        pas: { tiempo: 'Tiempo de Pascua', color: '#78350f', icono: '✨', p: '/t/tiempo-de-pascua/' }
    };

    const SOLEM = {
        '1-1':  { n: 'Santa María Madre de Dios',             i: '👑', p: '/s/santa-maria-madre-de-dios/', g: 'S' },
        '1-6':  { n: 'Epifanía del Señor',                    i: '⭐', p: '/s/solemnidad-de-la-epifania/', g: 'S' },
        '2-2':  { n: 'Presentación del Señor',                i: '🕯️', p: '/f/fiesta-de-la-presentacion-del-senor/', g: 'F' },
        '2-11': { n: 'Nuestra Señora de Lourdes',             i: '💧', p: '/n/nuestra-senora-de-lourdes/', g: 'm' },
        '3-19': { n: 'San José, Esposo de la Virgen',         i: '⚒️', p: '/s/san-jose/', g: 'S' },
        '3-25': { n: 'Anunciación del Señor',                 i: '🕊️', p: '/s/solemnidad-de-la-anunciacion-del-senor/', g: 'S' },
        '6-24': { n: 'Natividad de San Juan Bautista',        i: '💧', p: '/s/san-juan-bautista/', g: 'S' },
        '6-29': { n: 'Santos Pedro y Pablo',                  i: '⚓', p: '/s/solemnidad-de-san-pedro-y-san-pablo/', g: 'S' },
        '7-16': { n: 'Nuestra Señora del Carmen',             i: '🌹', p: '/n/nuestra-senora-del-monte-carmelo/', g: 'M' },
        '7-25': { n: 'Santiago Apóstol',                      i: '🐚', p: '/s/santiago-apostol/', g: 'S' },
        '8-6':  { n: 'Transfiguración del Señor',             i: '✨', p: '/f/fiesta-de-la-transfiguracion-del-senor/', g: 'F' },
        '8-15': { n: 'Asunción de la Virgen María',           i: '☁️', p: '/s/solemnidad-de-la-asuncion-de-la-virgen-maria/', g: 'S' },
        '8-22': { n: 'Memoria de la Virgen María Reina',     i: '👑', p: '/m/memoria-de-la-virgen-maria-reina/', g: 'M' },
        '9-8':  { n: 'Natividad de la Virgen María',          i: '🌸', p: '/f/fiesta-de-la-natividad-de-la-virgen-maria/', g: 'F' },
        '9-14': { n: 'Exaltación de la Santa Cruz',           i: '✝️', p: '/f/fiesta-de-la-exaltacion-de-la-santa-cruz/', g: 'F' },
        '10-7': { n: 'Nuestra Señora del Rosario',            i: '📿', p: '/n/nuestra-senora-del-rosario/', g: 'M' },
        '10-12': { n: 'Nuestra Señora del Pilar',             i: '🌹', p: '/n/nuestra-senora-del-pilar/', g: 'F' },
        '11-1': { n: 'Todos los Santos',                      i: '😇', p: '/s/solemnidad-de-todos-los-santos/', g: 'S' },
        '11-2': { n: 'Fieles Difuntos',                       i: '🕯️', p: '/c/conmemoracion-de-todos-los-fieles-difuntos/', g: 'C' },
        '11-21':{ n: 'Presentación de la Virgen María en el templo',                 i: '🕯️', p: '/p/presentacion-de-la-virgen-maria-en-el-templo/', g: 'M' },
        '12-8': { n: 'Inmaculada Concepción de la Virgen',    i: '🌙', p: '/s/solemnidad-de-la-inmaculada-concepcion-de-la-virgen-maria/', g: 'S' },
        '12-12':{ n: 'Nuestra Señora de Guadalupe',           i: '🌹', p: '/n/nuestra-senora-de-guadalupe/', g: 'm' },
        '12-25':{ n: 'Natividad del Señor',                   i: '⭐', p: '/f/fiesta-de-navidad/', g: 'S' }
    };

    const SAINTS = {
        "1-1":  [{ n: "San Odilo de Cluny", p: "/s/san-odilo-de-cluny/" }, { n: "San Fulgencio de Ruspe", p: "/s/san-fulgencio-de-ruspe/" }],
        "1-2":  [{ n: "San Basilio de Cesarea", p: "/s/san-basilio-de-cesarea/" }, { n: "San Gregorio Nacianceno", p: "/s/san-gregorio-nacianceno/" }, { n: "San Telesforo", p: "/p/papa-telesforo/" }],
        "1-3":  [{ n: "Santísimo Nombre de Jesús", p: "/m/memoria-del-santisimo-nombre-de-jesus/" }, { n: "Santa Genoveva", p: "/s/santa-genoveva-de-paris/" }, { n: "San Antero", p: "/p/papa-antero/" }],
        "1-4":  [{ n: "Santa Isabel Ana Seton", p: "/s/santa-isabel-ana-seton/" }, { n: "San Manuel González García", p: "/s/san-manuel-gonzalez-garcia/" }],
        "1-5":  [{ n: "San Eduardo el Confesor", p: "/s/san-eduardo/" }, { n: "Santa Sinclética", p: "/s/santa-sincletica-de-alejandria/" }],
        "1-6":  [{ n: "San Juan de Ribera", p: "/s/san-juan-de-ribera/" }, { n: "Santa Rafaela María", p: "/s/santa-rafaela-maria/" }],
        "1-7":  [{ n: "San Raimundo de Peñafort", p: "/s/san-raimundo-de-penafort/" }, { n: "San Polieucto", p: "/s/san-polieucto/" }],
        "1-8":  [{ n: "San Lorenzo Justiniano", p: "/s/san-lorenzo-justiniano/" }, { n: "San Severino de Nórico", p: "/s/san-severino-de-norico/" }],
        "1-9":  [{ n: "San Eulogio de Córdoba", p: "/s/san-eulogio/" }, { n: "Beata Paulina Jaricot", p: "/s/santa-paulina-jaricot/" }],
        "1-10": [{ n: "Beata Ana de los Ángeles Monteagudo", p: "/b/beata-ana-de-los-angeles-monteagudo/" }, { n: "San Agatón", p: "/p/papa-agaton/" }, { n: "Beato Gregorio X", p: "/p/papa-gregorio-x/" }],
        "1-11": [{ n: "San Higino", p: "/p/papa-higino/" }],
        "1-12": [{ n: "San Benito Biscop", p: "/s/san-benito-biscop/" }, { n: "San Elredo de Rieval", p: "/s/san-elredo-de-rieval/" }, { n: "Santa Margarita Bourgeoys", p: "/s/santa-margarita-bourgeoys/" }],
        "1-13": [{ n: "San Hilario de Poitiers", p: "/s/san-hilario-de-poitiers/" }, { n: "San Remigio", p: "/s/san-remigio/" }],
        "1-14": [{ n: "San Félix de Nola", p: "/s/san-felix-de-nola/" }],
        "1-15": [{ n: "Santo Cristo de Esquipulas", p: "/s/santo-cristo-de-esquipulas/" }, { n: "San Arnold Janssen", p: "/s/san-arnold-janssen/" }, { n: "San Mauro", p: "/s/san-mauro/" }],
        "1-16": [{ n: "San Marcelo I", p: "/p/papa-marcelo-i/" }],
        "1-17": [{ n: "San Antonio Abad", p: "/s/san-antonio-abad/" }],
        "1-18": [{ n: "Santa Prisca", p: "/s/santa-priscila/" }],
        "1-19": [{ n: "San Macario el Viejo", p: "/s/san-macario-el-viejo/" }],
        "1-20": [{ n: "San Fabián", p: "/p/papa-fabian/" }, { n: "San Sebastián", p: "/s/san-sebastian/" }, { n: "San Fructuoso de Tarragona", p: "/s/san-fructuoso/" }],
        "1-21": [{ n: "Santa Inés", p: "/s/santa-ines/" }, { n: "Nuestra Señora de la Altagracia", p: "/n/nuestra-senora-de-la-altagracia/" }],
        "1-22": [{ n: "San Vicente Mártir", p: "/s/san-vicente-martir/" }, { n: "Beata Laura Vicuña", p: "/b/beata-laura-vicuna/" }, { n: "San Vicente Pallotti", p: "/s/san-vicente-pallotti/" }],
        "1-23": [{ n: "San Ildefonso de Toledo", p: "/s/san-ildefonso-de-toledo/" }],
        "1-24": [{ n: "San Francisco de Sales", p: "/s/san-francisco-de-sales/" }],
        "1-25": [{ n: "Conversión de Saulo (San Pablo)", p: "/c/conversion-de-saulo-san-pablo/" }],
        "1-26": [{ n: "San Timoteo", p: "/s/san-timoteo/" }, { n: "San Tito", p: "/s/san-tito/" }, { n: "Santa Paula", p: "/s/santa-paula/" }],
        "1-27": [{ n: "Santa Ángela Merici", p: "/s/santa-angela-de-merici/" }, { n: "San Vitaliano", p: "/p/papa-vitaliano/" }],
        "1-28": [{ n: "Santo Tomás de Aquino", p: "/s/santo-tomas-de-aquino/" }],
        "1-29": [{ n: "San Valero", p: "/s/san-valero/" }],
        "1-30": [{ n: "Santa Jacinta Mariscotti", p: "/s/santa-jacinta-mariscotti/" }],
        "1-31": [{ n: "San Juan Bosco", p: "/s/san-juan-bosco/" }],
        "2-1":  [{ n: "Santa Brígida de Irlanda", p: "/s/santa-brigida-de-irlanda/" }, { n: "Santa Veridiana", p: "/s/santa-veridiana/" }],
        "2-2":  [{ n: "Virgen de la Candelaria", p: "/v/virgen-de-la-candelaria/" }, { n: "Santa Juana de Lestonnac", p: "/s/santa-juana-de-lestonnac/" }],
        "2-3":  [{ n: "San Blas", p: "/s/san-blas/" }, { n: "San Ansgar (Óscar)", p: "/s/san-ansgar/" }, { n: "Nuestra Señora de Suyapa", p: "/n/nuestra-senora-de-suyapa/" }],
        "2-4":  [{ n: "Santa Juana de Valois", p: "/s/santa-juana-de-valois/" }, { n: "San José de Leonisa", p: "/s/san-jose-de-leonisa/" }],
        "2-5":  [{ n: "Santa Águeda", p: "/s/santa-agueda/" }, { n: "San Avito", p: "/s/san-avito/" }],
        "2-6":  [{ n: "San Pablo Miki y compañeros", p: "/l/los-26-martires-de-japon/" }, { n: "Santa Dorotea", p: "/s/santa-dorotea/" }],
        "2-7":  [{ n: "Beato Pío IX", p: "/p/papa-pio-ix/" }],
        "2-8":  [{ n: "San Jerónimo Emiliani", p: "/s/san-jeronimo-emiliani/" }, { n: "Santa Josefina Bakhita", p: "/s/santa-josefina-bakhita/" }],
        "2-9":  [{ n: "Santa Apolonia", p: "/s/santa-apolonia/" }],
        "2-10": [{ n: "Santa Escolástica", p: "/s/santa-escolastica/" }],
        "2-11": [{ n: "San Gregorio II", p: "/p/papa-gregorio-ii/" }, { n: "San Pascual I", p: "/p/papa-pascual-i/" }],
        "2-12": [{ n: "Santa Eulalia", p: "/s/santa-eulalia/" }, { n: "Beata Humbelina", p: "/s/santa-humbelina/" }],
        "2-13": [{ n: "Beato Jordán de Sajonia", p: "/b/beato-jordan-de-sajonia/" }],
        "2-14": [{ n: "Santos Cirilo y Metodio", p: "/s/san-metodio/" }, { n: "San Valentín", p: "/s/san-valentin/" }, { n: "San Juan Bautista de la Concepción", p: "/s/san-juan-bautista-de-la-concepcion/" }],
        "2-15": [{ n: "San Claudio de La Colombière", p: "/s/san-claudio-de-la-colombiere/" }, { n: "San Onésimo", p: "/s/san-onesimo/" }],
        "2-16": [{ n: "Santa Juliana", p: "/s/santa-juliana/" }],
        "2-17": [{ n: "Siete Fundadores de los Siervos de María", p: "/s/siete-santos-fundadores-de-la-orden-de-los-siervos-de-maria/" }, { n: "San Flaviano", p: "/s/san-flaviano/" }],
        "2-18": [{ n: "Beato Angélico", p: "/b/beato-angelico/" }],
        "2-19": [{ n: "Beato Álvaro de Córdoba", p: "/b/beato-alvaro-de-cordoba/" }],
        "2-20": [{ n: "Santa Jacinta Marto", p: "/s/santa-jacinta-marto/" }],
        "2-21": [{ n: "San Pedro Damián", p: "/s/san-pedro-damian/" }],
        "2-22": [{ n: "Cátedra de San Pedro", p: "/f/fiesta-de-la-catedra-de-san-pedro/" }],
        "2-23": [{ n: "San Policarpo", p: "/s/san-policarpo/" }, { n: "Beato Esteban Vicente Frelichowski", p: "/b/beato-esteban-vicente-frelichowski/" }],
        "2-24": [{ n: "San Etelberto de Kent", p: "/s/san-etelberto-de-kent/" }],
        "2-25": [{ n: "San Avertano", p: "/s/san-avertano/" }, { n: "San Néstor", p: "/s/san-nestor/" }, { n: "San Toribio Romo", p: "/s/san-toribio-romo/" }],
        "2-26": [{ n: "San Alejandro de Alejandría", p: "/s/san-alejandro-de-alejandria/" }],
        "2-27": [{ n: "San Gregorio de Narek", p: "/s/san-gregorio-de-narek/" }, { n: "Santa Ana Line", p: "/s/santa-ana-line/" }],
        "2-28": [{ n: "San Augusto Chapdelaine", p: "/s/san-augusto-chapdelaine/" }, { n: "San Hilario, papa", p: "/p/papa-hilario/" }],
        "2-29": [{ n: "San Augusto Chapdelaine", p: "/s/san-augusto-chapdelaine/" }],
        "3-1":  [{ n: "San Félix III", p: "/p/papa-felix-iii-ii/" }, { n: "San Albino de Angers", p: "/s/san-albino-de-angers/" }],
        "3-2":  [{ n: "Santa Inés de Bohemia", p: "/s/santa-ines-de-bohemia/" }],
        "3-3":  [{ n: "Santa Katharine Drexel", p: "/s/santa-katharine-drexel/" }, { n: "Santos Emeterio y Celedonio", p: "/s/santos-emeterio-y-celedonio/" }],
        "3-4":  [{ n: "San Casimiro", p: "/s/san-casimiro/" }],
        "3-5":  [{ n: "San Juan José de la Cruz", p: "/s/san-juan-jose-de-la-cruz/" }, { n: "San Lucio I", p: "/p/papa-lucio-i/" }],
        "3-6":  [{ n: "San Olegario", p: "/s/san-olegario/" }, { n: "San Julián de Toledo", p: "/s/san-julian-de-toledo/" }, { n: "Santa Rosa de Viterbo", p: "/s/santa-rosa-de-viterbo/" }],
        "3-7":  [{ n: "Santa Perpetua", p: "/s/santa-perpetua/" }, { n: "Santa Felicidad", p: "/s/santa-felicidad/" }, { n: "San Pablo el Simple", p: "/s/san-pablo-el-simple/" }],
        "3-8":  [{ n: "San Juan de Dios", p: "/s/san-juan-de-dios/" }],
        "3-9":  [{ n: "Santa Francisca Romana", p: "/s/santa-francisca-romana/" }, { n: "Santo Domingo Savio", p: "/s/santo-domingo-savio/" }],
        "3-10": [{ n: "San Juan Ogilvie", p: "/s/san-juan-ogilvie/" }, { n: "San Simplicio", p: "/p/papa-simplicio/" }],
        "3-11": [{ n: "San Eulogio de Córdoba", p: "/s/san-eulogio/" }],
        "3-12": [{ n: "San Teófano", p: "/s/san-teofano/" }, { n: "San Inocencio I", p: "/p/papa-inocencio-i/" }, { n: "San Luis Orione", p: "/s/san-luis-orione/" }],
        "3-13": [{ n: "Santos Rodrigo y Salomón", p: "/s/santos-rodrigo-y-salomon/" }],
        "3-14": [{ n: "Santa Matilde de Ringelheim", p: "/s/santa-matilde-de-ringelheim/" }],
        "3-15": [{ n: "San Clemente María Hofbauer", p: "/s/san-clemente-maria-hofbauer/" }, { n: "Santa Luisa de Marillac", p: "/s/santa-luisa-de-marillac/" }],
        "3-16": [{ n: "San Julián de Anazarbus", p: "/s/san-julian-de-anazarbus/" }, { n: "San José Gabriel Brochero", p: "/s/san-jose-gabriel-del-rosario-brochero/" }],
        "3-17": [{ n: "San Patricio de Irlanda", p: "/s/san-patricio-de-irlanda/" }, { n: "Santa Gertrudis de Nivelles", p: "/s/santa-gertrudis-de-nivelles/" }],
        "3-18": [{ n: "San Cirilo de Jerusalén", p: "/s/san-cirilo-de-jerusalen/" }, { n: "San Anselmo de Lucca", p: "/s/san-anselmo-de-lucca/" }],
        "3-20": [{ n: "San Wulfrano", p: "/s/san-wulfrano/" }],
        "3-21": [{ n: "San Nicolás de Flüe", p: "/s/san-nicolas-de-flue/" }],
        "3-22": [{ n: "Santa Lea", p: "/s/santa-lea/" }],
        "3-23": [{ n: "San Toribio de Mogrovejo", p: "/s/san-toribio-de-mogrovejo/" }],
        "3-24": [{ n: "San Óscar Romero", p: "/s/san-oscar-romero/" }, { n: "Santa Catalina de Suecia", p: "/s/santa-catalina-de-suecia/" }],
        "3-25": [{ n: "Virgen de la Encarnación", p: "/v/virgen-de-la-encarnacion/" }, { n: "Santa Margarita Clitherow", p: "/s/santa-margarita-clitherow/" }],
        "3-26": [{ n: "San Eutiquio y compañeros", p: "/s/san-eutiquio-y-companeros/" }],
        "3-27": [{ n: "San Ruperto", p: "/s/san-rupert/" }],
        "3-28": [{ n: "San Gontrán", p: "/s/san-gontran/" }, { n: "San Cirilo de Heliópolis", p: "/s/san-cirilo-de-heliopolis/" }, { n: "San Esteban Harding", p: "/s/san-esteban-harding/" }],
        "3-29": [{ n: "San Ludolfo", p: "/s/san-ludolfo/" }],
        "3-30": [{ n: "San Juan Clímaco", p: "/s/san-juan-climaco/" }],
        "3-31": [{ n: "San Guido de Pomposa", p: "/s/san-guido-de-pomposa/" }],
        "4-1":  [{ n: "San Hugo de Grenoble", p: "/s/san-hugo-de-grenoble/" }],
        "4-2":  [{ n: "San Francisco de Paula", p: "/s/san-francisco-de-paula/" }],
        "4-3":  [{ n: "San Ricardo de Chichester", p: "/s/san-ricardo-de-chichester/" }, { n: "San Sixto I", p: "/p/papa-sixto-i/" }],
        "4-4":  [{ n: "San Benito de Palermo", p: "/s/san-benito-de-palermo/" }],
        "4-5":  [{ n: "San Vicente Ferrer", p: "/s/san-vicente-ferrer/" }],
        "4-6":  [{ n: "San Pedro de Verona", p: "/s/san-pedro-martir/" }],
        "4-7":  [{ n: "San Juan Bautista de la Salle", p: "/s/san-juan-bautista-de-la-salle/" }, { n: "San Enrique Walpole", p: "/s/san-enrique-walpole/" }, { n: "San Hermann José de Steinfeld", p: "/s/san-hermann-jose-de-steinfeld/" }],
        "4-8":  [{ n: "Santa Julia Billiart", p: "/s/santa-julia-billiart/" }],
        "4-9":  [{ n: "Santa Valdetrudes", p: "/s/santa-valdetrudes/" }, { n: "Santa Casilda", p: "/s/santa-casilda-de-toledo/" }],
        "4-10": [{ n: "Nuestra Señora del Valle", p: "/n/nuestra-senora-del-valle/" }],
        "4-11": [{ n: "San Estanislao", p: "/s/san-estanislao/" }, { n: "Santa Gema Galgani", p: "/s/santa-gema-galgani/" }, { n: "San Barsanufio de Gaza", p: "/s/san-barsanufio-de-gaza/" }],
        "4-12": [{ n: "San Julio I", p: "/p/papa-julio-i/" }, { n: "San José Moscati", p: "/s/san-jose-moscati/" }, { n: "Santa Teresa de Los Andes", p: "/s/santa-teresa-de-los-andes/" }],
        "4-13": [{ n: "San Hermenegildo", p: "/s/san-hermenegildo/" }, { n: "San Martín I", p: "/p/papa-martin-i/" }],
        "4-14": [{ n: "Santa Lydwina de Schiedam", p: "/s/santa-lydwina-de-schiedam/" }],
        "4-15": [{ n: "San Damián de Molokai", p: "/s/san-damian-de-molokai/" }, { n: "Santas Basilisa y Anastasia", p: "/s/santas-basilisa-y-anastasia/" }],
        "4-16": [{ n: "Santa Bernardita de Soubirous", p: "/s/santa-bernardita-de-soubirous/" }, { n: "San Benito José Labre", p: "/s/san-benito-jose-labre/" }],
        "4-17": [{ n: "San Roberto de Molesmes", p: "/s/san-roberto-de-molesmes/" }],
        "4-18": [{ n: "San Galdino", p: "/s/san-galdino/" }],
        "4-19": [{ n: "San Alfege", p: "/s/san-alfege/" }, { n: "San León IX", p: "/p/papa-leon-ix/" }],
        "4-20": [{ n: "Santa Inés de Montepulciano", p: "/s/santa-ines-de-montepulciano/" }, { n: "San Aniceto", p: "/p/papa-aniceto/" }],
        "4-21": [{ n: "San Anselmo de Canterbury", p: "/s/san-anselmo-de-canterbury/" }, { n: "San Apolonio", p: "/s/san-apolonio/" }],
        "4-22": [{ n: "San Sotero", p: "/p/papa-sotero/" }, { n: "San Cayo", p: "/p/papa-cayo/" }, { n: "San Agapito I", p: "/p/papa-agapito-i/" }],
        "4-23": [{ n: "San Jorge", p: "/s/san-jorge/" }, { n: "San Adalberto", p: "/s/san-adalberto/" }],
        "4-24": [{ n: "San Fidel de Sigmaringa", p: "/s/san-fidel-de-sigmaringa/" }, { n: "Santa María Eufrasia Pelletier", p: "/s/santa-maria-eufrasia-pelletier/" }],
        "4-25": [{ n: "San Marcos Evangelista", p: "/s/san-marcos-evangelista/" }, { n: "San Pedro de San José Betancur", p: "/s/san-pedro-de-san-jose-betancur/" }],
        "4-26": [{ n: "San Isidoro de Sevilla", p: "/s/san-isidoro-de-sevilla/" }, { n: "Nuestra Señora del Buen Consejo de Genazzano", p: "/n/nuestra-senora-del-buen-consejo-de-genazzano/" }, { n: "San Cleto", p: "/p/papa-anacleto-cletus/" }],
        "4-27": [{ n: "Nuestra Señora de Montserrat", p: "/n/nuestra-senora-de-montserrat/" }, { n: "Santa Zita", p: "/s/santa-zita/" }, { n: "San Pedro Armengol", p: "/b/beato-pedro-armengol/" }],
        "4-28": [{ n: "San Pedro Chanel", p: "/s/san-pedro-chanel/" }, { n: "San Luis Grignion de Montfort", p: "/s/san-luis-maria-grignion-de-montfort/" }, { n: "Santa Gianna Beretta Molla", p: "/s/santa-gianna-beretta-molla/" }],
        "4-29": [{ n: "Santa Catalina de Siena", p: "/s/santa-catalina-de-siena/" }, { n: "San Pedro de Verona", p: "/s/san-pedro-martir/" }, { n: "San Hugo de Cluny", p: "/s/san-hugh-el-grande/" }],
        "4-30": [{ n: "San Pío V", p: "/p/papa-pio-v/" }, { n: "San José Benito Cottolengo", p: "/s/san-jose-benito-cottolengo/" }],
        "5-1":  [{ n: "San José Obrero", p: "/s/san-jose-obrero/" }, { n: "San Torcuato", p: "/s/san-torcuato/" }, { n: "San Peregrino Laziosi", p: "/s/san-peregrino-laziosi/" }],
        "5-2":  [{ n: "San Atanasio de Alejandría", p: "/s/san-atanasio-de-alejandria/" }, { n: "San Antonino de Florencia", p: "/s/san-antonino-de-florencia/" }],
        "5-3":  [{ n: "San Felipe Apóstol", p: "/s/san-felipe/" }, { n: "Santiago el Menor", p: "/f/fiesta-de-san-santiago-el-menor/" }, { n: "Cruz de Caravaca", p: "/c/cruz-de-caravaca/" }],
        "5-4":  [{ n: "San Roberto Lawrence", p: "/s/san-roberto-lawrence/" }],
        "5-5":  [{ n: "San Hilario de Arles", p: "/s/san-hilario-de-arles/" }],
        "5-6":  [{ n: "San Pedro Nolasco", p: "/s/san-pedro-nolasco/" }, { n: "San Francisco de Montmorency-Laval", p: "/s/san-francisco-de-montmorency-laval/" }, { n: "San Mariano", p: "/s/san-mariano/" }],
        "5-7":  [{ n: "San Juan de Beverly", p: "/s/san-juan-de-beverly/" }],
        "5-8":  [{ n: "San Bonifacio IV", p: "/p/papa-bonifacio-iv/" }, { n: "Nuestra Señora de Luján", p: "/n/nuestra-senora-de-lujan/" }, { n: "San Benedicto II", p: "/p/papa-benedicto-ii/" }],
        "5-9":  [{ n: "San Pacomio", p: "/s/san-pacomio-de-tabenna/" }, { n: "Santa Carmen Rendiles", p: "/s/santa-maria-del-monte-carmelo-rendiles/" }],
        "5-10": [{ n: "San Juan de Ávila", p: "/s/san-juan-de-avila/" }],
        "5-11": [{ n: "San Francisco de Jerónimo", p: "/s/san-francisco-de-jeronimo/" }],
        "5-12": [{ n: "Santos Nereo y Aquileo", p: "/s/san-nereo-y-san-aquileo/" }, { n: "San Pancracio", p: "/s/san-pancracio/" }],
        "5-13": [{ n: "Nuestra Señora de Fátima", p: "/n/nuestra-senora-de-fatima/" }],
        "5-14": [{ n: "San Matías", p: "/s/san-matias-apostol/" }, { n: "Santa María Mazzarello", p: "/s/santa-maria-mazzarello/" }],
        "5-15": [{ n: "San Isidro Labrador", p: "/s/san-isidro-labrador/" }, { n: "San Torcuato", p: "/s/san-torcuato/" }],
        "5-16": [{ n: "San Ubaldo", p: "/s/san-ubaldo/" }, { n: "San Simón Stock", p: "/s/san-simon-stock/" }, { n: "San Andrés Bobola", p: "/s/san-andres-bobola/" }],
        "5-17": [{ n: "San Pascual Baylón", p: "/s/san-pascual-baylon/" }],
        "5-18": [{ n: "San Juan I", p: "/s/san-juan-i/" }, { n: "San Félix de Cantalicio", p: "/s/san-felix-de-cantalicio/" }],
        "5-19": [{ n: "San Celestino V", p: "/p/papa-celestino-v/" }, { n: "San Francisco Coll", p: "/s/san-francisco-coll/" }, { n: "San Teófilo de Corte", p: "/s/san-teofilo/" }],
        "5-20": [{ n: "San Bernardino de Siena", p: "/s/san-bernardino-de-siena/" }, { n: "Santa Lidia", p: "/s/santa-lidia/" }],
        "5-21": [{ n: "San Cristóbal Magallanes", p: "/s/san-cristobal-magallanes/" }, { n: "San Eugenio de Mazenod", p: "/s/san-eugenio-de-mazenod/" }],
        "5-22": [{ n: "Santa Rita de Cascia", p: "/s/santa-rita-de-cascia/" }, { n: "Santa Joaquina de Vedruna", p: "/j/joaquina-de-vedruna/" }],
        "5-23": [{ n: "San Desiderio", p: "/s/san-desiderio/" }],
        "5-24": [{ n: "María Auxiliadora", p: "/m/maria-auxilio-de-los-cristianos/" }],
        "5-25": [{ n: "San Beda el Venerable", p: "/b/beda-el-venerable/" }, { n: "San Gregorio VII", p: "/p/papa-gregorio-vii/" }, { n: "Santa María Magdalena de Pazzi", p: "/s/santa-maria-magdalena-de-pazzi/" }],
        "5-26": [{ n: "San Felipe Neri", p: "/s/san-felipe-neri/" }, { n: "Santa Mariana de Jesús Paredes", p: "/s/santa-mariana-de-jesus-paredes/" }, { n: "San Eleuterio", p: "/p/papa-eleuterio/" }],
        "5-27": [{ n: "San Agustín de Canterbury", p: "/s/san-agustin-de-canterbury/" }],
        "5-28": [{ n: "San Guillermo de Gellone", p: "/s/san-guillermo/" }],
        "5-29": [{ n: "San Pablo VI", p: "/p/papa-pablo-vi/" }, { n: "San Maximino de Tréveris", p: "/s/san-maximino-de-treveris/" }],
        "5-30": [{ n: "San Fernando III", p: "/s/san-fernando-iii-el-santo/" }, { n: "Santa Juana de Arco", p: "/s/santa-juana-de-arco/" }, { n: "San Matías Mulumba Kalemba", p: "/s/san-matias-mulumba-kalemba/" }],
        "5-31": [{ n: "Visitación de la Bienaventurada Virgen María", p: "/f/fiesta-de-la-visitacion-de-la-bienaventurada-virgen-maria/" }],
        "6-1":  [{ n: "San Justino Mártir", p: "/s/san-justino-martir/" }],
        "6-2":  [{ n: "Santos Marcelino y Pedro", p: "/s/santos-marcelino-y-pedro/" }, { n: "San Erasmo", p: "/s/san-erasmo/" }, { n: "San Nicéforo de Constantinopla", p: "/s/san-niceforo/" }],
        "6-3":  [{ n: "San Carlos Lwanga y compañeros", p: "/l/los-martires-de-uganda/" }, { n: "Santa Clotilde", p: "/s/santa-clotilde/" }, { n: "San Juan Grande", p: "/s/san-juan-grande/" }],
        "6-4":  [{ n: "San Quirino de Siscia", p: "/s/san-quirino-de-siscia/" }, { n: "San Francisco Caracciolo", p: "/s/san-francisco-caracciolo/" }],
        "6-5":  [{ n: "San Bonifacio", p: "/s/san-bonifacio/" }],
        "6-6":  [{ n: "San Norberto", p: "/s/san-norberto/" }, { n: "San Marcelino Champagnat", p: "/s/san-marcelino-champagnat/" }, { n: "San Rafael Guízar Valencia", p: "/s/san-rafael-guizar-valencia/" }],
        "6-7":  [{ n: "San Antonio María Gianelli", p: "/s/san-antonio-maria-gianelli/" }],
        "6-8":  [{ n: "San Medardo", p: "/s/san-medardo/" }, { n: "San Guillermo de York", p: "/s/san-guillermo-de-york/" }],
        "6-9":  [{ n: "San Efrén de Siria", p: "/s/san-efren-de-siria/" }],
        "6-10": [{ n: "San Itamar", p: "/s/san-itamar/" }, { n: "San Getulio y compañeros", p: "/s/san-getulio-y-companeros/" }],
        "6-11": [{ n: "San Bernabé", p: "/s/san-bernabe/" }, { n: "Santa Paula Frassinetti", p: "/s/santa-paula-frassinetti/" }],
        "6-12": [{ n: "San Juan de Sahagún", p: "/s/san-juan-de-sahagun/" }, { n: "San León III", p: "/p/papa-leon-iii/" }],
        "6-13": [{ n: "San Antonio de Padua", p: "/s/san-antonio-de-padua/" }],
        "6-14": [{ n: "San Metodio de Constantinopla", p: "/s/san-metodio-de-constantinopla/" }],
        "6-15": [{ n: "Santa María Micaela del Santísimo Sacramento", p: "/s/santa-maria-micaela-del-santisimo-sacramento/" }, { n: "San Bernardo de Menthon", p: "/s/san-bernardo-de-menthon/" }, { n: "San Vito", p: "/s/san-vito/" }],
        "6-16": [{ n: "Santa Ludgarda", p: "/s/santa-lutgarda-de-tongeren/" }, { n: "Santa Julita", p: "/s/santa-julita/" }],
        "6-17": [{ n: "San Rainerio de Pisa", p: "/s/san-rainerio-de-pisa/" }],
        "6-18": [{ n: "San Gregorio Barbarigo", p: "/s/san-gregorio-barbarigo/" }],
        "6-19": [{ n: "San Romualdo", p: "/s/san-romualdo/" }, { n: "Santos Gervasio y Protasio", p: "/s/san-protasio/" }, { n: "Milagro eucarístico de Florencia", p: "/m/milagro-eucaristico-de-florencia-italia/" }],
        "6-20": [{ n: "San Adalberto de Magdeburgo", p: "/s/san-adalberto-de-magdeburgo/" }],
        "6-21": [{ n: "San Luis Gonzaga", p: "/s/san-luis-gonzaga/" }],
        "6-22": [{ n: "San Paulino de Nola", p: "/s/san-paulino-de-nola/" }, { n: "San Juan Fisher", p: "/s/san-juan-fisher/" }, { n: "Santo Tomás Moro", p: "/s/santo-tomas-moro/" }],
        "6-23": [{ n: "Santa Agripina", p: "/s/santa-agripina/" }, { n: "San José Cafasso", p: "/s/san-jose-cafasso/" }],
        "6-25": [{ n: "San Máximo de Turín", p: "/s/san-maximo-de-turin/" }, { n: "San Próspero de Aquitania", p: "/s/san-prospero-de-aquitania/" }],
        "6-26": [{ n: "San Pelayo", p: "/s/san-pelayo/" }, { n: "San Josemaría Escrivá de Balaguer", p: "/s/san-josemaria-escriva-de-balaguer/" }, { n: "San Vigilio", p: "/s/san-vigilio/" }],
        "6-27": [{ n: "San Cirilo de Alejandría", p: "/s/san-cirilo-de-alejandria/" }],
        "6-28": [{ n: "San Ireneo de Lyon", p: "/s/san-ireneo-de-lyon/" }, { n: "San Plutarco y compañeros", p: "/s/san-plutarco-y-companeros/" }, { n: "San Pablo I", p: "/p/papa-pablo-i/" }],
        "6-29": [{ n: "San Pedro Apóstol", p: "/s/san-pedro-apostol/" }, { n: "San Pablo Apóstol", p: "/s/san-pablo-apostol/" }],
        "6-30": [{ n: "Santos Protomártires de Roma", p: "/s/santos-protomartires-de-roma/" }, { n: "San Otón de Bamberg", p: "/s/san-oton-de-bamberg/" }, { n: "San Ladislao de Hungría", p: "/s/san-ladislao-de-hungria/" }],
        "7-1":  [{ n: "San Aarón", p: "/s/san-aaron/" }, { n: "San Oliverio Plunkett", p: "/s/san-oliverio-plunkett/" }],
        "7-2":  [{ n: "San Bernardino Realino", p: "/s/san-bernardino-realino/" }, { n: "Nuestra Señora de Budslau", p: "/n/nuestra-senora-de-budslau/" }],
        "7-3":  [{ n: "Santo Tomás Apóstol", p: "/s/santo-tomas-apostol/" }],
        "7-4":  [{ n: "Santa Isabel I de Portugal", p: "/s/santa-isabel-i-de-portugal/" }, { n: "San Pier Giorgio Frassati", p: "/s/san-pier-giorgio-frassati/" }],
        "7-5":  [{ n: "San Antonio María Zaccaría", p: "/s/san-antonio-maria-zaccaria/" }, { n: "San Guillermo de Hirschau", p: "/s/san-guillermo-abad-de-hirschau/" }, { n: "San Atanasio el Atonita", p: "/s/san-atanasio-el-atonita/" }],
        "7-6":  [{ n: "Santa María Goretti", p: "/s/santa-maria-goretti/" }, { n: "San Rómulo de Fiesole", p: "/s/san-romulo-de-fiesole/" }],
        "7-7":  [{ n: "Beato Benedicto XI", p: "/p/papa-benedicto-xi/" }, { n: "San Fermín", p: "/s/san-fermin-de-amiens/" }, { n: "Beata María Romero Meneses", p: "/b/beata-maria-romero-meneses/" }],
        "7-8":  [{ n: "San Kilian", p: "/s/san-kilian/" }, { n: "San Procopio", p: "/s/san-procopio/" }, { n: "Beato Eugenio III", p: "/p/papa-eugenio-iii/" }],
        "7-9":  [{ n: "San Agustín Zhao Rong y compañeros", p: "/m/martires-de-china/" }, { n: "Nuestra Señora de Chiquinquirá", p: "/v/virgen-del-rosario-de-chiquinquira/" }, { n: "Virgen de Itatí", p: "/v/virgen-de-itati/" }],
        "7-10": [{ n: "San Cristóbal", p: "/s/san-cristobal/" }],
        "7-11": [{ n: "San Benito de Nursia", p: "/s/san-benito-de-nursia/" }, { n: "San Pío I", p: "/p/papa-pio-i/" }, { n: "Santa Olga", p: "/s/santa-olga/" }],
        "7-12": [{ n: "San Juan Gualberto", p: "/s/san-juan-gualberto/" }, { n: "Santos Nabor y Félix", p: "/s/santos-nabor-y-felix/" }, { n: "Santos Luis Martin y Celia Guérin", p: "/s/santos-luis-martin-y-celia-guerin/" }],
        "7-13": [{ n: "San Enrique", p: "/s/san-enrique/" }, { n: "San Silas", p: "/s/san-silas/" }, { n: "Santa Teresa de Los Andes", p: "/s/santa-teresa-de-los-andes/" }],
        "7-14": [{ n: "San Camilo de Lelis", p: "/s/san-camilo-de-lelis/" }, { n: "San Francisco Solano", p: "/s/san-francisco-solano/" }],
        "7-15": [{ n: "San Buenaventura", p: "/s/san-buenaventura/" }, { n: "San Vladimir", p: "/s/san-vladimir/" }],
        "7-17": [{ n: "Santa Marcelina", p: "/s/santa-marcelina/" }, { n: "Santas Justa y Rufina", p: "/s/santa-justa-y-santa-rufina/" }, { n: "San León IV", p: "/p/papa-leon-iv/" }],
        "7-18": [{ n: "San Filastro", p: "/s/san-filastro/" }, { n: "Santa Sinforosa e hijos", p: "/s/santa-sinforosa-e-hijos/" }],
        "7-19": [{ n: "Santa Macrina la Joven", p: "/s/santa-macrina-la-joven/" }],
        "7-20": [{ n: "San Apolinar", p: "/s/san-apolinar/" }, { n: "Elías", p: "/e/elias-profeta/" }, { n: "San Aurelio", p: "/s/san-aurelio/" }],
        "7-21": [{ n: "San Lorenzo de Brindisi", p: "/s/san-lorenzo-de-brindisi/" }],
        "7-22": [{ n: "Santa María Magdalena", p: "/s/santa-maria-magdalena/" }],
        "7-23": [{ n: "Santa Brígida de Suecia", p: "/s/santa-brigida-de-suecia/" }, { n: "Ezequiel", p: "/e/ezequiel-profeta/" }, { n: "San Juan Casiano", p: "/s/san-juan-casiano/" }],
        "7-24": [{ n: "San Charbel Makhluf", p: "/s/san-charbel-makhlouf/" }, { n: "Santa Eufrasia", p: "/s/santa-eufrasia/" }, { n: "Santa Cristina", p: "/s/santa-cristina/" }],
        "7-26": [{ n: "San Joaquín", p: "/s/san-joaquin/" }, { n: "Santa Ana", p: "/s/santa-ana/" }],
        "7-27": [{ n: "San Pantaleón", p: "/s/san-pantaleon/" }, { n: "Santa Natalia y compañeros", p: "/s/santa-natalia-y-companeros/" }, { n: "San Simeón Estilita", p: "/s/san-simeon-estilita/" }],
        "7-28": [{ n: "San Víctor I", p: "/p/papa-victor-i/" }, { n: "Santos Nazario y Celso", p: "/s/santos-nazario-celso-y-victor-i/" }],
        "7-29": [{ n: "Santa Marta", p: "/s/santa-marta/" }, { n: "San Lázaro", p: "/s/san-lazaro/" }],
        "7-30": [{ n: "San Pedro Crisólogo", p: "/s/san-pedro-crisologo/" }, { n: "San Leopoldo Mandic", p: "/s/san-leopoldo-mandic/" }],
        "7-31": [{ n: "San Ignacio de Loyola", p: "/s/san-ignacio-de-loyola/" }, { n: "San Germán de Auxerre", p: "/s/san-german-de-auxerre/" }, { n: "San Justino de Jacobis", p: "/s/san-justino-de-jacobis/" }],
        "8-1":  [{ n: "San Alfonso María de Ligorio", p: "/s/san-alfonso-maria-de-ligorio/" }],
        "8-2":  [{ n: "San Eusebio de Vercelli", p: "/s/san-eusebio-de-vercelli/" }, { n: "San Pedro Julián Eymard", p: "/s/san-pedro-julian-eymard/" }, { n: "Nuestra Señora de los Ángeles", p: "/n/nuestra-senora-de-los-angeles/" }],
        "8-3":  [{ n: "San Asprenato", p: "/s/san-asprenato/" }],
        "8-4":  [{ n: "San Juan María Vianney", p: "/s/san-juan-maria-vianney/" }],
        "8-5":  [{ n: "Dedicación de la Basílica de Santa María la Mayor", p: "/m/memoria-de-la-dedicacion-de-la-basilica-de-santa-maria-la-mayor/" }, { n: "Nuestra Señora de Copacabana", p: "/n/nuestra-senora-de-copacabana/" }, { n: "Santa María de África", p: "/s/santa-maria-de-africa/" }],
        "8-6":  [{ n: "San Hormisdas", p: "/p/papa-hormisdas/" }],
        "8-7":  [{ n: "San Sixto II", p: "/p/papa-sixto-ii/" }, { n: "San Cayetano", p: "/s/san-cayetano/" }, { n: "San Alberto de Trapani", p: "/s/san-alberto-de-trapani/" }],
        "8-8":  [{ n: "Santo Domingo de Guzmán", p: "/s/santo-domingo-de-guzman/" }, { n: "Catorce Santos Auxiliares", p: "/c/catorce-santos-auxiliares/" }],
        "8-9":  [{ n: "Santa Teresa Benedicta de la Cruz", p: "/s/santa-teresa-benedicta-de-la-cruz-edith-stein/" }, { n: "Beato Juan de Alvernia", p: "/s/san-juan-de-alvernia/" }],
        "8-10": [{ n: "San Lorenzo", p: "/s/san-lorenzo/" }],
        "8-11": [{ n: "Santa Clara de Asís", p: "/s/santa-clara-de-asis/" }],
        "8-12": [{ n: "Santa Juana Francisca de Chantal", p: "/s/santa-juana-francisca-de-chantal/" }, { n: "San Euplo", p: "/s/san-euplo/" }, { n: "Beato Inocencio XI", p: "/p/papa-inocencio-xi/" }],
        "8-13": [{ n: "San Ponciano", p: "/p/papa-ponciano/" }, { n: "San Hipólito", p: "/s/san-hipolito/" }, { n: "San Máximo el Confesor", p: "/s/san-maximo-el-confesor/" }],
        "8-14": [{ n: "San Maximiliano María Kolbe", p: "/s/san-maximiliano-maria-kolbe/" }],
        "8-15": [{ n: "Nuestra Señora de los Reyes", p: "/n/nuestra-senora-de-los-reyes/" }, { n: "San Jacinto", p: "/s/san-jacinto/" }],
        "8-16": [{ n: "San Esteban de Hungría", p: "/s/san-esteban-de-hungria/" }, { n: "San Roque", p: "/s/san-roque/" }],
        "8-17": [{ n: "Santa Beatriz de Silva", p: "/s/santa-beatriz-de-silva/" }, { n: "Santa Clara de Montefalco", p: "/s/santa-clara-de-montefalco/" }, { n: "San Eusebio, papa", p: "/p/papa-eusebio/" }],
        "8-18": [{ n: "Santa Elena", p: "/s/santa-elena/" }, { n: "San Agapito mártir", p: "/s/san-agapito-martir/" }, { n: "San Alberto Hurtado", p: "/s/san-alberto-hurtado/" }],
        "8-19": [{ n: "San Juan Eudes", p: "/s/san-juan-eudes/" }, { n: "San Ezequiel Moreno", p: "/e/ezequiel-moreno/" }, { n: "San Luis de Toulouse", p: "/s/san-luis-obispo/" }],
        "8-20": [{ n: "San Bernardo de Claraval", p: "/s/san-bernardo-de-claraval/" }, { n: "Samuel", p: "/p/profeta-samuel/" }, { n: "San Bernardo Tolomei", p: "/s/san-bernardo-tolomei/" }],
        "8-21": [{ n: "San Pío X", p: "/p/papa-pio-x/" }, { n: "San Privato", p: "/s/san-privato/" }],
        "8-22": [{ n: "San Felipe Benizi", p: "/s/san-felipe-benizi/" }],
        "8-23": [{ n: "Santa Rosa de Lima", p: "/s/santa-rosa-de-lima/" }],
        "8-24": [{ n: "San Bartolomé", p: "/s/san-bartolome/" }],
        "8-25": [{ n: "San Luis IX de Francia", p: "/s/san-luis-ix-de-francia/" }, { n: "San José de Calasanz", p: "/s/san-jose-de-calasanz/" }, { n: "Santo Tomás de Hereford", p: "/s/santo-tomas-de-hereford/" }],
        "8-26": [{ n: "Santa Teresa de Jesús Jornet", p: "/s/santa-teresa-de-jesus-jornet/" }, { n: "Virgen de Czestochowa", p: "/n/nuestra-senora-de-czestochowa/" }, { n: "San Junípero Serra", p: "/s/san-junipero-serra/" }],
        "8-27": [{ n: "Santa Mónica", p: "/s/santa-monica/" }, { n: "San Cesáreo de Arlés", p: "/c/cesar-de-arles/" }],
        "8-28": [{ n: "San Agustín de Hipona", p: "/s/san-agustin-de-hipona/" }],
        "8-29": [{ n: "Martirio de San Juan Bautista", p: "/m/memoria-del-martirio-de-san-juan-bautista/" }],
        "8-30": [{ n: "Beata María Rafols", p: "/b/beata-maria-rafols-bruna/" }, { n: "Santa Rosa de Lima", p: "/s/santa-rosa-de-lima/" }],
        "8-31": [{ n: "San Raimundo Nonato", p: "/s/san-raimundo-nonato/" }, { n: "San Aidan de Lindisfarne", p: "/s/san-aidan-de-lindisfarne/" }, { n: "San Arístides", p: "/s/san-aristides-martir/" }],
        "9-1":  [{ n: "San Egidio", p: "/s/san-egidio-san-giles/" }],
        "9-2":  [{ n: "Santos Justo de Lyon y Viator", p: "/s/santos-justo-de-lyon-y-viator/" }, { n: "San Guillermo de Roskilde", p: "/s/san-guillermo-de-roskilde/" }],
        "9-3":  [{ n: "San Gregorio I Magno", p: "/s/san-gregorio-i-magno/" }],
        "9-4":  [{ n: "Moisés", p: "/m/moises/" }, { n: "Santa Rosalía", p: "/s/santa-rosalia-de-palermo/" }, { n: "Nuestra Señora de la Consolación", p: "/n/nuestra-senora-de-la-consolacion/" }],
        "9-5":  [{ n: "Santa Teresa de Calcuta", p: "/s/santa-teresa-de-calcuta/" }],
        "9-6":  [{ n: "San Magno", p: "/s/san-magno/" }],
        "9-7":  [{ n: "Santa Regina", p: "/s/santa-regina/" }],
        "9-8":  [{ n: "Virgen de Covadonga", p: "/v/virgen-de-covadonga/" }, { n: "Nuestra Señora de la Caridad del Cobre", p: "/n/nuestra-senora-de-la-caridad-del-cobre/" }],
        "9-9":  [{ n: "San Pedro Claver", p: "/s/san-pedro-claver/" }, { n: "Santa María la Antigua", p: "/s/santa-maria-la-antigua/" }],
        "9-10": [{ n: "San Nicolás de Tolentino", p: "/s/san-nicolas-de-tolentino/" }],
        "9-11": [{ n: "Nuestra Señora de Coromoto", p: "/n/nuestra-senora-de-coromoto/" }, { n: "San Juan Gabriel Perboyre", p: "/s/san-juan-gabriel-perboyre/" }],
        "9-12": [{ n: "Dulce Nombre de María", p: "/d/dulce-nombre-de-la-virgen-maria/" }, { n: "Virgen de Valvanera", p: "/v/virgen-de-valvanera/" }, { n: "Virgen de Estíbaliz", p: "/v/virgen-de-estibaliz/" }],
        "9-13": [{ n: "San Juan Crisóstomo", p: "/s/san-juan-crisostomo/" }, { n: "San Marcelino de Cartago", p: "/s/san-marcelino-de-cartago/" }],
        "9-14": [{ n: "San Pedro de Tarantasia", p: "/s/san-pedro-de-tarantasia/" }],
        "9-15": [{ n: "Nuestra Señora de los Dolores", p: "/n/nuestra-senora-de-los-dolores/" }, { n: "Santa Catalina de Génova", p: "/s/santa-catalina-de-genova/" }, { n: "Nuestra Señora de las Angustias", p: "/n/nuestra-senora-de-las-angustias-coronada/" }],
        "9-16": [{ n: "San Cornelio", p: "/p/papa-cornelio/" }, { n: "San Cipriano", p: "/s/san-cipriano/" }, { n: "San Juan Macías", p: "/s/san-juan-macias/" }],
        "9-17": [{ n: "San Roberto Belarmino", p: "/s/san-roberto-belarmino/" }, { n: "Santa Hildegarda de Bingen", p: "/s/santa-hildegarda-de-bingen/" }, { n: "San Pedro de Arbués", p: "/s/san-pedro-de-arbues/" }],
        "9-18": [{ n: "San José de Cupertino", p: "/s/san-jose-de-cupertino/" }],
        "9-19": [{ n: "San Jenaro", p: "/s/san-jenaro/" }],
        "9-20": [{ n: "San Andrés Kim Taegon", p: "/s/san-andres-kim-taegon/" }, { n: "San Pablo Chong Hasang", p: "/s/san-pablo-chong-hasang/" }, { n: "San Eustaquio", p: "/s/san-eustaquio/" }],
        "9-21": [{ n: "San Mateo Evangelista", p: "/s/san-mateo-evangelista/" }],
        "9-22": [{ n: "San Mauricio", p: "/s/san-mauricio/" }],
        "9-23": [{ n: "San Pío de Pietrelcina", p: "/s/san-pio-de-pietrelcina/" }, { n: "Santos Zacarías e Isabel", p: "/s/san-zacarias/" }, { n: "Santa Tecla", p: "/s/santa-tecla/" }],
        "9-24": [{ n: "Nuestra Señora de las Mercedes", p: "/n/nuestra-senora-de-las-mercedes/" }],
        "9-25": [{ n: "San Cleofás", p: "/s/san-cleofas/" }],
        "9-26": [{ n: "San Cosme y San Damián", p: "/s/san-cosme-y-san-damian/" }],
        "9-27": [{ n: "San Vicente de Paúl", p: "/s/san-vicente-de-paul/" }],
        "9-28": [{ n: "San Venceslao", p: "/s/san-venceslao/" }, { n: "San Lorenzo Ruiz", p: "/s/san-lorenzo-ruiz/" }],
        "9-29": [{ n: "San Miguel Arcángel", p: "/s/san-miguel-arcangel/" }, { n: "San Gabriel Arcángel", p: "/s/san-gabriel-arcangel/" }, { n: "San Rafael Arcángel", p: "/s/san-rafael-arcangel/" }],
        "9-30": [{ n: "San Jerónimo de Estridón", p: "/s/san-jeronimo-de-estridon/" }, { n: "San Honorio", p: "/s/san-honorio/" }],
        "10-1": [{ n: "Santa Teresa del Niño Jesús y de la Santa Faz", p: "/s/santa-teresa-de-lisieux/" }, { n: "San Romano el Meloda", p: "/s/san-romano-el-meloda/" }],
        "10-2": [{ n: "Santos Ángeles Custodios", p: "/s/santos-angeles-custodios/" }],
        "10-3": [{ n: "San Francisco de Borja", p: "/s/san-francisco-de-borja/" }, { n: "San Dionisio Areopagita", p: "/s/san-dionisio-areopagita/" }],
        "10-4": [{ n: "San Francisco de Asís", p: "/s/san-francisco-de-asis/" }],
        "10-5": [{ n: "Témporas de acción de gracias y de petición", p: "/t/temporas-de-accion-de-gracias-y-de-peticion/" }, { n: "San Froilán", p: "/s/san-froilan/" }],
        "10-6": [{ n: "San Bruno", p: "/s/san-bruno/" }, { n: "Santa María Francisca de las Cinco Llagas", p: "/s/santa-maria-francisca-de-las-cinco-llagas/" }],
        "10-7": [{ n: "San Marcos, papa", p: "/p/papa-marcos/" }],
        "10-8": [{ n: "Santa Faustina Kowalska", p: "/s/santa-maria-faustina-kowalska/" }, { n: "Santa Taís", p: "/s/santa-tais/" }],
        "10-9": [{ n: "Santos Dionisio y compañeros", p: "/s/san-dionisio-y-companeros/" }, { n: "San Juan Leonardi", p: "/s/san-juan-leonardi/" }, { n: "San John Henry Newman", p: "/s/san-john-henry-newman/" }],
        "10-10":[{ n: "Santo Tomás de Villanueva", p: "/s/santo-tomas-de-villanueva/" }, { n: "San Paulino de York", p: "/s/san-paulino-de-york/" }],
        "10-11":[{ n: "San Juan XXIII", p: "/p/papa-juan-xxiii/" }, { n: "Santa María Soledad Torres Acosta", p: "/m/maria-soledad-torres-acosta/" }, { n: "Nuestra Señora de Begoña", p: "/n/nuestra-senora-de-begona/" }],
        "10-12":[{ n: "Nuestra Señora de la Concepción Aparecida", p: "/n/nuestra-senora-de-la-concepcion-aparecida/" }, { n: "San Carlo Acutis", p: "/s/san-carlo-acutis/" }],
        "10-13":[{ n: "Milagro del Sol de Fátima", p: "/m/milagro-del-sol-de-fatima-portugal/" }, { n: "Santos Fausto, Januario y Marcial", p: "/s/santos-fausto-januario-y-marcial/" }],
        "10-14":[{ n: "San Calixto I", p: "/p/papa-calixto-i/" }],
        "10-15":[{ n: "Santa Teresa de Jesús", p: "/s/santa-teresa-de-avila/" }],
        "10-16":[{ n: "Santa Eduviges", p: "/s/santa-eduvigis/" }, { n: "Santa Margarita María de Alacoque", p: "/s/santa-margarita-maria-de-alacoque/" }, { n: "San Gerardo Mayela", p: "/s/san-gerardo-mayela/" }],
        "10-17":[{ n: "San Ignacio de Antioquía", p: "/s/san-ignacio-de-antioquia/" }],
        "10-18":[{ n: "San Lucas Evangelista", p: "/s/san-lucas-evangelista/" }],
        "10-19":[{ n: "San Pablo de la Cruz", p: "/s/san-pablo-de-la-cruz/" }, { n: "San Pedro de Alcántara", p: "/s/san-pedro-de-alcantara/" }, { n: "Santos Juan de Brébeuf, Isaac Jogues y compañeros", p: "/s/san-isaac-jogues-y-companeros/" }],
        "10-20":[{ n: "Santa María Bertilla", p: "/s/santa-maria-bertilla/" }],
        "10-21":[{ n: "Santa Úrsula", p: "/s/santa-ursula/" }, { n: "San Hilarión", p: "/s/san-hilarion/" }, { n: "Santa Laura Montoya", p: "/s/santa-laura-montoya/" }],
        "10-22":[{ n: "San Juan Pablo II", p: "/p/papa-juan-pablo-ii/" }],
        "10-23":[{ n: "San Juan de Capistrano", p: "/s/san-juan-de-capistrano/" }, { n: "San Ignacio Patriarca de Constantinopla", p: "/s/san-ignacio-patriarca-de-constantinopla/" }, { n: "San Boecio", p: "/s/san-boecio/" }],
        "10-24":[{ n: "San Antonio María Claret", p: "/s/san-antonio-maria-claret/" }],
        "10-25":[{ n: "San Antonio de Sant'Ana Galvão", p: "/s/san-antonio-de-sant-ana-galvao/" }, { n: "Santos Crispín y Crispiniano", p: "/s/san-crispin-y-san-crispiniano/" }],
        "10-26":[{ n: "San José Gregorio Hernández", p: "/s/san-jose-gregorio-hernandez-cisneros/" }],
        "10-27":[{ n: "San Evaristo", p: "/p/papa-evaristo/" }],
        "10-28":[{ n: "San Simón Apóstol", p: "/s/san-simon-zelote/" }, { n: "San Judas Tadeo", p: "/s/san-judas-tadeo/" }, { n: "Señor de los Milagros", p: "/s/senor-de-los-milagros-lima/" }],
        "10-29":[{ n: "Santa Hermelinda", p: "/s/santa-hermelinda/" }, { n: "San Narciso", p: "/s/san-narciso/" }],
        "10-30":[{ n: "San Marcelo", p: "/s/san-marcelo/" }],
        "10-31":[{ n: "San Alfonso Rodríguez", p: "/s/san-alfonso-rodriguez/" }],
        "11-3": [{ n: "San Martín de Porres", p: "/s/san-martin-de-porres/" }],
        "11-4": [{ n: "San Carlos Borromeo", p: "/s/san-carlos-borromeo/" }, { n: "San Emerico", p: "/s/san-emerico/" }, { n: "San Félix de Valois", p: "/s/san-felix-de-valois/" }],
        "11-5": [{ n: "Santa Ángela de la Cruz", p: "/s/santa-angela-de-la-cruz/" }],
        "11-6": [{ n: "San Pedro Poveda", p: "/p/pedro-poveda/" }, { n: "Santos Inocencio de la Inmaculada y compañeros", p: "/m/martires-de-turon/" }],
        "11-7": [{ n: "San Willibrord", p: "/s/san-willibrord/" }],
        "11-8": [{ n: "San Deusdedit", p: "/p/papa-deusdedit-adeodato-i/" }, { n: "Beato Juan Duns Escoto", p: "/b/beato-juan-duns-escoto/" }],
        "11-9": [{ n: "Dedicación de la Basílica de Letrán", p: "/f/fiesta-de-la-dedicacion-de-la-basilica-de-letran/" }, { n: "Nuestra Señora de la Almudena", p: "/n/nuestra-senora-de-la-almudena/" }],
        "11-10":[{ n: "San León I Magno", p: "/s/san-leon-i-magno/" }],
        "11-11":[{ n: "San Martín de Tours", p: "/s/san-martin-de-tours/" }],
        "11-12":[{ n: "San Josafat", p: "/s/san-josafat/" }],
        "11-13":[{ n: "San Leandro", p: "/s/san-leandro/" }, { n: "San Diego de Alcalá", p: "/s/san-diego-de-alcala/" }, { n: "San Nicolás I", p: "/p/papa-nicolas-i-el-grande/" }],
        "11-14":[{ n: "San Serapio", p: "/s/san-serapio/" }],
        "11-15":[{ n: "San Alberto Magno", p: "/s/san-alberto-magno/" }],
        "11-16":[{ n: "Santa Margarita de Escocia", p: "/s/santa-margarita-de-escocia/" }, { n: "Santa Gertrudis", p: "/s/santa-gertrudis-la-grande/" }],
        "11-17":[{ n: "Santa Isabel de Hungría", p: "/s/santa-isabel-de-hungria/" }],
        "11-18":[{ n: "Dedicación de las Basílicas de San Pedro y San Pablo", p: "/m/memoria-de-la-dedicacion-de-las-basilicas-de-san-pedro-y-san-pablo/" }, { n: "San Odón", p: "/s/san-odo/" }],
        "11-19":[{ n: "Santa Matilde de Hackeborn", p: "/s/santa-matilde-de-hackeborn/" }],
        "11-20":[{ n: "San Edmundo rey mártir", p: "/s/san-edmundo-rey-martir/" }, { n: "Beato Anacleto González Flores", p: "/b/beato-anacleto-gonzalez-flores/" }],
        "11-21":[{ n: "Nuestra Señora de la Presentación del Quinche", p: "/n/nuestra-senora-de-la-presentacion-del-quinche/" }, { n: "San Gelasio I", p: "/p/papa-gelasio-i/" }],
        "11-22":[{ n: "Santa Cecilia", p: "/s/santa-cecilia/" }],
        "11-23":[{ n: "San Clemente I", p: "/p/papa-clemente-i/" }, { n: "San Columbano", p: "/s/san-columbano/" }, { n: "Beato Miguel Agustín Pro", p: "/b/beato-miguel-agustin-pro/" }],
        "11-24":[{ n: "San Andrés Dung-Lac y compañeros", p: "/s/san-andres-dung-lac/" }, { n: "Santa Flora", p: "/s/santa-flora/" }],
        "11-25":[{ n: "Santa Catalina de Alejandría", p: "/s/santa-catalina-de-alejandria/" }],
        "11-26":[{ n: "San Silvestre Gozzolini", p: "/s/san-silvestre-gozzolini/" }, { n: "San Leonardo de Porto Maurizio", p: "/s/san-leonardo-de-porto-maurizio/" }, { n: "San Siricio", p: "/p/papa-siricio/" }],
        "11-27":[{ n: "Nuestra Señora de la Medalla Milagrosa", p: "/n/nuestra-senora-de-las-gracias-de-la-medalla-milagrosa/" }, { n: "San Facundo", p: "/s/san-facundo/" }],
        "11-28":[{ n: "Santa Catalina Labouré", p: "/s/santa-catalina-laboure/" }],
        "11-29":[{ n: "San Francisco Antonio Fasani", p: "/s/san-francisco-antonio-fasani/" }],
        "11-30":[{ n: "San Andrés", p: "/s/san-andres-apostol/" }],
        "12-1": [{ n: "San Eloy", p: "/s/san-eligio/" }, { n: "San Carlos de Foucauld", p: "/s/san-carlos-de-foucauld/" }, { n: "San Edmundo Campion", p: "/s/san-edmundo-campion/" }],
        "12-2": [{ n: "Santa Bibiana", p: "/s/santa-bibiana/" }, { n: "San Silverio", p: "/p/papa-silverio/" }],
        "12-3": [{ n: "San Francisco Javier", p: "/s/san-francisco-javier/" }],
        "12-4": [{ n: "San Juan Damasceno", p: "/s/san-juan-damasceno/" }, { n: "Santa Bárbara", p: "/s/santa-barbara/" }, { n: "San Osmundo", p: "/s/san-osmundo/" }],
        "12-5": [{ n: "San Sabas", p: "/s/san-sabas/" }],
        "12-6": [{ n: "San Nicolás", p: "/s/san-nicolas-de-bari/" }, { n: "San Pedro Pascual", p: "/s/san-pedro-pascual/" }],
        "12-7": [{ n: "San Ambrosio de Milán", p: "/s/san-ambrosio-de-milan/" }, { n: "San Sabino y compañeros", p: "/s/san-sabino-y-companeros/" }],
        "12-8": [{ n: "Santa Narcisa de Jesús", p: "/s/santa-narcisa-de-jesus/" }, { n: "Nuestra Señora de Caacupé", p: "/n/nuestra-senora-de-caacupe/" }],
        "12-9": [{ n: "San Juan Diego Cuauhtlatoatzin", p: "/s/san-juan-diego-cuauhtlatoatzin/" }, { n: "Santa Leocadia", p: "/s/santa-leocadia/" }],
        "12-10":[{ n: "Nuestra Señora de Loreto", p: "/n/nuestra-senora-de-loreto/" }, { n: "Santa Eulalia de Mérida", p: "/e/eulalia-de-merida/" }, { n: "San Gregorio III", p: "/p/papa-gregorio-iii/" }],
        "12-11":[{ n: "San Dámaso I", p: "/s/san-damaso-i/" }, { n: "Santa Maravillas de Jesús", p: "/s/santa-maravillas-de-jesus/" }],
        "12-13":[{ n: "Santa Lucía", p: "/s/santa-lucia/" }],
        "12-14":[{ n: "San Juan de la Cruz", p: "/s/san-juan-de-la-cruz/" }],
        "12-15":[{ n: "Santa María Crucificada Di Rosa", p: "/s/santa-maria-crucificada-di-rosa/" }],
        "12-16":[{ n: "Santa Adelaida Emperatriz", p: "/s/santa-adelaida-emperatriz/" }],
        "12-17":[{ n: "San Juan de Mata", p: "/s/san-juan-de-mata/" }],
        "12-18":[{ n: "Nuestra Señora de la Expectación", p: "/n/nuestra-senora-de-la-expectacion/" }],
        "12-19":[{ n: "Beato Urbano V", p: "/p/papa-urbano-v/" }],
        "12-20":[{ n: "Santo Domingo de Silos", p: "/s/santo-domingo-de-silos/" }, { n: "San Ceferino", p: "/p/papa-ceferino/" }],
        "12-21":[{ n: "San Pedro Canisio", p: "/s/san-pedro-canisio/" }],
        "12-22":[{ n: "Santa Francisca Javier Cabrini", p: "/s/santa-francisca-javier-cabrini/" }],
        "12-23":[{ n: "San Juan de Kety", p: "/s/san-juan-de-kanty/" }],
        "12-24":[{ n: "Nochebuena", p: "/n/nochebuena/" }],
        "12-26":[{ n: "San Esteban", p: "/s/san-esteban/" }, { n: "Nuestra Señora de Andacollo", p: "/n/nuestra-senora-de-andacollo/" }, { n: "San Dionisio, papa", p: "/p/papa-dionisio/" }],
        "12-27":[{ n: "San Juan Apóstol", p: "/s/san-juan-evangelista/" }],
        "12-28":[{ n: "Fiesta de los Santos Inocentes", p: "/f/fiesta-de-los-santos-inocentes/" }, { n: "San Gaspar del Búfalo", p: "/s/san-gaspar-del-bufalo/" }],
        "12-29":[{ n: "Santo Tomás Becket", p: "/s/santo-tomas-becket/" }, { n: "David, rey y profeta", p: "/s/san-david/" }],
        "12-30":[{ n: "Virgen de la Nube", p: "/v/virgen-de-la-nube/" }, { n: "San Félix I", p: "/p/papa-felix-i/" }],
        "12-31":[{ n: "San Silvestre I", p: "/p/papa-silvestre-i/" }]
    };

    const _yc = {};
    function ydata(y) {
        if (_yc[y]) return _yc[y];
        const E = easter(y), adv = advent1(y), bap = baptism(y);
        const ashWed = addDays(E, -46), dec25 = new Date(y, 11, 25);
        return _yc[y] = {
            E, adv,
            tras: traslados(y, E),
            ashWed: addDays(E, -46),
            palm: addDays(E, -7),
            holyThu: addDays(E, -3),
            pent: addDays(E, 49),
            bap: baptism(y),
            dec25: new Date(y, 11, 25),
            mov: [
                [addDays(adv, -7), { fiesta: 'Cristo Rey del Universo', ...T.ord, color: '#78350f', icono: '👑', p: '/s/solemnidad-de-cristo-rey/' }],
                [addDays(adv, 14), { fiesta: 'Domingo de Gaudete',      ...T.adv, color: '#e11d48', icono: '🌹', p: '/d/domingo-de-gaudete/' }],
                [holyFamily(y),    { fiesta: 'La Sagrada Familia',      ...T.nav, color: '#78350f', icono: '👨‍👩‍👧', p: '/f/fiesta-de-la-sagrada-familia/' }],
                [bap,              { fiesta: 'Bautismo del Señor',      ...T.nav, color: '#78350f', icono: '💧', p: '/s/solemnidad-del-bautismo-del-senor/' }],
                [ashWed,           { fiesta: 'Miércoles de Ceniza',     ...T.cua, color: '#1f2937', icono: '⚱️', p: '/m/miercoles-de-ceniza/' }],
                [addDays(ashWed, 25),{ fiesta: 'Domingo Laetare',       ...T.cua, color: '#e11d48', icono: '🌹', p: '/d/domingo-de-letare-laetare/' }],
                [addDays(E, -7),   { fiesta: 'Domingo de Ramos',        ...T.sem, p: '/d/domingo-de-ramos/' }],
                [addDays(E, -3),   { fiesta: 'Jueves Santo',            ...T.tri, p: '/j/jueves-santo/' }],
                [addDays(E, -2),   { fiesta: 'Viernes Santo',           ...T.tri, color: '#111827', p: '/v/viernes-santo/' }],
                [addDays(E, -1),   { fiesta: 'Sábado Santo',            ...T.tri, p: '/s/sabado-santo/' }],
                [E,                { fiesta: 'Domingo de Resurrección', ...T.pas, icono: '✨', p: '/d/domingo-de-resurreccion/' }],
                [addDays(E, 7),    { fiesta: 'Domingo de Misericordia', ...T.pas, color: '#7f1d1d', icono: '❤️', p: '/d/domingo-de-la-divina-misericordia/' }],
                [addDays(E, 21),   { fiesta: 'Domingo del Buen Pastor', ...T.pas, icono: '🐑', p: '/d/domingo-del-buen-pastor/' }],
                [addDays(E, 42),   { fiesta: 'Ascensión del Señor',     ...T.pas, icono: '☁️', p: '/s/solemnidad-de-la-ascension/' }],
                [addDays(E, 49),   { fiesta: 'Pentecostés',             ...T.pas, color: '#7f1d1d', icono: '🔥', p: '/s/solemnidad-de-pentecostes/' }],
                [addDays(E, 50),   { fiesta: 'María Madre de la Iglesia', ...T.ord, color:'#b91c1c', icono:'👑', p:'/m/maria-madre-de-la-iglesia/', mem: 1 }],
                [addDays(E, 53),   { fiesta: 'Jesucristo Sumo y Eterno Sacerdote', ...T.ord, color: '#78350f', icono: '👑', p: '/j/jesucristo-sumo-y-eterno-sacerdote/' }],
                [addDays(E, 56),   { fiesta: 'Santísima Trinidad',      ...T.ord, color: '#78350f', icono: '✝️', p: '/s/solemnidad-de-la-santisima-trinidad/' }],
                [addDays(E, 63),   { fiesta: 'Corpus Christi',          ...T.ord, color: '#78350f', icono: '🍞', p: '/s/solemnidad-de-corpus-christi/' }],
                [addDays(E, 68), { fiesta: 'Sagrado Corazón de Jesús', ...T.ord, color:'#b91c1c', icono:'❤️', p:'/s/sagrado-corazon-de-jesus/' }],
                [addDays(E, 69), { fiesta: 'Inmaculado Corazón de María', ...T.ord, color:'#b91c1c', icono:'💗', p:'/i/inmaculado-corazon-de-maria/', mem: 1 }]]
    };
    }

    // Entrada de SOLEM que corresponde a un día, ya aplicados los traslados
    function solemDe(date) {
        const key = `${date.getMonth() + 1}-${date.getDate()}`;
        const { tras } = ydata(date.getFullYear());
        const llegada = Object.keys(tras).find(k => sameDay(tras[k], date));
        if (llegada) return SOLEM[llegada];
        return tras[key] ? null : SOLEM[key] || null;
    }

    function getLit(date) {
        const y = date.getFullYear(), m = date.getMonth() + 1;
        const { E, adv, ashWed, palm, holyThu, pent, bap, dec25, mov } = ydata(y);
        const s = solemDe(date);
        for (const [day, data] of mov) if (sameDay(date, day) && !(data.mem && s && s.g === 'S')) return data;
        if (s) return { tiempo: GRADO[s.g], color: '#b91c1c', icono: s.i, fiesta: s.n, p: s.p };
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
        const anos = Array.from({ length: 11 }, (_, i) => yActual - 1 + i);
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

        const crearEvento = (id, fecha, titulo, desc, url, esFijo, excluidas = []) => {
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
            if (esFijo) ev.splice(8, 0, 'RRULE:FREQ=YEARLY', ...excluidas.map(e => `EXDATE;VALUE=DATE:${fDate(e)}`));
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
            'X-WR-TIMEZONE:Europe/Madrid'];

        // 1. SOLEM fijas con RRULE:FREQ=YEARLY
        for (const [key, s] of Object.entries(SOLEM)) {
            const [m, d] = key.split('-').map(Number);
            const link = BASE + s.p;
            const id = generarUID(`fijo-${pad(m)}${pad(d)}`, s.n);
            lineas.push(...crearEvento(id, new Date(2024, m - 1, d), s.n,
                `Grado: ${GRADO[s.g]}\nMás info: ${link}`, link, true,
                anos.filter(y => ydata(y).tras[key]).map(y => new Date(y, m - 1, d))));
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
        for (const y of anos) {
            try {
                const { mov, tras } = ydata(y);
                for (const [fecha, info] of mov) {
                    const fija = solemDe(fecha);
                    if (info.mem && fija && fija.g === 'S') continue;
                    const link = info.p ? (BASE + info.p) : BASE;
                    const id = generarUID(`mov-${y}`, info.fiesta);
                    lineas.push(...crearEvento(id, fecha, info.fiesta,
                        `${info.tiempo || 'Liturgia'}\nMás info: ${link}`, link, false));
                }
                for (const [key, fecha] of Object.entries(tras)) {
                    const s = SOLEM[key], link = BASE + s.p;
                    lineas.push(...crearEvento(generarUID(`mov-${y}`, s.n), fecha, s.n,
                        `Grado: ${GRADO[s.g]}\nMás info: ${link}`, link, false));
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
  color:var(--wt-tx);background:var(--wt-bg);border:1px solid var(--wt-bd);border-radius:0px;overflow:hidden;width:100%;
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
.wikitolica-calendario-wt .wikitolica-calendario-a{color:var(--wt-lk) !important;text-decoration:none;cursor:pointer}
.wikitolica-calendario-wt .wikitolica-calendario-a:hover{text-decoration:underline;color:var(--wt-lkh) !important;}
.wikitolica-calendario-wt .wikitolica-calendario-hoy{background:var(--wt-bg-s);border-bottom:1px solid var(--wt-bd);padding:.7em .85em;display:flex;gap:.75em;align-items:center;min-width:0}
.wikitolica-calendario-wt .wikitolica-calendario-stripe{width:3px;align-self:stretch;border-radius:2px;flex-shrink:0;transition:background .3s}
.wikitolica-calendario-wt .wikitolica-calendario-body{flex:1;min-width:0;overflow:hidden}
.wikitolica-calendario-wt .wikitolica-calendario-fecha{font-size:.67em;color:var(--wt-mu);margin-bottom:.15em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wikitolica-calendario-wt .wikitolica-calendario-tiempo{font-size:.97em;font-weight:700;line-height:1.2;color:var(--wt-tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wikitolica-calendario-wt .wikitolica-calendario-tiempo .wikitolica-calendario-a{color:inherit !important;}
.wikitolica-calendario-wt .wikitolica-calendario-fiesta{font-size:.78em;color:var(--wt-lk);margin-top:.1em;display:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wikitolica-calendario-wt .wikitolica-calendario-fiesta .wikitolica-calendario-a{color:inherit}
.wikitolica-calendario-wt .wikitolica-calendario-icono{font-size:1.35em;line-height:1;flex-shrink:0}
.wikitolica-calendario-wt .wikitolica-calendario-addcal{padding:.38em .85em;border-bottom:1px solid var(--wt-bd);text-align:center;font-size:.7em;color:var(--wt-mu);background:var(--wt-bg)}
.wikitolica-calendario-wt .wikitolica-calendario-addcal .wikitolica-calendario-a{color:var(--wt-mu) !important;font-weight:normal !important;}
.wikitolica-calendario-wt .wikitolica-calendario-addcal .wikitolica-calendario-a:hover{color:var(--wt-lk);font-weight:normal !important;}
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
.wikitolica-calendario-wt .wikitolica-calendario-foot .wikitolica-calendario-a{color:var(--wt-lk);font-weight:normal;}
.wikitolica-calendario-wt .wikitolica-calendario-foot .wikitolica-calendario-a:hover{color:var(--wt-lkh);font-weight:normal;text-decoration:underline}
.wikitolica-calendario-wt[data-wt-narrow] .wikitolica-calendario-hoy{padding:.55em .55em;gap:.55em}
.wikitolica-calendario-wt[data-wt-narrow] .wikitolica-calendario-addcal{padding:.35em .55em}
.wikitolica-calendario-wt[data-wt-narrow] .wikitolica-calendario-row{grid-template-columns:34px 1fr;gap:0 .35em;padding:.3em .55em}
.wikitolica-calendario-wt[data-wt-narrow] .wikitolica-calendario-foot{padding:.4em .55em}
`;

    const MO  = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const DOW = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

    const SELF = /^(www\.)?wikitolica\.com$/.test(typeof location !== 'undefined' ? location.hostname : '');
    const TA = SELF ? '' : ' target="_blank" rel="nofollow external noopener"';
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
        (SAINTS[todayKey] || []).slice(0, lit.fiesta ? 2 : 3).forEach(s => fiestaItems.push(s));

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
            const saints = (SAINTS[key] || []).slice(0, isMov ? 2 : 3);
            if (!isMov && !saints.length) continue;
            const items = [];
            if (isMov) items.push({ n: dl.fiesta, p: dl.p });
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
            ? `<div class="wikitolica-calendario-addcal"><a href="#" class="wikitolica-calendario-a wikitolica-calendario-addcal-btn">📅 Añade a tu calendario personal</a></div>`
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
