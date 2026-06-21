# INAMAAD Exact Navbar One-Line Fix
# This is the exact fix for the circled navbar area.
# It forces "JV Deals", "Sign Out", "Sign In", and "Get Started" to stay on one line
# and reduces navbar font only. It edits index.tsx directly.

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
$BackupFile = Join-Path $ProjectPath "index-before-exact-navbar-one-line-$Timestamp.tsx"

Copy-Item $File $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Content = Get-Content $File -Raw

# 1. Make the nav label impossible to split.
# React/JS will render \u00A0 as a non-breaking space.
$Content = $Content.Replace('label: "JV Deals"', 'label: "JV\u00A0Deals"')
$Content = $Content.Replace('label: "JV Deals"', 'label: "JV\u00A0Deals"')

# 2. Make visible auth button text impossible to split.
# Use JSX expression for non-breaking spaces.
$Content = [regex]::Replace($Content, '>\s*Sign\s+Out\s*</button>', ">`r`n                  Sign{`"\u00A0`"}Out`r`n                </button>")
$Content = [regex]::Replace($Content, '>\s*Sign\s+In\s*</button>', ">`r`n                  Sign{`"\u00A0`"}In`r`n                </button>")
$Content = [regex]::Replace($Content, '>\s*Get\s+Started\s*</button>', ">`r`n                  Get{`"\u00A0`"}Started`r`n                </button>")

# 3. Expand the desktop navbar container slightly and reduce spacing.
$Content = $Content.Replace(
  'className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-5 lg:px-10"',
  'className="mx-auto flex max-w-[1500px] items-center justify-between gap-2 px-3 py-3 sm:px-5 sm:py-4 lg:px-4 xl:px-8"'
)

# 4. Make desktop nav compact.
$Content = $Content.Replace(
  'className="hidden items-center gap-8 lg:flex"',
  'className="hidden flex-none items-center gap-4 whitespace-nowrap lg:flex xl:gap-5"'
)

# 5. Reduce desktop nav link font only.
$Content = $Content.Replace(
  'className={`text-lg font-medium transition ${',
  'className={`whitespace-nowrap text-sm font-semibold leading-5 transition xl:text-[15px] ${'
)

# 6. Make the active Home pill compact.
$Content = $Content.Replace(
  '? "rounded-xl bg-white px-5 py-3 text-[#0d1c38] shadow-sm"',
  '? "rounded-xl bg-white px-3 py-2.5 text-[#0d1c38] shadow-sm xl:px-4"'
)

# 7. Make right side navbar compact and no-wrap.
$Content = $Content.Replace(
  'className="hidden items-center gap-4 lg:flex"',
  'className="hidden flex-none items-center gap-2 whitespace-nowrap lg:flex xl:gap-3"'
)

# Guide and Sign In style if still old.
$Content = $Content.Replace(
  'className="text-lg font-medium text-slate-700 hover:text-[#0d1c38]"',
  'className="whitespace-nowrap text-sm font-semibold leading-5 text-slate-700 hover:text-[#0d1c38] xl:text-[15px]"'
)

# Logged-in email box smaller so Sign Out gets room.
$Content = $Content.Replace(
  'className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-left shadow-sm"',
  'className="max-w-[220px] shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-left shadow-sm"'
)

$Content = $Content.Replace(
  'className="max-w-[180px] truncate text-sm font-black text-[#0d1c38]"',
  'className="max-w-[160px] truncate text-xs font-black text-[#0d1c38] xl:max-w-[190px] xl:text-sm"'
)

# Sign Out desktop button smaller and no-wrap.
$Content = $Content.Replace(
  'className="rounded-xl border border-slate-300 px-5 py-3 text-base font-black text-slate-700 transition hover:border-[#0d1c38] hover:text-[#0d1c38]"',
  'className="whitespace-nowrap rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-black leading-5 text-slate-700 transition hover:border-[#0d1c38] hover:text-[#0d1c38] xl:px-5"'
)

# Get Started desktop button smaller and no-wrap.
$Content = $Content.Replace(
  'className="rounded-xl bg-[#0d1c38] px-6 py-3 text-lg font-semibold text-white shadow-sm transition hover:bg-[#13284f]"',
  'className="whitespace-nowrap rounded-xl bg-[#0d1c38] px-4 py-2.5 text-sm font-bold leading-5 text-white shadow-sm transition hover:bg-[#13284f] xl:px-5 xl:text-[15px]"'
)

# 8. Add final CSS guard inside index.tsx? No; keep source clean.

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($File, $Content, $Utf8NoBom)

Write-Host "Exact navbar one-line fix applied." -ForegroundColor Green

# Quick checks before build
$NewContent = Get-Content $File -Raw

if ($NewContent -notmatch 'JV\\u00A0Deals') {
  Write-Host "WARNING: JV non-breaking label was not found after update." -ForegroundColor Yellow
}

if ($NewContent -notmatch 'Sign\{"\\u00A0"\}Out') {
  Write-Host "WARNING: Sign Out non-breaking text was not found after update." -ForegroundColor Yellow
}

Set-Location $ProjectPath
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $File -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Now run git push and vercel --prod." -ForegroundColor Green
