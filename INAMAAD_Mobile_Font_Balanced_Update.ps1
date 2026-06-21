# INAMAAD Mobile Font Balanced Increase
# This does NOT replace index.tsx.
# It updates index.css only.
# It makes mobile fonts bigger than the current small/minimum size,
# but keeps them controlled so the mobile layout does not become too large.

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
$BackupFile = Join-Path $ProjectPath "index-before-mobile-font-balanced-$Timestamp.css"

Copy-Item $CssFile $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Content = Get-Content $CssFile -Raw

# Remove previous mobile font sizing override blocks so they do not fight each other.
$Content = [regex]::Replace(
  $Content,
  "/\* INAMAAD_MOBILE_FONT_SMALL_START \*/[\s\S]*?/\* INAMAAD_MOBILE_FONT_SMALL_END \*/",
  "",
  "IgnoreCase"
).TrimEnd()

$Content = [regex]::Replace(
  $Content,
  "/\* INAMAAD_MOBILE_FONT_BALANCED_START \*/[\s\S]*?/\* INAMAAD_MOBILE_FONT_BALANCED_END \*/",
  "",
  "IgnoreCase"
).TrimEnd()

$MobileFontUpdate = @'

/* INAMAAD_MOBILE_FONT_BALANCED_START */
/* Mobile only: balanced bigger font size. Bigger than small, not too large. */

@media (max-width: 768px) {
  html {
    font-size: 15px;
  }

  body {
    font-size: 0.96rem;
    line-height: 1.62;
  }

  #root {
    font-size: 0.96rem;
  }

  #root,
  #root button,
  #root input,
  #root textarea,
  #root select {
    font-size: 0.96rem;
  }

  #root p,
  #root li,
  #root label,
  #root span {
    line-height: 1.62;
  }

  #root .text-xs { font-size: 0.78rem !important; line-height: 1.12rem !important; }
  #root .text-sm { font-size: 0.9rem !important; line-height: 1.42rem !important; }
  #root .text-base { font-size: 0.98rem !important; line-height: 1.6rem !important; }
  #root .text-lg { font-size: 1.12rem !important; line-height: 1.72rem !important; }
  #root .text-xl { font-size: 1.25rem !important; line-height: 1.85rem !important; }
  #root .text-2xl { font-size: 1.42rem !important; line-height: 2rem !important; }
  #root .text-3xl { font-size: 1.65rem !important; line-height: 2.18rem !important; }
  #root .text-4xl { font-size: 1.95rem !important; line-height: 2.38rem !important; }

  #root .text-5xl,
  #root .text-6xl,
  #root .text-7xl,
  #root .text-8xl,
  #root .text-9xl {
    font-size: clamp(2.15rem, 9vw, 3rem) !important;
    line-height: 1.08 !important;
  }

  #root h1 {
    font-size: clamp(2.05rem, 9vw, 2.95rem) !important;
    line-height: 1.05 !important;
  }

  #root h2 {
    font-size: clamp(1.55rem, 7vw, 2.18rem) !important;
    line-height: 1.12 !important;
  }

  #root h3 {
    font-size: clamp(1.18rem, 5vw, 1.58rem) !important;
    line-height: 1.18 !important;
  }

  #root h4,
  #root h5,
  #root h6 {
    font-size: clamp(1.02rem, 4.2vw, 1.25rem) !important;
    line-height: 1.25 !important;
  }

  #root nav,
  #root header,
  #root footer,
  #root form,
  #root .rounded-2xl,
  #root .rounded-3xl {
    font-size: 0.93rem;
  }

  #root button,
  #root input,
  #root textarea,
  #root select {
    font-size: 0.94rem !important;
  }
}

@media (max-width: 420px) {
  html {
    font-size: 14px;
  }

  #root {
    font-size: 0.92rem;
  }

  #root .text-xs { font-size: 0.74rem !important; }
  #root .text-sm { font-size: 0.86rem !important; }
  #root .text-base { font-size: 0.94rem !important; }

  #root h1 {
    font-size: clamp(1.82rem, 9vw, 2.48rem) !important;
  }

  #root h2 {
    font-size: clamp(1.38rem, 7vw, 1.95rem) !important;
  }
}

/* INAMAAD_MOBILE_FONT_BALANCED_END */
'@

$Content = $Content + $MobileFontUpdate

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($CssFile, $Content, $Utf8NoBom)

Write-Host "Mobile font updated to balanced bigger size in index.css." -ForegroundColor Green

Set-Location $ProjectPath
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $CssFile -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Run npm run dev to preview, then deploy." -ForegroundColor Green
