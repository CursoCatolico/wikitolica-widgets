(function () {
    'use strict';

    const BASE     = 'https://www.wikitolica.com';
    const FEED_BASE = 'https://cdn.jsdelivr.net/gh/CursoCatolico/esferacatolica@main/';
    const FEED_URL  = FEED_BASE + 'lastposts.json';
    const ALL_URL   = FEED_BASE + 'allposts.json';
    const ESFERA   = BASE + '/e/esfera-catolica/';

    /* Siempre 5 enlaces iniciales; el resto llega vía allposts.json al pulsar "Ver más webs" */
    const VISIBLE_N = 5;

    /* promesa cacheada: una sola descarga de allposts aunque haya varios widgets */
    let allP = null;

    const normHost = h => String(h || '').toLowerCase().replace(/^www\./, '');
    const CURHOST = typeof location !== 'undefined' ? normHost(location.hostname) : '';

    /* ── caché local (cache-first puro: hit válido = 0 fetch) ─────────── */
    const CACHE_VER = 'v1';
    const CACHE_TTL = 12 * 3600 * 1000; /* el agregador regenera 2×/día */
    const CACHE_KEY = 'wt-es:' + CACHE_VER + ':' + (CURHOST || 'global');

    function readCache() {
        try {
            if (typeof localStorage === 'undefined') return null;
            const rawS = localStorage.getItem(CACHE_KEY);
            if (!rawS) return null;
            let o = null;
            try {
                o = JSON.parse(rawS);
            } catch {
                try { localStorage.removeItem(CACHE_KEY); } catch {}
                return null;
            }
            if (!o || typeof o.t !== 'number' || !Array.isArray(o.blogs)) {
                try { localStorage.removeItem(CACHE_KEY); } catch {}
                return null;
            }
            const now = Date.now();
            if (o.t > now + 60000 || now - o.t > CACHE_TTL) {
                try { localStorage.removeItem(CACHE_KEY); } catch {}
                return null;
            }
            const ok = o.blogs.some(b => b && (b.lastPosts || []).some(p => p && p.title && p.url));
            if (!ok) {
                try { localStorage.removeItem(CACHE_KEY); } catch {}
                return null;
            }
            return o;
        } catch { return null; }
    }

    function writeCache(data) {
        try {
            if (typeof localStorage === 'undefined') return;
            const blogs = data && data.blogs;
            if (!Array.isArray(blogs)) return;
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                t: Date.now(),
                updated: (data && data.updated) || '',
                blogs: blogs.slice(0, 25)
            }));
        } catch {}
    }

    const loadFeed = url => {
        let opts = { cache: 'no-cache' };
        try {
            if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
                opts.signal = AbortSignal.timeout(10000);
            }
        } catch {}
        return fetch(url, opts)
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
    };

    const FEED_URL_HOST = CURHOST ? FEED_BASE + 'lastposts-' + CURHOST + '.json' : FEED_URL;

    /* lectura síncrona de caché: con hit válido no se hace ningún fetch */
    let cachedData = null;
    try { cachedData = readCache(); } catch { cachedData = null; }

    /* arranque especulativo en miss: el fetch viaja en paralelo al parseo HTML */
    const HAS_PROMISE = typeof Promise !== 'undefined';
    let feedP = null;
    try {
        if (cachedData && HAS_PROMISE) {
            feedP = Promise.resolve(cachedData);
        } else if (!HAS_PROMISE || typeof fetch === 'undefined') {
            feedP = null;
        } else {
            // Fichero del propio dominio, con fallback al global si no existe todavía
            const first = FEED_URL_HOST === FEED_URL
                ? loadFeed(FEED_URL)
                : loadFeed(FEED_URL_HOST).catch(() => loadFeed(FEED_URL));
            feedP = first.then(data => { try { writeCache(data); } catch {} return data; });
        }
    } catch (e) {
        try { feedP = HAS_PROMISE ? Promise.reject(e) : null; } catch { feedP = null; }
    }

    const a = (href, txt) => {
        let ta = '';
        try {
            if (normHost(new URL(href).hostname) !== CURHOST) {
                ta = ' target="_blank" rel="nofollow noopener external"';
            }
        } catch {}
        return `<a href="${esc(href)}"${ta} class="wt-es-a">${txt}</a>`;
    };
    const esc  = s => String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');

    function fmtDate(r) {
        if (!r) return '';
        const p = n => String(n).padStart(2, '0');
        const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(r);
        if (m) return `${p(m[1])}/${p(m[2])}/${m[3].slice(2)}`;
        const d = new Date(r);
        if (isNaN(d.getTime())) return '';
        return `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)}/${String(d.getUTCFullYear()).slice(2)}`;
    }

    function blogHost(url) {
        try { return normHost(new URL(url).hostname); }
        catch { return ''; }
    }

    /* ── CSS ────────────────────────────────────────────────── */
    const CSS = `
.wikitolica-esferacatolica{display:block;margin:0;padding:0;box-sizing:border-box}
.wt-es-wt{
  all:initial;display:block;box-sizing:border-box;container-type:inline-size;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size:17px;line-height:1.5;-webkit-text-size-adjust:100%;text-size-adjust:100%;
  color:var(--wt-tx);background:var(--wt-bg);border:1px solid var(--wt-bd);border-radius:4px;overflow:hidden;width:100%;
  --wt-bg:#fafafa;--wt-bg-s:#f3f4f6;--wt-bg-h:#eceef0;--wt-bd:#ddd;
  --wt-tx:#333;--wt-mu:#666;--wt-sub:#999;--wt-lk:#0d6efd;--wt-lkh:#0a58ca
}
@media (prefers-color-scheme:dark){.wt-es-wt{
  --wt-bg:#1a1a1a;--wt-bg-s:#1a1a1a;--wt-bg-h:#262626;--wt-bd:#444;
  --wt-tx:#c0c0c0;--wt-mu:#888;--wt-sub:#666;--wt-lk:#4dabf7;--wt-lkh:#74c0fc
}}
/* reset total */
.wt-es-wt *,.wt-es-wt *::before,.wt-es-wt *::after{
  box-sizing:border-box;margin:0;padding:0;
  font-family:inherit;font-size:inherit;font-weight:inherit;font-style:normal;
  line-height:inherit;letter-spacing:inherit;word-spacing:normal;
  text-transform:none;text-decoration:none;vertical-align:baseline;color:inherit;
  background:transparent;border:0;outline:0;
  list-style:none;float:none;position:static;
  max-width:none;min-width:0;width:auto;height:auto;
  opacity:1;visibility:visible;cursor:auto
}
/* links — solo subrayado en hover, sin cambio de color */
.wt-es-wt .wt-es-a{color:var(--wt-lk);cursor:pointer;text-decoration:none}
.wt-es-wt .wt-es-a:hover{text-decoration:underline}
/* widget header — mismo fondo que la lista */
.wt-es-wt .wt-es-head{
  background:var(--wt-bg);border-bottom:1px solid var(--wt-bd);
  padding:.38em .75em;display:flex;gap:.55em;align-items:center;min-width:0
}
.wt-es-wt .wt-es-head-icon{font-size:1.1em;line-height:1;flex-shrink:0}
.wt-es-wt .wt-es-head-body{flex:1;min-width:0;overflow:hidden}
.wt-es-wt .wt-es-head-sup{font-size:11px;color:var(--wt-mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
.wt-es-wt .wt-es-head-name{font-size:.9em;font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
/* título "Esfera Católica" en color de texto (negro/claro según tema) */
.wt-es-wt .wt-es-head-name .wt-es-a{color:var(--wt-tx);text-decoration:none}
.wt-es-wt .wt-es-head-name .wt-es-a:hover{text-decoration:underline}
/* blog blocks */
.wt-es-wt .wt-es-blog{display:block}
/* blog header */
.wt-es-wt .wt-es-bh{
  background:var(--wt-bg);padding:.23em .75em 0;
  display:flex;gap:0px;min-width:0;flex-direction:column;align-items:flex-start;
}
.wt-es-wt .wt-es-blog:last-child{padding-bottom:0.23em;}
/* favicon */
.wt-es-wt .wt-es-fav{
  width:14px;height:14px;object-fit:contain;border-radius:2px;display:inline;vertical-align:middle;padding:0;margin:0 5px 0 0;
}
.wt-es-wt .wt-es-bh-name{
  font-size:.75em;font-weight:600;color:var(--wt-tx);
  flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block
}
.wt-es-wt .wt-es-bh-name .wt-es-a:hover{text-decoration:underline}
/* toggle */
.wt-es-wt .wt-es-toggle{
  cursor:pointer;font-size:.62em;color:var(--wt-lk);flex-shrink:0;
  line-height:1;text-decoration:none;text-underline-offset:2px;
  white-space:nowrap;display:inline-block;user-select:none
}
.wt-es-wt .wt-es-toggle:hover{color:var(--wt-lkh);text-decoration:underline;}
/* post rows — sin hover de fondo ni color */
.wt-es-wt .wt-es-post{display:block;padding:0 .75em;overflow:hidden}
.wt-es-wt .wt-es-extra .wt-es-post:last-child,
.wt-es-wt .wt-es-blog > .wt-es-post{padding-bottom:.1em}
/* títulos de noticias — sin negrita */
.wt-es-wt .wt-es-pt{
  font-size:.73em;font-weight:normal;line-height:1.4;margin-left:7px;
  white-space:normal;display:block;display:-webkit-box;-webkit-line-clamp:2;
  -webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;
}
.wt-es-wt .wt-es-pt .wt-es-a:hover{text-decoration:underline;font-weight: normal;}
.wt-es-wt .wt-es-pd{font-size:.7em;color:var(--wt-sub);vertical-align: middle;}
/* blue links */
.wt-es-wt .wt-es-pt .wt-es-a{ color:#0d6efd }
.wt-es-wt .wt-es-extra .wt-es-post:nth-child(odd) .wt-es-pt .wt-es-a{ color:#0a9396 }
@media (prefers-color-scheme:dark){
  .wt-es-wt .wt-es-pt .wt-es-a{ color:#4dabf7 }
  .wt-es-wt .wt-es-extra .wt-es-post:nth-child(odd) .wt-es-pt .wt-es-a{ color:#38b2ac }
}
/* extra colapsado */
.wt-es-wt .wt-es-extra{display:none}
.wt-es-wt .wt-es-extra.open{display:block}
/* wide (≥300px): título + fecha en la misma línea */
@container (min-width:300px){
  .wt-es-wt .wt-es-post{display:flex;align-items:baseline;gap:.4em}
  .wt-es-wt .wt-es-pt{flex:1;min-width:0}
}
/* narrow (<321px): 2 líneas máx, sin fechas */
@container (max-width:321px){
  .wt-es-wt .wt-es-head,.wt-es-wt .wt-es-bh,.wt-es-wt .wt-es-post,
  .wt-es-wt .wt-es-more,.wt-es-wt .wt-es-foot{padding-left:.5em;padding-right:.5em}
}
/* ver más fuentes */
.wt-es-wt .wt-es-more{
  padding:.22em .75em;
  text-align:center;font-size:.65em;background:var(--wt-bg);display:block
}
.wt-es-wt .wt-es-more-btn{
  cursor:pointer;color:var(--wt-lk);font-weight:400;
  text-decoration:none;display:inline-block;user-select:none
}
.wt-es-wt .wt-es-more-btn:hover{color:var(--wt-lkh);text-decoration:underline}
/* msg / footer */
.wt-es-wt .wt-es-msg{padding:.75em;font-size:.75em;color:var(--wt-mu);text-align:center;display:block}
/* pie — mismo fondo que la lista */
.wt-es-wt .wt-es-foot{
  padding:.3em .75em;border-top:1px solid var(--wt-bd);margin-top:3px;
  text-align:center;font-size:.65em;color:var(--wt-mu);
  background:var(--wt-bg);white-space:nowrap;overflow:hidden;display:block
}
.wt-es-wt .wt-es-foot .wt-es-a{color:var(--wt-lk);font-weight: normal;}
.wt-es-wt .wt-es-foot .wt-es-a:hover{text-decoration:underline}
`;

    /* Inyección inmediata (en cuanto se evalúa el script): el primer
       pintado ya tiene estilos, sin esperar al DOM ni al fetch */
    function ensureStyle() {
        try {
            if (typeof document === 'undefined') return;
            if (document.getElementById('wt-es-style')) return;
            const s = document.createElement('style');
            s.id = 'wt-es-style';
            s.textContent = CSS;
            (document.head || document.documentElement).appendChild(s);
        } catch {}
    }

    /* Calienta la conexión para el fallback per-dominio→global y el
       allposts.json bajo demanda (no bloquea el pintado inicial) */
    function ensurePreconnect() {
        try {
            if (typeof document === 'undefined') return;
            if (document.getElementById('wt-es-pre')) return;
            const l = document.createElement('link');
            l.id = 'wt-es-pre';
            l.rel = 'preconnect';
            l.href = 'https://cdn.jsdelivr.net';
            try { l.crossOrigin = 'anonymous'; } catch {}
            (document.head || document.documentElement).appendChild(l);
        } catch {}
    }

    try { ensureStyle(); } catch {}
    try { ensurePreconnect(); } catch {}

    /* ── render ─────────────────────────────────────────────── */
    function buildPost(p) {
        const date = fmtDate(p.date);
        return `<div class="wt-es-post">` +
            `<div class="wt-es-pt">${esc(p.title)} <span class="wt-es-pd">(${date})</span></div>` +
        `</div>`;
    }

    function buildBlog(blog) {
        const posts = (blog.lastPosts || []).filter(p => p.title && p.url);
        if (!posts.length) return '';
        const fav = blog.favicon
            ? `<img src="${esc(blog.favicon)}" width="14" height="14" alt="" aria-hidden="true" class="wt-es-fav" onerror="this.style.display='none'">`
            : '';
        const bh = `<div class="wt-es-blog"><div class="wt-es-bh"><div class="wt-es-bh-name">${fav} ${a(blog.url || ESFERA, esc(blog.name || ''))}</div></div>`;
        return bh + buildPost(posts[0]) + `</div>`;
    }

    /* ── selección y pintado ────────────────────────────────── */
    function selectVisible(data) {
        const list = ((data && data.blogs) || []).filter(b =>
            b && (b.lastPosts || []).some(p => p && p.title && p.url)
        );
        if (!list.length) return null;
        /* blog del dominio actual → primero */
        const sorted = list.slice();
        if (CURHOST) {
            const idx = sorted.findIndex(b => blogHost(b.url) === CURHOST);
            if (idx > 0) sorted.unshift(sorted.splice(idx, 1)[0]);
        }
        return { visible: sorted.slice(0, VISIBLE_N) };
    }

    function showError(wt, msg) {
        const html = `No se pudieron cargar las publicaciones. ${a(ESFERA,'Ver Esfera Católica')}.`;
        try {
            if (msg && msg.isConnected) {
                msg.innerHTML = html;
            } else if (wt) {
                const err = document.createElement('div');
                err.className = 'wt-es-msg';
                err.innerHTML = html;
                wt.appendChild(err);
            }
        } catch {}
    }

    /* "Ver más webs": solo al clic descarga allposts.json (lazy total) */
    function setupMore(wt, wrap, visible) {
        try {
            const shownUrls = new Set((visible || []).map(b => b.url));
            const getAll = () => allP ||
                (allP = loadFeed(ALL_URL).catch(e => { allP = null; throw e; }));
            const bar = document.createElement('div');
            bar.className = 'wt-es-more';
            const btn = document.createElement('span');
            btn.setAttribute('role', 'button');
            btn.setAttribute('tabindex', '0');
            btn.className = 'wt-es-more-btn';
            btn.textContent = 'Ver más webs';
            let _busy = false;
            const doMore = () => {
                if (_busy) return;
                _busy = true;
                btn.textContent = 'Cargando…';
                getAll().then(allData => {
                    const fresh = ((allData && allData.blogs) || []).filter(b =>
                        b && (b.lastPosts || []).some(p => p && p.title && p.url) &&
                        !shownUrls.has(b.url));
                    for (const b of fresh) shownUrls.add(b.url);
                    if (fresh.length) {
                        try { wrap.insertAdjacentHTML('beforeend', fresh.map(buildBlog).join('')); } catch {}
                    }
                    bar.remove();
                }).catch(() => {
                    _busy = false;
                    btn.textContent = 'No se pudo cargar. Reintentar';
                });
            };
            btn.addEventListener('click', doMore);
            btn.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doMore(); }
            });
            bar.appendChild(btn);
            if (wrap.isConnected) wrap.after(bar);
            else wt.appendChild(bar);
        } catch {}
    }

    function paintBlogs(wt, msg, sel) {
        const wrap = document.createElement('div');
        wrap.innerHTML = sel.visible.map(buildBlog).join('');
        msg.replaceWith(wrap);
        setupMore(wt, wrap, sel.visible);
    }

    /* ── init ───────────────────────────────────────────────── */
    function init(host) {
        try {
            if (!host || !host.dataset) return;
            if (host.dataset.loaded) return;
            host.dataset.loaded = '1';
        } catch { return; }

        try { ensureStyle(); } catch {}

        let wt = null;
        let msg = null;
        try {
            host.innerHTML =
                `<div class="wt-es-wt">` +
                    `<div class="wt-es-head">` +
                        `<div class="wt-es-head-icon">🌐</div>` +
                        `<div class="wt-es-head-body">` +
                            `<div class="wt-es-head-name">${a(ESFERA, 'Esfera Católica')}</div>` +
                            `<div class="wt-es-head-sup">Últimas novedades católicas</div>` +
                        `</div>` +
                    `</div>` +
                    `<div class="wt-es-msg">Cargando…</div>` +
                `</div>`;
            wt = host.firstElementChild;
            if (!wt) return;
            msg = wt.querySelector('.wt-es-msg');
            if (!msg) return;
        } catch { return; }

        /* delegación: click + keydown sobre toggles (compat con HTML previo) */
        const onToggle = e => {
            const btn = e.target.closest('.wt-es-toggle');
            if (!btn) return;
            if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
            if (e.type === 'keydown') e.preventDefault();
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            const extra = wt.querySelector('#' + btn.getAttribute('aria-controls'));
            if (!extra) return;
            btn.setAttribute('aria-expanded', String(!expanded));
            btn.textContent = expanded ? 'ver más' : 'ver menos';
            extra.classList.toggle('open', !expanded);
        };
        try {
            wt.addEventListener('click', onToggle);
            wt.addEventListener('keydown', onToggle);
        } catch {}

        /* hit de caché: pintado síncrono, 0 fetch */
        if (cachedData) {
            let sel = null;
            try { sel = selectVisible(cachedData); } catch { sel = null; }
            if (!sel) {
                try { msg.textContent = 'No hay publicaciones disponibles.'; } catch {}
                return;
            }
            try { paintBlogs(wt, msg, sel); } catch { showError(wt, msg); }
            return;
        }

        /* miss: consume el fetch especulativo ya en vuelo desde el eval */
        if (!feedP || typeof feedP.then !== 'function') {
            showError(wt, msg);
            return;
        }
        feedP.then(
            data => {
                let sel = null;
                try { sel = selectVisible(data); } catch { sel = null; }
                if (!sel) {
                    try { msg.textContent = 'No hay publicaciones disponibles.'; } catch {}
                    return;
                }
                try { paintBlogs(wt, msg, sel); } catch { showError(wt, msg); }
            },
            () => { showError(wt, msg); }
        );
    }

    /* ── bootstrap: inicializa en cuanto existe el div, sin esperar a
       DOMContentLoaded (el fetch ya va en vuelo desde el eval) ── */
    function bootstrap() {
        try {
            if (typeof document === 'undefined' || !document.querySelectorAll) return;
            document.querySelectorAll('.wikitolica-esferacatolica, #wikitolica-esferacatolica').forEach(el => {
                try { init(el); } catch {}
            });
        } catch {}
    }

    try { bootstrap(); } catch {}

    if (typeof document !== 'undefined' && document.readyState === 'loading') {
        try {
            let obs = null;
            if (typeof MutationObserver !== 'undefined' && document.documentElement) {
                obs = new MutationObserver(muts => {
                    for (const m of (muts || [])) {
                        const added = (m && m.addedNodes) || [];
                        for (const n of added) {
                            try {
                                if (!n || n.nodeType !== 1) continue;
                                if (n.matches && n.matches('.wikitolica-esferacatolica, #wikitolica-esferacatolica')) {
                                    try { init(n); } catch {}
                                }
                                if (n.querySelectorAll) {
                                    n.querySelectorAll('.wikitolica-esferacatolica, #wikitolica-esferacatolica').forEach(el => {
                                        try { init(el); } catch {}
                                    });
                                }
                            } catch {}
                        }
                    }
                });
                try { obs.observe(document.documentElement, { childList: true, subtree: true }); } catch { obs = null; }
            }
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', () => {
                    try { bootstrap(); } catch {}
                    try { if (obs) obs.disconnect(); } catch {}
                });
            }
        } catch {}
    }

    if (typeof window !== 'undefined') {
        window.WtEsfera = window.WtEsfera || {};
        window.WtEsfera.init   = bootstrap;
        window.WtEsfera.initEl = init;
    }

})();
