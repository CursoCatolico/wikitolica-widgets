/*!
 * lecturas.js — Lecturas del día · Wikitólica (https://www.wikitolica.com/)
 * Muestra las citas bíblicas de la Misa del día (calendario litúrgico de la CEE, España)
 * y enlaza cada una a su capítulo en la Biblia publicada por la Santa Sede (vatican.va).
 * Solo referencias bíblicas: no incluye ni reproduce el texto de las lecturas.
 *
 * Uso: <script src="…/lecturas.js" defer></script>  <div class="wikitolica-lecturas"></div>
 *
 * El cálculo del día litúrgico y la selección de lecturas proceden de
 * https://github.com/zeanuri/lecturasdeldia (liturgia.py, commit ee91ccc), bajo esta licencia:
 *
 * MIT License — Copyright (c) 2026 zeanuri
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function () {
    'use strict';

    /* ── Datos: índice de citas del Leccionario (castellano) y reglas de calendario ──
       Compactados: un nodo {tieneTexto, cita} se guarda como la cadena "cita";
       si tieneTexto es falso, como "~cita". */
    const DATA = /*DATA*/{"es":{"dominical":{"A":{"adviento_1":{"primera":"Is 2, 1-5","salmo":"Sal 121, 1bc-2. 4-5. 6-7. 8-9 (R.: cf. 1bc)","segunda":"Rom 13, 11-14a","evangelio":"Mt 24, 37-44"},"adviento_2":{"primera":"Is 11, 1-10","salmo":"Sal 71, 1bc-2. 7-8. 12-13. 17 (R.: cf. 7)","segunda":"Rom 15, 4-9","evangelio":"Mt 3, 1-12"},"adviento_3":{"primera":"Is 35, 1-6a. 10","salmo":"Sal 145, 6c-7. 8-9a. 9bc-10 (R.: cf. Is 35, 4)","segunda":"Sant 5, 7-10","evangelio":"Mt 11, 2-11"},"adviento_4":{"primera":"Is 7, 10-14","salmo":"Sal 23, 1b-2. 3-4ab. 5-6 (R.: cf. 7c. 10c)","segunda":"Rom 1, 1-7","evangelio":"Mt 1, 18-24"},"natividad_vigilia":{"primera":"Is 62, 1-5","salmo":"Sal 88, 4-5. 16-17. 27 y 29 (R.: 2a)","segunda":"Hch 13, 16-17. 22-25","evangelio":{"tieneTexto":true,"cita":"Mt 1, 1-25","forma_breve":"Mt 1, 18-25"}},"natividad_medianoche":{"primera":"Is 9, 1-6","salmo":"Sal 95, 1-2a. 2b-3. 11-12. 13 (R.: cf. Lc 2, 11)","segunda":"Tit 2, 11-14","evangelio":"Lc 2, 1-14"},"natividad_aurora":{"primera":"Is 62, 11-12","salmo":"Sal 96, 1 y 6. 11-12","segunda":"Tit 3, 4-7","evangelio":"Lc 2, 15-20"},"natividad_dia":{"primera":"Is 52, 7-10","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4. 5-6 (R.: 3cd)","segunda":"Heb 1, 1-6","evangelio":{"tieneTexto":true,"cita":"Jn 1, 1-18","forma_breve":"Jn 1, 1-5. 9-14"}},"sagrada_familia":{"primera":"Eclo 3, 2-6. 12-14","salmo":"Sal 127, 1bc-2. 3. 4-5 (R.: cf. 1bc)","segunda":"Col 3, 12-21","evangelio":"Mt 2, 13-15. 19-23"},"maria_madre_dios":{"primera":"Num 6, 22-27","salmo":"Sal 66, 2-3. 5. 6 y 8 (R.: 2a)","segunda":"Gal 4, 4-7","evangelio":"Lc 2, 16-21"},"navidad_post_2":{"primera":"Eclo 24, 1-2. 8-12","salmo":"Sal 147, 12-13. 14-15. 19-20 (R.: Jn 1, 14)","segunda":"Ef 1, 3-6. 15-18","evangelio":{"tieneTexto":true,"cita":"Jn 1, 1-18","forma_breve":"Jn 1, 1-5. 9-14"}},"epifania":{"primera":"Is 60, 1-6","salmo":"Sal 71, 1bc-2. 7-8. 10-11. 12-13 (R.: cf. 11)","segunda":"Ef 3, 2-3a. 5-6","evangelio":"Mt 2, 1-12"},"bautismo":{"primera":"Is 42, 1-4. 6-7","salmo":"Sal 28, 1b y 2. 3ac-4. 3b y 9c-10 (R.: 11b)","segunda":"Hch 10, 34-38","evangelio":"Mt 3, 13-17"},"cuaresma_1":{"primera":"Gen 2, 7-9; 3, 1-7","salmo":"Sal 50, 3-4. 5-6ab. 12-13. 14 y 17 (R.: cf. 3a)","segunda":{"tieneTexto":true,"cita":"Rom 5, 12-19","forma_breve":"Rom 5, 12. 17-19"},"evangelio":"Mt 4, 1-11"},"cuaresma_2":{"primera":"Gen 12, 1-4a","salmo":"Sal 32, 4-5. 18-19. 20 y 22 (R.: 22)","segunda":"2 Tim 1, 8b-10","evangelio":"Mt 17, 1-9"},"cuaresma_3":{"primera":"Ex 17, 3-7","salmo":"Sal 94, 1-2. 6-7c. 7d-9 (R.: cf. 7d-8a)","segunda":"Rom 5, 1-2. 5-8","evangelio":{"tieneTexto":true,"cita":"Jn 4, 5-42","forma_breve":"Jn 4, 5-15. 19b-26. 39a. 40-42"}},"cuaresma_4":{"primera":"1 Sam 16, 1b. 6-7. 10-13a","salmo":"Sal 22, 1b-3a. 3b-4. 5. 6 (R.: 1b)","segunda":"Ef 5, 8-14","evangelio":{"tieneTexto":true,"cita":"Jn 9, 1-41","forma_breve":"Jn 9, 1. 6-9. 13-17. 34-38"}},"jueves_santo":{"primera":"Ex 12, 1-8. 11-14","salmo":"Sal 115, 12-13. 15-16. 17-18 (R.: cf. 1 Cor 10, 16)","segunda":"1 Cor 11, 23-26","evangelio":"Jn 13, 1-15"},"misa_crismal":{"primera":"Is 61, 1-3a. 6a. 8b-9","salmo":"Sal 88, 21-22. 25 y 27 (R.: cf. 2a)","segunda":"Ap 1, 5-8","evangelio":"Lc 4, 16-21"},"pascua_resurreccion":{"primera":"Hch 10, 34a. 37-43","salmo":"Sal 117, 1-2. 16-17. 22-23 (R.: 24)","segunda":"Col 3, 1-4","evangelio":"Jn 20, 1-9","evangelio_alt":"Lc 24, 13-35","segunda_alt":"1 Cor 5, 6b-8"},"pascua_2":{"primera":"Hch 2, 42-47","salmo":"Sal 117, 2-4. 13-15. 22-24 (R.: 1)","segunda":"1 Pe 1, 3-9","evangelio":"Jn 20, 19-31"},"pascua_3":{"primera":"Hch 2, 14. 22-33","salmo":"Sal 15, 1b-2a y 5. 7-8. 9-10. 11 (R.: cf. 11a)","segunda":"1 Pe 1, 17-21","evangelio":"Lc 24, 13-35"},"pascua_4":{"primera":"Hch 2, 14a. 36-41","salmo":"Sal 22, 1b-3a. 3b-4. 5. 6 (R.: 1b)","segunda":"1 Pe 2, 20b-25","evangelio":"Jn 10, 1-10"},"pascua_5":{"primera":"Hch 6, 1-7","salmo":"Sal 32, 1-2. 4-5. 18-19 (R.: 22)","segunda":"1 Pe 2, 4-9","evangelio":"Jn 14, 1-12"},"pascua_6":{"primera":"Hch 8, 5-8. 14-17","salmo":"Sal 65, 1b-3a. 4-5. 6-7a. 16 y 20 (R.: 1b)","segunda":"1 Pe 3, 15-18","evangelio":"Jn 14, 15-21"},"ascension":{"primera":"Hch 1, 1-11","salmo":"Sal 46, 2-3. 6-7. 8-9 (R.: 6)","segunda":"Ef 1, 17-23","evangelio":"Mt 28, 16-20"},"pentecostes_vigilia":{"primera":"Gen 11, 1-9","salmo":"Sal 32, 10-11. 12-13. 14-15 (R.: 12b)","segunda":"Rom 8, 22-27","evangelio":"Jn 7, 37-39"},"pentecostes":{"primera":"Hch 2, 1-11","salmo":"Sal 103, 1ab y 24ac. 29bc-30. 31 y 34 (R.: cf. 30)","segunda":"1 Cor 12, 3b-7. 12-13","evangelio":"Jn 20, 19-23"},"trinidad":{"primera":"Ex 34, 4b-6. 8-9","salmo":"Dan 3, 52a y c. 53a. 54a. 55a. 56a (R.: 52b)","segunda":"2 Cor 13, 11-13","evangelio":"Jn 3, 16-18"},"corpus":{"primera":"Dt 8, 2-3. 14b-16a","salmo":"Sal 147, 12-13. 14-15. 19-20 (R.: 12a)","segunda":"1 Cor 10, 16-17","evangelio":"Jn 6, 51-58"},"sagrado_corazon":{"primera":"Dt 7, 6-11","salmo":"Sal 102, 1bc-2. 3-4. 6-7. 8 y 10 (R.: cf. 17)","segunda":"1 Jn 4, 7-16","evangelio":"Mt 11, 25-30"},"to_2":{"primera":"Is 49, 3. 5-6","salmo":"Sal 39, 2 y 4ab. 7-8a. 8b-9. 10 (R.: cf. 8a y 9a)","segunda":"1 Cor 1, 1-3","evangelio":"Jn 1, 29-34"},"to_3":{"primera":"Is 8, 23b — 9, 3","salmo":"Sal 26, 1bcde. 4. 13-14 (R.: 1b)","segunda":"1 Cor 1, 10-13. 17","evangelio":{"tieneTexto":true,"cita":"Mt 4, 12-23","forma_breve":"Mt 4, 12-17"}},"to_4":{"primera":"Sof 2, 3; 3, 12-13","salmo":"Sal 145, 6c-7. 8-9a. 9bc-10 (R.: Mt 5, 3)","segunda":"1 Cor 1, 26-31","evangelio":"Mt 5, 1-12a"},"to_5":{"primera":"Is 58, 7-10","salmo":"Sal 111, 4-5. 6-7. 8a y 9 (R.: cf. 4a)","segunda":"1 Cor 2, 1-5","evangelio":"Mt 5, 13-16"},"to_6":{"primera":"Eclo 15, 15-20","salmo":"Sal 118, 1-2. 4-5. 17-18. 33-34 (R.: 1b)","segunda":"1 Cor 2, 6-10","evangelio":{"tieneTexto":true,"cita":"Mt 5, 17-37","forma_breve":"Mt 5, 20-22a. 27-28. 33-34a. 37"}},"to_7":{"primera":"Lev 19, 1-2. 17-18","salmo":"Sal 102, 1bc-2. 3-4. 8 y 10. 12-13 (R.: 8a)","segunda":"1 Cor 3, 16-23","evangelio":"Mt 5, 38-48"},"to_8":{"primera":"Is 49, 14-15","salmo":"Sal 61, 2-3. 6-7. 8-9ab (R.: 6a)","segunda":"1 Cor 4, 1-5","evangelio":"Mt 6, 24-34"},"to_9":{"primera":"Dt 11, 18. 26-28. 32","salmo":"Sal 30, 2-3a. 3bc-4. 17 y 25","segunda":"Rom 3, 21-25a. 28","evangelio":"Mt 7, 21-27"},"to_10":{"primera":"Os 6, 3b-6","salmo":"Sal 49, 1bc y 8. 12-13. 14-15 (R.: 23b)","segunda":"Rom 4, 18-25","evangelio":"Mt 9, 9-13"},"to_11":{"primera":"Ex 19, 2-6a","salmo":"Sal 99, 1b-2. 3. 5 (R.: 3c)","segunda":"Rom 5, 6-11","evangelio":"Mt 9, 36 — 10, 8"},"to_12":{"primera":"Jer 20, 10-13","salmo":"Sal 68, 8-10. 14 y 17. 33-35 (R.: 14c)","segunda":"Rom 5, 12-15","evangelio":"Mt 10, 26-33"},"to_13":{"primera":"2 Re 4, 8-11. 14-16a","salmo":"Sal 88, 2-3. 16-17. 18-19 (R.: 2a)","segunda":"Rom 6, 3-4. 8-11","evangelio":"Mt 10, 37-42"},"to_14":{"primera":"Zac 9, 9-10","salmo":"Sal 144, 1bc-2. 8-9. 10-11. 13cd-14 (R.: cf. 1bc)","segunda":"Rom 8, 9. 11-13","evangelio":"Mt 11, 25-30"},"to_15":{"primera":"Is 55, 10-11","salmo":"Sal 64, 10abcd. 10e-11. 12-13. 14 (R.: Lc 8, 8)","segunda":"Rom 8, 18-23","evangelio":{"tieneTexto":true,"cita":"Mt 13, 1-23","forma_breve":"Mt 13, 1-9"}},"to_16":{"primera":"Sab 12, 13. 16-19","salmo":"Sal 85, 5-6. 9-10. 15-16a (R.: 5a)","segunda":"Rom 8, 26-27","evangelio":{"tieneTexto":true,"cita":"Mt 13, 24-43","forma_breve":"Mt 13, 24-30"}},"to_17":{"primera":"1 Re 3, 5. 7-12","salmo":"Sal 118, 57 y 72. 76-77. 127-128. 129-130 (R.: 97a)","segunda":"Rom 8, 28-30","evangelio":{"tieneTexto":true,"cita":"Mt 13, 44-52","forma_breve":"Mt 13, 44-46"}},"to_18":{"primera":"Is 55, 1-3","salmo":"Sal 144, 8-9. 15-16. 17-18 (R.: cf. 16)","segunda":"Rom 8, 35. 37-39","evangelio":"Mt 14, 13-21"},"to_19":{"primera":"1 Re 19, 9a. 11-13a","salmo":"Sal 84, 9abc y 10. 11-12. 13-14 (R.: 8)","segunda":"Rom 9, 1-5","evangelio":"Mt 14, 22-33"},"to_20":{"primera":"Is 56, 1. 6-7","salmo":"Sal 66, 2-3. 5. 6 y 8 (R.: 4)","segunda":"Rom 11, 13-15. 29-32","evangelio":"Mt 15, 21-28"},"to_21":{"primera":"Is 22, 19-23","salmo":"Sal 137, 1bcd-2a. 2bcd-3. 6 y 8bc (R.: 8bc)","segunda":"Rom 11, 33-36","evangelio":"Mt 16, 13-20"},"to_25":{"primera":"Is 55, 6-9","salmo":"Sal 144, 2-3. 8-9. 17-18 (R.: 18a)","segunda":"Flp 1, 20c-24. 27a","evangelio":"Mt 20, 1-16"},"to_26":{"primera":"Ez 18, 25-28","salmo":"Sal 24, 4-5. 6-7. 8-9 (R.: 6a)","segunda":{"tieneTexto":true,"cita":"Flp 2, 1-11","forma_breve":"Flp 2, 1-5"},"evangelio":"Mt 21, 28-32"},"to_27":{"primera":"Is 5, 1-7","salmo":"Sal 79, 9 y 12. 13-14. 15-16. 19-20 (R.: Is 5, 7a)","segunda":"Flp 4, 6-9","evangelio":"Mt 21, 33-43"},"to_28":{"primera":"Is 25, 6-10a","salmo":"Sal 22, 1b-3a. 3b-4. 5. 6 (R.: 6cd)","segunda":"Flp 4, 12-14. 19-20","evangelio":{"tieneTexto":true,"cita":"Mt 22, 1-14","forma_breve":"Mt 22, 1-10"}},"to_29":{"primera":"Is 45, 1. 4-6","salmo":"Sal 95, 1 y 3. 4-5. 7-8. 9-10ac (R.: 7b)","segunda":"1 Tes 1, 1-5b","evangelio":"Mt 22, 15-21"},"to_30":{"primera":"Ex 22, 20-26","salmo":"Sal 17, 2-3a. 3bc-4. 47 y 51ab (R.: 2)","segunda":"1 Tes 1, 5c-10","evangelio":"Mt 22, 34-40"},"to_31":{"primera":"Mal 1, 14b — 2, 2b. 8-10","salmo":"Sal 130, 1bcde. 2. 3","segunda":"1 Tes 2, 7b-9. 13","evangelio":"Mt 23, 1-12"},"cristo_rey":{"primera":"Ez 34, 11-12. 15-17","salmo":"Sal 22, 1b-2a. 2b-3. 5. 6 (R.: 1b)","segunda":"1 Cor 15, 20-26. 28","evangelio":"Mt 25, 31-46"},"transfiguracion":{"primera":"Dan 7, 9-10. 13-14","salmo":"Sal 96, 1-2. 5-6. 9 (R.: 1a. 9b)","segunda":"2 Pe 1, 16-19","evangelio":"Mt 17, 1-9"},"cuaresma_5":{"primera":"Ez 37, 12-14","salmo":"Sal 129, 1b-2. 3-4. 5-7ab. 7cd-8 (R.: 7cd)","segunda":"Rom 8, 8-11","evangelio":{"tieneTexto":true,"cita":"Jn 11, 1-45","forma_breve":"Jn 11, 3-7. 17. 20-27. 33b-45"}},"ramos":{"primera":"Is 50, 4-7","evangelio":"Mt 27, 11-54","salmo":"Sal 21, 8-9. 17-18a. 19-20. 23-24 (R.: 2ab)","segunda":"Flp 2, 6-11"},"viernes_santo":{"primera":"Is 52, 13 — 53, 12","salmo":"Sal 30, 2 y 6. 12-13. 15-16. 17 y 25 (R.: Lc 23, 46)","segunda":"Heb 4, 14-16; 5, 7-9","evangelio":"Jn 18, 1 — 19, 42"},"to_22":{"primera":"Jer 20, 7-9","salmo":"Sal 62, 2. 3-4. 5-6. 8-9 (R.: cf. 2b)","segunda":"Rom 12, 1-2","evangelio":"Mt 16, 21-27"},"to_23":{"primera":"Ez 33, 7-9","salmo":"Sal 94, 1-2. 6-7c. 7d-9 (R.: cf. 7d-8a)","segunda":"Rom 13, 8-10","evangelio":"Mt 18, 15-20"},"to_24":{"primera":"Eclo 27, 30 — 28, 7","salmo":"Sal 102, 1bc-2. 3-4. 9-10. 11-12 (R.: 8)","segunda":"Rom 14, 7-9","evangelio":"Mt 18, 21-35"},"presentacion":{"primera":"Mal 3, 1-4","salmo":"Sal 23, 7. 8. 9. 10 (R.: 10bc)","segunda":"Heb 2, 14-18","evangelio":{"tieneTexto":true,"cita":"Lc 2, 22-40","forma_breve":"Lc 2, 22-32"}},"to_32":{"primera":"Sab 6, 12-16","salmo":"Sal 62, 2. 3-4. 5-6. 7-8 (R.: 2b)","segunda":{"tieneTexto":true,"cita":"1 Tes 4, 13-18","forma_breve":"1 Tes 4, 13-14"},"evangelio":"Mt 25, 1-13"},"to_33":{"primera":"Prov 31, 10-13. 19-20. 30-31","salmo":"Sal 127, 1bc-2. 3. 4-5 (R.: cf. 1b)","segunda":"1 Tes 5, 1-6","evangelio":{"tieneTexto":true,"cita":"Mt 25, 14-30","forma_breve":"Mt 25, 14-15. 19-21"}},"vigilia_pascual_lectura_1":{"primera":{"tieneTexto":true,"cita":"Gen 1, 1 — 2, 2","forma_breve":"Gen 1, 1. 26-31a"},"salmo":"Sal 103, 1-2a. 5-6. 10 y 12. 13-14. 24 y 35c (R.: cf. 30)"},"vigilia_pascual_lectura_2":{"primera":{"tieneTexto":true,"cita":"Gen 22, 1-18","forma_breve":"Gen 22, 1-2. 9a. 10-13. 15-18"},"salmo":"Sal 15, 5 y 8. 9-10. 11 (R.: 1)"},"vigilia_pascual_lectura_3":{"primera":"Ex 14, 15 — 15, 1a","salmo":"Ex 15, 1b-2. 3-4. 5-6. 17-18 (R.: 1b)"},"vigilia_pascual_lectura_4":{"primera":"Is 54, 5-14","salmo":"Sal 29, 2 y 4. 5-6. 11 y 12a y 13b (R.: 2a)"},"vigilia_pascual_lectura_5":{"primera":"Is 55, 1-11","salmo":"Is 12, 2-3. 4bcde. 5-6 (R.: 3)"},"vigilia_pascual_lectura_6":{"primera":"Bar 3, 9-15. 32 — 4, 4","salmo":"Sal 18, 8. 9. 10. 11 (R.: Jn 6, 68c)"},"vigilia_pascual_lectura_7":{"primera":"Ez 36, 16-17a. 18-28","salmo":"Sal 41, 3. 5cdef; 42, 3. 4 (R.: Sal 41, 2)"},"vigilia_pascual":{"segunda":"Rom 6, 3-11","salmo":"Sal 117, 1-2. 16-17. 22-23","evangelio":"Mt 28, 1-10"}},"B":{"adviento_1":{"primera":"Is 63, 16c-17. 19c; 64, 2b-7","salmo":"Sal 79, 2ac y 3b. 15-16. 18-19 (R.: 4)","segunda":"1 Cor 1, 3-9","evangelio":"Mc 13, 33-37"},"adviento_2":{"primera":"Is 40, 1-5. 9-11","salmo":"Sal 84, 9abc y 10. 11-12. 13-14 (R.: 8)","segunda":"2 Pe 3, 8-14","evangelio":"Mc 1, 1-8"},"adviento_3":{"primera":"Is 61, 1-2a. 10-11","salmo":"Lc 1, 46b-48. 49-50. 53-54 (R.: Is 61, 10b)","segunda":"1 Tes 5, 16-24","evangelio":"Jn 1, 6-8. 19-28"},"adviento_4":{"primera":"2 Sam 7, 1-5. 8b-12. 14a. 16","salmo":"Sal 88, 2-3. 4-5. 27 y 29 (R.: cf. 2a)","segunda":"Rom 16, 25-27","evangelio":"Lc 1, 26-38"},"natividad_vigilia":{"primera":"Is 62, 1-5","salmo":"Sal 88, 4-5. 16-17. 27 y 29 (R.: 2a)","segunda":"Hch 13, 16-17. 22-25","evangelio":{"tieneTexto":true,"cita":"Mt 1, 1-25","forma_breve":"Mt 1, 18-25"}},"natividad_medianoche":{"primera":"Is 9, 1-6","salmo":"Sal 95, 1-2a. 2b-3. 11-12. 13 (R.: cf. Lc 2, 11)","segunda":"Tit 2, 11-14","evangelio":"Lc 2, 1-14"},"natividad_aurora":{"primera":"Is 62, 11-12","salmo":"Sal 96, 1 y 6. 11-12","segunda":"Tit 3, 4-7","evangelio":"Lc 2, 15-20"},"natividad_dia":{"primera":"Is 52, 7-10","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4. 5-6 (R.: 3cd)","evangelio":{"tieneTexto":true,"cita":"Jn 1, 1-18","forma_breve":"Jn 1, 1-5. 9-14"},"segunda":"Heb 1, 1-6"},"sagrada_familia":{"primera":"Gen 15, 1-6; 21, 1-3","salmo":"Sal 104, 1-2. 3-4. 5-6. 8-9 (R.: 7a. 8a)","segunda":"Heb 11, 8. 11-12. 17-19","evangelio":{"tieneTexto":true,"cita":"Lc 2, 22-40","forma_breve":"Lc 2, 22. 39-40"}},"maria_madre_dios":{"primera":"Num 6, 22-27","salmo":"Sal 66, 2-3. 5. 6 y 8 (R.: 2a)","segunda":"Gal 4, 4-7","evangelio":"Lc 2, 16-21"},"navidad_post_2":{"primera":"Eclo 24, 1-2. 8-12","salmo":"Sal 147, 12-13. 14-15. 19-20 (R.: Jn 1, 14)","segunda":"Ef 1, 3-6. 15-18","evangelio":{"tieneTexto":true,"cita":"Jn 1, 1-18","forma_breve":"Jn 1, 1-5. 9-14"}},"epifania":{"primera":"Is 60, 1-6","salmo":"Sal 71, 1bc-2. 7-8. 10-11. 12-13 (R.: cf. 11)","segunda":"Ef 3, 2-3a. 5-6","evangelio":"Mt 2, 1-12"},"bautismo":{"primera":"Is 55, 1-11","salmo":"Is 12, 2-3. 4bcde. 5-6 (R.: 3)","segunda":"1 Jn 5, 1-9","evangelio":"Mc 1, 7-11"},"cuaresma_3":{"primera":{"tieneTexto":true,"cita":"Ex 20, 1-17","forma_breve":"Ex 20, 1-3. 7-8. 12-17"},"salmo":"Sal 18, 8. 9. 10. 11 (R.: Jn 6, 68c)","segunda":"1 Cor 1, 22-25","evangelio":"Jn 2, 13-25"},"cuaresma_4":{"primera":"2 Cron 36, 14-16. 19-23","salmo":"Sal 136, 1-2. 3. 4-5. 6 (R.: 6ab)","segunda":"Ef 2, 4-10","evangelio":"Jn 3, 14-21"},"cuaresma_5":{"primera":"Jer 31, 31-34","salmo":"Sal 50, 3-4. 12-13. 14-15 (R.: 12a)","segunda":"Heb 5, 7-9","evangelio":"Jn 12, 20-33"},"ramos":{"primera":"Is 50, 4-7","evangelio":"Mc 15, 1-39","salmo":"Sal 21, 8-9. 17-18a. 19-20. 23-24 (R.: 2ab)","segunda":"Flp 2, 6-11"},"jueves_santo":{"primera":"Ex 12, 1-8. 11-14","salmo":"Sal 115, 12-13. 15-16. 17-18 (R.: cf. 1 Cor 10, 16)","segunda":"1 Cor 11, 23-26","evangelio":"Jn 13, 1-15"},"viernes_santo":{"primera":"Is 52, 13 — 53, 12","salmo":"Sal 30, 2 y 6. 12-13. 15-16. 17 y 25 (R.: Lc 23, 46)","segunda":"Heb 4, 14-16; 5, 7-9","evangelio":"Jn 18, 1 — 19, 42"},"pascua_resurreccion":{"primera":"Hch 10, 34a. 37-43","salmo":"Sal 117, 1-2. 16-17. 22-23 (R.: 24)","segunda":"Col 3, 1-4","evangelio":"Jn 20, 1-9","evangelio_alt":"Lc 24, 13-35","segunda_alt":"1 Cor 5, 6b-8"},"pascua_2":{"primera":"Hch 4, 32-35","salmo":"Sal 117, 2-4. 16-18. 22-24 (R.: 1)","segunda":"1 Jn 5, 1-6","evangelio":"Jn 20, 19-31"},"pascua_3":{"primera":"Hch 3, 13-15. 17-19","salmo":"Sal 4, 2. 4. 7. 9 (R.: cf. 7b)","segunda":"1 Jn 2, 1-5a","evangelio":"Lc 24, 35-48"},"pascua_4":{"primera":"Hch 4, 8-12","salmo":"Sal 117, 1 y 8-9. 21-23. 26 y 28-29 (R.: 22)","segunda":"1 Jn 3, 1-2","evangelio":"Jn 10, 11-18"},"pascua_5":{"primera":"Hch 9, 26-31","salmo":"Sal 21, 26b-27. 28 y 30. 31-32 (R.: 26a)","segunda":"1 Jn 3, 18-24","evangelio":"Jn 15, 1-8"},"pascua_6":{"primera":"Hch 10, 25-26. 34-35. 44-48","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4 (R.: cf. 2)","segunda":"1 Jn 4, 7-10","evangelio":"Jn 15, 9-17"},"ascension":{"primera":"Hch 1, 1-11","salmo":"Sal 46, 2-3. 6-7. 8-9 (R.: 6)","segunda":"Ef 4, 1-7. 11-13","evangelio":"Mc 16, 15-20"},"pascua_7":{"primera":"Hch 1, 15-17. 20a. 20c-26","salmo":"Sal 102, 1b-2. 11-12. 19-20ab (R.: 19a)","segunda":"1 Jn 4, 11-16","evangelio":"Jn 17, 11b-19"},"pentecostes_vigilia":{"primera":"Gen 11, 1-9","salmo":"Sal 32, 10-11. 12-13. 14-15 (R.: 12b)","segunda":"Rom 8, 22-27","evangelio":"Jn 7, 37-39"},"pentecostes":{"primera":"Hch 2, 1-11","salmo":"Sal 103, 1ab y 24ac. 29bc-30. 31 y 34 (R.: cf. 30)","segunda":"Gal 5, 16-25","evangelio":"Jn 15, 26-27; 16, 12-15"},"trinidad":{"primera":"Dt 4, 32-34. 39-40","salmo":"Sal 32, 4-5. 6 y 9. 18-19. 20 y 22 (R.: cf. 12)","segunda":"Rom 8, 14-17","evangelio":"Mt 28, 16-20"},"corpus":{"primera":"Ex 24, 3-8","salmo":"Sal 115, 12-13. 15-16. 17-18 (R.: 13)","segunda":"Heb 9, 11-15","evangelio":"Mc 14, 12-16. 22-26"},"sagrado_corazon":{"primera":"Os 11, 1. 3-4. 8c-9","salmo":"Is 12, 2-3. 4bcde. 5-6 (R.: 3)","segunda":"Ef 3, 8-12. 14-19","evangelio":"Jn 19, 31-37"},"to_2":{"primera":"1 Sam 3, 3b-10. 19","salmo":"Sal 39, 2 y 4ab. 7-8a. 8b-9. 10 (R.: cf. 8a y 9a)","segunda":"1 Cor 6, 13c-15a. 17-20","evangelio":"Jn 1, 35-42"},"to_3":{"primera":"Jon 3, 1-5. 10","salmo":"Sal 24, 4-5a. 6-7cd. 8-9 (R.: 4a)","segunda":"1 Cor 7, 29-31","evangelio":"Mc 1, 14-20"},"to_4":{"primera":"Dt 18, 15-20","salmo":"Sal 94, 1-2. 6-7c. 7d-9 (R.: cf. 7d-8a)","segunda":"1 Cor 7, 32-35","evangelio":"Mc 1, 21b-28"},"to_5":{"primera":"Job 7, 1-4. 6-7","salmo":"Sal 146, 1bc-2. 3-4. 5-6 (R.: cf. 3a)","segunda":"1 Cor 9, 16-19. 22-23","evangelio":"Mc 1, 29-39"},"to_6":{"primera":"Lev 13, 1-2. 44-46","salmo":"Sal 31, 1b-2. 5. 11 (R.: 7ac)","segunda":"1 Cor 10, 31 — 11, 1","evangelio":"Mc 1, 40-45"},"to_7":{"primera":"Is 43, 18-19. 21-22. 24c-25","salmo":"Sal 40, 2-3. 4-5. 13-14 (R.: 5b)","segunda":"2 Cor 1, 18-22","evangelio":"Mc 2, 1-12"},"to_8":{"primera":"Os 2, 16b. 17b. 21-22","salmo":"Sal 102, 1b-2. 3-4. 8 y 10. 12-13 (R.: 8a)","segunda":"2 Cor 3, 1b-6","evangelio":"Mc 2, 18-22"},"to_9":{"primera":"Dt 5, 12-15","salmo":"Sal 80, 3-4. 5-6ab. 6c-8a. 10-11b (R.: 2a)","segunda":"2 Cor 4, 6-11","evangelio":{"tieneTexto":true,"cita":"Mc 2, 23 — 3, 6","forma_breve":"Mc 2, 23-28"}},"to_10":{"primera":"Gen 3, 9-15","salmo":"Sal 129, 1b-2. 3-4. 5-7ab. 7cd-8 (R.: 7cd)","segunda":"2 Cor 4, 13 — 5, 1","evangelio":"Mc 3, 20-35"},"to_11":{"primera":"Ez 17, 22-24","salmo":"Sal 91, 2-3. 13-14. 15-16 (R.: cf. 2a)","segunda":"2 Cor 5, 6-10","evangelio":"Mc 4, 26-34"},"to_12":{"primera":"Job 38, 1. 8-11","salmo":"Sal 106, 23-24. 25-26. 28-29. 30-31 (R.: cf. 1)","segunda":"2 Cor 5, 14-17","evangelio":"Mc 4, 35-41"},"to_13":{"primera":"Sab 1, 13-15; 2, 23-24","salmo":"Sal 29, 2 y 4. 5-6. 11 y 12a y 13b (R.: 2a)","segunda":"2 Cor 8, 7. 9. 13-15","evangelio":{"tieneTexto":true,"cita":"Mc 5, 21-43","forma_breve":"Mc 5, 21-24. 35b-43"}},"to_14":{"primera":"Ez 2, 2-5","salmo":"Sal 122, 1b-2b. 2cdefg. 3-4 (R.: cf. 2)","segunda":"2 Cor 12, 7b-10","evangelio":"Mc 6, 1-6"},"to_15":{"primera":"Am 7, 12-15","salmo":"Sal 84, 9abc y 10. 11-12. 13-14 (R.: 8)","segunda":{"tieneTexto":true,"cita":"Ef 1, 3-14","forma_breve":"Ef 1, 3-10"},"evangelio":"Mc 6, 7-13"},"to_16":{"primera":"Jer 23, 1-6","salmo":"Sal 22, 1b-3a. 3b-4. 5. 6 (R.: 1b)","segunda":"Ef 2, 13-18","evangelio":"Mc 6, 30-34"},"to_17":{"primera":"2 Re 4, 42-44","salmo":"Sal 144, 10-11. 15-16. 17-18 (R.: cf. 16)","segunda":"Ef 4, 1-6","evangelio":"Jn 6, 1-15"},"to_18":{"primera":"Ex 16, 2-4. 12-15","salmo":"Sal 77, 3 y 4bc. 23-24. 25 y 54 (R.: 24b)","segunda":"Ef 4, 17. 20-24","evangelio":"Jn 6, 24-35"},"to_19":{"primera":"1 Re 19, 4-8","salmo":"Sal 33, 2-3. 4-5. 6-7. 8-9 (R.: 9a)","segunda":"Ef 4, 30 — 5, 2","evangelio":"Jn 6, 41-51"},"to_20":{"primera":"Prov 9, 1-6","salmo":"Sal 33, 2-3. 10-11. 12-13. 14-15 (R.: 9a)","segunda":"Ef 5, 15-20","evangelio":"Jn 6, 51-58"},"to_21":{"primera":"Jos 24, 1-2a. 15-17. 18b","salmo":"Sal 33, 2-3. 16-17. 18-19. 20-21. 22-23 (R.: 9a)","segunda":"Ef 5, 21-32","evangelio":"Jn 6, 60-69"},"to_22":{"primera":"Dt 4, 1-2. 6-8","salmo":"Sal 14, 2-3a. 3bc-4ab. 5 (R.: 1b)","segunda":"Sant 1, 16b-18. 21b-22. 27","evangelio":"Mc 7, 1-8. 14-15. 21-23"},"to_23":{"primera":"Is 35, 4-7a","salmo":"Sal 145, 6c-7. 8-9a. 9bc-10 (R.: 1b)","segunda":"Sant 2, 1-5","evangelio":"Mc 7, 31-37"},"to_24":{"primera":"Is 50, 5-9a","salmo":"Sal 114, 1-2. 3-4. 5-6. 8-9 (R.: 9)","segunda":"Sant 2, 14-18","evangelio":"Mc 8, 27-35"},"to_25":{"primera":"Sab 2, 12. 17-20","salmo":"Sal 53, 3-4. 5. 6 y 8 (R.: 6b)","segunda":"Sant 3, 16 — 4, 3","evangelio":"Mc 9, 30-37"},"to_26":{"primera":"Num 11, 25-29","salmo":"Sal 18, 8. 10. 12-13. 14 (R.: 9ab)","segunda":"Sant 5, 1-6","evangelio":"Mc 9, 38-43. 45. 47-48"},"to_27":{"primera":"Gen 2, 18-24","salmo":"Sal 127, 1bc-2. 3. 4-5. 6 (R.: cf. 5)","segunda":"Heb 2, 9-11","evangelio":{"tieneTexto":true,"cita":"Mc 10, 2-16","forma_breve":"Mc 10, 2-12"}},"to_28":{"primera":"Sab 7, 7-11","salmo":"Sal 89, 12-13. 14-15. 16-17 (R.: cf. 14)","segunda":"Heb 4, 12-13","evangelio":{"tieneTexto":true,"cita":"Mc 10, 17-30","forma_breve":"Mc 10, 17-27"}},"to_29":{"primera":"Is 53, 10-11","salmo":"Sal 32, 4-5. 18-19. 20 y 22 (R.: 22)","segunda":"Heb 4, 14-16","evangelio":{"tieneTexto":true,"cita":"Mc 10, 35-45","forma_breve":"Mc 10, 42-45"}},"to_30":{"primera":"Jer 31, 7-9","salmo":"Sal 125, 1b-2ab. 2cd-3. 4-5. 6 (R.: 3)","segunda":"Heb 5, 1-6","evangelio":"Mc 10, 46-52"},"to_31":{"primera":"Dt 6, 2-6","salmo":"Sal 17, 2-3a. 3bc-4. 47 y 51ab (R.: 2)","segunda":"Heb 7, 23-28","evangelio":"Mc 12, 28b-34"},"to_32":{"primera":"1 Re 17, 10-16","salmo":"Sal 145, 6c-7. 8-9a. 9bc-10 (R.: 1b)","segunda":"Heb 9, 24-28","evangelio":{"tieneTexto":true,"cita":"Mc 12, 38-44","forma_breve":"Mc 12, 41-44"}},"to_33":{"primera":"Dan 12, 1-3","salmo":"Sal 15, 5 y 8. 9-10. 11 (R.: 1b)","segunda":"Heb 10, 11-14. 18","evangelio":"Mc 13, 24-32"},"cristo_rey":{"primera":"Dan 7, 13-14","salmo":"Sal 92, 1ab. 1c-2. 5 (R.: 1a)","segunda":"Ap 1, 5-8","evangelio":"Jn 18, 33b-37"},"transfiguracion":{"primera":"Dan 7, 9-10. 13-14","salmo":"Sal 96, 1-2. 5-6. 9 (R.: 1a. 9b)","segunda":"2 Pe 1, 16-19","evangelio":"Mc 9, 2-10"},"presentacion":{"primera":"Mal 3, 1-4","salmo":"Sal 23, 7. 8. 9. 10 (R.: 10bc)","segunda":"Heb 2, 14-18","evangelio":{"tieneTexto":true,"cita":"Lc 2, 22-40","forma_breve":"Lc 2, 22-32"}},"cuaresma_1":{"primera":"Gen 9, 8-15","salmo":"Sal 24, 4-5a. 6-7cd. 8-9 (R.: cf. 10)","segunda":"1 Pe 3, 18-22","evangelio":"Mc 1, 12-15"},"cuaresma_2":{"primera":"Gen 22, 1-2. 9a. 10-13. 15-18","salmo":"Sal 115, 10 y 15. 16-17. 18-19 (R.: Sal 114, 9)","segunda":"Rom 8, 31b-34","evangelio":"Mc 9, 2-10"},"vigilia_pascual_lectura_1":{"primera":{"tieneTexto":true,"cita":"Gen 1, 1 — 2, 2","forma_breve":"Gen 1, 1. 26-31a"},"salmo":"Sal 103, 1-2a. 5-6. 10 y 12. 13-14. 24 y 35c (R.: cf. 30)"},"vigilia_pascual_lectura_2":{"primera":{"tieneTexto":true,"cita":"Gen 22, 1-18","forma_breve":"Gen 22, 1-2. 9a. 10-13. 15-18"},"salmo":"Sal 15, 5 y 8. 9-10. 11 (R.: 1)"},"vigilia_pascual_lectura_3":{"primera":"Ex 14, 15 — 15, 1a","salmo":"Ex 15, 1b-2. 3-4. 5-6. 17-18 (R.: 1b)"},"vigilia_pascual_lectura_4":{"primera":"Is 54, 5-14","salmo":"Sal 29, 2 y 4. 5-6. 11 y 12a y 13b (R.: 2a)"},"vigilia_pascual_lectura_5":{"primera":"Is 55, 1-11","salmo":"Is 12, 2-3. 4bcde. 5-6 (R.: 3)"},"vigilia_pascual_lectura_6":{"primera":"Bar 3, 9-15. 32 — 4, 4","salmo":"Sal 18, 8. 9. 10. 11 (R.: Jn 6, 68c)"},"vigilia_pascual_lectura_7":{"primera":"Ez 36, 16-17a. 18-28","salmo":"Sal 41, 3. 5cdef; 42, 3. 4 (R.: Sal 41, 2)"},"vigilia_pascual":{"segunda":"Rom 6, 3-11","salmo":"Sal 117, 1-2. 16-17. 22-23","evangelio":"Mc 16, 1-7"}},"C":{"adviento_1":{"primera":"Jer 33, 14-16","salmo":"Sal 24, 4-5a. 8-9. 10 y 14 (R.: 1b)","segunda":"1 Tes 3, 12 — 4, 2","evangelio":"Lc 21, 25-28. 34-36"},"adviento_2":{"primera":"Bar 5, 1-9","salmo":"Sal 125, 1b-2ab. 2cd-3. 4-5. 6 (R.: 3)","segunda":"Flp 1, 4-6. 8-11","evangelio":"Lc 3, 1-6"},"natividad_medianoche":{"primera":"Is 9, 1-6","salmo":"Sal 95, 1-2a. 2b-3. 11-12. 13 (R.: cf. Lc 2, 11)","segunda":"Tit 2, 11-14","evangelio":"Lc 2, 1-14"},"natividad_aurora":{"primera":"Is 62, 11-12","salmo":"Sal 96, 1 y 6. 11-12","segunda":"Tit 3, 4-7","evangelio":"Lc 2, 15-20"},"natividad_dia":{"primera":"Is 52, 7-10","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4. 5-6 (R.: 3cd)","segunda":"Heb 1, 1-6","evangelio":{"tieneTexto":true,"cita":"Jn 1, 1-18","forma_breve":"Jn 1, 1-5. 9-14"}},"sagrada_familia":{"primera":"1 Sam 1, 20-22. 24-28","salmo":"Sal 83, 2-3. 5-6. 9-10 (R.: cf. 5a)","segunda":"1 Jn 3, 1-2. 21-24","evangelio":"Lc 2, 41-52"},"navidad_post_2":{"primera":"Eclo 24, 1-2. 8-12","salmo":"Sal 147, 12-13. 14-15. 19-20 (R.: Jn 1, 14)","segunda":"Ef 1, 3-6. 15-18","evangelio":{"tieneTexto":true,"cita":"Jn 1, 1-18","forma_breve":"Jn 1, 1-5. 9-14"}},"bautismo":{"primera":"Is 40, 1-5. 9-11","salmo":"Sal 103, 1b-2. 3-4. 24-25. 27-28. 29-30 (R.: 1ab)","segunda":"Tit 2, 11-14; 3, 4-7","evangelio":"Lc 3, 15-16. 21-22"},"cuaresma_2":{"primera":"Gen 15, 5-12. 17-18","salmo":"Sal 26, 1bcde. 7-8. 9abcd. 13-14 (R.: 1a)","segunda":{"tieneTexto":true,"cita":"Flp 3, 17 — 4, 1","forma_breve":"Flp 3, 20 — 4,1"},"evangelio":"Lc 9, 28b-36"},"cuaresma_4":{"primera":"Jos 5, 9a. 10-12","salmo":"Sal 33, 2-3. 4-5. 6-7 (R.: 9a)","segunda":"2 Cor 5, 17-21","evangelio":"Lc 15, 1-3. 11-32"},"cuaresma_5":{"primera":"Is 43, 16- 21","salmo":"Sal 125, 1b-2ab. 2cd-3. 4-5. 6 (R.: 3)","segunda":"Flp 3, 8-14","evangelio":"Jn 8, 1-11"},"ramos":{"primera":"Is 50, 4-7","evangelio":"Lc 23, 1-49","salmo":"Sal 21, 8-9. 17-18a. 19-20. 23-24 (R.: 2ab)","segunda":"Flp 2, 6-11"},"jueves_santo":{"primera":"Ex 12, 1-8. 11-14","salmo":"Sal 115, 12-13. 15-16. 17-18 (R.: cf. 1 Cor 10, 16)","segunda":"1 Cor 11, 23-26","evangelio":"Jn 13, 1-15"},"viernes_santo":{"primera":"Is 52, 13 — 53, 12","salmo":"Sal 30, 2 y 6. 12-13. 15-16. 17 y 25 (R.: Lc 23, 46)","segunda":"Heb 4, 14-16; 5, 7-9","evangelio":"Jn 18, 1 — 19, 42"},"pascua_resurreccion":{"primera":"Hch 10, 34a. 37-43","salmo":"Sal 117, 1-2. 16-17. 22-23 (R.: 24)","segunda":"Col 3, 1-4","evangelio":"Jn 20, 1-9","evangelio_alt":"Lc 24, 13-35","segunda_alt":"1 Cor 5, 6b-8"},"pascua_2":{"primera":"Hch 5, 12-16","salmo":"Sal 117, 2-4. 22-24. 25-27a (R.: 1)","segunda":"Ap 1, 9-11a. 12-13. 17-19","evangelio":"Jn 20, 19-31"},"pascua_3":{"primera":"Hch 5, 27b-32. 40b-41","salmo":"Sal 29, 2 y 4. 5-6. 11 y 12a y 13b (R.: 2a)","segunda":"Ap 5, 11-14","evangelio":{"tieneTexto":true,"cita":"Jn 21, 1-19","forma_breve":"Jn 21, 1-14"}},"pascua_4":{"primera":"Hch 13, 14. 43-52","salmo":"Sal 99, 1b-2. 3. 5 (R.: 3c)","segunda":"Ap 7, 9. 14b-17","evangelio":"Jn 10, 27-30"},"pascua_5":{"primera":"Hch 14, 21b-27","salmo":"Sal 144, 8-9. 10-11. 12-13ab (R.: cf. 1bc)","segunda":"Ap 21, 1-5a","evangelio":"Jn 13, 31-33a. 34-35"},"pascua_6":{"primera":"Hch 15, 1-2. 22-29","salmo":"Sal 66, 2-3. 5. 6 y 8 (R.: 4)","segunda":"Ap 21, 10-14. 22-23","evangelio":"Jn 14, 23-29"},"ascension":{"primera":"Hch 1, 1-11","salmo":"Sal 46, 2-3. 6-7. 8-9 (R.: 6)","segunda":"Heb 9, 24-28; 10, 19-23","evangelio":"Lc 24, 46-53"},"pascua_7":{"primera":"Hch 7, 55-60","salmo":"Sal 96, 1 y 2b. 6 y 7c. 9 (R.: 1a y 9b)","segunda":"Ap 22, 12-14. 16-17. 20","evangelio":"Jn 17, 20-26"},"pentecostes_vigilia":{"primera":"Gen 11, 1-9","salmo":"Sal 32, 10-11. 12-13. 14-15 (R.: 12b)","segunda":"Rom 8, 22-27","evangelio":"Jn 7, 37-39"},"pentecostes":{"primera":"Hch 2, 1-11","salmo":"Sal 103, 1ab y 24ac. 29bc-30. 31 y 34 (R.: cf. 30)","segunda":"Rom 8, 8-17","evangelio":"Jn 14, 15-16. 23b-26"},"trinidad":{"primera":"Prov 8, 22-31","salmo":"Sal 8, 4-5. 6-7. 8-9 (R.: 2ab)","segunda":"Rom 5, 1-5","evangelio":"Jn 16, 12-15"},"corpus":{"primera":"Gen 14, 18-20","salmo":"Sal 109, 1bcde. 2. 3. 4 (R.: 4bc)","segunda":"1 Cor 11, 23-26","evangelio":"Lc 9, 11b-17"},"sagrado_corazon":{"primera":"Ez 34, 11-16","salmo":"Sal 22, 1b-3a. 3b-4. 5. 6 (R.: 1b)","segunda":"Rom 5, 5b-11","evangelio":"Lc 15, 3-7"},"to_2":{"primera":"Is 62, 1-5","salmo":"Sal 95, 1-2a. 2b-3. 7-8a. 9-10a y c (R.: cf. 3)","segunda":"1 Cor 12, 4-11","evangelio":"Jn 2, 1-11"},"to_3":{"primera":"Neh 8, 2-4a. 5-6. 8-10","salmo":"Sal 18, 8. 9. 10. 15 (R.: cf. Jn 6, 63c)","segunda":{"tieneTexto":true,"cita":"1 Cor 12, 12-30","forma_breve":"1 Cor 12, 12-14. 27"},"evangelio":"Lc 1, 1-4; 4, 14-21"},"to_4":{"primera":"Jer 1, 4-5. 17-19","salmo":"Sal 70, 1-2. 3-4a. 5-6ab. 15ab y 17 (R.: cf. 15ab)","segunda":{"tieneTexto":true,"cita":"1 Cor 12, 31 — 13, 13","forma_breve":"1 Cor 13, 4-13"},"evangelio":"Lc 4, 21-30"},"to_5":{"primera":"Is 6, 1-2a. 3-8","salmo":"Sal 137, 1bcd-2a. 2bcd-3. 4-5. 7c-8 (R.: 1d)","segunda":{"tieneTexto":true,"cita":"1 Cor 15, 1-11","forma_breve":"1 Cor 15, 3-8. 11"},"evangelio":"Lc 5, 1-11"},"to_7":{"primera":"1 Sam 26, 2. 7-9. 12-13. 22-23","salmo":"Sal 102, 1bc-2. 3-4. 8 y 10. 12-13 (R.: 8a)","segunda":"1 Cor 15, 45-49","evangelio":"Lc 6, 27-38"},"to_8":{"primera":"Eclo 27, 4-7","salmo":"Sal 91, 2-3. 13-14. 15-16 (R.: cf. 2a)","segunda":"1 Cor 15, 54-58","evangelio":"Lc 6, 39-45"},"to_9":{"primera":"1 Re 8, 41-43","salmo":"Sal 116, 1. 2 (R.: Mc 16, 15)","segunda":"Gal 1, 1-2. 6-10","evangelio":"Lc 7, 1-10"},"to_10":{"primera":"1 Re 17, 17-24","salmo":"Sal 29, 2 y 4. 5-6. 11 y 12a y 13b (R.: 2a)","segunda":"Gal 1, 11-19","evangelio":"Lc 7, 11-17"},"to_11":{"primera":"2 Sam 12, 7-10. 13","salmo":"Sal 31, 1b-2. 5. 7. 11 (R.: cf. 5d)","segunda":"Gal 2, 16. 19-21","evangelio":{"tieneTexto":true,"cita":"Lc 7, 36 — 8, 3","forma_breve":"Lc 7, 36-50"}},"to_12":{"primera":"Zac 12, 10-11; 13, 1","salmo":"Sal 62, 2. 3-4. 5-6. 8-9 (R.: cf. 2b)","segunda":"Gal 3, 26-29","evangelio":"Lc 9, 18-24"},"to_13":{"primera":"1 Re 19, 16b. 19-21","salmo":"Sal 15, 1b-2a y 5. 7-8. 9-10. 11 (R.: cf. 5a)","segunda":"Gal 5, 1. 13-18","evangelio":"Lc 9, 51-62"},"to_14":{"primera":"Is 66, 10-14c","salmo":"Sal 65, 1b-3a. 4-5. 6-7a. 16 y 20 (R.: 1b)","segunda":"Gal 6, 14-18","evangelio":{"tieneTexto":true,"cita":"Lc 10, 1-12. 17-20","forma_breve":"Lc 10, 1-9"}},"to_15":{"primera":"Dt 30, 10-14","salmo":"Sal 18, 8. 9. 10. 11 (R.: 9ab)","segunda":"Col 1, 15-20","evangelio":"Lc 10, 25-37"},"to_16":{"primera":"Gen 18, 1-10a","salmo":"Sal 14, 2-3a. 3bc-4ab. 5 (R.: 1b)","segunda":"Col 1, 24-28","evangelio":"Lc 10, 38-42"},"to_17":{"primera":"Gen 18, 20-32","salmo":"Sal 137, 1bcd-2a. 2bcd-3. 6-7ab. 7c-8 (R.: 3a)","segunda":"Col 2, 12-14","evangelio":"Lc 11, 1-13"},"to_18":{"primera":"Ecl 1, 2; 2, 21-23","salmo":"Sal 89, 3-4. 5-6. 12-13. 14 y 17 (R.: 1bc)","segunda":"Col 3, 1-5. 9-11","evangelio":"Lc 12, 13-21"},"to_19":{"primera":"Sab 18, 6-9","salmo":"Sal 32, 1 y 12. 18-19. 20 y 22 (R.: cf. 12)","segunda":{"tieneTexto":true,"cita":"Heb 11, 1-2. 8-19","forma_breve":"Heb 11, 1-2. 8-12"},"evangelio":{"tieneTexto":true,"cita":"Lc 12, 32-48","forma_breve":"Lc 12, 35-40"}},"to_20":{"primera":"Jer 38, 4-6. 8-10","salmo":"Sal 39, 2. 3. 4. 18 (R.: 14b)","segunda":"Heb 12, 1-4","evangelio":"Lc 12, 49-53"},"to_21":{"primera":"Is 66, 18-21","salmo":"Sal 116, 1. 2 (R.: Mc 16, 15)","segunda":"Heb 12, 5-7. 11-13","evangelio":"Lc 13, 22-30"},"to_22":{"primera":"Eclo 3, 17. 20. 28-29","salmo":"Sal 67, 4-5ac. 6-7ab. 10-11 (R.: cf. 11bc)","segunda":"Heb 12, 18-19. 22-24a","evangelio":"Lc 14, 1. 7-14"},"to_23":{"primera":"Sab 9, 13-18","salmo":"Sal 89, 3-4. 5-6. 12-13. 14 y 17 (R.: 1bc)","segunda":"Flm 9b-10. 12-17","evangelio":"Lc 14, 25-33"},"to_24":{"primera":"Ex 32, 7-11. 13-14","salmo":"Sal 50, 3-4. 12-13. 17 y 19 (R.: Lc 15, 18)","segunda":"1 Tim 1, 12-17","evangelio":{"tieneTexto":true,"cita":"Lc 15, 1-32","forma_breve":"Lc 15, 1- 10"}},"to_25":{"primera":"Am 8, 4-7","salmo":"Sal 112, 1b-2. 4-6. 7-8 (R.: cf. 1b y 7b)","segunda":"1 Tim 2, 1-8","evangelio":{"tieneTexto":true,"cita":"Lc 16, 1-13","forma_breve":"Lc 16, 10-13"}},"to_26":{"primera":"Am 6, 1a. 4-7","salmo":"Sal 145, 6c-7. 8-9a. 9bc-10 (R.: 1b)","segunda":"1 Tim 6, 11-16","evangelio":"Lc 16, 19-31"},"to_27":{"primera":"Hab 1, 2-3; 2, 2-4","salmo":"Sal 94, 1-2. 6-7c. 7d-9 (R.: cf. 7d-8a)","segunda":"2 Tim 1, 6-8. 13-14","evangelio":"Lc 17, 5-10"},"to_28":{"primera":"2 Re 5, 14-17","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4 (R.: cf. 2)","segunda":"2 Tim 2, 8-13","evangelio":"Lc 17, 11-19"},"to_29":{"primera":"Ex 17, 8-13","salmo":"Sal 120, 1bc-2. 3-4. 5-6. 7-8 (R.: cf. 2)","segunda":"2 Tim 3, 14 — 4, 2","evangelio":"Lc 18, 1-8"},"to_30":{"primera":"Eclo 35, 12-14. 16-19a","salmo":"Sal 33, 2-3. 17-18. 19 y 23 (R.: 7ab)","segunda":"2 Tim 4, 6-8. 16-18","evangelio":"Lc 18, 9-14"},"to_31":{"primera":"Sab 11, 22 — 12, 2","salmo":"Sal 144, 1bc-2. 8-9. 10-11. 13cd-14 (R.: cf. 1bc)","segunda":"2 Tes 1, 11 — 2, 2","evangelio":"Lc 19, 1-10"},"to_32":{"primera":"2 Mac 7, 1-2. 9-14","salmo":"Sal 16, 1bcde. 5-6. 8 y 15 (R.: 15b)","segunda":"2 Tes 2, 16 — 3, 5","evangelio":{"tieneTexto":true,"cita":"Lc 20, 27-38","forma_breve":"Lc 20, 27. 34-38"}},"to_33":{"primera":"Mal 3, 19-20a","salmo":"Sal 97, 5-6. 7-8. 9ab. 9cd (R.: cf. 9)","segunda":"2 Tes 3, 7-12","evangelio":"Lc 21, 5-19"},"maria_madre_dios":{"primera":"Num 6, 22-27","salmo":"Sal 66, 2-3. 5. 6 y 8 (R.: 2a)","segunda":"Gal 4, 4-7","evangelio":"Lc 2, 16-21"},"epifania":{"primera":"Is 60, 1-6","salmo":"Sal 71, 1bc-2. 7-8. 10-11. 12-13 (R.: cf. 11)","segunda":"Ef 3, 2-3a. 5-6","evangelio":"Mt 2, 1-12"},"natividad_vigilia":{"primera":"Is 62, 1-5","salmo":"Sal 88, 4-5. 16-17. 27 y 29 (R.: 2a)","segunda":"Hch 13, 16-17. 22-25","evangelio":{"tieneTexto":true,"cita":"Mt 1, 1-25","forma_breve":"Mt 1, 18-25"}},"presentacion":{"primera":"Mal 3, 1-4","salmo":"Sal 23, 7. 8. 9. 10 (R.: 10bc)","segunda":"Heb 2, 14-18","evangelio":{"tieneTexto":true,"cita":"Lc 2, 22-40","forma_breve":"Lc 2, 22-32"}},"to_6":{"primera":"Jer 17, 5-8","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: Sal 39, 5ab)","segunda":"1 Cor 15, 12. 16-20","evangelio":"Lc 6, 17. 20-26"},"cuaresma_1":{"primera":"Dt 26, 4-10","salmo":"Sal 90, 1-2. 10-11. 12-13. 14-15 (R.: cf. 15b)","segunda":"Rom 10, 8-13","evangelio":"Lc 4, 1-13"},"cuaresma_3":{"primera":"Ex 3, 1-8a. 13-15","salmo":"Sal 102, 1b-2. 3-4. 6-7. 8 y 11 (R.: 8a)","segunda":"1 Cor 10, 1-6. 10-12","evangelio":"Lc 13, 1-9"},"cristo_rey":{"primera":"2 Sam 5, 1-3","salmo":"Sal 121, 1bc-2. 4-5 (R.: cf. 1bc)","segunda":"Col 1, 12-20","evangelio":"Lc 23, 35-43"},"transfiguracion":{"primera":"Dan 7, 9-10. 13-14","salmo":"Sal 96, 1-2. 5-6. 9 (R.: 1a. 9b)","segunda":"2 Pe 1, 16-19","evangelio":"Lc 9, 28b-36"},"adviento_4":{"primera":"Miq 5, 1-4a","salmo":"Sal 79, 2ac y 3b. 15-16. 18-19 (R.: 4)","segunda":"Heb 10, 5-10","evangelio":"Lc 1, 39-45"},"adviento_3":{"primera":"Sof 3, 14-18a","salmo":"Is 12, 2-3. 4bcde. 5-6 (R.: 6)","segunda":"Flp 4, 4-7","evangelio":"Lc 3, 10-18"},"vigilia_pascual_lectura_1":{"primera":{"tieneTexto":true,"cita":"Gen 1, 1 — 2, 2","forma_breve":"Gen 1, 1. 26-31a"},"salmo":"Sal 103, 1-2a. 5-6. 10 y 12. 13-14. 24 y 35c (R.: cf. 30)"},"vigilia_pascual_lectura_2":{"primera":{"tieneTexto":true,"cita":"Gen 22, 1-18","forma_breve":"Gen 22, 1-2. 9a. 10-13. 15-18"},"salmo":"Sal 15, 5 y 8. 9-10. 11 (R.: 1)"},"vigilia_pascual_lectura_3":{"primera":"Ex 14, 15 — 15, 1a","salmo":"Ex 15, 1b-2. 3-4. 5-6. 17-18 (R.: 1b)"},"vigilia_pascual_lectura_4":{"primera":"Is 54, 5-14","salmo":"Sal 29, 2 y 4. 5-6. 11 y 12a y 13b (R.: 2a)"},"vigilia_pascual_lectura_5":{"primera":"Is 55, 1-11","salmo":"Is 12, 2-3. 4bcde. 5-6 (R.: 3)"},"vigilia_pascual_lectura_6":{"primera":"Bar 3, 9-15. 32 — 4, 4","salmo":"Sal 18, 8. 9. 10. 11 (R.: Jn 6, 68c)"},"vigilia_pascual_lectura_7":{"primera":"Ez 36, 16-17a. 18-28","salmo":"Sal 41, 3. 5cdef; 42, 3. 4 (R.: Sal 41, 2)"},"vigilia_pascual":{"segunda":"Rom 6, 3-11","salmo":"Sal 117, 1-2. 16-17. 22-23","evangelio":"Lc 24, 1-12"}}},"ferial_to":{"I":{"1_lunes":{"primera":"Heb 1, 1-6","salmo":"Sal 96, 1 y 2b. 6 y 7c. 9 (R.: cf. 7c)"},"1_martes":{"primera":"Heb 2, 5-12","salmo":"Sal 8, 2ab y 5. 6-7. 8-9 (R.: cf. 7a)"},"1_miercoles":{"primera":"Heb 2, 14-18","salmo":"Sal 104, 1-2. 3-4. 6-7. 8-9 (R.: 8a)"},"1_jueves":{"primera":"Heb 3, 7-14","salmo":"Sal 94, 6-7c. 7d-9. 10-11 (R.: cf. 7d-8a)"},"1_viernes":{"primera":"Heb 4, 1-5. 11","salmo":"Sal 77, 3 y 4bc. 6c-7. 8 (R.: cf. 7b)"},"1_sabado":{"primera":"Heb 4, 12-16","salmo":"Sal 18, 8. 9. 10. 15 (R.: cf. Jn 6, 63c)"},"2_lunes":{"primera":"Heb 5, 1-10","salmo":"Sal 109, 1bcde. 2. 3. 4 (R.: 4bc)"},"2_martes":{"primera":"Heb 6, 10-20","salmo":"Sal 110, 1b-2. 4-5. 9 y 10c (R.: cf. 5b)"},"2_miercoles":{"primera":"Heb 7, 1-3. 15-17","salmo":"Sal 109, 1bcde. 2. 3. 4 (R.: 4bc)"},"2_jueves":{"primera":"Heb 7, 25 — 8, 6","salmo":"Sal 39, 7-8a. 8b-9. 10. 17 (R.: cf. 8a y 9a)"},"2_viernes":{"primera":"Heb 8, 6-13","salmo":"Sal 84, 8 y 10. 11-12. 13-14 (R.: 11a)"},"2_sabado":{"primera":"Heb 9, 2-3. 11-14","salmo":"Sal 46, 2-3. 6-7. 8-9 (R.: 6)"},"3_lunes":{"primera":"Heb 9, 15. 24-28","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4. 5-6 (R.: 1bc)"},"3_martes":{"primera":"Heb 10, 1-10","salmo":"Sal 39, 2 y 4ab. 7-8a. 10. 11 (R.: cf. 8a y 9a)"},"3_miercoles":{"primera":"Heb 10, 11-18","salmo":"Sal 109, 1bcde. 2. 3. 4 (R.: 4bc)"},"3_jueves":{"primera":"Heb 10, 19-25","salmo":"Sal 23, 1b-2. 3-4ab. 5-6 (R.: cf. 6)"},"3_viernes":{"primera":"Heb 10, 32-39","salmo":"Sal 36, 3-4. 5-6. 23-24. 39-40 (R.: 39a)"},"3_sabado":{"primera":"Heb 11, 1-2. 8-19","salmo":"Lc 1, 69-70. 71-72. 73-75 (R.: cf. 68)"},"4_lunes":{"primera":"Heb 11, 32-40","salmo":"Sal 30, 20. 21. 22. 23. 24 (R.: 25)"},"4_martes":{"primera":"Heb 12, 1-4","salmo":"Sal 21, 26b-27. 28 y 30. 31-32 (R.: cf. 27b)"},"4_miercoles":{"primera":"Heb 12, 4-7. 11-15","salmo":"Sal 102, 1bc-2. 13-14. 17-18a (R.: cf. 17)"},"4_jueves":{"primera":"Heb 12, 18-19. 21-24","salmo":"Sal 47, 2. 3-4. 9. 10-11 (R.: 10)"},"4_viernes":{"primera":"Heb 13, 1-8","salmo":"Sal 26, 1bcde. 3. 5. 8c-9abcd (R.: 1b)"},"4_sabado":{"primera":"Heb 13, 15-17. 20-21","salmo":"Sal 22, 1b-3a. 3b-4. 5. 6 (R.: 1b)"},"5_lunes":{"primera":"Gen 1, 1-19","salmo":"Sal 103, 1-2a. 5-6. 10 y 12. 24 y 35c (R.: 31b)"},"5_martes":{"primera":"Gen 1, 20 — 2, 4a","salmo":"Sal 8, 4-5. 6-7. 8-9 (R.: 2ab)"},"5_miercoles":{"primera":"Gen 2, 4b-9. 15-17","salmo":"Sal 103, 1-2a. 27-28. 29bc-30 (R.: 1a)"},"5_jueves":{"primera":"Gen 2, 18-25","salmo":"Sal 127, 1bc-2. 3. 4-5 (R.: cf. 1b)"},"5_viernes":{"primera":"Gen 3, 1-8","salmo":"Sal 31, 1b-2. 5. 6. 7 (R.: 1a)"},"5_sabado":{"primera":"Gen 3, 9-24","salmo":"Sal 89, 2. 3-4. 5-6. 12-13 (R.: 1bc)"},"6_lunes":{"primera":"Gen 4, 1-15. 25","salmo":"Sal 49, 1bc y 8. 16bc-17. 20-21 (R.: 14a)"},"6_martes":{"primera":"Gen 6, 5-8; 7, 1-5. 10","salmo":"Sal 28, 1b y 2. 3ac-4. 3b y 9c-10 (R.: 11b)"},"6_miercoles":{"primera":"Gen 8, 6-13. 20-22","salmo":"Sal 115, 12-13. 14-15. 18-19 (R.: 17a)"},"6_jueves":{"primera":"Gen 9, 1-13","salmo":"Sal 101, 16-18. 19-21. 29 y 22-23 (R.: 20b)"},"6_viernes":{"primera":"Gen 11, 1-9","salmo":"Sal 32, 10-11. 12-13. 14-15 (R.: 12b)"},"6_sabado":{"primera":"Heb 11, 1-7","salmo":"Sal 144, 2-3. 4-5. 10-11 (R.: cf. 1b)"},"7_martes":{"primera":"Eclo 2, 1-11","salmo":"Sal 36, 3-4. 18-19. 27-28. 39-40 (R.: cf. 5)"},"7_miercoles":{"primera":"Eclo 4, 11-19","salmo":"Sal 118, 165. 168. 171. 172. 174. 175 (R.: 165a)"},"7_jueves":{"primera":"Eclo 5, 1-8","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: Sal 39, 5ab)"},"7_viernes":{"primera":"Eclo 6, 5-17","salmo":"Sal 118, 12. 16. 18. 27. 34. 35 (R.: 35a)"},"7_sabado":{"primera":"Eclo 17, 1-15","salmo":"Sal 102, 13-14. 15-16. 17-18a (R.: cf. 17)"},"8_lunes":{"primera":"Eclo 17, 24-29","salmo":"Sal 31, 1b-2. 5. 6. 7 (R.: 11a)"},"8_martes":{"primera":"Eclo 35, 1-12","salmo":"Sal 49, 5-6. 7-8. 14 y 23 (R.: 23cd)"},"8_miercoles":{"primera":"Eclo 36, 1. 4-5a. 10-17","salmo":"Sal 78, 8. 9. 11 y 13 (R.: Eclo 36, 1c)"},"8_jueves":{"primera":"Eclo 42, 15-25","salmo":"Sal 32, 2-3. 4-5. 6-7. 8-9 (R.: 6a)"},"8_viernes":{"primera":"Eclo 44, 1. 9-13","salmo":"Sal 149, 1bc-2. 3-4. 5-6a y 9b (R.: 4a)"},"8_sabado":{"primera":"Eclo 51, 12-20","salmo":"Sal 18, 8. 9. 10. 11 (R.: 9ab)"},"9_lunes":{"primera":"Tob 1, 3; 2, 1b-8","salmo":"Sal 111, 1b-2. 3-4. 5-6 (R.: 1b)"},"9_martes":{"primera":"Tob 2, 9b-14","salmo":"Sal 111, 1b-2. 7-8. 9 (R.: cf. 7b)"},"9_miercoles":{"primera":"Tob 3, 1-11a. 16-17a","salmo":"Sal 24, 2-3. 4-5a. 6 y 7cd. 8-9 (R.: 1b)"},"9_jueves":{"primera":"Tob 6, 10-11; 7, 1. 8-17; 8, 4-9a","salmo":"Sal 127, 1bc-2. 3. 4-5 (R.: cf. 1b)"},"9_viernes":{"primera":"Tob 11, 5-18","salmo":"Sal 145, 1b-2. 6c-7. 8-9a. 9bc-10 (R.: 1b)"},"9_sabado":{"primera":"Tob 12, 1. 5-15. 20","salmo":"Tob 13, 2. 7. 8abc. 8defg (R.: 1b)"},"10_lunes":{"primera":"2 Cor 1, 1-7","salmo":"Sal 33, 2-3. 4-5. 6-7. 8-9 (R.: 9a)"},"10_martes":{"primera":"2 Cor 1, 18-22","salmo":"Sal 118, 129. 130. 131. 132. 133. 135 (R.: 135a)"},"10_miercoles":{"primera":"2 Cor 3, 4-11","salmo":"Sal 98, 5. 6. 7. 8. 9 (R.: cf. 9c)"},"10_jueves":{"primera":"2 Cor 3, 15 — 4, 1. 3-6","salmo":"Sal 84, 9abc y 10. 11-12. 13-14 (R.: cf. 10b)"},"10_viernes":{"primera":"2 Cor 4, 7-15","salmo":"Sal 115, 10-11. 15-16. 17-18 (R.: 17a)"},"10_sabado":{"primera":"2 Cor 5, 14-21","salmo":"Sal 102, 1b-2. 3-4. 8-9. 11-12 (R.: 8a)"},"11_lunes":{"primera":"2 Cor 6, 1-10","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4 (R.: 2a)"},"11_martes":{"primera":"2 Cor 8, 1-9","salmo":"Sal 145, 1b-2. 5-6b. 6c-7. 8-9a (R.: 1b)"},"11_miercoles":{"primera":"2 Cor 9, 6-11","salmo":"Sal 111, 1b-2. 3-4. 9 (R.: 1b)"},"11_jueves":{"primera":"2 Cor 11, 1-11","salmo":"Sal 110, 1b-2. 3-4. 7-8 (R.: cf. 7a)"},"11_viernes":{"primera":"2 Cor 11, 18. 21b-30","salmo":"Sal 33, 2-3. 4-5. 6-7 (R.: cf. 18b)"},"11_sabado":{"primera":"2 Cor 12, 1-10","salmo":"Sal 33, 8-9. 10-11. 12-13 (R.: 9a)"},"12_lunes":{"primera":"Gen 12, 1-9","salmo":"Sal 32, 12-13. 18-19. 20 y 22 (R.: cf. 12)"},"12_martes":{"primera":"Gen 13, 2. 5-18","salmo":"Sal 14, 2-3a. 3bc-4ab. 5 (R.: 1b)"},"12_miercoles":{"primera":"Gen 15, 1-12. 17-18","salmo":"Sal 104, 1-2. 3-4. 6-7. 8-9 (R.: 8a)"},"12_jueves":{"primera":{"tieneTexto":true,"cita":"Gen 16, 1-12. 15-16","forma_breve":"Gen 16, 6b-12. 15-16"},"salmo":"Sal 105, 1b-2. 3-4a. 4b-5 (R.: 1b)"},"12_viernes":{"primera":"Gen 17, 1. 9-10. 15-22","salmo":"Sal 127, 1bc-2. 3. 4-5 (R.: 4)"},"12_sabado":{"primera":"Gen 18, 1-15","salmo":"Lc 1, 46b-47. 48-49. 50 y 53. 54-55 (R.: cf. 54b)"},"13_lunes":{"primera":"Gen 18, 16-33","salmo":"Sal 102, 1b-2. 3-4. 8-9. 10-11 (R.: 8a)"},"13_martes":{"primera":"Gen 19, 15-29","salmo":"Sal 25, 2-3. 9-10. 11-12 (R.: 3a)"},"13_miercoles":{"primera":"Gén 21, 5. 8-20","salmo":"Sal 33, 7-8. 10-11. 12-13 (R.: 7ab)"},"13_jueves":{"primera":"Gen 22, 1-19","salmo":"Sal 114, 1-2. 3-4. 5-6. 8-9 (R.: 9)"},"13_viernes":{"primera":"Gen 23, 1-4. 19; 24, 1-8. 62-67","salmo":"Sal 105, 1b-2. 3-4b. 4c-5 (R.: 1b)"},"13_sabado":{"primera":"Gen 27, 1-5. 15-29","salmo":"Sal 134, 1b-2. 3-4. 5-6 (R.: 3a)"},"14_lunes":{"primera":"Gen 28, 10-22a","salmo":"Sal 90, 1-2. 3-4. 14-15ab (R.: cf. 2b)"},"14_martes":{"primera":"Gen 32, 23-33","salmo":"Sal 16, 1bcde. 2-3. 6-7. 8 y 15 (R.: 15a)"},"14_miercoles":{"primera":"Gen 41, 55-57; 42, 5-7a. 17-24a","salmo":"Sal 32, 2-3. 10-11. 18-19 (R.: 22)"},"14_jueves":{"primera":"Gén 44, 18-21. 23b-29; 45, 1-5","salmo":"Sal 104, 16-17. 18-19. 20-21 (R.: 5a)"},"14_viernes":{"primera":"Gen 46, 1-7. 28-30","salmo":"Sal 36, 3-4. 18-19. 27-28. 39-40 (R.: 39a)"},"14_sabado":{"primera":"Gen 49, 29-32; 50, 15-26a","salmo":"Sal 104, 1-2. 3-4. 6-7 (R.: cf. Sal 68, 33)"},"15_lunes":{"primera":"Ex 1, 8-14. 22","salmo":"Sal 123, 1b-3. 4-6. 7-8 (R.: 8a)"},"15_martes":{"primera":"Ex 2, 1-15a","salmo":"Sal 68, 3. 14. 30-31. 33-34 (R.: cf. 33)"},"15_miercoles":{"primera":"Ex 3, 1-6. 9-12","salmo":"Sal 102, 1b-2. 3-4. 6-7 (R.: 8a)"},"15_jueves":{"primera":"Ex 3, 13-20","salmo":"Sal 104, 1 y 5. 8-9. 24-25. 26-27 (R.: 8a)"},"15_viernes":{"primera":"Ex 11, 10 — 12, 14","salmo":"Sal 115, 12-13. 15-16. 17-18 (R.: 13)"},"15_sabado":{"primera":"Ex 12, 37-42","salmo":"Sal 135, 1a. 23a. 24a. 10a. 11a. 12a. 13a. 14a. 15a (R.: 1b)"},"16_lunes":{"primera":"Ex 14, 5-18","salmo":"Ex 15, 1b-2. 3-4. 5-6 (R.: 1b)"},"16_martes":{"primera":"Ex 14, 21 — 15, 1","salmo":"Ex 15, 8-9. 10 y 12. 17 (R.: 1b)"},"16_miercoles":{"primera":"Ex 16, 1-5. 9-15","salmo":"Sal 77, 18-19. 23-24. 25-26. 27-28 (R.: 24b)"},"16_jueves":{"primera":"Ex 19, 1-2. 9-11. 16-20b","salmo":"Dan 3, 52a y c. 53a. 54a. 55a. 56a (R.: 52b)"},"16_viernes":{"primera":"Éx 20, 1-17","salmo":"Sal 18, 8. 9. 10. 11 (R.: Jn 6, 68c)"},"16_sabado":{"primera":"Ex 24, 3-8","salmo":"Sal 49, 1b-2. 5-6. 14-15 (R.: 14a)"},"17_lunes":{"primera":"Ex 32, 15-24. 30-34","salmo":"Sal 105, 19-20. 21-22. 23 (R.: 1b)"},"17_martes":{"primera":"Ex 33, 7-11; 34, 5b-9. 28","salmo":"Sal 102, 6-7. 8-9. 10-11. 12-13 (R.: 8a)"},"17_miercoles":{"primera":"Ex 34, 29-35","salmo":"Sal 98, 5. 6. 7. 9 (R.: cf. 9c)"},"17_jueves":{"primera":"Ex 40, 16-21. 34-38","salmo":"Sal 83, 3. 4. 5-6a y 8a. 11 (R.: 2)"},"17_viernes":{"primera":"Lev 23, 1. 4-11. 15-16. 27. 34b-37","salmo":"Sal 80, 3-4. 5-6ab. 10-11ab (R.: 2a)"},"17_sabado":{"primera":"Lev 25, 1. 8-17","salmo":"Sal 66, 2-3. 5. 7-8 (R.: 4)"},"18_lunes":{"primera":"Num 11, 4b-15","salmo":"Sal 80, 12-13. 14-15. 16-17 (R.: 2a)"},"18_martes":{"primera":"Num 12, 1-13","salmo":"Sal 50, 3-4. 5-6b. 6c -7. 12-13 (R.: cf. 3a)"},"18_miercoles":{"primera":"Num 13, 1-2. 25 — 14, 1. 26-29. 34-35","salmo":"Sal 105, 6-7ab. 13-14. 21-22. 23 (R.: 4ab)"},"18_jueves":{"primera":"Num 20, 1-13","salmo":"Sal 94, 1-2. 6-7c. 7d-9 (R.: cf. 7d-8a)"},"18_viernes":{"primera":"Dt 4, 32-40","salmo":"Sal 76, 12-13. 14-15. 16 y 21 (R.: 12a)"},"18_sabado":{"primera":"Dt 6, 4-13","salmo":"Sal 17, 2-3a. 3bc-4. 47 y 51ab (R.: 2)"},"19_martes":{"primera":"Dt 31, 1-8","salmo":"Dt 32, 3-4a. 7. 8. 9 y 12 (R.: 9a)"},"19_miercoles":{"primera":"Dt 34, 1-12","salmo":"Sal 65, 1b-3a. 5 y 16-17 (R.: cf. 20a y 9a)"},"19_jueves":{"primera":"Jos 3, 7-10a. 11. 13-17","salmo":"Sal 113 A, 1-2. 3-4. 5-6"},"19_viernes":{"primera":"Jos 24, 1-13","salmo":"Sal 135, 1a. 2a. 3a. 16a. 17a. 18a. 21a. 22a y 24a (R.: 1b)"},"19_sabado":{"primera":"Jos 24, 14-29","salmo":"Sal 15, 1b-2a y 5. 7-8. 11 (R.: cf. 5a)"},"20_lunes":{"primera":"Jue 2, 11-19","salmo":"Sal 105, 34-35. 36-37. 39-40. 43ab y 44 (R.: cf. 4ab)"},"20_martes":{"primera":"Jue 6, 11-24a","salmo":"Sal 84, 9. 11-12. 13-14 (R.: 9bc)"},"20_miercoles":{"primera":"Jue 9, 6-15","salmo":"Sal 20, 2-3. 4-5. 6-7 (R.: 2a)"},"20_jueves":{"primera":"Jue 11, 29-39a","salmo":"Sal 39, 5. 7-8a. 8b-9. 10 (R.: cf. 8a y 9a)"},"20_viernes":{"primera":"Rut 1, 1. 3-6. 14b-16. 22","salmo":"Sal 145, 5-6. 7. 8-9a. 9bc-10 (R.: 1b)"},"20_sabado":{"primera":"Rut 2, 1-3. 8-11; 4, 13-17","salmo":"Sal 127, 1bc-2. 3. 4-5 (R.: 4)"},"21_lunes":{"primera":"1 Tes 1, 1-5. 8b-10","salmo":"Sal 149, 1bc-2. 3-4. 5-6a y 9b (R.: 4a)"},"21_martes":{"primera":"1 Tes 2, 1-8","salmo":"Sal 138, 1b-3. 4-6 (R.: 1b)"},"21_miercoles":{"primera":"1 Tes 2, 9-13","salmo":"Sal 138, 7-8. 9-10. 11-12ab (R.: 1b)"},"21_jueves":{"primera":"1 Tes 3, 7-13","salmo":"Sal 89, 3-4. 12-13. 14 y 17 (R.: cf. 14)"},"21_viernes":{"primera":"1 Tes 4, 1-8","salmo":"Sal 96, 1 y 2b. 5-6. 10. 11-12 (R.: 12a)"},"21_sabado":{"primera":"1 Tes 4, 9-11","salmo":"Sal 97, 1bcde. 7-8. 9 (R.: cf. 9)"},"22_lunes":{"primera":"1 Tes 4, 13-18","salmo":"Sal 95, 1 y 3. 4-5. 11-12. 13 (R.: cf. 13b)"},"22_martes":{"primera":"1 Tes 5, 1-6. 9-11","salmo":"Sal 26, 1bcde. 4. 13-14 (R.: 13)"},"22_miercoles":{"primera":"Col 1, 1-8","salmo":"Sal 51, 10. 11 (R.: cf. 10cd)"},"22_jueves":{"primera":"Col 1, 9-14","salmo":"Sal 97, 2-3ab. 3cd-4. 5-6 (R.: 2a)"},"22_viernes":{"primera":"Col 1, 15-20","salmo":"Sal 99, 1-2. 3. 4. 5 (R.: cf. 2b)"},"22_sabado":{"primera":"Col 1, 21-23","salmo":"Sal 53, 3-4. 6 y 8 (R.: 6a)"},"23_lunes":{"primera":"Col 1, 24 — 2, 3","salmo":"Sal 61, 6-7. 9 (R.: 8a)"},"23_martes":{"primera":"Col 2, 6-15","salmo":"Sal 144, 1bc-2. 8-9. 10-11 (R.: 9a)"},"23_miercoles":{"primera":"Col 3, 1-11","salmo":"Sal 144, 2-3. 10-11. 12-13ab (R.: 9a)"},"23_jueves":{"primera":"Col 3, 12-17","salmo":"Sal 150, 1b-2. 3-4. 5-6a (R.: 6a)"},"23_viernes":{"primera":"1 Tim 1, 1-2. 12-14","salmo":"Sal 15, 1b-2a y 5. 7-8. 11 (R.: cf. 5a)"},"23_sabado":{"primera":"1 Tim 1, 15-17","salmo":"Sal 112, 1b-2. 3-4. 5a y 6-7 (R.: cf. 2)"},"24_lunes":{"primera":"1 Tim 2, 1-8","salmo":"Sal 27, 2. 7. 8-9 (R.: 6)"},"24_martes":{"primera":"1 Tim 3, 1-13","salmo":"Sal 100, 1b-2ab. 2cd-3abc. 5. 6 (R.: 2c)"},"24_miercoles":{"primera":"1 Tim 3, 14-16","salmo":"Sal 110, 1b-2. 3-4. 5-6 (R.: 2a)"},"24_jueves":{"primera":"1 Tim 4, 12-16","salmo":"Sal 110, 7-8. 9. 10 (R.: 2a)"},"24_viernes":{"primera":"1 Tim 6, 2c-12","salmo":"Sal 48, 6-8. 9-10. 17-18. 19-20 (R.: Mt 5, 3)"},"24_sabado":{"primera":"1 Tim 6, 13-16","salmo":"Sal 99, 1-2. 3. 4. 5 (R.: 2b)"},"25_lunes":{"primera":"Esd 1, 1-6","salmo":"Sal 125, 1b-2ab. 2cd-3. 4-5. 6 (R.: 3a)"},"25_martes":{"primera":"Esd 6, 7-8. 12b. 14-20","salmo":"Sal 121, 1bc-2. 3-4ab. 4cd-5 (R.: cf. 1bc)"},"25_miercoles":{"primera":"Esd 9, 5-9","salmo":"Tob 13, 1b-2. 3-4a. 4bcd. 5. 10 (R.: 1b)"},"25_jueves":{"primera":"Ag 1, 1-8","salmo":"Sal 149, 1bc-2. 3-4. 5-6a y 9b (R.: 4a)"},"25_viernes":{"primera":"Ag 2, 1-9","salmo":"Sal 42, 1. 2. 3. 4 (R.: 5cd)"},"25_sabado":{"primera":"Zac 2, 5-9. 14-15c","salmo":"Jer 31, 10. 11-12ab. 13 (R.: 10d)"},"26_lunes":{"primera":"Zac 8, 1-8","salmo":"Sal 101, 16-18. 19-21. 29 y 22-23 (R.: cf. 17)"},"26_martes":{"primera":"Zac 8, 20-23","salmo":"Sal 86, 1b-3. 4-5. 6-7 (R.: cf. Zac 8, 23c)"},"26_miercoles":{"primera":"Neh 2, 1-8","salmo":"Sal 136, 1-2. 3. 4-5. 6 (R.: 6ab)"},"26_jueves":{"primera":"Neh 8, 1-4a. 5-6. 7b-12","salmo":"Sal 18, 8. 9. 10. 11 (R.: 9ab)"},"26_viernes":{"primera":"Bar 1, 15-22","salmo":"Sal 78, 1b-2. 3-5. 8. 9 (R.: 9b)"},"26_sabado":{"primera":"Bar 4, 5-12. 27-29","salmo":"Sal 68, 33-35. 36-37 (R.: 34a)"},"27_lunes":{"primera":"Jon 1, 1 — 2, 1. 11","salmo":"Jon 2, 3. 4. 5. 8 (R.: cf. 7de)"},"27_martes":{"primera":"Jon 3, 1-10","salmo":"Sal 129, 1b-2. 3-4. 7cd-8 (R.: 3)"},"27_miercoles":{"primera":"Jon 4, 1-11","salmo":"Sal 85, 3-4. 5-6. 9-10 (R.: cf. 15)"},"27_jueves":{"primera":"Mal 3, 13-20a","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: Sal 39, 5ab)"},"27_viernes":{"primera":"Jl 1, 13-15; 2, 1-2","salmo":"Sal 9, 2-3. 6 y 16. 8-9 (R.: cf. 9a)"},"27_sabado":{"primera":"Jl 4, 12-21","salmo":"Sal 96, 1-2. 5-6. 11-12 (R.: 12a)"},"28_lunes":{"primera":"Rom 1, 1-7","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4 (R.: 2a)"},"28_martes":{"primera":"Rom 1, 16-25","salmo":"Sal 18, 2-3. 4-5b (R.: 2a)"},"28_miercoles":{"primera":"Rom 2, 1-11","salmo":"Sal 61, 2-3. 6-7. 9 (R.: cf. 13bc)"},"28_jueves":{"primera":"Rom 3, 21-30","salmo":"Sal 129, 1b-2. 3-4. 5-7ab. (R.: 7cd)"},"28_viernes":{"primera":"Rom 4, 1-8","salmo":"Sal 31, 1b-2. 5. 11 (R.: 7a. c)"},"28_sabado":{"primera":"Rom 4, 13. 16-18","salmo":"Sal 104, 6-7. 8-9. 42-43 (R.: 8a)"},"29_lunes":{"primera":"Rom 4, 20-25","salmo":"Lc 1, 69-70. 71-72. 73-75 (R.: cf. 68)"},"29_martes":{"primera":"Rom 5, 12. 15b. 17-19. 20b-21","salmo":"Sal 39, 7-8a. 8b-9. 10. 17 (R.: cf. 8a y 9a)"},"29_miercoles":{"primera":"Rom 6, 12-18","salmo":"Sal 123, 1b-3. 4-6. 7-8 (R.: 8a)"},"29_jueves":{"primera":"Rom 6, 19-23","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: Sal 39, 5ab)"},"29_viernes":{"primera":"Rom 7, 18-24","salmo":"Sal 118, 66. 68. 76. 77. 93. 94 (R.: 68b)"},"29_sabado":{"primera":"Rom 8, 1-11","salmo":"Sal 23, 1b-2. 3-4ab. 5-6 (R.: cf. 6)"},"30_lunes":{"primera":"Rom 8, 12-17","salmo":"Sal 67, 2 y 4. 6-7ab. 20-21 (R.: 21a)"},"30_martes":{"primera":"Rom 8, 18-25","salmo":"Sal 125, 1b-2ab. 2cd-3. 4-5. 6 (R.: 3a)"},"30_miercoles":{"primera":"Rom 8, 26-30","salmo":"Sal 12, 4-5. 6 (R.: 6a)"},"30_jueves":{"primera":"Rom 8, 31b-39","salmo":"Sal 108, 21-22. 26-27. 30-31 (R.: 26b)"},"30_viernes":{"primera":"Rom 9, 1-5","salmo":"Sal 147, 12-13. 14-15. 19-20 (R.: 12a)"},"30_sabado":{"primera":"Rom 11, 1-2a. 11-12. 25-29","salmo":"Sal 93, 12-13a. 14-15. 17-18 (R.: 14a)"},"31_lunes":{"primera":"Rom 11, 29-36","salmo":"Sal 68, 30-31. 33-34. 36-37 (R.: 14c)"},"31_martes":{"primera":"Rom 12, 5-16a","salmo":"Sal 130, 1bcde. 2. 3"},"31_miercoles":{"primera":"Rom 13, 8-10","salmo":"Sal 111, 1b-2. 4-5. 9 (R.: 5a)"},"31_jueves":{"primera":"Rom 14, 7-12","salmo":"Sal 26, 1bcde. 4. 13-14 (R.: 13)"},"31_viernes":{"primera":"Rom 15, 14-21","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4 (R.: cf. 2b)"},"31_sabado":{"primera":"Rom 16, 3-9. 16. 22-27","salmo":"Sal 144, 2-3. 4-5. 10-11 (R.: cf. 1bc)"},"32_lunes":{"primera":"Sab 1, 1-7","salmo":"Sal 138, 1b-3. 4-6. 7-8. 9-10 (R.: 24b)"},"32_martes":{"primera":"Sab 2, 23 — 3, 9","salmo":"Sal 33, 2-3. 16-17. 18-19 (R.: 2a)"},"32_miercoles":{"primera":"Sab 6, 1-11","salmo":"Sal 81, 3-4. 6-7 (R.: 8a)"},"32_jueves":{"primera":"Sab 7, 22 — 8, 1","salmo":"Sal 118, 89. 90. 91. 130. 135. 175 (R.: 89a)"},"32_viernes":{"primera":"Sab 13, 1-9","salmo":"Sal 18, 2-3. 4-5b (R.: 2a)"},"32_sabado":{"primera":"Sab 18, 14-16; 19, 6-9","salmo":"Sal 104, 2-3. 36-37. 42-43 (R.: 5a)"},"33_lunes":{"primera":"1 Mac 1, 10-15. 41-43. 54-57. 62-64","salmo":"Sal 118, 53. 61. 134. 150. 155. 158 (R.: cf. 88)"},"33_martes":{"primera":"2 Mac 6, 18-31","salmo":"Sal 3, 2-3. 4-5. 6-8a (R.: 6b)"},"33_miercoles":{"primera":"2 Mac 7, 1. 20-31","salmo":"Sal 16, 1bcde. 5-6. 8 y 15 (R.: 15b)"},"33_jueves":{"primera":"1 Mac 2, 15-29","salmo":"Sal 49, 1b-2. 5-6. 14-15 (R.: 23cd)"},"33_viernes":{"primera":"1 Mac 4, 36-37. 52-59","salmo":"1 Cron 29, 10bc. 11abc. 11d-12a. 12bcd (R.: 13b)"},"33_sabado":{"primera":"1 Mac 6, 1-13","salmo":"Sal 9, 2-3. 4 y 6. 16 y 19 (R.: cf. 15c)"},"34_lunes":{"primera":"Dan 1, 1-6. 8-20","salmo":"Dan 3, 52a y c. 53a. 54a. 55a. 56a (R.: 52b)"},"34_martes":{"primera":"Dan 2, 31-45","salmo":"Dan 3, 57a. 58a. 59a. 60a. 61a (R.: 59b)"},"34_miercoles":{"primera":"Dan 5, 1-6. 13-14. 16-17. 23-28","salmo":"Dan 3, 62a. 63a. 64a. 65a. 66a. 67a (R.: 59b)"},"34_jueves":{"primera":"Dan 6, 12-28","salmo":"Dan 3, 68a. 69a. 70a. 71a. 72a. 73a. 74a (R.: 59b)"},"34_viernes":{"primera":"Dan 7, 2-14","salmo":"Dan 3, 75a. 76a. 77a. 78a. 79a. 80a. 81a (R.: 59b)"},"34_sabado":{"primera":"Dan 7, 15-27","salmo":"Dan 3, 82a. 83a. 84a. 85a. 86a. 87a (R.: 59b)"},"7_lunes":{"primera":"Eclo 1, 1-10b","salmo":"Sal 92, 1ab. 1c-2. 5 (R.: 1a)"},"19_lunes":{"primera":"Dt 10, 12-22","salmo":"Sal 147, 12-13. 14-15. 19-20 (R.: 12a)"}},"II":{"1_lunes":{"primera":"1 Sam 1, 1-8","salmo":"Sal 115, 12-13. 14 y 17. 18-19 (R.: 17a)"},"1_martes":{"primera":"1 Sam 1, 9-20","salmo":"1 Sam 2, 1. 4-5. 6-7. 8abcd (R.: cf. 1a)"},"1_miercoles":{"primera":"1 Sam 3, 1-10. 19-20","salmo":"Sal 39, 2 y 5. 7-8a. 8b-9. 10 (R.: cf. 8a y 9a)"},"1_jueves":{"primera":"1 Sam 4, 1b-11","salmo":"Sal 43, 10-11. 14-15. 24-25 (R.: 27b)"},"1_viernes":{"primera":"1 Sam 8, 4-7. 10-22a","salmo":"Sal 88, 16-17. 18-19 (R.: cf. 2a)"},"1_sabado":{"primera":"1 Sam 9, 1-4. 17-19; 10, 1a","salmo":"Sal 20, 2-3. 4-5. 6-7 (R.: 2a)"},"2_lunes":{"primera":"1 Sam 15, 16-23","salmo":"Sal 49, 8-9. 16bc-17. 21 y 23 (R.: 23cd)"},"2_martes":{"primera":"1 Sam 16, 1-13","salmo":"Sal 88, 20. 21-22. 27-28 (R.: 21a)"},"2_miercoles":{"primera":"1 Sam 17, 32-33. 37. 40-51","salmo":"Sal 143, 1bcd. 2. 9-10 (R.: cf. 1a)"},"2_jueves":{"primera":"1 Sam 18, 6-9; 19, 1-7","salmo":"Sal 55, 2-3. 9-10ab. 10c-11. 12-13 (R.: 5b)"},"2_viernes":{"primera":"1 Sam 24, 3-21","salmo":"Sal 56, 2. 3-4. 6 y 11 (R.: 2a)"},"2_sabado":{"primera":"2 Sam 1, 1-4. 11-12. 19. 23-27","salmo":"Sal 79, 2-3. 5-7 (R.: 4b)"},"3_lunes":{"primera":"2 Sam 5, 1-7. 10","salmo":"Sal 88, 20. 21-22. 25-26 (R.: 25a)"},"3_martes":{"primera":"2 Sam 6, 12b-15. 17-19","salmo":"Sal 23, 7. 8. 9. 10 (R.: cf. 8a)"},"3_miercoles":{"primera":"2 Sam 7, 4-17","salmo":"Sal 88, 4-5. 27-28. 29-30 (R.: 29a)"},"3_jueves":{"primera":"2 Sam 7, 18-19. 24-29","salmo":"Sal 131, 1b-2. 3-5. 11. 12. 13-14 (R.: Lc 1, 32b)"},"3_viernes":{"primera":"2 Sam 11, 1-4a. 4c-10a. 13-17","salmo":"Sal 50, 3-4. 5-6b. 6c-7. 10-11 (R.: cf. 3a)"},"3_sabado":{"primera":"2 Sam 12, 1-7a. 10-17","salmo":"Sal 50, 12-13. 14-15. 16-17 (R.: 12a)"},"4_lunes":{"primera":"2 Sam 15, 13-14. 30; 16, 5-13a","salmo":"Sal 3, 2-3. 4-5. 6-8a (R.: 8a)"},"4_martes":{"primera":"2 Sam 18, 9-10. 14b. 24-25a. 31 — 19, 3","salmo":"Sal 85, 1b-2. 3-4. 5-6 (R.: 1b)"},"4_miercoles":{"primera":"2 Sam 24, 2. 9-17","salmo":"Sal 31, 1b-2. 5. 6. 7 (R.: cf. 5d)"},"4_jueves":{"primera":"1 Re 2, 1-4. 10-12","salmo":"1 Cron 29, 10bc. 11abc. 11d-12a. 12bcd (R.: 12b)"},"4_viernes":{"primera":"Eclo 47, 2-11","salmo":"Sal 17, 31. 47 y 50. 51 (R.: cf. 47b)"},"4_sabado":{"primera":"1 Re 3, 4-13","salmo":"Sal 118, 9. 10. 11. 12. 13. 14 (R.: 12b)"},"5_lunes":{"primera":"1 Re 8, 1-7. 9-13","salmo":"Sal 131, 6-7. 8-10 (R.: 8a)"},"5_martes":{"primera":"1 Re 8, 22-23. 27-30","salmo":"Sal 83, 3. 4. 5 y 10. 11 (R.: 2)"},"5_miercoles":{"primera":"1 Re 10, 1-10","salmo":"Sal 36, 5-6. 30-31. 39-40 (R.: 30a)"},"5_jueves":{"primera":"1 Re 11, 4-13","salmo":"Sal 105, 3-4. 35-36. 37 y 40 (R.: 4ab)"},"5_viernes":{"primera":"1 Re 11, 29-32; 12, 19","salmo":"Sal 80, 10-11ab. 12-13. 14-15 (R.: cf. 11a y 9a)"},"5_sabado":{"primera":"1 Re 12, 26-32; 13, 33-34","salmo":"Sal 105, 6-7ab. 19-20. 21-22 (R.: 4ab)"},"6_lunes":{"primera":"Sant 1, 1-11","salmo":"Sal 118, 67. 68. 71. 72. 75. 76 (R.: 77a)"},"6_martes":{"primera":"Sant 1, 12-18","salmo":"Sal 93, 12-13a. 14-15. 18-19 (R.: 12a)"},"6_miercoles":{"primera":"Sant 1, 19-27","salmo":"Sal 14, 2-3a. 3bc-4ab. 5 (R.: cf. 1)"},"6_jueves":{"primera":"Sant 2, 1-9","salmo":"Sal 33, 2-3. 4-5. 6-7 (R.: 7ab)"},"6_viernes":{"primera":"Sant 2, 14-24. 26","salmo":"Sal 111, 1b-2. 3-4. 5-6 (R.: cf. 1)"},"6_sabado":{"primera":"Sant 3, 1-10","salmo":"Sal 11, 2-3. 4-5. 7-8 (R.: 8a)"},"7_lunes":{"primera":"Sant 3, 13-18","salmo":"Sal 18, 8. 9. 10. 15 (R.: 9ab)"},"7_martes":{"primera":"Sant 4, 1-10","salmo":"Sal 54, 7-8. 9-10b. 10c-11a. 23 (R.: 23ab)"},"7_miercoles":{"primera":"Sant 4, 13-17","salmo":"Sal 48, 2-3. 6-8. 9-10. 11 (R.: Mt 5, 3)"},"7_jueves":{"primera":"Sant 5, 1-6","salmo":"Sal 48, 14-15ab. 15cde-16. 17-18. 19-20 (R.: Mt 5, 3)"},"7_viernes":{"primera":"Sant 5, 9-12","salmo":"Sal 102, 1b-2. 3-4. 8-9. 11-12 (R.: 8a)"},"7_sabado":{"primera":"Sant 5, 13-20","salmo":"Sal 140, 1b-2. 3 y 8 (R.: 2a)"},"8_lunes":{"primera":"1 Pe 1, 3-9","salmo":"Sal 110, 1b-2. 5-6. 9 y 10c (R.: cf. 5b)"},"8_martes":{"primera":"1 Pe 1, 10-16","salmo":"Sal 97, 1bcde. 2-3ab. 3c-4 (R.: 2a)"},"8_miercoles":{"primera":"1 Pe 1, 18-25","salmo":"Sal 147, 12-13. 14-15. 19-20 (R.: 12a)"},"8_jueves":{"primera":"1 Pe 2, 2-5. 9-12","salmo":"Sal 99, 1b-2. 3. 4. 5 (R.: 2b)"},"8_viernes":{"primera":"1 Pe 4, 7-13","salmo":"Sal 95, 10. 11-12. 13 (R.: cf. 13b)"},"8_sabado":{"primera":"Jds 17. 20b-25","salmo":"Sal 62, 2. 3-4. 5-6 (R.: cf. 2b)"},"9_lunes":{"primera":"2 Pe 1, 2-7","salmo":"Sal 90, 1-2. 14-15ab. 15c-16 (R.: cf. 2b)"},"9_martes":{"primera":"2 Pe 3, 12-15a. 17-18","salmo":"Sal 89, 2. 3-4. 10. 14 y 16 (R.: 1bc)"},"9_miercoles":{"primera":"2 Tim 1, 1-3. 6-12","salmo":"Sal 122, 1b-2b. 2cdefg (R.: 1b)"},"9_jueves":{"primera":"2 Tim 2, 8-15","salmo":"Sal 24, 4-5a. 8-9. 10 y 14 (R.: 4a)"},"9_viernes":{"primera":"2 Tim 3, 10-17","salmo":"Sal 118, 157. 160. 161. 165. 166. 168 (R.: 165a)"},"9_sabado":{"primera":"2 Tim 4, 1-8","salmo":"Sal 70, 8-9. 14-15ab. 16-17. 22 (R.: cf. 15ab)"},"10_lunes":{"primera":"1 Re 17, 1-6","salmo":"Sal 120, 1bc-2. 3-4. 5-6. 7-8 (R.: cf. 2)"},"10_martes":{"primera":"1 Re 17, 7-16","salmo":"Sal 4, 2-3. 4-5. 7-8 (R.: cf. 7b)"},"10_miercoles":{"primera":"1 Re 18, 20-39","salmo":"Sal 15, 1b-2a. 4. 5 y 8. 11 (R.: 1b)"},"10_jueves":{"primera":"1 Re 18, 41-46","salmo":"Sal 64, 10abcd. 10e-11. 12-13 (R.: 2a)"},"10_viernes":{"primera":"1 Re 19, 9a. 11-16","salmo":"Sal 26, 7-8ab. 8c-9abcd. 13-14 (R.: 8c)"},"10_sabado":{"primera":"1 Re 19, 19-21","salmo":"Sal 15, 1b-2a y 5. 7-8. 9-10 (R.: cf. 5a)"},"11_lunes":{"primera":"1 Re 21, 1-16","salmo":"Sal 5, 2-3ab. 5-6a. 6b-7 (R.: 2b)"},"11_martes":{"primera":"1 Re 21, 17-29","salmo":"Sal 50, 3-4. 5-6b. 11 y 16 (R.: cf. 3a)"},"11_miercoles":{"primera":"2 Re 2, 1. 6-14","salmo":"Sal 30, 20. 21. 24 (R.: 25)"},"11_jueves":{"primera":"Eclo 48, 1-14","salmo":"Sal 96, 1-2. 3-4. 5-6. 7 (R.: 12a)"},"11_viernes":{"primera":"2 Re 11, 1-4. 9-18. 20","salmo":"Sal 131, 11. 12. 13-14. 17-18 (R.: cf. 13)"},"11_sabado":{"primera":"2 Cron 24, 17-25","salmo":"Sal 88, 4-5. 29-30. 31-32. 33-34 (R.: 29a)"},"12_lunes":{"primera":"2 Re 17, 5-8. 13-15a. 18","salmo":"Sal 59, 3. 4-5. 12-14 (R.: 7b)"},"12_martes":{"primera":"2 Re 19, 9b-11. 14-21. 31-35a. 36","salmo":"Sal 47, 2. 3-4. 10-11 (R.: cf. 9d)"},"12_miercoles":{"primera":"2 Re 22, 8-13; 23, 1-3","salmo":"Sal 118, 33. 34. 35. 36. 37. 40 (R.: 33a)"},"12_jueves":{"primera":"2 Re 24, 8-17","salmo":"Sal 78, 1b-2. 3-5. 8. 9 (R.: 9b)"},"12_viernes":{"primera":"2 Re 25, 1-12","salmo":"Sal 136, 1-2. 3. 4-5. 6 (R.: 6ab)"},"12_sabado":{"primera":"Lam 2, 2. 10-14. 18-19","salmo":"Sal 73, 1b-2. 3-4. 5-7. 20-21 (R.: 19b)"},"13_lunes":{"primera":"Am 2, 6-10. 13-16","salmo":"Sal 49, 16bc-17. 18-19. 20-21. 22-23 (R.: 22a)"},"13_martes":{"primera":"Am 3, 1-8; 4, 11-12","salmo":"Sal 5, 5-6a. 6b-7. 8 (R.: 9a)"},"13_miercoles":{"primera":"Am 5, 14-15. 21-24","salmo":"Sal 49, 7. 8-9. 10-11. 12-13. 16bc-17 (R.: 23cd)"},"13_jueves":{"primera":"Am 7, 10-17","salmo":"Sal 18, 8. 9. 10. 11 (R.: 10cd)"},"13_viernes":{"primera":"Am 8, 4-6. 9-12","salmo":"Sal 118, 2. 10. 20. 30. 40. 131 (R.: Mt 4, 4)"},"13_sabado":{"primera":"Am 9, 11-15","salmo":"Sal 84, 9. 11-12. 13-14 (R.: 9bc)"},"14_lunes":{"primera":"Os 2, 16. 17b-18. 21-22","salmo":"Sal 144, 2-3. 4-5. 6-7. 8-9 (R.: 8a)"},"14_martes":{"primera":"Os 8, 4-7. 11-13","salmo":"Sal 113 B, 3-4. 5-6. 7ab-8. 9-10 (R.: 9a)"},"14_miercoles":{"primera":"Os 10, 1-3. 7-8. 12","salmo":"Sal 104, 2-3. 4-5. 6-7 (R.: 4b)"},"14_jueves":{"primera":"Os 11, 1-4. 8c-9","salmo":"Sal 79, 2ac y 3b. 15-16 (R.: 4b)"},"14_viernes":{"primera":"Os 14, 2-10","salmo":"Sal 50, 3-4. 8-9. 12-13. 14 y 17 (R.: 17b)"},"14_sabado":{"primera":"Is 6, 1-8","salmo":"Sal 92, 1ab. 1c-2. 5 (R.: 1a)"},"15_lunes":{"primera":"Is 1, 10-17","salmo":"Sal 49, 8-9. 16bc-17. 21 y 23 (R.: 23cd)"},"15_martes":{"primera":"Is 7, 1-9","salmo":"Sal 47, 2. 3-4. 5-6. 7-8 (R.: cf. 9d)"},"15_miercoles":{"primera":"Is 10, 5-7. 13-16","salmo":"Sal 93, 5-6. 7-8. 9-10. 14-15 (R.: 14a)"},"15_jueves":{"primera":"Is 26, 7-9. 12. 16-19","salmo":"Sal 101, 13-14 y 15. 16-18. 19-21 (R.: 20b)"},"15_viernes":{"primera":"Is 38, 1-6. 21-22. 7-8","salmo":"Is 38, 10. 11. 12abcd. 16bcd (R.: cf. 17b)"},"15_sabado":{"primera":"Miq 2, 1-5","salmo":"Sal 9, 22-23. 24-25. 28-29. 35 (R.: 33b)"},"16_lunes":{"primera":"Miq 6, 1-4. 6-8","salmo":"Sal 49, 5-6. 8-9. 16bc-17. 21 y 23 (R.: 23cd)"},"16_martes":{"primera":"Miq 7, 14-15. 18-20","salmo":"Sal 84, 2-4. 5-6. 7-8 (R.: 8a)"},"16_miercoles":{"primera":"Jer 1, 1. 4-10","salmo":"Sal 70, 1-2. 3-4a. 5-6ab. 15ab y 17 (R.: cf. 15ab)"},"16_jueves":{"primera":"Jer 2, 1-3. 7-8. 12-13","salmo":"Sal 35, 6-7ab. 8-9. 10-11 (R.: 10a)"},"16_viernes":{"primera":"Jer 3, 14-17","salmo":"Jer 31, 10. 11-12ab. 13 (R.: cf. 10d)"},"16_sabado":{"primera":"Jer 7, 1-11","salmo":"Sal 83, 3. 4. 5-6a y 8a. 11 (R.: 2)"},"17_lunes":{"primera":"Jer 13, 1-11","salmo":"Dt 32, 18-19. 20. 21 (R.: cf. 18a)"},"17_martes":{"primera":"Jer 14, 17-22","salmo":"Sal 78, 8. 9. 11 y 13 (R.: 9b)"},"17_miercoles":{"primera":"Jer 15, 10. 16-21","salmo":"Sal 58, 2-3. 4. 10-11. 17. 18 (R.: 17d)"},"17_jueves":{"primera":"Jer 18, 1-6","salmo":"Sal 145, 1b-2. 3-4. 5-6ab (R.: 5a)"},"17_viernes":{"primera":"Jer 26, 1-9","salmo":"Sal 68, 5. 8-10. 14 (R.: 14c)"},"17_sabado":{"primera":"Jer 26, 11-16. 24","salmo":"Sal 68, 15-16. 30-31. 33-34 (R.: cf. 14)"},"18_lunes":{"primera":"Jer 28, 1-17","salmo":"Sal 118, 29. 43. 79. 80. 95. 102 (R.: 68b)"},"18_martes":{"primera":"Jer 30, 1-2. 12b-15. 18-22","salmo":"Sal 101, 16-18. 19-21. 29 y 22-23 (R.: cf. 17)"},"18_miercoles":{"primera":"Jer 31, 1-7","salmo":"Jer 31, 10. 11-12ab. 13 (R.: cf. 10d)"},"18_jueves":{"primera":"Jer 31, 31-34","salmo":"Sal 50, 12-13. 14-15. 18-19 (R.: 12a)"},"18_viernes":{"primera":"Nah 2, 1. 3; 3, 1-3. 6-7","salmo":"Dt 32, 35cd-36ab. 39abcd. 41 (R.: 39c)"},"18_sabado":{"primera":"Hab 1, 12 — 2, 4","salmo":"Sal 9, 8-9. 10-11. 12-13 (R.: 11b)"},"19_lunes":{"primera":"Ez 1, 2-5. 24-28c","salmo":"Sal 148, 1bc-2. 11-12. 13. 14 (R.: cf. Is 6, 3c)"},"19_martes":{"primera":"Ez 2, 8 — 3, 4","salmo":"Sal 118, 14. 24. 72. 103. 111. 131 (R.: 103a)"},"19_miercoles":{"primera":"Ez 9, 1-7; 10, 18-22","salmo":"Sal 112, 1b-2. 3-4. 5-6 (R.: cf. 4b)"},"19_jueves":{"primera":"Ez 12, 1-12","salmo":"Sal 77, 56-57. 58-59. 61-62 (R.: cf. 7b)"},"19_viernes":{"primera":"Ez 16, 59-63","salmo":"Is 12, 2-3. 4bcde. 5-6 (R.: 1d)"},"19_sabado":{"primera":"Ez 18, 1-10. 13b. 30-32","salmo":"Sal 50, 12-13. 14-15. 18-19 (R.: 12a)"},"20_lunes":{"primera":"Ez 24, 15-24","salmo":"Dt 32, 18-19. 20. 21 (R.: cf. 18a)"},"20_martes":{"primera":"Ez 28, 1-10","salmo":"Dt 32, 26-27ab. 27cd-28. 30. 35cd-36ab (R.: 39c)"},"20_miercoles":{"primera":"Ez 34, 1-11","salmo":"Sal 22, 1b-3a. 3b-4. 5. 6 (R.: 1b)"},"20_jueves":{"primera":"Ez 36, 23-28","salmo":"Sal 50, 12-13. 14-15. 18-19 (R.: Ez 36, 25)"},"20_viernes":{"primera":"Ez 37, 1-14","salmo":"Sal 106, 2-3. 4-5. 6-7. 8-9 (R.: 1)"},"20_sabado":{"primera":"Ez 43, 1-7a","salmo":"Sal 84, 9abc y 10. 11-12. 13-14 (R.: cf. 10b)"},"21_lunes":{"primera":"2 Tes 1, 1-5. 11b-12","salmo":"Sal 95, 1-2a. 2b-3. 4-5 (R.: cf. 3)"},"21_martes":{"primera":"2 Tes 2, 1-3a. 14-17","salmo":"Sal 95, 10. 11-12a. 12b-13 (R.: 13b)"},"21_miercoles":{"primera":"2 Tes 3, 6-10. 16-18","salmo":"Sal 127, 1bc-2. 4-5 (R.: cf. 1b)"},"21_jueves":{"primera":"1 Cor 1, 1-9","salmo":"Sal 144, 2-3. 4-5. 6-7 (R.: cf. 1b)"},"21_viernes":{"primera":"1 Cor 1, 17-25","salmo":"Sal 32, 1-2. 4-5. 10-11 (R.: cf. 5b)"},"21_sabado":{"primera":"1 Cor 1, 26-31","salmo":"Sal 32, 12-13. 18-19. 20-21 (R.: cf. 12)"},"22_lunes":{"primera":"1 Cor 2, 1-5","salmo":"Sal 118, 97. 98. 99. 100. 101. 102 (R.: 97a)"},"22_martes":{"primera":"1 Cor 2, 10b-16","salmo":"Sal 144, 8-9. 10-11. 12-13ab. 13cd-14 (R.: 17a)"},"22_miercoles":{"primera":"1 Cor 3, 1-9","salmo":"Sal 32, 12-13. 14-15. 20-21 (R.: cf. 12)"},"22_jueves":{"primera":"1 Cor 3, 18-23","salmo":"Sal 23, 1b-2. 3-4ab. 5-6 (R.: 1b)"},"22_viernes":{"primera":"1 Cor 4, 1-5","salmo":"Sal 36, 3-4. 5-6. 27-28. 39-40 (R.: 39a)"},"22_sabado":{"primera":"1 Cor 4, 6b-15","salmo":"Sal 144, 17-18. 19-20. 21 (R.: 18a)"},"23_lunes":{"primera":"1 Cor 5, 1-8","salmo":"Sal 5, 5-6a. 6b-7. 12 (R.: 9a)"},"23_martes":{"primera":"1 Cor 6, 1-11","salmo":"Sal 149, 1bc-2. 3-4. 5-6a y 9b (R.: 4a)"},"23_miercoles":{"primera":"1 Cor 7, 25-31","salmo":"Sal 44, 11-12. 14-15. 16-17 (R.: 11a)"},"23_jueves":{"primera":"1 Cor 8, 1b-7. 11-13","salmo":"Sal 138, 1b-3. 13-14ab. 23-24 (R.: 24b)"},"23_viernes":{"primera":"1 Cor 9, 16-19. 22b-27","salmo":"Sal 83, 3. 4. 5-6. 12 (R.: 2)"},"23_sabado":{"primera":"1 Cor 10, 14-22","salmo":"Sal 115, 12-13. 17-18 (R.: 17a)"},"24_lunes":{"primera":"1 Cor 11, 17-26. 33","salmo":"Sal 39, 7-8a. 8b-9. 10. 17 (R.: 1 Cor 11, 26b)"},"24_martes":{"primera":"1 Cor 12, 12-14. 27-31a","salmo":"Sal 99, 1b-2. 3. 4. 5 (R.: 3c)"},"24_miercoles":{"primera":"1 Cor 12, 31 — 13, 13","salmo":"Sal 32, 2-3. 4-5. 12 y 22 (R.: cf. 12)"},"24_jueves":{"primera":"1 Cor 15, 1-11","salmo":"Sal 117, 1-2. 16-17. 28 (R.: 1)"},"24_viernes":{"primera":"1 Cor 15, 12-20","salmo":"Sal 16, 1bcde. 6-7. 8 y 15 (R.: 15b)"},"24_sabado":{"primera":"1 Cor 15, 35-37. 42-49","salmo":"Sal 55, 10. 11-12. 13-14 (R.: cf. 14cd)"},"25_lunes":{"primera":"Prov 3, 27-34","salmo":"Sal 14, 2-3a. 3bc-4ab. 5 (R.: cf. 1c)"},"25_martes":{"primera":"Prov 21, 1-6. 10-13","salmo":"Sal 118, 1. 27. 30. 34. 35. 44 (R.: 35a)"},"25_miercoles":{"primera":"Prov 30, 5-9","salmo":"Sal 118, 29. 72. 89. 101. 104. 163 (R.: 105a)"},"25_jueves":{"primera":"Ecl 1, 2-11","salmo":"Sal 89, 3-4. 5-6. 12-13. 14 y 17 (R.: 1bc)"},"25_viernes":{"primera":"Ecl 3, 1-11","salmo":"Sal 143, 1b y 2abc. 3-4 (R.: cf. 1a)"},"25_sabado":{"primera":"Ecl 11, 9 — 12, 8","salmo":"Sal 89, 3-4. 5-6. 12-13. 14 y 17 (R.: 1bc)"},"26_lunes":{"primera":"Job 1, 6-22","salmo":"Sal 16, 1bcde. 2-3. 6-7 (R.: 6b)"},"26_martes":{"primera":"Job 3, 1-3. 11-17. 20-23","salmo":"Sal 87, 2-3. 4-5. 6. 7-8 (R.: 3a)"},"26_miercoles":{"primera":"Job 9, 1-12. 14-16","salmo":"Sal 87, 10bc-11. 12-13. 14-15 (R.: 3a)"},"26_jueves":{"primera":"Job 19, 21-27","salmo":"Sal 26, 7-8ab. 8c-9abcd. 13-14 (R.: 13)"},"26_viernes":{"primera":"Job 38, 1. 12-21; 40, 3-5","salmo":"Sal 138, 1b-3. 7-8. 9-10. 13-14ab (R.: 24b)"},"26_sabado":{"primera":"Job 42, 1-3. 5-6. 12-17","salmo":"Sal 118, 66. 71. 75. 91. 125. 130 (R.: 135a)"},"27_lunes":{"primera":"Gal 1, 6-12","salmo":"Sal 110, 1b-2. 7-8. 9 y 10c (R.: cf. 5b)"},"27_martes":{"primera":"Gal 1, 13-24","salmo":"Sal 138, 1b-3. 13-14ab. 14c-15 (R.: 24b)"},"27_miercoles":{"primera":"Gal 2, 1-2. 7-14","salmo":"Sal 116, 1. 2 (R.: Mc 16, 15)"},"27_jueves":{"primera":"Gal 3, 1-5","salmo":"Lc 1, 69-70. 71-72. 73-75 (R.: cf. 68)"},"27_viernes":{"primera":"Gal 3, 7-14","salmo":"Sal 110, 1b-2. 3-4. 5-6 (R.: cf. 5b)"},"27_sabado":{"primera":"Gal 3, 22-29","salmo":"Sal 104, 2-3. 4-5. 6-7 (R.: 8a)"},"28_lunes":{"primera":"Gal 4, 22-24. 26-27. 31 — 5, 1","salmo":"Sal 112, 1b-2. 3-4. 5a y 6-7 (R.: cf. 2)"},"28_martes":{"primera":"Gal 5, 1-6","salmo":"Sal 118, 41. 43. 44. 45. 47. 48 (R.: 41a)"},"28_miercoles":{"primera":"Gal 5, 18-25","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: cf. Jn 8, 12)"},"28_jueves":{"primera":"Ef 1, 1-10","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4. 5-6 (R.: 2a)"},"28_viernes":{"primera":"Ef 1, 11-14","salmo":"Sal 32, 1-2. 4-5. 12-13 (R.: cf. 12)"},"28_sabado":{"primera":"Ef 1, 15-23","salmo":"Sal 8, 2-3ab. 4-5. 6-7 (R.: cf. 7a)"},"29_lunes":{"primera":"Ef 2, 1-10","salmo":"Sal 99, 1b-2. 3. 4. 5 (R.: 3b)"},"29_martes":{"primera":"Ef 2, 12-22","salmo":"Sal 84, 9abc y 10. 11-12. 13-14 (R.: cf. 9bc)"},"29_miercoles":{"primera":"Ef 3, 2-12","salmo":"Is 12, 2-3. 4bcde. 5-6 (R.: cf. 3)"},"29_jueves":{"primera":"Ef 3, 14-21","salmo":"Sal 32, 1-2. 4-5. 11-12. 18-19 (R.: 5b)"},"29_viernes":{"primera":"Ef 4, 1-6","salmo":"Sal 23, 1b-2. 3-4ab. 5-6 (R.: cf. 6)"},"29_sabado":{"primera":"Ef 4, 7-16","salmo":"Sal 121, 1bc-2. 3-4ab. 4cd-5 (R.: cf. 1bc)"},"30_lunes":{"primera":"Ef 4, 32 — 5, 8","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: cf. Ef 5, 1)"},"30_martes":{"primera":"Ef 5, 21-33","salmo":"Sal 127, 1bc-2. 3. 4-5 (R.: cf. 1b)"},"30_miercoles":{"primera":"Ef 6, 1-9","salmo":"Sal 144, 10-11. 12-13ab. 13cd-14 (R.: 13c)"},"30_jueves":{"primera":"Ef 6, 10-20","salmo":"Sal 143, 1bcd. 2. 9-10 (R.: cf. 1a)"},"30_viernes":{"primera":"Flp 1, 1-11","salmo":"Sal 110, 1b-2. 3-4. 5-6 (R.: 2a)"},"30_sabado":{"primera":"Flp 1, 18b-26","salmo":"Sal 41, 2. 3. 5cdef (R.: 3a)"},"31_lunes":{"primera":"Flp 2, 1-4","salmo":"Sal 130, 1bcde. 2. 3"},"31_martes":{"primera":"Flp 2, 5-11","salmo":"Sal 21, 26b-27. 28-30a. 31-32 (R.: 26a)"},"31_miercoles":{"primera":"Flp 2, 12-18","salmo":"Sal 26, 1bcde. 4. 13-14 (R.: 1b)"},"31_jueves":{"primera":"Flp 3, 3-8a","salmo":"Sal 104, 2-3. 4-5. 6-7 (R.: 3b)"},"31_viernes":{"primera":"Flp 3, 17 — 4, 1","salmo":"Sal 121, 1bc-2. 3-4ab. 4cd-5 (R.: cf. 1bc)"},"31_sabado":{"primera":"Flp 4, 10-19","salmo":"Sal 111, 1b-2. 5-6. 8a y 9 (R.: 1b)"},"32_lunes":{"primera":"Tit 1, 1-9","salmo":"Sal 23, 1b-2. 3-4ab. 5-6 (R.: cf. 6)"},"32_martes":{"primera":"Tit 2, 1-8. 11-14","salmo":"Sal 36, 3-4. 18 y 23. 27 y 29 (R.: 39a)"},"32_miercoles":{"primera":"Tit 3, 1-7","salmo":"Sal 22, 1b-3a. 3b-4. 5. 6 (R.: 1b)"},"32_jueves":{"primera":"Flm 7-20","salmo":"Sal 145, 6c-7. 8-9a. 9bc-10 (R.: 5a)"},"32_viernes":{"primera":"2 Jn 4-9","salmo":"Sal 118, 1. 2. 10. 11. 17. 18 (R.: 1b)"},"32_sabado":{"primera":"3 Jn 5-8","salmo":"Sal 111, 1b-2. 3-4. 5-6 (R.: 1b)"},"33_lunes":{"primera":"Ap 1, 1-4; 2, 1-5a","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: Ap 2, 7b)"},"33_martes":{"primera":"Ap 3, 1-6. 14-22","salmo":"Sal 14, 2-3a. 3bc-4ab. 5 (R.: Ap 3, 21a)"},"33_miercoles":{"primera":"Ap 4, 1-11","salmo":"Sal 150, 1b-2. 3-4. 5-6a (R.: Ap 4, 8b)"},"33_jueves":{"primera":"Ap 5, 1-10","salmo":"Sal 149, 1bc-2. 3-4. 5-6a y 9b (R.: cf. Ap 5, 10)"},"33_viernes":{"primera":"Ap 10, 8-11","salmo":"Sal 118, 14. 24. 72. 103. 111. 131 (R.: 103a)"},"33_sabado":{"primera":"Ap 11, 4-12","salmo":"Sal 143, 1bcd. 2. 9-10 (R.: cf. 1a)"},"34_lunes":{"primera":"Ap 14, 1-3. 4b-5","salmo":"Sal 23, 1b-2. 3-4ab. 5-6 (R.: cf. 6)"},"34_martes":{"primera":"Ap 14, 14-19","salmo":"Sal 95, 10. 11-12. 13 (R.: cf. 13b)"},"34_miercoles":{"primera":"Ap 15, 1-4","salmo":"Sal 97, 1bcde. 2-3ab. 7-8. 9 (R.: Ap 15, 3b)"},"34_jueves":{"primera":"Ap 18, 1-2. 21-23; 19, 1-3. 9a","salmo":"Sal 99, 1b-2. 3. 4. 5 (R.: Ap 19, 9a)"},"34_viernes":{"primera":"Ap 20, 1-4. 11 — 21, 2","salmo":"Sal 83, 3. 4. 5-6a y 8a (R.: Ap 21, 3b)"},"34_sabado":{"primera":"Ap 22, 1-7","salmo":"Sal 94, 1-2. 3-5. 6-7c (R.: 1 Cor 16, 22b y Ap 22, 20c)"}},"evangelio":{"34_sabado":{"evangelio":"Lc 21, 34-36"},"1_lunes":{"evangelio":"Mc 1, 14-20"},"1_martes":{"evangelio":"Mc 1, 21b-28"},"1_miercoles":{"evangelio":"Mc 1, 29-39"},"1_jueves":{"evangelio":"Mc 1, 40-45"},"1_viernes":{"evangelio":"Mc 2, 1-12"},"1_sabado":{"evangelio":"Mc 2, 13-17"},"2_lunes":{"evangelio":"Mc 2, 18-22"},"2_martes":{"evangelio":"Mc 2, 23-28"},"2_miercoles":{"evangelio":"Mc 3, 1-6"},"2_jueves":{"evangelio":"Mc 3, 7-12"},"2_viernes":{"evangelio":"Mc 3, 13-19"},"2_sabado":{"evangelio":"Mc 3, 20-21"},"3_lunes":{"evangelio":"Mc 3, 22-30"},"3_martes":{"evangelio":"Mc 3, 31-35"},"3_miercoles":{"evangelio":"Mc 4, 1-20"},"3_jueves":{"evangelio":"Mc 4, 21-25"},"3_viernes":{"evangelio":"Mc 4, 26-34"},"3_sabado":{"evangelio":"Mc 4, 35-41"},"4_lunes":{"evangelio":"Mc 5, 1-20"},"4_martes":{"evangelio":"Mc 5, 21-43"},"4_miercoles":{"evangelio":"Mc 6, 1-6"},"4_jueves":{"evangelio":"Mc 6, 7-13"},"4_viernes":{"evangelio":"Mc 6, 14-29"},"4_sabado":{"evangelio":"Mc 6, 30-34"},"5_lunes":{"evangelio":"Mc 6, 53-56"},"5_martes":{"evangelio":"Mc 7, 1-13"},"5_miercoles":{"evangelio":"Mc 7, 14-23"},"5_jueves":{"evangelio":"Mc 7, 24-30"},"5_viernes":{"evangelio":"Mc 7, 31-37"},"6_lunes":{"evangelio":"Mc 8, 11-13"},"6_martes":{"evangelio":"Mc 8, 14-21"},"6_miercoles":{"evangelio":"Mc 8, 22-26"},"6_jueves":{"evangelio":"Mc 8, 27-33"},"6_viernes":{"evangelio":"Mc 8, 34 — 9, 1"},"6_sabado":{"evangelio":"Mc 9, 2-13"},"7_martes":{"evangelio":"Mc 9, 30-37"},"7_miercoles":{"evangelio":"Mc 9, 38-40"},"7_jueves":{"evangelio":"Mc 9, 41-50"},"7_sabado":{"evangelio":"Mc 10, 13-16"},"8_lunes":{"evangelio":"Mc 10, 17-27"},"8_martes":{"evangelio":"Mc 10, 28-31"},"8_miercoles":{"evangelio":"Mc 10, 32-45"},"8_jueves":{"evangelio":"Mc 10, 46-52"},"8_viernes":{"evangelio":"Mc 11, 11-25"},"8_sabado":{"evangelio":"Mc 11, 27-33"},"9_martes":{"evangelio":"Mc 12, 13-17"},"9_miercoles":{"evangelio":"Mc 12, 18-27"},"9_jueves":{"evangelio":"Mc 12, 28b-34"},"9_sabado":{"evangelio":"Mc 12, 38-44"},"10_lunes":{"evangelio":"Mt 5, 1-12"},"10_martes":{"evangelio":"Mt 5, 13-16"},"10_miercoles":{"evangelio":"Mt 5, 17-19"},"10_jueves":{"evangelio":"Mt 5, 20-26"},"10_viernes":{"evangelio":"Mt 5, 27-32"},"10_sabado":{"evangelio":"Mt 5, 33-37"},"11_lunes":{"evangelio":"Mt 5, 38-42"},"11_martes":{"evangelio":"Mt 5, 43-48"},"11_miercoles":{"evangelio":"Mt 6, 1-6. 16-18"},"11_jueves":{"evangelio":"Mt 6, 7-15"},"11_viernes":{"evangelio":"Mt 6, 19-23"},"11_sabado":{"evangelio":"Mt 6, 24-34"},"12_lunes":{"evangelio":"Mt 7, 1-5"},"12_martes":{"evangelio":"Mt 7, 6. 12-14"},"12_jueves":{"evangelio":"Mt 7, 21-29"},"12_viernes":{"evangelio":"Mt 8, 1-4"},"12_sabado":{"evangelio":"Mt 8, 5-17"},"13_lunes":{"evangelio":"Mt 8, 18-22"},"13_martes":{"evangelio":"Mt 8, 23-27"},"13_miercoles":{"evangelio":"Mt 8, 28-34"},"13_jueves":{"evangelio":"Mt 9, 1-8"},"13_viernes":{"evangelio":"Mt 9, 9-13"},"13_sabado":{"evangelio":"Mt 9, 14-17"},"14_lunes":{"evangelio":"Mt 9, 18-26"},"14_martes":{"evangelio":"Mt 9, 32-38"},"14_miercoles":{"evangelio":"Mt 10, 1-7"},"14_jueves":{"evangelio":"Mt 10, 7-15"},"14_viernes":{"evangelio":"Mt 10, 16-23"},"14_sabado":{"evangelio":"Mt 10, 24-33"},"15_lunes":{"evangelio":"Mt 10, 34 — 11, 1"},"15_martes":{"evangelio":"Mt 11, 20-24"},"15_miercoles":{"evangelio":"Mt 11, 25-27"},"15_jueves":{"evangelio":"Mt 11, 28-30"},"15_viernes":{"evangelio":"Mt 12, 1-8"},"15_sabado":{"evangelio":"Mt 12, 14-21"},"16_lunes":{"evangelio":"Mt 12, 38-42"},"16_martes":{"evangelio":"Mt 12, 46-50"},"16_miercoles":{"evangelio":"Mt 13, 1-9"},"16_jueves":{"evangelio":"Mt 13, 10-17"},"16_viernes":{"evangelio":"Mt 13, 18-23"},"16_sabado":{"evangelio":"Mt 13, 24-30"},"17_lunes":{"evangelio":"Mt 13, 31-35"},"17_martes":{"evangelio":"Mt 13, 36-43"},"17_miercoles":{"evangelio":"Mt 13, 44-46"},"17_jueves":{"evangelio":"Mt 13, 47-53"},"17_viernes":{"evangelio":"Mt 13, 54-58"},"17_sabado":{"evangelio":"Mt 14, 1-12"},"18_lunes":{"evangelio":"Mt 14, 13-21"},"18_martes":{"evangelio":"Mt 15, 1-2. 10-14"},"18_miercoles":{"evangelio":"Mt 15, 21-28"},"18_jueves":{"evangelio":"Mt 16, 13-23"},"18_viernes":{"evangelio":"Mt 16, 24-28"},"18_sabado":{"evangelio":"Mt 17, 14-20"},"19_lunes":{"evangelio":"Mt 17, 22-27"},"19_martes":{"evangelio":"Mt 18, 1-5. 10. 12-14"},"19_miercoles":{"evangelio":"Mt 18, 15-20"},"19_jueves":{"evangelio":"Mt 18, 21 — 19, 1"},"19_viernes":{"evangelio":"Mt 19, 3-12"},"19_sabado":{"evangelio":"Mt 19, 13-15"},"20_lunes":{"evangelio":"Mt 19, 16-22"},"20_martes":{"evangelio":"Mt 19, 23-30"},"20_miercoles":{"evangelio":"Mt 20, 1-16"},"20_jueves":{"evangelio":"Mt 22, 1-14"},"20_viernes":{"evangelio":"Mt 22, 34-40"},"20_sabado":{"evangelio":"Mt 23, 1-12"},"21_lunes":{"evangelio":"Mt 23, 13-22"},"21_martes":{"evangelio":"Mt 23, 23-26"},"21_miercoles":{"evangelio":"Mt 23, 27-32"},"21_jueves":{"evangelio":"Mt 24, 42-51"},"21_viernes":{"evangelio":"Mt 25, 1-13"},"21_sabado":{"evangelio":"Mt 25, 14-30"},"22_lunes":{"evangelio":"Lc 4, 16-30"},"22_martes":{"evangelio":"Lc 4, 31-37"},"22_miercoles":{"evangelio":"Lc 4, 38-44"},"22_jueves":{"evangelio":"Lc 5, 1-11"},"22_viernes":{"evangelio":"Lc 5, 33-39"},"22_sabado":{"evangelio":"Lc 6, 1-5"},"23_lunes":{"evangelio":"Lc 6, 6-11"},"23_martes":{"evangelio":"Lc 6, 12-19"},"23_miercoles":{"evangelio":"Lc 6, 20-26"},"23_jueves":{"evangelio":"Lc 6, 27-38"},"23_viernes":{"evangelio":"Lc 6, 39-42"},"23_sabado":{"evangelio":"Lc 6, 43-49"},"24_lunes":{"evangelio":"Lc 7, 1-10"},"24_martes":{"evangelio":"Lc 7, 11-17"},"24_miercoles":{"evangelio":"Lc 7, 31-35"},"24_jueves":{"evangelio":"Lc 7, 36-50"},"24_viernes":{"evangelio":"Lc 8, 1-3"},"24_sabado":{"evangelio":"Lc 8, 4-15"},"25_lunes":{"evangelio":"Lc 8, 16-18"},"25_martes":{"evangelio":"Lc 8, 19-21"},"25_miercoles":{"evangelio":"Lc 9, 1-6"},"25_jueves":{"evangelio":"Lc 9, 7-9"},"25_viernes":{"evangelio":"Lc 9, 18-22"},"25_sabado":{"evangelio":"Lc 9, 43b-45"},"26_lunes":{"evangelio":"Lc 9, 46-50"},"26_martes":{"evangelio":"Lc 9, 51-56"},"26_miercoles":{"evangelio":"Lc 9, 57-62"},"26_jueves":{"evangelio":"Lc 10, 1-12"},"26_viernes":{"evangelio":"Lc 10, 13-16"},"26_sabado":{"evangelio":"Lc 10, 17-24"},"27_lunes":{"evangelio":"Lc 10, 25-37"},"27_martes":{"evangelio":"Lc 10, 38-42"},"27_miercoles":{"evangelio":"Lc 11, 1-4"},"27_jueves":{"evangelio":"Lc 11, 5-13"},"27_viernes":{"evangelio":"Lc 11, 15-26"},"27_sabado":{"evangelio":"Lc 11, 27-28"},"28_lunes":{"evangelio":"Lc 11, 29-32"},"28_martes":{"evangelio":"Lc 11, 37-41"},"28_miercoles":{"evangelio":"Lc 11, 42-46"},"28_jueves":{"evangelio":"Lc 11, 47-54"},"28_viernes":{"evangelio":"Lc 12, 1-7"},"28_sabado":{"evangelio":"Lc 12, 8-12"},"29_lunes":{"evangelio":"Lc 12, 13-21"},"29_martes":{"evangelio":"Lc 12, 35-38"},"29_miercoles":{"evangelio":"Lc 12, 39-48"},"29_jueves":{"evangelio":"Lc 12, 49-53"},"29_viernes":{"evangelio":"Lc 12, 54-59"},"29_sabado":{"evangelio":"Lc 13, 1-9"},"30_lunes":{"evangelio":"Lc 13, 10-17"},"30_martes":{"evangelio":"Lc 13, 18-21"},"30_miercoles":{"evangelio":"Lc 13, 22-30"},"30_jueves":{"evangelio":"Lc 13, 31-35"},"30_viernes":{"evangelio":"Lc 14, 1-6"},"30_sabado":{"evangelio":"Lc 14, 1. 7-11"},"31_lunes":{"evangelio":"Lc 14, 12-14"},"31_martes":{"evangelio":"Lc 14, 15-24"},"31_miercoles":{"evangelio":"Lc 14, 25-33"},"31_jueves":{"evangelio":"Lc 15, 1-10"},"31_viernes":{"evangelio":"Lc 16, 1-8"},"31_sabado":{"evangelio":"Lc 16, 9-15"},"32_lunes":{"evangelio":"Lc 17, 1-6"},"32_martes":{"evangelio":"Lc 17, 7-10"},"32_miercoles":{"evangelio":"Lc 17, 11-19"},"32_jueves":{"evangelio":"Lc 17, 20-25"},"32_viernes":{"evangelio":"Lc 17, 26-37"},"32_sabado":{"evangelio":"Lc 18, 1-8"},"33_lunes":{"evangelio":"Lc 18, 35-43"},"33_martes":{"evangelio":"Lc 19, 1-10"},"33_miercoles":{"evangelio":"Lc 19, 11-28"},"33_jueves":{"evangelio":"Lc 19, 41-44"},"33_viernes":{"evangelio":"Lc 19, 45-48"},"33_sabado":{"evangelio":"Lc 20, 27-40"},"34_lunes":{"evangelio":"Lc 21, 1-4"},"34_martes":{"evangelio":"Lc 21, 5-11"},"34_miercoles":{"evangelio":"Lc 21, 12-19"},"34_jueves":{"evangelio":"Lc 21, 20-28"},"34_viernes":{"evangelio":"Lc 21, 29-33"},"7_lunes":{"evangelio":"Mc 9, 14-29"},"5_sabado":{"evangelio":"Mc 8, 1-10"},"7_viernes":{"evangelio":"Mc 10, 1-12"},"9_lunes":{"evangelio":"Mc 12, 1-12"},"9_viernes":{"evangelio":"Mc 12, 35-37"},"12_miercoles":{"evangelio":"Mt 7, 15-20"}}},"ferial_fuerte":{"adviento_1_lunes":{"primera":"Is 4, 2-6","salmo":"Sal 121, 1-2. 3-4b. 8-9 (R.: cf. 1)","evangelio":"Mt 8, 5-11"},"adviento_1_martes":{"primera":"Is 11, 1-10","salmo":"Sal 71, 1-2. 7-8. 12-13. 17 (R.: cf. 7)","evangelio":"Lc 10, 21-24"},"adviento_1_miercoles":{"primera":"Is 25, 6-10a","salmo":"Sal 22, 1b-3a. 3bc-4. 5. 6 (R.: 6cd)","evangelio":"Mt 15, 29-37"},"adviento_1_jueves":{"primera":"Is 26, 1-6","salmo":"Sal 117, 1 y 8-9. 19-21. 25-27a (R.: 26a)","evangelio":"Mt 7, 21. 24-27"},"adviento_1_viernes":{"primera":"Is 29, 17-24","salmo":"Sal 26, 1bcde. 4. 13-14 (R.: 1b)","evangelio":"Mt 9, 27-31"},"adviento_1_sabado":{"primera":"Is 30, 19-21. 23-26","salmo":"Sal 146, 1bc-2. 3-4. 5-6 (R.: Is 30, 18)","evangelio":"Mt 9, 35 — 10, 1. 5a. 6-8"},"adviento_2_lunes":{"primera":"Is 35, 1-10","salmo":"Sal 84, 9abc y 10. 11-12. 13-14 (R.: Is 35, 4e)","evangelio":"Lc 5, 17-26"},"adviento_2_martes":{"primera":"Is 40, 1-11","salmo":"Sal 95, 1-2. 3 y 10ac. 11-12. 13 (R.: cf. Is 40, 9-10)","evangelio":"Mt 18, 12-14"},"adviento_2_miercoles":{"primera":"Is 40, 25-31","salmo":"Sal 102, 1bc-2. 3-4. 8 y 10 (R.: 1b)","evangelio":"Mt 11, 28-30"},"adviento_2_jueves":{"primera":"Is 41, 13-20","salmo":"Sal 144, 1bc y 9. 10-11. 12-13ab (R.: 8)","evangelio":"Mt 11, 11-15"},"adviento_2_viernes":{"primera":"Is 48, 17-19","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: cf. Jn 8, 12)","evangelio":"Mt 11, 16-19"},"adviento_2_sabado":{"primera":"Eclo 48, 1-4. 9-11b","salmo":"Sal 79, 2ac y 3b. 15-16. 18-19 (R.: 4)","evangelio":"Mt 17, 10-13"},"adviento_3_lunes":{"primera":"Num 24, 2-7. 15-17a","salmo":"Sal 24, 4-5a. 6 y 7cd. 8-9 (R.: 4b)","evangelio":"Mt 21, 23-27"},"adviento_3_martes":{"primera":"Sof 3, 1-2. 9-13","salmo":"Sal 33, 2-3. 6-7. 17-18. 19 y 23 (R.: 7ab)","evangelio":"Mt 21, 28-32"},"adviento_3_miercoles":{"primera":"Is 45, 6c-8. 18. 21b-25","salmo":"Sal 84, 9abc y 10. 11-12. 13-14 (R.: cf. Is 45, 8)","evangelio":"Lc 7, 19-23"},"adviento_3_jueves":{"primera":"Is 54, 1-10","salmo":"Sal 29, 2 y 4. 5-6. 11-12a y 13b (R.: 2a)","evangelio":"Lc 7, 24-30"},"adviento_3_viernes":{"primera":"Is 56, 1-3a. 6-8","salmo":"Sal 66, 2-3. 5. 7-8 (R.: 4)","evangelio":"Jn 5, 33-36"},"navidad_17_dic":{"primera":"Gen 49, 1-2. 8-10","salmo":"Sal 71, 1-2. 3-4ab. 7-8. 17 (R.: cf. 7)","evangelio":"Mt 1, 1-17"},"navidad_18_dic":{"primera":"Jer 23, 5-8","salmo":"Sal 71, 1-2. 12-13. 18-19 (R.: cf. 7)","evangelio":"Mt 1, 18-24"},"navidad_19_dic":{"primera":"Jue 13, 2-7. 24-25a","salmo":"Sal 70, 3-4a. 5-6ab. 16-17 (R.: cf. 8a)","evangelio":"Lc 1, 5-25"},"navidad_20_dic":{"primera":"Is 7, 10-14","salmo":"Sal 23, 1b-2. 3-4ab. 5-6 (R.: cf. 7c. 10c)","evangelio":"Lc 1, 26-38"},"navidad_21_dic":{"primera":"Sof 3, 14-18a","salmo":"Sal 32, 2-3. 11-12. 20-21 (R.: 1a. 3a)","evangelio":"Lc 1, 39-45"},"navidad_22_dic":{"primera":"1 Sam 1, 24-28","salmo":"1 Sam 2, 1. 4-5. 6-7. 8abcd (R.: cf. 1a)","evangelio":"Lc 1, 46-56"},"navidad_23_dic":{"primera":"Mal 3, 1-4. 23-24","salmo":"Sal 24, 4-5a. 8-9. 10 y 14 (R.: Lc 21, 28)","evangelio":"Lc 1, 57-66"},"navidad_24_dic":{"primera":"2 Sam 7, 1-5. 8b-12. 14a. 16","salmo":"Sal 88, 2-3. 4-5. 27 y 29 (R.: cf. 2a)","evangelio":"Lc 1, 67-79","misa_noche":{"primera":"Is 9, 1-6","salmo":"Sal 95, 1-2a. 2b-3. 11-12. 13 (R.: cf. Lc 2, 11)","segunda":"Tit 2, 11-14","evangelio":"Lc 2, 1-14"}},"navidad_29_dic":{"primera":"1 Jn 2, 3-11","salmo":"Sal 95, 1-2a. 2b-3. 5b-6 (R.: 11a)","evangelio":"Lc 2, 22-35"},"navidad_30_dic":{"primera":"1 Jn 2, 12-17","salmo":"Sal 95, 7-8a. 8b-9. 10 (R.: 11a)","evangelio":"Lc 2, 36-40"},"navidad_31_dic":{"primera":"1 Jn 2, 18-21","salmo":"Sal 95, 1-2. 11-12. 13 (R.: 11a)","evangelio":"Jn 1, 1-18"},"ceniza":{"primera":"Jl 2, 12-18","salmo":"Sal 50, 3-4. 5-6ab. 12-13. 14 y 17 (R.: cf. 3a)","segunda":"2 Cor 5, 20 — 6, 2","evangelio":"Mt 6, 1-6. 16-18"},"cuaresma_0_jueves":{"primera":"Dt 30, 15-20","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: Sal 39, 5ab)","evangelio":"Lc 9, 22-25"},"cuaresma_0_viernes":{"primera":"Is 58, 1-9a","salmo":"Sal 50, 3-4. 5-6ab. 18-19 (R.: cf. 19cd)","evangelio":"Mt 9, 14-15"},"cuaresma_0_sabado":{"primera":"Is 58, 9b-14","salmo":"Sal 85, 1b-2. 3-4. 5-6 (R.: 11ab)","evangelio":"Lc 5, 27-32"},"cuaresma_1_lunes":{"primera":"Lev 19, 1-2. 11-18","salmo":"Sal 18, 8. 9. 10. 15 (R.: cf. Jn 6, 63)","evangelio":"Mt 25, 31-46"},"cuaresma_1_martes":{"primera":"Is 55, 10-11","salmo":"Sal 33, 4-5. 6-7. 16-17. 18-19 (R.: cf. 18b)","evangelio":"Mt 6, 7-15"},"cuaresma_1_miercoles":{"primera":"Jon 3, 1-10","salmo":"Sal 50, 3-4. 12-13. 18-19 (R.: 19cd)","evangelio":"Lc 11, 29-32"},"cuaresma_1_jueves":{"primera":"Est 4, 17k. l-z","salmo":"Sal 137, 1bcd-2a. 2bcd-3. 7c-8 (R.: 3a)","evangelio":"Mt 7, 7-12"},"cuaresma_1_viernes":{"primera":"Ez 18, 21-28","salmo":"Sal 129, 1b-2. 3-4. 5-7ab. 7cd-8 (R.: 3)","evangelio":"Mt 5, 20-26"},"cuaresma_1_sabado":{"primera":"Dt 26, 16-19","salmo":"Sal 118, 1-2. 4-5. 7-8 (R.: 1b)","evangelio":"Mt 5, 43-48"},"cuaresma_2_lunes":{"primera":"Dan 9, 4b-10","salmo":"Sal 78, 8. 9. 11. 13 (R.: cf. Sal 102, 10a)","evangelio":"Lc 6, 36-38"},"cuaresma_2_martes":{"primera":"Is 1, 10. 16-20","salmo":"Sal 49, 8-9. 16bc-17. 21 y 23 (R.: 23cd)","evangelio":"Mt 23, 1-12"},"cuaresma_2_miercoles":{"primera":"Jer 18, 18-20","salmo":"Sal 30, 5-6. 14. 15-16 (R.: 17b)","evangelio":"Mt 20, 17-28"},"cuaresma_2_jueves":{"primera":"Jer 17, 5-10","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: Sal 39, 5ab)","evangelio":"Lc 16, 19-31"},"cuaresma_2_viernes":{"primera":"Gen 37, 3-4. 12-13a. 17b-28","salmo":"Sal 104, 16-17. 18-19. 20-21 (R.: 5a)","evangelio":"Mt 21, 33-43. 45-46"},"cuaresma_2_sabado":{"primera":"Miq 7, 14-15. 18-20","salmo":"Sal 102, 1bc-2. 3-4. 9-10. 11-12 (R.: 8a)","evangelio":"Lc 15, 1-3. 11-32"},"cuaresma_3_lunes":{"primera":"2 Re 5, 1-15a","salmo":"Sal 41, 2. 3; 42, 3. 4 (R.: cf. 41, 3)","evangelio":"Lc 4, 24-30"},"cuaresma_3_martes":{"primera":"Dan 3, 25. 34-43","salmo":"Sal 24, 4-5a. 6 y 7cd. 8-9 (R.: 6a)","evangelio":"Mt 18, 21-35"},"cuaresma_3_miercoles":{"primera":"Dt 4, 1. 5-9","salmo":"Sal 147, 12-13. 15-16. 19-20 (R.: 12a)","evangelio":"Mt 5, 17-19"},"cuaresma_3_jueves":{"primera":"Jer 7, 23-28","salmo":"Sal 94, 1-2. 6-7c. 7d-9 (R.: cf. 7d-8a)","evangelio":"Lc 11, 14-23"},"cuaresma_3_viernes":{"primera":"Os 14, 2-10","salmo":"Sal 80, 6c-8a. 8bc-9. 10-11ab. 14 y 17 (R.: cf. 11. 9a)","evangelio":"Mc 12, 28b-34"},"cuaresma_3_sabado":{"primera":"Os 6, 1-6","salmo":"Sal 50, 3-4. 18-19. 20-21ab (R.: Os 6, 6a)","evangelio":"Lc 18, 9-14"},"cuaresma_4_lunes":{"primera":"Is 65, 17-21","salmo":"Sal 29, 2 y 4. 5-6. 11-12a y 13b (R.: 2a)","evangelio":"Jn 4, 43-54"},"cuaresma_4_martes":{"primera":"Ez 47, 1-9. 12","salmo":"Sal 45, 2-3. 5-6. 8-9 (R.: 8)","evangelio":"Jn 5, 1-16"},"cuaresma_4_miercoles":{"primera":"Is 49, 8-15","salmo":"Sal 144, 8-9. 13cd-14. 17-18 (R.: 8a)","evangelio":"Jn 5, 17-30"},"cuaresma_4_jueves":{"primera":"Ex 32, 7-14","salmo":"Sal 105, 19-20. 21-22. 23 (R.: cf. 4ab)","evangelio":"Jn 5, 31-47"},"cuaresma_4_viernes":{"primera":"Sab 2, 1a. 12-22","salmo":"Sal 33, 17-18. 19-20. 21 y 23 (R.: 19a)","evangelio":"Jn 7, 1-2. 10. 25-30"},"cuaresma_4_sabado":{"primera":"Jer 11, 18-20","salmo":"Sal 7, 2-3. 9bc-10. 11-12 (R.: 2a)","evangelio":"Jn 7, 40-53"},"cuaresma_5_lunes":{"primera":{"tieneTexto":true,"cita":"Dan 13, 1-9. 15-17. 19-30. 33-62","forma_breve":"Dan 13, 41c-62"},"salmo":"Sal 22, 1b-3a. 3bc-4. 5. 6 (R.: 4ab)","evangelio":"Jn 8, 12-20"},"cuaresma_5_martes":{"primera":"Num 21, 4-9","salmo":"Sal 101, 2-3. 16-18. 19-21 (R.: 2)","evangelio":"Jn 8, 21-30"},"cuaresma_5_miercoles":{"primera":"Dan 3, 14-20. 91-92. 95","salmo":"Dan 3, 52a y c. 53a. 54a. 55a. 56a (R.: 52b)","evangelio":"Jn 8, 31-42"},"cuaresma_5_jueves":{"primera":"Gen 17, 3-9","salmo":"Sal 104, 4-5. 6-7. 8-9 (R.: 8a)","evangelio":"Jn 8, 51-59"},"cuaresma_5_viernes":{"primera":"Jer 20, 10-13","salmo":"Sal 17, 2-3a. 3bc-4. 5-6. 7 (R.: cf. 7)","evangelio":"Jn 10, 31-42"},"cuaresma_5_sabado":{"primera":"Ez 37, 21-28","salmo":"Jer 31, 10. 11-12ab. 13 (R.: cf. 10d)","evangelio":"Jn 11, 45-57"},"cuaresma_6_lunes":{"primera":"Is 42, 1-7","salmo":"Sal 26, 1bcde. 2. 3. 13-14 (R.: 1b)","evangelio":"Jn 12, 1-11"},"cuaresma_6_martes":{"primera":"Is 49, 1-6","salmo":"Sal 70, 1-2. 3-4a. 5-6ab. 15ab y 17 (R.: cf. 15ab)","evangelio":"Jn 13, 21-33. 36-38"},"cuaresma_6_miercoles":{"primera":"Is 50, 4-9a","salmo":"Sal 68, 8-10. 21-22. 31 y 33-34 (R.: 14c y b)","evangelio":"Mt 26, 14-25"},"pascua_0_lunes":{"primera":"Hch 2, 14. 22-33","salmo":"Sal 15, 1b-2a y 5. 7-8. 9-10. 11 (R.: 1b)","evangelio":"Mt 28, 8-15"},"pascua_0_martes":{"primera":"Hch 2, 36-41","salmo":"Sal 32, 4-5. 18-19. 20 y 22 (R.: 5b)","evangelio":"Jn 20, 11-18"},"pascua_0_miercoles":{"primera":"Hch 3, 1-10","salmo":"Sal 104, 1-2. 3-4. 6-7. 8-9 (R.: 3b)","evangelio":"Lc 24, 13-35"},"pascua_0_jueves":{"primera":"Hch 3, 11-26","salmo":"Sal 8, 2a y 5. 6-7. 8-9 (R.: 2ab)","evangelio":"Lc 24, 35-48"},"pascua_0_viernes":{"primera":"Hch 4, 1-12","salmo":"Sal 117, 1-2 y 4. 22-24. 25-27a (R.: 22)","evangelio":"Jn 21, 1-14"},"pascua_0_sabado":{"primera":"Hch 4, 13-21","salmo":"Sal 117, 1 y 14-15. 16-18. 19-21 (R.: 21a)","evangelio":"Mc 16, 9-15"},"pascua_2_lunes":{"primera":"Hch 4, 23-31","salmo":"Sal 2, 1-3. 4-6. 7-9 (R.: cf. 12e)","evangelio":"Jn 3, 1-8"},"pascua_2_martes":{"primera":"Hch 4, 32-37","salmo":"Sal 92, 1ab. 1c-2. 5 (R.: 1a)","evangelio":"Jn 3, 7b-15"},"pascua_2_miercoles":{"primera":"Hch 5, 17-26","salmo":"Sal 33, 2-3. 4-5. 6-7. 8-9 (R.: 7ab)","evangelio":"Jn 3, 16-21"},"pascua_2_jueves":{"primera":"Hch 5, 27-33","salmo":"Sal 33, 2 y 9. 17-18. 19-20 (R.: 7ab)","evangelio":"Jn 3, 31-36"},"pascua_2_viernes":{"primera":"Hch 5, 34-42","salmo":"Sal 26, 1bcde. 4. 13-14 (R.: cf. 4ac)","evangelio":"Jn 6, 1-15"},"pascua_2_sabado":{"primera":"Hch 6, 1-7","salmo":"Sal 32, 1-2. 4-5. 18-19 (R.: 22)","evangelio":"Jn 6, 16-21"},"pascua_3_lunes":{"primera":"Hch 6, 8-15","salmo":"Sal 118, 23-24. 26-27. 29-30 (R.: 1b)","evangelio":"Jn 6, 22-29"},"pascua_3_martes":{"primera":"Hch 7, 51 — 8, 1a","salmo":"Sal 30, 3cd-4. 6 y 7b y 8a. 17 y 21ab (R.: 6a)","evangelio":"Jn 6, 30-35"},"pascua_3_miercoles":{"primera":"Hch 8, 1b-8","salmo":"Sal 65, 1b-3a. 4-5. 6-7a (R.: 1b)","evangelio":"Jn 6, 35-40"},"pascua_3_jueves":{"primera":"Hch 8, 26-40","salmo":"Sal 65, 8-9. 16-17. 20 (R.: 1b)","evangelio":"Jn 6, 44-51"},"pascua_3_viernes":{"primera":"Hch 9, 1-20","salmo":"Sal 116, 1. 2 (R.: Mc 16, 15)","evangelio":"Jn 6, 52-59"},"pascua_3_sabado":{"primera":"Hch 9, 31-42","salmo":"Sal 115, 12-13. 14-15. 16-17 (R.: 12)","evangelio":"Jn 6, 60-69"},"pascua_4_lunes":{"primera":"Hch 11, 1-18","salmo":"Sal 41, 2-3; 42, 3. 4 (R.: cf. Sal 41, 3a)","evangelio":"Jn 10, 11-18"},"pascua_4_martes":{"primera":"Hch 11, 19-26","salmo":"Sal 86, 1b-3. 4-5. 6-7 (R.: 116, 1a)","evangelio":"Jn 10, 22-30"},"pascua_4_miercoles":{"primera":"Hch 12, 24 — 13, 5a","salmo":"Sal 66, 2-3. 5. 6 y 8 (R.: 4)","evangelio":"Jn 12, 44-50"},"pascua_4_jueves":{"primera":"Hch 13, 13-25","salmo":"Sal 88, 2-3. 21-22. 25 y 27 (R.: cf. 2a)","evangelio":"Jn 13, 16-20"},"pascua_4_viernes":{"primera":"Hch 13, 26-33","salmo":"Sal 2, 6-7. 8-9. 10-11 y 12a (R.: 7bc)","evangelio":"Jn 14, 1-6"},"pascua_4_sabado":{"primera":"Hch 13, 44-52","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4 (R.: 3cd)","evangelio":"Jn 14, 7-14"},"pascua_5_lunes":{"primera":"Hch 14, 5-18","salmo":"Sal 113 B, 1-2. 3-4. 15-16 (R.: 1ab)","evangelio":"Jn 14, 21-26"},"pascua_5_martes":{"primera":"Hch 14, 19-28","salmo":"Sal 144, 10-11. 12-13ab. 21 (R.: cf. 12)","evangelio":"Jn 14, 27-31a"},"pascua_5_miercoles":{"primera":"Hch 15, 1-6","salmo":"Sal 121, 1bc-2. 3-4b. 4c-5 (R.: cf. 1bc)","evangelio":"Jn 15, 1-8"},"pascua_5_jueves":{"primera":"Hch 15, 7-21","salmo":"Sal 95, 1-2a. 2b-3. 10 (R.: cf. 3)","evangelio":"Jn 15, 9-11"},"pascua_5_viernes":{"primera":"Hch 15, 22-31","salmo":"Sal 56, 8-9. 10-12 (R.: 10a)","evangelio":"Jn 15, 12-17"},"pascua_5_sabado":{"primera":"Hch 16, 1-10","salmo":"Sal 99, 1-2. 3. 5 (R.: 1)","evangelio":"Jn 15, 18-21"},"pascua_6_lunes":{"primera":"Hch 16, 11-15","salmo":"Sal 149, 1bc-2. 3-4. 5-6a y 9b (R.: 4a)","evangelio":"Jn 15, 26 — 16, 4a"},"pascua_6_martes":{"primera":"Hch 16, 22-34","salmo":"Sal 137, 1bcd-2a. 2bcd-3. 7c-8 (R.: 7c)","evangelio":"Jn 16, 5-11"},"pascua_6_miercoles":{"primera":"Hch 17, 15. 22 — 18, 1","salmo":"Sal 148, 1bc-2. 11-12. 13. 14 (R.: cf. Is 6, 3c)","evangelio":"Jn 16, 12-15"},"pascua_6_jueves":{"primera":"Hch 18, 1-8","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4 (R.: cf. 2b)","evangelio":"Jn 16, 16-20"},"pascua_6_viernes":{"primera":"Hch 18, 9-18","salmo":"Sal 46, 2-3. 4-5. 6-7 (R.: 8a)","evangelio":"Jn 16, 20-23a"},"pascua_6_sabado":{"primera":"Hch 18, 23-28","salmo":"Sal 46, 2-3. 8-9. 10 (R.: 8a)","evangelio":"Jn 16, 23b-28"},"pascua_7_lunes":{"primera":"Hch 19, 1-8","salmo":"Sal 67, 2-3. 4-5ac. 6-7ab (R.: 33a)","evangelio":"Jn 16, 29-33"},"pascua_7_martes":{"primera":"Hch 20, 17-27","salmo":"Sal 67, 10-11. 20-21 (R.: 33a)","evangelio":"Jn 17, 1-11a"},"pascua_7_miercoles":{"primera":"Hch 20, 28-38","salmo":"Sal 67, 29-30. 33-35a. 35bc y 36d (R.: 33a)","evangelio":"Jn 17, 11b-19"},"pascua_7_jueves":{"primera":"Hch 22, 30; 23, 6-11","salmo":"Sal 15, 1b-2a y 5. 7-8. 9-10. 11 (R.: 1b)","evangelio":"Jn 17, 20-26"},"pascua_7_viernes":{"primera":"Hch 25, 13b-21","salmo":"Sal 102, 1bc-2. 11-12. 19-20ab (R.: 19a)","evangelio":"Jn 21, 15-19"},"pascua_7_sabado":{"primera":"Hch 28, 16-20. 30-31","salmo":"Sal 10, 4. 5 y 7 (R.: cf. 7b)","evangelio":"Jn 21, 20-25"},"maria_madre_iglesia":{"primera":"Gen 3, 9-15. 20","primera_alt":"Hch 1, 12-14","salmo":"Sal 86, 1b-2. 3 y 5. 6-7 (R.: 3)","evangelio":"Jn 19, 25-34"},"navidad_2_ene":{"primera":"1 Jn 2, 22-28","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4 (R.: 3cd)","evangelio":"Jn 1, 19-28"},"navidad_3_ene":{"primera":"1 Jn 2, 29 — 3, 6","salmo":"Sal 97, 1bcde. 3cd-4. 5-6 (R.: 3cd)","evangelio":"Jn 1, 29-34"},"navidad_4_ene":{"primera":"1 Jn 3, 7-10","salmo":"Sal 97, 1bcde. 7-8. 9 (R.: 3cd)","evangelio":"Jn 1, 35-42"},"navidad_7_ene":{"primera":"1 Jn 5, 14-21","salmo":"Sal 149, 1bc-2. 3-4. 5-6a y 9b (R.: 4a)","evangelio":"Jn 2, 1-11"},"navidad_8_ene":{"primera":"1 Jn 4, 7-10","salmo":"Sal 71, 1-2. 3-4ab. 7-8 (R.: cf. 11)","evangelio":"Mc 6, 34-44"},"navidad_9_ene":{"primera":"1 Jn 4, 11-18","salmo":"Sal 71, 1-2. 10-11. 12-13 (R.: cf. 11)","evangelio":"Mc 6, 45-52"},"navidad_10_ene":{"primera":"1 Jn 4, 19 — 5, 4","salmo":"Sal 71, 1-2. 14 y 15bc. 17 (R.: cf. 11)","evangelio":"Lc 4, 14-22a"},"navidad_11_ene":{"primera":"1 Jn 5, 5-13","salmo":"Sal 147, 12-13. 14-15. 19-20 (R.: 12a)","evangelio":"Lc 5, 12-16"},"navidad_5_ene":{"primera":"1 Jn 3, 11-21","salmo":"Sal 99, 1-2. 3. 4. 5 (R.: 1)","evangelio":"Jn 1, 43-51"}},"santos":{"01-02":{"tieneComunRef":true},"01-07":{"tieneComunRef":true,"primera_alt":"2 Cor 5, 14-20","evangelio_alt":"Lc 12, 35-40","salmo_alt":"Sal 102, 1b-2. 3-4. 8-9. 13-14. 17-18a (R.: 1b)"},"01-09":{"tieneComunRef":true,"primera":"Flp 1, 21-30"},"01-13":{"tieneComunRef":true,"primera":"1 Jn 2, 18-25","salmo":"Sal 109, 1bcde. 2. 3. 4 (R.: 4bc)","evangelio_alt":"Mt 5, 13-19"},"01-17":{"tieneComunRef":true,"evangelio":"Mt 19, 16-26","primera_alt":"Ef 6, 10-13. 18"},"01-20":{"tieneComunRef":true,"primera_alt":"1 Pe 3, 14-17"},"01-21":{"tieneComunRef":true,"primera_alt":"1 Cor 1, 26-31"},"01-22":{"tieneComunRef":true,"primera_alt":"2 Cor 4, 7-15"},"01-23":{"tieneComunRef":true},"01-24":{"tieneComunRef":true,"primera_alt":"Ef 3, 8-12"},"01-25":{"primera":"Hch 9, 1-22","salmo":"Sal 116, 1. 2 (R.: Mc 16, 15)","evangelio":"Mc 16, 15-18"},"01-26":{"primera":"Tit 1, 1-5","salmo":"Sal 95, 1-2a. 2b-3. 7-8a. 10 (R.: cf. 3)","evangelio":"Lc 10, 1-9","primera_obligatoria":true},"01-27":{"tieneComunRef":true,"primera_alt":"1 Pe 4, 7b-11"},"01-28":{"tieneComunRef":true,"primera_alt":"Sab 7, 7-10. 15-16"},"01-31":{"tieneComunRef":true,"primera_alt":"Flp 4, 4-9","segunda_alt":"Heb 2, 14-18","evangelio_alt":"Lc 2, 27-35"},"02-03":{"tieneComunRef":true,"primera_alt":"Is 52, 7-10","evangelio_alt":"Mc 1, 14-20"},"02-05":{"tieneComunRef":true,"primera_alt":"1 Cor 1, 26-31","evangelio_alt":"Lc 9, 23-26"},"02-06":{"tieneComunRef":true,"primera_alt":"Gal 2, 19-20","evangelio_alt":"Mt 28, 16-20","salmo_alt":"Sal 125, 1b-2ab. 2cd-3. 4-5. 6 (R.: 5)","aclamacion_alt":"Mt 28, 19a. 20b"},"02-08":{"tieneComunRef":true,"evangelio":"Mc 10, 17-30","primera_alt":"Tob 12, 6b-13"},"02-10":{"tieneComunRef":true,"primera_alt":"Cant 8, 6-7"},"02-11":{"tieneComunRef":true,"primera":"Is 66, 10-14c","salmo":"Jdt 13, 18bcde. 19 (R.: 15, 9d)","evangelio_alt":"Jn 2, 1-11"},"02-14":{"primera":"Hch 13, 46-49","salmo":"Sal 116, 1. 2 (R.: Mc 16, 15)","evangelio":"Lc 10, 1-9"},"02-17":{"tieneComunRef":true,"primera_alt":"Rom 8, 26-30"},"02-21":{"tieneComunRef":true,"primera_alt":"2 Tim 4, 1-5","evangelio_alt":"Jn 15, 1-8"},"02-22":{"primera":"1 Pe 5, 1-4","salmo":"Sal 22, 1b-3a. 3b-4. 5. 6 (R.: 1b)","evangelio":"Mt 16, 13-19"},"02-23":{"tieneComunRef":true,"primera":"Ap 2, 8-11","salmo":"Sal 30, 3cd-4. 6 y 8ab. 16b y 17 (R.: 6a)"},"03-04":{"tieneComunRef":true,"primera_alt":"Flp 3, 8-14"},"03-07":{"tieneComunRef":true,"primera_alt":"Rom 8, 31b-39"},"03-08":{"tieneComunRef":true,"primera_alt":"1 Jn 3, 14-18"},"03-09":{"tieneComunRef":true,"primera_alt":"Prov 31, 10-13. 19-20. 30-31"},"03-17":{"primera":"1 Pe 4, 7b-11","salmo":"Sal 95, 1-2a. 2b-3. 7-8a. 10 (R.: cf. 3)"},"03-18":{"tieneComunRef":true,"primera_alt":"1 Jn 5, 1-5"},"03-19":{"primera":"2 Sam 7, 4-5a. 12-14a. 16","salmo":"Sal 88, 2-3. 4-5. 27 y 29 (R.: 37a)","segunda":"Rom 4, 13. 16-18. 22","evangelio":"Lc 2, 41-51a"},"03-23":{"tieneComunRef":true,"primera_alt":"2 Tim 1, 13-14; 2, 1-3"},"03-25":{"primera":"Is 7, 10-14; 8, 10b","salmo":"Sal 39, 7-8a. 8b-9. 10. 11 (R.: cf. 8a y 9a)","segunda":"Heb 10, 4-10","evangelio":"Lc 1, 26-38"},"04-02":{"tieneComunRef":true,"primera_alt":"Flp 3, 8-14"},"04-05":{"tieneComunRef":true,"primera_alt":"2 Tim 4, 1-5"},"04-07":{"tieneComunRef":true,"primera_alt":"2 Tim 1, 13-14; 2, 1-3","evangelio_alt":"Mt 18, 1-5"},"04-11":{"tieneComunRef":true,"primera_alt":"Ap 12, 10-12a"},"04-13":{"tieneComunRef":true,"primera_alt":"2 Tim 2, 8-13; 3, 10-12"},"04-21":{"tieneComunRef":true,"primera_alt":"Ef 3, 14-19"},"04-23":{"tieneComunRef":true,"primera_alt":"Ap 21, 5-7","evangelio_alt":"Lc 9, 23-26"},"04-24":{"tieneComunRef":true,"primera_alt":"Col 1, 24-29"},"04-25":{"primera":"1 Pe 5, 5b-14","salmo":"Sal 88, 2-3. 6-7. 16-17 (R.: cf. 2a)","evangelio":"Mc 16, 15-20"},"04-26":{"tieneComunRef":true,"primera":"1 Cor 2, 1-10","salmo":"Sal 118, 99-100. 101-102. 103-104 (R.: 105)","evangelio":"Mt 5, 13-16"},"04-28":{"tieneComunRef":true,"primera_alt":"1 Cor 1, 18-25"},"04-29":{"tieneComunRef":true,"primera":"1 Jn 1, 5 — 2, 2","salmo":"Sal 102, 1b-2. 3-4. 8-9. 13-14. 17-18a (R.: 1b)","evangelio":"Mt 11, 25-30"},"04-30":{"tieneComunRef":true,"primera_alt":"1 Cor 4, 1-5"},"05-01":{"primera":"Col 3, 14-15. 17. 23-24","salmo":"Sal 89, 2. 3-4. 12-13. 14 y 16 (R.: 17c)","evangelio":"Mt 13, 54-58"},"05-02":{"tieneComunRef":true,"evangelio":"Mt 10, 22-25a","primera_alt":"1 Jn 5, 1-5","salmo_alt":"Sal 36, 3-4. 5-6. 30-31 (R.: 30a)"},"05-03":{"primera":"1 Cor 15, 1-8","salmo":"Sal 18, 2-3. 4-5b (R.: 5a)","evangelio":"Jn 14, 6-14"},"05-10":{"tieneComunRef":true,"primera":"Hch 13, 46-49","evangelio":"Mt 5, 13-19"},"05-12":{"tieneComunRef":true,"primera_alt":"Ap 19, 1. 5-9a","evangelio_alt":"Mt 11, 25-30"},"05-14":{"primera":"Hch 1, 15-17. 20-26","salmo":"Sal 112, 1b-2. 3-4. 5-6. 7-8 (R.: cf. 8)","evangelio":"Jn 15, 9-17"},"05-15":{"primera":"Gen 1, 1-2. 11-13. 26-28","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: 2a)","evangelio":"Jn 15, 1-7"},"05-17":{"primera":"1 Cor 1, 26-31","salmo":"Sal 1, 1-2. 3. 4 y 6 (R.: 2a)","evangelio":"Mt 11, 25-30"},"05-18":{"primera":"Ap 3, 14b. 20-22"},"05-20":{"tieneComunRef":true,"primera":"Hch 4, 8-12","salmo":"Sal 39, 2 y 4ab. 7-8a. 8b-9. 10 (R.: cf. 8a y 9a)","evangelio_alt":"Lc 9, 57-62"},"05-22":{"tieneComunRef":true,"primera_alt":"Prov 31, 10-13. 19-20. 30-31","evangelio_alt":"Mc 9, 34-37"},"05-25":{"tieneComunRef":true,"primera_alt":"1 Cor 7, 25-35"},"05-26":{"tieneComunRef":true,"primera_alt":"Flp 4, 4-9"},"05-27":{"tieneComunRef":true,"primera_alt":"1 Tes 2, 2b-8"},"05-30":{"tieneComunRef":true,"evangelio":"Lc 10, 17-20","primera_alt":"Eclo 3, 17-25"},"05-31":{"primera":"Sof 3, 14-18","salmo":"Is 12, 2-3. 4bcde. 5-6 (R.: 6b)","evangelio":"Lc 1, 39-56","tieneComunRef":true},"06-02":{"primera":"2 Cor 6, 4-10","salmo":"Sal 123, 2-3. 4-5. 7c-8 (R.: 7ab)"},"06-03":{"tieneComunRef":true,"primera_alt":"2 Mac 7, 1-2. 9-14"},"06-05":{"tieneComunRef":true,"primera_alt":"Hch 26, 19-23"},"06-06":{"tieneComunRef":true,"primera_alt":"Ez 34, 11-16"},"06-09":{"tieneComunRef":true,"primera_alt":"Col 3, 12-17"},"06-11":{"primera":"Hch 11, 21b-26; 13, 1-3","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4. 5-6 (R.: 2b)","evangelio":"Mt 10, 7-13","primera_obligatoria":true},"06-13":{"tieneComunRef":true,"primera_alt":"Is 61, 1-3a"},"06-15":{"tieneComunRef":true},"06-19":{"tieneComunRef":true,"primera_alt":"Flp 3, 8-14"},"06-21":{"tieneComunRef":true,"primera_alt":"1 Jn 5, 1-5"},"06-22":{"primera":"1 Pe 4, 12-19","salmo":"Sal 39, 2 y 4ab. 7-8a. 8b-9. 10 (R.: cf. 8a y 9a)","evangelio":"Lc 12, 32-34"},"06-24":{"primera":"Is 49, 1-6","salmo":"Sal 138, 1b-3. 13-14ab. 14c-15 (R.: cf. 14a)","segunda":"Hch 13, 22-26","evangelio":"Lc 1, 57-66. 80"},"06-26":{"tieneComunRef":true},"06-27":{"tieneComunRef":true,"primera_alt":"2 Tim 4, 1-5"},"06-28":{"tieneComunRef":true,"primera":"2 Tim 2, 22b-26","salmo":"Sal 36, 3-4. 5-6. 30-31 (R.: 30a)","evangelio_alt":"Jn 17, 20-26"},"06-29":{"primera":"Hch 12, 1-11","salmo":"Sal 33, 2-3. 4-5. 6-7. 8-9 (R.: 5b)","segunda":"2 Tim 4, 6-8. 17-18","evangelio":"Mt 16, 13-19"},"06-30":{"tieneComunRef":true,"evangelio":"Mt 24, 4-13","primera_alt":"Is 61, 9-11","salmo_alt":"Sal 123, 2-3. 4-5. 7c-8 (R.: 7ab)"},"07-03":{"primera":"Ef 2, 19-22","salmo":"Sal 116, 1. 2 (R.: Mc 16, 15)","evangelio":"Jn 20, 24-29"},"07-04":{"tieneComunRef":true,"primera_alt":"1 Jn 3, 14-18","evangelio_alt":"Mt 25, 31-46"},"07-05":{"tieneComunRef":true,"primera_alt":"2 Tim 1, 13-14; 2, 1-3","evangelio_alt":"Mc 10, 13-16"},"07-06":{"tieneComunRef":true,"primera":"1 Cor 6, 13c-15a. 17-20","salmo":"Sal 30, 3cd-4. 6 y 8ab. 16b y 17 (R.: 6a)","evangelio_alt":"Jn 12, 24-26"},"07-11":{"primera":"Prov 2, 1-9","salmo":"Sal 33, 2-3. 4-5. 6-7. 8-9. 10-11 (R.: 2a; 9a)","evangelio":"Mt 19, 27-29"},"07-13":{"tieneComunRef":true,"primera_alt":"Miq 6, 6-8"},"07-14":{"tieneComunRef":true,"primera_alt":"1 Jn 3, 14-18"},"07-15":{"tieneComunRef":true,"primera_alt":"Ef 3, 14-19"},"07-16":{"tieneComunRef":true,"primera_alt":"Zac 2, 14-17"},"07-21":{"tieneComunRef":true,"primera_alt":"2 Cor 4, 1-2. 5-7"},"07-22":{"primera":"2 Cor 5, 14-17","salmo":"Sal 62, 2. 3-4. 5-6. 8-9 (R.: cf. 2b)","evangelio":"Jn 20, 1-2. 11-18"},"07-23":{"tieneComunRef":true,"primera":"Gal 2, 19-20","salmo":"Sal 33, 2-3. 4-5. 6-7. 8-9. 10-11 (R.: 2a; 9a)","evangelio":"Jn 15, 1-8"},"07-25":{"primera":"Hch 4, 33; 5, 12. 27-33; 12, 2","salmo":"Sal 66, 2-3. 5. 7-8 (R.: 4)","segunda":"2 Cor 4, 7-15","evangelio":"Mt 20, 20-28"},"07-26":{"primera":"Eclo 44, 1. 10-15","salmo":"Sal 131, 11. 13-14. 17-18 (R.: Lc 1, 32b)","evangelio":"Mt 13, 16-17"},"07-29":{"tieneComunRef":true,"evangelio":"Lc 10, 38-42","evangelio_propio":true,"primera_alt":"1 Jn 4, 7-16"},"07-30":{"tieneComunRef":true,"primera_alt":"Ef 3, 8-12"},"07-31":{"tieneComunRef":true,"primera":"1 Cor 10, 31 — 11, 1","salmo":"Sal 33, 2-3. 4-5. 6-7. 8-9. 10-11 (R.: 2a; 9a)","evangelio_alt":"Lc 14, 25-33"},"08-01":{"tieneComunRef":true,"primera":"Rom 8, 1-4","salmo":"Sal 118, 9. 10. 11. 12. 13. 14 (R.: 12b)","evangelio_alt":"Mt 5, 13-19"},"08-02":{"tieneComunRef":true,"primera_alt":"1 Jn 5, 1-5"},"08-04":{"tieneComunRef":true,"evangelio":"Mt 9, 35 — 10, 1","evangelio_propio":true,"primera_alt":"Ez 3, 16-21","salmo_alt":"Sal 116, 1. 2 (R.: Mc 16, 15)"},"08-05":{"tieneComunRef":true,"primera_alt":"Ap 21, 1-5a"},"08-06":{"primera":"Dan 7, 9-10. 13-14","salmo":"Sal 96, 1-2. 5-6. 9 (R.: 1a. 9b)","segunda":"2 Pe 1, 16-19","evangelio":"Lc 9, 28b-36"},"08-07":{"tieneComunRef":true,"primera_alt":"Eclo 2, 7-11"},"08-08":{"tieneComunRef":true,"primera_alt":"1 Cor 2, 1-10a"},"08-10":{"primera":"2 Cor 9, 6-10","salmo":"Sal 111, 1b-2. 5-6. 7-8. 9 (R.: 5a)","evangelio":"Jn 12, 24-26"},"08-11":{"tieneComunRef":true,"primera_alt":"Flp 3, 8-14"},"08-13":{"tieneComunRef":true,"primera_alt":"1 Pe 4, 12-19"},"08-14":{"tieneComunRef":true,"primera":"1 Jn 3, 13-18","salmo":"Sal 30, 3cd-4. 6 y 8ab. 16b y 17 (R.: 6a)","evangelio_alt":"Jn 15, 9-17"},"08-15":{"primera":"Ap 11, 19a; 12, 1-6a. 10ab","salmo":"Sal 44, 10. 11. 12. 16 (R.: 10b)","segunda":"1 Cor 15, 20-27a","evangelio":"Lc 1, 39-56"},"08-16":{"tieneComunRef":true,"primera_alt":"Dt 6, 3-9","evangelio_alt":"Mt 25, 14-30"},"08-19":{"tieneComunRef":true,"primera_alt":"Ef 3, 14-19","evangelio_alt":"Mt 11, 25-30","salmo_alt":"Sal 130, 1bcde. 2. 3"},"08-20":{"tieneComunRef":true,"primera_alt":"Eclo 15, 1-6"},"08-21":{"tieneComunRef":true,"primera_alt":"1 Tes 2, 2b-8","evangelio_alt":"Jn 21, 15-17","salmo_alt":"Sal 88, 2-3. 4-5. 21-22. 25 y 27 (R.: cf. 2a)"},"08-22":{"tieneComunRef":true,"primera_alt":"Is 9, 1-6","evangelio_alt":"Lc 1, 26-38","salmo_alt":"Sal 112, 1b-2. 3-4. 5-6. 7-8 (R.: cf. 2)","aclamacion_alt":"Cf. Lc 1, 28. 42"},"08-23":{"tieneComunRef":true,"primera_alt":"2 Cor 10, 17 — 11, 2"},"08-24":{"primera":"Ap 21, 9b-14","salmo":"Sal 144, 10-11. 12-13ab. 17-18 (R.: cf. 12)","evangelio":"Jn 1, 45-51"},"08-25":{"tieneComunRef":true,"primera_alt":"1 Cor 12, 31 — 13, 13","evangelio_alt":"Mt 18, 1-5"},"08-26":{"tieneComunRef":true,"primera_alt":"Is 58, 6-11","evangelio_alt":"Mt 25, 31-46","salmo_alt":"Sal 150, 1bc. 2. 3. 4. 5 (R.: 1b)"},"08-27":{"tieneComunRef":true,"evangelio":"Lc 7, 11-17","primera_alt":"Eclo 26, 1-4. 13-16","salmo_alt":"Sal 130, 1bcde. 2. 3"},"08-28":{"tieneComunRef":true,"primera_alt":"1 Jn 4, 7-16","evangelio_alt":"Mt 23, 8-12","aclamacion_alt":"Mt 23, 9b. 10b"},"08-29":{"primera":"Jer 1, 17-19","salmo":"Sal 70, 1-2. 3-4a. 5-6ab. 15ab y 17 (R.: cf. 15ab)","evangelio":"Mc 6, 17-29"},"09-03":{"tieneComunRef":true,"primera_alt":"2 Cor 4, 1-2. 5-7"},"09-08":{"primera":"Rom 8, 28-30","salmo":"Sal 12, 6ab. 6c (R.: Is 61, 10a)","evangelio":{"tieneTexto":true,"cita":"Mt 1, 1-16. 18-23","forma_breve":"Mt 1, 18-23"}},"09-13":{"tieneComunRef":true,"primera_alt":"Ef 4, 1-7. 11-13","evangelio_alt":"Mc 4, 1-10. 13-20"},"09-14":{"primera":"Num 21, 4b-9","salmo":"Sal 77, 1b-2. 34-35. 36-37. 38 (R.: cf. 7b)","segunda":"Flp 2, 6-11","evangelio":"Jn 3, 13-17"},"09-15":{"primera":"Heb 5, 7-9","salmo":"Sal 30, 2-3a. 3bc-4. 5-6. 15-16. 20 (R.: 17b)","evangelio":"Lc 2, 33-35"},"09-16":{"tieneComunRef":true,"primera_alt":"2 Cor 4, 7-15"},"09-17":{"tieneComunRef":true,"primera_alt":"Sab 7, 7-10. 15-16"},"09-19":{"tieneComunRef":true,"primera_alt":"Heb 10, 32-36"},"09-20":{"tieneComunRef":true,"primera_alt":"Sab 3, 1-9"},"09-21":{"primera":"Ef 4, 1-7. 11-13","salmo":"Sal 18, 2-3. 4-5b (R.: 5a)","evangelio":"Mt 9, 9-13"},"09-26":{"primera":"Sab 3, 1-9","salmo":"Sal 125, 1b-2ab. 2cd-3. 4-5. 6 (R.: 5)"},"09-27":{"tieneComunRef":true,"primera_alt":"1 Cor 1, 26-31","evangelio_alt":"Mt 9, 35-38","salmo_alt":"Sal 111, 1b-2. 3-4. 5-7a. 7b-8. 9 (R.: 1b)"},"09-28":{"tieneComunRef":true,"primera_alt":"1 Pe 3, 14-17"},"09-29":{"primera":"Ap 12, 7-12a","salmo":"Sal 137, 1bcd-2a. 2bcd-3. 4-5 (R.: 1d)","evangelio":"Jn 1, 47-51"},"09-30":{"tieneComunRef":true,"primera":"2 Tim 3, 14-17","salmo":"Sal 118, 9. 10. 11. 12. 13. 14 (R.: 12b)","evangelio_alt":"Mt 13, 47-52"},"10-01":{"tieneComunRef":true,"primera_alt":"Is 66, 10-14c","evangelio_alt":"Mt 18, 1-5","salmo_alt":"Sal 130, 1bcde. 2. 3","aclamacion_alt":"Cf. Mt 11, 25"},"10-02":{"primera":"Ex 23, 20-23","salmo":"Sal 90, 1-2. 3-4. 5-6. 10-11 (R.: 11)","evangelio":"Mt 18, 1-5. 10"},"10-03":{"tieneComunRef":true,"primera":"Flp 3, 7-14","salmo":"Sal 39, 2 y 4ab. 7-8a. 8b-9. 10 (R.: cf. 8a y 9a)","evangelio":"Lc 18, 9-14"},"10-04":{"tieneComunRef":true,"primera":"Gal 6, 14-18","salmo":"Sal 15, 1b-2a y 5. 7-8. 11 (R.: cf. 5a)","evangelio_alt":"Mt 11, 25-30","aclamacion_alt":"Cf. Mt 11, 25"},"10-05":{"primera":"Est 4, 17a-17c. 17g-17h","salmo":"Sal 24, 1b-3. 4-5. 6-7 (R.: 2a)","segunda":"Sant 5, 13-18","evangelio":"Lc 18, 1-8"},"10-06":{"tieneComunRef":true,"primera_alt":"Flp 3, 8-14"},"10-07":{"tieneComunRef":true,"primera_alt":"Hch 1, 12-14","evangelio_alt":"Lc 1, 26-38","aclamacion_alt":"Cf. Lc 1, 28. 42"},"10-09":{"tieneComunRef":true,"primera_alt":"2 Cor 4, 1-2. 5-7","evangelio_alt":"Lc 5, 1-11"},"10-10":{"primera":"2 Tim 4, 1-5"},"10-11":{"tieneComunRef":true,"primera_alt":"1 Jn 4, 7-16"},"10-12":{"primera":"Hch 1, 12-14","salmo":"Sal 26, 1bcde. 3. 4. 5","evangelio":"Lc 11, 27-28"},"10-14":{"tieneComunRef":true,"primera_alt":"1 Pe 5, 1-4"},"10-15":{"tieneComunRef":true,"primera":"Eclo 15, 1-6","salmo":"Sal 88, 2-3. 6-7. 8-9. 16-17. 18-19 (R.: 2a)","evangelio":"Mt 11, 25-30","evangelio_propio":true},"10-16":{"tieneComunRef":true,"primera_alt":"Eclo 26, 1-4. 13-16","evangelio_alt":"Mt 11, 25-30"},"10-17":{"tieneComunRef":true,"primera":"Flp 3, 17 — 4, 1","salmo":"Sal 33, 2-3. 4-5. 6-7. 8-9 (R.: 5b)","evangelio_alt":"Jn 12, 24-26","aclamacion_alt":"Sant 1, 12a"},"10-18":{"primera":"2 Tim 4, 10-17b","salmo":"Sal 144, 10-11. 12-13ab. 17-18 (R.: cf. 12)","evangelio":"Lc 10, 1-9"},"10-19":{"tieneComunRef":true,"primera_alt":"2 Cor 4, 7-15","evangelio_alt":"Mt 16, 24-27"},"10-23":{"tieneComunRef":true,"primera_alt":"2 Cor 5, 14-20"},"10-24":{"tieneComunRef":true,"primera_alt":"Is 52, 7-10"},"10-28":{"primera":"Ef 2, 19-22","salmo":"Sal 18, 2-3. 4-5b (R.: 5a)","evangelio":"Lc 6, 12-19"},"11-01":{"primera":"Ap 7, 2-4. 9-14","salmo":"Sal 23, 1b-2. 3-4ab. 5-6 (R.: cf. 6)","segunda":"1 Jn 3, 1-3","evangelio":"Mt 5, 1-12a"},"11-02":{"primera":"Rom 14, 7-9. 10c-12","salmo":"Sal 102, 8 y 10. 13-14. 15-16. 17-18 (R.: 8a; 36, 39a)","evangelio":"Mt 25, 31-46"},"11-03":{"tieneComunRef":true,"primera_alt":"Flp 4, 4-9"},"11-04":{"tieneComunRef":true,"primera_alt":"Rom 12, 3-13"},"11-09":{"primera":"Ez 47, 1-2. 8-9. 12","salmo":"Sal 45, 2-3. 5-6. 8-9 (R.: 5)","segunda":"1 Cor 3, 9c-11. 16-17","evangelio":"Jn 2, 13-22"},"11-10":{"tieneComunRef":true,"primera_alt":"Eclo 39, 6-10"},"11-11":{"tieneComunRef":true,"primera_alt":"Is 61, 1-3a","evangelio_alt":"Mt 25, 31-46","aclamacion_alt":"Jn 13, 34"},"11-12":{"tieneComunRef":true,"primera_alt":"Ef 4, 1-7. 11-13"},"11-13":{"tieneComunRef":true},"11-15":{"tieneComunRef":true,"primera_alt":"Eclo 15, 1-6","evangelio_alt":"Mt 13, 47-52"},"11-16":{"tieneComunRef":true,"primera_alt":"Is 58, 6-11","evangelio_alt":"Jn 15, 1-8"},"11-17":{"tieneComunRef":true,"primera_alt":"1 Jn 3, 14-18","evangelio_alt":"Lc 6, 27-38"},"11-18":{"primera":"Hch 28, 11-16. 30-31","salmo":"Sal 97, 1bcde. 2-3ab. 3cd-4. 5-6 (R.: 2b)","evangelio":"Mt 14, 22-33"},"11-21":{"tieneComunRef":true,"primera_alt":"Zac 2, 14-17"},"11-22":{"tieneComunRef":true,"primera_alt":"Os 2, 16b. 17de. 21-22"},"11-23":{"tieneComunRef":true,"primera_alt":"Is 52, 7-10"},"11-24":{"tieneComunRef":true,"primera_alt":"Sab 3, 1-9","evangelio_alt":"Mt 10, 17-22"},"11-30":{"primera":"Rom 10, 9-18","salmo":"Sal 18, 2-3. 4-5b (R.: 5a)","evangelio":"Mt 4, 18-22"},"12-03":{"tieneComunRef":true,"primera_alt":"1 Cor 9, 16-19. 22-23","evangelio_alt":"Mc 16, 15-20","salmo_alt":"Sal 95, 1-2a. 2b-3. 7-8a. 10 (R.: cf. 3)","aclamacion_alt":"Mt 28, 19a. 20b"},"12-04":{"tieneComunRef":true,"primera_alt":"2 Tim 1, 13-14; 2, 1-3","evangelio_alt":"Mt 25, 14-30","salmo_alt":"Sal 18, 8. 9. 10. 11 (R.: 10cd; cf. Jn 6, 63c)"},"12-06":{"tieneComunRef":true,"primera_alt":"Is 6, 1-8"},"12-07":{"tieneComunRef":true,"primera_alt":"Ef 3, 8-12"},"12-08":{"primera":"Gen 3, 9-15. 20","salmo":"Sal 97, 1bcde. 2-3ab. 3c-4 (R.: 1bc)","segunda":"Ef 1, 3-6. 11-12","evangelio":"Lc 1, 26-38"},"12-10":{"tieneComunRef":true},"12-11":{"tieneComunRef":true,"primera_alt":"Hch 20, 17-18a. 28-32. 36"},"12-12":{"tieneComunRef":true,"primera_alt":"Prov 31, 10-13. 19-20. 30-31"},"12-13":{"tieneComunRef":true,"primera_alt":"2 Cor 10, 17 — 11, 2"},"12-14":{"tieneComunRef":true,"primera_alt":"1 Cor 2, 1-10a","evangelio_alt":"Lc 14, 25-33","salmo_alt":"Sal 36, 3-4. 5-6. 30-31 (R.: 30a)"},"12-21":{"tieneComunRef":true,"primera_alt":"2 Tim 4, 1-5"},"12-23":{"tieneComunRef":true,"primera_alt":"Sant 2, 14-17","evangelio_alt":"Lc 6, 27-38"},"12-26":{"primera":"Hch 6, 8-10; 7, 54-59","salmo":"Sal 30, 3cd-4. 6 y 8ab. 16b y 17 (R.: 6a)","evangelio":"Mt 10, 17-22"},"12-27":{"primera":"1 Jn 1, 1-4","salmo":"Sal 96, 1-2. 5-6. 11-12 (R.: 12a)","evangelio":"Jn 20, 1a. 2-8"},"12-28":{"primera":"1 Jn 1, 5 — 2, 2","salmo":"Sal 123, 2-3. 4-5. 7c-8 (R.: 7ab)","evangelio":"Mt 2, 13-18"},"12-29":{"tieneComunRef":true,"primera_alt":"2 Tim 2, 8-13; 3, 10-12"},"12-31":{"tieneComunRef":true,"primera_alt":"Ez 34, 11-16"},"08-09":{"evangelio_propio":true,"evangelio":"Mt 25, 1-13","primera":"Os 2, 16b. 17de. 21-22","salmo":"Sal 44, 11-12. 14-15. 16-17 (R.: 11a; cf. Mt 25, 6b)"}}},"r":{"fiestasFijas":[{"mes":1,"dia":1,"nombre":"Santa María, Madre de Dios","rango":"Solemnidad"},{"mes":1,"dia":6,"nombre":"Epifanía del Señor","rango":"Solemnidad"},{"mes":2,"dia":2,"nombre":"La Presentación del Señor","rango":"Fiesta"},{"mes":3,"dia":19,"nombre":"San José, Esposo de la Virgen María","rango":"Solemnidad"},{"mes":3,"dia":25,"nombre":"La Anunciación del Señor","rango":"Solemnidad"},{"mes":6,"dia":24,"nombre":"Natividad de San Juan Bautista","rango":"Solemnidad"},{"mes":6,"dia":29,"nombre":"Santos Pedro y Pablo, Apóstoles","rango":"Solemnidad"},{"mes":7,"dia":25,"nombre":"Santiago Apóstol, Patrón de España","rango":"Solemnidad"},{"mes":8,"dia":6,"nombre":"La Transfiguración del Señor","rango":"Fiesta"},{"mes":8,"dia":15,"nombre":"La Asunción de la Virgen María","rango":"Solemnidad"},{"mes":9,"dia":14,"nombre":"La Exaltación de la Santa Cruz","rango":"Fiesta"},{"mes":10,"dia":12,"nombre":"Nuestra Señora del Pilar","rango":"Fiesta"},{"mes":11,"dia":1,"nombre":"Todos los Santos","rango":"Solemnidad"},{"mes":11,"dia":2,"nombre":"Conmemoración de los Fieles Difuntos","rango":"Solemnidad"},{"mes":12,"dia":8,"nombre":"La Inmaculada Concepción","rango":"Solemnidad"},{"mes":12,"dia":25,"nombre":"Natividad del Señor","rango":"Solemnidad"}],"memorias":[{"mes":1,"dia":2,"nombre":"Santos Basilio Magno y Gregorio Nacianceno","rango":"Memoria Obligatoria"},{"mes":1,"dia":7,"nombre":"San Raimundo de Penyafort","rango":"Memoria Libre"},{"mes":1,"dia":17,"nombre":"San Antonio Abad","rango":"Memoria Obligatoria"},{"mes":1,"dia":20,"nombre":"San Fabián y San Sebastián, mártires","rango":"Memoria Libre"},{"mes":1,"dia":21,"nombre":"Santa Inés, virgen y mártir","rango":"Memoria Obligatoria"},{"mes":1,"dia":22,"nombre":"San Vicente, diácono y mártir","rango":"Memoria Obligatoria"},{"mes":1,"dia":23,"nombre":"San Ildefonso, obispo","rango":"Memoria Obligatoria"},{"mes":1,"dia":24,"nombre":"San Francisco de Sales","rango":"Memoria Obligatoria"},{"mes":1,"dia":25,"nombre":"La Conversión de San Pablo","rango":"Fiesta"},{"mes":1,"dia":26,"nombre":"Santos Timoteo y Tito","rango":"Memoria Obligatoria"},{"mes":1,"dia":28,"nombre":"Santo Tomás de Aquino","rango":"Memoria Obligatoria"},{"mes":1,"dia":31,"nombre":"San Juan Bosco","rango":"Memoria Obligatoria"},{"mes":2,"dia":3,"nombre":"San Blas / San Óscar","rango":"Memoria Libre"},{"mes":2,"dia":5,"nombre":"Santa Águeda, virgen y mártir","rango":"Memoria Obligatoria"},{"mes":2,"dia":6,"nombre":"San Pablo Miki y compañeros, mártires","rango":"Memoria Obligatoria"},{"mes":2,"dia":8,"nombre":"San Jerónimo Emiliani / Santa Josefina Bakhita","rango":"Memoria Libre"},{"mes":2,"dia":10,"nombre":"Santa Escolástica","rango":"Memoria Obligatoria"},{"mes":2,"dia":14,"nombre":"Santos Cirilo y Metodio, patronos de Europa","rango":"Fiesta"},{"mes":2,"dia":17,"nombre":"Los Siete Santos Fundadores de los Servitas","rango":"Memoria Libre"},{"mes":2,"dia":22,"nombre":"La Cátedra de San Pedro","rango":"Fiesta"},{"mes":2,"dia":23,"nombre":"San Policarpo, obispo y mártir","rango":"Memoria Obligatoria"},{"mes":3,"dia":4,"nombre":"San Casimiro","rango":"Memoria Libre"},{"mes":3,"dia":7,"nombre":"Santas Perpetua y Felicidad, mártires","rango":"Memoria Obligatoria"},{"mes":3,"dia":8,"nombre":"San Juan de Dios","rango":"Memoria Libre"},{"mes":3,"dia":9,"nombre":"Santa Francisca Romana","rango":"Memoria Libre"},{"mes":3,"dia":17,"nombre":"San Patricio","rango":"Memoria Libre"},{"mes":3,"dia":23,"nombre":"Santo Toribio de Mogrovejo","rango":"Memoria Libre"},{"mes":4,"dia":2,"nombre":"San Francisco de Paula","rango":"Memoria Libre"},{"mes":4,"dia":5,"nombre":"San Vicente Ferrer","rango":"Memoria Libre"},{"mes":4,"dia":7,"nombre":"San Juan Bautista de La Salle","rango":"Memoria Obligatoria"},{"mes":4,"dia":11,"nombre":"San Estanislao, obispo y mártir","rango":"Memoria Obligatoria"},{"mes":4,"dia":13,"nombre":"San Martín I, papa y mártir","rango":"Memoria Libre"},{"mes":4,"dia":23,"nombre":"San Jorge, mártir / San Adalberto","rango":"Memoria Libre"},{"mes":4,"dia":25,"nombre":"San Marcos, evangelista","rango":"Fiesta"},{"mes":4,"dia":26,"nombre":"San Isidoro, obispo y doctor","rango":"Fiesta"},{"mes":4,"dia":28,"nombre":"San Pedro Chanel, mártir","rango":"Memoria Libre"},{"mes":4,"dia":29,"nombre":"Santa Catalina de Siena, virgen y doctora, patrona de Europa","rango":"Fiesta"},{"mes":4,"dia":30,"nombre":"San Pío V, papa","rango":"Memoria Libre"},{"mes":5,"dia":1,"nombre":"San José Obrero","rango":"Memoria Libre"},{"mes":5,"dia":2,"nombre":"San Atanasio, obispo y doctor","rango":"Memoria Obligatoria"},{"mes":5,"dia":3,"nombre":"Santos Felipe y Santiago, Apóstoles","rango":"Fiesta"},{"mes":5,"dia":10,"nombre":"San Juan de Ávila","rango":"Memoria Obligatoria"},{"mes":5,"dia":12,"nombre":"Santos Nereo y Aquileo, mártires","rango":"Memoria Libre"},{"mes":5,"dia":13,"nombre":"Nuestra Señora de Fátima","rango":"Memoria Libre"},{"mes":5,"dia":14,"nombre":"San Matías, Apóstol","rango":"Fiesta"},{"mes":5,"dia":15,"nombre":"San Isidro Labrador","rango":"Memoria Obligatoria"},{"mes":5,"dia":18,"nombre":"San Juan I, papa y mártir","rango":"Memoria Libre"},{"mes":5,"dia":20,"nombre":"San Bernardino de Siena","rango":"Memoria Libre"},{"mes":5,"dia":22,"nombre":"Santa Rita de Casia","rango":"Memoria Libre"},{"mes":5,"dia":25,"nombre":"San Beda el Venerable / San Gregorio VII / Santa M. Magdalena de Pazzi","rango":"Memoria Libre"},{"mes":5,"dia":26,"nombre":"San Felipe Neri","rango":"Memoria Obligatoria"},{"mes":5,"dia":27,"nombre":"San Agustín de Canterbury","rango":"Memoria Libre"},{"mes":5,"dia":31,"nombre":"La Visitación de la Virgen María","rango":"Fiesta"},{"mes":6,"dia":1,"nombre":"San Justino, mártir","rango":"Memoria Obligatoria"},{"mes":6,"dia":2,"nombre":"Santos Marcelino y Pedro, mártires","rango":"Memoria Libre"},{"mes":6,"dia":3,"nombre":"San Carlos Lwanga y compañeros, mártires","rango":"Memoria Obligatoria"},{"mes":6,"dia":5,"nombre":"San Bonifacio, obispo y mártir","rango":"Memoria Obligatoria"},{"mes":6,"dia":9,"nombre":"San Efrén, diácono y doctor","rango":"Memoria Libre"},{"mes":6,"dia":11,"nombre":"San Bernabé, Apóstol","rango":"Memoria Obligatoria"},{"mes":6,"dia":13,"nombre":"San Antonio de Padua","rango":"Memoria Obligatoria"},{"mes":6,"dia":21,"nombre":"San Luis Gonzaga","rango":"Memoria Obligatoria"},{"mes":6,"dia":22,"nombre":"San Paulino de Nola / Santos Juan Fisher y Tomás Moro","rango":"Memoria Libre"},{"mes":6,"dia":27,"nombre":"San Cirilo de Alejandría","rango":"Memoria Libre"},{"mes":6,"dia":28,"nombre":"San Ireneo, obispo y mártir","rango":"Memoria Obligatoria"},{"mes":7,"dia":3,"nombre":"Santo Tomás, Apóstol","rango":"Fiesta"},{"mes":7,"dia":4,"nombre":"Santa Isabel de Portugal","rango":"Memoria Libre"},{"mes":7,"dia":5,"nombre":"San Antonio María Zaccaria","rango":"Memoria Libre"},{"mes":7,"dia":6,"nombre":"Santa María Goretti, virgen y mártir","rango":"Memoria Libre"},{"mes":7,"dia":11,"nombre":"San Benito, abad, patrono de Europa","rango":"Fiesta"},{"mes":7,"dia":13,"nombre":"San Enrique","rango":"Memoria Libre"},{"mes":7,"dia":14,"nombre":"San Camilo de Lelis","rango":"Memoria Libre"},{"mes":7,"dia":15,"nombre":"San Buenaventura, obispo y doctor","rango":"Memoria Obligatoria"},{"mes":7,"dia":16,"nombre":"Nuestra Señora del Carmen","rango":"Memoria Obligatoria"},{"mes":7,"dia":22,"nombre":"Santa María Magdalena","rango":"Fiesta"},{"mes":7,"dia":23,"nombre":"Santa Brígida, religiosa, patrona de Europa","rango":"Fiesta"},{"mes":7,"dia":26,"nombre":"Santos Joaquín y Ana","rango":"Memoria Obligatoria"},{"mes":7,"dia":29,"nombre":"Santa Marta, María y Lázaro","rango":"Memoria Obligatoria"},{"mes":7,"dia":30,"nombre":"San Pedro Crisólogo","rango":"Memoria Libre"},{"mes":7,"dia":31,"nombre":"San Ignacio de Loyola","rango":"Memoria Obligatoria"},{"mes":8,"dia":1,"nombre":"San Alfonso María de Ligorio","rango":"Memoria Obligatoria"},{"mes":8,"dia":2,"nombre":"San Eusebio de Vercelli / San Pedro Julián Eymard","rango":"Memoria Libre"},{"mes":8,"dia":4,"nombre":"San Juan María Vianney","rango":"Memoria Obligatoria"},{"mes":8,"dia":5,"nombre":"Dedicación de la Basílica de Santa María la Mayor","rango":"Memoria Libre"},{"mes":8,"dia":7,"nombre":"San Cayetano / Santos Sixto II y compañeros","rango":"Memoria Libre"},{"mes":8,"dia":8,"nombre":"Santo Domingo de Guzmán","rango":"Memoria Obligatoria"},{"mes":8,"dia":9,"nombre":"Santa Teresa Benedicta de la Cruz (Edith Stein), patrona de Europa","rango":"Fiesta"},{"mes":8,"dia":10,"nombre":"San Lorenzo, diácono y mártir","rango":"Fiesta"},{"mes":8,"dia":11,"nombre":"Santa Clara","rango":"Memoria Obligatoria"},{"mes":8,"dia":12,"nombre":"Santa Juana Francisca de Chantal","rango":"Memoria Libre"},{"mes":8,"dia":13,"nombre":"Santos Ponciano e Hipólito, mártires","rango":"Memoria Libre"},{"mes":8,"dia":14,"nombre":"San Maximiliano Kolbe, mártir","rango":"Memoria Obligatoria"},{"mes":8,"dia":16,"nombre":"San Esteban de Hungría","rango":"Memoria Libre"},{"mes":8,"dia":19,"nombre":"San Juan Eudes","rango":"Memoria Libre"},{"mes":8,"dia":20,"nombre":"San Bernardo, abad y doctor","rango":"Memoria Obligatoria"},{"mes":8,"dia":21,"nombre":"San Pío X, Papa","rango":"Memoria Obligatoria"},{"mes":8,"dia":22,"nombre":"Santa María Virgen, Reina","rango":"Memoria Obligatoria"},{"mes":8,"dia":23,"nombre":"Santa Rosa de Lima","rango":"Memoria Libre"},{"mes":8,"dia":24,"nombre":"San Bartolomé, Apóstol","rango":"Fiesta"},{"mes":8,"dia":25,"nombre":"San Luis / San José de Calasanz","rango":"Memoria Libre"},{"mes":8,"dia":26,"nombre":"Santa Teresa de Jesús Jornet e Ibars, virgen","rango":"Memoria Obligatoria"},{"mes":8,"dia":27,"nombre":"Santa Mónica","rango":"Memoria Obligatoria"},{"mes":8,"dia":28,"nombre":"San Agustín, obispo y doctor","rango":"Memoria Obligatoria"},{"mes":8,"dia":29,"nombre":"Martirio de San Juan Bautista","rango":"Memoria Obligatoria"},{"mes":9,"dia":3,"nombre":"San Gregorio Magno, papa y doctor","rango":"Memoria Obligatoria"},{"mes":9,"dia":8,"nombre":"Natividad de la Virgen María","rango":"Fiesta"},{"mes":9,"dia":9,"nombre":"San Pedro Claver","rango":"Memoria Libre"},{"mes":9,"dia":12,"nombre":"El Dulce Nombre de María","rango":"Memoria Libre"},{"mes":9,"dia":13,"nombre":"San Juan Crisóstomo, obispo y doctor","rango":"Memoria Obligatoria"},{"mes":9,"dia":15,"nombre":"Nuestra Señora de los Dolores","rango":"Memoria Obligatoria"},{"mes":9,"dia":16,"nombre":"Santos Cornelio y Cipriano, mártires","rango":"Memoria Obligatoria"},{"mes":9,"dia":17,"nombre":"San Roberto Belarmino","rango":"Memoria Libre"},{"mes":9,"dia":19,"nombre":"San Jenaro, obispo y mártir","rango":"Memoria Libre"},{"mes":9,"dia":20,"nombre":"Santos Andrés Kim, Pablo Chong y compañeros, mártires","rango":"Memoria Obligatoria"},{"mes":9,"dia":21,"nombre":"San Mateo, Apóstol y evangelista","rango":"Fiesta"},{"mes":9,"dia":23,"nombre":"San Pío de Pietrelcina","rango":"Memoria Obligatoria"},{"mes":9,"dia":26,"nombre":"Santos Cosme y Damián, mártires","rango":"Memoria Libre"},{"mes":9,"dia":27,"nombre":"San Vicente de Paúl","rango":"Memoria Obligatoria"},{"mes":9,"dia":29,"nombre":"Santos Arcángeles Miguel, Gabriel y Rafael","rango":"Fiesta"},{"mes":9,"dia":30,"nombre":"San Jerónimo, presbítero y doctor","rango":"Memoria Obligatoria"},{"mes":10,"dia":1,"nombre":"Santa Teresa del Niño Jesús","rango":"Memoria Obligatoria"},{"mes":10,"dia":2,"nombre":"Santos Ángeles Custodios","rango":"Memoria Obligatoria"},{"mes":10,"dia":4,"nombre":"San Francisco de Asís","rango":"Memoria Obligatoria"},{"mes":10,"dia":6,"nombre":"San Bruno","rango":"Memoria Libre"},{"mes":10,"dia":7,"nombre":"Nuestra Señora del Rosario","rango":"Memoria Obligatoria"},{"mes":10,"dia":9,"nombre":"Santos Dionisio y compañeros / San Juan Leonardi","rango":"Memoria Libre"},{"mes":10,"dia":14,"nombre":"San Calixto I, papa y mártir","rango":"Memoria Libre"},{"mes":10,"dia":15,"nombre":"Santa Teresa de Jesús","rango":"Memoria Obligatoria"},{"mes":10,"dia":16,"nombre":"Santa Margarita María de Alacoque / Santa Eduvigis","rango":"Memoria Libre"},{"mes":10,"dia":17,"nombre":"San Ignacio de Antioquía, obispo y mártir","rango":"Memoria Obligatoria"},{"mes":10,"dia":18,"nombre":"San Lucas, evangelista","rango":"Fiesta"},{"mes":10,"dia":19,"nombre":"Santos Juan de Brébeuf, Isaac Jogues y compañeros / San Pablo de la Cruz","rango":"Memoria Libre"},{"mes":10,"dia":22,"nombre":"San Juan Pablo II, papa","rango":"Memoria Libre"},{"mes":10,"dia":23,"nombre":"San Juan de Capistrano","rango":"Memoria Libre"},{"mes":10,"dia":24,"nombre":"San Antonio María Claret","rango":"Memoria Libre"},{"mes":10,"dia":28,"nombre":"Santos Simón y Judas, Apóstoles","rango":"Fiesta"},{"mes":11,"dia":3,"nombre":"San Martín de Porres","rango":"Memoria Libre"},{"mes":11,"dia":4,"nombre":"San Carlos Borromeo","rango":"Memoria Obligatoria"},{"mes":11,"dia":6,"nombre":"Santos Pedro Poveda, Inocencio de la Inmaculada y compañeros, mártires","rango":"Memoria Obligatoria"},{"mes":11,"dia":9,"nombre":"Dedicación de la Basílica de Letrán","rango":"Fiesta"},{"mes":11,"dia":10,"nombre":"San León Magno, papa y doctor","rango":"Memoria Obligatoria"},{"mes":11,"dia":11,"nombre":"San Martín de Tours, obispo","rango":"Memoria Obligatoria"},{"mes":11,"dia":12,"nombre":"San Josafat, obispo y mártir","rango":"Memoria Obligatoria"},{"mes":11,"dia":15,"nombre":"San Alberto Magno, obispo y doctor","rango":"Memoria Libre"},{"mes":11,"dia":16,"nombre":"Santa Margarita de Escocia / Santa Gertrudis","rango":"Memoria Libre"},{"mes":11,"dia":17,"nombre":"Santa Isabel de Hungría","rango":"Memoria Obligatoria"},{"mes":11,"dia":21,"nombre":"Presentación de la Virgen María","rango":"Memoria Obligatoria"},{"mes":11,"dia":22,"nombre":"Santa Cecilia, virgen y mártir","rango":"Memoria Obligatoria"},{"mes":11,"dia":23,"nombre":"San Clemente I / San Columbano","rango":"Memoria Libre"},{"mes":11,"dia":24,"nombre":"Santos Andrés Dung-Lac y compañeros, mártires","rango":"Memoria Obligatoria"},{"mes":11,"dia":30,"nombre":"San Andrés, Apóstol","rango":"Fiesta"},{"mes":12,"dia":3,"nombre":"San Francisco Javier","rango":"Memoria Obligatoria"},{"mes":12,"dia":4,"nombre":"San Juan Damasceno","rango":"Memoria Libre"},{"mes":12,"dia":6,"nombre":"San Nicolás, obispo","rango":"Memoria Libre"},{"mes":12,"dia":7,"nombre":"San Ambrosio, obispo y doctor","rango":"Memoria Obligatoria"},{"mes":12,"dia":11,"nombre":"San Dámaso I, papa","rango":"Memoria Libre"},{"mes":12,"dia":12,"nombre":"Nuestra Señora de Guadalupe","rango":"Memoria Libre"},{"mes":12,"dia":13,"nombre":"Santa Lucía, virgen y mártir","rango":"Memoria Obligatoria"},{"mes":12,"dia":14,"nombre":"San Juan de la Cruz","rango":"Memoria Obligatoria"},{"mes":12,"dia":26,"nombre":"San Esteban, protomártir","rango":"Fiesta"},{"mes":12,"dia":27,"nombre":"San Juan, Apóstol y evangelista","rango":"Fiesta"},{"mes":12,"dia":28,"nombre":"Santos Inocentes, mártires","rango":"Fiesta"},{"mes":12,"dia":29,"nombre":"Santo Tomás Becket, obispo y mártir","rango":"Memoria Libre"},{"mes":12,"dia":31,"nombre":"San Silvestre I, papa","rango":"Memoria Libre"}],"fiestasDelSenor":["El Bautismo del Señor","La Exaltación de la Santa Cruz","La Presentación del Señor","La Sagrada Familia de Jesús, María y José","La Transfiguración del Señor"],"evangeliosMemoriasMoviles":{"es":{"Bienaventurada Virgen María, Madre de la Iglesia":{"cita":"Juan 19, 25-27"},"Inmaculado Corazón de la Virgen María":{"cita":"Lucas 2, 41-51"}}}}}/*/DATA*/;

    /* ══════════ Correcciones según el Calendario Litúrgico-Pastoral de la CEE ══════════
       Contrastado día a día con los calendarios de la CEE de 2024, 2025 y 2026
       (cancionero-liturgico.org/Calendario-liturgico-AAAA.pdf). Si el Leccionario da
       «o bien», se muestran las dos lecturas, primero la que pone la CEE. */
    (function corregir(e, r) {
        const alt = (nodo, k, primera) => { nodo[k + '_alt'] = nodo[k]; nodo[k] = primera; };
        const d = e.dominical, s = e.santos;
        // Domingo de Ramos: Pasión completa (con la forma breve aparte) y evangelio de la procesión.
        [['A', 'Mt 26, 14 — 27, 66', 'Mt 21, 1-11'], ['B', 'Mc 14, 1 — 15, 47', 'Mc 11, 1-10', 'Jn 12, 12-16'], ['C', 'Lc 22, 14 — 23, 56', 'Lc 19, 28-40']]
            .forEach(([c, pasion, proc, procAlt]) => {
                const n = d[c].ramos;
                n.evangelio = { cita: pasion, forma_breve: n.evangelio };
                n.procesion = proc;
                if (procAlt) n.procesion_alt = procAlt;
            });
        // Ascensión: Ef 1, 17-23 o la segunda lectura propia del ciclo B o C.
        alt(d.B.ascension, 'segunda', 'Ef 1, 17-23');
        d.B.ascension.segunda_alt = { cita: 'Ef 4, 1-13', forma_breve: 'Ef 4, 1-7. 11-13' };
        alt(d.C.ascension, 'segunda', 'Ef 1, 17-23');
        // VII domingo de Pascua, año A: faltaba en los datos (en España ese domingo es la Ascensión;
        // lo usa el calendario general). Lecturas del Ordo Lectionum Missae.
        d.A.pascua_7 = d.A.pascua_7 || { primera: 'Hch 1, 12-14', salmo: 'Sal 26, 1. 4. 7-8a', segunda: '1 Pe 4, 13-16', evangelio: 'Jn 17, 1-11a' };
        alt(d.C.to_15, 'salmo', 'Sal 68');                  // XV domingo C: Sal 68 o Sal 18
        d.C.to_22.primera = 'Eclo 3, 17-20. 28-29';        // XXII domingo C
        // 7 de enero: los datos traían el 7 «antes de Epifanía» (donde se traslada), que en España no existe;
        // de ahí sale el 12 de enero, que faltaba (cuando la Epifanía cae en domingo).
        const n7 = e.ferial_fuerte.navidad_7_ene;
        e.ferial_fuerte.navidad_12_ene = { primera: n7.primera, salmo: n7.salmo, evangelio: 'Jn 3, 22-30' };
        e.ferial_fuerte.navidad_7_ene = { primera: '1 Jn 3, 22 — 4, 6', salmo: 'Sal 2', evangelio: 'Mt 4, 12-17. 23-25' };
        // Pentecostés y Bautismo, años B y C: lecturas comunes o las propias del ciclo.
        for (const c of ['B', 'C']) {
            alt(d[c].pentecostes, 'segunda', d.A.pentecostes.segunda);
            alt(d[c].pentecostes, 'evangelio', d.A.pentecostes.evangelio);
            for (const k of ['primera', 'salmo', 'segunda']) alt(d[c].bautismo, k, d.A.bautismo[k]);
        }
        alt(e.ferial_fuerte.navidad_21_dic, 'primera', 'Cant 2, 8-14');
        alt(e.ferial_to.II['19_viernes'], 'primera', 'Ez 16, 1-15. 60. 63');
        // Forma ordinaria de las lecturas que cambian según el ciclo (las variantes, en ajustarCEE).
        e.ferial_fuerte.adviento_1_lunes.primera = 'Is 2, 1-5';
        e.ferial_fuerte.pascua_4_lunes.evangelio = 'Jn 10, 1-10';
        e.ferial_fuerte.cuaresma_5_lunes.evangelio = 'Jn 8, 1-11';
        e.ferial_to.evangelio['18_martes'].evangelio = 'Mt 14, 22-36';
        // Santoral con «o bien».
        alt(s['01-25'], 'primera', 'Hch 22, 3-16');
        alt(s['01-26'], 'primera', '2 Tim 1, 1-8');
        s['05-31'].primera_alt = 'Rom 12, 9-16b';
        alt(s['07-22'], 'primera', 'Cant 3, 1-4b');
        alt(s['07-29'], 'evangelio', 'Jn 11, 19-27');
        alt(s['09-08'], 'primera', 'Miq 5, 1-4a');
        alt(s['09-15'], 'evangelio', 'Jn 19, 25-27');
        alt(s['09-29'], 'primera', 'Dan 7, 9-10. 13-14');
        alt(s['10-12'], 'primera', '1 Cron 15, 3-4. 15-16; 16, 1-2');
        // Memorias en las que la CEE mantiene el evangelio de la feria.
        s['06-22'].tieneComunRef = true;
        s['07-26'].tieneComunRef = true;
        delete s['08-04'].evangelio_propio;
        // En España santa Teresa de Jesús es fiesta. Letrán es fiesta del Señor: pasa por delante del domingo.
        r.memorias.find(m => m.mes === 10 && m.dia === 15).rango = 'Fiesta';
        r.fiestasDelSenor.push('Dedicación de la Basílica de Letrán');
        const ev = r.evangeliosMemoriasMoviles.es;
        ev['Bienaventurada Virgen María, Madre de la Iglesia'].cita = 'Jn 19, 25-27';
        ev['Inmaculado Corazón de la Virgen María'].cita = 'Lc 2, 41-51';
    })(DATA.es, DATA.r);


    /* ══════════ Motor por calendario ══════════
       Un mismo motor para España y para el calendario general, con la misma base de lecturas.
       OPC.corr: correcciones del motor original (valen para los dos); OPC.esp: reglas propias de España
       (Ascensión y Corpus en domingo, privilegio de la Inmaculada, Jesucristo Sacerdote, Témporas). */
    function crearMotor(OPC, R, LEC) {
        const CEE_ES = OPC.corr;
        const ESP = OPC.esp;


        /* ══════════ Motor litúrgico (port fiel de lecturas-del-dia.mjs) ══════════ */
        const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const ROMANS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX', 'XXXI', 'XXXII', 'XXXIII', 'XXXIV'];
        const STRONG_SUNDAY_SEASONS = new Set(['Adviento', 'Cuaresma', 'Tiempo de Pascua', 'Semana Santa']);
        const LEVEL_I2_NAMES = new Set(['Natividad del Señor', 'Epifanía del Señor', 'La Ascensión del Señor', 'Domingo de Pentecostés']);
        const FIESTAS_DEL_SENOR = new Set(R.fiestasDelSenor || []);
        const DAY_MAP = {
            Lunes: 'lunes', Martes: 'martes', Miércoles: 'miercoles',
            Jueves: 'jueves', Viernes: 'viernes', Sábado: 'sabado'
        };

        function utcDate(year, month, day) {
            const d = new Date(0);
            d.setUTCHours(0, 0, 0, 0);
            d.setUTCFullYear(year, month - 1, day);
            return d;
        }
        function isoDate(d) {
            return `${String(d.getUTCFullYear()).padStart(4, '0')}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
        }
        function addDays(d, n) { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x; }
        function diffDays(a, b) { return Math.round((b.getTime() - a.getTime()) / 86400000); }
        function weekdayISO(d) { const w = d.getUTCDay(); return w === 0 ? 7 : w; }
        function roman(n) { return ROMANS[n] ?? String(n); }
        function weekOf(start, current) { return Math.floor(diffDays(start, current) / 7) + 1; }
        function romanToInt(s) {
            const vals = { I: 1, V: 5, X: 10, L: 50 };
            let total = 0, prev = 0;
            for (const c of String(s).toUpperCase().split('').reverse()) {
                const v = vals[c] ?? 0;
                total += v < prev ? -v : v;
                prev = v;
            }
            return total;
        }
        function extractRoman(name) {
            const match = String(name ?? '').match(/\b([IVXL]+)\b/);
            return match ? romanToInt(match[1]) : 0;
        }

        function easter(year) {
            const a = year % 19;
            const b = Math.floor(year / 100), c = year % 100;
            const d = Math.floor(b / 4), e = b % 4;
            const f = Math.floor((b + 8) / 25);
            const g = Math.floor((b - f + 1) / 3);
            const h = (19 * a + b - d - g + 15) % 30;
            const i = Math.floor(c / 4), k = c % 4;
            const l = (32 + 2 * e + 2 * i - h - k) % 7;
            const m = Math.floor((a + 11 * h + 22 * l) / 451);
            const month = Math.floor((h + l - 7 * m + 114) / 31);
            const day = ((h + l - 7 * m + 114) % 31) + 1;
            return utcDate(year, month, day);
        }
        function adventStart(year) {
            const christmas = utcDate(year, 12, 25);
            const wd = weekdayISO(christmas);
            const daysBack = wd === 7 ? 28 : 21 + wd;
            return addDays(christmas, -daysBack);
        }
        function baptismOfLord(year) {
            const epiphany = utcDate(year, 1, 6);
            // En España la Epifanía es siempre el 6 de enero: el Bautismo es el domingo siguiente (CEE 2019).
            // El lunes 7 solo vale donde la Epifanía se traslada al domingo 7 u 8.
            if (weekdayISO(epiphany) === 7) return addDays(epiphany, CEE_ES ? 7 : 1);
            return addDays(epiphany, 7 - weekdayISO(epiphany));
        }
        function getOtWeekBeforeLent(d, year) {
            const baptism = baptismOfLord(year);
            if (d <= baptism) return 1;
            return Math.floor(diffDays(baptism, d) / 7) + 1;
        }
        function getOtWeekAfterPentecost(d, year) {
            const christKing = addDays(adventStart(year), -7);
            const daysSinceSunday = weekdayISO(d) % 7;
            const weekSunday = addDays(d, -daysSinceSunday);
            const weeksToChristKing = Math.floor(diffDays(weekSunday, christKing) / 7);
            return Math.max(1, 34 - weeksToChristKing);
        }
        function movableFeasts(year) {
            const e = easter(year);
            const pentecost = addDays(e, 49);
            const advent = adventStart(year);
            const out = new Map();
            const add = (date, name, rank, color) => out.set(isoDate(date), { nombre: name, rango: rank, color });
            add(addDays(pentecost, 7), 'Santísima Trinidad', 'Solemnidad', 'Blanco');
            add(addDays(pentecost, ESP ? 14 : 11), 'Santísimo Cuerpo y Sangre de Cristo (Corpus Christi)', 'Solemnidad', 'Blanco');
            const sacredHeart = addDays(pentecost, 19);
            add(sacredHeart, 'Sagrado Corazón de Jesús', 'Solemnidad', 'Blanco');
            add(addDays(sacredHeart, 1), 'Inmaculado Corazón de la Virgen María', 'Memoria Obligatoria', 'Blanco');
            if (!CEE_ES || year >= 2018) add(addDays(pentecost, 1), 'Bienaventurada Virgen María, Madre de la Iglesia', 'Memoria Obligatoria', 'Blanco'); // instituida en 2018
            add(addDays(advent, -7), 'Nuestro Señor Jesucristo, Rey del Universo', 'Solemnidad', 'Blanco');
            add(addDays(e, ESP ? 42 : 39), 'La Ascensión del Señor', 'Solemnidad', 'Blanco');
            return out;
        }
        const MOVABLE_FEASTS_CACHE = new Map();
        const TRANSFERS_CACHE = new Map();
        function getMovableFeasts(year) {
            if (!MOVABLE_FEASTS_CACHE.has(year)) MOVABLE_FEASTS_CACHE.set(year, movableFeasts(year));
            return MOVABLE_FEASTS_CACHE.get(year);
        }
        function getTransfers(year) {
            if (!TRANSFERS_CACHE.has(year)) TRANSFERS_CACHE.set(year, computeTransfers(year));
            return TRANSFERS_CACHE.get(year);
        }
        function fixedFeastsMap() {
            const map = new Map();
            for (const feast of R.fiestasFijas) map.set(`${feast.mes}-${feast.dia}`, feast);
            return map;
        }
        function memorialsMap() {
            const map = new Map();
            for (const item of R.memorias) map.set(`${item.mes}-${item.dia}`, item);
            return map;
        }
        const FIXED_FEASTS = fixedFeastsMap();
        const MEMORIALS = memorialsMap();

        function precedenceLevel(name, rank, season, isSunday) {
            if (['Jueves Santo', 'Viernes Santo', 'Sábado Santo', 'Sabado Santo', 'Vigilia Pascual'].some(x => String(name).includes(x))) return 1;
            if (LEVEL_I2_NAMES.has(name)) return 2;
            if (String(name).includes('Resurrección') || String(name).includes('Resurreccion')) return 2;
            if (isSunday && STRONG_SUNDAY_SEASONS.has(season)) return 2;
            if (String(name).includes('Ceniza')) return 2;
            if (season === 'Semana Santa' && rank === 'Feria') return 2;
            if (String(name).includes('Octava de Pascua')) return 2;
            if (rank === 'Solemnidad') return 3;
            if (rank === 'Fiesta' && FIESTAS_DEL_SENOR.has(name)) return 5;
            if (isSunday && ['Tiempo de Navidad', 'Tiempo Ordinario'].includes(season)) return 6;
            if (rank === 'Fiesta') return 7;
            if (season === 'Cuaresma' && rank === 'Feria') return 9;
            if (season === 'Semana Santa') return 9;
            if (String(name).includes('17-24') || rank === 'Feria privilegiada') return 9;
            if (season === 'Tiempo de Navidad' && rank === 'Feria') return 9;
            if (rank === 'Memoria Obligatoria') return 10;
            if (rank === 'Memoria Libre') return 12;
            return 13;
        }
        function determineSeason(d, e, ashWed, pentecost, advent, christmas, baptism) {
            if (d >= ashWed && d < e) return d < addDays(e, -7) ? 'Cuaresma' : 'Semana Santa';
            if (d >= e && d <= pentecost) return 'Tiempo de Pascua';
            if (d >= advent && d < christmas) return 'Adviento';
            if ((d.getUTCMonth() === 11 && d.getUTCDate() >= 25) || (d.getUTCMonth() === 0 && d <= baptism)) return 'Tiempo de Navidad';
            return 'Tiempo Ordinario';
        }
        function baseDayLevel(d, year) {
            const e = easter(year), ash = addDays(e, -46), pent = addDays(e, 49), advent = adventStart(year);
            const christmas = utcDate(year, 12, 25), baptism = baptismOfLord(year);
            const palm = addDays(e, -7), isSunday = weekdayISO(d) === 7;
            const mov = getMovableFeasts(year).get(isoDate(d));
            if (mov) {
                const season = determineSeason(d, e, ash, pent, advent, christmas, baptism);
                return precedenceLevel(mov.nombre, mov.rango, season, isSunday);
            }
            if (d >= ash && d < e) {
                if (d >= palm) {
                    if (isSunday) return 2;
                    const wd = weekdayISO(d);
                    if (wd === 4 || wd === 5 || wd === 6) return 1;
                    return 2;
                }
                if (d.getTime() === ash.getTime() || isSunday) return 2;
                return 9;
            }
            if (d >= e && d <= pent) {
                if (isSunday || diffDays(e, d) <= 7) return 2;
                return 13;
            }
            if (d >= advent) {
                if (isSunday) return 2;
                const m = d.getUTCMonth() + 1, day = d.getUTCDate();
                if (m === 12 && day >= 17 && day <= 24) return 9;
                return 13;
            }
            if ((d.getUTCMonth() === 11 && d.getUTCDate() >= 25) || (d.getUTCMonth() === 0 && d <= baptism)) {
                if (isSunday) return 6;
                const m = d.getUTCMonth() + 1, day = d.getUTCDate();
                if ((m === 12 && day >= 26) || (m === 1 && day <= 5)) return 9;
                return 13;
            }
            if (isSunday) return 6;
            return 13;
        }
        function computeTransfers(year) {
            const e = easter(year), palm = addDays(e, -7), octaveEnd = addDays(e, 7), mondayAfterOctave = addDays(octaveEnd, 1);
            const transfers = new Map();
            for (const feast of R.fiestasFijas) {
                if (feast.rango !== 'Solemnidad') continue;
                const d = utcDate(year, feast.mes, feast.dia);
                const name = feast.nombre;
                if (LEVEL_I2_NAMES.has(name) || name === 'Natividad del Señor') continue;
                if (ESP && name.includes('Inmaculada') && weekdayISO(d) === 7) continue; // privilegio de España
                const baseLevel = baseDayLevel(d, year);
                if (baseLevel >= 3) continue;
                let transferTo;
                if (d >= palm && d <= octaveEnd) {
                    transferTo = mondayAfterOctave;
                    if ((name.includes('José') || name.includes('Jose')) && d >= palm && d < e) transferTo = addDays(palm, -1);
                } else {
                    transferTo = addDays(d, 1);
                }
                let safety = 0;
                while (safety < 7) {
                    if (baseDayLevel(transferTo, year) >= 3) break;
                    transferTo = addDays(transferTo, 1);
                    safety++;
                }
                while (transfers.has(isoDate(transferTo))) transferTo = addDays(transferTo, 1);
                transfers.set(isoDate(transferTo), { ...feast, original: isoDate(d) });
            }
            return transfers;
        }
        function buildResult(d, dayName, name, rank, season, sundayCycle, weekdayCycle, color, liturgicalYear) {
            return {
                date: isoDate(d), day_name: dayName, name, rank, season,
                sunday_cycle: `Ciclo ${sundayCycle}`, weekday_cycle: weekdayCycle,
                color, liturgical_year: liturgicalYear
            };
        }

        function calculateLiturgicalDay(d) {
            const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, day = d.getUTCDate();
            const wd = weekdayISO(d), dayName = DAY_NAMES[wd - 1], isSunday = wd === 7;
            const advent = adventStart(y);
            const liturgicalYear = d >= advent ? y + 1 : y;
            const rem = liturgicalYear % 3;
            const sundayCycle = ({ 1: 'A', 2: 'B', 0: 'C' })[rem];
            const weekdayCycle = liturgicalYear % 2 === 0 ? 'II' : 'I';
            const e = easter(y), ashWed = addDays(e, -46), pentecost = addDays(e, 49);
            const holyWeekStart = addDays(e, -7), christmas = utcDate(y, 12, 25), baptism = baptismOfLord(y);
            const transfers = getTransfers(y);
            const transfer = transfers.get(isoDate(d));
            if (transfer) {
                const season = determineSeason(d, e, ashWed, pentecost, advent, christmas, baptism);
                const r = buildResult(d, dayName, transfer.nombre, transfer.rango, season, sundayCycle, '', transfer.color, liturgicalYear);
                r.transferred_from = transfer.original;
                return r;
            }

            const key = `${m}-${day}`;
            let movable = getMovableFeasts(y).get(isoDate(d)) ?? null;
            let fixed = FIXED_FEASTS.get(key) ?? null;
            const impededDates = new Set([...transfers.values()].map(x => x.original));
            if (fixed && impededDates.has(isoDate(d))) fixed = null;
            if (movable && fixed) {
                const season = determineSeason(d, e, ashWed, pentecost, advent, christmas, baptism);
                const movLevel = precedenceLevel(movable.nombre, movable.rango, season, isSunday);
                const fixedLevel = precedenceLevel(fixed.nombre, fixed.rango, season, isSunday);
                if (fixedLevel <= movLevel) movable = null;
                else fixed = null;
            }
            // Una memoria móvil (Inmaculado Corazón, Madre de la Iglesia) cede ante una fiesta del santoral.
            if (CEE_ES && movable && movable.rango === 'Memoria Obligatoria' && MEMORIALS.get(key) && MEMORIALS.get(key).rango === 'Fiesta') movable = null;
            if (movable) {
                const { nombre, rango, color } = movable;
                const season = determineSeason(d, e, ashWed, pentecost, advent, christmas, baptism);
                const wdc = season.includes('Ordinario') ? `Año ${weekdayCycle}` : '';
                const r = buildResult(d, dayName, nombre, rango, season, sundayCycle, wdc, color, liturgicalYear);
                if (season.includes('Ordinario')) r.ot_week = d < ashWed ? getOtWeekBeforeLent(d, y) : getOtWeekAfterPentecost(d, y);
                if (rango === 'Memoria Obligatoria' && !isSunday) {
                    r.memorial = nombre; r.memorial_rank = rango; r.memorial_color = color; r.readings_source = 'propias';
                }
                return r;
            }
            if (fixed) {
                const season = determineSeason(d, e, ashWed, pentecost, advent, christmas, baptism);
                return buildResult(d, dayName, fixed.nombre, fixed.rango, season, sundayCycle, '', fixed.color, liturgicalYear);
            }

            const result = { date: isoDate(d), day_name: dayName, sunday_cycle: `Ciclo ${sundayCycle}`, liturgical_year: liturgicalYear };
            const memorial = MEMORIALS.get(key);

            if (d >= ashWed && d < e) {
                if (d >= holyWeekStart) {
                    result.season = 'Semana Santa'; result.weekday_cycle = '';
                    if (isSunday) { result.name = 'Domingo de Ramos en la Pasión del Señor'; result.color = 'Rojo'; result.rank = 'Solemnidad'; }
                    else if (wd === 4) { result.name = 'Jueves Santo - La Cena del Señor'; result.color = 'Blanco'; result.rank = 'Solemnidad'; }
                    else if (wd === 5) { result.name = 'Viernes Santo - La Pasión del Señor'; result.color = 'Rojo'; result.rank = 'Solemnidad'; }
                    else if (wd === 6) { result.name = 'Sábado Santo - Vigilia Pascual'; result.color = 'Blanco'; result.rank = 'Solemnidad'; }
                    else { result.name = `${dayName} Santo`; result.color = 'Morado'; result.rank = 'Feria'; }
                } else {
                    result.season = 'Cuaresma'; result.color = 'Morado'; result.weekday_cycle = '';
                    if (isoDate(d) === isoDate(ashWed)) { result.name = 'Miércoles de Ceniza'; result.rank = 'Feria'; }
                    else if (d < addDays(ashWed, 4)) { result.name = `${dayName} después de Ceniza`; result.rank = 'Feria'; }
                    else {
                        const firstSundayLent = addDays(ashWed, 4);
                        const weekNum = weekOf(firstSundayLent, d);
                        if (isSunday) { result.name = `${roman(weekNum)} Domingo de Cuaresma`; result.rank = 'Domingo'; if (weekNum === 4) result.color = 'Rosa'; }
                        else { result.name = `${dayName} de la ${roman(weekNum)} Semana de Cuaresma`; result.rank = 'Feria'; }
                    }
                    if (memorial && memorial.rango !== 'Fiesta') result.memorial_note = `Memoria suprimida en Cuaresma: ${memorial.nombre}`;
                }
            } else if (d >= e && d <= pentecost) {
                result.season = 'Tiempo de Pascua'; result.color = 'Blanco'; result.weekday_cycle = '';
                const weekNum = weekOf(e, d);
                if (isSunday) {
                    if (weekNum === 1) { result.name = 'Domingo de Resurrección'; result.rank = 'Solemnidad'; }
                    else if (weekNum === 8) { result.name = 'Domingo de Pentecostés'; result.color = 'Rojo'; result.rank = 'Solemnidad'; }
                    else { result.name = `${roman(weekNum)} Domingo de Pascua`; result.rank = 'Domingo'; }
                } else if (weekNum === 1) {
                    result.name = `${dayName} de la Octava de Pascua`; result.rank = 'Solemnidad';
                } else {
                    result.name = `${dayName} de la ${roman(weekNum)} Semana de Pascua`; result.rank = 'Feria';
                    if (memorial) {
                        result.memorial = memorial.nombre; result.memorial_rank = memorial.rango; result.memorial_color = memorial.color;
                        result.readings_source = memorial.rango === 'Fiesta' ? 'propias' : 'feriales';
                    }
                }
            } else if (d >= advent && d < christmas) {
                result.season = 'Adviento'; result.color = 'Morado'; result.weekday_cycle = '';
                const weekNum = weekOf(advent, d);
                if (isSunday) { result.name = `${roman(weekNum)} Domingo de Adviento`; result.rank = 'Domingo'; if (weekNum === 3) result.color = 'Rosa'; }
                else if (m === 12 && day >= 17 && day <= 24) {
                    result.name = `Feria del 17-24 de Diciembre (${day} dic)`; result.rank = 'Feria privilegiada';
                    if (memorial && memorial.rango !== 'Fiesta') result.memorial_note = `Memoria suprimida en feria privilegiada: ${memorial.nombre}`;
                } else {
                    result.name = `${dayName} de la ${roman(weekNum)} Semana de Adviento`; result.rank = 'Feria';
                    if (memorial) {
                        result.memorial = memorial.nombre; result.memorial_rank = memorial.rango; result.memorial_color = memorial.color;
                        result.readings_source = memorial.rango === 'Fiesta' ? 'propias' : 'feriales';
                    }
                }
            } else if ((m === 12 && day >= 25) || (m === 1 && d <= baptism)) {
                result.season = 'Tiempo de Navidad'; result.color = 'Blanco'; result.weekday_cycle = '';
                if (m === 12 && day === 25) { result.name = 'Natividad del Señor'; result.rank = 'Solemnidad'; }
                else if (m === 12 && day >= 26 && day <= 31) {
                    if (memorial) {
                        const isFeast = memorial.rango === 'Fiesta';
                        result.name = memorial.nombre; result.rank = isFeast ? 'Fiesta' : 'Feria'; result.color = isFeast ? memorial.color : 'Blanco';
                        if (!isFeast) { result.memorial = memorial.nombre; result.memorial_rank = memorial.rango; result.memorial_color = memorial.color; }
                    } else { result.name = `Día ${day - 24} de la Octava de Navidad`; result.rank = 'Feria'; }
                    if (isSunday) { result.name = 'La Sagrada Familia de Jesús, María y José'; result.rank = 'Fiesta'; }
                    else if (weekdayISO(christmas) === 7 && day === 30) { result.name = 'La Sagrada Familia de Jesús, María y José'; result.rank = 'Fiesta'; }
                } else if (m === 1 && day === 1) { result.name = 'Santa María, Madre de Dios'; result.rank = 'Solemnidad'; }
                else if (m === 1 && day < 6) {
                    if (isSunday) { result.name = 'II Domingo de Navidad'; result.rank = 'Domingo'; }
                    else { result.name = `Feria del Tiempo de Navidad (${day} enero)`; result.rank = 'Feria'; }
                } else if (m === 1 && day === 6) { result.name = 'Epifanía del Señor'; result.rank = 'Solemnidad'; }
                else if (isoDate(d) === isoDate(baptism)) { result.name = 'El Bautismo del Señor'; result.rank = 'Fiesta'; }
                else { result.name = `Feria del Tiempo de Navidad (${day} enero)`; result.rank = 'Feria'; }
            } else {
                result.season = 'Tiempo Ordinario'; result.color = 'Verde'; result.weekday_cycle = `Año ${weekdayCycle}`;
                const weekNum = d < ashWed ? getOtWeekBeforeLent(d, y) : getOtWeekAfterPentecost(d, y);
                result.ot_week = weekNum;
                if (isSunday) {
                    result.name = `${roman(weekNum)} Domingo del Tiempo Ordinario`; result.rank = 'Domingo';
                    const fixedForDay = FIXED_FEASTS.get(key);
                    if (fixedForDay && fixedForDay.rango === 'Fiesta' && FIESTAS_DEL_SENOR.has(fixedForDay.nombre)) {
                        result.name = fixedForDay.nombre; result.rank = 'Fiesta'; result.color = fixedForDay.color;
                    } else if (memorial && memorial.rango === 'Fiesta' && FIESTAS_DEL_SENOR.has(memorial.nombre)) {
                        result.name = memorial.nombre; result.rank = 'Fiesta'; result.color = memorial.color; // CEE: Letrán en domingo
                    }
                } else {
                    result.name = `${dayName} de la ${roman(weekNum)} Semana del Tiempo Ordinario`; result.rank = 'Feria';
                }
                if (memorial && !isSunday) {
                    result.memorial = memorial.nombre; result.memorial_rank = memorial.rango; result.memorial_color = memorial.color;
                    result.readings_source = memorial.rango === 'Fiesta' ? 'propias' : 'feriales';
                    if (memorial.rango === 'Fiesta') { result.name = memorial.nombre; result.rank = 'Fiesta'; result.color = memorial.color; }
                }
            }

            if (memorial && !isSunday && result.season !== 'Tiempo Ordinario' && memorial.rango === 'Fiesta') {
                // Solo el Miércoles de Ceniza es privilegiado; no los días que lo siguen (Cátedra de San Pedro en 2007).
                const privileged = (CEE_ES ? result.name === 'Miércoles de Ceniza' : result.name.includes('Ceniza')) || result.season === 'Semana Santa' || ['Solemnidad', 'Feria privilegiada'].includes(result.rank) || (result.season === 'Tiempo de Pascua' && weekOf(e, d) === 1);
                if (!privileged) {
                    Object.assign(result, { name: memorial.nombre, rank: 'Fiesta', color: memorial.color, memorial: memorial.nombre, memorial_rank: 'Fiesta', memorial_color: memorial.color, readings_source: 'propias' });
                }
            }
            return result;
        }

        function buildDominicalKey(result) {
            const name = result.name ?? '', season = result.season ?? '';
            if (name.includes('Ramos')) return 'ramos';
            if (name.includes('Jueves Santo')) return 'jueves_santo';
            if (name.includes('Viernes Santo')) return 'viernes_santo';
            if (name.includes('Vigilia Pascual') || name.includes('Sábado Santo') || name.includes('Sabado Santo')) return 'vigilia_pascual';
            if (name.includes('Resurreccion') || name.includes('Resurrección')) return 'pascua_resurreccion';
            if (name.includes('Pentecostés') || name.includes('Pentecostes')) return 'pentecostes';
            if (name.includes('Trinidad')) return 'trinidad';
            if (name.includes('Corpus') || name.includes('Cuerpo')) return 'corpus';
            if (name.includes('Sagrado Corazón') || name.includes('Sagrado Corazon')) return 'sagrado_corazon';
            if (name.includes('Ascensión') || name.includes('Ascension')) return 'ascension';
            if (name.includes('Cristo Rey') || name.includes('Rey del Universo')) return 'cristo_rey';
            if (name.includes('Natividad') && !name.includes('San Juan') && !name.includes('Virgen') && !name.includes('María')) return 'natividad_dia';
            if (name.includes('Epifanía') || name.includes('Epifania')) return 'epifania';
            if (name.includes('Bautismo')) return 'bautismo';
            if (name.includes('Sagrada Familia')) return 'sagrada_familia';
            if (name.includes('Madre de Dios')) return 'maria_madre_dios';
            if (name.includes('Domingo de Navidad')) return 'navidad_post_2';
            if (name.includes('Presentacion') || name.includes('Presentación')) return 'presentacion';
            if (name.includes('San Jose') || name.includes('San José')) return 'san_jose';
            if (name.includes('Anunciacion') || name.includes('Anunciación')) return 'anunciacion';
            if (name.includes('Transfiguracion') || name.includes('Transfiguración')) return 'transfiguracion';
            if (name.includes('Asuncion') || name.includes('Asunción')) return 'asuncion';
            if (name.includes('Exaltacion') || name.includes('Exaltación')) return 'exaltacion_cruz';
            if (name.includes('Todos los Santos')) return 'todos_santos';
            if (name.includes('Fieles Difuntos')) return 'fieles_difuntos';
            if (name.includes('Inmaculada')) return 'inmaculada';
            if (name.includes('Pedro y Pablo')) return 'pedro_y_pablo';
            if (name.includes('Santiago') && (name.includes('Patrón') || name.includes('Patron'))) return 'santiago';
            if (name.includes('Pilar')) return 'pilar';
            if (name.includes('Inmaculado Corazon') || name.includes('Inmaculado Corazón')) return 'inmaculado_corazon';
            if (name.includes('Basílica de Letrán')) return null; // CEE: en domingo, lecturas de la fiesta (santoral)
            const num = extractRoman(name);
            if (season.includes('Adviento') || name.includes('Adviento')) return num ? `adviento_${num}` : null;
            if (season.includes('Cuaresma') || name.includes('Cuaresma')) return num ? `cuaresma_${num}` : null;
            if (season.includes('Pascua') || name.includes('Pascua')) return num ? `pascua_${num}` : null;
            if (season.includes('Ordinario')) { const ot = result.ot_week ?? num; return ot ? `to_${ot}` : null; }
            return null;
        }
        function buildFerialToKey(result) {
            const dia = DAY_MAP[result.day_name];
            return result.ot_week && dia ? `${result.ot_week}_${dia}` : null;
        }
        function buildFerialFuerteKey(result) {
            const name = result.name ?? '', season = result.season ?? '', dia = DAY_MAP[result.day_name];
            const d = parseISO(result.date);
            if (name.includes('Madre de la Iglesia')) return 'maria_madre_iglesia';
            if (name.includes('Ceniza') && !name.toLowerCase().includes('después') && !name.toLowerCase().includes('despues')) return 'ceniza';
            if (name.includes('después de Ceniza') || name.includes('despues de Ceniza')) return dia ? `cuaresma_0_${dia}` : null;
            if (season === 'Semana Santa' && dia) return `cuaresma_6_${dia}`;
            if (name.includes('Octava') && season === 'Tiempo de Pascua' && dia) return `pascua_0_${dia}`;
            if (name.includes('17-24') || result.rank === 'Feria privilegiada') {
                if (season === 'Adviento' && d.getUTCMonth() === 11 && d.getUTCDate() >= 17 && d.getUTCDate() <= 24) return `navidad_${d.getUTCDate()}_dic`;
            }
            if (season === 'Tiempo de Navidad') {
                const month = d.getUTCMonth() + 1, day = d.getUTCDate();
                if (month === 1 && day >= 2 && day <= 12) return `navidad_${day}_ene`;
                if (month === 12 && day >= 29 && day <= 31) return `navidad_${day}_dic`;
            }
            const num = extractRoman(name);
            const seasonKey = ({ 'Adviento': 'adviento', 'Cuaresma': 'cuaresma', 'Tiempo de Pascua': 'pascua', 'Tiempo de Navidad': 'navidad' })[season];
            return seasonKey && dia && num ? `${seasonKey}_${num}_${dia}` : null;
        }
        // Adaptados a los nodos compactados ("cita" / "~cita").
        function hasText(node) {
            if (typeof node === 'string') return node[0] !== '~';
            return Boolean(node && typeof node === 'object' && node.tieneTexto);
        }
        function hasReadingObject(node) {
            if (typeof node === 'string') return true;
            return Boolean(node && typeof node === 'object' && Object.keys(node).length);
        }
        function citaOf(node) {
            if (typeof node === 'string') return node.replace(/^~/, '');
            return node && typeof node === 'object' ? node.cita : undefined;
        }

        function lookupReadings(result) {
            const lec = LEC;
            const d = parseISO(result.date);
            const season = result.season ?? '', rank = result.rank ?? '';
            const isSunday = result.day_name === 'Domingo';
            const cycle = String(result.sunday_cycle ?? '').replace('Ciclo ', '');
            const weekdayCycle = String(result.weekday_cycle ?? '').replace(/^Año\s+/, '').replace(/^Ano\s+/, '');
            const memorial = result.memorial;
            const readingsSource = result.readings_source;

            // 1. Lecturas propias de santos: solo si el propio leccionario tiene texto.
            if (memorial && readingsSource === 'propias' && !R.evangeliosMemoriasMoviles.es?.[memorial]) {
                const santo = lec.santos?.[`${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`];
                if (['primera', 'salmo', 'evangelio'].some(k => hasText(santo?.[k]))) return santo;
            }

            // 2. Dominical: domingos, solemnidades y fiestas.
            const isMemorialFiesta = Boolean(memorial && readingsSource === 'propias' && rank === 'Fiesta');
            if (isSunday || ['Solemnidad', 'Fiesta'].includes(rank)) {
                if (!isMemorialFiesta) {
                    const dayKey = buildDominicalKey(result);
                    if (dayKey && lec.dominical?.[cycle]?.[dayKey]) {
                        let entry = lec.dominical[cycle][dayKey];
                        if (dayKey === 'vigilia_pascual') {
                            const vigilia = [];
                            for (let i = 1; i <= 7; i++) {
                                const key = `vigilia_pascual_lectura_${i}`;
                                if (lec.dominical[cycle][key]) vigilia.push(lec.dominical[cycle][key]);
                            }
                            if (vigilia.length) entry = { ...entry, vigilia_lecturas: vigilia };
                        }
                        return entry;
                    }
                }
                if (!isSunday && ['Cuaresma', 'Semana Santa', 'Tiempo de Pascua', 'Adviento', 'Tiempo de Navidad'].includes(season)) {
                    const ffKey = buildFerialFuerteKey(result);
                    if (ffKey && lec.ferial_fuerte?.[ffKey]) return lec.ferial_fuerte[ffKey];
                }
                const santoKey = result.transferred_from
                    ? `${result.transferred_from.slice(5, 7)}-${result.transferred_from.slice(8, 10)}`
                    : `${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
                const santo = lec.santos?.[santoKey];
                if (['primera', 'salmo', 'evangelio'].some(k => hasReadingObject(santo?.[k]))) return santo;
            }

            // 3. Ferias de los tiempos fuertes.
            if (['Cuaresma', 'Semana Santa', 'Tiempo de Pascua', 'Adviento', 'Tiempo de Navidad'].includes(season) && !isSunday) {
                const dayKey = buildFerialFuerteKey(result);
                if (dayKey && lec.ferial_fuerte?.[dayKey]) return lec.ferial_fuerte[dayKey];
            }

            // 3.5. Memorias móviles con lecturas propias guardadas en ferial_fuerte.
            if (memorial && readingsSource === 'propias' && !isSunday) {
                const ffKey = buildFerialFuerteKey(result);
                if (ffKey && lec.ferial_fuerte?.[ffKey]) return lec.ferial_fuerte[ffKey];
            }

            // 4. Tiempo Ordinario ferial: primera/Salmo de ciclo I/II + Evangelio común.
            if (season === 'Tiempo Ordinario' && !isSunday) {
                const dayKey = buildFerialToKey(result);
                if (dayKey) {
                    const firstPsalm = lec.ferial_to?.[weekdayCycle]?.[dayKey];
                    const gospelData = lec.ferial_to?.evangelio?.[dayKey];
                    if (firstPsalm || gospelData) {
                        const merged = {};
                        if (firstPsalm) for (const k of ['primera', 'salmo']) if (firstPsalm[k]) merged[k] = firstPsalm[k];
                        if (gospelData) for (const k of ['evangelio']) if (gospelData[k]) merged[k] = gospelData[k];
                        if (merged.primera || merged.evangelio) {
                            if (memorial && readingsSource === 'feriales') {
                                const santosKey = `${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
                                const santo = lec.santos?.[santosKey] ?? {};
                                if (santo.primera_obligatoria) {
                                    for (const k of ['primera', 'salmo']) if (hasText(santo[k])) { merged[k] = santo[k]; if (santo[k + '_alt']) merged[k + '_alt'] = santo[k + '_alt']; }
                                } else if (!santo.tieneComunRef || santo.evangelio_propio) {
                                    const santoEv = santo.evangelio;
                                    if (citaOf(santoEv)) { merged.evangelio = santoEv; if (santo.evangelio_alt) merged.evangelio_alt = santo.evangelio_alt; }
                                }
                            }
                            if (memorial && readingsSource === 'propias') {
                                const movableGospel = R.evangeliosMemoriasMoviles.es?.[memorial];
                                if (movableGospel) merged.evangelio = movableGospel;
                            }
                            return merged;
                        }
                        return null;
                    }
                }
            }
            return null;
        }

        function parseISO(value) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Fecha no válida: ${value}. Formato: YYYY-MM-DD.`);
            const [year, month, day] = value.split('-').map(Number);
            if (year < 1583 || year > 9999) throw new Error('El calendario admite fechas entre 1583 y 9999.');
            const d = utcDate(year, month, day);
            if (d.getUTCFullYear() !== year || d.getUTCMonth() + 1 !== month || d.getUTCDate() !== day) throw new Error(`Fecha inexistente: ${value}.`);
            return d;
        }
        function citationTree(node, key = '') {
            if (['aclamacion', 'aleluya'].includes(key.toLowerCase())) return undefined;
            if (typeof node === 'string') { const c = node.replace(/^~/, '').trim(); return c || undefined; }
            if (Array.isArray(node)) {
                const arr = node.map(x => citationTree(x)).filter(x => x !== undefined);
                return arr.length ? arr : undefined;
            }
            if (!node || typeof node !== 'object') return undefined;
            const out = {};
            if (typeof node.cita === 'string' && node.cita.trim()) out.cita = node.cita.trim();
            for (const [childKey, value] of Object.entries(node)) {
                if (['cita', 'tieneTexto', 'tieneComunRef', 'texto', 'titulo', 'aclamacion', 'day_name', 'date', 'rank', 'numero', 'tipo', 'seccion', 'comun_ref', 'primera_obligatoria', 'evangelio_propio'].includes(childKey)) continue;
                const child = citationTree(value, childKey);
                if (child !== undefined) out[childKey] = child;
            }
            if (out.cita && Object.keys(out).length === 1) return out.cita;
            return Object.keys(out).length ? out : undefined;
        }
        function getDailyCitations(dateString) {
            const date = parseISO(dateString);
            const day = calculateLiturgicalDay(date);
            const selected = lookupReadings(day);
            const citations = citationTree(selected);
            if (!citations || (typeof citations === 'object' && !Object.keys(citations).length)) {
                throw new Error(`No se encontraron citas para ${dateString} (${day.name ?? 'día litúrgico sin nombre'}).`);
            }
            return { fecha: dateString, lecturas: citations };
        }


        /* ══════════ Ajustes sobre lo que da el motor (CEE y reglas comunes) ══════════ */
        // Celebraciones que el motor no conoce: propias de España y coincidencias raras.
        function propioEspana(date, day) {
            if (ESP && isoDate(date) === isoDate(addDays(easter(date.getUTCFullYear()), 53))) {   // jueves después de Pentecostés
                const L = {
                    A: { primera: 'Gen 22, 9-18', primera_alt: 'Heb 10, 4-10', salmo: 'Sal 39', evangelio: 'Mt 26, 36-42' },
                    B: { primera: 'Jer 31, 31-34', primera_alt: 'Heb 10, 11-18', salmo: 'Sal 109', evangelio: 'Mc 14, 12a. 22-25' },
                    C: { primera: 'Is 6, 1-4. 8', primera_alt: 'Heb 2, 10-18', salmo: 'Sal 22', evangelio: 'Jn 17, 1-2. 9. 14-26' }
                }[String(day.sunday_cycle).slice(-1)];
                return { name: 'Nuestro Señor Jesucristo, Sumo y Eterno Sacerdote', rank: 'Fiesta', color: 'Blanco', lecturas: L };
            }
            // Solemnidad móvil del Señor el 24 de junio: se queda y San Juan Bautista se adelanta al 23
            // (respuesta del Dicasterio en 2022 para el Sagrado Corazón; el Corpus en jueves, por analogía).
            const pascua = easter(date.getUTCFullYear());
            const senor = [[addDays(pascua, 68), 'Sagrado Corazón de Jesús', 'sagrado_corazon'],
                [addDays(pascua, ESP ? 63 : 60), 'Santísimo Cuerpo y Sangre de Cristo (Corpus Christi)', 'corpus']]
                .find(([f]) => f.getUTCMonth() === 5 && f.getUTCDate() === 24);
            if (senor && date.getUTCMonth() === 5 && [23, 24].includes(date.getUTCDate())) {
                const c = String(day.sunday_cycle).slice(-1);
                return date.getUTCDate() === 24
                    ? { name: senor[1], rank: 'Solemnidad', color: 'Blanco', lecturas: citationTree(LEC.dominical[c][senor[2]]) }
                    : { name: 'Natividad de San Juan Bautista', rank: 'Solemnidad', color: 'Blanco', lecturas: citationTree(LEC.santos['06-24']) };
            }
            if (ESP && date.getUTCMonth() === 9 && date.getUTCDate() === 5 && weekdayISO(date) !== 7) {           // 5 de octubre
                return { name: 'Témporas de acción de gracias y de petición', rank: 'Memoria Obligatoria', color: 'Blanco',
                    lecturas: { primera: 'Dt 8, 7-18', salmo: '1 Cron 29, 10-12', segunda: '2 Cor 5, 17-21', evangelio: 'Mt 7, 7-11' } };
            }
            return null;
        }
        function ajustarCEE(day, date, lecturas) {
            if (!lecturas || typeof lecturas !== 'object') return lecturas;
            const t = JSON.parse(JSON.stringify(lecturas));
            const ciclo = String(day.sunday_cycle || '').slice(-1);
            const mes = date.getUTCMonth() + 1, dia = date.getUTCDate(), nombre = day.name || '';
            // Variantes según el ciclo dominical, como las da la CEE.
            if (nombre === 'Lunes de la I Semana de Adviento' && ciclo === 'A' && t.primera === 'Is 2, 1-5') t.primera_alt = 'Is 4, 2-6';
            if (nombre === 'Lunes de la V Semana de Cuaresma' && ciclo === 'C' && t.evangelio === 'Jn 8, 1-11') t.evangelio_alt = 'Jn 8, 12-20';
            if (ciclo === 'A' && day.season === 'Tiempo Ordinario' && day.ot_week === 18 && day.rank === 'Feria') {
                if (day.day_name === 'Lunes' && t.evangelio === 'Mt 14, 13-21') t.evangelio = 'Mt 14, 22-36';
                if (day.day_name === 'Martes' && t.evangelio === 'Mt 14, 22-36') t.evangelio = 'Mt 15, 1-2. 10-14';
            }
            // Fiesta entre semana: una sola lectura antes del Evangelio; la otra queda como «o bien».
            if (day.rank === 'Fiesta' && day.day_name !== 'Domingo' && t.primera && t.segunda) {
                t.primera_alt = [].concat(t.primera_alt || [], t.segunda, t.segunda_alt || []);
                delete t.segunda; delete t.segunda_alt;
            }
            // Inmaculada en domingo: la segunda lectura es la del II domingo de Adviento.
            if (ESP && mes === 12 && dia === 8 && day.day_name === 'Domingo' && /Inmaculada/.test(nombre)) {
                const s2 = LEC.dominical[ciclo] && LEC.dominical[ciclo].adviento_2;
                if (s2 && s2.segunda) t.segunda = citationTree(s2.segunda);
            }
            // Navidad: el 24 por la tarde, la misa de la vigilia; el 25, también medianoche y aurora.
            const misa = (titulo, k) => {
                const n = LEC.dominical[ciclo] && LEC.dominical[ciclo][k];
                const c = n && citationTree(n);
                return c ? { titulo, lecturas: c } : null;
            };
            if (mes === 12 && dia === 24) { delete t.misa_noche; t.misas = [misa('Misa vespertina de la vigilia', 'natividad_vigilia')].filter(Boolean); }
            if (mes === 12 && dia === 25) t.misas = [misa('Misa de medianoche', 'natividad_medianoche'), misa('Misa de la aurora', 'natividad_aurora')].filter(Boolean);
            return t;
        }
        // Lo que muestra el widget: día litúrgico y lecturas del calendario de este motor.
        function diaCEE(date) {
            const day = calculateLiturgicalDay(date);
            const p = propioEspana(date, day);
            if (!p) return day;
            return Object.assign({}, day, { name: p.name, rank: p.rank, color: p.color, memorial: undefined, memorial_rank: undefined, propio: p });
        }
        function lecturasCEE(date) {
            const day = diaCEE(date);
            if (day.propio) return day.propio.lecturas;
            return ajustarCEE(day, date, getDailyCitations(isoDate(date)).lecturas);
        }

        return { calculateLiturgicalDay, getDailyCitations, lookupReadings, citationTree, buildDominicalKey, buildFerialFuerteKey,
            buildFerialToKey, diaCEE, lecturasCEE, utcDate, isoDate, addDays, easter, weekdayISO, R, LEC };
    }

    /* ══════════ Calendario Romano General ══════════
       Las mismas lecturas (Ordo Lectionum Missae) con las reglas del calendario general: sin las
       celebraciones propias de España, con sus rangos y con las memorias universales que faltan.
       Contrastado con LiturgicalCalendarAPI (2000-2040). Santa María Magdalena es fiesta desde 2016. */
    const R_GEN = (function (r) {
        const g = JSON.parse(JSON.stringify(r));
        const k = x => `${x.mes}-${x.dia}`;
        const propias = new Set(['1-23', '4-26', '5-15', '8-26', '11-6']);           // Ildefonso, Isidoro, Isidro, T. Jornet, Poveda
        g.memorias = g.memorias.filter(m => !propias.has(k(m)));
        g.fiestasFijas = g.fiestasFijas.filter(f => !['10-12', '7-25'].includes(k(f))); // Pilar y Santiago patrón
        const cambios = {
            '1-22': ['Memoria Libre'], '5-10': ['Memoria Libre'], '7-16': ['Memoria Libre'], '10-15': ['Memoria Obligatoria'],
            '2-14': ['Memoria Obligatoria', 'Santos Cirilo, monje, y Metodio, obispo'],
            '4-29': ['Memoria Obligatoria', 'Santa Catalina de Siena, virgen y doctora'],
            '7-11': ['Memoria Obligatoria', 'San Benito, abad'],
            '7-23': ['Memoria Libre', 'Santa Brígida, religiosa'],
            '8-9': ['Memoria Libre', 'Santa Teresa Benedicta de la Cruz (Edith Stein)']
        };
        for (const m of g.memorias) { const c = cambios[k(m)]; if (c) { m.rango = c[0]; if (c[1]) m.nombre = c[1]; } }
        [[1, 3, 'Santísimo Nombre de Jesús'], [1, 13, 'San Hilario, obispo y doctor'], [1, 27, 'Santa Ángela Merici, virgen'],
         [2, 11, 'Nuestra Señora de Lourdes'], [2, 21, 'San Pedro Damián, obispo y doctor'], [2, 27, 'San Gregorio de Narek, abad y doctor'],
         [4, 4, 'San Isidoro, obispo y doctor'], [4, 21, 'San Anselmo, obispo y doctor'], [4, 24, 'San Fidel de Sigmaringa, presbítero y mártir'],
         [5, 21, 'Santos Cristóbal Magallanes, presbítero, y compañeros, mártires'], [5, 29, 'San Pablo VI, papa'], [6, 6, 'San Norberto, obispo'],
         [6, 19, 'San Romualdo, abad'], [6, 30, 'Santos Protomártires de la Iglesia de Roma'],
         [7, 9, 'Santos Agustín Zhao Rong, presbítero, y compañeros, mártires'], [7, 20, 'San Apolinar, obispo y mártir'],
         [7, 21, 'San Lorenzo de Brindis, presbítero y doctor'], [7, 24, 'San Chárbel Makhluf, presbítero'], [9, 5, 'Santa Teresa de Calcuta, virgen'],
         [9, 28, 'San Wenceslao, mártir / San Lorenzo Ruiz y compañeros, mártires'], [10, 5, 'Santa Faustina Kowalska, virgen'],
         [10, 11, 'San Juan XXIII, papa'], [11, 18, 'Dedicación de las basílicas de San Pedro y San Pablo'],
         [11, 25, 'Santa Catalina de Alejandría, virgen y mártir'], [12, 9, 'San Juan Diego Cuauhtlatoatzin'], [12, 10, 'Nuestra Señora de Loreto']
        ].forEach(([mes, dia, nombre]) => g.memorias.push({ mes, dia, nombre, rango: 'Memoria Libre' }));
        g.memorias.push({ mes: 7, dia: 25, nombre: 'Santiago, apóstol', rango: 'Fiesta' });
        return g;
    })(DATA.r);
    // Santiago en el calendario general: lecturas de la fiesta universal (en España, las de la solemnidad).
    // Santa Teresa y Santa Teresa Benedicta son memorias en el calendario general: evangelio de la feria.
    const LEC_GEN = Object.assign({}, DATA.es, { santos: Object.assign({}, DATA.es.santos, {
        '07-25': { primera: '2 Cor 4, 7-15', salmo: 'Sal 125, 1b-2ab. 2cd-3. 4-5. 6 (R.: 5)', evangelio: 'Mt 20, 20-28' },
        '10-15': Object.assign({}, DATA.es.santos['10-15'], { evangelio_propio: false }),
        '08-09': Object.assign({}, DATA.es.santos['08-09'], { evangelio_propio: false }) }) });

    const MOTOR = {
        es: crearMotor({ corr: true, esp: true }, DATA.r, DATA.es),
        gen: crearMotor({ corr: true, esp: false }, R_GEN, LEC_GEN)
    };
    const CALENDARIOS = [['es', 'Lecturas de España', 'España'], ['gen', 'Calendario general', 'General']]; // [valor, texto, texto corto]
    const { calculateLiturgicalDay, getDailyCitations, lookupReadings, citationTree, buildDominicalKey, buildFerialFuerteKey,
        buildFerialToKey, diaCEE, lecturasCEE, utcDate, isoDate, addDays, easter, weekdayISO } = MOTOR.es;

    /* ══════════ Enlaces a la Biblia en la web de la Santa Sede ══════════
       «El Libro del Pueblo de Dios» en vatican.va: una página por capítulo (__P<base 36>.HTM)
       que se abre por arriba. Tabla sacada de su índice (_INDEX.HTM): libro → «página del
       capítulo 1 en base 36, n.º de capítulos[, capítulo+páginas intercaladas…]». Los libros
       de un solo capítulo llevan solo su página. */
    const BIBLIA = 'https://www.vatican.va/archive/ESL0506/__P';
    const VAT = { 'Gen': '2,50', 'Ex': '1H,40', 'Lev': '2M,27', 'Num': '3E,36', 'Dt': '4F,34', 'Jos': '5E,24', 'Jue': '63,21', '1 Sam': '6P,31', '2 Sam': '7K,24', '1 Re': '89,22', '2 Re': '8V,25', 'Is': '9L,66,41+2', 'Jer': 'BH,52,44+2', 'Ez': 'CZ,48', 'Os': 'EB,14', 'Jl': 'EP,4', 'Am': 'ET,9', 'Jon': 'F3,4', 'Miq': 'F7,7', 'Nah': 'FE,3', 'Hab': 'FH,3', 'Sof': 'FK,3', 'Ag': 'FN,2', 'Zac': 'FP,14', 'Mal': 'G3,3', 'Sal': 'G6,150', 'Job': 'KC,42,28+1', 'Prov': 'LJ,31', 'Rut': 'ME,4', 'Cant': 'MI,8', 'Ecl': 'MQ,12', 'Lam': 'N2,5', 'Est': 'N7,10', 'Dan': 'NH,12', '1 Cron': 'NT,29', '2 Cron': 'OM,36', 'Esd': 'PM,10', 'Neh': 'PW,13', 'Jdt': 'QF,16', 'Tob': 'QV,14', '1 Mac': 'R9,16', '2 Mac': 'RP,15', 'Sab': 'S4,19', 'Eclo': 'SN,51', 'Bar': 'U2,5', 'Mt': 'UB,28', 'Mc': 'V3,16', 'Lc': 'VJ,24', 'Jn': 'W7,21', 'Hch': 'WS,28', 'Rom': 'XK,16', '1 Cor': 'Y0,16', '2 Cor': 'YG,13', 'Gal': 'YT,6', 'Ef': 'YZ,6', 'Flp': 'Z5,4', 'Col': 'Z9,4', '1 Tes': 'ZD,5', '2 Tes': 'ZI,3', '1 Tim': 'ZL,6', '2 Tim': 'ZR,4', 'Tit': 'ZV,3', 'Heb': 'ZZ,13', 'Sant': '10C,5', '1 Pe': '10H,5', '2 Pe': '10M,3', '1 Jn': '10P,5', 'Ap': '10X,22', 'Abd': 'F2', 'Flm': 'ZY', '2 Jn': '10U', '3 Jn': '10V', 'Jds': '10W' };
    const VAT_SUPL = { Est: { 1: 'Q9', 3: 'QA', 4: 'QB', 5: 'QC', 8: 'QD', 10: 'QE' }, Dan: { 3: 'U8', 13: 'U9', 14: 'UA' } }; // suplementos griegos
    const ALIAS = { 'Gén': 'Gen', 'Éx': 'Ex', 'Lv': 'Lev', 'Núm': 'Num', '1 Cro': '1 Cron', '2 Cro': '2 Cron', 'Qo': 'Ecl', 'Ct': 'Cant', 'Si': 'Eclo', 'Dn': 'Dan', 'Gál': 'Gal', 'Mateo': 'Mt', 'Marcos': 'Mc', 'Lucas': 'Lc', 'Juan': 'Jn' };
    // El Leccionario numera los salmos según la Vulgata/LXX; esta Biblia, según el hebreo.
    function salmoHebreo(g) {
        if (g <= 9 || g >= 148) return g;
        if (g <= 112 || (g >= 116 && g <= 145)) return g + 1;
        if (g === 113) return 114;
        if (g <= 115) return 116;
        return 147;
    }
    function bibliaHref(cita) {
        const m = String(cita).replace(/^\s*cf\.\s*/i, '').match(/^([1-3]\s?)?([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)\.?\s+(\d+)(?:,\s*(\d+)([a-z]?))?/);
        if (!m) return null;
        let libro = (m[1] ? m[1].trim() + ' ' : '') + m[2];
        libro = ALIAS[libro] || libro;
        const t = VAT[libro];
        if (!t) return null;
        const [ini, n, ...saltos] = t.split(',');
        if (!n) return BIBLIA + ini + '.HTM';                       // un solo capítulo
        let cap = Number(m[3]);
        const vers = Number(m[4] || 0), letra = m[5] || '';
        if (libro === 'Sal') cap = salmoHebreo(cap);
        if (libro === 'Bar' && cap === 6) return BIBLIA + 'U7.HTM';   // Carta de Jeremías
        // Suplementos griegos: Ester con versículo con letra (4, 17k) y Daniel 3, 24-90, 13 y 14.
        const supl = VAT_SUPL[libro];
        if (supl && supl[cap] && ((libro === 'Est' && letra) || (libro === 'Dan' && (cap > 12 || (cap === 3 && vers >= 24 && vers <= 90)))))
            return BIBLIA + supl[cap] + '.HTM';
        if (cap < 1 || cap > Number(n)) cap = 1;
        let p = parseInt(ini, 36) + cap - 1;
        for (const s of saltos) { const [c, extra] = s.split('+').map(Number); if (cap >= c) p += extra; }
        return BIBLIA + p.toString(36).toUpperCase() + '.HTM';
    }

    /* ══════════ Estilos (aislados, como Concepto y Calendario, reforzados) ══════════
       - Todas las declaraciones salen con !important (lo añade imp()), salvo las variables.
       - Los selectores llevan :not(#…), que suma especificidad de id: ganan también a reglas
         del sitio como «#content a{…!important}».
       - min-width evita que el cuadro se colapse si el contenedor encoge (float, inline-block…).
       - Las variables --wl-* se declaran aparte con especificidad baja para que un sitio pueda
         adaptar los colores (p. ej. «body .wikitolica-lecturas-wt{--wl-bg:…}»). */
    const P = 'wikitolica-lecturas';
    const R = `.${P}-wt:not(#${P}-x)`;
    const VARS = `
.${P}-wt{--wl-bg:#fafafa;--wl-bg-s:#f8f9fa;--wl-bd:#ddd;--wl-tx:#333;--wl-mu:#666;--wl-lk:#0d6efd;--wl-lkh:#0a58ca}
@media(prefers-color-scheme:dark){.${P}-wt{--wl-bg:#1a1a1a;--wl-bg-s:#2d2d2d;--wl-bd:#444;--wl-tx:#c0c0c0;--wl-mu:#888;--wl-lk:#4dabf7;--wl-lkh:#74c0fc}}
#${P},.${P}{margin:0}
`;
    const CSS = `
#${P},.${P}{display:block;padding:0;border:0;float:none;box-sizing:border-box;min-width:0}
${R}{
  all:initial;display:block;box-sizing:border-box;position:relative;width:100%;min-width:160px;max-width:none;height:auto;margin:0;padding:0;float:none;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size:16px;line-height:1.5;font-weight:400;font-style:normal;letter-spacing:normal;word-spacing:normal;white-space:normal;
  -webkit-text-size-adjust:100%;text-size-adjust:100%;text-align:left;direction:ltr;writing-mode:horizontal-tb;visibility:visible;
  color:var(--wl-tx);background:var(--wl-bg);border:1px solid var(--wl-bd);border-radius:0;overflow:hidden;opacity:1;filter:none;transform:none;zoom:1
}
@media(prefers-color-scheme:dark){${R}{font-weight:300;letter-spacing:.01ch}}
${R} *,${R} *::before,${R} *::after{
  box-sizing:border-box;margin:0;padding:0;border:0;border-radius:0;background:none;outline:0;
  font-family:inherit;font-size:inherit;font-weight:inherit;font-style:normal;font-feature-settings:normal;font-variant:normal;
  line-height:inherit;letter-spacing:inherit;word-spacing:inherit;white-space:inherit;text-align:inherit;visibility:inherit;
  text-transform:none;text-decoration:none;text-shadow:none;text-indent:0;vertical-align:baseline;color:inherit;
  float:none;clear:none;position:static;top:auto;right:auto;bottom:auto;left:auto;z-index:auto;
  width:auto;height:auto;min-width:0;min-height:0;max-width:none;max-height:none;overflow:visible;
  box-shadow:none;opacity:1;filter:none;transform:none;transition:none;animation:none;zoom:1;list-style:none
}
${R} *::before,${R} *::after{content:none;display:none}
${R} .${P}-a{display:inline;color:var(--wl-lk);text-decoration:none;cursor:pointer}
${R} .${P}-a:hover{text-decoration:underline;color:var(--wl-lkh)}
${R} .${P}-a:focus-visible,${R} .${P}-btn:focus-visible{outline:2px solid var(--wl-lk);outline-offset:1px}
${R} .${P}-hoy{display:flex;gap:.75em;align-items:stretch;padding:.45em .85em;background:var(--wl-bg-s);border-bottom:1px solid var(--wl-bd)}
${R} .${P}-stripe{display:block;width:3px;border-radius:2px;flex:0 0 auto;transition:background .3s;background:#2d6a4f}
${R} .${P}-body{display:block;flex:1 1 auto;min-width:0;overflow:hidden}
${R} .${P}-fecha{display:block;font-size:.67em;line-height:1.5;height:1.5em;color:var(--wl-mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
${R} .${P}-dia{display:block;font-size:.9em;font-weight:700;line-height:1.35;height:1.35em;color:var(--wl-tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
${R} .${P}-lista{display:block;font-size:.82em;line-height:1.65;height:calc(4 * 1.65em + .5em);padding:.25em 0;overflow-x:hidden;overflow-y:auto;scrollbar-width:thin;overscroll-behavior:contain}
${R} .${P}-lista::-webkit-scrollbar{display:block;width:6px;background:transparent}
${R} .${P}-lista::-webkit-scrollbar-thumb{display:block;background:var(--wl-bd);border-radius:3px}
${R} .${P}-row{display:grid;grid-template-columns:2.4em minmax(0,1fr);gap:0 .65em;align-items:start;height:1.65em;padding:0 1.05em;transition:background .1s}
${R} .${P}-row:hover{background:var(--wl-bg-s)}
${R} .${P}-k{display:block;font-size:.85em;line-height:1.94;color:var(--wl-mu);font-style:italic;text-align:right;white-space:nowrap;overflow:hidden}
${R} .${P}-v{display:block;font-weight:600;color:var(--wl-tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
${R} .${P}-o{display:inline;font-weight:400;font-style:italic;color:var(--wl-mu)}
${R} .${P}-sec{display:block;height:1.65em;padding:0 1.05em;color:var(--wl-mu);font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-top:1px dashed var(--wl-bd)}
${R} .${P}-vacio{border-top:0}
${R} .${P}-foot{display:flex;align-items:center;justify-content:space-between;gap:.5em;height:2.2em;padding:0 .6em;border-top:1px solid var(--wl-bd);background:var(--wl-bg-s);font-size:.67em;line-height:1.4;color:var(--wl-mu);white-space:nowrap}
${R} .${P}-lbl{display:flex;align-items:center;justify-content:center;flex:1 1 auto;min-width:0;overflow:hidden}
${R} .${P}-cal{position:relative;display:inline-flex;align-items:center;flex:0 1 auto;min-width:0;max-width:100%;border-radius:3px}
${R} .${P}-cal:hover .${P}-caltxt{color:var(--wl-lk);text-decoration:underline}
${R} .${P}-cal:focus-within{outline:2px solid var(--wl-lk);outline-offset:1px}
${R} .${P}-caltxt{display:block;min-width:0;padding:0 1.15em 0 .25em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--wl-mu);background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E") no-repeat right .25em center;background-size:.6em .36em}
${R} .${P}-sel{-webkit-appearance:none;appearance:none;display:block;position:absolute;top:0;left:0;width:100%;height:100%;margin:0;padding:0;border:0;opacity:0;cursor:pointer;font:inherit;font-size:1em}
${R} .${P}-sel option{color:#333;background:#fff;font-weight:400}
${R} .${P}-btn{
  -webkit-appearance:none;appearance:none;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;
  width:1.4em;height:1.6em;padding:0;font:400 1.6em/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:0;
  color:var(--wl-lk);background:transparent;border:0;border-radius:3px;cursor:pointer;transition:color .1s;vertical-align:middle;
  -webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent
}
@media(hover:hover){${R} .${P}-btn:hover{color:var(--wl-lkh)}}
${R} .${P}-btn:active{color:var(--wl-lkh)}
${R}[data-wl-narrow] .${P}-hoy{padding:.45em .55em;gap:.55em}
${R}[data-wl-narrow] .${P}-row{grid-template-columns:2.1em minmax(0,1fr);gap:0 .4em;padding:0 .6em}
${R}[data-wl-narrow] .${P}-sec{padding:0 .6em}
${R}[data-wl-narrow] .${P}-foot{padding:0 .4em}
${R}[data-wl-mini] .${P}-hoy{padding:.4em .5em;gap:.45em}
${R}[data-wl-mini] .${P}-row{grid-template-columns:1.9em minmax(0,1fr);gap:0 .35em;padding:0 .45em}
${R}[data-wl-ancho] .${P}-body{display:flex;align-items:baseline;gap:.6em}
${R}[data-wl-ancho] .${P}-fecha{flex:0 0 auto;order:2}
${R}[data-wl-ancho] .${P}-dia{flex:0 1 auto;min-width:0;order:1}
${R}[data-wl-ancho] .${P}-lista{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:1.65em;align-content:start;height:calc(2 * 1.65em + .5em)}
${R}[data-wl-ancho] .${P}-sec{grid-column:1/-1}
`;
    // Añade !important a cada declaración (menos a las variables y a las que ya lo llevan).
    const imp = css => css.replace(/\{([^{}]*)\}/g, (_, body) => '{' + body.split(';').map(d => {
        const t = d.trim();
        return !t || t.startsWith('--') || /!important$/.test(t) ? t : t + ' !important';
    }).filter(Boolean).join(';') + '}');
    const STYLE = VARS + imp(CSS);

    /* ══════════ Interfaz ══════════ */
    const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    // Colores litúrgicos (los de calendario.js; el blanco se pinta dorado para que se vea).
    const COLOR = { verde: '#2d6a4f', morado: '#5b21b6', rojo: '#7f1d1d', blanco: '#8b5e0a', rosa: '#be4d7a', negro: '#1c1917' };
    const LBL = { primera: '1.ª', salmo: 'Sal', segunda: '2.ª', evangelio: 'Ev' };
    const MIN = utcDate(1583, 1, 1), MAX = utcDate(9999, 12, 31);

    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

    function citaHTML(v, salmo) {
        const cita = typeof v === 'string' ? v : v && v.cita;
        if (!cita) return '';
        let txt = cita.replace(/\s*\(R\.?:[^)]*\)/, '');
        if (salmo) txt = txt.replace(/^Sal\s+(?=\d)/, '');
        const breve = v && typeof v === 'object' && v.forma_breve ? ` · Forma breve: ${v.forma_breve}` : '';
        const href = bibliaHref(cita);
        if (!href) return `<span title="${esc(cita + breve)}">${esc(txt)}</span>`;
        return `<a href="${href}" target="_blank" rel="nofollow external noopener" class="${P}-a" title="${esc(`Leer ${cita} en la Biblia (vatican.va)${breve}`)}">${esc(txt)}</a>`;
    }
    function rowHTML(k, vals, sep) {
        const parts = vals.filter(Boolean).map(v => citaHTML(v, k === 'Sal')).filter(Boolean);
        if (!parts.length) return '';
        return `<div class="${P}-row"><span class="${P}-k">${esc(k)}</span><span class="${P}-v">${parts.join(`<span class="${P}-o">${sep}</span>`)}</span></div>`;
    }
    function rowsHTML(t) {
        if (typeof t === 'string') return rowHTML('', [t], '');
        const out = [];
        const ops = k => [t[k]].concat(t[k + '_alt'] || []);
        if (t.procesion) out.push(rowHTML('Proc.', ops('procesion'), ' o '));
        const vig = Array.isArray(t.vigilia_lecturas) ? t.vigilia_lecturas : null;
        if (vig) vig.forEach((v, i) => out.push(rowHTML(`${i + 1}.ª`, [v.primera, v.salmo], ' · ')));
        const orden = vig ? ['segunda', 'salmo', 'evangelio'] : ['primera', 'salmo', 'segunda', 'evangelio'];
        for (const k of orden) out.push(rowHTML(vig && k === 'segunda' ? 'Ep' : LBL[k], ops(k), ' o '));
        const usadas = new Set(['vigilia_lecturas', 'misa_noche', 'misas', 'procesion', 'procesion_alt']);
        orden.concat(Object.keys(LBL)).forEach(k => { usadas.add(k); usadas.add(k + '_alt'); });
        for (const [k, v] of Object.entries(t)) {
            if (usadas.has(k) || /^aclamacion/.test(k)) continue;
            if (typeof v === 'string' || (v && v.cita)) out.push(rowHTML(k.replace(/_/g, ' '), [v], ''));
        }
        if (t.misa_noche && typeof t.misa_noche === 'object') {
            out.push(`<div class="${P}-sec">Misa de la noche</div>`);
            out.push(rowsHTML(t.misa_noche));
        }
        for (const m of t.misas || []) {
            out.push(`<div class="${P}-sec">${esc(m.titulo)}</div>`);
            out.push(rowsHTML(m.lecturas));
        }
        return out.join('');
    }
    function colorPorNombre(n) {
        if (/Difuntos/.test(n)) return 'morado';
        if (/Teresa Benedicta|m[áa]rtir|ap[óo]stol|evangelista|Santa Cruz/i.test(n) && !/^San Juan, Ap/.test(n)) return 'rojo';
        return 'blanco';
    }
    function nombreDia(day) {
        const nombre = day.memorial || day.name || '';
        const corto = nombre.replace(/Tiempo Ordinario/g, 'T. O.')
            .replace(/^Feria del 17-24 de Diciembre \(\d+ dic\)$/, 'Feria de Adviento')
            .replace(/^Feria del Tiempo de Navidad \(\d+ enero\)$/, 'Feria de Navidad')
            .replace(/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado) de la (?=\S)/, '');
        const conDia = /\b(Domingo|Lunes|Martes|Miércoles|Jueves|Viernes|Sábado)\b/.test(corto);
        const completo = day.memorial && day.name && day.name !== day.memorial ? `${day.name} · ${day.memorial}` : nombre;
        // Los datos no traen color para memorias ni fiestas: se deduce del nombre (contrastado con la CEE).
        const c = day.memorial && /Obligatoria|Fiesta/.test(day.memorial_rank || '')
            ? colorPorNombre(day.memorial)
            : String(day.color || '').toLowerCase() || colorPorNombre(day.name || '');
        const color = Object.keys(COLOR).find(k => c.startsWith(k));
        return { corto, completo, conDia, color: COLOR[color] || COLOR.verde };
    }
    function hoyUTC() { const n = new Date(); return utcDate(n.getFullYear(), n.getMonth() + 1, n.getDate()); }

    function init(host) {
        if (host.dataset.loaded) return;
        host.dataset.loaded = '1';

        if (!document.getElementById(`${P}-style`)) {
            const s = document.createElement('style');
            s.id = `${P}-style`;
            s.textContent = STYLE;
            (document.head || document.documentElement).appendChild(s);
        }

        host.innerHTML =
            `<div class="${P}-wt" role="region" aria-label="Lecturas del día">` +
                `<div class="${P}-hoy">` +
                    `<div class="${P}-stripe"></div>` +
                    `<div class="${P}-body"><div class="${P}-fecha"></div><div class="${P}-dia"></div></div>` +
                `</div>` +
                `<div class="${P}-lista" aria-live="polite"></div>` +
                `<div class="${P}-foot">` +
                    `<button type="button" class="${P}-btn" data-paso="-1" aria-label="Día anterior" title="Día anterior">‹</button>` +
                    `<span class="${P}-lbl"><span class="${P}-cal"><span class="${P}-caltxt" aria-hidden="true"></span><select class="${P}-sel" aria-label="Calendario de las lecturas">` +
                        CALENDARIOS.map(([v, t]) => `<option value="${v}">${t}</option>`).join('') +
                    `</select></span></span>` +
                    `<button type="button" class="${P}-btn" data-paso="1" aria-label="Día siguiente" title="Día siguiente">›</button>` +
                `</div>` +
            `</div>`;

        const wt = host.firstElementChild;
        const $ = c => wt.querySelector(`.${P}-${c}`);
        const fecha = $('fecha'), dia = $('dia'), stripe = $('stripe'), lista = $('lista');
        let cur = hoyUTC();
        // Calendario: el que eligió el visitante (si el navegador lo guarda) o el que fija la web con data-calendario.
        const CLAVE = `${P}-calendario`;
        let modo = /^gen/i.test(host.dataset.calendario || '') ? 'gen' : 'es';
        try { const g = localStorage.getItem(CLAVE); if (MOTOR[g]) modo = g; } catch (e) { /* sin almacenamiento */ }
        const sel = $('sel'), caltxt = $('caltxt');
        const ponTexto = () => { const o = sel.options[sel.selectedIndex]; caltxt.textContent = o ? o.text : ''; };
        sel.value = modo;
        ponTexto();
        sel.addEventListener('change', () => {
            modo = MOTOR[sel.value] ? sel.value : 'es';
            ponTexto();
            try { localStorage.setItem(CLAVE, modo); } catch (e) { /* sin almacenamiento */ }
            pintar();
        });

        function pintar() {
            const hoy = hoyUTC();
            const completa = `${DOW[cur.getUTCDay()]}, ${cur.getUTCDate()} de ${MES[cur.getUTCMonth()]} de ${cur.getUTCFullYear()}`;
            fecha.textContent = completa;
            fecha.title = completa;
            let html = '';
            try {
                const M = MOTOR[modo];
                const nd = nombreDia(M.diaCEE(cur));
                dia.textContent = nd.corto;
                fecha.textContent = `${nd.conDia ? '' : DOW[cur.getUTCDay()] + ', '}${cur.getUTCDate()} de ${MES[cur.getUTCMonth()]}` +
                    (cur.getUTCFullYear() !== hoy.getUTCFullYear() ? ` de ${cur.getUTCFullYear()}` : '');
                dia.title = nd.completo;
                stripe.style.setProperty('background', nd.color, 'important');
                html = rowsHTML(M.lecturasCEE(cur));
            } catch (e) { /* sin lecturas para esta fecha */ }
            lista.innerHTML = html || `<div class="${P}-sec ${P}-vacio">Sin lecturas para este día</div>`;
            lista.scrollTop = 0;
        }
        function mover(n) {
            const d = addDays(cur, n);
            if (d < MIN || d > MAX) return;
            cur = d;
            pintar();
        }

        // Flechas: un toque avanza un día; mantener pulsado avanza rápido.
        let espera = 0, ritmo = 0, porPuntero = false;
        const parar = () => { clearTimeout(espera); clearInterval(ritmo); espera = ritmo = 0; };
        wt.querySelectorAll(`.${P}-btn`).forEach(btn => {
            const paso = Number(btn.dataset.paso);
            btn.addEventListener('pointerdown', e => {
                if (e.button !== 0) return;
                porPuntero = true;
                parar();
                mover(paso);
                espera = setTimeout(() => { ritmo = setInterval(() => mover(paso), 120); }, 400);
            });
            ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach(ev => btn.addEventListener(ev, parar));
            btn.addEventListener('contextmenu', e => e.preventDefault());
            btn.addEventListener('click', e => {
                e.preventDefault();
                if (porPuntero) { porPuntero = false; return; }
                mover(paso); // teclado (Intro / Espacio)
            });
        });
        wt.addEventListener('keydown', e => {
            if (e.altKey || e.ctrlKey || e.metaKey || e.target === sel) return;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                mover(e.key === 'ArrowLeft' ? -1 : 1);
            }
        });

        pintar();

        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(([e]) => {
                const w = e.contentRect.width;
                wt.toggleAttribute('data-wl-narrow', w < 280);
                wt.toggleAttribute('data-wl-mini', w < 230);
                wt.toggleAttribute('data-wl-ancho', w >= 400);
                CALENDARIOS.forEach(([, t, corto], i) => { sel.options[i].text = w < 230 ? corto : t; });
                ponTexto();
            }).observe(wt);
        }
    }

    function bootstrap() {
        document.querySelectorAll(`#${P},.${P}`).forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

    if (typeof window !== 'undefined') {
        window.WtLecturas = { init: bootstrap, initEl: init };
    }

})();
