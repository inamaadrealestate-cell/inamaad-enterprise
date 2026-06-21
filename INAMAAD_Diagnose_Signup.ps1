# INAMAAD Signup Diagnosis Tool
# Run this in PowerShell from your project folder.
# It tests Supabase signup directly and prints the real response/error.

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "INAMAAD Signup Diagnosis Tool" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan

$ProjectPath = "C:\Users\user pc\Desktop\inamaad-enterprise"

if (!(Test-Path $ProjectPath)) {
  throw "Project folder not found: $ProjectPath"
}

Set-Location $ProjectPath

# Pull Vercel env only if possible and if no env file exists.
if (!(Test-Path ".env") -and !(Test-Path ".env.local") -and !(Test-Path ".env.production") -and !(Test-Path ".env.vercel.check")) {
  Write-Host "No env file found. Trying to pull Vercel env..." -ForegroundColor Yellow
  try {
    vercel env pull .env.local
  } catch {
    Write-Host "Could not pull Vercel env automatically. Continuing..." -ForegroundColor Yellow
  }
}

$SUPABASE_URL = ""
$SUPABASE_KEY = ""

$envFiles = @(".env", ".env.local", ".env.production", ".env.vercel.check")

foreach ($file in $envFiles) {
  if (Test-Path $file) {
    foreach ($line in Get-Content $file) {
      if ($line -match "^VITE_SUPABASE_URL=(.+)$") {
        $SUPABASE_URL = $matches[1].Trim().Trim('"').Trim("'")
      }

      if ($line -match "^VITE_SUPABASE_ANON_KEY=(.+)$") {
        $SUPABASE_KEY = $matches[1].Trim().Trim('"').Trim("'")
      }

      if ($line -match "^VITE_SUPABASE_PUBLISHABLE_KEY=(.+)$") {
        $SUPABASE_KEY = $matches[1].Trim().Trim('"').Trim("'")
      }
    }
  }
}

if (!$SUPABASE_URL) {
  throw "VITE_SUPABASE_URL was not found in .env, .env.local, .env.production, or .env.vercel.check"
}

if (!$SUPABASE_KEY) {
  throw "VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY was not found in env files"
}

Write-Host "Supabase URL found:" $SUPABASE_URL -ForegroundColor Green
Write-Host "Supabase key found: YES" -ForegroundColor Green

$typedEmail = Read-Host "Enter a fresh test email address you can check, then press Enter"
if (!$typedEmail -or !$typedEmail.Contains("@")) {
  $typedEmail = "inamaadtest$(Get-Date -Format yyyyMMddHHmmss)@gmail.com"
  Write-Host "No valid email entered. Using generated test email:" $typedEmail -ForegroundColor Yellow
}

$body = @{
  email = $typedEmail
  password = "TestPassword123!"
  data = @{
    full_name = "INAMAAD Signup Test"
  }
  options = @{
    emailRedirectTo = "https://project-65njf.vercel.app"
  }
} | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host "Testing signup with:" $typedEmail -ForegroundColor Cyan
Write-Host "Sending request to Supabase..." -ForegroundColor Cyan

try {
  $response = Invoke-WebRequest `
    -Uri "$SUPABASE_URL/auth/v1/signup" `
    -Method Post `
    -Headers @{
      "apikey" = $SUPABASE_KEY
      "Authorization" = "Bearer $SUPABASE_KEY"
      "Content-Type" = "application/json"
    } `
    -Body $body `
    -TimeoutSec 35 `
    -UseBasicParsing

  Write-Host ""
  Write-Host "SIGNUP REQUEST RETURNED SUCCESSFULLY" -ForegroundColor Green
  Write-Host "HTTP Status:" $response.StatusCode -ForegroundColor Green
  Write-Host ""
  Write-Host "Response body:" -ForegroundColor Cyan
  $response.Content

  Write-Host ""
  Write-Host "Interpretation:" -ForegroundColor Cyan
  Write-Host "- If response has a user and session is null: Supabase signup is working; email confirmation/delivery is the next thing to check."
  Write-Host "- If response has a session object: email confirmation is not being enforced."
  Write-Host "- Now check auth.users for this email in Supabase SQL Editor."

} catch {
  Write-Host ""
  Write-Host "SIGNUP TEST FAILED" -ForegroundColor Red
  Write-Host "Main error:" $_.Exception.Message -ForegroundColor Red

  try {
    $errorResponse = $_.Exception.Response
    if ($errorResponse) {
      $stream = $errorResponse.GetResponseStream()
      $reader = New-Object System.IO.StreamReader($stream)
      $bodyText = $reader.ReadToEnd()
      Write-Host ""
      Write-Host "Supabase error response:" -ForegroundColor Yellow
      Write-Host $bodyText -ForegroundColor Yellow
    }
  } catch {
    Write-Host "Could not read detailed error body." -ForegroundColor Yellow
  }

  Write-Host ""
  Write-Host "Interpretation:" -ForegroundColor Cyan
  Write-Host "- SMTP/rate/email errors mean Supabase email delivery is the cause."
  Write-Host "- Invalid API key or URL means your env variables are wrong."
  Write-Host "- Timeout means Supabase/email provider is hanging or blocked."
}
