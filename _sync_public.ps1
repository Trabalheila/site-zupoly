$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)

# 1) Gera public/index.html a partir da raiz, ajustando caminhos (public/ e' a raiz web)
$html = [System.IO.File]::ReadAllText('index.html', $utf8)
# Remove o prefixo public/ dos caminhos relativos (src/href/data-src/data-full="public/...)
$html = $html.Replace('"public/', '"')
# Corrige a imagem OG/JSON-LD (dominio correto e sem /public/)
$html = $html.Replace('https://www.zupoly.com.br/public/logo.png', 'https://www.zupolyprojetos.com.br/logo.png')
[System.IO.File]::WriteAllText('public/index.html', $html, $utf8)
Write-Output 'public/index.html gerado'

# 2) Copia assets/ para public/assets/
if (Test-Path 'public/assets') { Remove-Item 'public/assets' -Recurse -Force }
Copy-Item 'assets' 'public/assets' -Recurse -Force
Write-Output 'assets copiado para public/assets'

# 3) Ajusta o caminho da imagem de fundo do hero no style.css de public (raiz = public)
$css = [System.IO.File]::ReadAllText('public/assets/css/style.css', $utf8)
$css = $css.Replace("url('../../public/industrial.jpg')", "url('../../industrial.jpg')")
[System.IO.File]::WriteAllText('public/assets/css/style.css', $css, $utf8)
Write-Output 'style.css do hero ajustado em public'

# 4) Copia manifest.json para public (referenciado pelo HTML)
if (Test-Path 'manifest.json') { Copy-Item 'manifest.json' 'public/manifest.json' -Force; Write-Output 'manifest.json copiado' }

Write-Output 'DONE'
