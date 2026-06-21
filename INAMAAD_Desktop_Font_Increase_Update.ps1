# INAMAAD Desktop Font Increase Update
# This does NOT replace index.tsx.
# It updates index.css only.
# It increases the small/compact fonts on PC/desktop only and keeps mobile sizing unchanged.

$ErrorActionPreference = "Stop"

$ProjectPath = "C:\Users\user pc\Desktop\inamaad-enterprise"
$CssFile = Join-Path $ProjectPath "index.css"

if (!(Test-Path $ProjectPath)) {
  throw "Project folder not found: $ProjectPath"
}

if (!(Test-Path $CssFile)) {
  throw "index.css not found here: $CssFile"
}

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = Join-Path $ProjectPath "index-before-desktop-font-increase-$Timestamp.css"

Copy-Item $CssFile $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Content = Get-Content $CssFile -Raw

# Remove previous desktop-only font increase block if already applied.
$Content = [regex]::Replace(
  $Content,
  "/\* INAMAAD_DESKTOP_FONT_INCREASE_START \*/[\s\S]*?/\* INAMAAD_DESKTOP_FONT_INCREASE_END \*/",
  "",
  "IgnoreCase"
).TrimEnd()

$DesktopFontUpdate = @'

/* INAMAAD_DESKTOP_FONT_INCREASE_START */
/* PC/Desktop only: increase compact fonts slightly while leaving mobile untouched. */

@media (min-width: 769px) {
  html {
    font-size: 15px;
  }

  body {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  #root,
  #root button,
  #root input,
  #root textarea,
  #root select {
    font-size: 0.95rem;
  }

  #root nav,
  #root header,
  #root footer,
  #root form,
  #root .rounded-2xl,
  #root .rounded-3xl {
    font-size: 0.9rem;
  }

  #root .text-xs { font-size: 0.74rem !important; line-height: 1.05rem !important; }
  #root .text-sm { font-size: 0.86rem !important; line-height: 1.35rem !important; }
  #root .text-base { font-size: 0.95rem !important; line-height: 1.55rem !important; }
  #root .text-lg { font-size: 1.08rem !important; line-height: 1.65rem !important; }
  #root .text-xl { font-size: 1.2rem !important; line-height: 1.8rem !important; }
  #root .text-2xl { font-size: 1.38rem !important; line-height: 2rem !important; }
  #root .text-3xl { font-size: 1.65rem !important; line-height: 2.2rem !important; }
  #root .text-4xl { font-size: 2rem !important; line-height: 2.45rem !important; }
  #root .text-5xl { font-size: 2.35rem !important; line-height: 2.75rem !important; }
  #root .text-6xl { font-size: 2.7rem !important; line-height: 3.1rem !important; }
  #root .text-7xl { font-size: 3.15rem !important; line-height: 3.55rem !important; }
  #root .text-8xl { font-size: 3.55rem !important; line-height: 4rem !important; }
  #root .text-9xl { font-size: 3.95rem !important; line-height: 4.45rem !important; }

  #root h1 {
    font-size: clamp(2.35rem, 4.9vw, 4rem) !important;
    line-height: 1.02 !important;
  }

  #root h2 {
    font-size: clamp(1.7rem, 3.3vw, 2.7rem) !important;
    line-height: 1.1 !important;
  }

  #root h3 {
    font-size: clamp(1.25rem, 2.2vw, 1.8rem) !important;
    line-height: 1.18 !important;
  }

  #root h4,
  #root h5,
  #root h6 {
    font-size: clamp(1.05rem, 1.55vw, 1.35rem) !important;
    line-height: 1.25 !important;
  }

  #root button,
  #root input,
  #root textarea,
  #root select {
    font-size: 0.92rem !important;
  }
}

/* INAMAAD_DESKTOP_FONT_INCREASE_END */
'@

$Content = $Content + $DesktopFontUpdate

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($CssFile, $Content, $Utf8NoBom)

Write-Host "Desktop-only font increase added to index.css." -ForegroundColor Green

Set-Location $ProjectPath
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $CssFile -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Run npm run dev to preview, then deploy." -ForegroundColor Green
