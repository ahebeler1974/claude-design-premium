/* =============================================================================
   cases.js — Conteúdo educacional do "Chase the Case Game"

   IMPORTANTE — PROVENIÊNCIA DO CONTEÚDO
   -------------------------------------
   • O índice de casos (número + patologia + equipamento) é REAL e verificado a
     partir das publicações públicas da HORIBA Medical ("Chase the Case").
   • O conteúdo de ensino (morfologia, flags, parâmetros, achados de lâmina) é
     uma SÍNTESE EDUCACIONAL ORIGINAL baseada em hematologia laboratorial
     consolidada, alinhada à patologia de cada caso real.
   • NÃO reproduzimos os números exatos de paciente, as imagens de histograma/
     matriz, nem as fotos de lâmina dos PDFs oficiais (material protegido).
     Cada caso tem `assets` vazios e campos `realData:false` — preencha com os
     ativos oficiais da HORIBA (ver CONTENT-SOURCES.md).
   • Os valores de CBC mostrados como "padrão típico" são FAIXAS DIDÁTICAS da
     literatura, marcados como tal — não são o laudo do paciente real.
   ============================================================================= */

window.CHASE_TRACKS = [
  {
    id: 'fundamentos',
    nome: 'Fundamentos do Laboratório',
    emoji: '🧪',
    cor: '#2f6fb8',
    descricao: 'Como o analisador "enxerga" o sangue: histogramas, matriz LMNE, flags e a lâmina no CellaVision.',
  },
  {
    id: 'hemoglobinopatias',
    nome: 'Hemoglobinopatias & Anemias',
    emoji: '🩸',
    cor: '#d23b4a',
    descricao: 'Quando a hemácia muda de forma — falciforme e a leitura do eritrograma.',
  },
  {
    id: 'infeccoes',
    nome: 'Infecções & Reativos',
    emoji: '🦟',
    cor: '#138a6e',
    descricao: 'Malária, dengue e mononucleose: o que dispara os flags de linfócito variante e plaquetopenia.',
  },
  {
    id: 'leucemias-agudas',
    nome: 'Leucemias Agudas',
    emoji: '⚡',
    cor: '#6b4ee6',
    descricao: 'Blastos na matriz: LLA, LMA, monoblástica e a promielocítica que é uma emergência.',
  },
  {
    id: 'cronicas-mieloides',
    nome: 'Crônicas & Mielodisplasias',
    emoji: '🧬',
    cor: '#c2820a',
    descricao: 'LMC, LLC, LMMC e SMD — proliferação madura, displasia e a curva que desloca para a esquerda.',
  },
  {
    id: 'solidos',
    nome: 'Sinais no Hemograma',
    emoji: '🔬',
    cor: '#3a6ea5',
    descricao: 'Quando o hemograma levanta a bandeira de uma doença que não é do sangue.',
  },
];

/* Equipamentos reais citados pela HORIBA na série */
window.CHASE_EQUIPAMENTOS = {
  'Yumizen H2500': 'Analisador hematológico de alto volume (5-diff) — matriz LMNE, flags e contagem de reticulócitos.',
  'Yumizen H550':  'Analisador 5-diff de bancada para rotina de média demanda.',
  'Yumizen H500':  'Analisador 5-diff compacto para laboratórios de menor volume.',
  'CellaVision DC-1': 'Sistema de morfologia celular digital: localiza, fotografa e pré-classifica as células da lâmina.',
};

/*
  Modelo de um caso:
  {
    id, numero, patologia, track, dificuldade(1-3),
    realData: false,                 // vire true ao inserir o laudo oficial
    equipamento: [...],
    contexto: 'sinopse clínica (genérica/didática)',
    pistas: [ 'o que o analisador sinalizou — conceitual' ],
    parametros: [ {nome, tendencia:'↑|↓|→', nota} ],  // padrão típico didático
    flags: [ 'Blast?', 'NRBC', ... ],
    histograma: 'o que esperar na curva/matriz',
    cellavision: [ 'achados de lâmina esperados' ],
    aprendizado: 'parágrafo-chave',
    quiz: [ {p, opcoes:[...], correta:idx, explica} ],
    assets: { matriz:'', histograma:'', lamina:'' },  // caminhos p/ ativos oficiais
    fonte: 'URL pública HORIBA'
  }
*/
window.CHASE_CASES = [

  /* ---------------------------------------------------------------- FUNDAMENTOS */
  {
    id: 'f-matriz', numero: '00', patologia: 'A Matriz LMNE', track: 'fundamentos', dificuldade: 1,
    realData: true, equipamento: ['Yumizen H2500'],
    contexto: 'Antes de caçar um caso, é preciso ler o mapa. O 5-diff separa os leucócitos em uma matriz por tamanho e estrutura.',
    pistas: ['Cada nuvem de pontos é uma população: Linfócitos, Monócitos, Neutrófilos, Eosinófilos.', 'Pontos fora das nuvens = a máquina levanta um flag.'],
    parametros: [
      {nome: 'WBC', tendencia: '→', nota: 'contagem global de leucócitos'},
      {nome: 'NEU/LYM/MONO/EOS/BASO', tendencia: '→', nota: 'as 5 populações do differential'},
    ],
    flags: ['Blast?', 'Atypical Lympho?', 'Left shift', 'NRBC', 'Imm Granulocytes'],
    histograma: 'No 5-diff, a matriz LMNE posiciona cada população em uma região esperada. Células anormais (blastos, linfócitos variantes) caem em zonas "proibidas" e disparam flags.',
    cellavision: ['Quando o flag acende, a lâmina vai ao CellaVision para confirmar a morfologia célula a célula.'],
    aprendizado: 'O analisador não dá diagnóstico — ele dá um padrão e um alarme. O flag é um convite para olhar a lâmina. Caçar o caso = juntar matriz + flag + morfologia + clínica.',
    quiz: [
      {p: 'O que um "flag" do analisador realmente significa?', opcoes: ['Diagnóstico fechado', 'Um alerta para revisar a lâmina', 'Erro do equipamento', 'Amostra coagulada sempre'], correta: 1, explica: 'O flag sinaliza uma população atípica ou fora da região esperada — é um convite para a revisão morfológica, não um diagnóstico.'},
      {p: 'A matriz LMNE separa os leucócitos principalmente por:', opcoes: ['Cor da rolha do tubo', 'Tamanho e complexidade/estrutura', 'Ordem de chegada', 'Peso do paciente'], correta: 1, explica: 'O 5-diff posiciona cada população por características físicas (tamanho, granularidade/estrutura), formando as nuvens da matriz.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/healthcare/chase-the-case/',
  },

  /* ---------------------------------------------------------- HEMOGLOBINOPATIAS */
  {
    id: 'c3', numero: '03', patologia: 'Anemia Falciforme', track: 'hemoglobinopatias', dificuldade: 2,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Anemia hemolítica crônica por hemoglobina S. A hemácia desoxigenada polimeriza e assume a forma de foice.',
    pistas: ['Anemia com sinais de hemólise e regeneração medular.', 'O eritrograma e a lâmina contam histórias diferentes — por isso a revisão importa.'],
    parametros: [
      {nome: 'Hb', tendencia: '↓', nota: 'anemia, frequentemente moderada a grave'},
      {nome: 'Reticulócitos', tendencia: '↑', nota: 'resposta regenerativa à hemólise'},
      {nome: 'RDW', tendencia: '↑', nota: 'anisocitose'},
    ],
    flags: ['RBC abnormal distribution', 'Anisocytosis', 'NRBC'],
    histograma: 'Histograma de hemácias alargado/bimodal pela presença de drepanócitos, células-alvo e, em crises, eritroblastos (NRBC).',
    cellavision: ['Drepanócitos (células em foice)', 'Células-alvo (codócitos)', 'Corpúsculos de Howell-Jolly (asplenia funcional)', 'Policromasia'],
    aprendizado: 'A foice é o sinal patognomônico, mas o conjunto — alvo + Howell-Jolly + policromasia + reticulocitose — confirma hemólise crônica com hipoesplenismo. O analisador anuncia "tem algo errado nas hemácias"; o CellaVision nomeia a forma.',
    quiz: [
      {p: 'Qual achado de lâmina é o mais característico da anemia falciforme?', opcoes: ['Drepanócito (hemácia em foice)', 'Linfócito atípico', 'Blasto', 'Plaqueta gigante'], correta: 0, explica: 'O drepanócito é a marca morfológica — resultado da polimerização da HbS na desoxigenação.'},
      {p: 'Corpúsculos de Howell-Jolly na falciforme indicam principalmente:', opcoes: ['Deficiência de ferro', 'Hipoesplenismo / asplenia funcional', 'Infecção viral', 'Leucemia'], correta: 1, explica: 'Os infartos esplênicos repetidos levam à asplenia funcional; sem o baço filtrando, restos nucleares (Howell-Jolly) sobram nas hemácias.'},
      {p: 'Por que os reticulócitos sobem na falciforme?', opcoes: ['A medula desliga', 'Resposta regenerativa à hemólise crônica', 'Desidratação', 'Erro de calibração'], correta: 1, explica: 'A destruição acelerada de hemácias estimula a medula a liberar reticulócitos — sinal de hemólise compensada.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/healthcare/chase-the-case/chase-the-case-3-sickle-cell-anemia/',
  },
  {
    id: 'c19', numero: '19', patologia: 'Anemia Falciforme (crise)', track: 'hemoglobinopatias', dificuldade: 2,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Homem jovem com falcização — a HORIBA mostra como o H2500 acompanha a crise vaso-oclusiva e hemolítica.',
    pistas: ['Em crise, a regeneração medular pode jogar eritroblastos para a circulação.', 'Watch a contagem de leucócitos: o NRBC pode "inflar" a contagem se não for corrigido.'],
    parametros: [
      {nome: 'Hb', tendencia: '↓', nota: 'piora na crise'},
      {nome: 'NRBC', tendencia: '↑', nota: 'eritroblastos circulantes'},
      {nome: 'WBC', tendencia: '↑', nota: 'leucocitose reativa / por estresse'},
    ],
    flags: ['NRBC', 'WBC abnormal', 'Anisocytosis'],
    histograma: 'A presença de NRBC exige correção da contagem de leucócitos — o analisador sinaliza e separa os eritroblastos da nuvem de linfócitos.',
    cellavision: ['Drepanócitos', 'Eritroblastos (NRBC)', 'Policromasia intensa'],
    aprendizado: 'Eritroblastos circulantes (NRBC) são contados como falsos leucócitos por contadores antigos. O 5-diff moderno detecta e corrige — entender o flag NRBC evita superestimar a leucometria numa crise.',
    quiz: [
      {p: 'Por que o flag NRBC importa para a contagem de leucócitos?', opcoes: ['Não importa', 'Eritroblastos podem ser contados como leucócitos, exigindo correção', 'Diminui as plaquetas', 'Aumenta a Hb falsamente'], correta: 1, explica: 'NRBC (hemácias nucleadas) têm tamanho próximo ao de linfócitos; sem correção, inflam a leucometria. O analisador sinaliza para corrigir.'},
      {p: 'NRBC na circulação geralmente reflete:', opcoes: ['Medula preguiçosa', 'Estímulo regenerativo/estresse medular intenso', 'Hidratação excessiva', 'Hemoglobina normal'], correta: 1, explica: 'Eritroblastos saem para o sangue quando a medula é fortemente estimulada (hemólise, hipóxia, crise) — sinal de regeneração ativa.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/healthcare/chase-the-case/chase-the-case-19-sickle-cell-anemia/',
  },
  {
    id: 'c32', numero: '32', patologia: 'Anemia Falciforme (adolescente)', track: 'hemoglobinopatias', dificuldade: 2,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Adolescente internado com anemia hemolítica e doença falciforme — o foco é o monitoramento laboratorial da hemólise.',
    pistas: ['A reticulocitose quantifica a resposta da medula.', 'Comparar parâmetros entre internações revela a gravidade da hemólise.'],
    parametros: [
      {nome: 'Hb', tendencia: '↓', nota: 'anemia'},
      {nome: 'Reticulócitos', tendencia: '↑', nota: 'hemólise compensada'},
      {nome: 'MCV', tendencia: '→', nota: 'normo/levemente alterado pela reticulocitose'},
    ],
    flags: ['Anisocytosis', 'RBC abnormal', 'NRBC'],
    histograma: 'A reticulocitose desvia levemente o MCV; o canal de reticulócitos do H2500 quantifica a fração imatura.',
    cellavision: ['Drepanócitos', 'Células-alvo', 'Policromasia / reticulócitos policromáticos'],
    aprendizado: 'Na falciforme, a contagem de reticulócitos é o termômetro da hemólise — queda abrupta pode indicar crise aplástica (ex.: parvovírus B19), uma virada perigosa que o hemograma denuncia antes da clínica.',
    quiz: [
      {p: 'Uma QUEDA súbita dos reticulócitos num paciente falciforme sugere:', opcoes: ['Melhora', 'Possível crise aplástica (ex.: parvovírus B19)', 'Desidratação leve', 'Erro sem importância'], correta: 1, explica: 'Se a medula para de produzir (crise aplástica), os reticulócitos despencam mesmo com anemia grave — emergência que o reticulograma flagra cedo.'},
      {p: 'O canal de reticulócitos serve para:', opcoes: ['Contar plaquetas', 'Medir a fração de hemácias jovens (resposta medular)', 'Dosar ferro', 'Avaliar coagulação'], correta: 1, explica: 'Reticulócitos são hemácias recém-liberadas; sua fração mede o quanto a medula está respondendo.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/medical/news/news-press-release/detail/news/5/2024/sickle-cell-anemia-yumizen-hematology-clinical-cases-chase-the-case-32/',
  },
  {
    id: 'c38', numero: '38', patologia: 'Anemia Falciforme (adulto)', track: 'hemoglobinopatias', dificuldade: 1,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Adulto com fadiga progressiva e dor articular leve — diagnóstico de anemia falciforme acompanhado pelo H2500.',
    pistas: ['Fadiga = anemia crônica.', 'A lâmina confirma o que o eritrograma sugere.'],
    parametros: [
      {nome: 'Hb', tendencia: '↓', nota: 'anemia crônica'},
      {nome: 'RDW', tendencia: '↑', nota: 'anisocitose'},
      {nome: 'Reticulócitos', tendencia: '↑', nota: 'compensação'},
    ],
    flags: ['Anisocytosis', 'RBC abnormal'],
    histograma: 'Curva de hemácias alargada (RDW alto) com cauda de microcitose das células-alvo.',
    cellavision: ['Drepanócitos', 'Células-alvo', 'Howell-Jolly ocasionais'],
    aprendizado: 'Mesmo em apresentação "leve", a assinatura morfológica é a mesma. O valor do fluxo HORIBA é a triagem (analisador) → confirmação (CellaVision) sem depender só do olhar manual.',
    quiz: [
      {p: 'RDW elevado indica:', opcoes: ['Hemácias todas iguais', 'Variação de tamanho das hemácias (anisocitose)', 'Plaquetas baixas', 'Leucocitose'], correta: 1, explica: 'RDW (Red cell Distribution Width) mede a heterogeneidade de tamanho — alto = anisocitose, comum na falciforme.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/company/news/detail/news/11/2024/sickle-cell-anemia-yumizen-hematology-clinical-case-chase-the-case-38/',
  },

  /* --------------------------------------------------------------- INFECÇÕES */
  {
    id: 'c8', numero: '08', patologia: 'Malária (Plasmodium)', track: 'infeccoes', dificuldade: 3,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Homem de 36 anos com febre — interpretação do hemograma na infecção por Plasmodium.',
    pistas: ['Trombocitopenia é uma das pistas mais constantes da malária.', 'Pode haver anormalidades na matriz por hemólise e parasitas intra-eritrocitários.'],
    parametros: [
      {nome: 'Plaquetas', tendencia: '↓', nota: 'trombocitopenia frequente'},
      {nome: 'Hb', tendencia: '↓', nota: 'anemia hemolítica'},
      {nome: 'WBC', tendencia: '→', nota: 'variável'},
    ],
    flags: ['PLT low', 'RBC abnormal', 'Anomalia no canal de reticulócitos/RBC'],
    histograma: 'Parasitas intra-eritrocitários podem gerar sinais atípicos nos canais de hemácia/reticulócito; trombocitopenia evidente no histograma de plaquetas.',
    cellavision: ['Formas intra-eritrocitárias (trofozoítos em anel)', 'Hemácias parasitadas', 'Policromasia'],
    aprendizado: 'O hemograma não fecha malária — mas a tríade febre + trombocitopenia + anemia em área endêmica acende o alerta. A confirmação é a gota espessa/esfregaço; o CellaVision ajuda a flagrar o parasita na lâmina fina.',
    quiz: [
      {p: 'Qual alteração do hemograma é mais consistentemente associada à malária?', opcoes: ['Trombocitose', 'Trombocitopenia', 'Eosinofilia', 'Linfocitose'], correta: 1, explica: 'A trombocitopenia é um dos achados mais constantes e precoces na malária, útil como sinal de alerta.'},
      {p: 'A confirmação diagnóstica da malária no laboratório é feita por:', opcoes: ['Apenas a contagem automatizada', 'Esfregaço/gota espessa com identificação do parasita', 'Dosagem de ferro', 'RDW'], correta: 1, explica: 'O analisador levanta a suspeita; o diagnóstico definitivo exige visualizar o Plasmodium (gota espessa/esfregaço ou teste rápido/PCR).'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/usa/company/news/detail/news/1/2022/malaria-interpretation-clinical-cases-of-yumizen-h2500-hematology-analyzers-chase-the-case-8/',
  },
  {
    id: 'c23', numero: '23', patologia: 'Dengue', track: 'infeccoes', dificuldade: 2,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Infecção viral por dengue — o hemograma é peça central na vigilância de gravidade.',
    pistas: ['A dupla clássica: trombocitopenia + hemoconcentração (hematócrito subindo).', 'Linfócitos atípicos/reativos podem aparecer e disparar flag.'],
    parametros: [
      {nome: 'Plaquetas', tendencia: '↓', nota: 'queda é sinal de alarme'},
      {nome: 'Hematócrito', tendencia: '↑', nota: 'hemoconcentração por extravasamento'},
      {nome: 'Leucócitos', tendencia: '↓', nota: 'leucopenia comum'},
    ],
    flags: ['PLT low', 'Atypical Lympho?', 'WBC low'],
    histograma: 'Trombocitopenia clara no histograma de plaquetas; linfócitos reativos podem deslocar a nuvem de linfócitos e acender "Atypical Lympho?".',
    cellavision: ['Linfócitos reativos/atípicos', 'Plaquetas reduzidas no campo', 'Possível ativação linfocitária'],
    aprendizado: 'Na dengue, o hemograma seriado é prognóstico: plaqueta caindo + hematócrito subindo = risco de extravasamento plasmático (dengue grave). O laboratório vira radar de gravidade, não só de diagnóstico.',
    quiz: [
      {p: 'Qual combinação no hemograma sinaliza ALERTA de gravidade na dengue?', opcoes: ['Plaquetas ↑ e Ht ↓', 'Plaquetas ↓ e hematócrito ↑ (hemoconcentração)', 'Eosinofilia', 'Hb ↑'], correta: 1, explica: 'Queda de plaquetas com aumento do hematócrito sugere extravasamento plasmático — marca da progressão para dengue grave.'},
      {p: 'O flag "Atypical Lympho?" na dengue corresponde a:', opcoes: ['Blastos', 'Linfócitos reativos à infecção viral', 'Neutrófilos tóxicos', 'Hemácias em foice'], correta: 1, explica: 'Infecções virais geram linfócitos reativos (grandes, citoplasma basofílico) que caem fora da nuvem normal e disparam o flag.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/healthcare/chase-the-case/chase-the-case-23-dengue/',
  },
  {
    id: 'c46', numero: '46', patologia: 'Mononucleose Infecciosa', track: 'infeccoes', dificuldade: 2,
    realData: false, equipamento: ['Yumizen H550', 'CellaVision DC-1'],
    contexto: 'Mulher de 21 anos — quadro de mononucleose infecciosa (EBV).',
    pistas: ['Linfocitose com muitos linfócitos atípicos (células de Downey).', '"Atypical Lympho?" / "Variant Lympho?" é o flag estrela aqui.'],
    parametros: [
      {nome: 'Linfócitos', tendencia: '↑', nota: 'linfocitose'},
      {nome: 'WBC', tendencia: '↑', nota: 'às custas de linfócitos'},
      {nome: 'Atípicos', tendencia: '↑', nota: 'linfócitos reativos abundantes'},
    ],
    flags: ['Atypical Lympho?', 'Variant Lympho?'],
    histograma: 'Os linfócitos reativos são grandes e mais granulares — deslocam a nuvem linfocitária para cima/direita na matriz, invadindo a região de monócitos e disparando o flag.',
    cellavision: ['Linfócitos atípicos / reativos (Downey II)', 'Citoplasma abundante e basofílico que "abraça" hemácias vizinhas'],
    aprendizado: 'O grande truque é diferenciar linfócito REATIVO (mononucleose) de linfócito NEOPLÁSICO (leucemia/linfoma). Reativos são heterogêneos e têm contexto viral; blastos/clones são monótonos. A matriz + lâmina + clínica resolvem.',
    quiz: [
      {p: 'O achado clássico da mononucleose no sangue periférico é:', opcoes: ['Blastos monótonos', 'Linfócitos atípicos/reativos (heterogêneos)', 'Drepanócitos', 'Eosinofilia'], correta: 1, explica: 'A mononucleose por EBV cursa com linfocitose de células reativas heterogêneas — o oposto da monotonia clonal de uma leucemia.'},
      {p: 'Como o analisador costuma reagir aos linfócitos reativos?', opcoes: ['Ignora', 'Dispara "Atypical/Variant Lympho?" pois eles saem da nuvem normal', 'Conta como plaquetas', 'Apaga'], correta: 1, explica: 'Por serem maiores e mais estruturados, os reativos caem fora da região esperada de linfócitos e acionam o flag de linfócito atípico/variante.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/company/news/detail/news/6/2025/infectious-mononucleosis-hematology-clinical-case-chase-the-case-46/',
  },

  /* ----------------------------------------------------------- LEUCEMIAS AGUDAS */
  {
    id: 'c26', numero: '26', patologia: 'Leucemia Aguda', track: 'leucemias-agudas', dificuldade: 3,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Apresentação de leucemia aguda — proliferação de blastos invadindo o sangue periférico.',
    pistas: ['O flag "Blast?" é o gatilho.', 'Costuma vir com a tríade: anemia + plaquetopenia + leucócitos alterados.'],
    parametros: [
      {nome: 'Blastos', tendencia: '↑', nota: 'células imaturas circulantes'},
      {nome: 'Hb', tendencia: '↓', nota: 'falência medular'},
      {nome: 'Plaquetas', tendencia: '↓', nota: 'falência medular'},
    ],
    flags: ['Blast?', 'WBC abnormal', 'Imm cells'],
    histograma: 'Os blastos formam uma nuvem anômala na matriz, fora das regiões maduras — o "Blast?" acende e a contagem diferencial fica não confiável até a revisão.',
    cellavision: ['Blastos (alta relação núcleo/citoplasma, cromatina fina, nucléolos)', 'Hiato leucêmico (poucas formas intermediárias)'],
    aprendizado: 'A regra de ouro: hemograma com blastos + citopenias = revisão de lâmina IMEDIATA e contato clínico. O analisador não diferencia o tipo de leucemia — ele dispara o alarme; imunofenotipagem e citogenética definem o subtipo.',
    quiz: [
      {p: 'A tríade que mais sugere leucemia aguda no hemograma é:', opcoes: ['Eosinofilia + basofilia + Hb alta', 'Anemia + plaquetopenia + blastos circulantes', 'RDW baixo isolado', 'Plaquetas altas'], correta: 1, explica: 'A infiltração medular por blastos derruba hemácias e plaquetas e libera células imaturas — anemia + plaquetopenia + blastos.'},
      {p: 'O "hiato leucêmico" significa:', opcoes: ['Muitos estágios intermediários', 'Blastos e células maduras, com poucos estágios intermediários', 'Ausência de blastos', 'Excesso de plaquetas'], correta: 1, explica: 'Na leucemia aguda há um salto entre blastos e células maduras residuais, faltando as formas intermediárias — o hiato leucêmico.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/usa/medical/chase-the-case/chase-the-case-26-leukemia/',
  },
  {
    id: 'c34', numero: '34', patologia: 'Leucemia Monoblástica Aguda', track: 'leucemias-agudas', dificuldade: 3,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Leucemia aguda de linhagem monocítica — proliferação de monoblastos/promonócitos.',
    pistas: ['A nuvem de monócitos "explode" e fica atípica.', 'Pode haver acometimento gengival e de pele (infiltração) na clínica.'],
    parametros: [
      {nome: 'Monócitos/monoblastos', tendencia: '↑', nota: 'expansão monocítica'},
      {nome: 'Hb', tendencia: '↓', nota: 'falência medular'},
      {nome: 'Plaquetas', tendencia: '↓', nota: 'falência medular'},
    ],
    flags: ['Blast?', 'Monocytosis', 'Atypical cells'],
    histograma: 'A região de monócitos na matriz aparece expandida e deslocada; o flag de blasto/monócito anormal acende.',
    cellavision: ['Monoblastos (cromatina fina, citoplasma cinza-azulado)', 'Promonócitos com núcleo dobrado/convoluto'],
    aprendizado: 'Distinguir uma monocitose REATIVA de uma proliferação monoblástica MALIGNA é o desafio. A morfologia (núcleo convoluto, blastos) e a imunofenotipagem decidem — o analisador só aponta a região monocítica anormal.',
    quiz: [
      {p: 'Na leucemia monoblástica, qual população está expandida na matriz?', opcoes: ['Eosinófilos', 'Monócitos/monoblastos', 'Plaquetas', 'Hemácias'], correta: 1, explica: 'É uma leucemia de linhagem monocítica — a nuvem de monócitos se expande e fica atípica.'},
      {p: 'O que separa monocitose reativa de monoblástica maligna?', opcoes: ['Só a idade', 'Morfologia (blastos/promonócitos) + imunofenotipagem', 'A cor do tubo', 'O RDW'], correta: 1, explica: 'Reativa traz monócitos maduros; maligna traz monoblastos/promonócitos imaturos confirmados por imunofenotipagem.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/healthcare/news/news-press-release/detail/news/7/2024/acute-monoblastic-leukemia-yumizen-hematology-clinical-cases-chase-the-case-34/',
  },
  {
    id: 'c39', numero: '39', patologia: 'Leucemia Mieloide Aguda (M5)', track: 'leucemias-agudas', dificuldade: 3,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'LMA M5 (monocítica) na classificação FAB — variante monocítica da leucemia mieloide aguda.',
    pistas: ['Componente monocítico proeminente, como na monoblástica.', 'Diferenciação fina entre M4 e M5 depende de citoquímica/imunofenótipo.'],
    parametros: [
      {nome: 'Blastos/monócitos', tendencia: '↑', nota: 'linhagem monocítica'},
      {nome: 'Hb', tendencia: '↓', nota: 'falência medular'},
      {nome: 'Plaquetas', tendencia: '↓', nota: 'falência medular'},
    ],
    flags: ['Blast?', 'Monocytosis', 'Atypical cells'],
    histograma: 'Expansão e atipia da região monocítica na matriz; flag de blasto.',
    cellavision: ['Monoblastos e promonócitos', 'Atividade de esterase inespecífica positiva (citoquímica)'],
    aprendizado: 'A classificação FAB (M0–M7) e a atual (OMS) organizam as LMAs por linhagem e maturação. O hemograma é o ponto de partida; a definição do subtipo (M5) precisa de morfologia + citoquímica + imunofenotipagem + genética.',
    quiz: [
      {p: 'LMA "M5" na classificação FAB refere-se a leucemia de qual linhagem?', opcoes: ['Linfoide', 'Monocítica', 'Eritroide', 'Megacariocítica'], correta: 1, explica: 'M5 é a LMA monocítica/monoblástica — predomínio de células da linhagem monocítica.'},
      {p: 'O hemograma sozinho define o subtipo exato de LMA?', opcoes: ['Sim, sempre', 'Não — exige citoquímica, imunofenótipo e genética', 'Só com o RDW', 'Apenas com a Hb'], correta: 1, explica: 'O analisador e a morfologia levantam a suspeita; a classificação precisa combina imunofenotipagem e citogenética/molecular.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/company/news/detail/news/12/2024/acute-myeloid-leukemia-m5-monocytic-hematology-clinical-case-chase-the-case-39/',
  },
  {
    id: 'c55', numero: '55', patologia: 'Leucemia Promielocítica Aguda (LPA)', track: 'leucemias-agudas', dificuldade: 3,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'LMA M3 / promielocítica — uma EMERGÊNCIA hematológica pelo risco de coagulação intravascular disseminada (CIVD).',
    pistas: ['Promielócitos anormais hipergranulares + bastonetes de Auer (às vezes em "feixes").', 'Plaquetopenia + alterações de coagulação = sinal vermelho.'],
    parametros: [
      {nome: 'Promielócitos anormais', tendencia: '↑', nota: 'células hipergranulares'},
      {nome: 'Plaquetas', tendencia: '↓', nota: 'consumo / CIVD'},
      {nome: 'Hb', tendencia: '↓', nota: 'falência medular'},
    ],
    flags: ['Blast?', 'Atypical/Imm cells', 'PLT low'],
    histograma: 'A granularidade intensa dos promielócitos gera sinais atípicos na matriz; o flag de blasto/imaturo acende.',
    cellavision: ['Promielócitos hipergranulares', 'Bastonetes de Auer (inclusive em feixes — "faggot cells")', 'Citoplasma repleto de grânulos'],
    aprendizado: 'A LPA é a leucemia que NÃO pode esperar: o risco de CIVD e hemorragia fatal exige reconhecimento imediato e início de ATRA. Reconhecer promielócitos hipergranulares + Auer em feixes na lâmina pode salvar a vida — um caso onde a velocidade da morfologia importa de verdade.',
    quiz: [
      {p: 'Por que a leucemia promielocítica aguda é uma emergência?', opcoes: ['É indolente', 'Alto risco de CIVD e hemorragia grave', 'Não precisa de tratamento', 'Só afeta idosos'], correta: 1, explica: 'Os grânulos dos promielócitos são pró-coagulantes; a LPA cursa com CIVD e sangramento potencialmente fatal — reconhecimento e ATRA são urgentes.'},
      {p: 'Qual achado de lâmina é típico da LPA?', opcoes: ['Drepanócitos', 'Promielócitos hipergranulares com bastonetes de Auer em feixes', 'Linfócitos reativos', 'Esferócitos'], correta: 1, explica: 'As "faggot cells" (promielócitos com feixes de bastonetes de Auer) são altamente sugestivas de LPA.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/company/news/detail/news/4/2026/acute-promyelocytic-leukemia-hematology-clinical-case-chase-the-case-55/',
  },
  {
    id: 'c50', numero: '50', patologia: 'Leucemia Linfoblástica Aguda (LLA)', track: 'leucemias-agudas', dificuldade: 3,
    realData: false, equipamento: ['Yumizen H500', 'CellaVision DC-1'],
    contexto: 'Criança de 6 anos — LLA, a leucemia mais comum da infância. Resultados apoiados pelo Yumizen H500.',
    pistas: ['Linfoblastos circulantes + citopenias.', 'Pico de incidência na infância (2–5 anos).'],
    parametros: [
      {nome: 'Linfoblastos', tendencia: '↑', nota: 'blastos de linhagem linfoide'},
      {nome: 'Hb', tendencia: '↓', nota: 'falência medular'},
      {nome: 'Plaquetas', tendencia: '↓', nota: 'falência medular'},
    ],
    flags: ['Blast?', 'Atypical Lympho?', 'WBC abnormal'],
    histograma: 'Linfoblastos caem fora da nuvem de linfócitos maduros; o analisador sinaliza blasto/linfócito atípico.',
    cellavision: ['Linfoblastos (cromatina homogênea, citoplasma escasso)', 'Pouca granulação, alta relação núcleo/citoplasma'],
    aprendizado: 'LLA é a neoplasia pediátrica mais frequente e, hoje, com altas taxas de cura. O hemograma + lâmina abrem a investigação; imunofenotipagem (B vs T) e genética estratificam o risco e guiam o tratamento.',
    quiz: [
      {p: 'A LLA é a leucemia mais comum em qual faixa etária?', opcoes: ['Idosos', 'Crianças (pico 2–5 anos)', 'Recém-nascidos só', 'Adolescentes só'], correta: 1, explica: 'A leucemia linfoblástica aguda tem pico na infância e é a neoplasia maligna mais comum em crianças.'},
      {p: 'Linfoblasto difere de linfócito reativo principalmente por ser:', opcoes: ['Maduro e heterogêneo', 'Imaturo, monótono, com alta relação núcleo/citoplasma', 'Cheio de grânulos', 'Uma plaqueta grande'], correta: 1, explica: 'O blasto é imaturo e clonal (monótono); o reativo é maduro e heterogêneo, com contexto infeccioso.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/usa/company/news/detail/news/11/2025/acute-lymphoblastic-leukemia-hematology-clinical-case-chase-the-case-50/',
  },

  /* -------------------------------------------------------- CRÔNICAS & MIELODISPLASIAS */
  {
    id: 'c51', numero: '51', patologia: 'Leucemia Mieloide Crônica (LMC)', track: 'cronicas-mieloides', dificuldade: 3,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'LMC — doença mieloproliferativa com o cromossomo Philadelphia (BCR-ABL1).',
    pistas: ['Leucocitose acentuada com TODO o espectro mieloide (desvio à esquerda escalonado).', 'Basofilia e eosinofilia frequentes.'],
    parametros: [
      {nome: 'WBC', tendencia: '↑', nota: 'leucocitose marcada (às vezes >100 mil)'},
      {nome: 'Basófilos', tendencia: '↑', nota: 'basofilia é pista forte'},
      {nome: 'Plaquetas', tendencia: '↑', nota: 'frequentemente elevadas'},
    ],
    flags: ['Imm Granulocytes', 'Left shift', 'Basophilia', 'Blast? (na progressão)'],
    histograma: 'A matriz mostra o espectro completo da granulopoese (mielócitos, metamielócitos, bastões) — um desvio à esquerda "escalonado", diferente do hiato leucêmico das agudas.',
    cellavision: ['Toda a série granulocítica em maturação', 'Basofilia/eosinofilia', 'Poucos blastos na fase crônica'],
    aprendizado: 'A pegada da LMC é o desvio à esquerda CONTÍNUO (todas as etapas presentes) + basofilia — diferente da leucemia aguda (hiato leucêmico). A confirmação é o BCR-ABL1/Philadelphia, alvo dos inibidores de tirosina-quinase que transformaram o prognóstico.',
    quiz: [
      {p: 'O que distingue o quadro leucocitário da LMC de uma leucemia aguda?', opcoes: ['Hiato leucêmico', 'Desvio à esquerda escalonado (toda a série mieloide presente)', 'Só blastos', 'Ausência de leucócitos'], correta: 1, explica: 'A LMC mostra todas as etapas da maturação mieloide (escalonado); a aguda tem o salto blasto→maduro (hiato leucêmico).'},
      {p: 'A alteração genética característica da LMC é:', opcoes: ['JAK2 sempre', 'Cromossomo Philadelphia / BCR-ABL1', 'Trissomia do 21', 'Fator V Leiden'], correta: 1, explica: 'A translocação t(9;22) cria o gene BCR-ABL1 (cromossomo Philadelphia), alvo dos inibidores de tirosina-quinase.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/company/news/detail/news/12/2025/chronic-myeloid-leukemia-hematology-clinical-case-chase-the-case-51/',
  },
  {
    id: 'c41', numero: '41', patologia: 'Leucemia Mielomonocítica Crônica (LMMC)', track: 'cronicas-mieloides', dificuldade: 3,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Homem de 65 anos com anemia e bicitopenia — diagnóstico de LMMC, uma neoplasia mielodisplásica/mieloproliferativa.',
    pistas: ['Monocitose PERSISTENTE é o critério-chave (monócitos sustentadamente elevados).', 'Displasia + proliferação convivem no mesmo quadro.'],
    parametros: [
      {nome: 'Monócitos', tendencia: '↑', nota: 'monocitose persistente — pista central'},
      {nome: 'Hb', tendencia: '↓', nota: 'anemia (componente displásico)'},
      {nome: 'Plaquetas', tendencia: '↓', nota: 'bicitopenia'},
    ],
    flags: ['Monocytosis', 'Dysplasia / abnormal cells', 'Blast? (variável)'],
    histograma: 'Região monocítica expandida e persistente na matriz; podem coexistir sinais de displasia granulocítica.',
    cellavision: ['Monócitos aumentados (alguns displásicos)', 'Displasia em neutrófilos (hipogranulação, Pelger-Huët)', 'Eventuais blastos'],
    aprendizado: 'A LMMC vive na fronteira: tem displasia (como SMD) E proliferação (como DMP). A chave diagnóstica é a monocitose persistente. O analisador que separa bem os monócitos ajuda a flagrar exatamente esse critério no acompanhamento.',
    quiz: [
      {p: 'Qual o achado-chave para suspeitar de LMMC?', opcoes: ['Eosinofilia transitória', 'Monocitose persistente', 'Plaquetose isolada', 'Linfocitose'], correta: 1, explica: 'A monocitose persistente é o critério central da LMMC, que combina características displásicas e proliferativas.'},
      {p: 'A LMMC é classificada como:', opcoes: ['Anemia ferropriva', 'Neoplasia mielodisplásica/mieloproliferativa (sobreposição)', 'Infecção viral', 'Hemoglobinopatia'], correta: 1, explica: 'A LMMC fica na sobreposição SMD/DMP — tem displasia e proliferação simultâneas.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/company/news/detail/news/2/2025/chronic-myelomonocytic-leukemia-hematology-clinical-case-chase-the-case-41/',
  },
  {
    id: 'c6', numero: '06', patologia: 'Mielodisplasia (Secundária)', track: 'cronicas-mieloides', dificuldade: 3,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Síndrome mielodisplásica secundária — hematopoese ineficaz com citopenias e displasia.',
    pistas: ['Citopenia(s) com células displásicas.', 'Neutrófilos hipogranulares e hipossegmentados (Pelger-Huët adquirida) são pistas.'],
    parametros: [
      {nome: 'Hb', tendencia: '↓', nota: 'anemia macro/normocítica frequente'},
      {nome: 'Plaquetas', tendencia: '↓', nota: 'pode haver plaquetopenia'},
      {nome: 'Neutrófilos', tendencia: '↓', nota: 'displásicos/hipogranulares'},
    ],
    flags: ['Dysplasia', 'Left shift', 'Blast? (se excesso)'],
    histograma: 'Displasia altera a estrutura dos neutrófilos — a matriz pode mostrar população granulocítica deslocada por hipogranulação.',
    cellavision: ['Pseudo-Pelger-Huët (neutrófilos bilobados)', 'Hipogranulação', 'Hemácias displásicas / dimórficas', 'Eventuais blastos'],
    aprendizado: 'SMD = "a fábrica está estragada": produz muito, mas defeituoso (hematopoese ineficaz). A displasia morfológica + citopenias guiam o diagnóstico; a contagem de blastos estratifica o risco. O analisador detecta a anormalidade granulocítica que pede a lâmina.',
    quiz: [
      {p: 'A síndrome mielodisplásica caracteriza-se por:', opcoes: ['Medula normal', 'Hematopoese ineficaz com displasia e citopenias', 'Só excesso de plaquetas', 'Infecção aguda'], correta: 1, explica: 'A SMD produz células displásicas e em quantidade insuficiente — citopenias apesar de medula muitas vezes celular.'},
      {p: 'O neutrófilo "pseudo-Pelger-Huët" displásico apresenta:', opcoes: ['Núcleo hipersegmentado', 'Núcleo hipossegmentado/bilobado e hipogranulação', 'Muitos grânulos tóxicos', 'Bastonetes de Auer em feixe'], correta: 1, explica: 'A displasia granulocítica gera núcleos hipossegmentados (pseudo-Pelger) e citoplasma hipogranular.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/medical/news/news-press-release/detail/news/11/2021/secondary-myelodysplasia-clinical-cases-of-yumizen-h2500-hematology-analyzers-chase-the-case-6/',
  },
  {
    id: 'c31', numero: '31', patologia: 'Leucemia Linfocítica Crônica (LLC)', track: 'cronicas-mieloides', dificuldade: 2,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'LLC — acúmulo de linfócitos B maduros, clonais. A leucemia crônica mais comum no Ocidente, típica de idosos.',
    pistas: ['Linfocitose absoluta e SUSTENTADA de linfócitos maduros.', 'Manchas de Gümprecht (smudge cells) na lâmina.'],
    parametros: [
      {nome: 'Linfócitos', tendencia: '↑', nota: 'linfocitose absoluta e persistente'},
      {nome: 'WBC', tendencia: '↑', nota: 'às custas de linfócitos'},
      {nome: 'Hb/Plaquetas', tendencia: '→', nota: 'normais no início; caem com progressão'},
    ],
    flags: ['Lymphocytosis', 'Atypical Lympho? (variável)'],
    histograma: 'Nuvem de linfócitos densamente aumentada; os linfócitos são pequenos e maduros (não disparam blasto, mas a linfocitose é evidente).',
    cellavision: ['Linfócitos pequenos e maduros, monótonos', 'Manchas de Gümprecht (smudge cells) — núcleos rompidos no preparo'],
    aprendizado: 'A LLC mostra linfócitos maduros e MONÓTONOS — o contraste com a mononucleose (reativa, heterogênea) é o ponto de ensino. As smudge cells são frágeis e típicas. A imunofenotipagem confirma a clonalidade B (CD5+, CD23+).',
    quiz: [
      {p: 'As "smudge cells" (manchas de Gümprecht) são típicas de:', opcoes: ['Malária', 'Leucemia linfocítica crônica (LLC)', 'Anemia ferropriva', 'LPA'], correta: 1, explica: 'Os linfócitos frágeis da LLC se rompem no esfregaço, formando as smudge cells — pista clássica.'},
      {p: 'O linfócito da LLC, comparado ao reativo da mononucleose, é:', opcoes: ['Heterogêneo e ativado', 'Pequeno, maduro e monótono (clonal)', 'Um blasto', 'Cheio de grânulos'], correta: 1, explica: 'A LLC é uma proliferação clonal monótona de linfócitos maduros; a mononucleose é reativa e heterogênea.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/bra/healthcare/news/news-press-release/detail/news/4/2024/chronic-lymphoid-leukemia-cll-yumizen-hematology-clinical-cases-chase-the-case-31/',
  },
  {
    id: 'c20', numero: '20', patologia: 'Síndrome Linfoproliferativa', track: 'cronicas-mieloides', dificuldade: 2,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Homem de 64 anos com síndrome linfoproliferativa — expansão de população linfoide madura.',
    pistas: ['Linfocitose com linfócitos atípicos/anormais.', 'A matriz desloca a nuvem linfocitária e dispara o flag.'],
    parametros: [
      {nome: 'Linfócitos', tendencia: '↑', nota: 'expansão linfoide'},
      {nome: 'WBC', tendencia: '↑', nota: 'linfocitose'},
    ],
    flags: ['Lymphocytosis', 'Atypical Lympho?'],
    histograma: 'A população linfoide clonal desloca a nuvem na matriz; o flag de linfócito atípico orienta a revisão.',
    cellavision: ['Linfócitos atípicos / de aspecto monótono', 'Possíveis células com nucléolo / fendas conforme o subtipo'],
    aprendizado: 'As síndromes linfoproliferativas crônicas (LLC, linfomas leucemizados, leucemia prolinfocítica, tricoleucemia…) compartilham a linfocitose, mas a morfologia + imunofenotipagem separam os subtipos. O hemograma é o primeiro fio do novelo.',
    quiz: [
      {p: 'Diante de linfocitose persistente em idoso, o próximo passo laboratorial-chave é:', opcoes: ['Ignorar', 'Revisão de lâmina + imunofenotipagem', 'Repetir só a glicemia', 'Dosar ferro apenas'], correta: 1, explica: 'A imunofenotipagem (citometria de fluxo) caracteriza o clone e distingue os subtipos de síndrome linfoproliferativa.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/int/healthcare/chase-the-case/chase-the-case-20-lymphoproliferative-syndrome/',
  },

  /* ----------------------------------------------------------------- SÓLIDOS */
  {
    id: 'c18', numero: '18', patologia: 'Câncer de Pulmão (no hemograma)', track: 'solidos', dificuldade: 2,
    realData: false, equipamento: ['Yumizen H2500', 'CellaVision DC-1'],
    contexto: 'Câncer de pulmão — quando uma neoplasia sólida deixa rastros no hemograma.',
    pistas: ['Reação leucoeritroblástica: NRBC + desvio à esquerda + dacriócitos.', 'Pode haver anemia de doença crônica e trombocitose reativa.'],
    parametros: [
      {nome: 'NRBC', tendencia: '↑', nota: 'eritroblastos circulantes (infiltração medular)'},
      {nome: 'Plaquetas', tendencia: '↑', nota: 'trombocitose reativa possível'},
      {nome: 'Hb', tendencia: '↓', nota: 'anemia de doença crônica'},
    ],
    flags: ['NRBC', 'Left shift', 'RBC abnormal'],
    histograma: 'O quadro leucoeritroblástico mostra NRBC + granulócitos imaturos — a matriz e o flag de NRBC chamam atenção para infiltração medular.',
    cellavision: ['Dacriócitos (hemácias em lágrima)', 'Eritroblastos', 'Granulócitos imaturos (reação leucoeritroblástica)'],
    aprendizado: 'Um padrão leucoeritroblástico (NRBC + imaturos + dacriócitos) sem leucemia óbvia deve levantar a suspeita de mielofibrose ou infiltração medular por tumor sólido (ex.: pulmão). O hemograma vira pista de uma doença que não nasceu no sangue.',
    quiz: [
      {p: 'A "reação leucoeritroblástica" é caracterizada por:', opcoes: ['Só plaquetas baixas', 'NRBC + granulócitos imaturos + dacriócitos no sangue', 'Eosinofilia isolada', 'Hb alta'], correta: 1, explica: 'É a saída de precursores eritroides e mieloides para o sangue — sugere infiltração/estresse medular (tumor, mielofibrose).'},
      {p: 'Um padrão leucoeritroblástico sem leucemia deve fazer pensar em:', opcoes: ['Gripe comum', 'Infiltração medular (tumor sólido) ou mielofibrose', 'Desidratação leve', 'Alergia'], correta: 1, explica: 'A medula "espremida" por fibrose ou metástase libera precursores imaturos — pista para investigar a causa de base.'},
    ],
    assets: { matriz: '', histograma: '', lamina: '' },
    fonte: 'https://www.horiba.com/usa/healthcare/news/news-press-release/detail/news/2/2023/lung-cancer-clinical-cases-of-yumizen-h2500-hematology-analyzers-chase-the-case-18/',
  },
];
