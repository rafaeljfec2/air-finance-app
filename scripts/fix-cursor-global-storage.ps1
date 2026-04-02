# Run AFTER fully closing Cursor (check Task Manager for Cursor.exe).
# Backs up bloated/corrupt state.vscdb so Cursor recreates a fresh global storage DB.

$ErrorActionPreference = "Stop"
$globalStorage = Join-Path $env:APPDATA "Cursor\User\globalStorage"
$ts = Get-Date -Format "yyyyMMdd-HHmmss"

if (-not (Test-Path -LiteralPath $globalStorage)) {
    Write-Error "Folder not found: $globalStorage"
    exit 1
}

$main = Join-Path $globalStorage "state.vscdb"
$wal = Join-Path $globalStorage "state.vscdb-wal"
$shm = Join-Path $globalStorage "state.vscdb-shm"

function Rename-IfExists {
    param([string]$Path, [string]$Suffix)
    if (Test-Path -LiteralPath $Path) {
        $dest = "$Path.$Suffix-$ts"
        Move-Item -LiteralPath $Path -Destination $dest -Force
        Write-Host "Renamed: $Path -> $dest"
    }
}

try {
    Rename-IfExists -Path $main -Suffix "broken-backup"
    Rename-IfExists -Path $wal -Suffix "broken-backup"
    Rename-IfExists -Path $shm -Suffix "broken-backup"
}
catch {
    Write-Host "Failed (file likely still in use). Close all Cursor windows and end Cursor.exe in Task Manager, then run again."
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host "Done. Start Cursor again. Old files were renamed with suffix broken-backup-$ts"
Write-Host "Optional: after confirming Cursor works, delete the *.broken-backup-* files to free disk (they were ~15GB each)."
