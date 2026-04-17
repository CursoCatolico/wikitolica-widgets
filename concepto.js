(function () {
    'use strict';

    const BASE = 'https://www.wikitolica.com';
    const u = p => BASE + p;

    const CAT = {
        dog: { label: 'Dogma',          color: '#7f1d1d', emoji: '🏛️' },
        teo: { label: 'Teología',       color: '#1e3a5f', emoji: '✝️' },
        her: { label: 'Herejía',        color: '#4a044e', emoji: '⚔️' },
        sac: { label: 'Sacramento',     color: '#14532d', emoji: '💧' },
        con: { label: 'Concilio',       color: '#451a03', emoji: '📜' },
        dev: { label: 'Devoción',       color: '#713f12', emoji: '🙏' },
        mor: { label: 'Moral',          color: '#1e3a5f', emoji: '⚖️' },
        his: { label: 'Historia',       color: '#1c1917', emoji: '📖' },
        lit: { label: 'Liturgia',       color: '#3b0764', emoji: '🕯️' },
        esp: { label: 'Espiritualidad', color: '#0c4a6e', emoji: '🌿' },
        bib: { label: 'Biblia',         color: '#7c2d12', emoji: '📕' },
        fil: { label: 'Filosofía',      color: '#064e3b', emoji: '💡' },
    };

    /* 366 conceptos — ciclo anual completo (29-feb cubierto).
       Selección determinista: Math.floor(Date.now()/86400000) % C.length
       → mismo concepto para todos los usuarios el mismo día.
       12 categorías ~30-31 c/u. Slugs verificados vs KG (abr. 2026). d ≤ 120 chars. */
    const C = [
        /* ── DOGMAS (31) ── */
        { n:'Transustanciación',            p:'/t/transubstanciacion/',                              c:'dog', d:'El pan y el vino se convierten realmente en el Cuerpo y Sangre de Cristo.' },
        { n:'Theotokos',                    p:'/t/theotokos/',                                       c:'dog', d:'«Madre de Dios»: título dogmático definido en el Concilio de Éfeso (431).' },
        { n:'Purgatorio',                   p:'/p/purgatorio/',                                      c:'dog', d:'Estado de purificación entre la muerte y la gloria; dogma de Florencia (1439).' },
        { n:'Pecado original',              p:'/p/pecado-original/',                                 c:'dog', d:'Falta de Adán que priva a toda la humanidad de la gracia santificante.' },
        { n:'Infalibilidad pontificia',     p:'/i/infalibilidad-papal/',                             c:'dog', d:'El Papa está preservado de error al definir dogmas de fe ex cathedra.' },
        { n:'Inmortalidad del alma',        p:'/d/dogma-de-la-inmortalidad-del-alma-humana/',        c:'dog', d:'El alma espiritual no muere con el cuerpo; subsiste y espera la resurrección final.' },
        { n:'Inmaculada Concepción',        p:'/d/dogma-de-la-inmaculada-concepcion-de-maria/',      c:'dog', d:'María fue preservada del pecado original desde su concepción; Pío IX, 1854.' },
        { n:'Asunción de María',            p:'/d/dogma-de-asuncion-en-cuerpo-y-alma-de-maria/',    c:'dog', d:'María fue llevada en cuerpo y alma a la gloria celeste; Pío XII, 1950.' },
        { n:'Primacía del Papa',            p:'/d/dogma-de-la-primacia-del-papa/',                  c:'dog', d:'El obispo de Roma posee jurisdicción plena y universal sobre toda la Iglesia.' },
        { n:'Resurrección de Cristo',       p:'/d/dogma-de-la-resurreccion-de-jesucristo/',         c:'dog', d:'Cristo resucitó corporalmente al tercer día: fundamento de toda la fe cristiana.' },
        { n:'Cielo e Infierno eternos',     p:'/d/dogma-de-del-cielo-y-del-infierno-como-realidades-eternas/', c:'dog', d:'Cielo e infierno son realidades eternas, no estados temporales ni simbólicos.' },
        { n:'Santísima Trinidad',           p:'/t/trinidad/',                                        c:'dog', d:'Un solo Dios en tres Personas distintas y consustanciales: Padre, Hijo y Espíritu Santo.' },
        { n:'Encarnación',                  p:'/e/encarnacion/',                                     c:'dog', d:'El Hijo de Dios asumió la naturaleza humana en el seno de la Virgen María.' },
        { n:'Cristo, Hijo de Dios',         p:'/d/dogma-de-jesucristo-verdadero-hijo-de-dios/',     c:'dog', d:'Jesús no es un profeta ni un ángel: es el Hijo eterno consubstancial al Padre.' },
        { n:'Ascensión de Cristo',          p:'/d/dogma-de-la-ascension-de-jesucristo-al-cielo/',   c:'dog', d:'Cristo ascendió corporalmente a los cielos cuarenta días tras su Resurrección.' },
        { n:'Comunión de los Santos',       p:'/d/dogma-de-la-comunion-de-los-santos/',             c:'dog', d:'Vivos, almas del purgatorio y santos del cielo forman una sola comunión mística.' },
        { n:'Dios Creador',                 p:'/d/dogma-de-la-existencia-de-dios-creador-del-cielo-y-la-tierra/', c:'dog', d:'La existencia de un Dios personal Creador es verdad de fe definida por la Iglesia.' },
        { n:'Iglesia fundada por Cristo',   p:'/d/dogma-de-la-fundacion-de-la-iglesia-por-cristo/', c:'dog', d:'Cristo fundó una sola Iglesia visible sobre Pedro como roca: verdad dogmática.' },
        { n:'Institución sacramental',      p:'/d/dogma-de-la-institucion-de-los-sacramentos-por-cristo/', c:'dog', d:'Los siete sacramentos fueron instituidos por Cristo, no inventados por la Iglesia.' },
        { n:'Intercesión de los Santos',    p:'/d/dogma-de-la-intercesion-de-los-santos/',          c:'dog', d:'Los santos glorificados interceden ante Dios en favor de los fieles en la tierra.' },
        { n:'Virginidad de María',          p:'/d/dogma-de-la-natividad-virginal-de-jesus/',        c:'dog', d:'María concibió y dio a luz a Jesús sin dejar de ser virgen: dogma de fe.' },
        { n:'Misa como sacrificio',         p:'/d/dogma-de-la-naturaleza-sacrificial-de-la-eucaristia/', c:'dog', d:'La Misa no es solo un memorial: es el sacrificio de Cristo renovado sacramentalmente.' },
        { n:'Presencia real eucarística',   p:'/d/dogma-de-la-presencia-real-de-cristo-en-la-eucaristia/', c:'dog', d:'Cristo está real, verdadera y sustancialmente presente en la Eucaristía.' },
        { n:'Espíritu Santo, tercera Persona', p:'/d/dogma-del-espiritu-santo-como-tercera-persona-divina/', c:'dog', d:'El Espíritu Santo es la tercera Persona divina, consubstancial al Padre y al Hijo.' },
        { n:'Juicio particular y final',    p:'/d/dogma-del-juicio-particular-y-del-juicio-final/', c:'dog', d:'Cada alma es juzgada al morir; al fin del mundo habrá un juicio universal.' },
        { n:'Bautismo necesario',           p:'/d/dogma-de-la-necesidad-del-bautismo-para-la-salvacion/', c:'dog', d:'El Bautismo es necesario para la salvación; la Iglesia reconoce también el de deseo.' },
        { n:'Inerrancia bíblica',           p:'/d/dogma-de-la-inerrancia-de-la-sagrada-escritura/', c:'dog', d:'La Sagrada Escritura, inspirada por Dios, no puede contener error en lo que afirma.' },
        { n:'Infalibilidad de la Iglesia',  p:'/i/infalibilidad-de-la-iglesia-y-del-papa/',         c:'dog', d:'La infalibilidad papal es expresión de la indefectibilidad de toda la Iglesia.' },
        { n:'Existencia del Purgatorio',    p:'/d/dogma-de-la-existencia-del-purgatorio/',          c:'dog', d:'El Concilio de Florencia (1439) definió dogmáticamente la existencia del purgatorio.' },
        { n:'Dogma trinitario',             p:'/d/dogma-de-la-santisima-trinidad/',                 c:'dog', d:'La Trinidad es el misterio central del cristianismo: un Dios en tres Personas eternas.' },
        { n:'Mundo creado en el tiempo',    p:'/d/dogma-del-caracter-temporal-del-mundo/',          c:'dog', d:'El mundo tuvo un inicio en el tiempo y camina hacia un fin: verdad de fe.' },
        /* ── TEOLOGÍA (31) ── */
        { n:'Filioque',                     p:'/f/filioque/',                                        c:'teo', d:'El Espíritu Santo procede del Padre y del Hijo: causa del Cisma de Oriente de 1054.' },
        { n:'Gracia santificante',          p:'/g/gracia-santificante/',                             c:'teo', d:'Participación habitual en la vida divina que transforma el alma del cristiano.' },
        { n:'Gracia',                       p:'/g/gracia/',                                          c:'teo', d:'Ayuda gratuita de Dios que eleva al hombre sobre sus capacidades naturales.' },
        { n:'Magisterio ordinario',         p:'/m/magisterio-ordinario/',                            c:'teo', d:'Enseñanza habitual del Papa y obispos que requiere asentimiento religioso del fiel.' },
        { n:'Apofatismo',                   p:'/a/apofatismo/',                                      c:'teo', d:'Conocemos a Dios negando lo que no es: teología negativa de la tradición oriental.' },
        { n:'Analogía del ser',             p:'/a/analogia-del-ser/',                                c:'teo', d:'Podemos hablar de Dios en términos humanos, pero solo de modo analógico, no unívoco.' },
        { n:'Escatología',                  p:'/e/escatologia/',                                     c:'teo', d:'Tratado sobre las realidades últimas: muerte, juicio, cielo, infierno y resurrección.' },
        { n:'Parusía',                      p:'/p/parusia/',                                         c:'teo', d:'Segunda Venida gloriosa de Cristo al fin de los tiempos para juzgar a vivos y muertos.' },
        { n:'Providencia divina',           p:'/p/providencia-divina/',                              c:'teo', d:'Dios conduce todas las criaturas hacia su fin último con sabiduría y amor.' },
        { n:'Apocatástasis',                p:'/a/apocatastasis/',                                   c:'teo', d:'Teoría de Orígenes sobre la restauración final de todos: condenada en Constantinopla (543).' },
        { n:'Tradición apostólica',         p:'/t/tradicion-apostolica/',                            c:'teo', d:'Depósito de fe transmitido por los Apóstoles mediante liturgia y sucesión episcopal.' },
        { n:'Kénosis',                      p:'/k/kenosis/',                                         c:'teo', d:'«Vaciamiento»: el Hijo de Dios asumió la condición humana limitada sin dejar de ser Dios.' },
        { n:'Limbo',                        p:'/l/limbo/',                                           c:'teo', d:'Hipótesis medieval sobre niños sin Bautismo; la Comisión Teológica (2007) abre la esperanza.' },
        { n:'Redención',                    p:'/r/redencion/',                                       c:'teo', d:'Cristo libera al hombre del pecado y la muerte con su Pasión, muerte y Resurrección.' },
        { n:'Soteriología',                 p:'/s/soteriologia/',                                    c:'teo', d:'Tratado teológico sobre la salvación humana obrada por Jesucristo.' },
        { n:'Teología del cuerpo',          p:'/t/teologia-del-cuerpo/',                             c:'teo', d:'Juan Pablo II: el cuerpo humano expresa la vocación al amor y a la comunión de personas.' },
        { n:'Teología de la Liberación',    p:'/t/teologia-de-la-liberacion/',                      c:'teo', d:'Corriente latinoamericana que articula fe y justicia social; discernida por Roma.' },
        { n:'Voluntad, gracia e intelecto', p:'/v/voluntad-gracia-intelecto/',                      c:'teo', d:'La relación entre la libertad humana y la acción de la gracia divina en el alma.' },
        { n:'Eclesiología',                 p:'/e/eclesiologia/',                                    c:'teo', d:'Tratado sobre la naturaleza, misión y estructura de la Iglesia de Cristo.' },
        { n:'Cristología',                  p:'/c/cristologia/',                                     c:'teo', d:'Estudio teológico de la persona, las dos naturalezas y la obra de Jesucristo.' },
        { n:'Primacía petrina',             p:'/p/primacia-petrina/',                                c:'teo', d:'Pedro recibió de Cristo el primado sobre los Apóstoles: base del ministerio papal.' },
        { n:'Magisterio',                   p:'/m/magisterio/',                                      c:'teo', d:'Autoridad docente de la Iglesia ejercida por el Papa y los obispos en comunión con él.' },
        { n:'Magisterio extraordinario',    p:'/m/magisterio-extraordinario/',                       c:'teo', d:'Definiciones solemnes del Papa o el concilio que obligan al asentimiento de fe.' },
        { n:'Mariología',                   p:'/m/mariologia/',                                      c:'teo', d:'Tratado teológico sobre la persona, dignidad y misión de la Virgen María.' },
        { n:'Revelación sobrenatural',      p:'/r/revelacion-sobrenatural/',                         c:'teo', d:'Dios se dio a conocer por encima de la razón natural mediante los profetas y su Hijo.' },
        { n:'Creación del mundo',           p:'/c/creacion-del-mundo/',                              c:'teo', d:'Dios creó el universo de la nada libremente; la fe y la ciencia no se contradicen.' },
        { n:'Apologética',                  p:'/a/apologetica/',                                     c:'teo', d:'Disciplina que defiende la racionalidad de la fe frente a objeciones y escepticismos.' },
        { n:'Libre albedrío y omnisciencia',p:'/e/el-libre-albedrio-y-la-omnisciencia-divina/',     c:'teo', d:'Cómo conciliar la libertad humana con el conocimiento divino de todos los actos futuros.' },
        { n:'Ley y gracia',                 p:'/l/ley-y-gracia/',                                    c:'teo', d:'San Pablo y Agustín: la Ley revela el pecado pero solo la gracia puede vencerlo.' },
        { n:'Kerygma primero',              p:'/p/primer-anuncio-kerygmatico/',                      c:'teo', d:'El primer anuncio de Cristo muerto y resucitado: núcleo irreducible de la evangelización.' },
        { n:'Revelación cerrada con los Apóstoles', p:'/e/errores-sobre-la-revelacion-no-completada-con-los-apostoles/', c:'teo', d:'La Revelación pública se cerró con la muerte del último Apóstol: error negarla.' },
        /* ── HEREJÍAS (30) ── */
        { n:'Arrianismo',                   p:'/a/arrianismo/',                                      c:'her', d:'Arrio negó la divinidad del Hijo; condenado en el Concilio de Nicea (325).' },
        { n:'Pelagianismo',                 p:'/p/pelagianismo/',                                    c:'her', d:'El hombre puede salvarse por esfuerzo propio sin la gracia; condenado en Cartago (418).' },
        { n:'Nestorianismo',                p:'/n/nestorianismo/',                                   c:'her', d:'Nestorio dividía en dos personas la humanidad y la divinidad de Cristo; Éfeso (431).' },
        { n:'Monofisismo',                  p:'/m/monofisismo/',                                     c:'her', d:'Cristo tendría una sola naturaleza —la divina—; condenado en Calcedonia (451).' },
        { n:'Gnosticismo',                  p:'/g/gnosticismo/',                                     c:'her', d:'Salvación por conocimiento secreto; dualismo materia-espíritu contrario a la creación.' },
        { n:'Donatismo',                    p:'/d/donatismo/',                                       c:'her', d:'La validez sacramental dependería de la santidad del ministro: error condenado.' },
        { n:'Iconoclasia',                  p:'/i/iconoclasia/',                                     c:'her', d:'El siglo VIII destruyó imágenes sagradas como idolatría; condenada en Nicea II (787).' },
        { n:'Quietismo',                    p:'/q/quietismo/',                                       c:'her', d:'Aniquilación de la voluntad hasta suprimir todo acto; condenado por Inocencio XI (1687).' },
        { n:'Jansenismo',                   p:'/j/jansenismo/',                                      c:'her', d:'Gracia irresistible y rigorismo extremo; condenado por Clemente XI en 1713.' },
        { n:'Adopcionismo',                 p:'/a/adopcionismo/',                                    c:'her', d:'Jesús habría sido adoptado como Hijo en el Bautismo; negaba su preexistencia divina.' },
        { n:'Catarismo',                    p:'/c/catarismo/',                                       c:'her', d:'Dualismo medieval: el mundo material es obra del mal; rechazaba sacramentos y matrimonio.' },
        { n:'Maniqueísmo',                  p:'/m/maniqueismo/',                                     c:'her', d:'Bien y Mal eternamente iguales: religión dualista de Mani (siglo III d.C.).' },
        { n:'Priscilianismo',               p:'/p/priscilianismo/',                                  c:'her', d:'Hereje hispano del s. IV, gnóstico y maniqueo; primer ejecutado por el Estado en 385.' },
        { n:'Conciliarismo',                p:'/c/conciliarismo/',                                   c:'her', d:'El concilio sería superior al Papa: doctrina condenada en el Letrán V (1516).' },
        { n:'Montanismo',                   p:'/m/montanismo/',                                      c:'her', d:'Profetismo carismático del s. II que ponía la revelación privada sobre la jerarquía.' },
        { n:'Apolinarismo',                 p:'/a/apolinarismo/',                                    c:'her', d:'Cristo no tendría alma humana completa; condenado en Constantinopla I (381).' },
        { n:'Marcionismo',                  p:'/m/marcionismo/',                                     c:'her', d:'Marción rechazó el Antiguo Testamento y al Dios creador: gnosticismo radical del s. II.' },
        { n:'Herejía',                      p:'/h/herejia/',                                         c:'her', d:'Negación pertinaz de una verdad de fe por quien ha recibido el Bautismo.' },
        { n:'Valdenses',                    p:'/v/valdenses/',                                       c:'her', d:'Pedro Valdo (s. XII): pobreza evangélica que derivó en movimiento cismático.' },
        { n:'Albigenses',                   p:'/a/albigenses/',                                      c:'her', d:'Cátaros del sur de Francia; combatidos por la Cruzada Albigense (1209-1229).' },
        { n:'Calvinismo',                   p:'/c/calvinismo/',                                      c:'her', d:'Reforma de Calvino: doble predestinación, gracia irresistible, rechazo de sacramentos.' },
        { n:'Luteranismo',                  p:'/l/luteranismo/',                                     c:'her', d:'Reforma de Lutero: sola fide, sola Scriptura, rechazo del papado y la tradición.' },
        { n:'Modernismo teológico',         p:'/m/modernismo/',                                      c:'her', d:'Tendencia del s. XIX-XX que relativizaba el dogma; condenada por Pío X en 1907.' },
        { n:'Nueva Era',                    p:'/n/nueva-era-gnosticismo/',                           c:'her', d:'Movimiento sincrético contemporáneo con raíces gnósticas; incompatible con el cristianismo.' },
        { n:'Errores sobre la Reforma',     p:'/e/errores-de-la-transformacion-del-catolicismo-en-protestantismo/', c:'her', d:'Errores doctrinales que fundamentan la ruptura protestante con la Iglesia.' },
        { n:'Errores modernistas',          p:'/e/errores-modernistas-sobre-la-doctrina-cristiana/', c:'her', d:'El Syllabus (1864) y Pascendi (1907) sistematizaron los errores del modernismo.' },
        { n:'Pobres de Lyon',               p:'/p/pobres-de-lyon-valdenses/',                        c:'her', d:'Primer nombre de los valdenses; grupo de pobreza evangélica excomulgado en 1184.' },
        { n:'Protestantismo',               p:'/p/protestantismo/',                                  c:'her', d:'Conjunto de confesiones surgidas de la Reforma del s. XVI, separadas del catolicismo.' },
        { n:'Agnosticismo como filosofía',  p:'/e/errores-sobre-el-agnosticismo-como-base-de-la-filosofia/', c:'her', d:'Error de hacer del agnosticismo el fundamento filosófico, negando la teología natural.' },
        { n:'Estoicismo y fe cristiana',    p:'/e/estoicismo/',                                      c:'her', d:'La mezcla de estoicismo con cristianismo generó errores: el Logos no es impersonal.' },
        /* ── SACRAMENTOS (31) ── */
        { n:'Sacramento',                   p:'/s/sacramento/',                                      c:'sac', d:'Signo eficaz instituido por Cristo que causa la gracia que significa.' },
        { n:'Bautismo',                     p:'/b/bautismo/',                                        c:'sac', d:'Primer sacramento: borra el pecado original e incorpora a la Iglesia.' },
        { n:'Confirmación',                 p:'/c/confirmacion/',                                    c:'sac', d:'Sella con el Espíritu Santo y perfecciona la gracia bautismal del cristiano.' },
        { n:'Eucaristía',                   p:'/e/eucaristia/',                                      c:'sac', d:'Centro de la vida cristiana: Cristo realmente presente bajo las especies de pan y vino.' },
        { n:'Penitencia',                   p:'/p/penitencia/',                                      c:'sac', d:'Perdona los pecados cometidos tras el Bautismo mediante la absolución del sacerdote.' },
        { n:'Unción de enfermos',           p:'/u/uncion-de-los-enfermos/',                          c:'sac', d:'Gracia especial para el enfermo grave, unido así a la Pasión de Cristo.' },
        { n:'Sacramento del Orden',         p:'/o/orden-sacerdotal/',                                c:'sac', d:'Configura con Cristo Sacerdote en tres grados: episcopado, presbiterado y diaconado.' },
        { n:'Matrimonio',                   p:'/m/matrimonio-canonico/',                             c:'sac', d:'Pacto esponsal elevado por Cristo a sacramento; signo de la unión Cristo-Iglesia.' },
        { n:'Sacramentos de iniciación',    p:'/s/sacramentos-de-iniciacion/',                       c:'sac', d:'Bautismo, Confirmación y Eucaristía incorporan plenamente a la Iglesia.' },
        { n:'Sacramentos de curación',      p:'/s/sacramentos-de-curacion/',                         c:'sac', d:'Penitencia y Unción curan el alma herida por el pecado o la enfermedad.' },
        { n:'Sacramentos del servicio',     p:'/s/sacramentos-del-servicio/',                        c:'sac', d:'Orden y Matrimonio están ordenados al servicio de la comunidad eclesial.' },
        { n:'Comunión',                     p:'/c/comunion/',                                        c:'sac', d:'Recepción del Cuerpo y la Sangre de Cristo en la Eucaristía: cumbre de la Misa.' },
        { n:'Confesión',                    p:'/c/confesion/',                                       c:'sac', d:'Acusación de los pecados ante el sacerdote: acto esencial de la Penitencia.' },
        { n:'Absolución',                   p:'/a/absolucion/',                                      c:'sac', d:'El sacerdote, in persona Christi, perdona los pecados en nombre de la Trinidad.' },
        { n:'Bautismo de niños',            p:'/b/bautismo-de-ninos/',                               c:'sac', d:'La Iglesia bautiza a los infantes en la fe de la Iglesia: práctica antiquísima.' },
        { n:'Bautismo de adultos',          p:'/b/bautismo-de-adultos/',                             c:'sac', d:'El adulto es bautizado tras el catecumenado; recibe también Confirmación y Eucaristía.' },
        { n:'Comunión bajo las dos especies',p:'/c/comunion-bajo-las-dos-especies/',                 c:'sac', d:'Cristo está entero en cada especie; la doble forma es más signo de la totalidad del misterio.' },
        { n:'Comunión espiritual',          p:'/c/comunion-espiritual/',                             c:'sac', d:'Deseo de recibir a Cristo sin la comunión sacramental: práctica recomendada por los santos.' },
        { n:'Eucaristía como sacrificio',   p:'/e/eucaristia-como-sacrificio/',                      c:'sac', d:'La Misa hace presente el único sacrificio de Cristo: no repetición sino reactualización.' },
        { n:'Consagración eucarística',     p:'/c/consagracion-de-la-eucaristia/',                   c:'sac', d:'Momento en que el pan y el vino se convierten en Cuerpo y Sangre de Cristo.' },
        { n:'Consagración episcopal',       p:'/c/consagracion-episcopal/',                          c:'sac', d:'Confiere la plenitud del sacramento del Orden; hace al obispo sucesor de los Apóstoles.' },
        { n:'Imposición de manos en el Orden', p:'/i/imposicion-del-sacramento-del-orden/',          c:'sac', d:'Gesto esencial por el que se transmite el sacramento del Orden desde los Apóstoles.' },
        { n:'Excomunión',                   p:'/e/excomunion/',                                      c:'sac', d:'Pena eclesiástica máxima que priva de los sacramentos y del gobierno de la Iglesia.' },
        { n:'Comunión en la mano',          p:'/c/comunion-en-la-mano/',                             c:'sac', d:'Modo de recibir la Eucaristía admitido por la Iglesia desde los años 70, con condiciones.' },
        { n:'Confirmación como dogma',      p:'/d/dogma-de-la-confirmacion-como-verdadero-sacramento/', c:'sac', d:'Trento definió que la Confirmación es un verdadero sacramento y no solo un rito.' },
        { n:'Comunión de los Santos',       p:'/c/comunion-de-los-santos/',                          c:'sac', d:'Los fieles unidos a Cristo comparten bienes espirituales: vida, gracia y sufragios.' },
        { n:'Excomunión latae sententiae',  p:'/e/excomunion-latae-sententiae/',                      c:'sac', d:'Excomunión automática: se incurre en ella por el acto mismo, sin declaración previa.' },
        { n:'Consagración virginal',        p:'/c/consagracion-virginal/',                           c:'sac', d:'Voto de virginidad perpetua reconocido por la Iglesia como estado de vida consagrada.' },
        { n:'Sacralidad del Orden',         p:'/d/dogma-de-la-sacralidad-del-orden-sacerdotal/',     c:'sac', d:'El Orden es un verdadero sacramento que imprime carácter indeleble en el ordenado.' },
        { n:'Bautismo de Jesús',            p:'/b/bautismo-de-jesus/',                               c:'sac', d:'Cristo fue bautizado en el Jordán: no por necesidad sino para santificar las aguas.' },
        { n:'Doctrina sacramental',         p:'/d/doctrina-sobre-los-sacramentos/',                  c:'sac', d:'La enseñanza de la Iglesia sobre los siete sacramentos, su validez y frutos de gracia.' },
        /* ── CONCILIOS (31) ── */
        { n:'Concilio de Jerusalén',        p:'/c/concilio-de-jerusalen/',                           c:'con', d:'Primera asamblea apostólica (c. 49 d.C.): los gentiles no necesitan circuncisión.' },
        { n:'Concilio de Nicea I',          p:'/c/concilio-de-nicea-i/',                             c:'con', d:'Primer concilio ecuménico (325): definió la consustancialidad del Hijo con el Padre.' },
        { n:'Concilio de Constantinopla I', p:'/c/concilio-de-constantinopla-i/',                   c:'con', d:'Segundo concilio (381): añadió la divinidad del Espíritu Santo al Credo.' },
        { n:'Concilio de Éfeso',            p:'/c/concilio-de-efeso/',                               c:'con', d:'Tercer concilio (431): proclamó a María Theotokos frente al nestorianismo.' },
        { n:'Concilio de Calcedonia',       p:'/c/concilio-de-calcedonia/',                          c:'con', d:'Cuarto concilio (451): dos naturalezas en Cristo, sin confusión ni separación.' },
        { n:'Concilio de Constantinopla II',p:'/c/concilio-de-constantinopla-ii/',                  c:'con', d:'Quinto concilio (553): condenó las Tres Controversias y el origenismo.' },
        { n:'Concilio de Constantinopla III',p:'/c/concilio-de-constantinopla-iii/',                c:'con', d:'Sexto concilio (681): dos voluntades en Cristo frente al monotelismo.' },
        { n:'Concilio de Nicea II',         p:'/c/concilio-de-nicea-ii/',                            c:'con', d:'Séptimo concilio (787): restableció la veneración legítima de imágenes sagradas.' },
        { n:'Concilio de Constantinopla IV',p:'/c/concilio-de-constantinopla-iv/',                  c:'con', d:'Octavo concilio (869): depuso a Focio y consolidó la primacía romana.' },
        { n:'Concilio de Orange II',        p:'/c/concilio-de-orange-ii/',                           c:'con', d:'Orange (529): clave contra el semipelagianismo; la gracia precede a todo acto humano.' },
        { n:'Concilio de Letrán I',         p:'/c/concilio-de-letran-i/',                            c:'con', d:'Primer Letrán (1123): ratificó el Concordato de Worms sobre las investiduras.' },
        { n:'Concilio de Letrán II',        p:'/c/concilio-de-letran-ii/',                           c:'con', d:'Segundo Letrán (1139): condenó el cisma de Anacleto II y el arnoldismo.' },
        { n:'Concilio de Letrán III',       p:'/c/concilio-de-letran-iii/',                          c:'con', d:'Tercer Letrán (1179): fijó la elección papal por mayoría de dos tercios.' },
        { n:'Concilio de Letrán IV',        p:'/c/concilio-de-letran-iv/',                           c:'con', d:'Cuarto Letrán (1215): definió transustanciación y confesión anual obligatoria.' },
        { n:'Concilio de Lyon I',           p:'/c/concilio-de-lyon-i/',                              c:'con', d:'Lyon I (1245): depuso al emperador Federico II y convocó nueva cruzada.' },
        { n:'Concilio de Lyon II',          p:'/c/concilio-de-lyon-ii/',                             c:'con', d:'Lyon II (1274): intentó unión con Oriente; adoptó el Filioque en el Credo.' },
        { n:'Concilio de Vienne',           p:'/c/concilio-de-vienne/',                              c:'con', d:'Vienne (1311-1312): suprimió la Orden del Temple y trató la reforma eclesiástica.' },
        { n:'Concilio de Constanza',        p:'/c/concilio-de-constanza/',                           c:'con', d:'Constanza (1414-1418): puso fin al Gran Cisma de Occidente eligiendo a Martín V.' },
        { n:'Concilio de Florencia',        p:'/c/concilio-de-basilea-ferrara-florencia/',           c:'con', d:'Florencia (1431-1449): intentó unión con Oriente; definió el dogma del purgatorio.' },
        { n:'Concilio de Letrán V',         p:'/c/concilio-de-letran-v/',                            c:'con', d:'Letrán V (1512-1517): condenó el conciliarismo justo antes de la Reforma protestante.' },
        { n:'Concilio de Trento',           p:'/c/concilio-de-trento/',                              c:'con', d:'Trento (1545-1563): definió la respuesta doctrinal católica a la Reforma protestante.' },
        { n:'Concilio Vaticano I',          p:'/c/concilio-vaticano-i/',                             c:'con', d:'Vaticano I (1869-1870): definió la infalibilidad y el primado pontificio universal.' },
        { n:'Concilio Vaticano II',         p:'/c/concilio-vaticano-ii/',                            c:'con', d:'Vaticano II (1962-1965): renovó liturgia, eclesiología y diálogo con el mundo moderno.' },
        { n:'Concilio de Toledo III',       p:'/c/concilio-de-toledo-iii/',                          c:'con', d:'Toledo (589): conversión de los visigodos e inserción del Filioque en Occidente.' },
        { n:'Concilio Quinisexto',          p:'/c/conclave-de-trullo-quinisexto/',                   c:'con', d:'Trullo (692): disciplina solo reconocida por Oriente; diverge de la práctica latina.' },
        { n:'Sínodo',                       p:'/s/sinodo/',                                          c:'con', d:'Asamblea de obispos para tratar asuntos de fe, disciplina o pastoral de la Iglesia.' },
        { n:'Concilio de Clermont',         p:'/c/concilio-de-clermont/',                            c:'con', d:'Clermont (1095): Urbano II proclamó la Primera Cruzada para liberar Tierra Santa.' },
        { n:'Concilio de Orange I',         p:'/c/concilio-de-orange-i/',                            c:'con', d:'Orange I (441): reguló la penitencia pública y las relaciones clero-laicos en la Galia.' },
        { n:'Sínodo de los Obispos',        p:'/s/sinodo-de-los-obispos/',                           c:'con', d:'Institución colegial post-Vaticano II que asesora al Papa en el gobierno de la Iglesia.' },
        { n:'Concilio de Pisa I',           p:'/c/concilio-de-pisa-i/',                              c:'con', d:'Pisa (1409): convocado para resolver el cisma de Aviñón, creó un tercer papa rival.' },
        { n:'Concilio de Bari',             p:'/c/concilio-de-bari/',                                c:'con', d:'Bari (1098): Anselmo de Canterbury defendió el Filioque ante los obispos griegos.' },
        /* ── DEVOCIÓN (30) ── */
        { n:'Rosario',                      p:'/r/rosario/',                                         c:'dev', d:'Veinte misterios de la vida de Cristo meditados con María; propagado por santo Domingo.' },
        { n:'Sagrado Corazón',              p:'/s/sagrado-corazon-de-jesus/',                        c:'dev', d:'Culto al Corazón de Jesús como símbolo de su amor infinito a la humanidad.' },
        { n:'Lectio Divina',                p:'/l/lectio-divina/',                                   c:'dev', d:'Lectura orante de las Escrituras: lectio, meditatio, oratio, contemplatio.' },
        { n:'Novena',                       p:'/n/novena/',                                          c:'dev', d:'Nueve días de oración continua, normalmente previos a una fiesta litúrgica.' },
        { n:'Vía Crucis',                   p:'/e/estaciones-de-la-cruz/',                           c:'dev', d:'Recorrido de las catorce estaciones de la Pasión de Cristo: devoción de los viernes.' },
        { n:'Veneración de imágenes',       p:'/v/veneracion-de-imagenes/',                          c:'dev', d:'La Iglesia distingue latría (a Dios) y dulía (a santos e imágenes): no es idolatría.' },
        { n:'Veneración de reliquias',      p:'/v/veneracion-de-reliquias/',                         c:'dev', d:'Los restos de los santos son venerados como templos del Espíritu Santo.' },
        { n:'Veneración mariana',           p:'/v/veneracion-mariana/',                              c:'dev', d:'Hiperdulía: María recibe la veneración más alta entre los santos por ser Madre de Dios.' },
        { n:'Medalla Milagrosa',            p:'/m/medalla-milagrosa/',                               c:'dev', d:'Aparecida a Catalina Labouré (1830): «O María, concebida sin pecado».' },
        { n:'Misterios del Rosario',        p:'/m/misterios-del-rosario/',                           c:'dev', d:'Gozosos, Luminosos, Dolorosos y Gloriosos: veinte contemplaciones de la vida de Cristo.' },
        { n:'Avemaría',                     p:'/a/avemaria/',                                        c:'dev', d:'Oración a María basada en el saludo del ángel Gabriel y de Isabel (Lc 1,28-42).' },
        { n:'Padrenuestro',                 p:'/p/pater-noster/',                                    c:'dev', d:'Oración enseñada por Jesús mismo: modelo y fuente de toda oración cristiana.' },
        { n:'Letanías',                     p:'/l/letanias/',                                        c:'dev', d:'Oraciones de invocación repetitiva: lauretanas, de los santos, del Sagrado Corazón.' },
        { n:'Magníficat',                   p:'/m/magnificat/',                                      c:'dev', d:'Cántico de la Virgen (Lc 1,46-55): himno de alabanza y teología mariana por excelencia.' },
        { n:'Benedictus',                   p:'/b/benedictus/',                                      c:'dev', d:'Cántico de Zacarías (Lc 1,68-79): profecía mesiánica que abre la Liturgia de Laudes.' },
        { n:'Dulía',                        p:'/d/dulia-veneracion/',                                c:'dev', d:'Culto de veneración debido a los ángeles y santos: distinto de la adoración a Dios.' },
        { n:'Salve Regina',                 p:'/h/himno-salve-regina/',                              c:'dev', d:'Antífona mariana del s. XI: himno final de Completas y de la Liturgia de las Horas.' },
        { n:'Adoración eucarística',        p:'/a/adoracion-eucaristica/',                           c:'dev', d:'Oración ante el Santísimo Expuesto: acto de latría que reconoce a Cristo presente.' },
        { n:'Consagración al Sagrado Corazón', p:'/c/consagracion-al-sagrado-corazon-de-jesus/',    c:'dev', d:'Acto de entrega personal o familiar al amor del Corazón de Jesús.' },
        { n:'Novena Cruzada',               p:'/n/novena-cruzada/',                                  c:'dev', d:'Forma de novena que se reza en grupo extendiéndose en cadena misionera.' },
        { n:'Cántico del Magníficat',       p:'/c/cantico-del-magnificat/',                          c:'dev', d:'El cántico de María en casa de Isabel: fundamento de la espiritualidad mariana.' },
        { n:'Devoción al Sagrado Corazón',  p:'/d/devocion-al-sagrado-corazon-de-jesus/',            c:'dev', d:'Práctica devocional aprobada universalmente por Clemente XIII en 1765.' },
        { n:'Virgen del Rosario',           p:'/v/virgen-del-rosario/',                              c:'dev', d:'Advocación mariana ligada al rezo del Rosario; fiesta el 7 de octubre.' },
        { n:'Nuestra Señora de la Medalla Milagrosa', p:'/n/nuestra-senora-de-la-medalla-milagrosa/', c:'dev', d:'Aparición de París (1830): María pidió acuñar la medalla que lleva su nombre.' },
        { n:'Solemnidad del Sagrado Corazón', p:'/s/solemnidad-del-sagrado-corazon-de-jesus/',      c:'dev', d:'Fiesta 19 días después de Pentecostés: culto universal al Corazón de Jesús.' },
        { n:'Corona del Rosario',           p:'/c/corona-del-rosario/',                              c:'dev', d:'Las cuentas del rosario: instrumento de meditación y oración vocal a la vez.' },
        { n:'Apostolado de la Oración',     p:'/a/apostolado-de-la-oracion/',                        c:'dev', d:'Movimiento jesuita: ofrecer cada día al Corazón de Jesús las intenciones del Papa.' },
        { n:'Plegarias eucarísticas',       p:'/p/plegarias-eucaristicas/',                          c:'dev', d:'Las cuatro plegarias del Misal Romano: corazón de la celebración eucarística.' },
        { n:'Oración por los difuntos',     p:'/r/rezar-a-dios-por-los-vivos-y-por-los-muertos/',   c:'dev', d:'La Iglesia intercede por los difuntos en el purgatorio: acto de caridad sobrenatural.' },
        { n:'Consagración a la Virgen María', p:'/c/consagracion-a-la-virgen-maria/',               c:'dev', d:'Total entrega a María como camino hacia Cristo; popularizado por san Luis M. Grignion.' },
        /* ── MORAL (31) ── */
        { n:'Virtudes teologales',          p:'/v/virtudes-teologales/',                             c:'mor', d:'Fe, Esperanza y Caridad: infundidas por Dios, orientan hacia Él como fin último.' },
        { n:'Virtudes cardinales',          p:'/v/virtudes-cardinales/',                             c:'mor', d:'Prudencia, Justicia, Fortaleza y Templanza: eje de la ética natural cristiana.' },
        { n:'Ley natural',                  p:'/l/ley-divina-ley-natural-y-ley-positiva/',           c:'mor', d:'La razón humana discierne el bien del mal: fundamento de la ética universal.' },
        { n:'Libertad religiosa',           p:'/l/libertad-religiosa/',                              c:'mor', d:'Derecho a buscar la verdad sin coacción; reconocido en Dignitatis Humanae (1965).' },
        { n:'Doctrina social de la Iglesia', p:'/d/doctrina-social-de-la-iglesia/',                 c:'mor', d:'Dignidad, bien común, subsidiariedad y solidaridad: pilares desde la Rerum Novarum.' },
        { n:'Pecado mortal',                p:'/p/pecado-mortal/',                                   c:'mor', d:'Rompe la comunión con Dios: materia grave, plena advertencia y deliberado consentimiento.' },
        { n:'Pecado venial',                p:'/p/pecado-venial/',                                   c:'mor', d:'Debilita la caridad sin romperla; exige reparación pero no pierde la gracia santificante.' },
        { n:'Siete pecados capitales',      p:'/s/siete-pecados-capitales/',                         c:'mor', d:'Soberbia, avaricia, lujuria, ira, gula, envidia y pereza: raíces del desorden moral.' },
        { n:'Usura',                        p:'/u/usura-pecado/',                                    c:'mor', d:'Cobrar intereses abusivos por préstamo: condenada gravemente por la moral católica.' },
        { n:'Teología moral',               p:'/t/teologia-moral/',                                  c:'mor', d:'Disciplina que estudia el actuar humano a la luz de la Revelación y la razón natural.' },
        { n:'Libertad de conciencia',       p:'/l/libertad-de-conciencia/',                          c:'mor', d:'Toda persona está obligada a seguir su conciencia recta, siempre que la forme bien.' },
        { n:'Conciencia',                   p:'/c/conciencia/',                                      c:'mor', d:'Juicio práctico de la razón sobre la moralidad de un acto concreto.' },
        { n:'Bien común',                   p:'/b/bien-comun/',                                      c:'mor', d:'Conjunto de condiciones que permiten a personas y grupos alcanzar su perfección.' },
        { n:'Justicia',                     p:'/j/justicia/',                                        c:'mor', d:'Virtud que da a cada uno lo suyo: cardinal y fundamento del orden social.' },
        { n:'Justicia social',              p:'/j/justicia-social/',                                 c:'mor', d:'Exige que las estructuras de la sociedad garanticen el bien común de todos.' },
        { n:'Aborto',                       p:'/a/aborto/',                                          c:'mor', d:'La Iglesia condena el aborto como grave violación del derecho a la vida del no nacido.' },
        { n:'Eutanasia',                    p:'/e/eutanasia/',                                       c:'mor', d:'Provocar la muerte del enfermo es siempre moralmente ilícito, incluso por compasión.' },
        { n:'Moral sexual',                 p:'/m/moral-sexual/',                                    c:'mor', d:'La sexualidad humana, integrada en el amor conyugal, es buena y sagrada.' },
        { n:'Moral social',                 p:'/m/moral-social/',                                    c:'mor', d:'Principios éticos que rigen la vida en sociedad: solidaridad, subsidiariedad y bien común.' },
        { n:'Moral familiar',               p:'/m/moral-familiar/',                                  c:'mor', d:'La familia, célula de la sociedad, tiene derechos inalienables que el Estado debe respetar.' },
        { n:'Conciencia bien formada',      p:'/c/conciencia-bien-formada/',                         c:'mor', d:'La conciencia recta exige formación: el error vincible no excusa la mala acción.' },
        { n:'Mal moral',                    p:'/m/mal-moral/',                                       c:'mor', d:'El mal moral es la transgresión libre de la ley de Dios; distinto del mal físico.' },
        { n:'Libertad cristiana',           p:'/l/la-verdadera-libertad-cristiana/',                 c:'mor', d:'La verdadera libertad no es libertinaje sino la capacidad de elegir el bien.' },
        { n:'Pecado contra el Espíritu Santo', p:'/p/pecado-contra-el-espiritu-santo/',             c:'mor', d:'La impenitencia final y el rechazo deliberado de la misericordia: el único sin remisión.' },
        { n:'Omisión y pecado',             p:'/o/omision-y-pecado/',                                c:'mor', d:'No hacer el bien que se debe es también pecado: la omisión puede ser grave.' },
        { n:'Homicidio de inocente',        p:'/d/dogma-de-la-grave-inmoralidad-del-homicidio-de-un-inocente/', c:'mor', d:'Matar a un inocente es intrínsecamente malo: ningún fin justifica este medio.' },
        { n:'Justicia distributiva',        p:'/j/justicia-distributiva/',                           c:'mor', d:'Obliga a la comunidad a repartir cargas y beneficios de modo proporcionado.' },
        { n:'Ningún acto moralmente neutro', p:'/n/ningun-acto-individual-es-moralmente-indiferente/', c:'mor', d:'Todo acto humano concreto es moralmente bueno o malo; no existe el neutro.' },
        { n:'Economía moral',               p:'/e/economia-moral/',                                  c:'mor', d:'La actividad económica está sujeta a la ley moral; el mercado no se autorregula éticamente.' },
        { n:'Compendio de DSI',             p:'/c/compendio-de-la-doctrina-social-de-la-iglesia/',  c:'mor', d:'Texto de 2004 que sistematiza la doctrina social: referencia para políticos y empresarios.' },
        { n:'Moralidad de la experimentación genética', p:'/m/moralidad-de-la-experimentacion-genetica/', c:'mor', d:'La manipulación genética es lícita solo si respeta la dignidad y no instrumentaliza al hombre.' },
        /* ── HISTORIA (30) ── */
        { n:'Cisma de Oriente',             p:'/c/cisma-de-oriente/',                                c:'his', d:'Ruptura de 1054 entre Roma y Constantinopla: origen de la Iglesia Ortodoxa.' },
        { n:'Cisma protestante',            p:'/c/cisma-protestante/',                               c:'his', d:'Fractura del s. XVI iniciada por Lutero: dividió definitivamente el Occidente cristiano.' },
        { n:'Gran Cisma de Occidente',      p:'/c/cisma-de-occidente/',                              c:'his', d:'Crisis 1378-1417: tres papas rivales; resuelto en Constanza eligiendo a Martín V.' },
        { n:'Reforma Protestante',          p:'/r/reforma-protestante/',                             c:'his', d:'Lutero (1517) y Calvino dividieron el Occidente cristiano por doctrina y abusos.' },
        { n:'Reforma Gregoriana',           p:'/r/reforma-gregoriana/',                              c:'his', d:'Gregorio VII depuró la Iglesia en el s. XI: simonía, nicolaísmo e investiduras.' },
        { n:'Patrística',                   p:'/p/patristica/',                                      c:'his', d:'Estudio de los escritos de los Padres de la Iglesia (ss. I-VIII).' },
        { n:'Inquisición',                  p:'/i/inquisicion/',                                     c:'his', d:'Tribunal eclesiástico medieval para juzgar la herejía; reformado en el s. XVI.' },
        { n:'Primera Cruzada',              p:'/p/primera-cruzada/',                                 c:'his', d:'Convocada por Urbano II (1095): recuperó Jerusalén para la cristiandad en 1099.' },
        { n:'Simonía',                      p:'/s/simonia/',                                         c:'his', d:'Compraventa de bienes espirituales; gran abuso medieval combatido en el s. XI.' },
        { n:'Martirio',                     p:'/m/martirio/',                                        c:'his', d:'Muerte aceptada libremente por la fe: acto supremo de caridad y semilla de la Iglesia.' },
        { n:'Diezmo',                       p:'/d/diezmo/',                                          c:'his', d:'La décima parte de los bienes para el culto y los pobres; suprimido en el s. XIX.' },
        { n:'Contrarreforma',               p:'/c/contrarreforma/',                                  c:'his', d:'Renovación interna de la Iglesia tras Trento: jesuitas, nuevas órdenes y espiritualidad.' },
        { n:'Cruzada Albigense',            p:'/c/cruzada-albigense/',                               c:'his', d:'Cruzada (1209-1229) contra los cátaros del sur de Francia convocada por Inocencio III.' },
        { n:'Las Cruzadas',                 p:'/c/cruzadas/',                                        c:'his', d:'Expediciones militares (1096-1291) para recuperar los Santos Lugares del Islam.' },
        { n:'Historia del Papado',          p:'/h/historia-del-papado/',                             c:'his', d:'El ministerio petrino a lo largo de los siglos: continuidad y reforma.' },
        { n:'Iglesia primitiva',            p:'/i/iglesia-primitiva/',                               c:'his', d:'Los tres primeros siglos: persecuciones, apologistas, concilios y formación del canon.' },
        { n:'Inquisición española',         p:'/i/inquisicion-espanola/',                            c:'his', d:'Tribunal regio (1478-1834) bajo la corona española; distinta de la inquisición medieval.' },
        { n:'Reforma cluniacense',          p:'/r/reforma-cluniacense/',                             c:'his', d:'Movimiento monástico del s. X desde Cluny que renovó la vida benedictina en Europa.' },
        { n:'Reforma benedictina',          p:'/r/reforma-benedictina/',                             c:'his', d:'Sucesivas reformas de la Regla de Benito: Cluny, Cîteaux, Camaldoli y otras ramas.' },
        { n:'Leyenda negra de la Inquisición', p:'/l/leyenda-negra-de-la-inquisicion/',              c:'his', d:'Conjunto de mitos anti-inquisitoriales creados por la propaganda protestante y liberal.' },
        { n:'Papado',                       p:'/p/papado/',                                          c:'his', d:'Institución del sucesor de Pedro como cabeza visible de la Iglesia católica.' },
        { n:'Cisma',                        p:'/c/cisma/',                                           c:'his', d:'Ruptura de la unidad eclesial sin necesaria herejía doctrinal: pecado grave.' },
        { n:'Segunda Cruzada',              p:'/s/segunda-cruzada/',                                 c:'his', d:'Cruzada (1147-1149) predicada por san Bernardo; fracasó en Damasco.' },
        { n:'Tercera Cruzada',              p:'/t/tercera-cruzada/',                                 c:'his', d:'Cruzada (1189-1192) de Ricardo I y Felipe II; recuperó parte de la costa palestina.' },
        { n:'Cuarta Cruzada',               p:'/c/cuarta-cruzada/',                                  c:'his', d:'Cruzada (1202-1204) que terminó saqueando Constantinopla: herida del cisma de Oriente.' },
        { n:'Cisma de Focio',               p:'/c/cisma-de-focio/',                                  c:'his', d:'Crisis (863-867) entre Roma y Constantinopla por el patriarca Focio: anticipo del 1054.' },
        { n:'Cisma meleciano',              p:'/c/cisma-meleciano/',                                 c:'his', d:'Primer gran cisma (305): obispos africanos que negaban el perdón a los lapsi.' },
        { n:'Tribunal del Santo Oficio',    p:'/t/tribunal-del-santo-oficio-de-la-inquisicion/',    c:'his', d:'Nombre oficial de la Inquisición romana; hoy Dicasterio para la Doctrina de la Fe.' },
        { n:'Inquisición medieval',         p:'/i/inquisicion-medieval/',                            c:'his', d:'Establecida por Gregorio IX (1231): juzgaba la herejía con proceso canónico formal.' },
        { n:'Reforma del Calendario',       p:'/l/la-reforma-gregoriana-del-calendario/',            c:'his', d:'Inter gravissimas (1582): Gregorio XIII corrigió el calendario juliano con diez días.' },
        /* ── LITURGIA (31) ── */
        { n:'Año litúrgico',                p:'/a/ano-liturgico/',                                   c:'lit', d:'Ciclo anual que recorre el misterio de Cristo de Adviento a Tiempo Ordinario.' },
        { n:'Iconografía cristiana',        p:'/i/iconografia-cristiana/',                           c:'lit', d:'El icono no es decoración: es teología en imagen, ventana a lo divino.' },
        { n:'Rito ambrosiano',              p:'/r/rito-ambrosiano/',                                 c:'lit', d:'Liturgia propia de Milán atribuida a san Ambrosio; viva y en uso hasta hoy.' },
        { n:'Rito Mozárabe',                p:'/r/rito-mozarabe/',                                   c:'lit', d:'Antigua liturgia hispana anterior a la romanización; aún celebrada en Toledo.' },
        { n:'Liturgia de las Horas',        p:'/l/liturgia-de-las-horas/',                           c:'lit', d:'Oración oficial de la Iglesia que santifica las distintas horas del día.' },
        { n:'Liturgia eucarística',         p:'/l/liturgia-eucaristica/',                            c:'lit', d:'Segunda parte de la Misa: ofertorio, consagración y comunión.' },
        { n:'Liturgia de la Palabra',       p:'/l/liturgia-de-la-palabra/',                          c:'lit', d:'Primera parte de la Misa: lecturas, salmo responsorial, Evangelio y homilía.' },
        { n:'Liturgia',                     p:'/l/liturgia/',                                        c:'lit', d:'Culto público oficial de la Iglesia: acción de Cristo y del Pueblo de Dios.' },
        { n:'Misa',                         p:'/m/misa/',                                            c:'lit', d:'La Eucaristía celebrada: sacrificio, banquete y memorial de la muerte y resurrección de Cristo.' },
        { n:'Misal Romano',                 p:'/m/misal-romano/',                                    c:'lit', d:'Libro litúrgico oficial que contiene los ritos, textos y oraciones de la Santa Misa.' },
        { n:'Canto gregoriano',             p:'/c/canto-gregoriano/',                                c:'lit', d:'Canto oficial de la Iglesia romana: monofónico, modal y en latín; patrimonio universal.' },
        { n:'Laudes',                       p:'/l/laudes-liturgia-de-las-horas/',                    c:'lit', d:'Oración de la mañana: primera hora canónica que consagra el inicio del día.' },
        { n:'Nona',                         p:'/n/nona-liturgia-de-las-horas/',                      c:'lit', d:'Hora canónica de mediodía: a las 15h conmemora la muerte de Cristo en la cruz.' },
        { n:'Forma Extraordinaria',         p:'/f/forma-extraordinaria-del-rito-romano/',            c:'lit', d:'Misa tridentina: forma anterior al Vaticano II, permitida por Benedicto XVI en 2007.' },
        { n:'Forma Ordinaria',              p:'/f/forma-ordinaria-del-rito-romano/',                 c:'lit', d:'Misa del Vaticano II: forma ordinaria del rito romano en uso desde 1970.' },
        { n:'Liturgias orientales',         p:'/l/liturgias-orientales/',                            c:'lit', d:'Ritos de las Iglesias Orientales católicas: diversidad litúrgica en unión con Roma.' },
        { n:'Rito armenio',                 p:'/r/rito-armenio/',                                    c:'lit', d:'Liturgia de la Iglesia armenia; una de las más antiguas del cristianismo oriental.' },
        { n:'Rito bizantino',               p:'/r/rito-bizantino/',                                  c:'lit', d:'Rito de Constantinopla: usado por la mayoría de las Iglesias orientales católicas y ortodoxas.' },
        { n:'Rito copto',                   p:'/r/rito-copto/',                                      c:'lit', d:'Liturgia de la Iglesia de Alejandría; lengua copta y tradición de san Marcos.' },
        { n:'Divina Liturgia',              p:'/d/divina-liturgia/',                                 c:'lit', d:'Nombre de la Eucaristía en los ritos orientales: enfatiza su carácter celestial.' },
        { n:'Misa Tridentina',              p:'/m/misa-tridentina/',                                 c:'lit', d:'Forma del rito romano fijada tras Trento (1570) y en uso hasta la reforma del 62.' },
        { n:'Liturgia de Semana Santa',     p:'/l/liturgia-de-la-semana-santa/',                     c:'lit', d:'Los ritos del Triduo Pascual: Jueves Santo, Viernes Santo y Vigilia Pascual.' },
        { n:'Liturgia funeraria',           p:'/l/liturgia-funeraria/',                              c:'lit', d:'Ritos de la Iglesia para los difuntos: funeral, exequias y Misa de réquiem.' },
        { n:'Liturgia nupcial',             p:'/l/liturgia-nupcial/',                                c:'lit', d:'Rito del Matrimonio celebrado en la Iglesia; normalmente dentro de la Misa.' },
        { n:'Ordinario de la Misa',         p:'/o/ordinario-de-la-misa/',                            c:'lit', d:'Partes fijas que no cambian según el tiempo litúrgico: Kyrie, Gloria, Credo, Sanctus.' },
        { n:'Proto-liturgia cristiana',     p:'/p/proto-liturgia-cristiana/',                        c:'lit', d:'Las primeras formas de culto cristiano en el siglo I: fracción del pan y oración.' },
        { n:'Evolución de la Santa Misa',   p:'/e/evolucion-de-la-santa-misa/',                     c:'lit', d:'Desarrollo histórico de la Misa desde la Última Cena hasta la reforma del Vaticano II.' },
        { n:'Misa del Gallo',               p:'/m/misa-del-gallo/',                                  c:'lit', d:'Misa de Navidad celebrada a medianoche: tradición que remonta al s. V en Roma.' },
        { n:'Instrucción General del Misal',p:'/i/instruccion-general-del-misal-romano/',            c:'lit', d:'Documento normativo que regula la celebración de la Misa según el rito romano.' },
        { n:'Canon de la Misa',             p:'/c/canon-de-la-misa/',                                c:'lit', d:'La Plegaria Eucarística I: la más antigua del rito romano, atribuida a san Gregorio.' },
        { n:'Rito de la Misa',              p:'/r/rito-de-la-misa/',                                 c:'lit', d:'Conjunto ordenado de acciones y palabras que constituyen la celebración eucarística.' },
        /* ── ESPIRITUALIDAD (30) ── */
        { n:'Hesicasmo',                    p:'/h/hesicasmo/',                                       c:'esp', d:'Oración del corazón en silencio interior; busca la Luz increada de Dios (Palamás).' },
        { n:'Examen de conciencia',         p:'/e/examen-de-conciencia/',                            c:'esp', d:'Revisión diaria de los propios actos ante Dios; pieza central del método ignaciano.' },
        { n:'Ascetismo',                    p:'/a/ascetismo/',                                       c:'esp', d:'Renuncia y mortificación para configurarse con la Cruz de Cristo.' },
        { n:'Mística',                      p:'/m/mistica/',                                         c:'esp', d:'Experiencia directa y transformante de Dios; cumbre de la vida espiritual.' },
        { n:'Mística cristiana',            p:'/m/mistica-cristiana/',                               c:'esp', d:'Tradición de unión con Dios que atraviesa toda la historia de la Iglesia.' },
        { n:'Oración',                      p:'/o/oracion/',                                         c:'esp', d:'Elevación del alma a Dios: vocal, mental, contemplativa o litúrgica.' },
        { n:'Contemplación',                p:'/c/contemplacion/',                                   c:'esp', d:'Oración silenciosa de amor que descansa en la presencia de Dios.' },
        { n:'Espiritualidad ignaciana',     p:'/e/espiritualidad-ignaciana/',                        c:'esp', d:'Discernimiento y Ejercicios Espirituales: encontrar a Dios en todas las cosas.' },
        { n:'Espiritualidad monástica',     p:'/e/espiritualidad-monastica/',                        c:'esp', d:'Ora et labora benedictino: oración, trabajo y comunidad como camino de santidad.' },
        { n:'Espiritualidad católica',      p:'/e/espiritualidad/',                                  c:'esp', d:'Conjunto de caminos reconocidos por la Iglesia para la unión del alma con Dios.' },
        { n:'Experiencia mística',          p:'/e/experiencia-mistica/',                             c:'esp', d:'Contacto directo y pasivo con Dios que supera el discurso racional: don gratuito.' },
        { n:'Oración mental',               p:'/o/oracion-mental/',                                  c:'esp', d:'Oración interior sin palabras fijas: meditación, contemplación y oración afectiva.' },
        { n:'Oración vocal',                p:'/o/oracion-vocal/',                                   c:'esp', d:'Oración expresada con palabras, sola o en comunidad: vínculo entre mente y voz.' },
        { n:'Espiritualidad mariana',       p:'/e/espiritualidad-mariana/',                          c:'esp', d:'Vivir la fe a través de María: consagración, rosario y devoción filial a la Madre.' },
        { n:'Espiritualidad franciscana',   p:'/e/espiritualidad-franciscana/',                      c:'esp', d:'Pobreza, fraternidad y alegría como camino de seguimiento radical de Cristo.' },
        { n:'Espiritualidad laical',        p:'/e/espiritualidad-laical/',                           c:'esp', d:'Los laicos están llamados a la santidad en el mundo: trabajo, familia y compromiso social.' },
        { n:'Orden Benedictina',            p:'/o/orden-benedictina/',                               c:'esp', d:'Fundada por san Benito (s. VI): Regla, estabilidad, conversión y ora et labora.' },
        { n:'Orden Dominicana',             p:'/o/orden-dominicana/',                                c:'esp', d:'Fundada por santo Domingo (1216): predicación, estudio y vida comunitaria.' },
        { n:'Carmelitas',                   p:'/c/carmelitas/',                                      c:'esp', d:'Orden contemplativa reformada por Teresa de Ávila y Juan de la Cruz en el s. XVI.' },
        { n:'Adoración a la Cruz',          p:'/a/adoracion-a-la-cruz-de-cristo/',                   c:'esp', d:'Rito del Viernes Santo: postración ante la Cruz como acto supremo de veneración.' },
        { n:'Oración del Señor',            p:'/o/oracion-de-jesus/',                                c:'esp', d:'El Padrenuestro: la oración enseñada por Cristo en el Sermón del Monte.' },
        { n:'Oración litúrgica',            p:'/o/oracion-liturgica/',                               c:'esp', d:'La oración de la Iglesia celebrada en nombre de Cristo: pública, oficial y eficaz.' },
        { n:'Historia monástica',           p:'/h/historia-monastica/',                              c:'esp', d:'El monacato desde los Padres del Desierto hasta las grandes órdenes medievales.' },
        { n:'Oración en Getsemaní',         p:'/l/la-oracion-de-jesus-en-getsemani/',                c:'esp', d:'Cristo ora hasta sudar sangre: modelo de abandono filial en la voluntad del Padre.' },
        { n:'Vestidura monástica',          p:'/v/vestidura-monastica/',                             c:'esp', d:'El hábito como signo exterior de la consagración a Dios y la vida religiosa.' },
        { n:'Orden Franciscana',            p:'/o/orden-franciscana/',                               c:'esp', d:'Fundada por san Francisco de Asís (1209): pobreza, minoridad y alegría evangélica.' },
        { n:'Oración de los fieles',        p:'/o/oracion-de-los-fieles/',                           c:'esp', d:'Oración universal en la Misa: intercesión por la Iglesia, el mundo y los difuntos.' },
        { n:'Orden de Benedictinos',        p:'/o/orden-de-benedictinos/',                           c:'esp', d:'La familia benedictina: monjes, monjas y oblados que viven la Regla de san Benito.' },
        { n:'Latría',                       p:'/l/latria-adoracion/',                                c:'esp', d:'Adoración debida solo a Dios: distinta de la dulía (santos) e hiperdulía (María).' },
        { n:'Oración universal',            p:'/o/oracion-universal/',                               c:'esp', d:'Intercesión por toda la humanidad: la Iglesia ora por el mundo entero en cada Misa.' },
        /* ── BIBLIA (30) ── */
        { n:'Biblia',                       p:'/b/biblia/',                                          c:'bib', d:'73 libros inspirados por Dios: fundamento de la fe junto con la Tradición.' },
        { n:'Evangelio',                    p:'/e/evangelio/',                                        c:'bib', d:'Buena Noticia de la salvación en Cristo: los cuatro Evangelios son el corazón de la Escritura.' },
        { n:'Antiguo Testamento',           p:'/a/antiguo-testamento/',                              c:'bib', d:'46 libros de la Alianza antes de Cristo: Ley, Profetas y Escritos.' },
        { n:'Biblia de Jerusalén',          p:'/b/biblia-de-jerusalen/',                             c:'bib', d:'Traducción científica y litúrgica de la Escuela Bíblica de Jerusalén (1956).' },
        { n:'Biblia Septuaginta',           p:'/b/biblia-septuaginta/',                              c:'bib', d:'Traducción al griego del AT (s. III-II a.C.): la Biblia de los Apóstoles y la Iglesia primitiva.' },
        { n:'Biblia Vulgata',               p:'/b/biblia-vulgata/',                                  c:'bib', d:'Traducción latina de san Jerónimo (s. IV-V): texto oficial de la Iglesia católica.' },
        { n:'Evangelio según Mateo',        p:'/e/evangelio-segun-san-mateo/',                       c:'bib', d:'Primer evangelio canónico: dirigido a judíos, presenta a Jesús como nuevo Moisés.' },
        { n:'Evangelio según Marcos',       p:'/e/evangelio-segun-san-marcos/',                      c:'bib', d:'Evangelio más breve: acción, urgencia y el mesianismo secreto de Jesús.' },
        { n:'Evangelio según Lucas',        p:'/e/evangelio-segun-san-lucas/',                       c:'bib', d:'El evangelio de la misericordia: pobres, mujeres y el Espíritu Santo como protagonistas.' },
        { n:'Evangelio según Juan',         p:'/e/evangelio-segun-san-juan/',                        c:'bib', d:'El cuarto evangelio: Logos, signos y discursos del Cristo glorioso.' },
        { n:'Evangelios sinópticos',        p:'/e/evangelios-sinopticos/',                           c:'bib', d:'Mateo, Marcos y Lucas: visión paralela de Jesús; la «cuestión sinóptica» estudia su relación.' },
        { n:'Apocalipsis',                  p:'/a/apocalipsis/',                                     c:'bib', d:'Libro de Juan: revelación simbólica sobre el triunfo de Cristo al fin de los tiempos.' },
        { n:'Epístola a los Gálatas',       p:'/e/epistola-a-los-galatas/',                          c:'bib', d:'Pablo defiende la justificación por la fe, no por la Ley: carta capital de la teología paulina.' },
        { n:'Epístolas católicas',          p:'/e/epistolas-catolicas/',                             c:'bib', d:'Santiago, Pedro, Juan y Judas: cartas dirigidas a toda la Iglesia universal.' },
        { n:'Exégesis bíblica',             p:'/e/exegesis-biblica/',                                c:'bib', d:'Interpretación científica de la Escritura: método histórico-crítico y sentidos del texto.' },
        { n:'Hermenéutica',                 p:'/h/hermeneutica/',                                    c:'bib', d:'Arte de interpretar textos: principios que rigen la lectura correcta de la Biblia.' },
        { n:'Isaías',                       p:'/i/isaias-profeta/',                                   c:'bib', d:'El más cristológico de los profetas: cánticos del Siervo y la profecía de la Virgen.' },
        { n:'Jeremías',                     p:'/j/jeremias-profeta/',                                c:'bib', d:'Profeta de la Nueva Alianza (Jr 31): su vida prefigura la de Cristo sufriente.' },
        { n:'Ezequiel',                     p:'/e/ezequiel-profeta/',                                c:'bib', d:'Profeta del exilio: visiones del carro de Yahvé y el valle de los huesos secos.' },
        { n:'Daniel',                       p:'/d/daniel-profeta/',                                  c:'bib', d:'Profecías apocalípticas y el «Hijo del hombre»: clave para entender el Nuevo Testamento.' },
        { n:'Elías',                        p:'/e/elias-profeta/',                                   c:'bib', d:'Profeta del fuego (s. IX a.C.): figura del precursor y modelo de celo por Dios.' },
        { n:'Evangelios apócrifos',         p:'/e/evangelios-apocrifos/',                            c:'bib', d:'Escritos sobre Jesús no reconocidos como canónicos; revelan la piedad popular primitiva.' },
        { n:'Biblia y Tradición',           p:'/b/biblia-y-tradicion/',                              c:'bib', d:'La Escritura y la Tradición son las dos fuentes de la única Revelación divina.' },
        { n:'Biblia y ciencia',             p:'/b/biblia-y-ciencia/',                                c:'bib', d:'La Biblia no es un libro científico: enseña la verdad salvífica, no cosmología.' },
        { n:'Credibilidad de la Biblia',    p:'/c/credibilidad-de-la-biblia/',                       c:'bib', d:'Argumentos históricos, arqueológicos y teológicos que avalan la fiabilidad bíblica.' },
        { n:'Inerrancia bíblica',           p:'/i/inerrancia-biblica/',                              c:'bib', d:'La Escritura no engaña ni puede engañar en lo que afirma para nuestra salvación.' },
        { n:'Libro de los Salmos',          p:'/l/libro-de-los-salmos/',                             c:'bib', d:'150 poemas de oración: el breviario de Israel y de la Iglesia en la Liturgia de las Horas.' },
        { n:'Libro del Apocalipsis',        p:'/l/libro-del-apocalipsis/',                           c:'bib', d:'Último libro del NT: visiones de Juan en Patmos sobre el combate final y la victoria de Cristo.' },
        { n:'Libro de los Proverbios',      p:'/l/libro-de-los-proverbios/',                         c:'bib', d:'Sabiduría práctica del AT: máximas morales y la figura de la Sabiduría personificada.' },
        { n:'Epístola de Santiago',         p:'/e/epistola-de-santiago/',                            c:'bib', d:'«La fe sin obras está muerta»: corrección de un fideísmo sin compromiso ético.' },
        /* ── FILOSOFÍA (30) ── */
        { n:'Escolástica',                  p:'/e/escolastica/',                                     c:'fil', d:'Método medieval que integra fe y razón con rigor lógico; culmen en Tomás de Aquino.' },
        { n:'Tomismo',                      p:'/t/tomismo/',                                         c:'fil', d:'Filosofía de santo Tomás de Aquino: síntesis de Aristóteles y fe cristiana.' },
        { n:'Metafísica',                   p:'/m/metafisica/',                                      c:'fil', d:'Estudio del ser en cuanto ser: acto, potencia, sustancia y las causas primeras.' },
        { n:'Epistemología',                p:'/e/epistemologia/',                                   c:'fil', d:'Teoría del conocimiento: cómo la razón humana alcanza la verdad.' },
        { n:'Filosofía moral',              p:'/f/filosofia-moral/',                                 c:'fil', d:'Estudio racional del bien, la virtud y la obligación moral: base de la ética cristiana.' },
        { n:'Suma Teológica',               p:'/s/suma-teologica/',                                  c:'fil', d:'Obra cumbre de Tomás de Aquino (s. XIII): síntesis de teología y filosofía medieval.' },
        { n:'Libre albedrío',               p:'/l/libre-albedrio/',                                  c:'fil', d:'Capacidad humana de elegir el bien o el mal: fundamento de la responsabilidad moral.' },
        { n:'El problema del mal',          p:'/e/el-problema-del-mal-y-la-providencia-divina/',     c:'fil', d:'¿Por qué permite Dios el mal? La teodicea busca la compatibilidad de Dios y el sufrimiento.' },
        { n:'Agnosticismo',                 p:'/a/agnosticismo/',                                    c:'fil', d:'Postura que niega o suspende el juicio sobre la existencia de Dios: refutada por la fe.' },
        { n:'Ateísmo',                      p:'/a/ateismo/',                                         c:'fil', d:'Negación de la existencia de Dios: la Iglesia lo considera fruto del pecado y la soberbia.' },
        { n:'Secularización',               p:'/l/la-secularizacion-neopagana/',                     c:'fil', d:'Proceso por el que la sociedad excluye a Dios de la vida pública: reto de la Iglesia hoy.' },
        { n:'Teología natural',             p:'/e/errores-sobre-la-negacion-de-la-teologia-natural/', c:'fil', d:'La razón puede conocer a Dios por sus obras: error negar esta capacidad natural.' },
        { n:'Teología fundamental',         p:'/t/teologia-fundamental/',                            c:'fil', d:'Fundamentos racionales de la credibilidad de la Revelación cristiana.' },
        { n:'Teología especulativa',        p:'/t/teologia-especulativa/',                           c:'fil', d:'Desarrollo racional del dato revelado mediante la filosofía: tradición escolástica.' },
        { n:'Teología dogmática',           p:'/t/teologia-dogmatica/',                              c:'fil', d:'Exposición sistemática de los dogmas de la fe: ciencia de las verdades reveladas.' },
        { n:'Teología bíblica',             p:'/t/teologia-biblica/',                                c:'fil', d:'Extrae la teología directamente de los textos sagrados: AT, NT y su unidad.' },
        { n:'Teología espiritual',          p:'/t/teologia-espiritual/',                             c:'fil', d:'Estudio científico de la vida espiritual y de los caminos de unión con Dios.' },
        { n:'Teología litúrgica',           p:'/t/teologia-liturgica/',                              c:'fil', d:'Lex orandi lex credendi: la liturgia es fuente y norma de la teología.' },
        { n:'Teología mariana',             p:'/t/teologia-mariana/',                                c:'fil', d:'Reflexión sistemática sobre la persona, los dogmas y la misión de la Virgen María.' },
        { n:'Teología pastoral',            p:'/t/teologia-pastoral/',                               c:'fil', d:'Ciencia de la acción de la Iglesia: evangelización, sacramentos y servicio.' },
        { n:'Teología política',            p:'/t/teologia-politica/',                               c:'fil', d:'Relación entre fe cristiana y orden político: límites y deberes del Estado.' },
        { n:'Patrología',                   p:'/p/patrologia/',                                      c:'fil', d:'Ciencia que estudia la vida, obras y doctrina de los Padres de la Iglesia.' },
        { n:'Magisterio pontificio',        p:'/m/magisterio-pontificio/',                           c:'fil', d:'Enseñanza del Papa en encíclicas, exhortaciones y declaraciones ex cathedra.' },
        { n:'Niveles del Magisterio',       p:'/l/los-diferentes-niveles-del-magisterio/',           c:'fil', d:'Gradación de la autoridad docente: desde el dogma hasta la enseñanza disciplinar.' },
        { n:'Obediencia al Magisterio',     p:'/o/obediencia-al-magisterio/',                        c:'fil', d:'El fiel debe un asentimiento proporcional a la autoridad con que la Iglesia enseña.' },
        { n:'Koinonía',                     p:'/k/koinonia/',                                        c:'fil', d:'Comunión: participación en la vida divina y en la fraternidad eclesial (Hch 2,42).' },
        { n:'Logos',                        p:'/l/logos/',                                           c:'fil', d:'Razón divina que ordena el cosmos; san Juan lo aplica a Cristo: «En el principio era el Verbo».' },
        { n:'Kerygma',                      p:'/k/kerygma/',                                         c:'fil', d:'Primer anuncio de Cristo muerto y resucitado: núcleo irreducible de la evangelización.' },
        { n:'Teología del hogar',           p:'/t/teologia-del-hogar/',                              c:'fil', d:'La familia como iglesia doméstica: evangelización y santidad en la vida cotidiana.' },
        { n:'Teología patrística',          p:'/t/teologia-patristica/',                             c:'fil', d:'La teología de los Padres (ss. I-VIII): fuente normativa del pensamiento cristiano.' },

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
  --wc-cat-bg:rgba(255,255,255,.08);
  font-weight:300;letter-spacing:.01ch
}}
@media(prefers-color-scheme:dark){.wikitolica-concepto-wt .wikitolica-concepto-cat{filter:brightness(1.7)}}
.wikitolica-concepto-wt *,.wikitolica-concepto-wt *::before,.wikitolica-concepto-wt *::after{
  box-sizing:border-box;margin:0;padding:0;
  font-family:inherit;font-size:inherit;font-weight:inherit;font-style:normal;
  line-height:inherit;letter-spacing:inherit;word-spacing:normal;
  text-transform:none;text-decoration:none;vertical-align:baseline;color:inherit
}
.wikitolica-concepto-wt .wikitolica-concepto-a{color:var(--wc-lk);text-decoration:none;cursor:pointer}
.wikitolica-concepto-wt .wikitolica-concepto-a:hover{text-decoration:underline;color:var(--wc-lkh)}
.wikitolica-concepto-wt .wikitolica-concepto-stripe{height:4px;transition:background .3s}
.wikitolica-concepto-wt .wikitolica-concepto-body{padding:.7em .85em .6em}
.wikitolica-concepto-wt .wikitolica-concepto-cat{
  display:inline-block;font-size:.62em;font-weight:700;letter-spacing:.07em;
  text-transform:uppercase;padding:.12em .45em;border-radius:3px;margin-bottom:.4em;
  color:var(--wc-cat-color,#555);background:var(--wc-cat-bg,rgba(0,0,0,.06))
}
.wikitolica-concepto-wt .wikitolica-concepto-titulo{
  font-size:.97em;font-weight:700;line-height:1.25;color:var(--wc-tx);margin-bottom:.25em
}
.wikitolica-concepto-wt .wikitolica-concepto-titulo .wikitolica-concepto-a{color:inherit}
.wikitolica-concepto-wt .wikitolica-concepto-titulo .wikitolica-concepto-a:hover{color:var(--wc-lk)}
.wikitolica-concepto-wt .wikitolica-concepto-desc{font-size:.72em;line-height:1.4;color:var(--wc-mu);margin-bottom:.6em}
.wikitolica-concepto-wt .wikitolica-concepto-meta{display:flex;align-items:center;justify-content:space-between;gap:.5em}
.wikitolica-concepto-wt .wikitolica-concepto-label{font-size:.63em;color:var(--wc-mu);text-transform:uppercase;letter-spacing:.06em}
.wikitolica-concepto-wt .wikitolica-concepto-leer{font-size:.78em;font-weight:600;color:var(--wc-lk)}
.wikitolica-concepto-wt .wikitolica-concepto-leer:hover{color:var(--wc-lkh);text-decoration:underline}
.wikitolica-concepto-wt .wikitolica-concepto-pie{padding:.45em .85em;border-top:1px solid var(--wc-bd);text-align:center;font-size:.67em;color:var(--wc-mu);background:var(--wc-bg-s);white-space:nowrap;overflow:hidden}
.wikitolica-concepto-wt .wikitolica-concepto-pie .wikitolica-concepto-a{color:var(--wc-lk)}
.wikitolica-concepto-wt .wikitolica-concepto-pie .wikitolica-concepto-a:hover{color:var(--wc-lkh);text-decoration:underline}
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

        // Selección determinista: epoch days % total → mismo concepto para todos el mismo día
        const idx = Math.floor(Date.now() / 86400000) % C.length;
        const con = C[idx];
        const cat = CAT[con.c];
        const href = u(con.p);

        host.innerHTML =
            `<div class="wikitolica-concepto-wt">` +
                `<div class="wikitolica-concepto-stripe" style="background:${cat.color}"></div>` +
                `<div class="wikitolica-concepto-body">` +
                    `<span class="wikitolica-concepto-cat" style="--wc-cat-color:${cat.color}">${cat.emoji} ${cat.label}</span>` +
                    `<div class="wikitolica-concepto-titulo">${lnk(href, con.n, 'wikitolica-concepto-a')}</div>` +
                    `<div class="wikitolica-concepto-desc">${con.d}</div>` +
                    `<div class="wikitolica-concepto-meta">` +
                        `<span class="wikitolica-concepto-label">Concepto del día</span>` +
                        lnk(href, 'Leer artículo →', 'wikitolica-concepto-leer wikitolica-concepto-a') +
                    `</div>` +
                `</div>` +
                `<div class="wikitolica-concepto-pie">${lnk(BASE, 'Wikitólica', 'wikitolica-concepto-a')} · ${lnk(`${BASE}/n/nuestros-widgets/`, 'Ponlo en tu web', 'wikitolica-concepto-a')}</div>` +
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
