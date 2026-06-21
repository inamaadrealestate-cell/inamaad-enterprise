# INAMAAD Minimum Font Size Update
# This does NOT replace index.tsx.
# It updates index.css only, makes the whole website typography more compact,
# and keeps the site professional/readable on desktop, tablet, and mobile.

$ErrorActionPreference = "Stop"

$ProjectPath = "C:\Users\user pc\Desktop\inamaad-enterprise"
$CssFile = Join-Path $ProjectPath "index.css"

if (!(Test-Path $ProjectPath)) {
  throw "Project folder not found: $ProjectPath"
}

if (!(Test-Path $CssFile)) {
  New-Item -ItemType File -Path $CssFile -Force | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = Join-Path $ProjectPath "index-before-minimum-font-size-$Timestamp.css"

Copy-Item $CssFile $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Content = Get-Content $CssFile -Raw

$Content = [regex]::Replace(
  $Content,
  "/\* INAMAAD_MINIMUM_FONT_SIZE_UPDATE_START \*/[\s\S]*?/\* INAMAAD_MINIMUM_FONT_SIZE_UPDATE_END \*/",
  "",
  "IgnoreCase"
).TrimEnd()

$FontUpdate = @'

/* INAMAAD_MINIMUM_FONT_SIZE_UPDATE_START */
/* Compact premium typography update: smaller fonts across the website without breaking layout. */

:root {
  --inamaad-font-compact-scale: 0.88;
}

html {
  font-size: 14px;
  text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}

body {
  font-size: 0.875rem;
  line-height: 1.55;
}

#root,
#root button,
#root input,
#root textarea,
#root select {
  font-size: 0.875rem;
}

#root p,
#root li,
#root label,
#root span {
  line-height: 1.55;
}

#root .text-xs { font-size: 0.68rem !important; line-height: 1rem !important; }
#root .text-sm { font-size: 0.78rem !important; line-height: 1.25rem !important; }
#root .text-base { font-size: 0.875rem !important; line-height: 1.45rem !important; }
#root .text-lg { font-size: 0.98rem !important; line-height: 1.55rem !important; }
#root .text-xl { font-size: 1.08rem !important; line-height: 1.65rem !important; }
#root .text-2xl { font-size: 1.22rem !important; line-height: 1.85rem !important; }
#root .text-3xl { font-size: 1.45rem !important; line-height: 2rem !important; }
#root .text-4xl { font-size: 1.75rem !important; line-height: 2.2rem !important; }
#root .text-5xl { font-size: 2.05rem !important; line-height: 2.45rem !important; }
#root .text-6xl { font-size: 2.35rem !important; line-height: 2.75rem !important; }
#root .text-7xl { font-size: 2.8rem !important; line-height: 3.15rem !important; }
#root .text-8xl { font-size: 3.15rem !important; line-height: 3.55rem !important; }
#root .text-9xl { font-size: 3.5rem !important; line-height: 3.95rem !important; }

#root h1 {
  font-size: clamp(2rem, 4.5vw, 3.45rem) !important;
  line-height: 1.02 !important;
}

#root h2 {
  font-size: clamp(1.45rem, 3vw, 2.35rem) !important;
  line-height: 1.1 !important;
}

#root h3 {
  font-size: clamp(1.1rem, 2vw, 1.55rem) !important;
  line-height: 1.18 !important;
}

#root h4,
#root h5,
#root h6 {
  font-size: clamp(0.95rem, 1.4vw, 1.2rem) !important;
  line-height: 1.25 !important;
}

#root nav,
#root header,
#root footer,
#root form,
#root .rounded-2xl,
#root .rounded-3xl {
  font-size: 0.82rem;
}

#root button,
#root a,
#root input,
#root textarea,
#root select {
  letter-spacing: -0.01em;
}

@media (max-width: 768px) {
  html {
    font-size: 13px;
  }

  #root {
    font-size: 0.82rem;
  }

  #root h1 {
    font-size: clamp(1.65rem, 8vw, 2.35rem) !important;
    line-height: 1.05 !important;
  }

  #root h2 {
    font-size: clamp(1.25rem, 6vw, 1.75rem) !important;
    line-height: 1.12 !important;
  }

  #root h3 {
    font-size: clamp(1rem, 4.5vw, 1.28rem) !important;
    line-height: 1.18 !important;
  }

  #root .text-5xl,
  #root .text-6xl,
  #root .text-7xl,
  #root .text-8xl,
  #root .text-9xl {
    font-size: clamp(1.8rem, 8vw, 2.45rem) !important;
    line-height: 1.08 !important;
  }

  #root .text-3xl,
  #root .text-4xl {
    font-size: clamp(1.3rem, 6vw, 1.8rem) !important;
    line-height: 1.14 !important;
  }

  #root button,
  #root input,
  #root textarea,
  #root select {
    font-size: 0.82rem !important;
  }
}

@media (max-width: 420px) {
  html {
    font-size: 12.5px;
  }

  #root .text-xs { font-size: 0.66rem !important; }
  #root .text-sm { font-size: 0.74rem !important; }
  #root .text-base { font-size: 0.82rem !important; }

  #root h1 {
    font-size: clamp(1.45rem, 8.5vw, 2.05rem) !important;
  }
}

/* INAMAAD_MINIMUM_FONT_SIZE_UPDATE_END */
'@

$Content = $Content + $FontUpdate

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($CssFile, $Content, $Utf8NoBom)

Write-Host "Minimum font-size update added to index.css." -ForegroundColor Green

Set-Location $ProjectPath
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $CssFile -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Run npm run dev to preview, then deploy." -ForegroundColor Green
