# INAMAAD Restore Nigerian Naira Symbol Safely
# This keeps Nigerian currency as ₦ in the website, but writes it in code as \u20A6
# so it cannot break into â‚¦ again.
# Updates index.tsx only.

$ErrorActionPreference = "Stop"

$ProjectPath = "C:\Users\user pc\Desktop\inamaad-enterprise"
$File = Join-Path $ProjectPath "index.tsx"

if (!(Test-Path $ProjectPath)) {
  throw "Project folder not found: $ProjectPath"
}

if (!(Test-Path $File)) {
  throw "index.tsx not found here: $File"
}

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = Join-Path $ProjectPath "index-before-naira-unicode-safe-$Timestamp.tsx"

Copy-Item $File $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Content = Get-Content $File -Raw

# Use JavaScript unicode escape in source code.
# Browser output will show the real Nigerian Naira sign: ₦
$SafeNaira = "\u20A6"

# Fix broken naira encodings and undo NGN replacement if it was applied.
$Content = $Content.Replace("â‚¦", $SafeNaira)
$Content = $Content.Replace("Â₦", $SafeNaira)
$Content = $Content.Replace("₦", $SafeNaira)
$Content = $Content.Replace("NGN ", $SafeNaira)
$Content = $Content.Replace("NGN", $SafeNaira)

# Fix apostrophe/quote mojibake too, in case it still exists.
$Content = $Content.Replace("Nigeriaâ€™s", "Nigeria's")
$Content = $Content.Replace("â€™", "'")
$Content = $Content.Replace("â€˜", "'")
$Content = $Content.Replace("â€œ", '"')
$Content = $Content.Replace("â€", '"')
$Content = $Content.Replace("â€“", "-")
$Content = $Content.Replace("â€”", "-")
$Content = $Content.Replace("â€¦", "...")

# Save as UTF-8 without BOM.
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($File, $Content, $Utf8NoBom)

Write-Host "Nigerian Naira currency restored safely as Naira symbol using \u20A6 in code." -ForegroundColor Green

Set-Location $ProjectPath
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $File -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Deploy to Vercel to see the Naira symbol live." -ForegroundColor Green
