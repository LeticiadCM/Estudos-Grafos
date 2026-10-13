# Especificação — capítulos das notas de Teoria dos Grafos

Você vai produzir **um capítulo** de um material didático em HTML, em português do Brasil,
derivado das notas de Teoria dos Grafos (CI065 / BC1429) do Prof. Jair Donadelli.

O material já tem um capítulo pronto (`grafos/01-definicoes-e-grau.html`) que define o padrão.
Siga esta especificação à risca: todos os capítulos precisam parecer escritos pela mesma pessoa,
no mesmo dia.

---

## 1. Objetivo pedagógico (o mais importante)

O original é um texto denso, gerado por LaTeX, onde os exercícios aparecem logo depois de
definições secas. Nesta versão, para cada bloco de exercícios:

1. **Antes do bloco vem a teoria**, reescrita para ser clara e prática: a intuição primeiro,
   depois a definição formal, depois exemplos resolvidos e "receitas" de resolução.
   A teoria deve conter **exatamente o que aquele bloco de exercícios exige** — nem menos
   (o aluno não deve precisar de outra fonte) nem um passeio enciclopédico.
2. **Cada exercício traz um botão que exibe/oculta a resposta completa.** A resposta é uma
   resolução comentada, com o raciocínio, não só o resultado final.

Três recursos que funcionam muito bem e devem aparecer várias vezes por capítulo:

- **Caixas "receita"** (`box rec`): passo a passo de "como atacar esse tipo de exercício".
- **Caixas "atenção"** (`box warn`): o erro clássico, a convenção que muda de livro para livro,
  a hipótese que não pode ser esquecida.
- **Tabelas de vocabulário** e **exemplos numéricos conferidos** ("conferência: a soma dá 24 = 2·12 ✔").

Tom: direto, adulto, sem infantilização e sem emoji. Frases curtas. Explique *por que*
a definição é como é, não apenas o que ela diz.

---

## 2. Fonte do conteúdo

Seu material de origem é o arquivo indicado no seu prompt, em `grafos/_fonte/capNN.txt`.
Ele foi extraído automaticamente do HTML original, então:

- `[[ ... ]]` marca uma **fórmula** que no original era uma imagem; o conteúdo é o texto
  alternativo, em ASCII aproximado (ex.: `[[ sum_{u in V} d(u) = 2|E(G)| ]]`).
  Você deve **reescrever essas fórmulas em HTML** conforme a seção 5 desta especificação.
- `[FIGURA: diagrama no original, sem texto alternativo]` marca um **diagrama que não pôde ser
  extraído**. Nesse caso: se o texto ao redor determina o grafo, redesenhe-o em SVG; se não
  determina, **construa um exemplo equivalente seu**, coerente com o enunciado, e diga na legenda
  que é um exemplo construído para esta versão. Nunca finja citar uma figura que o leitor não vê.
- Pseudocódigos saíram fragmentados. Reconstitua-os como algoritmos legíveis e corretos
  (são algoritmos clássicos: BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal, Prim,
  Edmonds, Fleury). Mantenha a estrutura do original quando der para reconhecê-la.
- Referências cruzadas do original ("veja o exercício 12.16, na página 13") devem ser
  **reescritas** de forma útil ("veja o exercício 16 do capítulo 1") ou removidas.

**Enunciados dos exercícios:** preserve o conteúdo matemático fielmente. Pode corrigir erros
evidentes de digitação do original e melhorar a pontuação, mas não mude o que está sendo pedido
nem a numeração.

---

## 3. Arquivo a produzir

Escreva **um único arquivo**, no caminho exato informado no seu prompt, dentro de
`c:\Users\letic\ProjetoPar\plataforma\grafos\`.

- Codificação UTF-8, `<html lang="pt-BR">`.
- **Zero dependências externas**: nenhum CDN, nenhuma fonte remota, nenhuma imagem externa.
  Todos os diagramas são SVG inline. A página tem de funcionar offline, com duplo clique.
- O CSS e o JS são **compartilhados** e já existem. Use exatamente:
  `<link rel="stylesheet" href="assets/grafos.css">` no `<head>` e
  `<script src="assets/grafos.js"></script>` antes do fim do `<body>`.
  **Não escreva CSS nem JavaScript novo.** Se precisar de um detalhe visual que não existe,
  resolva com as classes disponíveis ou com atributos SVG inline.

Use `grafos/_tmp/MODELO.html` como ponto de partida: ele tem o esqueleto completo e um exemplo
de cada construção disponível. Copie a estrutura e substitua o conteúdo.

---

## 4. Estrutura da página

Na ordem:

1. `<head>` com `<title>` no formato `N. Título do capítulo — Teoria dos Grafos` e uma
   `<meta name="description">` de uma frase.
2. Barra superior (`.topbar`) idêntica à do modelo, incluindo os botões
   `#allAnswers` e `#themeBtn` e o link da marca para `index.html`.
3. `.hero` com: `.eyebrow` = `Capítulo N · <assunto>`, `<h1>` = título do capítulo,
   `p.lead` de 2 a 4 linhas dizendo o que o leitor vai saber fazer ao terminar, e `.meta`
   com conteúdo coberto, número de exercícios e link para a fonte original
   (`http://professor.ufabc.edu.br/~jair.donadelli/disciplinas-ufpr/ci065/`).
4. `.grid` com `<aside class="side">` (índice lateral) e `<main>`.
   O índice lateral lista **todas** as seções e subseções da página: um `<a>` por `h2`/`h3`
   relevante, usando `class="sub"` para os de segundo nível. **Todo href tem de apontar para um
   id que existe na página** — isso é verificado.
5. Dentro de `<main>`: para cada seção do original, uma `<section class="chapter" id="...">`
   com a teoria, seguida de uma `<section class="chapter" id="exN">` com o bloco de exercícios.
6. `<nav class="chapnav">` com os links anterior/próximo exatos informados no seu prompt.
7. `<footer class="pg">` com o crédito (mesmo texto do modelo, adaptado às seções do capítulo).
8. O botão `#topBtn` e o `<script src="assets/grafos.js"></script>`.

### Bloco de exercícios

```html
<section class="chapter" id="ex1">
  <div class="ex-head">
    <h3>Exercícios 17 a 24</h3>
    <button class="toggle" type="button" data-scope="#ex1" aria-expanded="false">Abrir todas as respostas do bloco <span class="chev">▼</span></button>
    <p class="hint">O que é cobrado: ...</p>
  </div>

  <article class="ex">
    <div class="top"><span class="tagnum">Ex. 17</span><div class="stmt">
      <p>Enunciado...</p>
    </div></div>
    <div class="actions">
      <button class="toggle ghost" type="button" data-target="h17" aria-expanded="false">Dica <span class="chev">▼</span></button>
      <button class="toggle" type="button" data-target="a17" aria-expanded="false">Mostrar resposta <span class="chev">▼</span></button>
    </div>
    <div class="panel hintp" id="h17"><div class="plab">Dica</div>
      <p>...</p>
    </div>
    <div class="panel answer" id="a17"><div class="plab">Resolução</div>
      <p>...</p>
    </div>
  </article>
</section>
```

Regras rígidas dos exercícios:

- **Numeração:** use o número do original. O id da resposta é `a` + número (`a17`), o da dica é
  `h` + número (`h17`), e o rótulo é `Ex. 17`. Assim nada colide.
- O texto dos botões deve ser **exatamente** `Mostrar resposta` e `Dica` (o JS compartilhado
  troca para "Ocultar ..." sozinho, com base nesse texto). Não mude essas strings.
- Todo exercício tem resposta. A **dica é opcional** — inclua nos exercícios difíceis
  (demonstrações, algoritmos), pule nos diretos.
- `aria-expanded="false"` em todos os botões; os painéis **não** levam a classe `open`.
- Se um "exercício" do original é na verdade a apresentação de um algoritmo seguida de uma
  pergunta (comum nos capítulos de algoritmos), coloque o algoritmo **no enunciado** e a
  análise pedida na resposta.

---

## 5. Convenções de matemática

Não há LaTeX nem MathJax. Matemática é HTML com estas classes:

- **Inline:** `<span class="m">|<i>V</i>(<i>G</i>)| + |<i>E</i>(<i>G</i>)|</span>`.
  Variáveis em `<i>`; números, parênteses e operadores fora do `<i>`.
- **Destacada:** `<div class="eq"><div class="body">...</div><div class="tag">(7)</div></div>`
  (a `.tag` é opcional e serve para o número da equação do original).
- **Fração:** `<span class="frac"><span><i>n</i>(<i>n</i>−1)</span><span>2</span></span>`
- **Binomial:** `<span class="binom"><span class="p">(</span><span class="s"><span><i>n</i></span><span>2</span></span><span class="p">)</span></span>`
- **Somatório:** `<span class="sum"><span class="o">∑</span><span class="l"><i>u</i>∈<i>V</i></span></span>`
- **Raiz:** `√<span class="rad">2<i>m</i> + 1</span>`
- **Barra superior** (complemento): `<span class="ovl"><i>G</i></span>`
- Use os caracteres Unicode direto: `∈ ∉ ⊆ ⊂ ∪ ∩ ∅ ≤ ≥ ≠ ≃ ⟹ ⟺ ∑ √ ⌊ ⌋ ⌈ ⌉ Δ δ χ α ω Θ Ω ∞ ·`
- **Decimais com vírgula** (`0,5`), nunca a notação `0{,}5` do LaTeX.
- Complexidade: `<span class="cplx"><i>O</i>(|<i>V</i>| + |<i>E</i>|)</span>`.

## 6. Pseudocódigo

```html
<div class="algo">
  <div class="nome">Busca-em-Largura(G, s)</div>
<pre><span class="cm">// d(v) = distância de s até v; π(v) = predecessor de v</span>
<span class="kw">para cada</span> v ∈ V(G) <span class="kw">faça</span> d(v) ← ∞; π(v) ← nulo
d(s) ← 0; Q ← fila com s
<span class="kw">enquanto</span> Q não está vazia <span class="kw">faça</span>
    u ← remove o primeiro de Q
    <span class="kw">para cada</span> v ∈ N(u) <span class="kw">faça</span>
        <span class="kw">se</span> d(v) = ∞ <span class="kw">então</span> d(v) ← d(u) + 1; π(v) ← u; insere v em Q</pre>
</div>
```

O conteúdo do `<pre>` preserva espaços: indente com 4 espaços por nível.
Sempre que apresentar um algoritmo, diga em seguida, em prosa: o que ele garante (invariante),
por que termina e qual a complexidade.

## 7. Diagramas SVG

Padrão (o CSS compartilhado já estiliza estas classes):

```html
<figure>
  <svg class="dg" viewBox="0 0 400 220" role="img" aria-label="descrição textual do grafo">
    <line class="e" x1="60" y1="50" x2="180" y2="50"/>
    <g class="v"><circle cx="60" cy="50" r="17"/><text x="60" y="50">1</text></g>
    <g class="v open"><circle cx="180" cy="50" r="17"/><text x="180" y="50">2</text></g>
  </svg>
  <figcaption><b>Figura 3.</b> Explicação do que a figura mostra.</figcaption>
</figure>
```

- `viewBox` com largura entre 300 e 560; nunca use `width`/`height` fixos.
- Vértices: `r="15"` a `r="17"`. Desenhe **todas as arestas antes** de todos os vértices,
  para os círculos ficarem por cima.
- Classes de aresta: `e` (normal), `e faint` (secundária), `e match` (destaque verde, para
  emparelhamentos/soluções), `e tree` (destaque azul grosso, para árvores geradoras),
  `e cut` (tracejada vermelha, para cortes).
- Classes de vértice: `v` (cheio), `v open` (vazado), `v hl`, `v hl2`, `v c1`…`v c5` (cores).
- **Pesos nas arestas:** `<text class="peso" x="120" y="44">7</text>`; se o texto ficar sobre a
  linha, ponha antes `<circle class="peso-bg" cx="120" cy="40" r="11"/>`.
- **Arestas dirigidas:** declare uma vez por SVG
  `<defs><marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>`
  e use `<line class="arw" .../>`. Encurte a linha para a seta não entrar no círculo do vértice.
- Sempre acompanhe o diagrama de uma `figcaption` que diga o que observar, e use `.legend`
  quando houver cores com significado.
- Diagramas **legíveis** valem mais que diagramas bonitos: se o grafo tem muitas arestas,
  distribua os vértices num círculo.

## 8. Proibido

- CSS ou JS novo, inline ou em `<style>`/`<script>`; dependências externas; imagens.
- Emoji.
- Inventar resultados. Se um exercício do original é ambíguo ou tem enunciado com erro, resolva a
  leitura mais razoável e **diga isso em uma frase** dentro da resposta
  (ex.: "o enunciado não diz se o grafo é conexo; a afirmação só vale nesse caso, e é assim que
  resolvemos abaixo").
- Respostas vagas do tipo "basta aplicar a definição". Mostre a aplicação.
- Deixar painel de resposta aberto por padrão.

## 9. Autoverificação antes de terminar

Rode este comando (ajustando o nome do arquivo) e corrija o que ele apontar:

```powershell
cd 'c:\Users\letic\ProjetoPar\plataforma\grafos'
$f='SEU-ARQUIVO.html'; $h=Get-Content $f -Raw -Encoding UTF8
foreach($t in 'div','section','article','figure','svg','table','pre','main','aside','nav'){
  $o=([regex]::Matches($h,"<$t[\s>]")).Count; $c=([regex]::Matches($h,"</$t>")).Count
  if($o -ne $c){ "DESBALANCEADO $t : abre=$o fecha=$c" }
}
$tg=[regex]::Matches($h,'data-target="([^"]+)"')|%{$_.Groups[1].Value}
$ids=[regex]::Matches($h,'id="([^"]+)"')|%{$_.Groups[1].Value}
"targets sem painel: " + (($tg|?{$ids -notcontains $_}) -join ', ')
"ids repetidos: " + (($ids|Group-Object|?{$_.Count -gt 1}|%{$_.Name}) -join ', ')
$hr=[regex]::Matches($h,'href="#([^"]+)"')|%{$_.Groups[1].Value}
"links internos quebrados: " + (($hr|?{$ids -notcontains $_}) -join ', ')
"exercicios: " + ([regex]::Matches($h,'class="tagnum"')).Count
"respostas: " + ([regex]::Matches($h,'class="panel answer"')).Count
"paineis abertos por engano: " + ([regex]::Matches($h,'class="panel[^"]*open')).Count
"css/js: " + ([regex]::Matches($h,'assets/grafos\.(css|js)')).Count + " (deve ser 2)"
```

Todas as linhas de erro devem sair vazias, o número de exercícios deve bater com o número de
respostas, e `paineis abertos por engano` deve ser 0.

## 10. Resposta final ao orquestrador

Ao terminar, responda com:
- o caminho do arquivo criado e seu tamanho;
- as seções do original cobertas e a faixa de exercícios (ex.: "§2 e §3, exercícios 17 a 30");
- quantos exercícios, quantas dicas e quantos diagramas SVG;
- a saída da autoverificação;
- qualquer exercício cujo enunciado original esteja truncado/ambíguo e como você resolveu.
