/* =============================================================================
   app.js — engine do Chase the Case Game (vanilla JS, sem build)
   ============================================================================= */
(function () {
  'use strict';

  var TRACKS = window.CHASE_TRACKS || [];
  var CASES = window.CHASE_CASES || [];
  var EQ = window.CHASE_EQUIPAMENTOS || {};
  var byId = {};
  CASES.forEach(function (c) { byId[c.id] = c; });

  /* ---- estado persistido ------------------------------------------------- */
  var SKEY = 'chase_state_v1';
  var state = load();
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(SKEY));
      if (s && s.done) return s;
    } catch (e) {}
    return { xp: 0, streak: 0, lastDay: null, done: {} /* caseId: {best, mastered} */ };
  }
  function save() { try { localStorage.setItem(SKEY, JSON.stringify(state)); } catch (e) {} }

  function level() { return Math.floor(state.xp / 100) + 1; }
  function levelProgress() { return state.xp % 100; }
  function totalCases() { return CASES.length; }
  function masteredCount() { return Object.keys(state.done).filter(function (k) { return state.done[k] && state.done[k].mastered; }).length; }

  function casesOfTrack(tid) { return CASES.filter(function (c) { return c.track === tid; }); }
  function trackProgress(tid) {
    var cs = casesOfTrack(tid), m = 0;
    cs.forEach(function (c) { if (state.done[c.id] && state.done[c.id].mastered) m++; });
    return { mastered: m, total: cs.length, pct: cs.length ? Math.round((m / cs.length) * 100) : 0 };
  }

  function bumpStreak() {
    var today = new Date().toISOString().slice(0, 10);
    if (state.lastDay === today) return;
    var y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    state.streak = (state.lastDay === y) ? state.streak + 1 : 1;
    state.lastDay = today;
  }

  /* ---- helpers ----------------------------------------------------------- */
  var app = document.getElementById('app-root');
  function h(html) { return html; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]; }); }
  function trackById(id) { for (var i = 0; i < TRACKS.length; i++) if (TRACKS[i].id === id) return TRACKS[i]; return null; }

  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('show'); }, 1900);
  }

  function trendClass(t) { return t === '↑' ? 'up' : t === '↓' ? 'down' : 'flat'; }

  /* ---- router ------------------------------------------------------------ */
  var route = { name: 'home', param: null };
  function go(name, param) {
    route = { name: name, param: param };
    window.scrollTo(0, 0);
    render();
    try { history.replaceState(null, '', '#' + name + (param ? '/' + param : '')); } catch (e) {}
  }

  /* ---- top bar ----------------------------------------------------------- */
  function topbar() {
    return '' +
      '<div class="topbar">' +
        '<div class="brand">' +
          '<div class="dot">🩸</div>' +
          '<div><b>Chase the Case</b><small>Jornada de Hematologia</small></div>' +
        '</div>' +
        '<div class="xp-chip"><span class="flame">🔥</span>' + state.streak + '<span class="lv">· Nv ' + level() + '</span></div>' +
      '</div>';
  }

  /* ---- tab bar ----------------------------------------------------------- */
  function tabbar() {
    var tabs = [
      { id: 'home', ic: '🗺️', label: 'Jornada' },
      { id: 'deck', ic: '🃏', label: 'Coleção' },
      { id: 'about', ic: 'ℹ️', label: 'Sobre' },
    ];
    var active = (route.name === 'home' || route.name === 'track' || route.name === 'case' || route.name === 'quiz' || route.name === 'result') ? 'home'
      : route.name === 'deck' ? 'deck' : route.name === 'about' ? 'about' : 'home';
    return '<div class="tabbar"><div class="inner">' + tabs.map(function (t) {
      return '<button class="tab ' + (active === t.id ? 'active' : '') + '" data-tab="' + t.id + '">' +
        '<span class="ti">' + t.ic + '</span>' + t.label + '</button>';
    }).join('') + '</div></div>';
  }

  /* ---- HOME -------------------------------------------------------------- */
  function viewHome() {
    var lp = levelProgress();
    var s = '<div class="screen">';
    s += '<div class="hero">' +
        '<div class="eyebrow">Estudo gamificado · casos reais HORIBA</div>' +
        '<h2>Resolva o caso. Leia a lâmina. Vire especialista.</h2>' +
        '<p>Cada carta é um caso clínico real da série Chase the Case. Decifre os flags do analisador, a matriz, os parâmetros e a morfologia no CellaVision — e avance pelas trilhas.</p>' +
        '<div class="stats">' +
          '<div class="stat"><b>' + masteredCount() + '/' + totalCases() + '</b><span>Casos dominados</span></div>' +
          '<div class="stat"><b>Nv ' + level() + '</b><span>' + lp + '/100 XP</span></div>' +
          '<div class="stat"><b>🔥 ' + state.streak + '</b><span>Sequência</span></div>' +
        '</div>' +
        '<div style="margin-top:14px" class="xpbar"><i style="width:' + lp + '%"></i></div>' +
      '</div>';

    s += '<div class="sec-head"><h3>Trilhas de conhecimento</h3><span>' + TRACKS.length + ' trilhas</span></div>';
    TRACKS.forEach(function (t) {
      var p = trackProgress(t.id);
      s += '<button class="track" data-track="' + t.id + '">' +
        '<div class="ico" style="color:' + t.cor + '">' + t.emoji + '</div>' +
        '<div class="meta"><b>' + esc(t.nome) + '</b><p>' + esc(t.descricao) + '</p>' +
          '<div class="prog"><div class="xpbar"><i style="width:' + p.pct + '%;background:' + t.cor + '"></i></div>' +
          '<small>' + p.mastered + '/' + p.total + '</small></div>' +
        '</div><div class="chev">›</div></button>';
    });

    s += '<hr class="sep"><div class="note-card">⚕️ <b>Material de estudo.</b> Conteúdo educacional baseado nos casos públicos da HORIBA Medical. Não substitui laudo, diretriz clínica ou os PDFs oficiais. Veja a aba <b>Sobre</b>.</div>';
    s += '</div>';
    return s;
  }

  /* ---- TRACK ------------------------------------------------------------- */
  function viewTrack(tid) {
    var t = trackById(tid); if (!t) return viewHome();
    var cs = casesOfTrack(tid);
    var p = trackProgress(tid);
    var s = '<div class="screen">';
    s += '<button class="backlink" data-go="home">‹ Jornada</button>';
    s += '<div class="cs-hero" style="background:radial-gradient(120% 120% at 0 0,' + hexA(t.cor, .18) + ',transparent 55%),var(--surface)">' +
        '<div class="num" style="color:' + t.cor + '">' + t.emoji + ' TRILHA</div>' +
        '<h2>' + esc(t.nome) + '</h2><div class="ctx">' + esc(t.descricao) + '</div>' +
        '<div class="prog" style="margin-top:14px;display:flex;align-items:center;gap:8px">' +
          '<div class="xpbar" style="flex:1"><i style="width:' + p.pct + '%;background:' + t.cor + '"></i></div>' +
          '<small style="font-size:11px;font-weight:700;color:var(--txt-dim)">' + p.mastered + '/' + p.total + ' dominados</small>' +
        '</div></div>';

    s += '<div class="sec-head"><h3>Casos</h3><span>' + cs.length + ' cartas</span></div>';
    cs.forEach(function (c) {
      var d = state.done[c.id];
      var status = d && d.mastered ? '<span class="status-dot done">✓ Dominado</span>' : '<span class="status-dot new">Novo</span>';
      var diff = '<span class="diff">' + [1, 2, 3].map(function (n) { return '<i class="' + (n <= c.dificuldade ? 'on' : '') + '"></i>'; }).join('') + '</span>';
      s += '<button class="case-card" data-case="' + c.id + '">' +
        '<div class="ribbon" style="background:' + t.cor + '"></div>' +
        '<div class="row1"><span class="num">CASE #' + esc(c.numero) + '</span>' + diff + status + '</div>' +
        '<h4>' + esc(c.patologia) + '</h4>' +
        '<div class="ctx">' + esc(c.contexto) + '</div>' +
        '<div class="tags">' + (c.equipamento || []).map(function (e) { return '<span class="tag-eq">🔌 ' + esc(e) + '</span>'; }).join('') + '</div>' +
        '</button>';
    });
    s += '</div>';
    return s;
  }

  /* ---- CASE STUDY -------------------------------------------------------- */
  function viewCase(cid) {
    var c = byId[cid]; if (!c) return viewHome();
    var t = trackById(c.track);
    var d = state.done[c.id];
    var s = '<div class="screen">';
    s += '<button class="backlink" data-go="track" data-param="' + c.track + '">‹ ' + esc(t ? t.nome : 'Voltar') + '</button>';

    s += '<div class="cs-hero">' +
        '<div class="num">CASE #' + esc(c.numero) + (d && d.mastered ? ' · ✓ DOMINADO' : '') + '</div>' +
        '<h2>' + esc(c.patologia) + '</h2>' +
        '<div class="ctx">' + esc(c.contexto) + '</div>' +
        '<div class="tags" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:13px">' +
          (c.equipamento || []).map(function (e) { return '<span class="tag-eq">🔌 ' + esc(e) + '</span>'; }).join('') +
        '</div></div>';

    // Pistas do analisador
    if (c.pistas && c.pistas.length) {
      s += block('🔎', 'O que o analisador apontou',
        '<div class="chips" style="flex-direction:column;align-items:stretch;gap:9px">' +
        c.pistas.map(function (p) {
          return '<div style="display:flex;gap:10px;font-size:13.5px;color:var(--txt-dim);line-height:1.5">' +
            '<span style="color:var(--accent);flex:none">➤</span><span>' + esc(p) + '</span></div>';
        }).join('') + '</div>');
    }

    // Matriz / asset slot
    s += block('🧭', 'Matriz & Histograma',
      assetSlot(c.assets && c.assets.matriz, 'Matriz LMNE / dispersão') +
      '<p style="font-size:13px;color:var(--txt-dim);line-height:1.55;margin-top:12px">' + esc(c.histograma) + '</p>');

    // Parâmetros
    if (c.parametros && c.parametros.length) {
      s += block('📊', 'Parâmetros-chave <span style="font-size:10px;font-weight:600;color:var(--txt-mute);margin-left:auto">padrão típico (didático)</span>',
        '<div class="params">' + c.parametros.map(function (p) {
          return '<div class="param"><span class="nm">' + esc(p.nome) + '</span>' +
            '<span class="tr ' + trendClass(p.tendencia) + '">' + esc(p.tendencia) + '</span>' +
            '<span class="note">' + esc(p.nota) + '</span></div>';
        }).join('') + '</div>');
    }

    // Flags
    if (c.flags && c.flags.length) {
      s += block('🚩', 'Flags / Alarmes',
        '<div class="chips">' + c.flags.map(function (f) { return '<span class="flag-chip">⚑ ' + esc(f) + '</span>'; }).join('') + '</div>');
    }

    // CellaVision morphology
    if (c.cellavision && c.cellavision.length) {
      s += block('🔬', 'Lâmina no CellaVision',
        assetSlot(c.assets && c.assets.lamina, 'Imagem de lâmina (CellaVision)') +
        '<div style="margin-top:12px">' + c.cellavision.map(function (m) { return '<div class="morph-li">' + esc(m) + '</div>'; }).join('') + '</div>');
    }

    // Aprendizado
    s += '<div class="block learn-box"><div class="bt"><span class="bi">💡</span>O insight do caso</div>' +
      '<div class="learn">' + esc(c.aprendizado) + '</div></div>';

    // CTA
    var nq = (c.quiz || []).length;
    s += '<button class="btn lg" data-quiz="' + c.id + '">⚡ ' + (d && d.mastered ? 'Refazer desafio' : 'Aceitar o desafio') + ' · ' + nq + ' perguntas</button>';
    if (c.fonte) s += '<div style="text-align:center;margin-top:14px"><a class="backlink" href="' + esc(c.fonte) + '" target="_blank" rel="noopener">Caso oficial HORIBA ↗</a></div>';
    s += '</div>';
    return s;
  }

  function block(ic, title, body) {
    return '<div class="block"><div class="bt"><span class="bi">' + ic + '</span>' + title + '</div>' + body + '</div>';
  }
  function assetSlot(src, label) {
    if (src) return '<div class="asset-slot has-img"><img src="' + esc(src) + '" alt="' + esc(label) + '"></div>';
    return '<div class="asset-slot"><span class="ph-ic">🖼️</span>' + esc(label) + '<br><span style="opacity:.7">imagem oficial — inserir via assets</span></div>';
  }

  /* ---- QUIZ -------------------------------------------------------------- */
  var quizState = null;
  function startQuiz(cid) {
    var c = byId[cid];
    quizState = { cid: cid, i: 0, correct: 0, answered: false, questions: c.quiz || [] };
    go('quiz', cid);
  }
  function viewQuiz() {
    var c = byId[quizState.cid];
    var qs = quizState.questions;
    var q = qs[quizState.i];
    var pct = Math.round((quizState.i / qs.length) * 100);
    var s = '<div class="screen">';
    s += '<button class="backlink" data-case="' + c.id + '">‹ Sair do desafio</button>';
    s += '<div class="quiz-top"><div class="xpbar"><i style="width:' + pct + '%"></i></div>' +
      '<small>' + (quizState.i + 1) + '/' + qs.length + '</small></div>';
    s += '<div class="q-card"><div class="qn">CASE #' + esc(c.numero) + ' · ' + esc(c.patologia) + '</div>' +
      '<div class="qq">' + esc(q.p) + '</div>';
    q.opcoes.forEach(function (o, idx) {
      s += '<button class="opt" data-opt="' + idx + '"><span class="key">' + String.fromCharCode(65 + idx) + '</span>' + esc(o) + '</button>';
    });
    s += '<div id="explain-slot"></div></div>';
    s += '</div>';
    return s;
  }

  function answer(idx) {
    if (quizState.answered) return;
    quizState.answered = true;
    var q = quizState.questions[quizState.i];
    var correct = q.correta;
    var opts = app.querySelectorAll('.opt');
    opts.forEach(function (o, i) {
      o.setAttribute('disabled', '');
      if (i === correct) o.classList.add('correct');
      if (i === idx && idx !== correct) o.classList.add('wrong');
    });
    var ok = idx === correct;
    if (ok) quizState.correct++;
    var slot = document.getElementById('explain-slot');
    slot.innerHTML = '<div class="explain ' + (ok ? 'ok' : 'no') + '">' +
      '<b>' + (ok ? '✓ Acertou!' : '✗ Quase lá.') + '</b> ' + esc(q.explica) +
      '<button class="btn" style="margin-top:14px" id="next-q">' +
      (quizState.i + 1 < quizState.questions.length ? 'Próxima pergunta' : 'Ver resultado') + ' →</button></div>';
    slot.querySelector('#next-q').addEventListener('click', nextQuestion);
    slot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function nextQuestion() {
    if (quizState.i + 1 < quizState.questions.length) {
      quizState.i++; quizState.answered = false; render();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    var c = byId[quizState.cid];
    var total = quizState.questions.length;
    var correct = quizState.correct;
    var pct = total ? Math.round((correct / total) * 100) : 0;
    var mastered = pct >= 70;
    var firstMastery = mastered && !(state.done[quizState.cid] && state.done[quizState.cid].mastered);

    var gained = correct * 10 + (mastered ? 20 : 0);
    state.xp += gained;
    var best = Math.max(pct, (state.done[quizState.cid] && state.done[quizState.cid].best) || 0);
    state.done[quizState.cid] = { best: best, mastered: (state.done[quizState.cid] && state.done[quizState.cid].mastered) || mastered };
    if (mastered) bumpStreak();
    save();
    quizState.result = { pct: pct, correct: correct, total: total, gained: gained, mastered: mastered, firstMastery: firstMastery };
    go('result', quizState.cid);
  }

  function viewResult() {
    var c = byId[quizState.cid];
    var r = quizState.result;
    var emoji = r.pct === 100 ? '🏆' : r.mastered ? '🎉' : '📚';
    var title = r.pct === 100 ? 'Caso perfeito!' : r.mastered ? 'Caso dominado!' : 'Continue caçando';
    var sub = r.mastered ? 'Você decifrou ' + esc(c.patologia) + '.' : 'Acerte 70% para dominar a carta. Revise e tente de novo!';
    var s = '<div class="screen"><div class="result">' +
      '<div class="badge">' + emoji + '</div>' +
      '<h2>' + title + '</h2><div class="sub">' + sub + '</div>' +
      '<div class="score">' + r.pct + '%</div>' +
      '<div class="sub">' + r.correct + ' de ' + r.total + ' corretas</div>' +
      '<div class="rewards">' +
        '<div class="reward"><b>+' + r.gained + '</b><span>XP GANHO</span></div>' +
        '<div class="reward"><b>Nv ' + level() + '</b><span>NÍVEL</span></div>' +
        '<div class="reward"><b>🔥 ' + state.streak + '</b><span>SEQUÊNCIA</span></div>' +
      '</div>';
    if (r.firstMastery) s += '<div class="note-card" style="border-color:var(--good);background:rgba(52,211,153,.08);border-left-color:var(--good)">🃏 Nova carta adicionada à sua <b>Coleção</b>!</div>';
    s += '<button class="btn lg" data-quiz="' + c.id + '">↻ Refazer desafio</button>' +
      '<button class="btn ghost" style="margin-top:11px" data-go="track" data-param="' + c.track + '">Voltar à trilha</button>' +
      '<button class="btn ghost" style="margin-top:11px" data-next-case="' + c.id + '">Próximo caso →</button>';
    s += '</div></div>';
    return s;
  }

  function nextCaseAfter(cid) {
    var c = byId[cid];
    var cs = casesOfTrack(c.track);
    var idx = cs.findIndex(function (x) { return x.id === cid; });
    if (idx >= 0 && idx + 1 < cs.length) { go('case', cs[idx + 1].id); return; }
    // próxima trilha
    var ti = TRACKS.findIndex(function (t) { return t.id === c.track; });
    if (ti >= 0 && ti + 1 < TRACKS.length) { go('track', TRACKS[ti + 1].id); return; }
    go('home');
  }

  /* ---- DECK / COLEÇÃO ---------------------------------------------------- */
  function viewDeck() {
    var s = '<div class="screen">';
    s += '<div class="eyebrow">Sua coleção</div><h1 class="h1">Cartas dominadas</h1>' +
      '<p class="lead">Domine um caso (≥70% no desafio) para colecionar a carta.</p>';
    s += '<div style="margin:16px 0" class="hero" ><div class="stats" style="margin-top:0">' +
      '<div class="stat"><b>' + masteredCount() + '</b><span>Colecionadas</span></div>' +
      '<div class="stat"><b>' + totalCases() + '</b><span>Total</span></div>' +
      '<div class="stat"><b>' + Math.round(masteredCount() / totalCases() * 100) + '%</b><span>Completo</span></div>' +
      '</div></div>';
    s += '<div class="deck-grid">';
    CASES.forEach(function (c) {
      var t = trackById(c.track);
      var done = state.done[c.id] && state.done[c.id].mastered;
      s += '<button class="mini ' + (done ? '' : 'locked') + '" data-case="' + c.id + '" style="border-color:' + (done ? hexA(t.cor, .5) : 'var(--line)') + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:start">' +
          '<span class="num">#' + esc(c.numero) + '</span>' +
          '<span class="seal">' + (done ? '✓' : '🔒') + '</span></div>' +
        '<div class="emoji" style="margin-top:8px">' + (t ? t.emoji : '🩸') + '</div>' +
        '<h5>' + esc(c.patologia) + '</h5>' +
        '<small style="font-size:10px;color:var(--txt-mute);margin-top:5px">' + esc(t ? t.nome : '') + '</small>' +
        '</button>';
    });
    s += '</div></div>';
    return s;
  }

  /* ---- ABOUT ------------------------------------------------------------- */
  function viewAbout() {
    var srcSeen = {};
    var sources = [];
    CASES.forEach(function (c) { if (c.fonte && !srcSeen[c.fonte]) { srcSeen[c.fonte] = 1; sources.push(c); } });
    var s = '<div class="screen">';
    s += '<div class="eyebrow">Sobre & Fontes</div><h1 class="h1">Como este estudo foi feito</h1>';
    s += '<div class="note-card">📖 <b>Índice de casos = real.</b> Número, patologia e equipamento (Yumizen H2500/H550/H500, CellaVision DC-1) vêm das publicações públicas da série <b>HORIBA · Chase the Case</b>.</div>';
    s += '<div class="note-card">✍️ <b>Conteúdo de ensino = síntese original.</b> Morfologia, flags, parâmetros e quizzes foram escritos a partir de hematologia laboratorial consolidada, alinhados à patologia de cada caso. Os valores de parâmetros são <b>faixas didáticas</b>, não o laudo do paciente.</div>';
    s += '<div class="note-card">🖼️ <b>Imagens oficiais não incluídas.</b> Histogramas, matrizes e fotos de lâmina dos PDFs da HORIBA são material protegido. Cada caso tem um <b>slot</b> para você inserir o ativo oficial (ver <code>CONTENT-SOURCES.md</code>).</div>';
    s += '<div class="note-card" style="border-left-color:var(--bad);background:rgba(244,63,94,.06)">⚕️ <b>Aviso.</b> Ferramenta de estudo. Não é orientação diagnóstica nem substitui diretrizes, laudos ou os documentos oficiais HORIBA.</div>';

    s += '<div class="sec-head"><h3>Casos oficiais (fontes)</h3><span>' + sources.length + '</span></div>';
    sources.forEach(function (c) {
      s += '<a class="src-li" href="' + esc(c.fonte) + '" target="_blank" rel="noopener">' +
        '<b>Case #' + esc(c.numero) + '</b> · ' + esc(c.patologia) +
        '<small>' + esc(c.fonte) + '</small></a>';
    });

    s += '<hr class="sep"><div style="text-align:center;color:var(--txt-mute);font-size:12px">' +
      'Progresso salvo só no seu aparelho (localStorage).<br>' +
      '<button class="backlink" id="reset-btn" style="color:var(--bad);justify-content:center;width:100%;margin-top:8px">Apagar meu progresso</button></div>';
    s += '</div>';
    return s;
  }

  /* ---- render ------------------------------------------------------------ */
  function render() {
    var v;
    switch (route.name) {
      case 'track': v = viewTrack(route.param); break;
      case 'case': v = viewCase(route.param); break;
      case 'quiz': v = viewQuiz(); break;
      case 'result': v = viewResult(); break;
      case 'deck': v = viewDeck(); break;
      case 'about': v = viewAbout(); break;
      default: v = viewHome();
    }
    var showTop = route.name !== 'quiz' && route.name !== 'result';
    app.innerHTML = (showTop ? topbar() : '') + v + tabbar();
    bindEvents();
  }

  function bindEvents() {
    app.querySelectorAll('[data-tab]').forEach(function (el) {
      el.addEventListener('click', function () { go(el.getAttribute('data-tab')); });
    });
    app.querySelectorAll('[data-track]').forEach(function (el) {
      el.addEventListener('click', function () { go('track', el.getAttribute('data-track')); });
    });
    app.querySelectorAll('[data-case]').forEach(function (el) {
      el.addEventListener('click', function () { go('case', el.getAttribute('data-case')); });
    });
    app.querySelectorAll('[data-go]').forEach(function (el) {
      el.addEventListener('click', function () { go(el.getAttribute('data-go'), el.getAttribute('data-param')); });
    });
    app.querySelectorAll('[data-quiz]').forEach(function (el) {
      el.addEventListener('click', function () { startQuiz(el.getAttribute('data-quiz')); });
    });
    app.querySelectorAll('[data-opt]').forEach(function (el) {
      el.addEventListener('click', function () { answer(parseInt(el.getAttribute('data-opt'), 10)); });
    });
    app.querySelectorAll('[data-next-case]').forEach(function (el) {
      el.addEventListener('click', function () { nextCaseAfter(el.getAttribute('data-next-case')); });
    });
    var rb = document.getElementById('reset-btn');
    if (rb) rb.addEventListener('click', function () {
      if (confirm('Apagar todo o progresso, XP e cartas?')) {
        state = { xp: 0, streak: 0, lastDay: null, done: {} }; save(); toast('Progresso apagado'); go('home');
      }
    });
  }

  /* color helper: hex + alpha -> rgba */
  function hexA(hex, a) {
    hex = (hex || '#2ad0ee').replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (x) { return x + x; }).join('');
    var n = parseInt(hex, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  /* boot */
  (function bootRoute() {
    var hash = (location.hash || '').replace('#', '');
    if (hash) {
      var parts = hash.split('/');
      if (parts[0] === 'track' || parts[0] === 'case' || parts[0] === 'deck' || parts[0] === 'about') {
        route = { name: parts[0], param: parts[1] || null };
      }
    }
    render();
  })();

  window.CHASE = { go: go, state: state };
})();
