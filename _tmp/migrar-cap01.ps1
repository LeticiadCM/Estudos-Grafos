$ErrorActionPreference = 'Stop'
$base = 'c:\Users\letic\ProjetoPar\plataforma'
$src  = Join-Path $base 'grafos-definicoes-iniciais.html'
$dst  = Join-Path $base 'grafos\01-definicoes-e-grau.html'

$h = [System.IO.File]::ReadAllText($src, [System.Text.Encoding]::UTF8)

# 1) CSS embutido do head -> folha compartilhada
$h = [regex]::Replace($h, '(?s)<style>.*?</style>', '<link rel="stylesheet" href="assets/grafos.css">', 1)

# 2) o <style> de uma linha que ficou no corpo -> removido (ja esta na folha)
$h = $h -replace '(?s)\s*<style>\.side a\.on\{[^<]*</style>', ''

# 3) JS embutido -> arquivo compartilhado
$h = [regex]::Replace($h, '(?s)<script>.*?</script>', '<script src="assets/grafos.js"></script>', 1)

# 4) marca da barra superior passa a linkar o indice
$h = $h -replace '<span class="brandmark"><span class="dot"></span>Teoria dos Grafos · Notas de aula</span>',
                 '<a class="brandmark" href="index.html"><span class="dot"></span>Teoria dos Grafos · Notas de aula</a>'

# 5) navegacao entre capitulos antes do fim do conteudo
$nav = @'
      <nav class="chapnav" aria-label="Navegação entre capítulos">
        <a href="index.html"><span class="dir">Índice</span><span class="ttl">Todos os capítulos</span></a>
        <a class="next" href="02-subgrafos-cliques-bipartidos.html"><span class="dir">Próximo capítulo</span><span class="ttl">2. Subgrafos, cliques, conjuntos independentes e cortes</span></a>
      </nav>

'@
$h = $h -replace '(?s)(\s*)<footer class="pg">', ($nav + '      <footer class="pg">')

# 6) o rodape ganha link para o indice
$h = $h -replace 'Página estática, sem dependências externas — funciona offline e imprime com todas as respostas abertas\.',
                 'Página estática, sem dependências externas — funciona offline e imprime com todas as respostas abertas. <a href="index.html">Voltar ao índice</a>.'

[System.IO.File]::WriteAllText($dst, $h, (New-Object System.Text.UTF8Encoding($false)))
Remove-Item $src -Force

"gerado: $dst"
$t = [System.IO.File]::ReadAllText($dst, [System.Text.Encoding]::UTF8)
"link css:     " + ([regex]::Matches($t,'assets/grafos\.css')).Count
"link js:      " + ([regex]::Matches($t,'assets/grafos\.js')).Count
"style inline: " + ([regex]::Matches($t,'<style')).Count
"script inline:" + ([regex]::Matches($t,'<script(?!\s+src)')).Count
"chapnav:      " + ([regex]::Matches($t,'class="chapnav"')).Count
