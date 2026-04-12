(function () {
    'use strict';

    const BASE     = 'https://www.wikitolica.com';
    const FEED_URL = 'https://cdn.jsdelivr.net/gh/CursoCatolico/esferacatolica@main/lastposts.json';
    const ESFERA   = BASE + '/e/esfera-catolica/';
    const WIDGET   = BASE + '/w/widget-esfera/';

    /* hostname del documento actual, sin www */
    const CURHOST = typeof location !== 'undefined'
        ? location.hostname.replace(/^www\./, '')
        : '';

    const SELF = CURHOST === 'wikitolica.com';
    const TA   = SELF ? '' : ' target="_blank" rel="noopener"';
    const a    = (href, txt) => `<a href="${href}"${TA} class="wt-es-a">${txt}</a>`;
    const esc  = s => String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');

    function fmtDate(r) {
        if (!r) return '';
        const p = n => String(n).padStart(2,'0');
        const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(r);
        if (m) return `${p(m[1])}/${p(m[2])}/${m[3].slice(2)}`;
        const d = new Date(r);
        if (isNaN(d)) return '';
        return `${p(d.getDate())}/${p(d.getMonth()+1)}/${String(d.getFullYear()).slice(2)}`;
    }

    /* extrae hostname sin www de una URL de forma segura */
    function blogHost(url) {
        try { return new URL(url).hostname.replace(/^www\./, ''); }
        catch { return ''; }
    }

    /* ── CSS — misma paleta que wt-calendario ──────────────────── */
    const CSS = `
.wikitolica-esferacatolica{display:block;margin:0;padding:0;box-sizing:border-box}
.wt-es-wt{
  all:initial;display:block;box-sizing:border-box;container-type:inline-size;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size:17px;line-height:1.5;-webkit-text-size-adjust:100%;text-size-adjust:100%;
  color:var(--wt-tx);background:var(--wt-bg);border:1px solid var(--wt-bd);border-radius:4px;overflow:hidden;width:100%;
  --wt-bg:#fafafa;--wt-bg-s:#f8f9fa;--wt-bd:#ddd;--wt-tx:#333;--wt-mu:#666;--wt-sub:#999;--wt-lk:#0d6efd;--wt-lkh:#0a58ca
}
@media (prefers-color-scheme:dark){.wt-es-wt{
  --wt-bg:#1a1a1a;--wt-bg-s:#1a1a1a;--wt-bd:#444;--wt-tx:#c0c0c0;--wt-mu:#888;--wt-sub:#666;--wt-lk:#4dabf7;--wt-lkh:#74c0fc
}.wt-es-wt .wt-es-bh{background:transparent}}
/* reset total — aislamiento del host */
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
.wt-es-wt .wt-es-a{color:var(--wt-lk);cursor:pointer}
.wt-es-wt .wt-es-a:hover{text-decoration:underline;color:var(--wt-lkh)}
/* widget header */
.wt-es-wt .wt-es-head{
  background:var(--wt-bg-s);border-bottom:1px solid var(--wt-bd);
  padding:.38em .75em;display:flex;gap:.55em;align-items:center;min-width:0
}
.wt-es-wt .wt-es-head-icon{font-size:1.1em;line-height:1;flex-shrink:0}
.wt-es-wt .wt-es-head-body{flex:1;min-width:0;overflow:hidden}
.wt-es-wt .wt-es-head-sup{font-size:.6em;color:var(--wt-mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
.wt-es-wt .wt-es-head-name{font-size:.9em;font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
/* blog blocks — sin margen externo: el espaciado viene del propio encabezado */
.wt-es-wt .wt-es-blog{display:block}
/* blog header */
.wt-es-wt .wt-es-bh{
  background:var(--wt-bg);padding:.18em .75em 0;
  display:flex;align-items:center;gap:.35em;min-width:0
}
/* separación entre blogs: padding-top sobre el fondo del propio header → uniforme en dark */
.wt-es-wt .wt-es-blog + .wt-es-blog .wt-es-bh{border-top:1px solid var(--wt-bd)}
.wt-es-wt .wt-es-bh-name{
  font-size:.75em;font-weight:700;color:var(--wt-tx);
  flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block
}
.wt-es-wt .wt-es-bh-name .wt-es-a{color:inherit}
.wt-es-wt .wt-es-bh-name .wt-es-a:hover{color:var(--wt-lk)}
/* toggle "ver más / ver menos" — span evita estilos button del host */
.wt-es-wt .wt-es-toggle{
  cursor:pointer;font-size:.62em;color:var(--wt-lk);flex-shrink:0;
  line-height:1;text-decoration:underline;text-underline-offset:2px;
  white-space:nowrap;display:inline-block;user-select:none
}
.wt-es-wt .wt-es-toggle:hover{color:var(--wt-lkh)}
/* post rows — pegados a la cabecera */
.wt-es-wt .wt-es-post{
  display:block;padding:0 .75em;transition:background .1s;overflow:hidden
}
.wt-es-wt .wt-es-extra .wt-es-post:last-child,
.wt-es-wt .wt-es-blog > .wt-es-post{padding-bottom:.1em}
.wt-es-wt .wt-es-post:hover{background:var(--wt-bg-s)}
.wt-es-wt .wt-es-pt{
  font-size:.73em;font-weight:600;line-height:1.3;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block
}
.wt-es-wt .wt-es-pt .wt-es-a{color:var(--wt-lk)}
.wt-es-wt .wt-es-pt .wt-es-a:hover{color:var(--wt-lkh)}
.wt-es-wt .wt-es-pd{font-size:.64em;color:var(--wt-sub);display:block}
/* extra colapsado */
.wt-es-wt .wt-es-extra{display:none}
.wt-es-wt .wt-es-extra.open{display:block}
/* wide (≥300px): título + fecha en la misma línea */
@container (min-width:300px){
  .wt-es-wt .wt-es-post{display:flex;align-items:baseline;gap:.4em}
  .wt-es-wt .wt-es-pt{flex:1;min-width:0}
  .wt-es-wt .wt-es-pd{flex-shrink:0}
}
/* narrow (<280px): 2 líneas máx, sin fechas */
@container (max-width:279px){
  .wt-es-wt .wt-es-pt{
    white-space:normal;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden
  }
  .wt-es-wt .wt-es-pd{display:none}
  .wt-es-wt .wt-es-head,.wt-es-wt .wt-es-bh,.wt-es-wt .wt-es-post,
  .wt-es-wt .wt-es-more,.wt-es-wt .wt-es-foot{padding-left:.5em;padding-right:.5em}
}
/* ver más fuentes */
.wt-es-wt .wt-es-more{
  border-top:1px solid var(--wt-bd);padding:.22em .75em;
  text-align:center;font-size:.65em;background:var(--wt-bg);display:block
}
.wt-es-wt .wt-es-more-btn{
  cursor:pointer;color:var(--wt-lk);font-weight:600;
  text-decoration:underline;text-underline-offset:2px;display:inline-block;user-select:none
}
.wt-es-wt .wt-es-more-btn:hover{color:var(--wt-lkh)}
/* msg / footer */
.wt-es-wt .wt-es-msg{padding:.75em;font-size:.75em;color:var(--wt-mu);text-align:center;display:block}
.wt-es-wt .wt-es-foot{
  padding:.3em .75em;border-top:1px solid var(--wt-bd);
  text-align:center;font-size:.65em;color:var(--wt-mu);
  background:var(--wt-bg-s);white-space:nowrap;overflow:hidden;display:block
}
.wt-es-wt .wt-es-foot .wt-es-a{color:var(--wt-lk)}
.wt-es-wt .wt-es-foot .wt-es-a:hover{color:var(--wt-lkh);text-decoration:underline}
`;

    /* ── render ──────────────────────────────────────────────── */
    function buildPost(p) {
        const date = fmtDate(p.date);
        return `<div class="wt-es-post">` +
            `<div class="wt-es-pt">${a(p.url, esc(p.title))}</div>` +
            (date ? `<div class="wt-es-pd">${date}</div>` : '') +
        `</div>`;
    }

    let _uid = 0;
    function buildBlog(blog) {
        const posts = (blog.lastPosts || []).filter(p => p.title && p.url);
        if (!posts.length) return '';
        const [first, ...rest] = posts;
        const id = 'wt-ex-' + (++_uid);
        return `<div class="wt-es-blog">` +
            `<div class="wt-es-bh">` +
                `<div class="wt-es-bh-name">${a(blog.url || ESFERA, esc(blog.name || ''))}</div>` +
                (rest.length ? `<span role="button" tabindex="0" class="wt-es-toggle" aria-expanded="false" aria-controls="${id}">ver más</span>` : '') +
            `</div>` +
            buildPost(first) +
            (rest.length ? `<div class="wt-es-extra" id="${id}">${rest.map(buildPost).join('')}</div>` : '') +
        `</div>`;
    }

    /* ── init ────────────────────────────────────────────────── */
    function init(host) {
        if (host.dataset.loaded) return;
        host.dataset.loaded = '1';

        const raw = parseInt(host.dataset.maxlasts, 10);
        const def = isNaN(raw) || raw < 1 ? 10 : raw;

        if (!document.getElementById('wt-es-style')) {
            const s = document.createElement('style');
            s.id = 'wt-es-style';
            s.textContent = CSS;
            document.head.appendChild(s);
        }

        host.innerHTML =
            `<div class="wt-es-wt">` +
                `<div class="wt-es-head">` +
                    `<div class="wt-es-head-icon">🌐</div>` +
                    `<div class="wt-es-head-body">` +
                        `<div class="wt-es-head-sup">Últimas publicaciones</div>` +
                        `<div class="wt-es-head-name">${a(ESFERA, 'Esfera Católica')}</div>` +
                    `</div>` +
                `</div>` +
                `<div class="wt-es-msg">Cargando…</div>` +
                `<div class="wt-es-foot">${a(BASE,'Wikitólica')} · ${a(ESFERA,'Esfera Católica')} · ${a(WIDGET,'Ponlo en tu web')}</div>` +
            `</div>`;

        const wt   = host.firstElementChild;
        const msg  = wt.querySelector('.wt-es-msg');
        const foot = wt.querySelector('.wt-es-foot');

        /* delegación de clicks en el nivel del widget — cubre toggles futuros */
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
        wt.addEventListener('click', onToggle);
        wt.addEventListener('keydown', onToggle);

        fetch(FEED_URL, { cache: 'default' })
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
            .then(data => {
                /* filtrar blogs sin posts válidos */
                const all = (data.blogs || []).filter(b =>
                    (b.lastPosts || []).some(p => p.title && p.url)
                );
                if (!all.length) { msg.textContent = 'No hay publicaciones disponibles.'; return; }

                /* si algún blog coincide con el dominio actual, ponerlo primero */
                const sorted = all.slice();
                if (CURHOST) {
                    const idx = sorted.findIndex(b => blogHost(b.url) === CURHOST);
                    if (idx > 0) sorted.unshift(sorted.splice(idx, 1)[0]);
                }

                const visible = sorted.slice(0, def);
                const hidden  = sorted.slice(def);

                const wrap = document.createElement('div');
                wrap.innerHTML = visible.map(buildBlog).join('');

                if (hidden.length) {
                    const bar = document.createElement('div');
                    bar.className = 'wt-es-more';
                    const btn = document.createElement('span');
                    btn.setAttribute('role', 'button');
                    btn.setAttribute('tabindex', '0');
                    btn.className = 'wt-es-more-btn';
                    btn.textContent = `Ver ${hidden.length} fuente${hidden.length > 1 ? 's' : ''} más`;
                    const doMore = () => {
                        wrap.insertAdjacentHTML('beforeend', hidden.map(buildBlog).join(''));
                        bar.remove();
                    };
                    btn.addEventListener('click', doMore, { once: true });
                    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doMore(); } }, { once: true });
                    bar.appendChild(btn);
                    foot.before(bar);
                }

                msg.replaceWith(wrap);
            })
            .catch(() => {
                msg.innerHTML = `No se pudieron cargar las publicaciones. ${a(ESFERA,'Ver Esfera Católica')}.`;
            });
    }

    /* ── bootstrap ───────────────────────────────────────────── */
    function bootstrap() {
        document.querySelectorAll('.wikitolica-esferacatolica').forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

    if (typeof window !== 'undefined') {
        window.WtEsfera = window.WtEsfera || {};
        window.WtEsfera.init   = bootstrap;
        window.WtEsfera.initEl = init;
    }

})();
  --wt-bg:#1a1a1a;--wt-bg-s:#2d2d2d;--wt-bd:#444;--wt-tx:#c0c0c0;--wt-mu:#888;--wt-sub:#666;--wt-lk:#4dabf7;--wt-lkh:#74c0fc;
  font-weight:300;letter-spacing:.01ch
}}
/* reset total para evitar contaminación del host */
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
.wt-es-wt .wt-es-a{color:var(--wt-lk);cursor:pointer}
.wt-es-wt .wt-es-a:hover{text-decoration:underline;color:var(--wt-lkh)}
/* widget header */
.wt-es-wt .wt-es-head{
  background:var(--wt-bg-s);border-bottom:1px solid var(--wt-bd);
  padding:.55em .85em;display:flex;gap:.6em;align-items:center;min-width:0
}
.wt-es-wt .wt-es-head-icon{font-size:1.2em;line-height:1;flex-shrink:0}
.wt-es-wt .wt-es-head-body{flex:1;min-width:0;overflow:hidden}
.wt-es-wt .wt-es-head-sup{font-size:.63em;color:var(--wt-mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
.wt-es-wt .wt-es-head-name{font-size:.93em;font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
/* blog block — separado sólo por el fondo de la cabecera, sin bordes */
.wt-es-wt .wt-es-blog{display:block;margin-top:.3em}
.wt-es-wt .wt-es-blog:first-child{margin-top:0}
/* blog header */
.wt-es-wt .wt-es-bh{
  background:var(--wt-bg-s);padding:.25em .85em .2em;
  display:flex;align-items:center;gap:.4em;min-width:0
}
.wt-es-wt .wt-es-bh-name{
  font-size:.74em;font-weight:700;color:var(--wt-tx);
  flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block
}
.wt-es-wt .wt-es-bh-name .wt-es-a{color:inherit}
.wt-es-wt .wt-es-bh-name .wt-es-a:hover{color:var(--wt-lk)}
/* toggle */
.wt-es-wt .wt-es-toggle{
  cursor:pointer;font-size:.6em;color:var(--wt-lk);flex-shrink:0;
  line-height:1;text-decoration:underline;text-underline-offset:2px;white-space:nowrap;
  display:inline-block
}
.wt-es-wt .wt-es-toggle:hover{color:var(--wt-lkh)}
/* post rows — menor que cabecera, pegados arriba */
.wt-es-wt .wt-es-post{
  display:block;padding:.1em .85em .15em;transition:background .1s;overflow:hidden
}
.wt-es-wt .wt-es-post:last-child{padding-bottom:.25em}
.wt-es-wt .wt-es-post:hover{background:var(--wt-bg-s)}
.wt-es-wt .wt-es-pt{
  font-size:.71em;font-weight:600;line-height:1.3;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block
}
.wt-es-wt .wt-es-pt .wt-es-a{color:var(--wt-lk)}
.wt-es-wt .wt-es-pt .wt-es-a:hover{color:var(--wt-lkh)}
.wt-es-wt .wt-es-pd{font-size:.62em;color:var(--wt-sub);display:block}
/* collapsed extra posts */
.wt-es-wt .wt-es-extra{display:none}
.wt-es-wt .wt-es-extra.open{display:block}
/* wide (≥300px): título + fecha en misma línea */
@container (min-width:300px){
  .wt-es-wt .wt-es-post{display:flex;align-items:baseline;gap:.45em}
  .wt-es-wt .wt-es-pt{flex:1;min-width:0}
  .wt-es-wt .wt-es-pd{flex-shrink:0}
}
/* narrow (<280px): 2 líneas máx, sin fechas */
@container (max-width:279px){
  .wt-es-wt .wt-es-pt{
    white-space:normal;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden
  }
  .wt-es-wt .wt-es-pd{display:none}
  .wt-es-wt .wt-es-head,.wt-es-wt .wt-es-bh,.wt-es-wt .wt-es-post,
  .wt-es-wt .wt-es-more,.wt-es-wt .wt-es-foot{padding-left:.55em;padding-right:.55em}
}
/* ver más fuentes */
.wt-es-wt .wt-es-more{
  border-top:1px solid var(--wt-bd);padding:.32em .85em;
  text-align:center;font-size:.68em;background:var(--wt-bg);display:block
}
.wt-es-wt .wt-es-more-btn{
  cursor:pointer;color:var(--wt-lk);font-weight:600;
  text-decoration:underline;text-underline-offset:2px;display:inline
}
.wt-es-wt .wt-es-more-btn:hover{color:var(--wt-lkh)}
/* msg / footer */
.wt-es-wt .wt-es-msg{padding:.85em .85em;font-size:.78em;color:var(--wt-mu);text-align:center;display:block}
.wt-es-wt .wt-es-foot{
  padding:.45em .85em;border-top:1px solid var(--wt-bd);
  text-align:center;font-size:.67em;color:var(--wt-mu);
  background:var(--wt-bg-s);white-space:nowrap;overflow:hidden;display:block
}
.wt-es-wt .wt-es-foot .wt-es-a{color:var(--wt-lk)}
.wt-es-wt .wt-es-foot .wt-es-a:hover{color:var(--wt-lkh);text-decoration:underline}
`;

    /* ── render ──────────────────────────────────────────────── */
    function buildPost(p) {
        const date = fmtDate(p.date);
        return (
            `<div class="wt-es-post">` +
                `<div class="wt-es-pt">${a(p.url, esc(p.title))}</div>` +
                (date ? `<div class="wt-es-pd">${date}</div>` : '') +
            `</div>`
        );
    }

    let _uid = 0;
    function buildBlog(blog) {
        const posts = (blog.lastPosts || []).filter(p => p.title && p.url);
        if (!posts.length) return '';

        const [first, ...rest] = posts;
        const extraId = 'wt-ex-' + (++_uid);

        const toggleBtn = rest.length
            ? `<button class="wt-es-toggle" aria-expanded="false" aria-controls="${extraId}">ver más</button>`
            : '';

        const extraDiv = rest.length
            ? `<div class="wt-es-extra" id="${extraId}">${rest.map(buildPost).join('')}</div>`
            : '';

        return (
            `<div class="wt-es-blog">` +
                `<div class="wt-es-bh">` +
                    `<div class="wt-es-bh-name">${a(blog.url || ESFERA, esc(blog.name || ''))}</div>` +
                    toggleBtn +
                `</div>` +
                buildPost(first) +
                extraDiv +
            `</div>`
        );
    }

    /* ── init ────────────────────────────────────────────────── */
    function init(host) {
        if (host.dataset.loaded) return;
        host.dataset.loaded = '1';

        const raw = parseInt(host.dataset.maxlasts, 10);
        const def = isNaN(raw) || raw < 1 ? 10 : raw;

        if (!document.getElementById('wt-es-style')) {
            const s = document.createElement('style');
            s.id = 'wt-es-style';
            s.textContent = CSS;
            document.head.appendChild(s);
        }

        host.innerHTML =
            `<div class="wt-es-wt">` +
                `<div class="wt-es-head">` +
                    `<div class="wt-es-head-icon">🌐</div>` +
                    `<div class="wt-es-head-body">` +
                        `<div class="wt-es-head-sup">Últimas publicaciones</div>` +
                        `<div class="wt-es-head-name">${a(ESFERA, 'Esfera Católica')}</div>` +
                    `</div>` +
                `</div>` +
                `<div class="wt-es-msg">Cargando…</div>` +
                `<div class="wt-es-foot">${a(BASE, 'Wikitólica')} · ${a(ESFERA, 'Quiero aparecer aquí')}</div>` +
            `</div>`;

        const wt   = host.firstElementChild;
        const msg  = wt.querySelector('.wt-es-msg');
        const foot = wt.querySelector('.wt-es-foot');

        fetch(FEED_URL, { cache: 'default' })
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
            .then(data => {
                const all = (data.blogs || []).filter(b =>
                    (b.lastPosts || []).some(p => p.title && p.url)
                );
                if (!all.length) { msg.textContent = 'No hay publicaciones disponibles.'; return; }

                const visible = all.slice(0, def);
                const hidden  = all.slice(def);

                const wrap = document.createElement('div');
                wrap.innerHTML = visible.map(buildBlog).join('');

                /* delegación única para todos los toggles, incluidos los que se añadan después */
                wt.addEventListener('click', function onToggle(e) {
                    const btn = e.target.closest('.wt-es-toggle');
                    if (!btn) return;
                    const expanded = btn.getAttribute('aria-expanded') === 'true';
                    const extra = wt.querySelector('#' + btn.getAttribute('aria-controls'));
                    if (!extra) return;
                    btn.setAttribute('aria-expanded', String(!expanded));
                    btn.textContent = expanded ? 'ver más' : 'ver menos';
                    extra.classList.toggle('open', !expanded);
                });

                if (hidden.length) {
                    const bar = document.createElement('div');
                    bar.className = 'wt-es-more';
                    const btn = document.createElement('button');
                    btn.className = 'wt-es-more-btn';
                    btn.textContent = `Ver ${hidden.length} fuente${hidden.length > 1 ? 's' : ''} más`;
                    btn.addEventListener('click', () => {
                        wrap.insertAdjacentHTML('beforeend', hidden.map(buildBlog).join(''));
                        bar.remove();
                    }, { once: true });
                    bar.appendChild(btn);
                    foot.before(bar);
                }

                msg.replaceWith(wrap);
            })
            .catch(() => {
                msg.innerHTML = `No se pudieron cargar las publicaciones. ${a(ESFERA, 'Ver Esfera Católica')}.`;
            });
    }

    /* ── bootstrap ───────────────────────────────────────────── */
    function bootstrap() {
        document.querySelectorAll('.wikitolica-esferacatolica').forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

    if (typeof window !== 'undefined') {
        window.WtEsfera = window.WtEsfera || {};
        window.WtEsfera.init   = bootstrap;
        window.WtEsfera.initEl = init;
    }

})();
