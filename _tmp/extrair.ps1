# Extrai o texto das notas originais preservando as formulas (que no original sao imagens com alt).
$ErrorActionPreference = 'Stop'
$src  = Join-Path $env:TEMP 'ci065.html'
$outd = 'c:\Users\letic\ProjetoPar\plataforma\grafos\_fonte'
New-Item -ItemType Directory -Force -Path $outd | Out-Null

$bytes = [System.IO.File]::ReadAllBytes($src)
$utf8  = [System.Text.Encoding]::UTF8.GetString($bytes)
if ($utf8.IndexOf([char]0xFFFD) -ge 0) {
  $html = [System.Text.Encoding]::GetEncoding('iso-8859-1').GetString($bytes)
  $enc = 'iso-8859-1'
} else { $html = $utf8; $enc = 'utf-8' }
"codificacao detectada: $enc"

# formulas: <img ... alt="..."> -> texto delimitado
$html = [regex]::Replace($html, '(?s)<img[^>]*?alt="(.*?)"[^>]*?>', {
  param($m)
  $a = $m.Groups[1].Value
  if ($a -eq 'PIC') { "`n[FIGURA: diagrama no original, sem texto alternativo]`n" }
  else { "`n[[ " + $a + " ]]`n" }
})

# marcadores de titulo
$html = $html -replace '(?s)<h3 class="sectionHead">',          "@@SEC@@`n"
$html = $html -replace '(?s)<h4 class="subsectionHead">',       "@@SUB@@`n"
$html = $html -replace '(?s)<h5 class="subsubsectionHead">',    "@@SSUB@@`n"
$html = $html -replace '(?s)<h2 class="likesectionHead">',      "@@SEC@@`n"

# estrutura basica
$html = $html -replace '(?s)<li class="[^"]*">', "`n  - "
$html = $html -replace '(?s)<br\s*/?>', "`n"
$html = $html -replace '(?s)<p class="[^"]*"\s*>', "`n`n"
$html = $html -replace '(?s)<div class="newtheorem">', "`n`n"

# remove o resto das tags e decodifica entidades
$html = [regex]::Replace($html, '(?s)<[^>]+>', '')
$html = [System.Net.WebUtility]::HtmlDecode($html)

# limpeza de espacos
$html = $html -replace "\u00A0", ' '
$html = $html -replace '[ \t]{2,}', ' '
$html = $html -replace '(\r?\n)[ \t]+', "`n"
$html = $html -replace '(\r?\n){3,}', "`n`n"

$full = Join-Path $outd 'notas-completas.txt'
Set-Content -Path $full -Value $html -Encoding UTF8
"arquivo completo: $full ($([math]::Round((Get-Item $full).Length/1kb,1)) KB)"

# mapa secao -> capitulo
$mapa = @{
  1='cap01'; 2='cap02'; 3='cap02'; 4='cap03'; 5='cap03'; 6='cap04'; 7='cap05'; 8='cap05'
  9='cap06'; 10='cap06'; 11='cap06'; 12='cap07'; 13='cap07'; 14='cap08'; 15='cap08'; 16='cap08'
  17='cap09'; 18='cap09'; 19='cap09'; 20='cap10'; 21='cap10'; 22='cap11'
}
$buf = @{}
$atual = 0
foreach ($chunk in ($html -split '@@SEC@@')) {
  $titulo = ($chunk -split "`n" | Where-Object { $_.Trim() -ne '' } | Select-Object -First 1)
  if ($null -eq $titulo) { continue }
  if ($titulo -match '^\s*(\d+)\.') { $atual = [int]$matches[1] }
  if ($atual -eq 0) { continue }
  $cap = $mapa[$atual]
  if (-not $cap) { continue }
  if (-not $buf.ContainsKey($cap)) { $buf[$cap] = New-Object System.Text.StringBuilder }
  [void]$buf[$cap].AppendLine("=== " + $titulo.Trim() + " ===")
  [void]$buf[$cap].AppendLine($chunk)
  [void]$buf[$cap].AppendLine()
}
foreach ($cap in ($buf.Keys | Sort-Object)) {
  $p = Join-Path $outd "$cap.txt"
  Set-Content -Path $p -Value $buf[$cap].ToString() -Encoding UTF8
  $n = ([regex]::Matches($buf[$cap].ToString(), 'Exerc\u00edcio\s+\d+\.')).Count
  "$cap : $([math]::Round((Get-Item $p).Length/1kb,1)) KB, ~$n exercicios"
}
