# INAMAAD Compact Navbar No-Wrap Fix
# Updates index.css only.
# Fixes:
# - "JV Deals" stays on one line
# - "Sign Out" stays on one line
# - Sign In / Get Started stay on one line
# - Navbar font only is reduced
# - Removes older navbar font force blocks that were making it too large

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
$BackupFile = Join-Path $ProjectPath "index-before-compact-navbar-nowrap-$Timestamp.css"

Copy-Item $CssFile $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Content = Get-Content $CssFile -Raw

# Remove older navbar blocks so they do not fight this compact fix.
$PatternsToRemove = @(
  "/\* INAMAAD_NAVBAR_FONT_MATCH_START \*/[\s\S]*?/\* INAMAAD_NAVBAR_FONT_MATCH_END \*/",
  "/\* INAMAAD_STRONG_NAVBAR_FONT_FORCE_START \*/[\s\S]*?/\* INAMAAD_STRONG_NAVBAR_FONT_FORCE_END \*/",
  "/\* INAMAAD_COMPACT_NAVBAR_NOWRAP_START \*/[\s\S]*?/\* INAMAAD_COMPACT_NAVBAR_NOWRAP_END \*/"
)

foreach ($Pattern in $PatternsToRemove) {
  $Content = [regex]::Replace($Content, $Pattern, "", "IgnoreCase")
}

$Content = $Content.TrimEnd()

$NavbarFix = @'

/* INAMAAD_COMPACT_NAVBAR_NOWRAP_START */
/* Navbar-only compact fix: keeps JV Deals, Sign In, Sign Out and Get Started on one line. */

/* Header layout should stay one row on desktop */
html body #root header.sticky > div {
  gap: 14px !important;
}

/* Desktop main navbar */
html body #root header.sticky > div > nav {
  gap: 14px !important;
  flex-wrap: nowrap !important;
  white-space: nowrap !important;
}

/* Desktop links: Home, Properties, Calculator, JV Deals, About, Contact */
html body #root header.sticky > div > nav a {
  white-space: nowrap !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
  flex-shrink: 0 !important;
  font-size: 14px !important;
  line-height: 20px !important;
  font-weight: 650 !important;
  letter-spacing: -0.01em !important;
}

/* Active Home pill should be compact */
html body #root header.sticky > div > nav a:first-child {
  padding: 9px 13px !important;
  border-radius: 11px !important;
}

/* Desktop auth area */
html body #root header.sticky > div > div.hidden {
  gap: 10px !important;
  flex-wrap: nowrap !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

/* Sign In, Sign Out, logged-in text, Get Started */
html body #root header.sticky > div > div.hidden button,
html body #root header.sticky > div > div.hidden p {
  white-space: nowrap !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
  flex-shrink: 0 !important;
  font-size: 14px !important;
  line-height: 20px !important;
}

/* Get Started button compact */
html body #root header.sticky > div > div.hidden button:last-child {
  padding: 9px 14px !important;
  border-radius: 11px !important;
  font-size: 14px !important;
  line-height: 20px !important;
}

/* If user is logged in, keep email + Sign Out in a row where possible */
html body #root header.sticky > div > div.hidden > div {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  flex-wrap: nowrap !important;
  white-space: nowrap !important;
}

/* Logo is part of navbar, keep it professional but not oversized */
html body #root header.sticky > div > a {
  flex-shrink: 0 !important;
}

html body #root header.sticky > div > a > div:nth-child(2) > div:first-child {
  font-size: 16px !important;
  line-height: 22px !important;
  letter-spacing: -0.01em !important;
}

html body #root header.sticky > div > a > div:nth-child(2) > div:nth-child(2) {
  font-size: 10px !important;
  line-height: 14px !important;
}

/* Tablet/medium desktop: make navbar even tighter before mobile menu starts */
@media (min-width: 1024px) and (max-width: 1180px) {
  html body #root header.sticky > div {
    padding-left: 20px !important;
    padding-right: 20px !important;
    gap: 10px !important;
  }

  html body #root header.sticky > div > nav {
    gap: 10px !important;
  }

  html body #root header.sticky > div > nav a,
  html body #root header.sticky > div > div.hidden button,
  html body #root header.sticky > div > div.hidden p {
    font-size: 13px !important;
    line-height: 19px !important;
  }

  html body #root header.sticky > div > nav a:first-child,
  html body #root header.sticky > div > div.hidden button:last-child {
    padding: 8px 11px !important;
  }

  html body #root header.sticky > div > a > div:nth-child(2) > div:first-child {
    font-size: 15px !important;
  }

  html body #root header.sticky > div > a > div:nth-child(2) > div:nth-child(2) {
    font-size: 9px !important;
  }
}

/* Mobile menu text also must not split words */
@media (max-width: 1023px) {
  html body #root header.sticky > div > button {
    white-space: nowrap !important;
    font-size: 13px !important;
    line-height: 19px !important;
  }

  html body #root header.sticky > div + div a,
  html body #root header.sticky > div + div button,
  html body #root header.sticky > div + div p {
    white-space: nowrap !important;
    word-break: keep-all !important;
    overflow-wrap: normal !important;
    font-size: 14px !important;
    line-height: 21px !important;
  }
}

/* INAMAAD_COMPACT_NAVBAR_NOWRAP_END */
'@

$Content = $Content + $NavbarFix

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($CssFile, $Content, $Utf8NoBom)

Write-Host "Compact no-wrap navbar fix added to index.css." -ForegroundColor Green

Set-Location $ProjectPath
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $CssFile -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Run npm run dev to preview, then deploy." -ForegroundColor Green
