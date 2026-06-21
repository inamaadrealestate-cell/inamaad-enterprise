# INAMAAD Sticky Visible Navbar Update
# This updates ONLY navbar behavior in your current index.tsx.
# It makes the navbar visible while scrolling down/up.
# The new-user guide notice stays non-sticky to avoid double sticky bars.

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
$BackupFile = Join-Path $ProjectPath "index-before-sticky-navbar-$Timestamp.tsx"

Copy-Item $TargetFile $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$Content = [System.IO.File]::ReadAllText($TargetFile, $Utf8NoBom)

# Make navbar sticky/visible while scrolling.
$Content = $Content.Replace(
  'className="relative z-50 border-b border-slate-200 bg-[#e9edf3]/95 backdrop-blur"',
  'className="sticky top-0 z-50 border-b border-slate-200 bg-[#e9edf3]/95 backdrop-blur"'
)

# Keep the new-user notice non-sticky so it does not fight the navbar.
$Content = $Content.Replace(
  'className="sticky top-0 z-[60] border-b border-[#f0bf3c]/30 bg-[#0d1c38] px-3 py-2 text-white shadow-sm sm:px-4"',
  'className="relative z-[60] border-b border-[#f0bf3c]/30 bg-[#0d1c38] px-3 py-2 text-white shadow-sm sm:px-4"'
)

[System.IO.File]::WriteAllText($TargetFile, $Content, $Utf8NoBom)

Write-Host "Navbar is now sticky and visible while scrolling." -ForegroundColor Green

Set-Location $ProjectPath
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $TargetFile -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Now run: npm run dev" -ForegroundColor Green
