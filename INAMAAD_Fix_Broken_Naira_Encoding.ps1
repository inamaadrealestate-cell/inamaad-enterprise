# INAMAAD Encoding Repair
# Fixes broken characters like "â‚¦" back to "₦" in your current index.tsx.
# It backs up your file first, writes UTF-8 safely, then runs npm run build.

$ErrorActionPreference = "Stop"

$ProjectPath = "C:\Users\user pc\Desktop\inamaad-enterprise"
$TargetFile = Join-Path $ProjectPath "index.tsx"

if (!(Test-Path $ProjectPath)) {
  throw "Project folder not found: $ProjectPath"
}

if (!(Test-Path $TargetFile)) {
  throw "index.tsx not found here: $TargetFile"
}

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = Join-Path $ProjectPath "index-before-encoding-fix-$Timestamp.tsx"

Copy-Item $TargetFile $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$Content = [System.IO.File]::ReadAllText($TargetFile, $Utf8NoBom)

# Build broken text patterns without writing Unicode directly into this script.
$BrokenNaira = ([string]([char]0x00E2)) + ([string]([char]0x201A)) + ([string]([char]0x00A6))
$GoodNaira = [string]([char]0x20A6)

$BrokenApostrophe = ([string]([char]0x00E2)) + ([string]([char]0x20AC)) + ([string]([char]0x2122))
$GoodApostrophe = [string]([char]0x2019)

$BrokenOpenQuote = ([string]([char]0x00E2)) + ([string]([char]0x20AC)) + ([string]([char]0x0153))
$GoodOpenQuote = [string]([char]0x201C)

$BrokenCloseQuote = ([string]([char]0x00E2)) + ([string]([char]0x20AC)) + ([string]([char]0x009D))
$GoodCloseQuote = [string]([char]0x201D)

$BrokenEnDash = ([string]([char]0x00E2)) + ([string]([char]0x20AC)) + ([string]([char]0x201C))
$GoodEnDash = [string]([char]0x2013)

$BrokenEmDash = ([string]([char]0x00E2)) + ([string]([char]0x20AC)) + ([string]([char]0x201D))
$GoodEmDash = [string]([char]0x2014)

$BrokenBullet = ([string]([char]0x00E2)) + ([string]([char]0x20AC)) + ([string]([char]0x00A2))
$GoodBullet = [string]([char]0x2022)

$Content = $Content.Replace($BrokenNaira, $GoodNaira)
$Content = $Content.Replace($BrokenApostrophe, $GoodApostrophe)
$Content = $Content.Replace($BrokenOpenQuote, $GoodOpenQuote)
$Content = $Content.Replace($BrokenCloseQuote, $GoodCloseQuote)
$Content = $Content.Replace($BrokenEnDash, $GoodEnDash)
$Content = $Content.Replace($BrokenEmDash, $GoodEmDash)
$Content = $Content.Replace($BrokenBullet, $GoodBullet)

# Remove stray Â that often appears before spaces after encoding damage.
$Content = $Content.Replace(([string]([char]0x00C2)) + " ", " ")
$Content = $Content.Replace([string]([char]0x00C2), "")

[System.IO.File]::WriteAllText($TargetFile, $Content, $Utf8NoBom)

Write-Host "Encoding repaired. Broken Naira/currency text should now show correctly." -ForegroundColor Green

Set-Location $ProjectPath

Write-Host "Running build..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $TargetFile -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Now run: npm run dev" -ForegroundColor Green
