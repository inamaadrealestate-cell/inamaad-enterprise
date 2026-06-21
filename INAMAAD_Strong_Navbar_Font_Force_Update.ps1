# INAMAAD Strong Navbar Font Force Update
# This updates index.css only.
# It removes the previous navbar font block and forces the real header/navbar
# to match the larger clean screenshot style.

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
$BackupFile = Join-Path $ProjectPath "index-before-strong-navbar-font-force-$Timestamp.css"

Copy-Item $CssFile $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Content = Get-Content $CssFile -Raw

# Remove previous navbar font override blocks so they do not fight this one.
$Content = [regex]::Replace(
  $Content,
  "/\* INAMAAD_NAVBAR_FONT_MATCH_START \*/[\s\S]*?/\* INAMAAD_NAVBAR_FONT_MATCH_END \*/",
  "",
  "IgnoreCase"
).TrimEnd()

$Content = [regex]::Replace(
  $Content,
  "/\* INAMAAD_STRONG_NAVBAR_FONT_FORCE_START \*/[\s\S]*?/\* INAMAAD_STRONG_NAVBAR_FONT_FORCE_END \*/",
  "",
  "IgnoreCase"
).TrimEnd()

$NavbarForceUpdate = @'

/* INAMAAD_STRONG_NAVBAR_FONT_FORCE_START */
/* Strong navbar-only font fix. Matches the clean Bolt screenshot style. */

/* Desktop navbar links: Home, Properties, JV Deals, About, Contact */
html body #root header.sticky > div > nav a,
html body #root header.sticky > div > nav button {
  font-size: 18px !important;
  line-height: 26px !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em !important;
}

/* Desktop Sign In and Get Started */
html body #root header.sticky > div > div.hidden button {
  font-size: 18px !important;
  line-height: 26px !important;
  font-weight: 600 !important;
}

/* Keep Get Started button premium and similar to screenshot */
html body #root header.sticky > div > div.hidden button:last-child {
  font-size: 18px !important;
  line-height: 26px !important;
  font-weight: 700 !important;
  padding: 12px 24px !important;
  border-radius: 12px !important;
}

/* Logo text INAMAAD */
html body #root header.sticky > div > a > div:nth-child(2) > div:first-child {
  font-size: 24px !important;
  line-height: 30px !important;
  font-weight: 900 !important;
  letter-spacing: -0.03em !important;
}

/* Logo subtitle */
html body #root header.sticky > div > a > div:nth-child(2) > div:nth-child(2) {
  font-size: 12px !important;
  line-height: 16px !important;
}

/* Logo icon letter */
html body #root header.sticky > div > a > div:first-child {
  font-size: 22px !important;
  line-height: 22px !important;
}

/* Mobile menu */
@media (max-width: 1023px) {
  html body #root header.sticky > div > button {
    font-size: 15px !important;
    line-height: 22px !important;
    font-weight: 800 !important;
  }

  html body #root header.sticky > div > a > div:nth-child(2) > div:first-child {
    font-size: 21px !important;
    line-height: 27px !important;
  }

  html body #root header.sticky > div > a > div:nth-child(2) > div:nth-child(2) {
    font-size: 11px !important;
    line-height: 15px !important;
  }

  html body #root header.sticky > div + div a,
  html body #root header.sticky > div + div button {
    font-size: 16px !important;
    line-height: 24px !important;
    font-weight: 700 !important;
  }
}

/* INAMAAD_STRONG_NAVBAR_FONT_FORCE_END */
'@

$Content = $Content + $NavbarForceUpdate

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($CssFile, $Content, $Utf8NoBom)

Write-Host "Strong navbar font force update added to index.css." -ForegroundColor Green

Set-Location $ProjectPath
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $CssFile -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Run npm run dev to preview, then deploy." -ForegroundColor Green
