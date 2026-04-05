(function () {
    'use strict';

    const BASE = 'https://www.wikitolica.com';
    const u = p => BASE + p;

    /* Categorías: color del acento + etiqueta */
    const CAT = {
        dog: { label: 'Dogma',           color: '#7f1d1d' },
        teo: { label: 'Teología',        color: '#1e3a5f' },
        her: { label: 'Herejía',         color: '#4a044e' },
        sac: { label: 'Sacramento',      color: '#14532d' },
        con: { label: 'Concilio',        color: '#451a03' },
        dev: { label: 'Devoción',        color: '#713f12' },
        mor: { label: 'Moral',           color: '#1e3a5f' },
        his: { label: 'Historia',        color: '#1c1917' },
        lit: { label: 'Liturgia',        color: '#3b0764' },
        esp: { label: 'Espiritualidad',  color: '#0c4a6e' },
    };

    /* 130 conceptos — ciclo sin repetición durante más de un año natural.
       Selección determinista: epoch días % total → mismo concepto para todos el mismo día.
       Slugs verificados contra knowledge-graph.jsonld (abr. 2026).
       d: descripción breve (~10 palabras máx). */
    const C = [
        /* ── DOGMAS ── */
        { n: 'Transustanciación',            p: '/t/transubstanciacion/',                              c: 'dog', d: 'El pan y el vino se convierten realmente en el Cuerpo y la Sangre de Cristo.' },
        { n: 'Theotokos',                    p: '/t/theotokos/',                                       c: 'dog', d: 'María es «Madre de Dios»: dogma definido en el Concilio de Éfeso (431).' },
        { n: 'Purgatorio',                   p: '/p/purgatorio/',                                      c: 'dog', d: 'Estado de purificación entre la muerte y la gloria; dogma de Florencia (1439).' },
        { n: 'Pecado original',              p: '/p/pecado-original/',                                 c: 'dog', d: 'Falta de Adán que priva a toda la humanidad de la gracia santificante.' },
        { n: 'Infalibilidad pontificia',     p: '/i/infalibilidad-papal/',                             c: 'dog', d: 'El Papa no puede errar al definir dogmas de fe y costumbres ex cathedra.' },
        { n: 'Inmortalidad del alma',        p: '/d/dogma-de-la-inmortalidad-del-alma-humana/',        c: 'dog', d: 'El alma espiritual no muere con el cuerpo; subsiste y resucitará.' },
        { n: 'Inmaculada Concepción',        p: '/d/dogma-de-la-inmaculada-concepcion-de-maria/',      c: 'dog', d: 'María fue preservada del pecado original desde su concepción; Pío IX, 1854.' },
        { n: 'Asunción de María',            p: '/d/dogma-de-asuncion-en-cuerpo-y-alma-de-maria/',    c: 'dog', d: 'María fue llevada en cuerpo y alma a la gloria celestial; Pío XII, 1950.' },
        { n: 'Primacía del Papa',            p: '/d/dogma-de-la-primacia-del-papa/',                  c: 'dog', d: 'El obispo de Roma tiene jurisdicción plena sobre toda la Iglesia.' },
        { n: 'Resurrección de Cristo',       p: '/d/dogma-de-la-resurreccion-de-jesucristo/',         c: 'dog', d: 'Cristo resucitó corporalmente al tercer día: fundamento de toda la fe cristiana.' },
        { n: 'Existencia del Purgatorio',   p: '/d/dogma-de-la-existencia-del-purgatorio/',          c: 'dog', d: 'La Iglesia define el purgatorio como verdad revelada, no mera hipótesis teológica.' },
        { n: 'Cielo e Infierno',             p: '/d/dogma-de-del-cielo-y-del-infierno-como-realidades-eternas/', c: 'dog', d: 'Cielo e infierno son realidades eternas, no estados temporales ni simbólicos.' },
        { n: 'Trinidad',                     p: '/t/trinidad/',                                        c: 'dog', d: 'Un solo Dios en tres Personas distintas: Padre, Hijo y Espíritu Santo.' },
        { n: 'Encarnación',                  p: '/e/encarnacion/',                                     c: 'dog', d: 'El Hijo de Dios asumió la naturaleza humana en el seno de la Virgen María.' },
        /* ── TEOLOGÍA ── */
        { n: 'Filioque',                     p: '/f/filioque/',                                        c: 'teo', d: 'El Espíritu Santo procede del Padre y del Hijo: causa del Cisma de 1054.' },
        { n: 'Gracia santificante',          p: '/g/gracia-santificante/',                             c: 'teo', d: 'Participación habitual en la vida divina que transforma el alma del cristiano.' },
        { n: 'Gracia',                       p: '/g/gracia/',                                          c: 'teo', d: 'Ayuda gratuita de Dios que eleva al hombre sobre sus capacidades naturales.' },
        { n: 'Magisterio ordinario',         p: '/m/magisterio-ordinario/',                            c: 'teo', d: 'Enseñanza habitual del Papa y obispos que requiere asentimiento religioso.' },
        { n: 'Apofatismo',                   p: '/a/apofatismo/',                                      c: 'teo', d: 'Conocemos a Dios negando lo que no es: teología negativa de la tradición oriental.' },
        { n: 'Analogía del ser',             p: '/a/analogia-del-ser/',                                c: 'teo', d: 'Podemos hablar de Dios en términos humanos, solo de modo analógico y no unívoco.' },
        { n: 'Escatología',                  p: '/e/escatologia/',                                     c: 'teo', d: 'Tratado sobre las realidades últimas: muerte, juicio, cielo, infierno, resurrección.' },
        { n: 'Parusía',                      p: '/p/parusia/',                                         c: 'teo', d: 'Segunda Venida gloriosa de Cristo al fin de los tiempos para juzgar a todos.' },
        { n: 'Providencia divina',           p: '/p/providencia-divina/',                              c: 'teo', d: 'Dios conduce todas las criaturas hacia su fin con sabiduría y amor.' },
        { n: 'Apocatástasis',                p: '/a/apocatastasis/',                                   c: 'teo', d: 'Teoría de Orígenes sobre la restauración final de todos: condenada en 543.' },
        { n: 'Tradición apostólica',         p: '/t/tradicion-apostolica/',                            c: 'teo', d: 'Depósito de fe transmitido por los Apóstoles mediante liturgia y sucesión episcopal.' },
        { n: 'Kénosis',                      p: '/k/kenosis/',                                         c: 'teo', d: '«Vaciamiento» del Hijo de Dios al asumir la condición humana limitada.' },
        { n: 'Limbo',                        p: '/l/limbo/',                                           c: 'teo', d: 'Hipótesis medieval sobre niños sin Bautismo; hoy la Iglesia espera su salvación.' },
        { n: 'Redención',                    p: '/r/redencion/',                                       c: 'teo', d: 'Cristo libera al hombre del pecado con su Pasión, muerte y Resurrección.' },
        { n: 'Soteriología',                 p: '/s/soteriologia/',                                    c: 'teo', d: 'Tratado teológico sobre la salvación humana obrada por Jesucristo.' },
        { n: 'Teología del cuerpo',          p: '/t/teologia-del-cuerpo/',                             c: 'teo', d: 'Antropología de Juan Pablo II: el cuerpo expresa la vocación al amor esponsal.' },
        { n: 'Teología de la Liberación',    p: '/t/teologia-de-la-liberacion/',                      c: 'teo', d: 'Corriente latinoamericana que articula fe y justicia social; discernida por Roma.' },
        { n: 'Voluntad, gracia e intelecto', p: '/v/voluntad-gracia-intelecto/',                      c: 'teo', d: 'La relación entre la libertad humana y la acción de la gracia divina.' },
        { n: 'Eclesiología',                 p: '/e/eclesiologia/',                                    c: 'teo', d: 'Tratado sobre la naturaleza, misión y estructura de la Iglesia de Cristo.' },
        { n: 'Cristología',                  p: '/c/cristologia/',                                     c: 'teo', d: 'Estudio teológico de la persona, naturaleza y obra de Jesucristo.' },
        { n: 'Primacía petrina',             p: '/p/primacia-petrina/',                                c: 'teo', d: 'Pedro recibió de Cristo el primado sobre los Apóstoles y la Iglesia.' },
        { n: 'Biblia',                       p: '/b/biblia/',                                          c: 'teo', d: 'Palabra de Dios escrita: 73 libros inspirados reconocidos como canon en Trento.' },
        /* ── HEREJÍAS ── */
        { n: 'Herejía',                      p: '/h/herejia/',                                         c: 'her', d: 'Negación pertinaz de una verdad de fe revelada por quien ha sido bautizado.' },
        { n: 'Arrianismo',                   p: '/a/arrianismo/',                                      c: 'her', d: 'Arrio negó la divinidad del Hijo; condenado en el Concilio de Nicea (325).' },
        { n: 'Pelagianismo',                 p: '/p/pelagianismo/',                                    c: 'her', d: 'El hombre puede salvarse por esfuerzo propio sin la gracia; condenado en 418.' },
        { n: 'Nestorianismo',                p: '/n/nestorianismo/',                                   c: 'her', d: 'Nestorio dividía en dos personas la humanidad y divinidad de Cristo.' },
        { n: 'Monofisismo',                  p: '/m/monofisismo/',                                     c: 'her', d: 'Cristo tendría solo una naturaleza divina; condenado en Calcedonia (451).' },
        { n: 'Gnosticismo',                  p: '/g/gnosticismo/',                                     c: 'her', d: 'Salvación por conocimiento secreto; dualismo materia-espíritu contrario a la creación.' },
        { n: 'Donatismo',                    p: '/d/donatismo/',                                       c: 'her', d: 'La validez sacramental dependería de la santidad del ministro: error condenado.' },
        { n: 'Iconoclasia',                  p: '/i/iconoclasia/',                                     c: 'her', d: 'El siglo VIII destruyó imágenes sagradas tachándolas de idolatría; condenada en 787.' },
        { n: 'Quietismo',                    p: '/q/quietismo/',                                       c: 'her', d: 'Aniquilación de la voluntad hasta suprimir todo acto; condenado en 1687.' },
        { n: 'Jansenismo',                   p: '/j/jansenismo/',                                      c: 'her', d: 'Gracia irresistible y rigorismo extremo; condenado por Clemente XI en 1713.' },
        { n: 'Adopcionismo',                 p: '/a/adopcionismo/',                                    c: 'her', d: 'Jesús habría sido adoptado como Hijo en el Bautismo; negaba su preexistencia divina.' },
        { n: 'Catarismo',                    p: '/c/catarismo/',                                       c: 'her', d: 'Dualismo medieval: el mundo material es obra del mal; sin sacramentos ni matrimonio.' },
        { n: 'Maniqueísmo',                  p: '/m/maniqueismo/',                                     c: 'her', d: 'Bien y Mal eternamente iguales: religión dualista de Mani, siglo III d.C.' },
        { n: 'Priscilianismo',               p: '/p/priscilianismo/',                                  c: 'her', d: 'Hereje hispano del s. IV, gnóstico y maniqueo; primer ejecutado por el Estado.' },
        { n: 'Conciliarismo',                p: '/c/conciliarismo/',                                   c: 'her', d: 'El concilio sería superior al Papa: doctrina condenada en el Letrán V (1516).' },
        { n: 'Montanismo',                   p: '/m/montanismo/',                                      c: 'her', d: 'Profetismo carismático del s. II que desafiaba la autoridad jerárquica de la Iglesia.' },
        { n: 'Apolinarismo',                 p: '/a/apolinarismo/',                                    c: 'her', d: 'Cristo no tendría alma humana completa; condenado en Constantinopla I (381).' },
        { n: 'Marcionismo',                  p: '/m/marcionismo/',                                     c: 'her', d: 'Marción rechazaba el Antiguo Testamento y el Dios creador: gnosticismo radical.' },
        { n: 'Waldenses',                    p: '/v/valdenses/',                                       c: 'her', d: 'Movimiento de Pedro Valdo (s. XII): pobreza evangélica que derivó en cisma.' },
        { n: 'Estoicismo y cristianismo',    p: '/e/estoicismo/',                                      c: 'her', d: 'Logos y providencia estoicos influyeron en los Padres; depurados de su determinismo.' },
        /* ── SACRAMENTOS ── */
        { n: 'Sacramento',                   p: '/s/sacramento/',                                      c: 'sac', d: 'Signo eficaz instituido por Cristo que causa la gracia que significa.' },
        { n: 'Bautismo',                     p: '/b/bautismo/',                                        c: 'sac', d: 'Primer sacramento: borra el pecado original e incorpora a la Iglesia.' },
        { n: 'Confirmación',                 p: '/c/confirmacion/',                                    c: 'sac', d: 'Sella con el Espíritu Santo y perfecciona la gracia bautismal del cristiano.' },
        { n: 'Eucaristía',                   p: '/e/eucaristia/',                                      c: 'sac', d: 'Centro de la vida cristiana: Cristo realmente presente bajo pan y vino.' },
        { n: 'Penitencia / Confesión',       p: '/p/penitencia/',                                      c: 'sac', d: 'Perdona los pecados post-bautismales mediante la absolución del sacerdote.' },
        { n: 'Unción de enfermos',           p: '/u/uncion-de-los-enfermos/',                          c: 'sac', d: 'Gracia especial para el enfermo grave, unido así a la Pasión de Cristo.' },
        { n: 'Sacramento del Orden',         p: '/o/orden-sacerdotal/',                                c: 'sac', d: 'Configura con Cristo Sacerdote en tres grados: episcopado, presbiterado, diaconado.' },
        { n: 'Matrimonio',                   p: '/m/matrimonio-canonico/',                             c: 'sac', d: 'Pacto esponsal elevado por Cristo a sacramento; signo de la unión Cristo-Iglesia.' },
        { n: 'Sacramentos de iniciación',    p: '/s/sacramentos-de-iniciacion/',                       c: 'sac', d: 'Bautismo, Confirmación y Eucaristía incorporan plenamente a la Iglesia.' },
        { n: 'Sacramentos de curación',      p: '/s/sacramentos-de-curacion/',                         c: 'sac', d: 'Penitencia y Unción curan el alma herida por el pecado o la enfermedad.' },
        { n: 'Sacramentos del servicio',     p: '/s/sacramentos-del-servicio/',                        c: 'sac', d: 'Orden y Matrimonio están ordenados al servicio de la comunidad eclesial.' },
        /* ── CONCILIOS ── */
        { n: 'Concilio de Jerusalén',        p: '/c/concilio-de-jerusalen/',                           c: 'con', d: 'Primera asamblea apostólica (c. 49): los gentiles no necesitan circuncisión.' },
        { n: 'Concilio de Nicea I',          p: '/c/concilio-de-nicea/',                               c: 'con', d: 'Primer concilio ecuménico (325): definió la consustancialidad del Hijo con el Padre.' },
        { n: 'Concilio de Constantinopla I', p: '/c/concilio-de-constantinopla-i/',                   c: 'con', d: 'Segundo concilio (381): completó el Credo añadiendo la divinidad del Espíritu Santo.' },
        { n: 'Concilio de Éfeso',            p: '/c/concilio-de-efeso/',                               c: 'con', d: 'Tercer concilio (431): proclamó a María Theotokos frente al nestorianismo.' },
        { n: 'Concilio de Calcedonia',       p: '/c/concilio-de-calcedonia/',                          c: 'con', d: 'Cuarto concilio (451): dos naturalezas en Cristo, sin confusión ni separación.' },
        { n: 'Concilio de Constantinopla II',p: '/c/concilio-de-constantinopla-ii/',                  c: 'con', d: 'Quinto concilio (553): condenó las Tres Controversias y el origenismo.' },
        { n: 'Concilio de Constantinopla III',p: '/c/concilio-de-constantinopla-iii/',                c: 'con', d: 'Sexto concilio (681): dos voluntades en Cristo frente al monotelismo.' },
        { n: 'Concilio de Nicea II',         p: '/c/concilio-de-nicea-ii/',                            c: 'con', d: 'Séptimo concilio (787): restableció la veneración legítima de imágenes sagradas.' },
        { n: 'Concilio de Constantinopla IV',p: '/c/concilio-de-constantinopla-iv/',                  c: 'con', d: 'Octavo concilio (869): depuso a Focio y consolidó la primacía romana de Oriente.' },
        { n: 'Concilio de Orange II',        p: '/c/concilio-de-orange-ii/',                           c: 'con', d: 'Orange (529): clave contra el semipelagianismo; la gracia precede a toda acción.' },
        { n: 'Concilio de Letrán I',         p: '/c/concilio-de-letran-i/',                            c: 'con', d: 'Primer Letrán (1123): ratificó el Concordato de Worms sobre las investiduras.' },
        { n: 'Concilio de Letrán II',        p: '/c/concilio-de-letran-ii/',                           c: 'con', d: 'Segundo Letrán (1139): condenó el cisma de Anacleto II y el arnoldismo.' },
        { n: 'Concilio de Letrán III',       p: '/c/concilio-de-letran-iii/',                          c: 'con', d: 'Tercer Letrán (1179): fijó la elección papal por mayoría de dos tercios.' },
        { n: 'Concilio de Letrán IV',        p: '/c/concilio-de-letran-iv/',                           c: 'con', d: 'Cuarto Letrán (1215): definió transustanciación y confesión anual obligatoria.' },
        { n: 'Concilio de Lyon I',           p: '/c/concilio-de-lyon-i/',                              c: 'con', d: 'Lyon I (1245): depuso al emperador Federico II y convocó nueva cruzada.' },
        { n: 'Concilio de Lyon II',          p: '/c/concilio-de-lyon-ii/',                             c: 'con', d: 'Lyon II (1274): intentó unión con Oriente; adoptó el Filioque en el Credo.' },
        { n: 'Concilio de Vienne',           p: '/c/concilio-de-vienne/',                              c: 'con', d: 'Vienne (1311-1312): suprimió la Orden del Temple y trató la reforma eclesiástica.' },
        { n: 'Concilio de Constanza',        p: '/c/concilio-de-constanza/',                           c: 'con', d: 'Constanza (1414-1418): puso fin al Gran Cisma de Occidente eligiendo a Martín V.' },
        { n: 'Concilio de Florencia',        p: '/c/concilio-de-basilea-ferrara-florencia/',           c: 'con', d: 'Florencia (1431-1449): intentó unión con Oriente y definió el dogma del purgatorio.' },
        { n: 'Concilio de Pisa I',           p: '/c/concilio-de-pisa-i/',                              c: 'con', d: 'Pisa (1409): convocado para resolver el cisma de Aviñón, creó un tercer papa.' },
        { n: 'Concilio de Letrán V',         p: '/c/concilio-de-letran-v/',                            c: 'con', d: 'Letrán V (1512-1517): condenó el conciliarismo justo antes de la Reforma.' },
        { n: 'Concilio de Trento',           p: '/c/concilio-de-trento/',                              c: 'con', d: 'Trento (1545-1563): definió la respuesta doctrinal católica a la Reforma protestante.' },
        { n: 'Concilio Vaticano I',          p: '/c/concilio-vaticano-i/',                             c: 'con', d: 'Vaticano I (1869-1870): definió la infalibilidad y el primado pontificio universal.' },
        { n: 'Concilio Vaticano II',         p: '/c/concilio-vaticano-ii/',                            c: 'con', d: 'Vaticano II (1962-1965): renovó liturgia, eclesiología y diálogo con el mundo.' },
        { n: 'Concilio de Toledo III',       p: '/c/concilio-de-toledo-iii/',                          c: 'con', d: 'Toledo (589): conversión de los visigodos e inserción del Filioque en Occidente.' },
        { n: 'Concilio Quinisexto',          p: '/c/conclave-de-trullo-quinisexto/',                   c: 'con', d: 'Trullo (692): disciplina solo reconocida por Oriente; diverge con la práctica latina.' },
        { n: 'Sínodo',                       p: '/s/sinodo/',                                          c: 'con', d: 'Asamblea de obispos para tratar asuntos de fe, disciplina o pastoral eclesial.' },
        /* ── DEVOCIÓN ── */
        { n: 'Rosario',                      p: '/r/rosario/',                                         c: 'dev', d: 'Veinte misterios de Cristo meditados con María; propagado por santo Domingo.' },
        { n: 'Sagrado Corazón',              p: '/s/sagrado-corazon-de-jesus/',                        c: 'dev', d: 'Culto al Corazón de Jesús como símbolo de su amor infinito a la humanidad.' },
        { n: 'Lectio Divina',                p: '/l/lectio-divina/',                                   c: 'dev', d: 'Lectura orante de las Escrituras: lectio, meditatio, oratio, contemplatio.' },
        { n: 'Novena',                       p: '/n/novena/',                                          c: 'dev', d: 'Nueve días de oración continua, normalmente previos a una fiesta litúrgica.' },
        /* ── MORAL ── */
        { n: 'Virtudes teologales',          p: '/v/virtudes-teologales/',                             c: 'mor', d: 'Fe, Esperanza y Caridad: infundidas por Dios, orientan hacia Él como fin último.' },
        { n: 'Virtudes cardinales',          p: '/v/virtudes-cardinales/',                             c: 'mor', d: 'Prudencia, Justicia, Fortaleza y Templanza: eje de la ética natural cristiana.' },
        { n: 'Ley natural',                  p: '/l/ley-divina-ley-natural-y-ley-positiva/',           c: 'mor', d: 'La razón humana discierne el bien del mal: fundamento de la ética universal.' },
        { n: 'Libertad religiosa',           p: '/l/libertad-religiosa/',                              c: 'mor', d: 'Derecho a buscar la verdad sin coacción; reconocido en Dignitatis Humanae (1965).' },
        { n: 'Doctrina social de la Iglesia',p: '/d/doctrina-social-de-la-iglesia/',                  c: 'mor', d: 'Dignidad, bien común, subsidiariedad y solidaridad: pilares desde la Rerum Novarum.' },
        { n: 'Pecado mortal',                p: '/p/pecado-mortal/',                                   c: 'mor', d: 'Rompe la comunión con Dios: materia grave, plena advertencia, deliberado consentimiento.' },
        { n: 'Pecado venial',                p: '/p/pecado-venial/',                                   c: 'mor', d: 'Debilita la caridad sin romperla; exige reparación pero no pierde la gracia.' },
        { n: 'Siete pecados capitales',      p: '/s/siete-pecados-capitales/',                         c: 'mor', d: 'Soberbia, avaricia, lujuria, ira, gula, envidia y pereza: raíces del mal moral.' },
        { n: 'Usura',                        p: '/u/usura-pecado/',                                    c: 'mor', d: 'Cobrar intereses abusivos por préstamo: gravemente condenada por la moral católica.' },
        { n: 'Teología moral',               p: '/t/teologia-moral/',                                  c: 'mor', d: 'Disciplina que estudia el actuar humano a la luz de la Revelación y la razón.' },
        { n: 'Libertad de conciencia',       p: '/l/libertad-de-conciencia/',                          c: 'mor', d: 'Toda persona está obligada a seguir su conciencia recta, siempre que la forme bien.' },
        /* ── HISTORIA ── */
        { n: 'Simonía',                      p: '/s/simonia/',                                         c: 'his', d: 'Compraventa de bienes espirituales; gran abuso medieval combatido en el s. XI.' },
        { n: 'Martirio',                     p: '/m/martirio/',                                        c: 'his', d: 'Muerte aceptada por la fe antes que renegar de Cristo: semilla de la Iglesia.' },
        { n: 'Diezmo',                       p: '/d/diezmo/',                                          c: 'his', d: 'La décima parte de los bienes para el culto y los pobres; suprimido en el s. XIX.' },
        { n: 'Cisma de Oriente',             p: '/c/cisma-de-oriente/',                                c: 'his', d: 'Ruptura de 1054 entre Roma y Constantinopla: origen de la Iglesia Ortodoxa.' },
        { n: 'Cisma protestante',            p: '/c/cisma-protestante/',                               c: 'his', d: 'Fractura del s. XVI iniciada por Lutero: dividió el Occidente cristiano.' },
        { n: 'Gran Cisma de Occidente',      p: '/c/cisma-de-occidente/',                              c: 'his', d: 'Crisis 1378-1417: tres papas rivales; resuelto en Constanza con la elección de Martín V.' },
        { n: 'Reforma Protestante',          p: '/r/reforma-protestante/',                             c: 'his', d: 'Lutero (1517) y Calvino dividieron el Occidente cristiano por doctrina y abusos.' },
        { n: 'Reforma Gregoriana',           p: '/r/reforma-gregoriana/',                              c: 'his', d: 'Gregorio VII depuró la Iglesia en el s. XI: simonía, nicolaísmo e investiduras.' },
        { n: 'Patrística',                   p: '/p/patristica/',                                      c: 'his', d: 'Estudio de los escritos de los Padres de la Iglesia (ss. I-VIII).' },
        { n: 'Inquisición',                  p: '/i/inquisicion/',                                     c: 'his', d: 'Tribunal eclesiástico medieval para juzgar la herejía; reformado en el s. XVI.' },
        { n: 'Primera Cruzada',              p: '/p/primera-cruzada/',                                 c: 'his', d: 'Convocada por Urbano II (1095): recuperó Jerusalén para la cristiandad en 1099.' },
        { n: 'Escolástica',                  p: '/e/escolastica/',                                     c: 'his', d: 'Método medieval que integra fe y razón; culmen en Tomás de Aquino (s. XIII).' },
        /* ── LITURGIA ── */
        { n: 'Año litúrgico',                p: '/a/ano-liturgico/',                                   c: 'lit', d: 'Ciclo anual que recorre el misterio de Cristo de Adviento a Tiempo Ordinario.' },
        { n: 'Iconografía cristiana',        p: '/i/iconografia-cristiana/',                           c: 'lit', d: 'El icono no es decoración: es teología en imagen, ventana a lo divino.' },
        { n: 'Rito ambrosiano',              p: '/r/rito-ambrosiano/',                                 c: 'lit', d: 'Liturgia propia de Milán atribuida a san Ambrosio; viva hasta hoy.' },
        { n: 'Rito Mozárabe',                p: '/r/rito-mozarabe/',                                   c: 'lit', d: 'Antigua liturgia hispana anterior a la romanización; aún celebrada en Toledo.' },
        { n: 'Liturgia de las Horas',        p: '/l/liturgia-de-las-horas/',                           c: 'lit', d: 'Oración oficial de la Iglesia que santifica las distintas horas del día.' },
        { n: 'Liturgia eucarística',         p: '/l/liturgia-eucaristica/',                            c: 'lit', d: 'Segunda parte de la Misa: ofertorio, consagración y comunión.' },
        { n: 'Liturgia de la Palabra',       p: '/l/liturgia-de-la-palabra/',                          c: 'lit', d: 'Primera parte de la Misa: lecturas, salmo, Evangelio y homilía.' },
        { n: 'Liturgia',                     p: '/l/liturgia/',                                        c: 'lit', d: 'Culto público oficial de la Iglesia: acción de Cristo y del Pueblo de Dios.' },
        /* ── ESPIRITUALIDAD ── */
        { n: 'Hesicasmo',                    p: '/h/hesicasmo/',                                       c: 'esp', d: 'Oración del corazón en silencio interior; busca la Luz increada de Dios.' },
        { n: 'Examen de conciencia',         p: '/e/examen-de-conciencia/',                            c: 'esp', d: 'Revisión diaria de los propios actos ante Dios; pieza central del método ignaciano.' },
        { n: 'Ascetismo',                    p: '/a/ascetismo/',                                       c: 'esp', d: 'Renuncia y mortificación para configurarse con la Cruz de Cristo.' },
        { n: 'Mística',                      p: '/m/mistica/',                                         c: 'esp', d: 'Experiencia directa y transformante de Dios; cumbre de la vida espiritual.' },
        { n: 'Mística cristiana',            p: '/m/mistica-cristiana/',                               c: 'esp', d: 'Tradición de unión con Dios que atraviesa toda la historia de la Iglesia.' },
        { n: 'Oración',                      p: '/o/oracion/',                                         c: 'esp', d: 'Elevación del alma a Dios: vocal, mental, contemplativa o litúrgica.' },
        { n: 'Contemplación',                p: '/c/contemplacion/',                                   c: 'esp', d: 'Oración silenciosa de amor que descansa en la presencia de Dios.' },
        { n: 'Espiritualidad ignaciana',     p: '/e/espiritualidad-ignaciana/',                        c: 'esp', d: 'Discernimiento y Ejercicios Espirituales: encontrar a Dios en todas las cosas.' },
        { n: 'Espiritualidad monástica',     p: '/e/espiritualidad-monastica/',                        c: 'esp', d: 'Ora et labora benedictino: oración, trabajo y comunidad como camino de santidad.' },
    ];

    const CSS = `
#wikitolica-concepto,.wikitolica-concepto{display:block;margin:0;padding:0;box-sizing:border-box}
.wikitolica-concepto-wt{
  all:initial;display:block;box-sizing:border-box;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size:16px;line-height:1.5;-webkit-text-size-adjust:100%;text-size-adjust:100%;
  color:var(--wc-tx);background:var(--wc-bg);border:1px solid var(--wc-bd);border-radius:4px;overflow:hidden;width:100%;
  --wc-bg:#fafafa;--wc-bg-s:#f8f9fa;--wc-bd:#ddd;--wc-tx:#333;--wc-mu:#666;--wc-lk:#0d6efd;--wc-lkh:#0a58ca
}
@media(prefers-color-scheme:dark){.wikitolica-concepto-wt{
  --wc-bg:#1a1a1a;--wc-bg-s:#2d2d2d;--wc-bd:#444;--wc-tx:#c0c0c0;--wc-mu:#888;--wc-lk:#4dabf7;--wc-lkh:#74c0fc;
  font-weight:300;letter-spacing:.01ch
}}
.wikitolica-concepto-wt *,.wikitolica-concepto-wt *::before,.wikitolica-concepto-wt *::after{
  box-sizing:border-box;margin:0;padding:0;
  font-family:inherit;font-size:inherit;font-weight:inherit;font-style:normal;
  line-height:inherit;letter-spacing:inherit;word-spacing:normal;
  text-transform:none;text-decoration:none;vertical-align:baseline;color:inherit
}
.wikitolica-concepto-wt .wikitolica-concepto-a{color:var(--wc-lk);text-decoration:none;cursor:pointer}
.wikitolica-concepto-wt .wikitolica-concepto-a:hover{text-decoration:underline;color:var(--wc-lkh)}
.wikitolica-concepto-wt .wikitolica-concepto-stripe{height:4px;transition:background .3s}
.wikitolica-concepto-wt .wikitolica-concepto-body{padding:.75em .85em .6em}
.wikitolica-concepto-wt .wikitolica-concepto-cat{
  display:inline-block;font-size:.62em;font-weight:700;letter-spacing:.07em;
  text-transform:uppercase;padding:.15em .5em;border-radius:2px;margin-bottom:.4em;
  color:#fff;background:var(--wc-cat-color,#555)
}
.wikitolica-concepto-wt .wikitolica-concepto-titulo{
  font-size:.97em;font-weight:700;line-height:1.25;color:var(--wc-tx);margin-bottom:.25em
}
.wikitolica-concepto-wt .wikitolica-concepto-titulo .wikitolica-concepto-a{color:inherit}
.wikitolica-concepto-wt .wikitolica-concepto-titulo .wikitolica-concepto-a:hover{color:var(--wc-lk)}
.wikitolica-concepto-wt .wikitolica-concepto-desc{
  font-size:.72em;line-height:1.4;color:var(--wc-mu)
}
.wikitolica-concepto-wt .wikitolica-concepto-foot{
  padding:.45em .85em;border-top:1px solid var(--wc-bd);background:var(--wc-bg-s);
  display:flex;align-items:center;justify-content:space-between
}
.wikitolica-concepto-wt .wikitolica-concepto-label{font-size:.63em;color:var(--wc-mu);text-transform:uppercase;letter-spacing:.06em}
.wikitolica-concepto-wt .wikitolica-concepto-leer{font-size:.78em;font-weight:600;color:var(--wc-lk)}
.wikitolica-concepto-wt .wikitolica-concepto-leer:hover{color:var(--wc-lkh);text-decoration:underline}
`;

    const SELF = /^(www\.)?wikitolica\.com$/.test(typeof location !== 'undefined' ? location.hostname : '');
    const TA = SELF ? '' : ' target="_blank" rel="noopener"';
    const lnk = (href, text, cls) => `<a href="${href}"${TA} class="${cls}">${text}</a>`;

    function init(host) {
        if (host.dataset.loaded) return;
        host.dataset.loaded = '1';

        if (!document.getElementById('wikitolica-concepto-style')) {
            const s = document.createElement('style');
            s.id = 'wikitolica-concepto-style';
            s.textContent = CSS;
            document.head.appendChild(s);
        }

        // Selección determinista por día del año (epoch days % total)
        // → mismo concepto para todos los usuarios el mismo día
        const idx = Math.floor(Date.now() / 86400000) % C.length;
        const con = C[idx];
        const cat = CAT[con.c];
        const href = u(con.p);

        host.innerHTML =
            `<div class="wikitolica-concepto-wt">` +
                `<div class="wikitolica-concepto-stripe" style="background:${cat.color}"></div>` +
                `<div class="wikitolica-concepto-body">` +
                    `<span class="wikitolica-concepto-cat" style="--wc-cat-color:${cat.color}">${cat.label}</span>` +
                    `<div class="wikitolica-concepto-titulo">${lnk(href, con.n, 'wikitolica-concepto-a')}</div>` +
                    `<div class="wikitolica-concepto-desc">${con.d}</div>` +
                `</div>` +
                `<div class="wikitolica-concepto-foot">` +
                    `<span class="wikitolica-concepto-label">Concepto del día</span>` +
                    lnk(href, 'Leer artículo →', 'wikitolica-concepto-leer wikitolica-concepto-a') +
                `</div>` +
            `</div>`;
    }

    function bootstrap() {
        document.querySelectorAll('#wikitolica-concepto,.wikitolica-concepto').forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

    if (typeof window !== 'undefined') {
        window.WtConcepto = { init: bootstrap, initEl: init };
    }

})();
