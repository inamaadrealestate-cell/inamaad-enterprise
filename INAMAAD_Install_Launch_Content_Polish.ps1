# INAMAAD Launch Content Polish Installer
# Replaces index.tsx with the launch-polished version.
# Keeps your working Supabase security, forms, admin panel and database logic intact.

$ErrorActionPreference = "Stop"

$ProjectPath = "C:\Users\user pc\Desktop\inamaad-enterprise"
$CurrentFile = Join-Path $ProjectPath "index.tsx"
$ReplacementFile = Join-Path $ProjectPath "index_launch_content_polish.tsx"

if (!(Test-Path $ProjectPath)) {
  throw "Project folder not found: $ProjectPath"
}

if (!(Test-Path $CurrentFile)) {
  throw "Current index.tsx not found: $CurrentFile"
}

if (!(Test-Path $ReplacementFile)) {
  throw "Replacement file not found. Put index_launch_content_polish.tsx inside: $ProjectPath"
}

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = Join-Path $ProjectPath "index-before-launch-content-polish-$Timestamp.tsx"

Copy-Item $CurrentFile $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

Copy-Item $ReplacementFile $CurrentFile -Force
Write-Host "Launch content polish installed into index.tsx." -ForegroundColor Green

Set-Location $ProjectPath
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $CurrentFile -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Preview with npm run dev, then deploy." -ForegroundColor Green
