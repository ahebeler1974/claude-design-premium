# Chase the Case — Fontes e como inserir os ativos oficiais

## O que é este projeto

Um **app de estudo gamificado** (jogo de cartas/quiz) para aprender hematologia
laboratorial a partir da série real **HORIBA Medical · "Chase the Case"** — casos
clínicos reais analisados em **Yumizen H2500 / H550 / H500** com morfologia digital
no **CellaVision DC‑1**.

Abra `index.html` em qualquer celular. Não precisa de servidor, build nem internet
(exceto a fonte Inter, que tem fallback do sistema).

## Proveniência do conteúdo (transparência)

| Camada | Origem | Status |
|---|---|---|
| Índice de casos (nº, patologia, equipamento) | Publicações públicas HORIBA (verificadas) | **Real** |
| Texto de ensino, flags, parâmetros, quizzes | Síntese original de hematologia consolidada, alinhada à patologia | **Educacional original** |
| Valores numéricos de parâmetros | Faixas didáticas da literatura | **Típico, não o laudo do paciente** |
| Histogramas, matrizes LMNE, fotos de lâmina | PDFs oficiais HORIBA (material protegido) | **Não incluídos — slots vazios** |

> Não reproduzimos números exatos de pacientes nem imagens dos PDFs oficiais
> (direitos autorais HORIBA). O app foi feito para **receber** esses ativos.

## Como inserir as imagens oficiais (matriz / histograma / lâmina)

1. Baixe o PDF/figuras do caso na página oficial (links na aba **Sobre** do app e
   no campo `fonte` de cada caso em `data/cases.js`).
2. Salve a imagem em `assets/cases/` — ex.: `assets/cases/c23-matriz.png`.
3. Em `data/cases.js`, preencha o objeto `assets` do caso:

   ```js
   assets: {
     matriz:     'assets/cases/c23-matriz.png',
     histograma: 'assets/cases/c23-histo.png',
     lamina:     'assets/cases/c23-lamina.png'
   },
   ```

4. (Opcional) Ao validar os números reais do laudo, marque `realData: true`.

O slot vazio vira a imagem automaticamente — nenhuma mudança de código necessária.

## Como adicionar um novo caso

Copie um objeto em `window.CHASE_CASES` (`data/cases.js`) e ajuste:

- `id` único, `numero`, `patologia`, `track` (uma das trilhas em `CHASE_TRACKS`)
- `dificuldade` 1–3, `equipamento`, `contexto`, `pistas`
- `parametros` (`tendencia`: `↑` `↓` `→`), `flags`, `histograma`, `cellavision`
- `aprendizado` (o insight-chave) e `quiz` (cada item: `p`, `opcoes`, `correta`, `explica`)
- `fonte` (URL oficial)

A trilha, a barra de progresso, a coleção e o XP se atualizam sozinhos.

## Casos reais incluídos (verificados via publicações HORIBA)

#03/#19/#32/#38 Anemia falciforme · #06 Mielodisplasia secundária ·
#08 Malária · #18 Câncer de pulmão · #20 Síndrome linfoproliferativa ·
#23 Dengue · #26 Leucemia aguda · #31 LLC · #34 Leucemia monoblástica ·
#39 LMA M5 · #41 LMMC · #46 Mononucleose infecciosa · #50 LLA ·
#51 LMC · #55 Leucemia promielocítica.

Índice oficial: https://www.horiba.com/int/healthcare/chase-the-case/

## Aviso

Ferramenta educacional. Não é orientação diagnóstica e não substitui diretrizes
clínicas, laudos laboratoriais ou os documentos oficiais da HORIBA Medical.
"HORIBA", "Yumizen" e "CellaVision" são marcas de seus respectivos titulares;
usadas aqui apenas para referência educacional aos casos públicos.
