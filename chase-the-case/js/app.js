/* =============================================================================
   app.js — engine do Chase the Case Game (vanilla JS, sem build)
   Recursos: trilhas, casos, quiz, XP/nível/streak, coleção, busca,
   onboarding, Prova Final, visualizações SVG esquemáticas e celebração.
   ============================================================================= */
(function () {
  'use strict';

  var TRACKS = window.CHASE_TRACKS || [];
  var CASES = window.CHASE_CASES || [];
  var byId = {};
  CASES.forEach(function (c) { byId[c.id] = c; });

  /* ---- estado persistido ------------------------------------------------- */
  var SKEY = 'chase_state_v2';
  var state = load();
  function load() {
    try { var s = JSON.parse(localStorage.getItem(SKEY)); if (s && s.done) return s; } catch (e) {}
    return { xp: 0, streak: 0, lastDay: null, done: {}, onboarded: false, examBest: 0 };
  }
  function save() { try { localStorage.setItem(SKEY, JSON.stringify(state)); } catch (e) {} }

  function level() { return Math.floor(state.xp / 100) + 1; }
  function levelProgress() { return state.xp % 100; }
  function totalCases() { return CASES.length; }
  function masteredCount() { return Object.keys(state.done).filter(function (k) { return state.done[k] && state.done[k].mastered; }).length; }
  function isMastered(id) { return !!(state.done[id] && state.done[id].mastered); }
  function casesOfTrack(tid) { return CASES.filter(function (c) { return c.track === tid; }); }
  function trackProgress(tid) {
    var cs = casesOfTrack(tid), m = 0;
    cs.forEach(function (c) { if (isMastered(c.id)) m++; });
    return { mastered: m, total: cs.length, pct: cs.length ? Math.round((m / cs.length) * 100) : 0 };
  }
  function nextUnmastered() { for (var i = 0; i < CASES.length; i++) if (!isMastered(CASES[i].id)) return CASES[i]; return null; }

  function bumpStreak() {
    var today = new Date().toISOString().slice(0, 10);
    if (state.lastDay === today) return;
    var y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    state.streak = (state.lastDay === y) ? state.streak + 1 : 1;
    state.lastDay = today;
  }

  /* ---- helpers ----------------------------------------------------------- */
  var app = document.getElementById('app-root');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]; }); }
  function trackById(id) { for (var i = 0; i < TRACKS.length; i++) if (TRACKS[i].id === id) return TRACKS[i]; return null; }
  function trendClass(t) { return t === '↑' ? 'up' : t === '↓' ? 'down' : 'flat'; }
  function reduceMotion() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }
  function toast(msg) {
    var t = document.getElementById('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('show'); }, 1900);
  }
  function hexA(hex, a) {
    hex = (hex || '#4283cc').replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (x) { return x + x; }).join('');
    var n = parseInt(hex, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  /* seeded PRNG (mulberry32) — placement estável das nuvens */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function seedOf(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

  /* ====================================================================== *
   *  VISUALIZAÇÕES ESQUEMÁTICAS (SVG gerado por código — não é a imagem
   *  oficial do paciente; reflete os flags/parâmetros documentados do caso)
   * ====================================================================== */
  function deriveViz(c) {
    var f = (c.flags || []).join(' ').toLowerCase();
    var params = c.parametros || [];
    function pTrend(re) { for (var i = 0; i < params.length; i++) if (re.test(params[i].nome.toLowerCase())) return params[i].tendencia; return null; }
    var abn = {};
    if (/blast/.test(f)) abn.blast = true;
    if (/atypical lympho|variant lympho|lymphocytosis/.test(f)) abn.lymph = true;
    if (/monocyt/.test(f)) abn.mono = true;
    if (/nrbc/.test(f)) abn.nrbc = true;
    if (/left shift|imm granulocyte|imm cell/.test(f)) abn.left = true;
    if (/basophil/.test(f)) abn.baso = true;
    if (/abnormal granulocyte/.test(f)) abn.granules = true;

    var plt = 'normal';
    if (/plt low/.test(f) || pTrend(/plaqueta/) === '↓') plt = 'low';
    else if (pTrend(/plaqueta/) === '↑') plt = 'high';

    var rbc = 'normal';
    var name = (c.patologia || '').toLowerCase();
    if (/falciforme/.test(name)) rbc = 'sickle';
    else if (/fragment/.test(f) || /esquiz/.test(name)) rbc = 'frag';
    else if (pTrend(/mcv/) === '↓') rbc = 'micro';
    else if (pTrend(/mcv/) === '↑') rbc = 'macro';
    else if (/anisocyt/.test(f) || pTrend(/rdw/) === '↑') rbc = 'wide';

    var wbcHigh = pTrend(/wbc/) === '↑' || pTrend(/blast|linfócit|monócit/) === '↑' || abn.blast || abn.lymph;
    return { abn: abn, plt: plt, rbc: rbc, wbcHigh: wbcHigh };
  }

  // nuvem de pontos gaussiana
  function cloud(cx, cy, n, spread, color, rand, op) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var a = rand() * 6.283, r = (rand() + rand()) / 2 * spread;
      var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.82;
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.5" fill="' + color + '" opacity="' + (op || 0.85) + '"/>';
    }
    return s;
  }

  function svgMatrix(c) {
    var viz = deriveViz(c);
    var W = 320, H = 210, padL = 34, padB = 26, x0 = padL, x1 = W - 12, y0 = 14, y1 = H - padB;
    function X(u) { return x0 + u * (x1 - x0); }
    function Y(v) { return y1 - v * (y1 - y0); } // v=0 base, 1 topo
    var rand = rng(seedOf(c.id));
    var brand = '#2f6fb8', violet = '#6b4ee6', teal = '#138a6e', amber = '#c2820a', mute = '#94a3b8', bad = '#d23b4a';
    var dens = viz.wbcHigh ? 1.6 : 1;
    var dots = '';
    // populações normais
    dots += cloud(X(0.16), Y(0.30), 26 * dens, 13, viz.abn.lymph ? mute : brand, rand);     // linfócitos
    dots += cloud(X(0.40), Y(0.52), 16, 12, viz.abn.mono ? mute : violet, rand);             // monócitos
    dots += cloud(X(0.68), Y(0.62), 24, 15, teal, rand);                                     // neutrófilos
    dots += cloud(X(0.86), Y(0.70), 8, 8, amber, rand);                                       // eosinófilos

    var marks = '';
    function highlight(u, v, label, color) {
      var px = X(u), py = Y(v);
      marks += '<circle cx="' + px + '" cy="' + py + '" r="20" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-dasharray="3 3" opacity="0.9"/>';
      marks += '<rect x="' + (px - 30) + '" y="' + (py - 38) + '" width="60" height="15" rx="7" fill="' + color + '"/>';
      marks += '<text x="' + px + '" y="' + (py - 27) + '" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">' + label + '</text>';
    }
    if (viz.abn.blast) { dots += cloud(X(0.32), Y(0.82), 30 * dens, 17, bad, rand, 0.9); highlight(0.32, 0.82, 'BLASTOS', bad); }
    if (viz.abn.lymph) { dots += cloud(X(0.30), Y(0.46), 28 * dens, 14, bad, rand, 0.9); highlight(0.30, 0.46, 'LINF. ATÍP.', bad); }
    if (viz.abn.mono) { dots += cloud(X(0.42), Y(0.55), 26 * dens, 15, bad, rand, 0.9); highlight(0.42, 0.55, 'MONÓCITOS', bad); }
    if (viz.abn.left) { dots += cloud(X(0.55), Y(0.58), 16, 10, amber, rand, 0.95); highlight(0.55, 0.58, 'IMATUROS', amber); }
    if (viz.abn.nrbc) { dots += cloud(X(0.07), Y(0.10), 10, 7, '#0e8a9b', rand, 0.95); highlight(0.09, 0.12, 'NRBC', '#0e8a9b'); }
    if (viz.abn.baso) { highlight(0.24, 0.40, 'BASÓFILOS', amber); }
    if (viz.abn.granules) { highlight(0.68, 0.62, 'GRÂNULOS', bad); }

    // eixos + grade
    var grid = '';
    for (var g = 1; g < 4; g++) { grid += '<line x1="' + X(g / 4) + '" y1="' + y0 + '" x2="' + X(g / 4) + '" y2="' + y1 + '" stroke="#e9eff6"/>'; grid += '<line x1="' + x0 + '" y1="' + Y(g / 4) + '" x2="' + x1 + '" y2="' + Y(g / 4) + '" stroke="#e9eff6"/>'; }

    return '<svg class="viz-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Matriz LMNE esquemática">' +
      '<rect x="' + x0 + '" y="' + y0 + '" width="' + (x1 - x0) + '" height="' + (y1 - y0) + '" fill="#fbfdff" stroke="#d9e2ee" rx="6"/>' +
      grid +
      '<line x1="' + x0 + '" y1="' + y1 + '" x2="' + x1 + '" y2="' + y1 + '" stroke="#94a3b8"/>' +
      '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + y1 + '" stroke="#94a3b8"/>' +
      dots + marks +
      '<text x="' + ((x0 + x1) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="9" fill="#8595ab">complexidade / estrutura →</text>' +
      '<text x="11" y="' + ((y0 + y1) / 2) + '" text-anchor="middle" font-size="9" fill="#8595ab" transform="rotate(-90 11 ' + ((y0 + y1) / 2) + ')">tamanho →</text>' +
      '</svg>';
  }

  function curvePath(fn, x0, x1, y0, y1, n) {
    var pts = [], i, u, v;
    for (i = 0; i <= n; i++) { u = i / n; v = fn(u); pts.push([x0 + u * (x1 - x0), y1 - v * (y1 - y0)]); }
    var d = 'M ' + pts[0][0].toFixed(1) + ' ' + y1;
    pts.forEach(function (p) { d += ' L ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1); });
    d += ' L ' + pts[pts.length - 1][0].toFixed(1) + ' ' + y1 + ' Z';
    return d;
  }
  function gauss(c, w) { return function (u) { return Math.exp(-Math.pow((u - c) / w, 2)); }; }
  function svgHisto(c) {
    var viz = deriveViz(c);
    var W = 320, H = 120, x0 = 30, x1 = W - 10, y0 = 12, y1 = H - 22;
    var shapes = {
      normal: gauss(0.5, 0.13), wide: gauss(0.5, 0.24), micro: gauss(0.33, 0.12),
      macro: gauss(0.7, 0.13),
      sickle: function (u) { return Math.max(gauss(0.42, 0.11)(u), 0.7 * gauss(0.66, 0.07)(u)); },
      frag: function (u) { return Math.max(gauss(0.55, 0.12)(u), 0.5 * gauss(0.2, 0.08)(u)); }
    };
    var fn = shapes[viz.rbc] || shapes.normal;
    var normRef = gauss(0.5, 0.13);
    var label = { normal: 'distribuição normal', wide: 'anisocitose (RDW alto)', micro: 'microcitose', macro: 'macrocitose', sickle: 'alvo + microcitose (cauda)', frag: 'fragmentos (cauda à esquerda)' }[viz.rbc];
    return '<svg class="viz-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Histograma de hemácias esquemático">' +
      '<defs><linearGradient id="hg' + esc(c.id) + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#4283cc" stop-opacity="0.55"/><stop offset="1" stop-color="#4283cc" stop-opacity="0.06"/></linearGradient></defs>' +
      '<line x1="' + x0 + '" y1="' + y1 + '" x2="' + x1 + '" y2="' + y1 + '" stroke="#94a3b8"/>' +
      '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + y1 + '" stroke="#cdd8e6"/>' +
      '<path d="' + curvePath(normRef, x0, x1, y0, y1, 60) + '" fill="none" stroke="#cdd8e6" stroke-width="1.2" stroke-dasharray="4 3"/>' +
      '<path d="' + curvePath(fn, x0, x1, y0, y1, 60) + '" fill="url(#hg' + esc(c.id) + ')" stroke="#2f6fb8" stroke-width="1.6"/>' +
      '<text x="' + ((x0 + x1) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="9" fill="#8595ab">volume (fL) — ' + esc(label) + '</text>' +
      '</svg>';
  }
  function pltBadge(c) {
    var v = deriveViz(c).plt;
    if (v === 'normal') return '';
    var cfg = v === 'low' ? ['Plaquetas ↓', 'var(--bad)'] : ['Plaquetas ↑', 'var(--brand-d)'];
    return '<span class="viz-tag" style="color:' + cfg[1] + '">📉 ' + cfg[0] + '</span>';
  }

  /* ---- router ------------------------------------------------------------ */
  var route = { name: 'home', param: null };
  var searchTerm = '';
  function go(name, param) { route = { name: name, param: param }; window.scrollTo(0, 0); render(); try { history.replaceState(null, '', '#' + name + (param ? '/' + param : '')); } catch (e) {} }

  /* ---- top bar / tabs ---------------------------------------------------- */
  function topbar() {
    return '<div class="topbar"><div class="brand"><div class="dot">🩸</div>' +
      '<div><b>Chase the Case</b><small>Jornada de Hematologia</small></div></div>' +
      '<div class="xp-chip"><span class="flame">🔥</span>' + state.streak + '<span class="lv">· Nv ' + level() + '</span></div></div>';
  }
  function tabbar() {
    var tabs = [{ id: 'home', ic: '🗺️', label: 'Jornada' }, { id: 'deck', ic: '🃏', label: 'Coleção' }, { id: 'about', ic: 'ℹ️', label: 'Sobre' }];
    var active = (['deck', 'about'].indexOf(route.name) >= 0) ? route.name : 'home';
    return '<div class="tabbar"><div class="inner">' + tabs.map(function (t) {
      return '<button class="tab ' + (active === t.id ? 'active' : '') + '" data-tab="' + t.id + '"><span class="ti">' + t.ic + '</span>' + t.label + '</button>';
    }).join('') + '</div></div>';
  }

  /* ---- ONBOARDING -------------------------------------------------------- */
  var obSlide = 0;
  var OB = [
    { ic: '🩸', t: 'Bem-vindo à caçada', p: 'Cada carta é um caso clínico real da série HORIBA "Chase the Case". Você vai decifrar o que o analisador viu e fechar o raciocínio.' },
    { ic: '🧭', t: 'Leia a máquina', p: 'Matriz LMNE, histogramas, flags e a lâmina no CellaVision — visualizações esquemáticas geradas a partir dos achados de cada caso.' },
    { ic: '🏆', t: 'Aprenda jogando', p: 'Resolva o desafio (≥70%) para dominar a carta, ganhe XP, mantenha a sequência e enfrente a Prova Final. Sem perceber, você domina hematologia.' }
  ];
  function viewOnboard() {
    var s = OB[obSlide];
    var dots = OB.map(function (_, i) { return '<i class="' + (i === obSlide ? 'on' : '') + '"></i>'; }).join('');
    return '<div class="ob"><div class="ob-card">' +
      '<div class="ob-ic">' + s.ic + '</div><h2>' + esc(s.t) + '</h2><p>' + esc(s.p) + '</p>' +
      '<div class="ob-dots">' + dots + '</div>' +
      '<button class="btn lg" id="ob-next">' + (obSlide < OB.length - 1 ? 'Continuar' : 'Começar a caçar 🔎') + '</button>' +
      (obSlide < OB.length - 1 ? '<button class="backlink" id="ob-skip" style="justify-content:center;width:100%;margin-top:6px">Pular</button>' : '') +
      '<div class="ob-disc">⚕️ Material de estudo baseado em casos públicos HORIBA. Não substitui laudo ou diretriz clínica.</div>' +
      '</div></div>';
  }

  /* ---- ring helper ------------------------------------------------------- */
  function ring(pct, size, label) {
    var r = (size - 10) / 2, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    return '<div class="ring" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg viewBox="0 0 ' + size + ' ' + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke="rgba(255,255,255,.25)" stroke-width="6" fill="none"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/></svg>' +
      '<div class="ring-c"><b>' + pct + '%</b><span>' + label + '</span></div></div>';
  }

  /* ---- HOME -------------------------------------------------------------- */
  function viewHome() {
    var lp = levelProgress();
    var pct = Math.round(masteredCount() / totalCases() * 100);
    var nxt = nextUnmastered();
    var s = '<div class="screen">';
    // hero com anel
    s += '<div class="hero"><div class="hero-row">' +
      '<div class="hero-txt"><div class="eyebrow">Estudo gamificado · casos reais HORIBA</div>' +
      '<h2>Resolva o caso.<br>Leia a lâmina.</h2>' +
      '<p>' + masteredCount() + ' de ' + totalCases() + ' casos dominados · Nível ' + level() + '</p></div>' +
      ring(pct, 88, 'dominado') + '</div>' +
      '<div class="xpbar" style="margin-top:16px"><i style="width:' + lp + '%"></i></div></div>';

    // continuar
    if (nxt) {
      var tk = trackById(nxt.track);
      s += '<button class="continue" data-case="' + nxt.id + '"><div class="ci" style="color:' + tk.cor + '">' + tk.emoji + '</div>' +
        '<div class="cc"><small>CONTINUAR DE ONDE PAROU</small><b>Case #' + esc(nxt.numero) + ' · ' + esc(nxt.patologia) + '</b></div><span class="cgo">▶</span></button>';
    } else {
      s += '<div class="continue done"><div class="ci">🏆</div><div class="cc"><small>PARABÉNS</small><b>Todos os casos dominados!</b></div></div>';
    }

    // prova final
    var unlocked = masteredCount() >= 3;
    s += '<button class="exam-cta ' + (unlocked ? '' : 'lock') + '" ' + (unlocked ? 'data-exam="1"' : '') + '>' +
      '<div class="ex-ic">🎓</div><div class="ex-tx"><b>Prova Final</b><span>' + (unlocked ? '10 perguntas embaralhadas de todos os casos' : 'Domine 3 casos para desbloquear') + '</span></div>' +
      '<span class="ex-go">' + (unlocked ? (state.examBest ? 'recorde ' + state.examBest + '%' : 'iniciar') : '🔒') + '</span></button>';

    // busca
    s += '<div class="search"><span>🔎</span><input id="search-in" type="search" placeholder="Buscar patologia, flag, parâmetro..." value="' + esc(searchTerm) + '" autocomplete="off"></div>';
    s += '<div id="search-results"></div>';

    // trilhas (escondidas quando buscando)
    s += '<div id="tracks-wrap"><div class="sec-head"><h3>Trilhas de conhecimento</h3><span>' + TRACKS.length + ' trilhas</span></div>';
    TRACKS.forEach(function (t) {
      var p = trackProgress(t.id);
      s += '<button class="track" data-track="' + t.id + '"><div class="ico" style="color:' + t.cor + ';background:' + hexA(t.cor, .1) + ';border-color:' + hexA(t.cor, .3) + '">' + t.emoji + '</div>' +
        '<div class="meta"><b>' + esc(t.nome) + '</b><p>' + esc(t.descricao) + '</p>' +
        '<div class="prog"><div class="xpbar"><i style="width:' + p.pct + '%;background:' + t.cor + '"></i></div><small>' + p.mastered + '/' + p.total + '</small></div></div><div class="chev">›</div></button>';
    });
    s += '<hr class="sep"><div class="note-card">⚕️ <b>Material de estudo.</b> Índice de casos real (HORIBA); conteúdo e visualizações são síntese didática. Veja <b>Sobre</b>.</div></div>';
    s += '</div>';
    return s;
  }

  function renderSearch() {
    var box = document.getElementById('search-results');
    var wrap = document.getElementById('tracks-wrap');
    if (!box) return;
    var q = searchTerm.trim().toLowerCase();
    if (!q) { box.innerHTML = ''; if (wrap) wrap.style.display = ''; return; }
    if (wrap) wrap.style.display = 'none';
    var res = CASES.filter(function (c) {
      return (c.patologia + ' ' + c.contexto + ' ' + (c.flags || []).join(' ') + ' ' + (c.parametros || []).map(function (p) { return p.nome; }).join(' ')).toLowerCase().indexOf(q) >= 0;
    });
    if (!res.length) { box.innerHTML = '<div class="empty">Nenhum caso encontrado para "' + esc(searchTerm) + '".</div>'; return; }
    box.innerHTML = '<div class="sec-head"><h3>Resultados</h3><span>' + res.length + '</span></div>' + res.map(function (c) {
      var t = trackById(c.track);
      return '<button class="case-card" data-case="' + c.id + '"><div class="ribbon" style="background:' + t.cor + '"></div>' +
        '<div class="row1"><span class="num">CASE #' + esc(c.numero) + '</span>' + (isMastered(c.id) ? '<span class="status-dot done">✓</span>' : '') + '</div>' +
        '<h4>' + esc(c.patologia) + '</h4><div class="ctx">' + esc(c.contexto) + '</div></button>';
    }).join('');
    bindCaseButtons(box);
  }

  /* ---- TRACK ------------------------------------------------------------- */
  function viewTrack(tid) {
    var t = trackById(tid); if (!t) return viewHome();
    var cs = casesOfTrack(tid), p = trackProgress(tid);
    var s = '<div class="screen"><button class="backlink" data-go="home">‹ Jornada</button>';
    s += '<div class="cs-hero" style="background:linear-gradient(155deg,' + t.cor + ',' + shade(t.cor, -28) + ')">' +
      '<div class="num">' + t.emoji + ' TRILHA</div><h2>' + esc(t.nome) + '</h2><div class="ctx">' + esc(t.descricao) + '</div>' +
      '<div style="margin-top:14px;display:flex;align-items:center;gap:8px"><div class="xpbar" style="flex:1"><i style="width:' + p.pct + '%"></i></div>' +
      '<small style="font-size:11px;font-weight:700">' + p.mastered + '/' + p.total + ' dominados</small></div></div>';
    s += '<div class="sec-head"><h3>Casos</h3><span>' + cs.length + ' cartas</span></div>';
    cs.forEach(function (c) {
      var status = isMastered(c.id) ? '<span class="status-dot done">✓ Dominado</span>' : '<span class="status-dot new">Novo</span>';
      var diff = '<span class="diff">' + [1, 2, 3].map(function (n) { return '<i class="' + (n <= c.dificuldade ? 'on' : '') + '"></i>'; }).join('') + '</span>';
      s += '<button class="case-card" data-case="' + c.id + '"><div class="ribbon" style="background:' + t.cor + '"></div>' +
        '<div class="row1"><span class="num">CASE #' + esc(c.numero) + '</span>' + diff + status + '</div>' +
        '<h4>' + esc(c.patologia) + '</h4><div class="ctx">' + esc(c.contexto) + '</div>' +
        '<div class="tags">' + (c.equipamento || []).map(function (e) { return '<span class="tag-eq">🔌 ' + esc(e) + '</span>'; }).join('') + '</div></button>';
    });
    s += '</div>';
    return s;
  }

  /* ---- CASE STUDY -------------------------------------------------------- */
  function viewCase(cid) {
    var c = byId[cid]; if (!c) return viewHome();
    var t = trackById(c.track);
    var s = '<div class="screen"><button class="backlink" data-go="track" data-param="' + c.track + '">‹ ' + esc(t ? t.nome : 'Voltar') + '</button>';
    s += '<div class="cs-hero"><div class="num">CASE #' + esc(c.numero) + (isMastered(c.id) ? ' · ✓ DOMINADO' : '') + '</div>' +
      '<h2>' + esc(c.patologia) + '</h2><div class="ctx">' + esc(c.contexto) + '</div>' +
      '<div class="tags" style="margin-top:13px">' + (c.equipamento || []).map(function (e) { return '<span class="tag-eq">🔌 ' + esc(e) + '</span>'; }).join('') + '</div></div>';

    if (c.pistas && c.pistas.length) {
      s += block('🔎', 'O que o analisador apontou',
        c.pistas.map(function (p) { return '<div class="pista"><span>➤</span><span>' + esc(p) + '</span></div>'; }).join(''));
    }

    // matriz LMNE esquemática
    s += block('🧭', 'Matriz LMNE <span class="bt-note">esquema didático</span>',
      '<div class="viz-frame">' + svgMatrix(c) + '</div>' +
      '<p class="viz-cap">Representação gerada a partir dos flags do caso — não é a matriz real do paciente. ' + pltBadge(c) + '</p>' +
      (c.assets && c.assets.matriz ? '<div class="asset-slot has-img" style="margin-top:10px"><img src="' + esc(c.assets.matriz) + '" alt="matriz oficial"></div>' : ''));

    // histograma esquemático
    s += block('📈', 'Histograma de hemácias <span class="bt-note">esquema didático</span>',
      '<div class="viz-frame">' + svgHisto(c) + '</div>' +
      '<p class="viz-cap">Curva esquemática (linha tracejada = referência normal). ' + esc(c.histograma) + '</p>');

    if (c.parametros && c.parametros.length) {
      s += block('📊', 'Parâmetros-chave <span class="bt-note">padrão típico</span>',
        '<div class="params">' + c.parametros.map(function (p) {
          return '<div class="param"><span class="nm">' + esc(p.nome) + '</span><span class="tr ' + trendClass(p.tendencia) + '">' + esc(p.tendencia) + '</span><span class="note">' + esc(p.nota) + '</span></div>';
        }).join('') + '</div>');
    }
    if (c.flags && c.flags.length) s += block('🚩', 'Flags / Alarmes', '<div class="chips">' + c.flags.map(function (f) { return '<span class="flag-chip">⚑ ' + esc(f) + '</span>'; }).join('') + '</div>');
    if (c.cellavision && c.cellavision.length) s += block('🔬', 'Lâmina no CellaVision',
      (c.assets && c.assets.lamina ? '<div class="asset-slot has-img"><img src="' + esc(c.assets.lamina) + '" alt="lâmina oficial"></div>' : '<div class="asset-slot"><span class="ph-ic">🔬</span>Foto de lâmina oficial — inserir via assets</div>') +
      '<div style="margin-top:12px">' + c.cellavision.map(function (m) { return '<div class="morph-li">' + esc(m) + '</div>'; }).join('') + '</div>');

    s += '<div class="block learn-box"><div class="bt"><span class="bi">💡</span>O insight do caso</div><div class="learn">' + esc(c.aprendizado) + '</div></div>';
    var nq = (c.quiz || []).length;
    s += '<button class="btn lg" data-quiz="' + c.id + '">⚡ ' + (isMastered(c.id) ? 'Refazer desafio' : 'Aceitar o desafio') + ' · ' + nq + ' perguntas</button>';
    if (c.fonte) s += '<div style="text-align:center;margin-top:14px"><a class="backlink" href="' + esc(c.fonte) + '" target="_blank" rel="noopener">Caso oficial HORIBA ↗</a></div>';
    s += '</div>';
    return s;
  }
  function block(ic, title, body) { return '<div class="block"><div class="bt"><span class="bi">' + ic + '</span>' + title + '</div>' + body + '</div>'; }

  /* ---- QUIZ (caso) ------------------------------------------------------- */
  var quizState = null;
  function startQuiz(cid) { var c = byId[cid]; quizState = { cid: cid, i: 0, correct: 0, answered: false, questions: c.quiz || [] }; go('quiz', cid); }
  function viewQuiz() {
    var c = byId[quizState.cid], qs = quizState.questions, q = qs[quizState.i];
    var pct = Math.round((quizState.i / qs.length) * 100);
    return '<div class="screen"><button class="backlink" data-case="' + c.id + '">‹ Sair do desafio</button>' +
      '<div class="quiz-top"><div class="xpbar"><i style="width:' + pct + '%"></i></div><small>' + (quizState.i + 1) + '/' + qs.length + '</small></div>' +
      '<div class="q-card"><div class="qn">CASE #' + esc(c.numero) + ' · ' + esc(c.patologia) + '</div><div class="qq">' + esc(q.p) + '</div>' +
      q.opcoes.map(function (o, idx) { return '<button class="opt" data-opt="' + idx + '"><span class="key">' + String.fromCharCode(65 + idx) + '</span>' + esc(o) + '</button>'; }).join('') +
      '<div id="explain-slot"></div></div></div>';
  }
  function answer(idx) {
    if (quizState.answered) return; quizState.answered = true;
    var q = quizState.questions[quizState.i], correct = q.correta;
    app.querySelectorAll('.opt').forEach(function (o, i) { o.setAttribute('disabled', ''); if (i === correct) o.classList.add('correct'); if (i === idx && idx !== correct) o.classList.add('wrong'); });
    var ok = idx === correct; if (ok) quizState.correct++; buzz(ok ? 12 : [6, 30, 6]);
    var slot = document.getElementById('explain-slot');
    slot.innerHTML = '<div class="explain ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? '✓ Acertou!' : '✗ Quase lá.') + '</b> ' + esc(q.explica) +
      '<button class="btn" style="margin-top:14px" id="next-q">' + (quizState.i + 1 < quizState.questions.length ? 'Próxima pergunta' : 'Ver resultado') + ' →</button></div>';
    slot.querySelector('#next-q').addEventListener('click', nextQuestion);
    slot.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'nearest' });
  }
  function nextQuestion() { if (quizState.i + 1 < quizState.questions.length) { quizState.i++; quizState.answered = false; render(); } else finishQuiz(); }
  function finishQuiz() {
    var total = quizState.questions.length, correct = quizState.correct, pct = total ? Math.round((correct / total) * 100) : 0;
    var mastered = pct >= 70, firstMastery = mastered && !isMastered(quizState.cid);
    var gained = correct * 10 + (mastered ? 20 : 0); state.xp += gained;
    var best = Math.max(pct, (state.done[quizState.cid] && state.done[quizState.cid].best) || 0);
    state.done[quizState.cid] = { best: best, mastered: isMastered(quizState.cid) || mastered };
    if (mastered) bumpStreak(); save();
    quizState.result = { pct: pct, correct: correct, total: total, gained: gained, mastered: mastered, firstMastery: firstMastery };
    if (mastered) celebrate(pct === 100); buzz(mastered ? [10, 40, 10, 40, 20] : 10);
    go('result', quizState.cid);
  }
  function viewResult() {
    var c = byId[quizState.cid], r = quizState.result;
    var emoji = r.pct === 100 ? '🏆' : r.mastered ? '🎉' : '📚';
    var title = r.pct === 100 ? 'Caso perfeito!' : r.mastered ? 'Caso dominado!' : 'Continue caçando';
    var sub = r.mastered ? 'Você decifrou ' + esc(c.patologia) + '.' : 'Acerte 70% para dominar a carta. Revise e tente de novo!';
    var s = '<div class="screen"><div class="result"><div class="badge">' + emoji + '</div><h2>' + title + '</h2><div class="sub">' + sub + '</div>' +
      '<div class="score">' + r.pct + '%</div><div class="sub">' + r.correct + ' de ' + r.total + ' corretas</div>' +
      '<div class="rewards"><div class="reward"><b>+' + r.gained + '</b><span>XP</span></div><div class="reward"><b>Nv ' + level() + '</b><span>NÍVEL</span></div><div class="reward"><b>🔥 ' + state.streak + '</b><span>SEQUÊNCIA</span></div></div>';
    if (r.firstMastery) s += '<div class="note-card" style="border-left-color:var(--good);background:rgba(24,137,95,.08)">🃏 Nova carta na sua <b>Coleção</b>!</div>';
    s += '<button class="btn lg" data-quiz="' + c.id + '">↻ Refazer</button>' +
      '<button class="btn ghost" style="margin-top:11px" data-next-case="' + c.id + '">Próximo caso →</button>' +
      '<button class="backlink" style="justify-content:center;width:100%;margin-top:10px" data-go="track" data-param="' + c.track + '">Voltar à trilha</button></div></div>';
    return s;
  }
  function nextCaseAfter(cid) {
    var c = byId[cid], cs = casesOfTrack(c.track), idx = cs.findIndex(function (x) { return x.id === cid; });
    if (idx >= 0 && idx + 1 < cs.length) return go('case', cs[idx + 1].id);
    var ti = TRACKS.findIndex(function (t) { return t.id === c.track; });
    if (ti >= 0 && ti + 1 < TRACKS.length) return go('track', TRACKS[ti + 1].id);
    go('home');
  }

  /* ---- PROVA FINAL (exam) ------------------------------------------------ */
  var examState = null;
  function startExam() {
    var pool = [];
    CASES.forEach(function (c) { (c.quiz || []).forEach(function (q) { pool.push({ q: q, c: c }); }); });
    // embaralha (Fisher-Yates)
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp; }
    examState = { items: pool.slice(0, Math.min(10, pool.length)), i: 0, correct: 0, answered: false };
    go('exam');
  }
  function viewExam() {
    var it = examState.items[examState.i], q = it.q;
    var pct = Math.round((examState.i / examState.items.length) * 100);
    return '<div class="screen"><button class="backlink" data-go="home">‹ Sair da prova</button>' +
      '<div class="quiz-top"><div class="xpbar"><i style="width:' + pct + '%;background:linear-gradient(90deg,#6b4ee6,#2f6fb8)"></i></div><small>' + (examState.i + 1) + '/' + examState.items.length + '</small></div>' +
      '<div class="q-card exam"><div class="qn" style="color:#6b4ee6">🎓 PROVA FINAL · Case #' + esc(it.c.numero) + '</div><div class="qq">' + esc(q.p) + '</div>' +
      q.opcoes.map(function (o, idx) { return '<button class="opt" data-eopt="' + idx + '"><span class="key">' + String.fromCharCode(65 + idx) + '</span>' + esc(o) + '</button>'; }).join('') +
      '<div id="explain-slot"></div></div></div>';
  }
  function examAnswer(idx) {
    if (examState.answered) return; examState.answered = true;
    var it = examState.items[examState.i], correct = it.q.correta;
    app.querySelectorAll('.opt').forEach(function (o, i) { o.setAttribute('disabled', ''); if (i === correct) o.classList.add('correct'); if (i === idx && idx !== correct) o.classList.add('wrong'); });
    var ok = idx === correct; if (ok) examState.correct++; buzz(ok ? 12 : [6, 30, 6]);
    var slot = document.getElementById('explain-slot');
    slot.innerHTML = '<div class="explain ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? '✓ Correto' : '✗ Incorreto') + ' · ' + esc(it.c.patologia) + '.</b> ' + esc(it.q.explica) +
      '<button class="btn" style="margin-top:14px" id="next-e">' + (examState.i + 1 < examState.items.length ? 'Próxima' : 'Ver nota final') + ' →</button></div>';
    slot.querySelector('#next-e').addEventListener('click', function () {
      if (examState.i + 1 < examState.items.length) { examState.i++; examState.answered = false; render(); } else finishExam();
    });
    slot.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'nearest' });
  }
  function finishExam() {
    var total = examState.items.length, correct = examState.correct, pct = Math.round(correct / total * 100);
    state.xp += correct * 8; if (pct > state.examBest) state.examBest = pct;
    if (pct >= 70) bumpStreak(); save();
    examState.result = { pct: pct, correct: correct, total: total };
    if (pct >= 70) celebrate(pct >= 90);
    go('examresult');
  }
  function viewExamResult() {
    var r = examState.result;
    var rank = r.pct >= 90 ? ['🥇', 'Hematologista de elite'] : r.pct >= 70 ? ['🥈', 'Analista aprovado'] : r.pct >= 50 ? ['🥉', 'Em formação'] : ['📚', 'Volte às trilhas'];
    var s = '<div class="screen"><div class="result"><div class="badge" style="background:radial-gradient(circle at 50% 35%,#efeaff,#fff)">' + rank[0] + '</div>' +
      '<div class="eyebrow" style="color:#6b4ee6">PROVA FINAL</div><h2>' + esc(rank[1]) + '</h2>' +
      '<div class="score" style="background:linear-gradient(90deg,#6b4ee6,#2f6fb8);-webkit-background-clip:text;background-clip:text">' + r.pct + '%</div>' +
      '<div class="sub">' + r.correct + ' de ' + r.total + ' · recorde ' + state.examBest + '%</div>' +
      '<div class="cert"><div class="cert-in"><small>CHASE THE CASE</small><b>' + esc(rank[1]) + '</b><span>Aproveitamento ' + r.pct + '% · Nível ' + level() + '</span></div></div>' +
      '<button class="btn lg" data-exam="1">↻ Refazer prova</button>' +
      '<button class="btn ghost" style="margin-top:11px" data-go="home">Voltar à jornada</button></div></div>';
    return s;
  }

  /* ---- DECK -------------------------------------------------------------- */
  function viewDeck() {
    var s = '<div class="screen"><div class="eyebrow">Sua coleção</div><h1 class="h1">Cartas dominadas</h1>' +
      '<p class="lead">Domine um caso (≥70% no desafio) para colecionar a carta.</p>' +
      '<div class="hero" style="margin:16px 0"><div class="hero-row"><div class="hero-txt"><h2 style="font-size:18px">' + masteredCount() + ' / ' + totalCases() + '</h2><p>cartas reunidas</p></div>' + ring(Math.round(masteredCount() / totalCases() * 100), 76, 'completo') + '</div></div>';
    s += '<div class="deck-grid">';
    CASES.forEach(function (c) {
      var t = trackById(c.track), done = isMastered(c.id);
      s += '<button class="mini ' + (done ? '' : 'locked') + '" data-case="' + c.id + '" style="border-color:' + (done ? hexA(t.cor, .5) : 'var(--line)') + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:start"><span class="num">#' + esc(c.numero) + '</span><span class="seal">' + (done ? '✓' : '🔒') + '</span></div>' +
        '<div class="emoji" style="margin-top:8px">' + (t ? t.emoji : '🩸') + '</div><h5>' + esc(c.patologia) + '</h5>' +
        '<small style="font-size:10px;color:var(--txt-mute);margin-top:5px">' + esc(t ? t.nome : '') + '</small></button>';
    });
    s += '</div></div>';
    return s;
  }

  /* ---- ABOUT ------------------------------------------------------------- */
  function viewAbout() {
    var seen = {}, sources = [];
    CASES.forEach(function (c) { if (c.fonte && !seen[c.fonte]) { seen[c.fonte] = 1; sources.push(c); } });
    var s = '<div class="screen"><div class="eyebrow">Sobre & Fontes</div><h1 class="h1">Como este estudo foi feito</h1>';
    s += '<div class="note-card">📖 <b>Índice de casos = real.</b> Número, patologia e equipamento (Yumizen H2500/H550/H500, CellaVision DC-1) vêm das publicações públicas da série <b>HORIBA · Chase the Case</b>.</div>';
    s += '<div class="note-card">✍️ <b>Conteúdo e visualizações = síntese didática.</b> Morfologia, flags, parâmetros, quizzes e os <b>esquemas SVG</b> (matriz/histograma) são gerados a partir de hematologia consolidada — não são as imagens nem os números do laudo oficial.</div>';
    s += '<div class="note-card">🖼️ <b>Imagens oficiais.</b> Cada caso tem um <b>slot</b> para inserir matriz, histograma e foto de lâmina oficiais (ver <code>CONTENT-SOURCES.md</code>).</div>';
    s += '<div class="note-card" style="border-left-color:var(--bad);background:rgba(210,59,74,.06)">⚕️ <b>Aviso.</b> Ferramenta de estudo. Não é orientação diagnóstica nem substitui diretrizes, laudos ou os documentos oficiais HORIBA.</div>';
    s += '<div class="sec-head"><h3>Casos oficiais (fontes)</h3><span>' + sources.length + '</span></div>';
    sources.forEach(function (c) { s += '<a class="src-li" href="' + esc(c.fonte) + '" target="_blank" rel="noopener"><b>Case #' + esc(c.numero) + '</b> · ' + esc(c.patologia) + '<small>' + esc(c.fonte) + '</small></a>'; });
    s += '<hr class="sep"><div style="text-align:center;color:var(--txt-mute);font-size:12px">Progresso salvo só no seu aparelho.<br><button class="backlink" id="reset-btn" style="color:var(--bad);justify-content:center;width:100%;margin-top:8px">Apagar meu progresso</button></div></div>';
    return s;
  }

  /* ---- celebrate (confetti) --------------------------------------------- */
  function celebrate(big) {
    if (reduceMotion()) return;
    var cv = document.createElement('canvas'); cv.className = 'confetti'; document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), W = cv.width = innerWidth, H = cv.height = innerHeight;
    var cols = ['#4283cc', '#6b4ee6', '#138a6e', '#c2820a', '#d23b4a', '#2f6fb8'];
    var N = big ? 140 : 80, P = [];
    for (var i = 0; i < N; i++) P.push({ x: W / 2 + (Math.random() - .5) * 120, y: H * 0.32, vx: (Math.random() - .5) * 9, vy: -6 - Math.random() * 8, g: .25 + Math.random() * .12, s: 4 + Math.random() * 5, c: cols[i % cols.length], r: Math.random() * 6, vr: (Math.random() - .5) * .4 });
    var t0 = performance.now();
    (function frame(t) {
      var el = t - t0; ctx.clearRect(0, 0, W, H);
      P.forEach(function (p) { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 1.6); ctx.restore(); });
      if (el < 1500) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }

  /* ---- color shade ------------------------------------------------------- */
  function shade(hex, amt) {
    hex = (hex || '#4283cc').replace('#', ''); if (hex.length === 3) hex = hex.split('').map(function (x) { return x + x; }).join('');
    var n = parseInt(hex, 16), r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt)), g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt)), b = Math.max(0, Math.min(255, (n & 255) + amt));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /* ---- render ------------------------------------------------------------ */
  function render() {
    var v, chrome = true;
    switch (route.name) {
      case 'onboard': v = viewOnboard(); chrome = false; break;
      case 'track': v = viewTrack(route.param); break;
      case 'case': v = viewCase(route.param); break;
      case 'quiz': v = viewQuiz(); chrome = false; break;
      case 'result': v = viewResult(); chrome = false; break;
      case 'exam': v = viewExam(); chrome = false; break;
      case 'examresult': v = viewExamResult(); chrome = false; break;
      case 'deck': v = viewDeck(); break;
      case 'about': v = viewAbout(); break;
      default: v = viewHome();
    }
    app.innerHTML = (chrome ? topbar() : '') + v + (chrome ? tabbar() : '');
    bindEvents();
    if (route.name === 'home') renderSearch();
  }

  function bindCaseButtons(scope) {
    (scope || app).querySelectorAll('[data-case]').forEach(function (el) { el.addEventListener('click', function () { go('case', el.getAttribute('data-case')); }); });
  }
  function bindEvents() {
    app.querySelectorAll('[data-tab]').forEach(function (el) { el.addEventListener('click', function () { searchTerm = ''; go(el.getAttribute('data-tab')); }); });
    app.querySelectorAll('[data-track]').forEach(function (el) { el.addEventListener('click', function () { go('track', el.getAttribute('data-track')); }); });
    bindCaseButtons(app);
    app.querySelectorAll('[data-go]').forEach(function (el) { el.addEventListener('click', function () { go(el.getAttribute('data-go'), el.getAttribute('data-param')); }); });
    app.querySelectorAll('[data-quiz]').forEach(function (el) { el.addEventListener('click', function () { startQuiz(el.getAttribute('data-quiz')); }); });
    app.querySelectorAll('[data-opt]').forEach(function (el) { el.addEventListener('click', function () { answer(parseInt(el.getAttribute('data-opt'), 10)); }); });
    app.querySelectorAll('[data-eopt]').forEach(function (el) { el.addEventListener('click', function () { examAnswer(parseInt(el.getAttribute('data-eopt'), 10)); }); });
    app.querySelectorAll('[data-next-case]').forEach(function (el) { el.addEventListener('click', function () { nextCaseAfter(el.getAttribute('data-next-case')); }); });
    app.querySelectorAll('[data-exam]').forEach(function (el) { el.addEventListener('click', startExam); });

    var si = document.getElementById('search-in');
    if (si) si.addEventListener('input', function () { searchTerm = si.value; renderSearch(); });

    var ob = document.getElementById('ob-next');
    if (ob) ob.addEventListener('click', function () { if (obSlide < OB.length - 1) { obSlide++; render(); } else { state.onboarded = true; save(); go('home'); } });
    var obs = document.getElementById('ob-skip');
    if (obs) obs.addEventListener('click', function () { state.onboarded = true; save(); go('home'); });

    var rb = document.getElementById('reset-btn');
    if (rb) rb.addEventListener('click', function () { if (confirm('Apagar todo o progresso, XP e cartas?')) { state = { xp: 0, streak: 0, lastDay: null, done: {}, onboarded: true, examBest: 0 }; save(); toast('Progresso apagado'); go('home'); } });
  }

  /* ---- boot -------------------------------------------------------------- */
  (function boot() {
    var hash = (location.hash || '').replace('#', '');
    if (hash) { var p = hash.split('/'); if (['track', 'case', 'deck', 'about'].indexOf(p[0]) >= 0) { route = { name: p[0], param: p[1] || null }; render(); return; } }
    if (!state.onboarded) { route = { name: 'onboard' }; render(); return; }
    render();
  })();

  window.CHASE = { go: go, state: state };
})();
