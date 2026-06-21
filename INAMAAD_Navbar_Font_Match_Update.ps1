# INAMAAD Navbar Font Match Update
# This does NOT replace index.tsx.
# It updates index.css only.
# It makes the navbar font size match the clean screenshot style:
# professional, readable, not oversized.

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
$BackupFile = Join-Path $ProjectPath "index-before-navbar-font-match-$Timestamp.css"

Copy-Item $CssFile $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Content = Get-Content $CssFile -Raw

# Remove old navbar font block if already applied.
$Content = [regex]::Replace(
  $Content,
  "/\* INAMAAD_NAVBAR_FONT_MATCH_START \*/[\s\S]*?/\* INAMAAD_NAVBAR_FONT_MATCH_END \*/",
  "",
  "IgnoreCase"
).TrimEnd()

$NavbarFontUpdate = @'

/* INAMAAD_NAVBAR_FONT_MATCH_START */
/* Navbar font match: clean Bolt-style navbar sizing, only affects the navbar/header area. */

@media (min-width: 769px) {
  #root header,
  #root nav {
    font-size: 16px !important;
  }

  /* Desktop nav links: Home, Properties, JV Deals, About, Contact */
  #root header nav a,
  #root header nav button,
  #root nav a,
  #root nav button {
    font-size: 16px !important;
    line-height: 24px !important;
    font-weight: 650 !important;
    letter-spacing: -0.01em !important;
  }

  /* Desktop Sign In / Get Started buttons */
  #root header > div a,
  #root header > div button,
  #root header button,
  #root header a {
    font-size: 16px !important;
    line-height: 24px !important;
  }

  /* Brand text: INAMAAD */
  #root header .text-xl,
  #root header .text-2xl,
  #root nav .text-xl,
  #root nav .text-2xl {
    font-size: 22px !important;
    line-height: 28px !important;
    font-weight: 900 !important;
    letter-spacing: -0.03em !important;
  }

  /* Small badge/icon text inside navbar should not shrink too much */
  #root header .text-xs,
  #root header .text-sm,
  #root nav .text-xs,
  #root nav .text-sm {
    font-size: 15px !important;
    line-height: 22px !important;
  }
}

@media (max-width: 768px) {
  #root header,
  #root nav {
    font-size: 15px !important;
  }

  #root header nav a,
  #root header nav button,
  #root nav a,
  #root nav button,
  #root header button,
  #root header a {
    font-size: 15px !important;
    line-height: 22px !important;
    font-weight: 650 !important;
  }

  #root header .text-xl,
  #root header .text-2xl,
  #root nav .text-xl,
  #root nav .text-2xl {
    font-size: 20px !important;
    line-height: 26px !important;
    font-weight: 900 !important;
  }

  #root header .text-xs,
  #root header .text-sm,
  #root nav .text-xs,
  #root nav .text-sm {
    font-size: 14px !important;
    line-height: 20px !important;
  }
}

@media (max-width: 420px) {
  #root header nav a,
  #root header nav button,
  #root nav a,
  #root nav button,
  #root header button,
  #root header a {
    font-size: 14px !important;
    line-height: 20px !important;
  }

  #root header .text-xl,
  #root header .text-2xl,
  #root nav .text-xl,
  #root nav .text-2xl {
    font-size: 18px !important;
    line-height: 24px !important;
  }
}

/* INAMAAD_NAVBAR_FONT_MATCH_END */
'@

$Content = $Content + $NavbarFontUpdate

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($CssFile, $Content, $Utf8NoBom)

Write-Host "Navbar font size matched to the screenshot style." -ForegroundColor Green

Set-Location $ProjectPath
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $CssFile -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Preview with npm run dev, then deploy." -ForegroundColor Green
