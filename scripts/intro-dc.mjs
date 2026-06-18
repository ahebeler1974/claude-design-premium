#!/usr/bin/env node
/**
 * intro-dc.mjs
 *
 * Single harness design-system page (not a surface template). Materialized on bootstrap
 * as design-system.dc.html. The page copy is localized, but the filename stays
 * conventional across languages.
 *
 * Uses .dc.html because Claude Design requires the Design Component runtime
 * (<x-dc>, <helmet>, x-import, DCLogic) — plain .html would not mount the DS bundle.
 */
import fs from 'node:fs';
import path from 'node:path';
import { writeShowcaseBrief, showcaseNeedsAssembly } from './showcase-brief.mjs';

export const INTRO_TEMPLATE = 'scripts/templates/intro.dc.html';

export const INTRO_FILENAMES = {
  'pt-BR': 'design-system.dc.html',
  en: 'design-system.dc.html',
};

/** @deprecated legacy surface templates + old starter name */
export const LEGACY_DC_FILES = [
  'Starter.dc.html',
  'Landing.dc.html',
  'AppShell.dc.html',
  'Deck.dc.html',
  'Doc.dc.html',
];

export function introDcFilename(language) {
  return INTRO_FILENAMES[language === 'en' ? 'en' : 'pt-BR'];
}

export function listKnownIntroFiles() {
  return [...new Set([
    ...Object.values(INTRO_FILENAMES),
    'sistema-de-design.dc.html',
    'comece-por-aqui.dc.html',
    'start-here.dc.html',
    'intro.dc.html',
  ])];
}

function read(cwd, rel) {
  try {
    return fs.readFileSync(path.join(cwd, rel), 'utf8');
  } catch {
    return '';
  }
}

function scoreLanguage(text, lang) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  if (lang === 'pt-BR') {
    let score = 0;
    if (/pt-BR|português brasileiro|portuguese \(brazil\)/i.test(text)) score += 8;
    if (/você|não|como|para|entrega|roteamento|ancore|comece|guia|prompts úteis/i.test(lower)) score += 2;
    if (/[ãõçáéíóúâêô]/i.test(text)) score += 3;
    if (/README\.pt-BR/i.test(text)) score += 4;
    return score;
  }
  let score = 0;
  if (/\ben-US\b|\benglish\b/i.test(text) && !/pt-BR/i.test(text)) score += 6;
  if (/\bthe harness\b|\bget started\b|\brouting table\b|\bdesign system guardian\b/i.test(lower)) score += 2;
  if (/you |your |before acting|read before/i.test(lower)) score += 1;
  return score;
}

/**
 * Detect document language from harness prose + DS readme (not UI component names).
 * @param {string} [cwd]
 * @param {object} [opts]
 * @param {string} [opts.readmePath]
 * @param {string} [opts.fallback]
 */
export function detectDocLanguage(cwd = process.cwd(), opts = {}) {
  const corpus = [
    read(cwd, 'CLAUDE.md'),
    read(cwd, 'README.md'),
    read(cwd, 'README.pt-BR.md'),
    read(cwd, 'DESIGN.md'),
    opts.readmePath ? read(cwd, opts.readmePath) : '',
    read(cwd, 'skills/harness-auto-setup.skill.md'),
  ].join('\n');

  const pt = scoreLanguage(corpus, 'pt-BR');
  const en = scoreLanguage(corpus, 'en');
  if (en > pt + 2) return 'en';
  if (pt > en) return 'pt-BR';
  return opts.fallback === 'en' ? 'en' : 'pt-BR';
}

function introCopy(language, binding, voice = binding.voice ?? {}) {
  const name = binding.name;
  const l = labels(language);
  const shared = {
    INTRO_PAGE_TITLE: `${l.pageTitlePrefix} - ${name}`,
    INTRO_SYSTEM_HTML: renderShowcaseScaffold(language, binding, voice),
  };
  if (language === 'en') {
    return { INTRO_HTML_LANG: 'en', ...shared };
  }
  return { INTRO_HTML_LANG: 'pt-BR', ...shared };
}

function escapeForScript(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function labels(language) {
  if (language === 'en') {
    return {
      pageTitlePrefix: 'Design System',
      eyebrow: 'Bound design system',
      heroTitle: 'Everything this system exposes.',
      heroLead:
        'Scaffold from bootstrap — the active model assembles the full customized showcase from manifest, tokens, and readme. Inspect what this product actually exposes before designing new screens.',
      components: 'Components',
      tokens: 'Tokens',
      fonts: 'Fonts',
      cards: 'Specimens',
      theme: 'Theme',
      foundationsEyebrow: 'Foundations',
      foundationsTitle: 'Tokens, type, surfaces, and motion',
      colors: 'Colors',
      typography: 'Typography',
      spacing: 'Spacing',
      radius: 'Radius',
      motion: 'Motion',
      surfaces: 'Product surfaces',
      componentEyebrow: 'Live components',
      componentTitle: 'Every element from the namespace',
      specimenEyebrow: 'Manifest previews',
      specimenTitle: 'What the source project says matters',
      harnessEyebrow: 'Harness operation',
      harnessTitle: 'Prompts for creating deliverables',
      empty: 'No data exposed by the manifest.',
      source: 'Source',
      group: 'Group',
      introFooter: 'Generated from the detected design system. If this page looks thin, the source manifest or readme is thin.',
      assemblyPendingTitle: 'Showcase pending assembly',
      assemblyPendingLead:
        'Bootstrap wrote the scaffold and `.cdp/showcase-brief.json`. The active model must assemble the full design-system page from the real manifest, tokens, and readme — customized for this product, not a generic JS dump.',
      assemblyPendingAction: 'Run `assemble-design-system-showcase` (see CLAUDE.md routing).',
    };
  }

  return {
    pageTitlePrefix: 'Sistema de Design',
    eyebrow: 'Design system vinculado',
    heroTitle: 'Tudo que este sistema expõe.',
    heroLead:
      'Scaffold do bootstrap — o modelo ativo monta a vitrine completa e customizada a partir do manifesto, tokens e readme. Use isto para enxergar o que este produto realmente expõe antes de desenhar novas telas.',
    components: 'Componentes',
    tokens: 'Tokens',
    fonts: 'Fontes',
    cards: 'Specimens',
    theme: 'Tema',
    foundationsEyebrow: 'Fundamentos',
    foundationsTitle: 'Tokens, tipo, superfícies e motion',
    colors: 'Cores',
    typography: 'Tipografia',
    spacing: 'Espaçamento',
    radius: 'Raios',
    motion: 'Motion',
    surfaces: 'Superfícies do produto',
    componentEyebrow: 'Componentes vivos',
    componentTitle: 'Todos os elementos do namespace',
    specimenEyebrow: 'Previews do manifesto',
    specimenTitle: 'O que o projeto fonte declara como importante',
    harnessEyebrow: 'Operação do harness',
    harnessTitle: 'Prompts para criar entregáveis',
    empty: 'Nenhum dado exposto pelo manifesto.',
    source: 'Origem',
    group: 'Grupo',
    introFooter: 'Gerado a partir do design system detectado. Se esta página parecer pobre, o manifesto ou readme de origem está pobre.',
    assemblyPendingTitle: 'Vitrine pendente de montagem',
    assemblyPendingLead:
      'O bootstrap gravou o scaffold e `.cdp/showcase-brief.json`. O modelo ativo deve montar a página completa do design system a partir do manifesto, tokens e readme reais — customizada para este produto, não um dump genérico de JS.',
    assemblyPendingAction: 'Rode `assemble-design-system-showcase` (ver roteamento no CLAUDE.md).',
  };
}

function renderMetricPlaceholder(label, value) {
  return `<x-import component-from-global-scope="{{BOUND_DS_NAMESPACE}}.StatChip" label="${escapeHtml(label)}" value="${escapeHtml(String(value))}" hint-size="auto,28px"></x-import>`;
}

/** Bootstrap scaffold only — full showcase is assembled by the model (see showcase-brief.mjs). */
function renderShowcaseScaffold(language, binding, voice) {
  const l = labels(language);
  const tokenCount = binding.tokens?.length ?? 0;
  const fontCount = binding.brandFonts?.length ?? 0;
  const cardCount = binding.cardMeta?.length ?? binding.cards?.length ?? 0;
  const themeLabel = voice.themeLabel ?? (voice.themeDefault === 'light' ? 'DIA · LIGHT' : 'NOITE · DARK');
  const logo = voice.logoPath
    ? `<img src="${escapeHtml(voice.logoPath)}" alt="" style="width:42px;height:42px;object-fit:contain;">`
    : '';

  return `<div class="cdp-ds" data-cdp-showcase="pending">
  <main class="cdp-main">
    <header class="cdp-hero">
      <div class="cdp-brandline">${logo}<span>${escapeHtml(binding.name)}</span></div>
      <p class="cdp-kicker">${escapeHtml(l.eyebrow)}</p>
      <h1>${escapeHtml(l.heroTitle)}</h1>
      <p>${escapeHtml(l.heroLead)}</p>
      <div class="cdp-metrics">
        ${renderMetricPlaceholder(l.components, binding.componentCount ?? binding.components?.length ?? 0)}
        ${renderMetricPlaceholder(l.tokens, tokenCount)}
        ${renderMetricPlaceholder(l.fonts, fontCount)}
        ${renderMetricPlaceholder(l.cards, cardCount)}
        ${renderMetricPlaceholder(l.theme, themeLabel)}
      </div>
    </header>

    <!-- CDP:SHOWCASE:PENDING -->
    <section id="showcase-pending" class="cdp-section">
      <x-import component-from-global-scope="{{BOUND_DS_NAMESPACE}}.SectionHeader" eyebrow="Harness" title="${escapeHtml(l.assemblyPendingTitle)}" hint-size="100%,72px"></x-import>
      <p class="cdp-note">${escapeHtml(l.assemblyPendingLead)}</p>
      <p class="cdp-note"><strong>${escapeHtml(l.assemblyPendingAction)}</strong></p>
      <p class="cdp-note">${escapeHtml(l.introFooter)}</p>
    </section>
    <!-- /CDP:SHOWCASE:PENDING -->

    <section id="harness" class="cdp-section">
      <x-import component-from-global-scope="{{BOUND_DS_NAMESPACE}}.SectionHeader" eyebrow="${escapeHtml(l.harnessEyebrow)}" title="${escapeHtml(l.harnessTitle)}" hint-size="100%,72px"></x-import>
      <!-- CDP:PROMPTS -->
    </section>
  </main>
</div>`;
}

function loadManifest(cwd, binding) {
  try {
    return JSON.parse(read(cwd, binding.manifest));
  } catch {
    return null;
  }
}

function enrichBindingFromManifest(binding, cwd, voice) {
  const manifest = loadManifest(cwd, binding);
  return {
    ...binding,
    voice,
    tokens: binding.tokens ?? manifest?.tokens ?? [],
    componentMeta:
      binding.componentMeta ??
      (manifest?.components ?? []).map((c) => ({
        name: c.name ?? c,
        sourcePath: c.sourcePath,
      })),
    cardMeta: binding.cardMeta ?? manifest?.cards ?? [],
    startingPoints: binding.startingPoints ?? manifest?.startingPoints ?? [],
    brandFonts: binding.brandFonts ?? manifest?.brandFonts ?? [],
  };
}

function slug(name) {
  return String(name)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase();
}

function renderDesignSystemCss() {
  return `
  .cdp-ds { display:grid; grid-template-columns:minmax(200px,240px) minmax(0,1fr); gap:0; align-items:start; }
  @media (max-width:900px){ .cdp-ds { grid-template-columns:1fr; } .cdp-rail { position:relative !important; height:auto !important; border-right:0 !important; border-bottom:1px solid var(--hairline); } }
  .cdp-rail { position:sticky; top:0; height:100vh; overflow-y:auto; padding:24px 14px 48px; border-right:1px solid var(--hairline); background:var(--background); display:flex; flex-direction:column; gap:4px; }
  .cdp-rail > a { font-family:var(--font-mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted-foreground); padding:7px 10px; border-left:2px solid transparent; text-decoration:none; line-height:1.35; }
  .cdp-rail > a:hover { color:var(--foreground); border-left-color:var(--hairline-strong); }
  .cdp-rail .cdp-nav-group { margin:12px 0 4px; font-size:9px; letter-spacing:0.2em; color:var(--primary); padding:0 10px; }
  .cdp-rail .cdp-nav-comp { font-size:11px; letter-spacing:0.04em; text-transform:none; padding-left:18px; }
  .cdp-main { padding:40px clamp(18px,4vw,32px) 96px; min-width:0; }
  .cdp-hero { display:flex; flex-direction:column; gap:16px; margin-bottom:56px; padding-bottom:40px; border-bottom:1px solid var(--hairline); }
  .cdp-brandline { display:flex; align-items:center; gap:14px; font-family:var(--font-serif); font-size:var(--font-size-lg); }
  .cdp-kicker { font-family:var(--font-mono); font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--primary); margin:0; }
  .cdp-hero h1 { font-family:var(--font-display); font-weight:300; font-size:var(--font-size-5xl); line-height:1.02; letter-spacing:-0.01em; margin:0; max-width:22ch; }
  .cdp-hero > p { font-family:var(--font-serif); font-style:italic; color:var(--muted-foreground); font-size:var(--font-size-lg); max-width:62ch; margin:0; line-height:1.5; }
  .cdp-metrics { display:flex; flex-wrap:wrap; gap:24px; margin-top:4px; }
  .cdp-section { display:flex; flex-direction:column; gap:28px; margin-bottom:56px; scroll-margin-top:88px; }
  .cdp-two { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:24px; }
  .cdp-three { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; margin-top:20px; }
  .cdp-panel, .cdp-foundation-block { border:1px solid var(--hairline); padding:20px 22px; background:var(--background); }
  .cdp-panel h3, .cdp-foundation-block h3 { margin:0 0 14px; font-family:var(--font-mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--primary); }
  .cdp-note { margin:0; font-size:var(--font-size-sm); color:var(--muted-foreground); line-height:1.55; }
  .cdp-token-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:1px; background:var(--hairline); border:1px solid var(--hairline); }
  .cdp-token { display:flex; align-items:center; gap:12px; background:var(--background); padding:12px 14px; }
  .cdp-swatch { width:36px; height:36px; flex:none; border:1px solid var(--hairline-strong); border-radius:var(--radius-base,2px); }
  .cdp-token b { display:block; font-family:var(--font-mono); font-size:10px; letter-spacing:0.04em; }
  .cdp-token small { display:block; font-size:10px; color:var(--muted-foreground); margin-top:2px; word-break:break-all; }
  .cdp-type-list, .cdp-scale { display:flex; flex-direction:column; gap:10px; }
  .cdp-type-row, .cdp-scale-row { display:grid; grid-template-columns:140px 1fr; gap:16px; align-items:baseline; border-top:1px solid var(--hairline); padding:12px 0; }
  .cdp-type-row small, .cdp-scale-row small { color:var(--muted-foreground); font-size:10px; }
  .cdp-token-list { display:flex; flex-direction:column; gap:8px; }
  .cdp-token-list span { display:flex; flex-direction:column; gap:2px; border-top:1px solid var(--hairline); padding-top:8px; }
  .cdp-token-list b { font-family:var(--font-mono); font-size:10px; }
  .cdp-token-list small { font-size:10px; color:var(--muted-foreground); }
  .cdp-surface-grid, .cdp-specimen-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; }
  .cdp-surface, .cdp-specimen { border:1px solid var(--hairline); padding:18px 20px; }
  .cdp-surface h3, .cdp-specimen h3 { margin:6px 0 0; font-family:var(--font-serif); font-size:var(--font-size-lg); }
  .cdp-specimen p { margin:8px 0 0; font-size:var(--font-size-sm); color:var(--muted-foreground); line-height:1.5; }
  .cdp-specimen dl { margin:12px 0 0; font-size:11px; color:var(--muted-foreground); }
  .cdp-specimen dt { font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.12em; }
  .cdp-specimen dd { margin:2px 0 8px; word-break:break-all; }
  .cdp-group-label { display:flex; align-items:center; gap:16px; margin:8px 0 20px; font-family:var(--font-mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--primary); }
  .cdp-group-label::after { content:""; flex:1; height:1px; background:var(--hairline); }
  .cdp-component-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr)); gap:24px; }
  .cdp-component { border:1px solid var(--hairline); padding:22px 24px; display:flex; flex-direction:column; gap:12px; scroll-margin-top:88px; }
  .cdp-component-head { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; }
  .cdp-component-head h3 { margin:4px 0 0; font-family:var(--font-serif); font-size:var(--font-size-xl); }
  .cdp-component-head code { font-family:var(--font-mono); font-size:10px; color:var(--muted-foreground); word-break:break-all; }
  .cdp-component > p { margin:0; font-size:var(--font-size-sm); color:var(--muted-foreground); line-height:1.55; }
  .cdp-component-demo { padding-top:8px; }
  .cdp-row { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
  .cdp-stack { display:flex; flex-direction:column; gap:10px; }
  .cdp-book-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:20px; }
  .cdp-prompts { display:flex; flex-direction:column; }
  .cdp-prompt-item { border-top:1px solid var(--hairline); padding:28px 0; display:flex; flex-direction:column; gap:16px; }
  .cdp-prompt-head { display:flex; gap:14px; align-items:flex-start; }
  .cdp-prompt-head p { margin:0; }
  .cdp-prompt-title { font-family:var(--font-serif); font-size:var(--font-size-xl); line-height:1.1; }
  .cdp-prompt-desc { font-size:var(--font-size-sm); color:var(--muted-foreground); line-height:1.5; }
`.trim();
}

function tokenValue(token) {
  if (!token?.name) return '';
  if (token.name.endsWith('-hsl')) return `hsl(var(${token.name}))`;
  return `var(${token.name})`;
}

function tokenRows(tokens, predicate, limit) {
  return (tokens ?? [])
    .filter(predicate)
    .filter((token) => !token.scope)
    .slice(0, limit);
}

function renderMetric(label, value) {
  return `<x-import component-from-global-scope="{{BOUND_DS_NAMESPACE}}.StatChip" label="${escapeHtml(label)}" value="${escapeHtml(value)}" hint-size="auto,28px"></x-import>`;
}

function renderColorTokens(binding, language) {
  const l = labels(language);
  const picked = tokenRows(
    binding.tokens,
    (token) =>
      token.kind === 'color' &&
      !/-hsl$/.test(token.name ?? '') &&
      !String(token.value ?? '').startsWith('hsl(var('),
    32,
  );

  if (!picked.length) return `<p class="cdp-note">${l.empty}</p>`;

  return `<div class="cdp-token-grid">${picked
    .map((token) => {
      const background = tokenValue(token);
      return `<div class="cdp-token">
        <span class="cdp-swatch" style="background:${background};"></span>
        <span><b>${escapeHtml(token.name)}</b><small>${escapeHtml(token.value)}</small></span>
      </div>`;
    })
    .join('\n')}</div>`;
}

function renderTypography(binding, language) {
  const l = labels(language);
  const fonts = binding.brandFonts?.length
    ? binding.brandFonts
    : tokenRows(binding.tokens, (token) => /^--font-(sans|serif|mono|display)/.test(token.name ?? ''), 8).map((token) => ({
        family: token.name,
        tokens: [token.name],
        path: token.definedIn,
      }));
  const sizes = tokenRows(binding.tokens, (token) => /^--font-size-/.test(token.name ?? ''), 12);

  const fontRows = fonts.length
    ? fonts
        .map(
          (font) => `<div class="cdp-type-row">
            <span class="cdp-kicker">${escapeHtml(font.tokens?.join(', ') || l.fonts)}</span>
            <span style="font-family:${escapeHtml(font.family)};">${escapeHtml(font.family)}</span>
            <small>${escapeHtml(font.path ?? '')}</small>
          </div>`,
        )
        .join('\n')
    : `<p class="cdp-note">${l.empty}</p>`;

  const sizeRows = sizes
    .map(
      (token) => `<div class="cdp-scale-row">
        <span>${escapeHtml(token.name)}</span>
        <b style="font-size:var(${escapeHtml(token.name)});">Aa</b>
        <small>${escapeHtml(token.value)}</small>
      </div>`,
    )
    .join('\n');

  return `<div class="cdp-type-list">${fontRows}</div>${sizeRows ? `<div class="cdp-scale">${sizeRows}</div>` : ''}`;
}

function renderSimpleTokenList(binding, title, predicate, limit = 12) {
  const rows = tokenRows(binding.tokens, predicate, limit);
  if (!rows.length) return '';
  return `<div class="cdp-foundation-block">
    <h3>${escapeHtml(title)}</h3>
    <div class="cdp-token-list">${rows
      .map((token) => `<span><b>${escapeHtml(token.name)}</b><small>${escapeHtml(token.value)}</small></span>`)
      .join('\n')}</div>
  </div>`;
}

function componentGroup(name, meta) {
  const source = meta?.sourcePath ?? '';
  if (source.includes('/brand/')) return 'Brand';
  if (source.includes('/forms/')) return 'Forms';
  if (source.includes('/display/')) return 'Display';
  if (source.includes('/core/')) return 'Core';
  if (/BookCard|SectionHeader/.test(name)) return 'Brand';
  if (/Input|Textarea|Label|Switch|Checkbox/.test(name)) return 'Forms';
  if (/Alert|Avatar|Progress|StatChip|Tabs/.test(name)) return 'Display';
  return 'Core';
}

function componentDescription(name, language) {
  const pt = {
    BookCard: 'Item editorial de biblioteca: capa, status mono, título serif e autor.',
    SectionHeader: 'Cabeçalho de seção com eyebrow, título serif e hairline de marca.',
    Badge: 'Pílulas e chips de estado. Variantes sem virar blocos grandes de cor.',
    Button: 'Botões caps tracked. CTA preenchido deve continuar raro.',
    Card: 'Superfície base: hairline, raio baixo e hierarquia editorial.',
    CardHeader: 'Área superior do Card. Carrega título e descrição.',
    CardTitle: 'Título serif dentro da família Card.',
    CardDescription: 'Descrição secundária, geralmente serif itálica ou muted.',
    CardContent: 'Área principal de conteúdo do Card.',
    CardFooter: 'Área de ações do Card, separada da leitura principal.',
    Icon: 'Wrapper Iconoir. Use nomes kebab-case do app.',
    Alert: 'Feedback inline com borda e fundo tintados.',
    Avatar: 'Imagem ou iniciais em tamanhos controlados.',
    Progress: 'Linha de progresso fina, com fill de marca.',
    StatChip: 'Par label/valor para métricas e estados compactos.',
    Tabs: 'Tabs editoriais com régua ativa.',
    Checkbox: 'Controle binário com check de marca.',
    Input: 'Campo de texto com foco no token de ring.',
    Label: 'Rótulo de campo no padrão do DS.',
    Switch: 'Toggle com estado ativo em marca.',
    Textarea: 'Campo multilinha com a mesma receita do input.',
  };
  const en = {
    BookCard: 'Editorial library item: cover, mono status, serif title, and author.',
    SectionHeader: 'Section header with eyebrow, serif title, and brand hairline.',
    Badge: 'Pills and status chips without large color blocks.',
    Button: 'Tracked uppercase buttons. Filled CTA stays rare.',
    Card: 'Base surface: hairline, low radius, editorial hierarchy.',
    CardHeader: 'Top area of the Card family. Holds title and description.',
    CardTitle: 'Serif title inside the Card family.',
    CardDescription: 'Secondary description, usually muted or italic serif.',
    CardContent: 'Main content area of the Card.',
    CardFooter: 'Action area of the Card, separated from reading content.',
    Icon: 'Iconoir wrapper. Use app kebab-case names.',
    Alert: 'Inline feedback with tinted border and background.',
    Avatar: 'Image or initials in controlled sizes.',
    Progress: 'Thin progress line with brand fill.',
    StatChip: 'Label/value pair for compact metrics and state.',
    Tabs: 'Editorial tabs with active rule.',
    Checkbox: 'Binary control with brand check.',
    Input: 'Text field with token-driven focus ring.',
    Label: 'Field label using DS recipe.',
    Switch: 'Toggle with brand active state.',
    Textarea: 'Multiline field sharing the input recipe.',
  };
  return (language === 'en' ? en : pt)[name] ?? (language === 'en' ? 'Component exposed by the manifest.' : 'Componente exposto pelo manifesto.');
}

function componentDemo(name, ns, language) {
  const email = language === 'en' ? 'you@example.com' : 'seu@email.com';
  const note = language === 'en' ? 'Write a note...' : 'Escreva uma anotação...';
  const title = language === 'en' ? 'Essential Reading' : 'Leitura essencial';
  const author = language === 'en' ? 'Editorial Team' : 'Curadoria Lendária';

  const demos = {
    BookCard: `<div class="cdp-book-grid"><x-import component-from-global-scope="${ns}.BookCard" title="${title}" author="${author}" category="Biblioteca" status="reading" hint-size="100%,320px"></x-import><x-import component-from-global-scope="${ns}.BookCard" title="IA e Consciência" author="Academia Lendária" category="Trilha" status="read" hint-size="100%,320px"></x-import></div>`,
    SectionHeader: `<x-import component-from-global-scope="${ns}.SectionHeader" eyebrow="${language === 'en' ? 'Library' : 'Biblioteca'}" title="${language === 'en' ? 'Most read this week' : 'Mais lidos da semana'}" hint-size="100%,72px"></x-import>`,
    Badge: `<div class="cdp-row"><x-import component-from-global-scope="${ns}.Badge" variant="brand" hint-size="auto,24px">Curadoria</x-import><x-import component-from-global-scope="${ns}.Badge" variant="success" hint-size="auto,24px">Lido</x-import><x-import component-from-global-scope="${ns}.Badge" variant="warning" hint-size="auto,24px">Em pausa</x-import><x-import component-from-global-scope="${ns}.Badge" variant="info" hint-size="auto,24px">Novo</x-import><x-import component-from-global-scope="${ns}.Badge" variant="destructive" hint-size="auto,24px">Atenção</x-import></div>`,
    Button: `<div class="cdp-row"><x-import component-from-global-scope="${ns}.Button" hint-size="auto,40px">Default</x-import><x-import component-from-global-scope="${ns}.Button" variant="outline" hint-size="auto,40px">Outline</x-import><x-import component-from-global-scope="${ns}.Button" variant="secondary" hint-size="auto,40px">Secondary</x-import><x-import component-from-global-scope="${ns}.Button" variant="ghost" hint-size="auto,40px">Ghost</x-import><x-import component-from-global-scope="${ns}.Button" variant="link" hint-size="auto,32px">link</x-import></div>`,
    Card: `<x-import component-from-global-scope="${ns}.Card" hint-size="100%,180px"><x-import component-from-global-scope="${ns}.CardHeader" hint-size="100%,72px"><x-import component-from-global-scope="${ns}.CardTitle" hint-size="auto,28px">Card</x-import><x-import component-from-global-scope="${ns}.CardDescription" hint-size="auto,24px">${language === 'en' ? 'Card family anatomy.' : 'Anatomia da família Card.'}</x-import></x-import><x-import component-from-global-scope="${ns}.CardContent" hint-size="100%,70px"><p style="margin:0;color:var(--muted-foreground);font-size:var(--font-size-sm);">Header, Title, Description, Content, Footer.</p></x-import></x-import>`,
    CardHeader: `<x-import component-from-global-scope="${ns}.Card" hint-size="100%,120px"><x-import component-from-global-scope="${ns}.CardHeader" hint-size="100%,72px"><x-import component-from-global-scope="${ns}.CardTitle" hint-size="auto,28px">CardHeader</x-import><x-import component-from-global-scope="${ns}.CardDescription" hint-size="auto,24px">Topo da superfície.</x-import></x-import></x-import>`,
    CardTitle: `<x-import component-from-global-scope="${ns}.CardTitle" hint-size="auto,32px">CardTitle serif</x-import>`,
    CardDescription: `<x-import component-from-global-scope="${ns}.CardDescription" hint-size="auto,32px">Descrição secundária do card.</x-import>`,
    CardContent: `<x-import component-from-global-scope="${ns}.CardContent" hint-size="100%,64px"><p style="margin:0;color:var(--muted-foreground);font-size:var(--font-size-sm);">Conteúdo principal com ritmo interno.</p></x-import>`,
    CardFooter: `<x-import component-from-global-scope="${ns}.CardFooter" hint-size="100%,64px"><x-import component-from-global-scope="${ns}.Button" variant="outline" size="sm" hint-size="auto,34px">Ação</x-import></x-import>`,
    Icon: `<div class="cdp-row"><x-import component-from-global-scope="${ns}.Icon" name="book" size="size-8" hint-size="32px,32px"></x-import><x-import component-from-global-scope="${ns}.Icon" name="play-circle" size="size-8" hint-size="32px,32px"></x-import><x-import component-from-global-scope="${ns}.Icon" name="brain" size="size-8" hint-size="32px,32px"></x-import><x-import component-from-global-scope="${ns}.Icon" name="search" size="size-8" hint-size="32px,32px"></x-import></div>`,
    Alert: `<div class="cdp-stack"><x-import component-from-global-scope="${ns}.Alert" variant="success" hint-size="100%,44px">Link de acesso enviado.</x-import><x-import component-from-global-scope="${ns}.Alert" variant="warning" hint-size="100%,44px">Sua assinatura expira em 3 dias.</x-import><x-import component-from-global-scope="${ns}.Alert" variant="info" hint-size="100%,44px">Novo módulo disponível.</x-import></div>`,
    Avatar: `<div class="cdp-row"><x-import component-from-global-scope="${ns}.Avatar" name="Ana Nunes" size="sm" hint-size="32px,32px"></x-import><x-import component-from-global-scope="${ns}.Avatar" name="Bruno Lemos" hint-size="40px,40px"></x-import><x-import component-from-global-scope="${ns}.Avatar" name="Clara Reis" size="lg" hint-size="56px,56px"></x-import><x-import component-from-global-scope="${ns}.Avatar" name="Daniel Torres" size="xl" hint-size="80px,80px"></x-import></div>`,
    Progress: `<div class="cdp-stack"><x-import component-from-global-scope="${ns}.Progress" value="{{ 64 }}" hint-size="100%,8px"></x-import><x-import component-from-global-scope="${ns}.Progress" value="{{ 28 }}" hint-size="100%,8px"></x-import><x-import component-from-global-scope="${ns}.Progress" value="{{ 100 }}" hint-size="100%,8px"></x-import></div>`,
    StatChip: `<div class="cdp-row"><x-import component-from-global-scope="${ns}.StatChip" label="Membros" value="3.847" hint-size="auto,28px"></x-import><x-import component-from-global-scope="${ns}.StatChip" label="Sequência" value="12 dias" tone="primary" hint-size="auto,28px"></x-import><x-import component-from-global-scope="${ns}.StatChip" label="Concluídos" value="48" tone="success" hint-size="auto,28px"></x-import></div>`,
    Tabs: `<div class="cdp-stack"><x-import component-from-global-scope="${ns}.Tabs" items="{{ tabItems }}" value="{{ activeTab }}" on-value-change="{{ setTab }}" hint-size="100%,44px"></x-import><p style="margin:0;color:var(--muted-foreground);font-family:var(--font-serif);font-style:italic;">{{ tabContent }}</p></div>`,
    Checkbox: `<div class="cdp-row"><x-import component-from-global-scope="${ns}.Checkbox" default-checked="{{ true }}" hint-size="18px,18px"></x-import><span>Receber lembrete diário</span></div>`,
    Input: `<x-import component-from-global-scope="${ns}.Input" type="email" placeholder="${email}" hint-size="100%,40px"></x-import>`,
    Label: `<x-import component-from-global-scope="${ns}.Label" hint-size="auto,18px">E-mail</x-import>`,
    Switch: `<div class="cdp-row"><x-import component-from-global-scope="${ns}.Switch" default-checked="{{ true }}" hint-size="44px,24px"></x-import><span>Trilha ativa</span></div>`,
    Textarea: `<x-import component-from-global-scope="${ns}.Textarea" placeholder="${note}" rows="3" hint-size="100%,90px"></x-import>`,
  };

  return demos[name] ?? `<x-import component-from-global-scope="${ns}.${name}" hint-size="100%,60px">${escapeHtml(name)}</x-import>`;
}

function renderComponentCard(name, binding, language) {
  const ns = binding.namespace;
  const meta = (binding.componentMeta ?? []).find((item) => item.name === name);
  return `<article class="cdp-component" id="comp-${slug(name)}">
    <div class="cdp-component-head">
      <div>
        <span class="cdp-kicker">${escapeHtml(componentGroup(name, meta))}</span>
        <h3>${escapeHtml(name)}</h3>
      </div>
      ${meta?.sourcePath ? `<code>${escapeHtml(meta.sourcePath)}</code>` : ''}
    </div>
    <p>${escapeHtml(componentDescription(name, language))}</p>
    <div class="cdp-component-demo">${componentDemo(name, ns, language)}</div>
  </article>`;
}

function renderComponents(binding, language) {
  const groups = new Map();
  for (const name of binding.components ?? []) {
    const meta = (binding.componentMeta ?? []).find((item) => item.name === name);
    const group = componentGroup(name, meta);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(name);
  }

  return [...groups.entries()]
    .map(
      ([group, names]) => `<div class="cdp-component-group">
        <div class="cdp-group-label">${escapeHtml(group)}</div>
        <div class="cdp-component-grid">${names.map((name) => renderComponentCard(name, binding, language)).join('\n')}</div>
      </div>`,
    )
    .join('\n');
}

function renderSpecimens(binding, language) {
  const l = labels(language);
  const cards = binding.cardMeta?.length
    ? binding.cardMeta
    : (binding.cards ?? []).map((name) => ({ name }));
  const starts = binding.startingPoints ?? [];
  const rows = [...cards, ...starts].filter((item) => item.name || item.path);

  if (!rows.length) return `<p class="cdp-note">${l.empty}</p>`;

  return `<div class="cdp-specimen-grid">${rows
    .map(
      (item) => `<article class="cdp-specimen">
        <span class="cdp-kicker">${escapeHtml(item.group ?? item.section ?? l.source)}</span>
        <h3>${escapeHtml(item.name)}</h3>
        ${item.subtitle ? `<p>${escapeHtml(item.subtitle)}</p>` : ''}
        <dl>
          ${item.path ? `<div><dt>path</dt><dd>${escapeHtml(item.path)}</dd></div>` : ''}
          ${item.previewPath ? `<div><dt>preview</dt><dd>${escapeHtml(item.previewPath)}</dd></div>` : ''}
          ${item.viewport ? `<div><dt>viewport</dt><dd>${escapeHtml(item.viewport)}</dd></div>` : ''}
        </dl>
      </article>`,
    )
    .join('\n')}</div>`;
}

function renderSurfaces(voice, language) {
  const l = labels(language);
  const surfaces = voice.surfaces ?? [];
  if (!surfaces.length) return `<p class="cdp-note">${l.empty}</p>`;
  return `<div class="cdp-surface-grid">${surfaces
    .map(
      (surface, index) => `<article class="cdp-surface">
        <span class="cdp-kicker">${String(index + 1).padStart(2, '0')}</span>
        <h3>${escapeHtml(surface)}</h3>
      </article>`,
    )
    .join('\n')}</div>`;
}

function renderPromptList(language) {
  const l = labels(language);
  const lead =
    language === 'en'
      ? 'Copy a prompt only after inspecting the design system above. Replace the bracketed part and keep each deliverable anchored to the tokens and components shown here.'
      : 'Copie um prompt só depois de inspecionar o design system acima. Troque o trecho entre colchetes e mantenha cada entrega ancorada nos tokens e componentes mostrados aqui.';
  return `<p class="cdp-note">${escapeHtml(lead)}</p>
    <div class="cdp-prompt-list">
      <sc-for list="{{ prompts }}" as="item" hint-placeholder-count="4">
        <article class="cdp-prompt">
          <span class="cdp-kicker">{{ item.tag }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <pre data-lang="prompt"><button type="button" class="md-copy {{ item.okClass }}" onClick="{{ item.onCopy }}"><i class="iconoir-copy" aria-hidden="true"></i>{{ item.copyLabel }}</button><code>{{ item.prompt }}</code></pre>
        </article>
      </sc-for>
    </div>`;
}

function buildNavRail(language, binding) {
  const l = labels(language);
  const lines = [
    `<div class="cdp-nav-group">${escapeHtml(l.foundationsEyebrow)}</div>`,
    `<a href="#fundamentos">${escapeHtml(l.foundationsTitle)}</a>`,
    `<div class="cdp-nav-group">${escapeHtml(l.componentEyebrow)}</div>`,
    `<a href="#componentes">${escapeHtml(l.componentTitle)}</a>`,
  ];

  for (const name of binding.components ?? []) {
    lines.push(`<a class="cdp-nav-comp" href="#comp-${slug(name)}">${escapeHtml(name)}</a>`);
  }

  lines.push(
    `<div class="cdp-nav-group">${escapeHtml(l.specimenEyebrow)}</div>`,
    `<a href="#specimens">${escapeHtml(l.specimenTitle)}</a>`,
    `<div class="cdp-nav-group">${escapeHtml(l.harnessEyebrow)}</div>`,
    `<a href="#harness">${escapeHtml(l.harnessTitle)}</a>`,
  );
  return lines.join('\n      ');
}

function renderDesignSystemHtml(language, binding, voice) {
  const l = labels(language);
  const tokenCount = binding.tokens?.length ?? 0;
  const fontCount = binding.brandFonts?.length ?? 0;
  const cardCount = binding.cardMeta?.length ?? binding.cards?.length ?? 0;
  const themeLabel = voice.themeLabel ?? (voice.themeDefault === 'light' ? 'DIA - LIGHT' : 'NOITE - DARK');
  const logo = voice.logoPath
    ? `<img src="${escapeHtml(voice.logoPath)}" alt="" style="width:42px;height:42px;object-fit:contain;">`
    : '';

  return `<div class="cdp-ds ${voice.themeDefault === 'light' ? 'light' : ''}">
    <aside class="cdp-rail" aria-label="Design system index">
      ${buildNavRail(language, binding)}
    </aside>
    <main class="cdp-main">
      <header class="cdp-hero">
        <div class="cdp-brandline">${logo}<span>${escapeHtml(binding.name)}</span></div>
        <p class="cdp-kicker">${escapeHtml(l.eyebrow)}</p>
        <h1>${escapeHtml(l.heroTitle)}</h1>
        <p>${escapeHtml(l.heroLead)}</p>
        <div class="cdp-metrics">
          ${renderMetric(l.components, binding.componentCount ?? binding.components?.length ?? 0)}
          ${renderMetric(l.tokens, tokenCount)}
          ${renderMetric(l.fonts, fontCount)}
          ${renderMetric(l.cards, cardCount)}
          ${renderMetric(l.theme, themeLabel)}
        </div>
      </header>

      <section class="cdp-section" id="fundamentos">
        <x-import component-from-global-scope="${binding.namespace}.SectionHeader" eyebrow="${escapeHtml(l.foundationsEyebrow)}" title="${escapeHtml(l.foundationsTitle)}" hint-size="100%,72px"></x-import>
        <div class="cdp-two">
          <article class="cdp-panel">
            <h3>${escapeHtml(l.colors)}</h3>
            ${renderColorTokens(binding, language)}
          </article>
          <article class="cdp-panel">
            <h3>${escapeHtml(l.typography)}</h3>
            ${renderTypography(binding, language)}
          </article>
        </div>
        <div class="cdp-three">
          ${renderSimpleTokenList(binding, l.spacing, (token) => token.kind === 'spacing', 14)}
          ${renderSimpleTokenList(binding, l.radius, (token) => token.kind === 'radius', 10)}
          ${renderSimpleTokenList(binding, l.motion, (token) => token.definedIn?.includes('effects') || /duration|ease|transition/.test(token.name ?? ''), 12)}
        </div>
        <article class="cdp-panel">
          <h3>${escapeHtml(l.surfaces)}</h3>
          ${renderSurfaces(voice, language)}
        </article>
      </section>

      <section class="cdp-section" id="componentes">
        <x-import component-from-global-scope="${binding.namespace}.SectionHeader" eyebrow="${escapeHtml(l.componentEyebrow)}" title="${escapeHtml(l.componentTitle)}" hint-size="100%,72px"></x-import>
        ${renderComponents(binding, language)}
      </section>

      <section class="cdp-section" id="specimens">
        <x-import component-from-global-scope="${binding.namespace}.SectionHeader" eyebrow="${escapeHtml(l.specimenEyebrow)}" title="${escapeHtml(l.specimenTitle)}" hint-size="100%,72px"></x-import>
        ${renderSpecimens(binding, language)}
      </section>

      <section class="cdp-section" id="harness">
        <x-import component-from-global-scope="${binding.namespace}.SectionHeader" eyebrow="${escapeHtml(l.harnessEyebrow)}" title="${escapeHtml(l.harnessTitle)}" hint-size="100%,72px"></x-import>
        <p class="cdp-note">${escapeHtml(l.introFooter)}</p>
        ${renderPromptList(language)}
      </section>
    </main>
  </div>`;
}

function buildPromptDefs(language, binding) {
  const ns = binding.namespace;
  const name = binding.name;
  const introFile = introDcFilename(language);

  if (language === 'en') {
    return [
      {
        key: 'novo',
        tag: '01 - NEW DELIVERABLE',
        title: 'Start a new screen, deck, or doc',
        desc: 'Create a fresh Name.dc.html for each deliverable. Copy the helmet block from this intro page.',
        prompt: `Create a new [Name].dc.html for [what you need]. Load the ${name} bundle in <helmet> (copy the block from ${introFile}) and compose ${ns} components - do not recreate raw HTML imitating them. Anchor every decision in DESIGN.md and tokens. Ship only the main view first; I will refine before asking for more. Report which skills were applied.`,
      },
      {
        key: 'brief',
        tag: '02 - FRAME THE BRIEF',
        title: 'Define the brief before designing',
        desc: 'When audience, brand, or surface is still unclear. Prevents invented context.',
        prompt:
          'Run brief-framing before generating UI. Classify the surface as brand, product, or system. List audience, primary job-to-be-done, references to follow or avoid, and blocking gaps. Ask only what materially changes the design.',
      },
      {
        key: 'orig',
        tag: '03 - ORIGINALITY',
        title: 'Catch cliches before polish',
        desc: 'Flags generic template reflexes and category cliches before they become habit.',
        prompt:
          'Run visual-originality-audit on this direction. Point out generic template reflexes, category cliches, and second-order cliches. Recommend targeted changes that make the design more authored without hurting usability.',
      },
      {
        key: 'ds',
        tag: '04 - DS ANTI-DRIFT',
        title: `Enforce ${name}`,
        desc: 'Guardrail: everything comes from bound tokens and namespace components.',
        prompt: `Use the bound design system everywhere. Before generating, read BOUND_DS.json and list which tokens (globalCssPaths) and which ${ns} components you will apply on this screen per DESIGN.md. Load the bundle and compose components - never restyle raw HTML to mimic them. If something is missing, ask instead of inventing.`,
      },
      {
        key: 'ui',
        tag: '05 - UI AUDIT',
        title: 'Review hierarchy and composition',
        desc: 'UI critique without redesign: what works, localized issues, token-bound fixes.',
        prompt:
          'Run ui-audit on the previous output. Point out what works, specific problems with location, and fixes tied to tokens. Do not redesign the screen.',
      },
      {
        key: 'polish',
        tag: '06 - POLISH',
        title: 'Refine without changing structure',
        desc: 'Final quality pass: microcopy, alignment, hierarchy, subtle motion.',
        prompt:
          'Run polish-phase on the approved screen. Refine microcopy, alignment, button hierarchy, and add subtle motion using motion tokens. Keep structure identical and list exactly what changed.',
      },
      {
        key: 'texto',
        tag: '07 - TEXT INTEGRITY',
        title: 'Audit copy voice',
        desc: 'Product voice check: generic language, hype, banned typography.',
        prompt:
          'Run text-integrity-audit on this text. Point out generic language, weak voice, hype, repeated sentence shapes, recap reflex, and banned typography. Return revised text and list fixes.',
      },
      {
        key: 'mobile',
        tag: '08 - MOBILE REVIEW',
        title: 'Test breakpoints',
        desc: 'Responsive behavior 320px-1440px: overflow, touch targets, stacking.',
        prompt:
          'Run mobile-first-audit at 320px, 375px, 430px, 768px, 1024px, and 1440px. Report overflow, touch targets, and stacking issues, then say approved or list blockers.',
      },
      {
        key: 'a11y',
        tag: '09 - ACCESSIBILITY',
        title: 'Cover contrast, focus, keyboard',
        desc: 'Accessibility checklist with explicit non-certification disclaimer.',
        prompt:
          'Run accessibility-audit on this screen. Cover contrast, semantics, keyboard, focus, forms, motion, and screen-reader clarity. List blockers with fixes and include the non-WCAG-certification disclaimer.',
      },
      {
        key: 'fino',
        tag: '10 - TARGETED TWEAK',
        title: 'Change one thing only',
        desc: 'Single adjustment without regenerating the whole screen (common drift path).',
        prompt:
          'Targeted tweaks only, do not rebuild the screen: [e.g. increase CTA contrast, tighten hero spacing, change title weight]. Keep everything else identical.',
      },
      {
        key: 'codigo',
        tag: '11 - CODE REVIEW',
        title: 'Audit implementation (outside canvas)',
        desc: 'When Tailwind/code exists: token violations and arbitrary values with line numbers.',
        prompt:
          'Here is the implementation. Run design-system-guardian, then tailwind-audit, mobile-first-audit, and accessibility-audit. List token violations and arbitrary values with line numbers and corrected classes. Do not rewrite the entire file.',
      },
      {
        key: 'final',
        tag: '12 - FINAL APPROVAL',
        title: 'Mark a screen as final',
        desc: 'Exit gate: guardian, polish, mobile, and accessibility before declaring done.',
        prompt:
          'I want to mark this screen as final. Apply the final approval routing: design-system-guardian, polish-phase, mobile-first-audit, accessibility-audit. Do not declare final until mobile and accessibility have run. Report the outcome.',
      },
    ];
  }

  return [
      {
        key: 'novo',
        tag: '01 - NOVO ENTREGAVEL',
        title: 'Começar uma nova tela, deck ou doc',
        desc: 'Crie um Nome.dc.html novo para cada entrega. Copie o bloco helmet desta pagina.',
        prompt: `Crie um novo [Nome].dc.html para [o que você precisa]. Carregue o bundle do ${name} no <helmet> (copie o bloco de ${introFile}) e componha os componentes do namespace ${ns} - não recrie HTML cru imitando-os. Ancore cada decisão no DESIGN.md e nos tokens. Gere só a visão principal; eu refino antes de pedir mais. Reporte quais skills foram aplicadas.`,
      },
      {
        key: 'brief',
        tag: '02 - ENQUADRAR O BRIEF',
        title: 'Definir o brief antes de desenhar',
        desc: 'Quando público, marca ou superfície ainda não estão claros. Evita inventar contexto.',
        prompt:
          'Rode brief-framing antes de gerar UI. Classifique a superfície como brand, product ou system. Liste o público, o trabalho-a-ser-feito principal, referências a seguir ou evitar, e as lacunas que travam a decisão. Pergunte só o que muda materialmente o design.',
      },
      {
        key: 'orig',
        tag: '03 - ORIGINALIDADE',
        title: 'Checar clichês antes de polir',
        desc: 'Pega reflexos genéricos de template e clichês de categoria antes que virem padrão.',
        prompt:
          'Rode visual-originality-audit nesta direção. Aponte reflexos genéricos de template, clichês de categoria e clichês de segunda ordem. Recomende mudanças pontuais que tornem o design mais autoral sem prejudicar a usabilidade.',
      },
      {
        key: 'ds',
        tag: '04 - ANTI-DRIFT DO DS',
        title: `Forçar o uso do ${name}`,
        desc: 'Trava contra deriva: tudo sai dos tokens e dos componentes do namespace.',
        prompt: `Use o design system bound em tudo. Antes de gerar, leia BOUND_DS.json e liste quais tokens (globalCssPaths) e quais componentes do namespace ${ns} você vai aplicar nesta tela, conforme o DESIGN.md. Carregue o bundle e componha os componentes - nunca restilize HTML cru para imitá-los. Se algo não estiver coberto, pergunte em vez de inventar.`,
      },
      {
        key: 'ui',
        tag: '05 - AUDITORIA DE UI',
        title: 'Revisar hierarquia e composição',
        desc: 'Crítica de UI sem redesenhar: o que funciona, problemas com localização, correções nos tokens.',
        prompt:
        'Rode ui-audit na saída anterior. Aponte o que funciona, os problemas específicos com sua localização, e correções amarradas aos tokens. Não redesenhe a tela.',
      },
      {
        key: 'polish',
        tag: '06 - POLIMENTO',
        title: 'Refinar sem mudar a estrutura',
        desc: 'Passe final de qualidade: microcopy, alinhamento, hierarquia e motion sutil.',
        prompt:
        'Rode polish-phase na tela aprovada. Refine microcopy, alinhamento, hierarquia de botões e adicione motion sutil usando os tokens de movimento. Mantenha a estrutura idêntica e liste exatamente o que mudou.',
      },
      {
        key: 'texto',
        tag: '07 - INTEGRIDADE DE TEXTO',
        title: 'Auditar a copy',
        desc: 'Voz de produto: caça linguagem genérica, exagero e tipografia proibida.',
        prompt:
        'Rode text-integrity-audit neste texto. Aponte linguagem genérica, voz fraca, exagero, formas de frase repetidas, reflexo de recapitulação e tipografia proibida. Devolva o texto revisado e liste os problemas corrigidos.',
      },
      {
        key: 'mobile',
        tag: '08 - REVISÃO MOBILE',
        title: 'Testar nos breakpoints',
        desc: 'Comportamento responsivo de 320px a 1440px: overflow, alvos de toque, empilhamento.',
      prompt:
        'Rode mobile-first-audit em 320px, 375px, 430px, 768px, 1024px e 1440px. Reporte overflow, alvos de toque e problemas de empilhamento, depois diga aprovado ou os bloqueios.',
    },
      {
        key: 'a11y',
        tag: '09 - ACESSIBILIDADE',
        title: 'Cobrir contraste, foco e teclado',
        desc: 'Checagem de acessibilidade com aviso explícito de não-certificação WCAG.',
        prompt:
          'Rode accessibility-audit nesta tela. Cubra contraste, semântica, teclado, foco, formulários, movimento e clareza para leitor de tela. Liste bloqueios com correções e inclua o aviso de não-certificação WCAG.',
      },
      {
        key: 'fino',
        tag: '10 - AJUSTE FINO',
        title: 'Mexer em uma coisa só',
        desc: 'Para um único retoque - sem regenerar a tela inteira (caminho que mais causa deriva).',
        prompt:
          'Apenas ajustes pontuais, não reconstrua a tela: [ex.: aumentar o contraste do CTA, apertar o espaçamento do hero, trocar o peso do título]. Mantenha todo o resto idêntico.',
      },
      {
        key: 'codigo',
        tag: '11 - REVISÃO DE CÓDIGO',
        title: 'Auditar a implementação (fora do canvas)',
        desc: 'Quando já existe código/Tailwind: violações de token e valores arbitrários com linha.',
        prompt:
          'Aqui está a implementação. Rode design-system-guardian, depois tailwind-audit, mobile-first-audit e accessibility-audit. Liste violações de token e valores arbitrários com números de linha e as classes corrigidas. Não reescreva o arquivo inteiro.',
      },
      {
        key: 'final',
        tag: '12 - APROVAÇÃO FINAL',
        title: 'Marcar uma tela como final',
        desc: 'Portão de saída: roda guardian, polimento, mobile e acessibilidade antes de declarar final.',
        prompt:
          'Quero marcar esta tela como final. Aplique o roteamento de aprovação final: design-system-guardian, polish-phase, mobile-first-audit, accessibility-audit. Não declare final até mobile e acessibilidade terem rodado. Reporte o resultado.',
      },
  ];
}

function buildIntroScript(language, binding, voice) {
  const defs = buildPromptDefs(language, binding);
  const tabContentMap =
    language === 'en'
      ? {
          componentes: `${binding.componentCount} components ready in the namespace - all from the bundle.`,
          tokens: 'Colors, typography, spacing, radii, and motion as var(--*) - single source in the bound DS.',
          padroes: 'Layout patterns live in DESIGN.md section 6 - compose from bound components.',
        }
      : {
          componentes: `${binding.componentCount} componentes prontos no namespace - todos saídos do bundle.`,
          tokens: 'Cores, tipografia, espaçamento, raios e motion como var(--*) - fonte única no DS bound.',
          padroes: 'Padrões de layout vivem no DESIGN.md seção 6 - componha a partir dos componentes bound.',
        };

  const tabLabels =
    language === 'en'
      ? { componentes: 'Components', tokens: 'Tokens', padroes: 'Patterns' }
      : { componentes: 'Componentes', tokens: 'Tokens', padroes: 'Padrões' };

  const copiedLabel = language === 'en' ? 'Copied' : 'Copiado';
  const copyLabel = language === 'en' ? 'Copy' : 'Copiar';

  const defsJson = defs
    .map((d) => {
      return `      { key: '${d.key}', tag: '${escapeForScript(d.tag)}', title: '${escapeForScript(d.title)}',
        desc: '${escapeForScript(d.desc)}',
        prompt: '${escapeForScript(d.prompt)}' }`;
    })
    .join(',\n');

  return `<script type="text/x-dc" data-dc-script data-props="{&quot;$preview&quot;:{&quot;width&quot;:1040,&quot;height&quot;:1100}}">
class Component extends DCLogic {
  state = { activeTab: 'componentes', copiedKey: null };

  componentWillUnmount() { clearTimeout(this._t); }

  _fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.left = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {}
  }

  _copy(key, text) {
    let async = false;
    try {
      const p = navigator.clipboard && navigator.clipboard.writeText(text);
      if (p && p.then) {
        async = true;
        p.catch(() => this._fallbackCopy(text));
      }
    } catch (e) {}
    if (!async) this._fallbackCopy(text);
    clearTimeout(this._t);
    this.setState({ copiedKey: key });
    this._t = setTimeout(() => this.setState({ copiedKey: null }), 1600);
  }

  renderVals() {
    const tabContentMap = ${JSON.stringify(tabContentMap)};

    const defs = [
${defsJson}
    ];

    const prompts = defs.map(d => ({
      ...d,
      copyLabel: this.state.copiedKey === d.key ? '${copiedLabel}' : '${copyLabel}',
      okClass: this.state.copiedKey === d.key ? 'ok' : '',
      onCopy: () => this._copy(d.key, d.prompt),
    }));

    return {
      tabItems: [
        { value: 'componentes', label: '${tabLabels.componentes}' },
        { value: 'tokens', label: '${tabLabels.tokens}' },
        { value: 'padroes', label: '${tabLabels.padroes}' },
      ],
      activeTab: this.state.activeTab,
      setTab: (v) => this.setState({ activeTab: v }),
      tabContent: tabContentMap[this.state.activeTab],
      prompts,
      themeClass: this.props.theme === 'light' ? 'light' : '',
    };
  }
}
</script>`;
}

export function applyIntroCopy(text, language, binding, voice = binding.voice ?? {}) {
  const copy = introCopy(language, binding, voice);
  let out = text;
  for (const [key, value] of Object.entries(copy)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

function renderPromptsBlock(language) {
  const l = labels(language);
  const lead =
    language === 'en'
      ? 'Copy a prompt only after inspecting the design system above. Replace <code style="font-family:var(--font-mono);font-size:0.85em;color:var(--foreground);">[brackets]</code> and keep every deliverable anchored to the tokens and components shown here.'
      : 'Copie um prompt só depois de inspecionar o design system acima. Troque o que está entre <code style="font-family:var(--font-mono);font-size:0.85em;color:var(--foreground);">[colchetes]</code> e mantenha cada entrega ancorada nos tokens e componentes mostrados aqui.';

  return `<p class="cdp-note">${lead}</p>
        <div class="cdp-prompts">
          <sc-for list="{{ prompts }}" as="item" hint-placeholder-count="6">
            <div class="cdp-prompt-item">
              <div class="cdp-prompt-head">
                <span style="flex-shrink:0;width:44px;height:44px;display:grid;place-items:center;border:1px solid var(--hairline-strong);border-radius:var(--radius-base);"><i class="iconoir-sparks" aria-hidden="true" style="font-size:20px;color:var(--primary);"></i></span>
                <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;">
                  <span class="cdp-kicker">{{ item.tag }}</span>
                  <p class="cdp-prompt-title">{{ item.title }}</p>
                  <p class="cdp-prompt-desc">{{ item.desc }}</p>
                </div>
              </div>
              <div class="al-md" style="--reading-size:15px;">
                <pre data-lang="prompt" style="margin:0;"><button type="button" class="md-copy {{ item.okClass }}" onClick="{{ item.onCopy }}" style="min-height:32px;"><i class="iconoir-copy" aria-hidden="true" style="font-size:12px;"></i>{{ item.copyLabel }}</button><code style="white-space:pre-wrap;word-break:break-word;">{{ item.prompt }}</code></pre>
              </div>
            </div>
          </sc-for>
        </div>`;
}

export function injectPromptsBlock(text) {
  const block = renderPromptsBlock('pt-BR');
  if (text.includes('<!-- CDP:PROMPTS -->')) {
    return text.replace('<!-- CDP:PROMPTS -->', block);
  }
  return text;
}

export function injectIntroScript(text, language, binding, voice) {
  const script = buildIntroScript(language, binding, voice);
  if (text.includes('<!-- CDP:INTRO-SCRIPT -->')) {
    return text.replace(/<!-- CDP:INTRO-SCRIPT -->[\s\S]*?<!-- \/CDP:INTRO-SCRIPT -->/, script);
  }
  return text.replace(/<script type="text\/x-dc"[\s\S]*?<\/script>\s*(?=<\/body>)/, `${script}\n`);
}

export function removeLegacyDcFiles(cwd = process.cwd()) {
  const removed = [];
  for (const name of [...LEGACY_DC_FILES, ...listKnownIntroFiles()]) {
    const abs = path.join(cwd, name);
    if (fs.existsSync(abs)) {
      fs.rmSync(abs, { force: true });
      removed.push(name);
    }
  }
  return removed;
}

/**
 * Materialize the single intro DC from template + binding + voice.
 * @returns {{ filename: string, removed: string[] }}
 */
export function materializeIntroDc({ binding, voice, cwd = process.cwd(), patchFn }) {
  const language = voice.language || detectDocLanguage(cwd, { readmePath: binding.readme });
  const filename = introDcFilename(language);
  const templatePath = path.join(cwd, INTRO_TEMPLATE);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing intro template: ${INTRO_TEMPLATE}`);
  }

  const enrichedBinding = enrichBindingFromManifest(binding, cwd, voice);

  let content = fs.readFileSync(templatePath, 'utf8');
  content = applyIntroCopy(content, language, enrichedBinding, voice);
  content = injectPromptsBlock(content);
  content = injectIntroScript(content, language, enrichedBinding, voice);
  if (typeof patchFn === 'function') {
    content = patchFn(content);
  }
  content = content.replace(
    /value="NOITE · DARK"/g,
    `value="${voice.themeLabel ?? (language === 'en' ? 'NIGHT - DARK' : 'NOITE - DARK')}"`,
  );

  const removed = removeLegacyDcFiles(cwd);
  const outPath = path.join(cwd, filename);
  fs.writeFileSync(outPath, content);
  writeShowcaseBrief({ ...enrichedBinding, introDc: filename, showcaseAssembled: false }, voice, cwd);

  return { filename, language, removed, showcasePending: true };
}

export { showcaseNeedsAssembly };

export function listRootIntroDcFiles(cwd = process.cwd()) {
  return listKnownIntroFiles().filter((name) => fs.existsSync(path.join(cwd, name)));
}

export function introNeedsMaterialize(cwd = process.cwd(), cachedBinding = null, voice = null) {
  const language =
    voice?.language ||
    cachedBinding?.docLanguage ||
    detectDocLanguage(cwd, { readmePath: cachedBinding?.readme });
  const expected = introDcFilename(language);
  const rootIntros = listRootIntroDcFiles(cwd);
  if (!rootIntros.length) return true;
  if (!rootIntros.includes(expected)) return true;
  if (LEGACY_DC_FILES.some((f) => fs.existsSync(path.join(cwd, f)))) return true;
  const content = read(cwd, expected);
  if (content.includes('{{DS_HELMET_BLOCK}}') || content.includes('{{BOUND_DS_')) return true;
  if (content.includes('{{INTRO_')) return true;
  if (content.includes('{{SHOWCASE_')) return true;
  if (!content.includes('class="cdp-ds"')) return true;
  if (content.includes('<!-- CDP:SHOWCASE:PENDING -->')) return false;
  if (!content.includes('data-cdp-showcase="assembled"')) return true;
  return false;
}
