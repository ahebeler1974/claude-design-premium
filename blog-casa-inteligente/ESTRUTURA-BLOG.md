# 🧱 Estrutura do Blog — WordPress (Casa Inteligente)

> Aplique isto no `wp-admin` depois que o WordPress estiver instalado. É a arquitetura que ajuda o
> Google a entender o site e distribui "autoridade" entre os artigos.

## 1. Categorias (`Posts → Categorias`)

Crie estas categorias. Cada artigo entra em **uma** principal.

| Categoria | Slug | O que entra |
|---|---|---|
| Iluminação Inteligente | `iluminacao-inteligente` | Lâmpadas, fitas LED, interruptores, sensores de presença |
| Segurança e Câmeras | `seguranca-e-cameras` | Câmeras wifi, campainhas, fechaduras digitais, sensores |
| Robôs e Limpeza | `robos-e-limpeza` | Robôs aspiradores, passa-pano |
| Assistentes e Controle | `assistentes-e-controle` | Alexa, Google Nest, tomadas inteligentes, controles universais |
| Guias e Comparativos | `guias-e-comparativos` | Listas "melhores X", kits, comparativos gerais |
| Ofertas e Novidades | `ofertas-e-novidades` | Artigos Tipo 3 (hype/promoção-isca) |

> ❌ Não crie 20 categorias. Poucas e bem definidas rankeiam melhor que muitas vazias.

## 2. Menu principal (`Aparência → Menus`)

Ordem sugerida no topo do site:

```
Início · Iluminação · Segurança · Robôs · Assistentes · Guias · Ofertas
```

## 3. Páginas institucionais (obrigatórias p/ confiança e afiliados)

Crie estas páginas (`Páginas → Adicionar nova`) — o Google e o programa de afiliados gostam delas:

- **Sobre** — quem você é e por que recomenda os produtos (gera confiança/E-E-A-T).
- **Política de Privacidade** — exigida (use o gerador nativo do WordPress).
- **Aviso de Afiliados / Divulgação** — frase obrigatória do tipo:
  > "Este site participa do Programa de Afiliados do Mercado Livre. Ao comprar pelos nossos links,
  > podemos receber uma comissão **sem custo adicional para você**. Recomendamos apenas o que
  > consideramos bom."
- **Contato** — um e-mail ou formulário simples.

## 4. Configurações que não podem faltar

- `Configurações → Links Permanentes` → **Nome do post** (`/%postname%/`). **CRÍTICO.**
- `Configurações → Leitura` → garantir que **NÃO** está marcado "desencorajar mecanismos de busca".
- `Configurações → Discussão` → moderar comentários (evita spam).

## 5. Mapa de links internos (cole isto e siga)

```
COMPARATIVO (T2)  ──linka para→  REVIEWS (T1) dos produtos citados
REVIEW (T1)       ──linka para→  COMPARATIVO (T2) da mesma categoria
Todo artigo       ──linka para→  1 ou 2 artigos da MESMA categoria
```

Exemplos do Lote 1:
- `02 (comparativo lâmpadas)` → linka para `01 (review lâmpada)`.
- `07 (comparativo robôs)` → linka para `04 (review robô p/ pelo de cachorro)`.
- `10 (comparativo câmeras)` → linka para `05 (review câmera p/ pet)`.

## 6. Imagem em todo post

- 1 imagem de destaque (use a do próprio produto no Mercado Livre ou banco gratuito).
- Sempre preencher o **texto alternativo (alt)** da imagem com a palavra-chave. Ajuda no SEO e em IA.
