# 🧭 HANDOFF — Contexto Completo do Projeto (Blog Casa Inteligente / Afiliados Mercado Livre)

> **Para que serve este arquivo:** é o **documento-mestre** do projeto. Cole/anexe ele num **novo chat**
> (ou entregue ao Cowork) para continuar de onde paramos, sem perder contexto. Tem tudo: estratégia,
> estado atual, dados, banco de conteúdo, a lição dos links de afiliado, o **gap de design/layout** e
> como **ver/verificar** o site e a Hostinger.
>
> **Data:** 26/06/2026 · **Repositório:** `ahebeler1974/claude-design-premium` · **Branch:** `claude/mercado-livre-affiliate-blog-vdkgb1` · **PR:** #3
> **Pasta do projeto no repo:** `blog-casa-inteligente/` (cópia local do usuário em `ORGANIZA\blog-casa-inteligente`)

---

## 1. O que é o projeto (visão geral)

Blog de **afiliados do Mercado Livre**, nicho **Casa Inteligente / Automação Residencial**.
- **Tráfego 100% de busca** (SEO + AEO + GEO). Sem redes sociais.
- **Fundo de funil:** atrair quem **já decidiu comprar** e só pesquisa a melhor opção (ex.: "melhor X até R$ Y").
- **3 tipos de artigo:** T1 Review (produto único) · T2 Comparativo (lista) · T3 Hype/Promoção-isca.
- **Monetização:** links de afiliado ML + venda indireta (cookie de 30 dias).
- **Tom:** brutalmente honesto (prós e contras reais) — gera confiança e ranqueia.

---

## 2. Estado atual — SETUP CONCLUÍDO ✅

| Item | Valor / Estado |
|---|---|
| Hospedagem | Hostinger, plano Business (expira 2027-06-26) |
| Domínio | **ahebeler.shop** (propagando; status "Conectando") |
| Domínio temporário | `darkgrey-seal-556066.hostingersite.com` |
| Painel WordPress | `ahebeler.shop/wp-admin` |
| Login admin | `ahebeler@gmail.com` (senha definida na instalação — **guardada pelo usuário, não está aqui**) |
| Idioma | pt-BR |
| Título do site | **Guia Casa Inteligente** |
| Slogan | "O guia pra escolher o produto certo pra sua casa" |
| Tema | **GeneratePress** (leve) |
| Plugins | **Rank Math SEO** + **LiteSpeed Cache** (ativos) |
| Permalinks | "Nome do post" (`/%postname%/`) ✅ |
| Categorias | 6 criadas (ver §4) ✅ |
| Menu | Início + 6 categorias ✅ |
| **Afiliado Mercado Livre** | **APROVADO** · etiqueta **`alexandrehebeler`** · gera links em Ferramentas → Gerador de links |

**Pendente:** publicar as páginas e os artigos (0 publicados até agora) + design/identidade visual (ver §6).

---

## 3. Banco de conteúdo (já pronto no repo, pasta `blog-casa-inteligente/`)

- **20 artigos** quase-prontos em `artigos/` (01–20): produtos reais pesquisados, honestos, auditados,
  com links internos em silo e o link de afiliado como campo `[GERAR LINK DE AFILIADO: ...]`.
  - Todos passaram em auditoria cética (honestidade, sem preço inventado, links internos, campos de afiliado). Sem issues de alta severidade.
- **4 páginas institucionais** em `paginas/`: Sobre, Aviso de Afiliados, Política de Privacidade (LGPD), Contato.
- **Manuais e apoio:**
  - `PUBLICAR.md` — manual turnkey de publicação (regra dos links, Fase 0 de geração de links, ordem por silos, tabela de produtos, checklist).
  - `00-PLANO-COWORK.md` — plano de cadastro/setup (já executado).
  - `RELATORIO-EXECUCAO-SETUP.md` — o que foi feito no setup.
  - `CALENDARIO-EDITORIAL.md` — 20 artigos com arquivo + ideias de Lote 3 (21–30).
  - `ESTRUTURA-BLOG.md` — categorias, menu, links internos, configs WP.
  - `SEO-CHECKLIST.md` — config Rank Math + checklist por artigo + como colocar links de afiliado.
  - `README.md` — índice de tudo.

---

## 4. Estrutura do site (categorias e silos)

**Categorias (slug):** Iluminação Inteligente (`iluminacao-inteligente`) · Segurança e Câmeras
(`seguranca-e-cameras`) · Robôs e Limpeza (`robos-e-limpeza`) · Assistentes e Controle
(`assistentes-e-controle`) · Guias e Comparativos (`guias-e-comparativos`) · Ofertas e Novidades (`ofertas-e-novidades`).

**Silos (publicar review + comparativo juntos):** 01↔02 (Iluminação) · 04↔07 (Robôs) · 05↔10↔03 (Segurança) · 09↔08↔06 (Assistentes/Ofertas). Lote 2 (11–20) entra nos mesmos silos por categoria.

---

## 5. ⚠️ Lição crítica dos links de afiliado (não repetir o erro)

No teste, o link gerado (`meli.la/24dPT2v`) apontava para a **vitrine/página social** do afiliado
(`mercadolivre.com.br/social/alexandrehebeler`), **não para o produto**.
- ✅ A etiqueta `alexandrehebeler` (`matt_word`) **rastreia a comissão** — afiliação funciona.
- ❌ Mas a vitrine joga o leitor numa **lista** → converte menos.
- **REGRA DE OURO:** gerar **sempre o link do PRODUTO** (Gerador de links → colar a **URL do anúncio**).
  Nunca o link da vitrine `/social/`. (Já está reforçado em `PUBLICAR.md` e `SEO-CHECKLIST.md`.)

**Comissões (afiliados ML, variam — o % exato aparece no painel ao gerar o link):**
Casa/Móveis/Decoração ~12–14% · Eletrônicos/Áudio/Vídeo ~9–11% · Informática ~4% (direta)/2% (indireta).
Nossos produtos (lâmpada, câmera, robô, fechadura) caem em Casa/Eletrônicos → ~9–14%. Echo Dot/assistentes pagam menos.
**Cookie de 30 dias:** quem clica e compra qualquer coisa no ML em 30 dias gera comissão (último clique).

---

## 6. 🎨 O GAP DE DESIGN / LAYOUT (o "está amador") — PRIORIDADE

**Diagnóstico honesto:** o plano otimizou velocidade + SEO + conteúdo, mas **nunca incluiu design de
home, identidade visual ou layout**. Por isso o site hoje provavelmente parece amador:

- Sem **logo/identidade** (nome em fonte padrão).
- **Home = lista de posts crua** (cara de WordPress padrão).
- **Sem imagens destacadas** nos posts.
- **Cores/tipografia padrão** do tema.
- **Sem hero** explicando o que é o site e por que confiar.

### O que fazer pra ficar profissional (GeneratePress, sem perder velocidade)

1. **Identidade visual** (o que mais muda a percepção):
   - **Logo/wordmark** simples + **favicon**.
   - **Paleta sugerida** (tech/casa inteligente, confiável e moderna):
     - Primária (azul-petróleo/tech): `#0E7C86` ou `#1565C0`
     - Escuro/base de texto: `#0F172A` · Fundo: `#FFFFFF` / seções `#F5F7FA`
     - Destaque/CTA (botões de "ver no Mercado Livre"): `#FFB300` (amarelo ML) ou `#16A34A` (verde "comprar")
   - **Fontes:** título **Inter** ou **Poppins** (semibold) · corpo **Inter**/**Source Sans** (legível).
2. **Home estática** (NÃO a lista de posts):
   - **Hero** curto: título de valor ("Análises honestas pra escolher o produto certo de casa inteligente") + subtítulo + busca.
   - Blocos das **6 categorias** (com ícone).
   - **Últimos reviews/comparativos** em cards com imagem.
   - Faixa de confiança ("Por que confiar: testamos specs, somos transparentes sobre afiliados").
3. **Imagem destacada em todo post** (a do anúncio ou banco grátis) com alt = keyword.
4. **Header limpo:** logo à esquerda, menu à direita, busca.
5. **Atalho:** GeneratePress tem **biblioteca de starter sites** (grátis) — aplicar um modelo de blog/tech e trocar cores/logo já sobe muito o nível. Plugin opcional: **GenerateBlocks** (leve) para montar a home.
6. **Cards de produto/box de afiliado:** uma "caixa" padronizada (nome, prós, preço "ver no ML", botão) deixa os reviews com cara de site de review profissional. Pode usar blocos nativos ou plugin leve (ex.: "AAWP-like" não existe pra ML, então montar com GenerateBlocks).

> **Importante:** nada disso conflita com SEO/velocidade se mantiver GeneratePress + poucos plugins.
> O objetivo é **profissional e rápido**, não pesado.

---

## 7. 👁️ Como VER/VERIFICAR o site e a Hostinger (honesto)

**Limitação encontrada:** o ambiente de chat atual **bloqueia a saída de rede** para `ahebeler.shop`
(o proxy nega a conexão — erro 403 na política de rede). Por isso o assistente **não conseguiu abrir
nem tirar print do site** sozinho.

**Formas reais de inspecionar (em ordem de praticidade):**
1. **Cowork (assistente de tela)** — é o caminho mais confiável: ele **já enxerga sua tela**. Abra o
   site/`wp-admin` e peça pra ele descrever/avaliar o layout e aplicar mudanças. Não depende de rede do chat.
2. **Subir screenshots no chat** — tire prints da **home** e de **um post** e anexe; o assistente
   avalia o layout em cima da imagem.
3. **Novo chat com política de rede liberada** — ao criar um novo ambiente Claude Code, escolha uma
   **política de rede que permita saída para a web** (docs: code.claude.com/docs/en/claude-code-on-the-web).
   Aí `WebFetch`/browser conseguem abrir `ahebeler.shop`.
4. **MCP de navegador (Playwright/Puppeteer)** — se disponível e com rede liberada, permite navegar e
   screenshotar. Há Chromium instalado no ambiente, mas **falta o módulo `playwright`** e a **rede está
   bloqueada** — então não funcionou aqui.
5. **Hostinger** — não há um MCP oficial padrão da Hostinger; o gerenciamento é via **hPanel** (use o
   Cowork na tela) ou via API/REST do WordPress (precisa de rede + credenciais). Para verificar/ajustar
   tema, plugins e páginas, o caminho prático é **Cowork no hPanel/wp-admin**.

> Resumo: para **ver o site agora**, use o **Cowork** (tela) ou **suba prints**. Para automação por
> ferramenta, abra o novo chat com **rede liberada**.

---

## 8. ✅ Próximos passos (TODO priorizado)

1. **Design/identidade (resolve o "amador") — PRIORIDADE:**
   - Definir logo, favicon, paleta e fontes (ver §6).
   - Montar **home estática** com hero + categorias + últimos posts (GeneratePress + starter/GenerateBlocks).
   - Padronizar **caixa de produto/afiliado** nos reviews.
2. **Publicar (ver `PUBLICAR.md`):**
   - Páginas institucionais → rodapé com Aviso de Afiliados + Privacidade.
   - Gerar os links de **PRODUTO** (não vitrine) e publicar por silos: Onda 1 (01+02) → Robôs (04+07) → Segurança (05+10+03) → Assistentes (09+08+06) → Lote 2 (11–20).
   - Imagem destacada + Rank Math 80+ em cada post.
3. **Pós-propagação do domínio:** reconectar o Rank Math (aviso de URL alterado) e conectar o **Google Search Console** + enviar sitemap.
4. **Escala:** Lote 3 (artigos 21–30) já está como ideias no `CALENDARIO-EDITORIAL.md`.

---

## 9. 📋 PROMPT pronto pra colar num NOVO CHAT

```
Estou tocando um blog de afiliados do Mercado Livre, nicho Casa Inteligente, tráfego 100% de busca (SEO/AEO/GEO), fundo de funil. O contexto completo está no arquivo HANDOFF-CONTEXTO-COMPLETO.md (te envio/colo junto).

Estado: setup pronto (WordPress em ahebeler.shop, tema GeneratePress, Rank Math, LiteSpeed, 6 categorias, afiliado ML aprovado, etiqueta alexandrehebeler). Tenho 20 artigos quase-prontos + 4 páginas institucionais + manuais no repo (branch claude/mercado-livre-affiliate-blog-vdkgb1, pasta blog-casa-inteligente).

Meu problema agora: o SITE ESTÁ COM CARA AMADORA. Quero deixá-lo com design profissional, alinhado a um blog de tecnologia/casa inteligente (moderno, limpo, confiável), sem perder velocidade/SEO.

Preciso que você:
1. Me ajude a definir a identidade visual (logo, favicon, paleta, fontes) — proposta concreta.
2. Desenhe a estrutura da HOME (hero + categorias + últimos posts + prova de confiança) e me dê como implementar no GeneratePress (starter site / GenerateBlocks).
3. Crie uma "caixa de produto/afiliado" padrão pros reviews.
4. Lembre sempre a REGRA DE OURO: link de afiliado é do PRODUTO, nunca da vitrine /social/.

Importante: este chat talvez não consiga abrir meu site (a rede pode estar bloqueada). Se for o caso, me peça screenshots ou vamos aplicar via Cowork (que vê minha tela). Comece confirmando que leu o HANDOFF e me proponha a identidade visual + a home.
```

---

*Fim do handoff. Tudo o que está descrito aqui está versionado no PR #3 do repositório, na pasta `blog-casa-inteligente/`.*
