/**
 * tooltips.js - Enciclopedia Wikitólica
 * Incluye fzstd (https://github.com/101arrowz/fzstd) de Arjun Barrett,
 * 
 * MIT License
 * Copyright (c) 2020 Arjun Barrett
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/
(function () {
    'use strict';
    if (typeof window === 'undefined' || typeof document === 'undefined') return; // solo tiene sentido en un navegador
    if (window.WtTooltips) return; // ya cargado (script incluido dos veces en la misma página)

    // ── Configuración editable ──────────────────────────────────────────
    const BASE = 'https://www.wikitolica.com';
    const DATA_URL = 'https://cdn.jsdelivr.net/gh/CursoCatolico/wikitolica-widgets@main/contextdata.json.zst';
    const MAX_PER_TERM = 2;
    const RELINK_DEBOUNCE = 400, RELINK_MAX_WAIT = 3000; // reescaneo tras cambios en el DOM (ver relink())

    // Etiquetas que nunca se consideran "texto general" de una web genérica
    const EXCLUDE_TAGS = new Set([
        'A', 'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TEXTAREA', 'INPUT',
        'SELECT', 'OPTION', 'BUTTON', 'SVG', 'MATH', 'CODE', 'PRE', 'IFRAME',
        'NAV', 'HEADER', 'FOOTER', 'ASIDE', 'FORM', 'LABEL', 'DIALOG', 'H1',
        'H2', 'H3', 'H4', 'H5', 'H6', 'DETAILS', 'DIALOG'
    ]);
    // Selectores adicionales (roles ARIA + clases habituales de menú/sidebar/etc.)
    const EXCLUDE_SEL = '[role="navigation"],[role="banner"],[role="contentinfo"],' +
        '[role="complementary"],[role="search"],[role="menu"],[role="menubar"],' +
        '[role="dialog"],[role="alertdialog"],[role="tooltip"],[role="tablist"],' +
        '.menu,.nav,.navbar,.sidebar,.widget,.comments,.comment,.cookie,.cookies,' +
        '.modal,.popup,.breadcrumb,.pagination,.share,.social,.ads,.advertisement,' +
        '.related-box,.toc,.cmtarea';

    const u = p => BASE + p;
    const SELF = /^(www\.)?wikitolica\.com$/.test(typeof location !== 'undefined' ? location.hostname : '');
    const isTouch = typeof matchMedia === 'function'
        ? matchMedia('(hover: none), (pointer: coarse)').matches
        : ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // ── fzstd v0.1.1 incrustado (build UMD oficial, sin el wrapper de detección
    // de módulo/AMD/global — aquí solo nos interesa el factory como const local,
    // para no filtrar window.fzstd). Código de librería sin modificar; no tocar.
    // https://github.com/101arrowz/fzstd — MIT License, © 2020 Arjun Barrett.
    const ZSTD = (function () { var _e = {}; "use strict"; var r = ArrayBuffer, t = Uint8Array, e = Uint16Array, n = Int16Array, a = Uint32Array, s = Int32Array, i = function (r, e, n) { if (t.prototype.slice) return t.prototype.slice.call(r, e, n); (null == e || e < 0) && (e = 0), (null == n || n > r.length) && (n = r.length); var a = new t(n - e); return a.set(r.subarray(e, n)), a }, o = function (r, e, n, a) { if (t.prototype.fill) return t.prototype.fill.call(r, e, n, a); for ((null == n || n < 0) && (n = 0), (null == a || a > r.length) && (a = r.length); n < a; ++n)r[n] = e; return r }, u = function (r, e, n, a) { if (t.prototype.copyWithin) return t.prototype.copyWithin.call(r, e, n, a); for ((null == n || n < 0) && (n = 0), (null == a || a > r.length) && (a = r.length); n < a;)r[e++] = r[n++] }; _e.ZstdErrorCode = { InvalidData: 0, WindowSizeTooLarge: 1, InvalidBlockType: 2, FSEAccuracyTooHigh: 3, DistanceTooFarBack: 4, UnexpectedEOF: 5 }; var h = ["invalid zstd data", "window size too large (>2046MB)", "invalid block type", "FSE accuracy too high", "match distance too far back", "unexpected EOF"], f = function (r, t, e) { var n = Error(t || h[r]); if (n.code = r, Error.captureStackTrace && Error.captureStackTrace(n, f), !e) throw n; return n }, l = function (r, t, e) { for (var n = 0, a = 0; n < e; ++n)a |= r[t++] << (n << 3); return a }, v = function (r, t) { return (r[t] | r[t + 1] << 8 | r[t + 2] << 16 | r[t + 3] << 24) >>> 0 }, c = function (r, e) { var n = r[0] | r[1] << 8 | r[2] << 16; if (3126568 == n && 253 == r[3]) { var a = r[4], i = a >> 5 & 1, o = a >> 2 & 1, u = 3 & a, h = a >> 6; 8 & a && f(0); var c = 6 - i, b = 3 == u ? 4 : u, y = l(r, c, b), p = h ? 1 << h : i, w = l(r, c += b, p) + (1 == h && 256), g = w; if (!i) { var d = 1 << 10 + (r[5] >> 3); g = d + (d >> 3) * (7 & r[5]) } g > 2145386496 && f(1); var m = new t((1 == e ? w || g : e ? 0 : g) + 12); return m[0] = 1, m[4] = 4, m[8] = 8, { b: c + p, y: 0, l: 0, d: y, w: e && 1 != e ? e : m.subarray(12), e: g, o: new s(m.buffer, 0, 3), u: w, c: o, m: Math.min(131072, g) } } if (25481893 == (n >> 4 | r[3] << 20)) return v(r, 4) + 8; f(0) }, b = function (r) { for (var t = 0; 1 << t <= r; ++t); return t - 1 }, y = function (a, s, i) { var o = 4 + (s << 3), u = 5 + (15 & a[s]); u > i && f(3); for (var h = 1 << u, l = h, v = -1, c = -1, y = -1, p = h, w = new r(512 + (h << 2)), g = new n(w, 0, 256), d = new e(w, 0, 256), m = new e(w, 512, h), z = 512 + (h << 1), E = new t(w, z, h), k = new t(w, z + h); v < 255 && l > 0;) { var A = b(l + 1), T = o >> 3, x = (1 << A + 1) - 1, F = (a[T] | a[T + 1] << 8 | a[T + 2] << 16) >> (7 & o) & x, S = (1 << A) - 1, B = x - l - 1, I = F & S; if (I < B ? (o += A, F = I) : (o += A + 1, F > S && (F -= B)), g[++v] = --F, -1 == F ? (l += F, E[--p] = v) : l -= F, !F) do { var U = o >> 3; c = (a[U] | a[U + 1] << 8) >> (7 & o) & 3, o += 2, v += c } while (3 == c) } (v > 255 || l) && f(0); for (var D = 0, M = (h >> 1) + (h >> 3) + 3, W = h - 1, O = 0; O <= v; ++O) { var j = g[O]; if (j < 1) d[O] = -j; else for (y = 0; y < j; ++y) { E[D] = O; do { D = D + M & W } while (D >= p) } } for (D && f(0), y = 0; y < h; ++y) { var C = d[E[y]]++, H = k[y] = u - b(C); m[y] = (C << H) - h } return [o + 7 >> 3, { b: u, s: E, n: k, t: m }] }, p = function (r, n) { var a = 0, s = -1, i = new t(292), u = r[n], h = i.subarray(0, 256), l = i.subarray(256, 268), v = new e(i.buffer, 268); if (u < 128) { var c = y(r, n + 1, 6), p = c[1], w = c[0] << 3, g = r[n += u]; g || f(0); for (var d = 0, m = 0, z = p.b, E = z, k = (++n << 3) - 8 + b(g); !((k -= z) < w);) { var A = k >> 3; if (h[++s] = p.s[d += (r[A] | r[A + 1] << 8) >> (7 & k) & (1 << z) - 1], (k -= E) < w) break; h[++s] = p.s[m += (r[A = k >> 3] | r[A + 1] << 8) >> (7 & k) & (1 << E) - 1], z = p.n[d], d = p.t[d], E = p.n[m], m = p.t[m] } ++s > 255 && f(0) } else { for (s = u - 127; a < s; a += 2) { var T = r[++n]; h[a] = T >> 4, h[a + 1] = 15 & T } ++n } var x = 0; for (a = 0; a < s; ++a)(I = h[a]) > 11 && f(0), x += I && 1 << I - 1; var F = b(x) + 1, S = 1 << F, B = S - x; for (B & B - 1 && f(0), h[s++] = b(B) + 1, a = 0; a < s; ++a) { var I; ++l[h[a] = (I = h[a]) && F + 1 - I] } var U = new t(S << 1), D = U.subarray(0, S), M = U.subarray(S); for (v[F] = 0, a = F; a > 0; --a) { var W = v[a]; o(M, a, W, v[a - 1] = W + l[a] * (1 << F - a)) } for (v[0] != S && f(0), a = 0; a < s; ++a) { var O = h[a]; if (O) { var j = v[O]; o(D, a, j, v[O] = j + (1 << F - O)) } } return [n, { n: M, b: F, s: D }] }, w = y(new t([81, 16, 99, 140, 49, 198, 24, 99, 12, 33, 196, 24, 99, 102, 102, 134, 70, 146, 4]), 0, 6)[1], g = y(new t([33, 20, 196, 24, 99, 140, 33, 132, 16, 66, 8, 33, 132, 16, 66, 8, 33, 68, 68, 68, 68, 68, 68, 68, 68, 36, 9]), 0, 6)[1], d = y(new t([32, 132, 16, 66, 102, 70, 68, 68, 68, 68, 36, 73, 2]), 0, 5)[1], m = function (r, t) { for (var e = r.length, n = new s(e), a = 0; a < e; ++a)n[a] = t, t += 1 << r[a]; return n }, z = new t(new s([0, 0, 0, 0, 16843009, 50528770, 134678020, 202050057, 269422093]).buffer, 0, 36), E = m(z, 0), k = new t(new s([0, 0, 0, 0, 0, 0, 0, 0, 16843009, 50528770, 117769220, 185207048, 252579084, 16]).buffer, 0, 53), A = m(k, 3), T = function (r, t, e) { var n = r.length, a = t.length, s = r[n - 1], i = (1 << e.b) - 1, o = -e.b; s || f(0); for (var u = 0, h = e.b, l = (n << 3) - 8 + b(s) - h, v = -1; l > o && v < a;) { var c = l >> 3; t[++v] = e.s[u = (u << h | (r[c] | r[c + 1] << 8 | r[c + 2] << 16) >> (7 & l)) & i], l -= h = e.n[u] } l == o && v + 1 == a || f(0) }, x = function (r, t, e) { var n = 6, a = t.length + 3 >> 2, s = a << 1, i = a + s; T(r.subarray(n, n += r[0] | r[1] << 8), t.subarray(0, a), e), T(r.subarray(n, n += r[2] | r[3] << 8), t.subarray(a, s), e), T(r.subarray(n, n += r[4] | r[5] << 8), t.subarray(s, i), e), T(r.subarray(n), t.subarray(i), e) }, F = function (r, n, a) { var s, u = n.b, h = r[u], l = h >> 1 & 3; n.l = 1 & h; var v = h >> 3 | r[u + 1] << 5 | r[u + 2] << 13, c = (u += 3) + v; if (1 == l) { if (u >= r.length) return; return n.b = u + 1, a ? (o(a, r[u], n.y, n.y += v), a) : o(new t(v), r[u]) } if (!(c > r.length)) { if (0 == l) return n.b = c, a ? (a.set(r.subarray(u, c), n.y), n.y += v, a) : i(r, u, c); if (2 == l) { var m = r[u], F = 3 & m, S = m >> 2 & 3, B = m >> 4, I = 0, U = 0; F < 2 ? 1 & S ? B |= r[++u] << 4 | (2 & S && r[++u] << 12) : B = m >> 3 : (U = S, S < 2 ? (B |= (63 & r[++u]) << 4, I = r[u] >> 6 | r[++u] << 2) : 2 == S ? (B |= r[++u] << 4 | (3 & r[++u]) << 12, I = r[u] >> 2 | r[++u] << 6) : (B |= r[++u] << 4 | (63 & r[++u]) << 12, I = r[u] >> 6 | r[++u] << 2 | r[++u] << 10)), ++u; var D = a ? a.subarray(n.y, n.y + n.m) : new t(n.m), M = D.length - B; if (0 == F) D.set(r.subarray(u, u += B), M); else if (1 == F) o(D, r[u++], M); else { var W = n.h; if (2 == F) { var O = p(r, u); I += u - (u = O[0]), n.h = W = O[1] } else W || f(0); (U ? x : T)(r.subarray(u, u += I), D.subarray(M), W) } var j = r[u++]; if (j) { 255 == j ? j = 32512 + (r[u++] | r[u++] << 8) : j > 127 && (j = j - 128 << 8 | r[u++]); var C = r[u++]; 3 & C && f(0); for (var H = [g, d, w], L = 2; L > -1; --L) { var Z = C >> 2 + (L << 1) & 3; if (1 == Z) { var q = new t([0, 0, r[u++]]); H[L] = { s: q.subarray(2, 3), n: q.subarray(0, 1), t: new e(q.buffer, 0, 1), b: 0 } } else 2 == Z ? (u = (s = y(r, u, 9 - (1 & L)))[0], H[L] = s[1]) : 3 == Z && (n.t || f(0), H[L] = n.t[L]) } var G = n.t = H, J = G[0], K = G[1], N = G[2], P = r[c - 1]; P || f(0); var Q = (c << 3) - 8 + b(P) - N.b, R = Q >> 3, V = 0, X = (r[R] | r[R + 1] << 8) >> (7 & Q) & (1 << N.b) - 1, Y = (r[R = (Q -= K.b) >> 3] | r[R + 1] << 8) >> (7 & Q) & (1 << K.b) - 1, $ = (r[R = (Q -= J.b) >> 3] | r[R + 1] << 8) >> (7 & Q) & (1 << J.b) - 1; for (++j; --j;) { var _ = N.s[X], rr = N.n[X], tr = J.s[$], er = J.n[$], nr = K.s[Y], ar = K.n[Y], sr = 1 << nr, ir = sr + ((r[R = (Q -= nr) >> 3] | r[R + 1] << 8 | r[R + 2] << 16 | r[R + 3] << 24) >>> (7 & Q) & sr - 1); R = (Q -= k[tr]) >> 3; var or = A[tr] + ((r[R] | r[R + 1] << 8 | r[R + 2] << 16) >> (7 & Q) & (1 << k[tr]) - 1); R = (Q -= z[_]) >> 3; var ur = E[_] + ((r[R] | r[R + 1] << 8 | r[R + 2] << 16) >> (7 & Q) & (1 << z[_]) - 1); if (R = (Q -= rr) >> 3, X = N.t[X] + ((r[R] | r[R + 1] << 8) >> (7 & Q) & (1 << rr) - 1), R = (Q -= er) >> 3, $ = J.t[$] + ((r[R] | r[R + 1] << 8) >> (7 & Q) & (1 << er) - 1), R = (Q -= ar) >> 3, Y = K.t[Y] + ((r[R] | r[R + 1] << 8) >> (7 & Q) & (1 << ar) - 1), ir > 3) n.o[2] = n.o[1], n.o[1] = n.o[0], n.o[0] = ir -= 3; else { var hr = ir - (0 != ur); hr ? (ir = 3 == hr ? n.o[0] - 1 : n.o[hr], hr > 1 && (n.o[2] = n.o[1]), n.o[1] = n.o[0], n.o[0] = ir) : ir = n.o[0] } for (L = 0; L < ur; ++L)D[V + L] = D[M + L]; M += ur; var fr = (V += ur) - ir; if (fr < 0) { var lr = -fr, vr = n.e + fr; for (lr > or && (lr = or), L = 0; L < lr; ++L)D[V + L] = n.w[vr + L]; V += lr, or -= lr, fr = 0 } for (L = 0; L < or; ++L)D[V + L] = D[fr + L]; V += or } if (V != M) for (; M < D.length;)D[V++] = D[M++]; else V = D.length; a ? n.y += V : D = i(D, 0, V) } else if (a) { if (n.y += B, M) for (L = 0; L < B; ++L)D[L] = D[M + L] } else M && (D = i(D, M)); return n.b = c, D } f(2) } }, S = function (r, e) { if (1 == r.length) return r[0]; for (var n = new t(e), a = 0, s = 0; a < r.length; ++a) { var i = r[a]; n.set(i, s), s += i.length } return n }; function B(r, t) { for (var e = [], n = +!t, a = 0, s = 0; r.length;) { var i = c(r, n || t); if ("object" == typeof i) { for (n ? (t = null, i.w.length == i.u && (e.push(t = i.w), s += i.u)) : (e.push(t), i.e = 0); !i.l;) { var o = F(r, i, t); o || f(5), t ? i.e = i.y : (e.push(o), s += o.length, u(i.w, 0, o.length), i.w.set(o, i.w.length - o.length)) } a = i.b + 4 * i.c } else a = i; r = r.subarray(a) } return S(e, s) } _e.decompress = B; var I = function () { function r(r) { this.ondata = r, this.c = [], this.l = 0, this.z = 0 } return r.prototype.push = function (r, e) { if ("number" == typeof this.s) { var n = Math.min(r.length, this.s); r = r.subarray(n), this.s -= n } var a = r.length + this.l; if (!this.s) { if (e) { if (!a) return void this.ondata(new t(0), !0); a < 5 && f(5) } else if (a < 18) return this.c.push(r), void (this.l = a); if (this.l && (this.c.push(r), r = S(this.c, a), this.c = [], this.l = 0), "number" == typeof (this.s = c(r))) return this.push(r, e) } if ("number" != typeof this.s) { if (a < (this.z || 3)) return e && f(5), this.c.push(r), void (this.l = a); if (this.l && (this.c.push(r), r = S(this.c, a), this.c = [], this.l = 0), !this.z && a < (this.z = 2 & r[this.s.b] ? 4 : 3 + (r[this.s.b] >> 3 | r[this.s.b + 1] << 5 | r[this.s.b + 2] << 13))) return e && f(5), this.c.push(r), void (this.l = a); for (this.z = 0;;) { var s = F(r, this.s); if (!s) { e && f(5); var i = r.subarray(this.s.b); return this.s.b = 0, this.c.push(i), void (this.l += i.length) } if (this.ondata(s, !1), u(this.s.w, 0, s.length), this.s.w.set(s, this.s.w.length - s.length), this.s.l) { var o = r.subarray(this.s.b); return this.s = 4 * this.s.c, void this.push(o, e) } } } else e && f(5) }, r }(); _e.Decompress = I; return _e })();

    // ── slugify (portado literal de custom.js, para derivar slug↔título) ─
    function slugify(input) {
        const maxLength = 120;
        let s = input.normalize('NFD').replace(/\p{Diacritic}/gu, '');
        s = s.replace(/&/g, ' y ').replace(/[@|]/g, ' ').replace(/['’‛“”"«»]/g, '');
        s = s.replace(/[^a-zA-Z0-9]+/g, '-');
        s = s.replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
        s = s.toLowerCase();
        if (maxLength && s.length > maxLength) {
            s = s.slice(0, maxLength).replace(/-[^-]*$/, '');
        }
        return s || 'n-a';
    }

    // Minúsculas + sin tildes/diéresis/eñe (misma lógica que la búsqueda de
    // custom.js). Clave: normalize() nunca cambia la longitud del string
    // (1 combinante NFD por carácter compuesto), así que match.index y
    // match[0].length sobre el texto normalizado son válidos directamente
    // sobre el texto original, tenga o no tildes.
    const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    function currentSlug() {
        const m = location.pathname.match(/^\/[a-z0-9]\/([a-z0-9-]+)\/$/i);
        return m ? m[1].toLowerCase() : null;
    }

    // ── Índice de términos a partir de contextdata ──────────────────────
    // Formato actual: p/q/i son slug -> descripción (string directo, sin
    // imagen); están repartidos sin solapes entre los tres, así que basta
    // con probarlos en orden y quedarse con el primero que responda.
    function buildIndex(data) {
        const self = currentSlug();
        const bySlug = new Map();  // slug -> { path, desc }
        const normSet = new Set(); // términos normalizados válidos para autoenlazar
        for (const title of data.s) {
            const slug = slugify(title);
            const desc = data.p[slug] ?? data.q[slug] ?? data.i[slug];
            if (desc === undefined) continue;
            if (!bySlug.has(slug)) {
                bySlug.set(slug, { path: '/' + slug[0] + '/' + slug + '/', desc });
            }
            if (slug === self) continue; // un artículo no se autoenlaza a sí mismo
            const norm = normalize(title);
            if (norm) normSet.add(norm);
        }
        if (!normSet.size) return { bySlug, regex: null };
        const alt = [...normSet]
            .sort((a, b) => b.length - a.length) // términos largos primero (Santísima Trinidad antes que Trinidad)
            .map(n => escRe(n).replace(/ /g, '\\s+')) // tolera saltos de línea/espacios múltiples del host
            .join('|');
        return { bySlug, regex: new RegExp('\\b(?:' + alt + ')\\b', 'g') };
    }

    // ── Autoenlazado de document.body ────────────────────────────────────
    function eligible(el) {
        while (el && el !== document.body) {
            if (EXCLUDE_TAGS.has(el.tagName) || el.isContentEditable) return false;
            if (el.matches(EXCLUDE_SEL)) return false;
            el = el.parentElement;
        }
        return true;
    }

    // Fuerza por JS con prioridad !important: una clase en la hoja de estilos
    // puede perder contra un selector compuesto del host (p.ej. ".content a");
    // el estilo inline con !important gana casi siempre, sea cual sea la
    // especificidad del CSS ajeno.
    function important(el, props) {
        for (const k in props) el.style.setProperty(k, props[k], 'important');
    }

    function makeLink(path, text, slug) {
        const a = document.createElement('a');
        a.href = u(path);
        a.className = 'wikitolica-tooltip-a';
        a.dataset.wtSlug = slug;
        if (!SELF) { a.target = '_blank'; a.rel = 'nofollow external noopener'; }
        a.textContent = text;
        important(a, { color: 'inherit', 'text-decoration-line': 'underline', 'text-decoration-style': 'dotted', cursor: 'help' });
        return a;
    }

    function linkify(index) {
        if (!index.regex) return;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode(n) {
                return n.nodeValue.trim() && eligible(n.parentElement)
                    ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });
        const nodes = [];
        let n;
        while ((n = walker.nextNode())) nodes.push(n);

        for (const node of nodes) {
            try {
                const original = node.nodeValue;
                const norm = normalize(original);
                index.regex.lastIndex = 0;
                let m, last = 0, frag = null;
                while ((m = index.regex.exec(norm))) {
                    const text = original.slice(m.index, m.index + m[0].length);
                    const slug = slugify(text); // slugify ya ignora may/min y tildes → resuelve al mismo slug que el título canónico
                    const info = index.bySlug.get(slug);
                    const done = linkCounts.get(slug) || 0;
                    if (!info || done >= MAX_PER_TERM) continue; // se deja como texto plano, sin consumir hueco ajeno
                    linkCounts.set(slug, done + 1);
                    frag = frag || document.createDocumentFragment();
                    frag.appendChild(document.createTextNode(original.slice(last, m.index)));
                    frag.appendChild(makeLink(info.path, text, slug));
                    last = m.index + m[0].length;
                }
                if (frag) {
                    frag.appendChild(document.createTextNode(original.slice(last)));
                    node.replaceWith(frag);
                }
            } catch (err) {
                // un nodo raro de una web ajena no debe tirar abajo el resto del escaneo
                console.error('WtTooltips: fallo autoenlazando un nodo', err);
            }
        }
    }

    // disconnect() vacía la cola de registros pendientes y detiene la entrega
    // (está en el spec, no es una suposición de timing): como linkify() es
    // síncrono, todo lo que muta él mismo pasa mientras el observer está
    // desconectado y nunca llega a encolarse. Por eso no hace falta detectar
    // "esto lo hice yo" a posteriori inspeccionando los registros.
    function relink() {
        clearTimeout(relinkTimer);
        if (mutationObserver) mutationObserver.disconnect();
        try { linkify(index); } catch (err) { console.error('WtTooltips: fallo autoenlazando', err); }
        if (mutationObserver) mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Debounce normal de 400ms tras la última mutación, con un tope de 3s:
    // una web con mutaciones continuas (un contador, un ticker) no debe poder
    // posponer el reescaneo indefinidamente.
    function scheduleRelink() {
        const now = Date.now();
        if (!burstStart) burstStart = now;
        clearTimeout(relinkTimer);
        if (now - burstStart >= RELINK_MAX_WAIT) { burstStart = 0; relink(); }
        else relinkTimer = setTimeout(() => { burstStart = 0; relink(); }, RELINK_DEBOUNCE);
    }

    // ── Popup (Shadow DOM, sin imágenes) ────────────────────────────────
    // Wrapper en luz: solo media queries aquí (no se pueden aplicar por JS).
    // all/position/z-index/display/margin van por JS con !important (más abajo,
    // en important()) porque un !important en hoja de estilos externa puede o
    // no ganar según el navegador; el estilo inline es la apuesta más segura.
    const HOST_CSS = `
@media print{.wikitolica-tooltip-host{display:none!important}}`;

    // Todo lo visual vive dentro del shadow root: el host no puede filtrar CSS hacia dentro ni hacia fuera.
    // Nada de zoom/transform:scale aquí: position() lee offsetWidth/offsetHeight
    // en directo, así que cualquier escalado visual desincroniza esa medida
    // del sitio real donde pinta el navegador. Para achicar en móvil, max-width
    // y font-size normales: son layout de verdad, offsetWidth ya sale correcto.
    const SHADOW_CSS = `
:host{all:initial}
.c{box-sizing:border-box;display:block;max-width:300px;min-width:200px;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif;
  font-size:.82rem;line-height:1.45;padding:.65em .8em;overflow-wrap:break-word;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  background:var(--bg);border:1px solid var(--bd);border-radius:8px;box-shadow:var(--sh);
  color:var(--mu);cursor:pointer;user-select:none;opacity:0;transform:translateY(5px);
  --bg:#fff;--bd:#ddd;--mu:#5f6368;--sh:0 4px 20px rgba(0,0,0,.18)}
@media(max-width:480px){.c{max-width:260px;font-size:.78rem}}
@media(prefers-color-scheme:dark){.c{--bg:#1a1a1a;--bd:#444;--mu:#9aa0a6;--sh:0 4px 20px rgba(0,0,0,.5)}}
.c.v{animation:wtt-fade .15s ease forwards}
@keyframes wtt-fade{to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.c{transition:none!important}.c.v{animation:none!important;opacity:1!important;transform:none!important}}`;

    // Lo crítico (color/subrayado/cursor) ya va inline con !important desde
    // makeLink(); aquí solo queda lo que una hoja de estilos SÍ puede hacer
    // (pseudo-clase :hover y un detalle de tipografía que no es crítico).
    // El hover oscurece en claro pero aclara en oscuro: oscurecer un texto ya
    // claro sobre fondo oscuro reduce el contraste en vez de resaltarlo.
    const LINK_CSS = `
.wikitolica-tooltip-a{transition:filter .15s ease}
.wikitolica-tooltip-a:hover{filter:brightness(.82)}
@media(prefers-color-scheme:dark){.wikitolica-tooltip-a:hover{filter:brightness(1.3)}}
@media(prefers-reduced-motion:reduce){.wikitolica-tooltip-a{transition:none}}`;

    let popupHost, content, active = null, showTimer, hideTimer, index;
    let mutationObserver = null, relinkTimer = null, burstStart = 0;
    const linkCounts = new Map(); // slug -> nº de enlaces nuevos ya creados (persiste entre llamadas a init)

    function initPopup() {
        if (!document.getElementById('wikitolica-tooltip-style')) {
            const s = document.createElement('style');
            s.id = 'wikitolica-tooltip-style';
            s.textContent = HOST_CSS + '\n' + LINK_CSS;
            document.head.appendChild(s);
        }
        popupHost = document.createElement('div');
        popupHost.className = 'wikitolica-tooltip-host';
        important(popupHost, {
            all: 'initial', position: 'fixed', top: '0', left: '0',
            'z-index': '2147483647', display: 'none', margin: '0'
        });
        const shadow = popupHost.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<style>${SHADOW_CSS}</style><div class="c"></div>`;
        content = shadow.querySelector('.c');
        document.body.appendChild(popupHost);

        content.addEventListener('mouseenter', () => clearTimeout(hideTimer));
        content.addEventListener('mouseleave', hide);
        content.addEventListener('click', e => {
            if (!active) return;
            const href = active.el.href;
            if (!SELF || e.metaKey || e.ctrlKey) window.open(href, '_blank', 'noopener');
            else location.href = href;
        });
        addEventListener('scroll', hide, { passive: true });
        (window.visualViewport || window).addEventListener('resize', hide);
        if (window.visualViewport) window.visualViewport.addEventListener('scroll', hide, { passive: true });
    }

    function position(el) {
        void popupHost.offsetHeight; // fuerza reflow antes de medir
        const ref = el.getBoundingClientRect();
        const pw = popupHost.offsetWidth, ph = popupHost.offsetHeight, gap = 3, pad = 7;
        let x = ref.left + ref.width / 2 - pw / 2;
        let y = ref.top - ph - gap;
        if (y < pad) y = ref.bottom + gap;
        if (y + ph > innerHeight - pad) y = Math.max(pad, innerHeight - ph - pad);
        if (x < pad) x = pad;
        if (x + pw > innerWidth - pad) x = Math.max(pad, innerWidth - pw - pad);
        important(popupHost, { left: x + 'px', top: y + 'px' });
    }

    // Doble rAF con transition/animation:none: evita el glitch de reposicionar
    // un popup que ya estaba a mitad de una animación (fix ya validado en custom.js).
    // Comprobar active.slug===slug (no solo "active" truthy) evita que un reveal()
    // viejo reposicione el popup si mientras tanto se activó otro enlace distinto.
    function reveal(el, slug) {
        content.style.transition = 'none';
        content.style.animation = 'none';
        important(popupHost, { visibility: 'hidden', display: 'block' });
        content.classList.add('v');
        requestAnimationFrame(() => {
            if (!active || active.slug !== slug) return;
            position(el);
            requestAnimationFrame(() => {
                if (!active || active.slug !== slug) return;
                content.style.transition = '';
                content.style.animation = '';
                popupHost.style.removeProperty('visibility');
                position(el);
            });
        });
    }

    function hide() {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
        if (!active) return;
        important(popupHost, { display: 'none' });
        content.classList.remove('v');
        active = null;
    }

    function show(el, slug) {
        const info = index.bySlug.get(slug);
        if (!info) return;
        content.textContent = info.desc;
        reveal(el, slug);
    }

    function scheduleShow(el, slug, delay) {
        clearTimeout(hideTimer);
        clearTimeout(showTimer);
        active = { el, slug };
        if (delay) showTimer = setTimeout(() => show(el, slug), delay);
        else show(el, slug);
    }

    function scheduleHide(delay) {
        clearTimeout(showTimer);
        hideTimer = setTimeout(hide, delay);
    }

    // ── Resolución de slug para enlaces, tanto nuevos como ya existentes ─
    function slugFromLink(a) {
        if (a.dataset.wtSlug) return a.dataset.wtSlug;
        if (a.hostname !== 'www.wikitolica.com' && a.hostname !== 'wikitolica.com') return null;
        const m = a.pathname.match(/^\/[a-z0-9]\/([a-z0-9-]+)\/$/i);
        return m ? m[1].toLowerCase() : null;
    }

    function attachEvents() {
        // focusin/focusout: independiente de isTouch, un teclado puede coexistir
        // con cualquier dispositivo. Sin delay (el foco ya es una acción deliberada,
        // no hay "hover de paso" que proteger) y sin gracia al perderlo (no hay
        // forma de "mover el puntero dentro del popup" navegando por teclado).
        document.body.addEventListener('focusin', e => {
            const a = e.target.closest('a[href]');
            const slug = a && slugFromLink(a);
            if (slug && index.bySlug.has(slug)) scheduleShow(a, slug, 0);
        });
        document.body.addEventListener('focusout', e => {
            if (active && e.target.closest('a[href]') === active.el) hide();
        });

        if (!isTouch) {
            document.body.addEventListener('mouseover', e => {
                const a = e.target.closest('a[href]');
                const slug = a && slugFromLink(a);
                if (!slug || !index.bySlug.has(slug)) return;
                if (active && active.el === a) { clearTimeout(hideTimer); return; }
                scheduleShow(a, slug, 390);
            });
            document.body.addEventListener('mouseout', e => {
                if (!active) return;
                const a = e.target.closest('a[href]');
                if (a !== active.el) return;
                if (e.relatedTarget && active.el.contains(e.relatedTarget)) return;
                scheduleHide(120);
            });
        } else {
            document.addEventListener('click', e => {
                if (popupHost.contains(e.target)) return;
                const a = e.target.closest('a[href]');
                const slug = a && slugFromLink(a);
                if (!slug || !index.bySlug.has(slug)) { if (active) hide(); return; }
                // segundo tap sobre el mismo enlace: ocultar y NO preventDefault,
                // así el navegador sigue el href con normalidad (tap = peek, tap = ir).
                if (active && active.slug === slug) { hide(); return; }
                e.preventDefault();
                scheduleShow(a, slug, 0);
            });
        }
    }

    // ── Arranque ──────────────────────────────────────────────────────────
    // setupPromise garantiza que fetch+índice+popup+listeners+observer se
    // montan una única vez, aunque bootstrap() se llame varias veces o
    // concurrentemente. El MutationObserver reescanea solo cuando el body
    // cambia (AJAX, infinite scroll, SPA) — no hace falta llamar a nada a
    // mano; window.WtTooltips.init() queda como forzado manual opcional
    // (por ejemplo, para saltarse el debounce justo después de un cambio).
    let setupPromise = null;

    async function setup() {
        let data = window._contextdata; // por si otro script (custom.js) ya lo cargó
        if (!data) {
            try {
                const r = await fetch(DATA_URL);
                if (!r.ok) throw new Error('HTTP ' + r.status);
                const buf = await r.arrayBuffer();
                data = JSON.parse(new TextDecoder().decode(ZSTD.decompress(new Uint8Array(buf))));
            } catch (err) {
                console.error('WtTooltips: no se pudo cargar contextdata.json.zst', err);
                return;
            }
        }
        try {
            index = buildIndex(data);
            initPopup();
            attachEvents();
            mutationObserver = new MutationObserver(records => {
                // ignora de raíz lo que pase dentro de nav/aside/.sidebar/etc.:
                // linkify() lo excluiría igualmente, así que ni merece la pena
                // programar el reescaneo.
                if (records.some(r => eligible(r.target))) scheduleRelink();
            });
        } catch (err) {
            console.error('WtTooltips: fallo inicializando', err);
        }
    }

    async function bootstrap() {
        if (!setupPromise) setupPromise = setup();
        await setupPromise;
        if (index) relink(); // primer escaneo (o reescaneo manual bajo demanda) + arma/rearma el observer
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

    // window.WtTooltips.init() ya NO hace falta llamarlo tras cargar contenido
    // nuevo: el MutationObserver lo detecta solo. Se deja expuesto como forzado
    // manual opcional (p.ej. saltarse el debounce de 400ms), y es seguro
    // llamarlo las veces que sea: fetch/popup/listeners solo se crean una vez.
    if (typeof window !== 'undefined') {
        window.WtTooltips = { init: bootstrap };
    }
})();
