# INAMAAD Remove Local Admin Password Fallback
# Removes the old frontend "admin123" fallback and makes staff/admin access depend only on Supabase Auth + admin_users role.
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
$BackupFile = Join-Path $ProjectPath "index-before-remove-local-admin-password-$Timestamp.tsx"

Copy-Item $File $BackupFile -Force
Write-Host "Backup created: $BackupFile" -ForegroundColor Yellow

$Content = Get-Content $File -Raw

# 1. Remove the exposed local admin password constant.
$Content = [regex]::Replace(
  $Content,
  "\r?\nconst\s+LOCAL_ADMIN_PASSWORD\s*=\s*[""'][^""']*[""'];\r?\n",
  "`r`n",
  "IgnoreCase"
)

# 2. Remove the no-Supabase admin password fallback inside unlockAdmin().
# It used to allow admin access if adminPassword === LOCAL_ADMIN_PASSWORD.
$FallbackPattern = @'
if\s*\(!supabase\)\s*\{\s*
\s*if\s*\(adminPassword\s*===\s*LOCAL_ADMIN_PASSWORD\)\s*\{\s*
\s*setAdminUnlocked\(true\);\s*
\s*setAdminPassword\(""\);\s*
\s*\}\s*else\s*\{\s*
\s*showSuccess\("Wrong admin password\."\);\s*
\s*\}\s*
\s*return;\s*
\s*\}
'@

$SecureSupabaseOnlyBlock = @'
if (!supabase) {
      showSuccess("Supabase Auth is required for staff access. Configure Supabase and sign in with an authorized staff account.");
      return;
    }
'@

$Content = [regex]::Replace(
  $Content,
  $FallbackPattern,
  $SecureSupabaseOnlyBlock,
  "IgnoreCase"
)

# 3. Remove no-Supabase Super Admin role fallback if present.
$Content = $Content.Replace(
  'const currentStaffRole: StaffRole = usesDatabase
    ? currentStaffMember?.role || "Viewer"
    : "Super Admin";
  const hasAnyStaffRole = (allowedRoles: StaffRole[]) =>
    !usesDatabase || allowedRoles.includes(currentStaffRole);',
  'const currentStaffRole: StaffRole = usesDatabase
    ? currentStaffMember?.role || "Viewer"
    : "Viewer";
  const hasAnyStaffRole = (allowedRoles: StaffRole[]) =>
    usesDatabase && allowedRoles.includes(currentStaffRole);'
)

# 4. Clean old local demo label in activity logs if present.
$Content = $Content.Replace(
  'adminEmail: user?.email || adminEmail || "Local demo admin",',
  'adminEmail: user?.email || adminEmail || "Staff user",'
)

# Save as UTF-8 without BOM.
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($File, $Content, $Utf8NoBom)

# Safety checks.
$Updated = Get-Content $File -Raw

if ($Updated -match "LOCAL_ADMIN_PASSWORD") {
  Write-Host "LOCAL_ADMIN_PASSWORD is still present. Restoring backup." -ForegroundColor Red
  Copy-Item $BackupFile $File -Force
  exit 1
}

if ($Updated -match "admin123") {
  Write-Host "admin123 is still present. Restoring backup." -ForegroundColor Red
  Copy-Item $BackupFile $File -Force
  exit 1
}

Write-Host "Old frontend local admin password removed." -ForegroundColor Green

Set-Location $ProjectPath
npm run build

if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. Restoring backup..." -ForegroundColor Red
  Copy-Item $BackupFile $File -Force
  Write-Host "Backup restored: $BackupFile" -ForegroundColor Yellow
  exit 1
}

Write-Host "Build passed. Admin access now depends on Supabase Auth + staff role only." -ForegroundColor Green
