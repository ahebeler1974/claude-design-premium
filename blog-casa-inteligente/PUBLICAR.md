# 🚀 Manual de Publicação — passo a passo turnkey

> **Para o assistente de tela (Cowork) + usuário:** este é o roteiro para publicar o conteúdo no
> WordPress (`ahebeler.shop/wp-admin`). O setup já está pronto (ver `RELATORIO-EXECUCAO-SETUP.md`).
> Cada artigo desta pasta está **quase-pronto**: falta só **gerar os links de afiliado** e publicar.
> Siga as partes na ordem. Não precisa decidir nada — só executar.

---

## 🔑 A regra que vale para todo link de afiliado

> ⚠️ **REGRA DE OURO — link de PRODUTO, não da vitrine.** Gere o link sempre a partir da **URL do
> anúncio do produto** (Gerador de links). **NUNCA** use o link da sua **vitrine/página social**
> (`mercadolivre.com.br/social/seu-usuario`). Os dois rastreiam sua comissão, mas o da vitrine abre
> uma **lista de recomendações** e obriga o leitor a caçar o item — converte muito menos. O clique
> precisa cair **direto no produto**. *(Foi exatamente esse o ajuste pego no teste do artigo 01.)*

Sempre que o texto tiver um campo **`[GERAR LINK DE AFILIADO: Nome do Produto]`**:

1. No **painel de Afiliados do Mercado Livre** → **Ferramentas → Gerador de links**.
2. Busque o produto pelo nome (ou cole a URL do anúncio) → escolha **Link curto** → **Copiar**.
3. No WordPress, selecione o texto do botão/CTA e cole o link.
4. Com o link selecionado, marque: **abrir em nova aba** ✔ e o atributo **`nofollow sponsored`**
   (no editor de blocos: ícone de link → opções → "marcar como patrocinado/nofollow"; ou no editor de
   código, `rel="nofollow sponsored"` e `target="_blank"`).
5. Apague o comentário `<!-- no WordPress: marcar nofollow sponsored + nova aba -->` (é só lembrete).

> Faça isso para **cada** campo `[GERAR LINK...]` do artigo. Comparativos têm 4–6; reviews têm 1–3.

---

## FASE 0 — Gerar os links de afiliado (recomendado fazer em bloco, antes de publicar)

É mais eficiente gerar **todos os links de um silo de uma vez** e só depois publicar. Faça assim:

1. Abra a **Tabela de referência de produtos** (mais abaixo) e o **painel de Afiliados** lado a lado.
2. Para cada produto: **Gerador de links → cole a URL do anúncio do PRODUTO → Link curto → copie**.
   - ⚠️ **Sempre o link do PRODUTO**, nunca o da vitrine `/social/` (ver Regra de Ouro acima).
   - Ao gerar, **anote o % de comissão** que o painel mostra para aquele produto.
3. **Salve os links** num bloco de notas, organizados por artigo (ex.: `02 — Tapo L530E: <link>`).
4. Só então vá publicar (Partes A e B) — com os links já prontos, é só colar.

> Dica: gere os links **silo por silo** (ex.: primeiro os do artigo 01 + 02), publique o silo, e siga.
> Evita gerar 80 links de uma vez e se perder.

---

## PARTE A — Publicar as 4 páginas institucionais (uma vez só)

Arquivos em `paginas/`. Para cada uma: `Páginas → Adicionar nova` → colar o conteúdo → **Publicar**.

1. **Sobre** (`paginas/sobre.md`)
2. **Aviso de Afiliados** (`paginas/aviso-de-afiliados.md`)
3. **Política de Privacidade** (`paginas/politica-de-privacidade.md`) — *revisar antes (é modelo LGPD)*
4. **Contato** (`paginas/contato.md`) — conferir o e-mail exibido

Depois: `Aparência → Menus` (ou rodapé) → adicionar **Aviso de Afiliados** e **Política de
Privacidade** no **rodapé** do site (exigência de transparência e confiança).

---

## PARTE B — Publicar um artigo (repita para cada um)

`Posts → Adicionar novo` e siga:

1. **Título:** copie o **Título SEO** do topo do arquivo (seção "Campos do Rank Math").
2. **Corpo:** cole todo o texto do artigo (do H1 pra baixo). Apague as linhas de instrução
   (cabeçalho `>`, marcadores `[SUA EXPERIÊNCIA (opcional)]` se não for usar, e o checklist final).
3. **Slug/Permalink:** ajuste para o **Slug** indicado no arquivo.
4. **Rank Math (lateral/abaixo do editor):**
   - **Palavra-chave de foco:** cole a keyword do arquivo.
   - **Meta descrição:** cole a do arquivo.
   - Mire **nota 80+** (verde).
5. **Links de afiliado:** gere e insira todos (ver "A regra" acima).
6. **Links internos:** o artigo já aponta para `/slug/` de outros posts. Eles funcionam quando o
   post-alvo também estiver publicado (ver ordem em silos abaixo).
7. **Categoria:** selecione a categoria indicada no cabeçalho do arquivo.
8. **Imagem destacada:** suba 1 imagem (pode usar a do anúncio no ML ou banco gratuito) e preencha o
   **texto alternativo (alt)** com a keyword.
9. **Publicar.** ✅

---

## 🌊 Ordem de publicação por SILOS (assim ranqueia e vende mais rápido)

Publique **review (T1) + comparativo (T2) da mesma categoria juntos** — os links internos se ativam de cara.

| Onda | Categoria | Publicar juntos |
|---|---|---|
| 1 | Iluminação | **01** (lâmpada) + **02** (comparativo) |
| 2 | Robôs | **04** (robô pet) + **07** (comparativo robôs) |
| 3 | Segurança | **05** (câmera pet) + **10** (comparativo câmeras) → depois **03** (fechadura) |
| 4 | Assistentes/Ofertas | **09** (Echo Dot) + **08** (kit) + **06** (tomada) |
| 5+ | Lote 2 | **11–20** (entram nos mesmos silos conforme a categoria) |

---

## 🛒 Tabela de referência — produtos por artigo (para gerar os links)

**Lote 1 (01–10):**

| Artigo | Produtos para gerar link |
|---|---|
| 01 Lâmpada (review) | Kit 3 Lâmpadas Positivo — **gerar link do PRODUTO** (o `meli.la/24dPT2v` atual é da **vitrine**, trocar) |
| 02 Lâmpadas (comparativo) | Tapo L530E · Positivo RGB+ E27 · Intelbras EWS 410 · Multilaser Liv SE239 · Elsys EPGG17 |
| 03 Fechadura | Intelbras FR 220 · Papaiz SL140B Bio |
| 04 Robô (pet) | Xiaomi Robot Vacuum S40C · WAP Robot W100 |
| 05 Câmera (pet) | TP-Link Tapo C200 · Intelbras Mibo iM4 C |
| 06 Tomada (ar) | Positivo Smart Plug Max 16A · EKAZA 20A |
| 07 Robôs (comparativo) | Xiaomi S40C · Xiaomi E10 · KaBuM! Smart 700 · WAP W1000 · Velds 3em1 |
| 08 Kit iniciante | Echo Dot 5ª ger · Tapo L530E · Positivo Smart Plug · Mibo iM3 C · sensor |
| 09 Echo Dot | Echo Dot 5ª ger (c/ e s/ relógio) · Echo Pop · Echo Dot Max · + oferta do dia |
| 10 Câmeras (comparativo) | Tapo C200 · C210 · C500 (externa) · Intelbras iM3 C · Xiaomi C200 |

**Lote 2 (11–20):**

| Artigo | Produtos para gerar link |
|---|---|
| 11 Sensor de presença | Sensor Wi-Fi AGL · Sensor PIR Tuya/Smart Life |
| 12 Interruptor sem neutro | SONOFF ZBMINI-L2 · Interruptor Touch Wi-Fi EKAZA (T3074/T1074) |
| 13 Alexa vs Nest | Echo Dot 5ª ger · Echo Pop · Echo Dot Max · Echo Show 5 · Google Nest Mini 2ª ger |
| 14 Campainha com câmera | TP-Link Tapo D230S1 · Intelbras Allo w3 |
| 15 Robô passa-pano | Xiaomi S20+ · Xiaomi S40 · WAP W3000 · KaBuM! Smart 700 · Mondial RB-04 |
| 16 Controle universal IR | BroadLink RM4 Pro · Controle IR Tuya/NovaDigital |
| 17 Fitas LED gamer | Tapo L920-5 (RGBIC) · Govee RGBIC · Tapo L900-5 · Intelbras EFLS 6050 · Positivo Fita LED |
| 18 Fechadura senha+cartão | Intelbras FR 500 · Yale YDF 30 |
| 19 Central de automação | Aqara Hub M3 · Intelbras ICA 1001 |
| 20 Sensor fumaça/gás | Intelbras IDF 620 Izy · Sensor fumaça Tuya/Smart Life |

> Os nomes exatos também estão no topo de cada artigo, no campo `[GERAR LINK DE AFILIADO: ...]`.

---

## ✅ Checklist rápido por artigo (antes de clicar em Publicar)

- [ ] Título SEO, slug e meta colados no Rank Math
- [ ] Todos os `[GERAR LINK...]` substituídos por links reais, com `nofollow sponsored` + nova aba
- [ ] Categoria correta selecionada
- [ ] Imagem destacada com alt = keyword
- [ ] Linhas de instrução do rascunho removidas (cabeçalho `>`, checklist, comentários `<!-- -->`)
- [ ] Nota Rank Math 80+
- [ ] Post-alvo dos links internos publicado (ou publique no mesmo dia)
