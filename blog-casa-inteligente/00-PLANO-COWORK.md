# 🤝 Plano para o Assistente de Tela (Cowork) — Cadastro & Setup

> **Para o assistente que enxerga a tela do usuário:** este é o seu roteiro. O usuário faz os cliques;
> você orienta passo a passo, em tempo real, confirmando cada tela antes de avançar. Todo o **conteúdo**
> (artigos, SEO, estrutura) já está pronto nesta pasta — você cuida do **cadastro e da configuração**.
>
> **Objetivo final desta fase:** WordPress no ar na Hostinger + afiliado do Mercado Livre aprovado +
> 3 plugins instalados. Quando isso estiver pronto, o usuário volta aqui e começa a publicar os
> artigos da pasta `artigos/`.

---

## 🚧 REGRA DE OURO (não pule isto)

A tela de onboarding da Hostinger (o **"Kodee"**) empurra para o **Construtor de Sites da Hostinger**.
**NÃO siga por ali.** A estratégia depende de **WordPress**, porque:

- O plugin/links de afiliado do **Mercado Livre** precisam de WordPress.
- O **Rank Math** (SEO de cauda longa) só existe no WordPress.
- O construtor da Hostinger **não aceita** esses plugins.

➡️ **Ação:** na tela do Kodee, clique em **"Pular personalização"** (canto inferior direito) ou no **X**.

---

## FASE A — Conta, domínio e WordPress (na Hostinger)

> Guie o usuário tela por tela. Confirme cada passo antes de avançar.

**A1. Sair do Kodee** → clicar em "Pular personalização".

**A2. Ir ao hPanel** → menu **"Sites"** → botão **"Adicionar site"** / **"Criar ou migrar um site"**.

**A3. Escolher plataforma** → **"Criar um novo site"** → plataforma **WordPress** (NÃO o Website Builder).

**A4. Login admin do WordPress:**
- E-mail do usuário (vira o login).
- Senha forte — **anote num lugar seguro** (é o acesso ao painel do site).

**A5. Domínio:**
- Se o usuário **já tem** domínio → selecionar na lista.
- Se **não tem** → registrar agora. Sugerir nome **curto**, ligado ao nicho ou de marca.
  Evitar nomes longos. Preferir `.com.br` ou `.com`.

**A6. Tema na instalação** → escolher qualquer um **leve/minimalista** (será trocado depois).
Se oferecer instalar com IA/plugins, pode aceitar o básico — vamos ajustar depois.

**A7. Aguardar instalação** (~2–5 min). Ao final, anotar o link **`seudominio.com/wp-admin`**.

---

## FASE B — Afiliado do Mercado Livre (em paralelo, enquanto instala)

**B1.** Abrir o **Programa de Afiliados do Mercado Livre** (buscar no Google "Mercado Livre Afiliados"
ou acessar a área de afiliados dentro da conta ML).

**B2.** Fazer login com a conta Mercado Livre (ou criar uma) e **se cadastrar no programa**.

**B3.** Preencher o formulário (dados pessoais/PIX para receber comissão).

**B4.** Aguardar aprovação. Quando aprovado, localizar onde se **gera o link de afiliado** de um produto
(geralmente colando a URL do produto numa ferramenta que devolve o link com sua tag de comissão).

**B5.** ✅ **Entregável desta fase:** o usuário consegue gerar um **link de afiliado** de qualquer
produto. É esse link que vai no campo `[INSERIR LINK DE AFILIADO ML]` dos artigos.

---

## FASE C — Configuração do WordPress (depois da instalação)

> Acesse `seudominio.com/wp-admin` com o login da fase A4. Faça nesta ordem:

**C1. Permalinks (CRÍTICO p/ SEO):** `Configurações → Links Permanentes` → marcar **"Nome do post"**
(`/%postname%/`) → Salvar.

**C2. Identidade:** `Configurações → Geral` → definir **Título do site** e **Descrição (slogan)**,
idioma **pt-BR**.

**C3. Limpar exemplos:** apagar o post "Olá, mundo!" e a página de exemplo.

**C4. Tema leve:** `Aparência → Temas → Adicionar novo` → instalar e ativar **Astra**,
**GeneratePress** ou **Kadence** (gratuitos, rápidos).

**C5. Plugins essenciais** (`Plugins → Adicionar novo`):
1. **Rank Math SEO** — o cérebro do SEO.
2. **LiteSpeed Cache** — velocidade (servidores da Hostinger são LiteSpeed).
3. **Mercado Livre** — buscar; se não houver plugin oficial no diretório, **sem problema**: os links
   de afiliado vão direto no texto do artigo (o plugin só automatiza, não é obrigatório).

**C6. Categorias e menu:** aplicar o que está em **`ESTRUTURA-BLOG.md`**.

**C7. Configurar o Rank Math:** seguir **`SEO-CHECKLIST.md`** (assistente de configuração inicial).

---

## ✅ Checklist de conclusão (a fase acabou quando TUDO abaixo estiver ✔)

- [ ] WordPress instalado e acessível em `seudominio.com/wp-admin`
- [ ] Permalinks em "Nome do post"
- [ ] Tema leve ativo (Astra/GeneratePress/Kadence)
- [ ] Rank Math + LiteSpeed Cache instalados e ativos
- [ ] Categorias e menu criados (ver `ESTRUTURA-BLOG.md`)
- [ ] Afiliado do Mercado Livre **aprovado** e gerando links

---

## ➡️ E DEPOIS? (handoff de volta para o conteúdo)

Quando o checklist acima estiver completo, o usuário **volta para esta pasta** e:

1. Abre `artigos/01-lampada-inteligente-alexa-sem-hub.md` (o mais fácil de ranquear).
2. Preenche os campos `[ ]` (produto, preço, **link de afiliado**, opinião sincera).
3. Publica no WordPress e roda o `SEO-CHECKLIST.md` naquele post.
4. Segue a ordem do `CALENDARIO-EDITORIAL.md` para os próximos.

**Tudo o que precisa ser escrito já está pronto em `artigos/`. Esta fase é só cadastro + configuração.**
