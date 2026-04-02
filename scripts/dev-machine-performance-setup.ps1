#Requires -Version 5.1
<#
.SYNOPSIS
    Dev machine performance and stability setup (Windows host).
.DESCRIPTION
    - WSL2: memory, swap, and processors derived from host hardware; presets tune the trade-off;
      autoMemoryReclaim when supported; robust shutdown before applying limits.
    - Android AVD: Pixel 8 API 35 with GPU host and Quick Boot when the SDK image exists.
    - Cursor: merges (does not wipe) watcher/search exclusions for a JS/Turborepo monorepo.
.PARAMETER Preset
    Balanced (default): ~38% RAM, moderate CPU for WSL.
    Conservative: more RAM and CPU left for Windows; smaller swap steps.
    Performance: higher RAM share and more WSL CPUs; larger AVD heap/RAM when created.
.PARAMETER MaxWslMemoryGb
    If > 0, caps computed WSL memory (GB).
.PARAMETER MinWslMemoryGb
    If > 0, raises computed WSL memory floor (GB); clamped to safe host headroom.
.PARAMETER MaxWslProcessors
    If > 0, caps computed WSL processor count.
.NOTES
    Run in PowerShell on Windows (not inside WSL). Prerequisites:
      - Android SDK: %LOCALAPPDATA%\Android\Sdk
      - System image: android-35 / google_apis_playstore / x86_64
      - Cursor IDE installed
      - WSL2 enabled
.EXAMPLE
    .\dev-machine-performance-setup.ps1
.EXAMPLE
    .\dev-machine-performance-setup.ps1 -Preset Conservative -MaxWslMemoryGb 4
.EXAMPLE
    .\dev-machine-performance-setup.ps1 -Preset Performance -SkipCursor
#>

[CmdletBinding()]
param(
    [ValidateSet("Balanced", "Conservative", "Performance")]
    [string]$Preset = "Balanced",

    [ValidateRange(0, 128)]
    [int]$MaxWslMemoryGb = 0,

    [ValidateRange(0, 128)]
    [int]$MinWslMemoryGb = 0,

    [ValidateRange(0, 256)]
    [int]$MaxWslProcessors = 0,

    [ValidateRange(0, 8192)]
    [int]$AvdRamMb = 0,

    [switch]$SkipWsl,
    [switch]$SkipAvd,
    [switch]$SkipCursor
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$USER_PROFILE = $env:USERPROFILE
$SDK_ROOT = "$env:LOCALAPPDATA\Android\Sdk"
$AVD_HOME = "$USER_PROFILE\.android\avd"
$AVD_NAME = "Pixel_8_API_35"
$CURSOR_SETTINGS = "$env:APPDATA\Cursor\User\settings.json"

function Write-Step {
    param([string]$Message)
    Write-Host "`n>> $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "   OK: $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "   WARN: $Message" -ForegroundColor Yellow
}

function Get-HostRamGb {
    $cs = Get-CimInstance -ClassName Win32_ComputerSystem
    return [int][math]::Floor($cs.TotalPhysicalMemory / 1GB)
}

function Get-LogicalProcessorCount {
    $sum = Get-CimInstance -ClassName Win32_Processor |
        Measure-Object -Property NumberOfLogicalProcessors -Sum
    return [int]$sum.Sum
}

function Get-WslLimitsForPreset {
    param(
        [ValidateSet("Balanced", "Conservative", "Performance")]
        [string]$Preset,
        [int]$HostRamGb,
        [int]$LogicalProcessors
    )

    $ramRatio = switch ($Preset) {
        "Conservative" { 0.30 }
        "Performance" { 0.48 }
        Default { 0.38 }
    }

    $ramCap = switch ($Preset) {
        "Conservative" { 6 }
        "Performance" { 12 }
        Default { 8 }
    }

    if ($HostRamGb -lt 8) {
        $memoryGb = switch ($Preset) {
            "Conservative" {
                [int][math]::Min(5, [math]::Max(2, $HostRamGb - 4))
            }
            "Performance" {
                [int][math]::Min(6, [math]::Max(3, $HostRamGb - 2))
            }
            Default {
                [int][math]::Min(6, [math]::Max(3, $HostRamGb - 3))
            }
        }
    } else {
        $memoryGb = [int][math]::Min($ramCap, [math]::Max(3, [math]::Floor($HostRamGb * $ramRatio)))
        if ($Preset -eq "Performance") {
            $memoryGb = [int][math]::Max(4, $memoryGb)
        } elseif ($Preset -eq "Balanced") {
            $memoryGb = [int][math]::Max(4, $memoryGb)
        }
    }

    $swapDivisor = switch ($Preset) {
        "Conservative" { 3.0 }
        Default { 2.0 }
    }
    $swapCap = switch ($Preset) {
        "Performance" { 12 }
        Default { 8 }
    }
    $swapGb = [int][math]::Min($swapCap, [math]::Max(2, [math]::Ceiling($memoryGb / $swapDivisor)))

    $reserveForHost = switch ($Preset) {
        "Conservative" {
            if ($LogicalProcessors -le 4) { 1 } elseif ($LogicalProcessors -le 6) { 2 } else { 3 }
        }
        "Performance" {
            if ($LogicalProcessors -le 4) { 1 } else { 2 }
        }
        Default {
            if ($LogicalProcessors -le 4) { 1 } else { 2 }
        }
    }

    $procCap = switch ($Preset) {
        "Conservative" { 6 }
        "Performance" { 12 }
        Default { 8 }
    }
    $proc = [int][math]::Min($procCap, [math]::Max(2, $LogicalProcessors - $reserveForHost))

    return [PSCustomObject]@{
        MemoryGb   = $memoryGb
        SwapGb     = $swapGb
        Processors = $proc
    }
}

function Apply-WslLimitOverrides {
    param(
        [PSCustomObject]$Limits,
        [int]$HostRamGb,
        [int]$MaxWslMemoryGb,
        [int]$MinWslMemoryGb,
        [int]$MaxWslProcessors
    )

    $memoryGb = $Limits.MemoryGb
    if ($MaxWslMemoryGb -gt 0) {
        $memoryGb = [int][math]::Min($memoryGb, $MaxWslMemoryGb)
    }
    if ($MinWslMemoryGb -gt 0) {
        $memoryGb = [int][math]::Max($memoryGb, $MinWslMemoryGb)
    }

    $headroomGb = 3
    if ($HostRamGb -le 8) { $headroomGb = 4 }
    $safeMax = [int][math]::Max(2, $HostRamGb - $headroomGb)
    if ($memoryGb -gt $safeMax) {
        Write-Warn "WSL memory clamped from ${memoryGb}GB to ${safeMax}GB to preserve Windows headroom."
        $memoryGb = $safeMax
    }

    $processors = $Limits.Processors
    if ($MaxWslProcessors -gt 0) {
        $processors = [int][math]::Min($processors, $MaxWslProcessors)
        $processors = [int][math]::Max(1, $processors)
    }

    return [PSCustomObject]@{
        MemoryGb   = $memoryGb
        SwapGb     = $Limits.SwapGb
        Processors = $processors
    }
}

function Get-AvdProfileForPreset {
    param(
        [ValidateSet("Balanced", "Conservative", "Performance")]
        [string]$Preset,
        [int]$LogicalProcessors,
        [int]$AvdRamMbOverride
    )

    if ($AvdRamMbOverride -gt 0) {
        $ramMb = $AvdRamMbOverride
        $heap = [int][math]::Min(512, [math]::Max(256, $ramMb / 5))
        $cores = [int][math]::Min(6, [math]::Max(2, [math]::Min(4, $LogicalProcessors - 2)))
        return [PSCustomObject]@{ RamMb = $ramMb; VmHeap = $heap; CpuCores = $cores }
    }

    switch ($Preset) {
        "Conservative" {
            return [PSCustomObject]@{
                RamMb    = 1536
                VmHeap   = 320
                CpuCores = [int][math]::Min(4, [math]::Max(2, $LogicalProcessors - 3))
            }
        }
        "Performance" {
            return [PSCustomObject]@{
                RamMb    = 3072
                VmHeap   = 512
                CpuCores = [int][math]::Min(6, [math]::Max(4, $LogicalProcessors - 2))
            }
        }
        Default {
            return [PSCustomObject]@{
                RamMb    = 2048
                VmHeap   = 384
                CpuCores = [int][math]::Min(4, [math]::Max(2, $LogicalProcessors - 2))
            }
        }
    }
}

function Get-WindowsBuildNumber {
    try {
        $os = Get-CimInstance -ClassName Win32_OperatingSystem
        return [int]$os.BuildNumber
    } catch {
        return 0
    }
}

function Get-WslConfigBody {
    param(
        [int]$MemoryGb,
        [int]$SwapGb,
        [int]$Processors
    )

    $section = "[wsl2]`r`n"
    $section += "memory=${MemoryGb}GB`r`n"
    $section += "processors=$Processors`r`n"
    $section += "swap=${SwapGb}GB`r`n"
    $section += "localhostForwarding=true`r`n"

    if ((Get-WindowsBuildNumber) -ge 22621) {
        $section += "autoMemoryReclaim=gradual`r`n"
    }

    return $section
}

function Stop-WslIfRunning {
    $names = @(wsl.exe --list --running -q 2>$null) |
        ForEach-Object { $_.Trim() } |
        Where-Object { $_ -ne "" }

    if ($names.Count -eq 0) {
        return
    }

    Write-Host "   Shutting down WSL to apply new limits ($($names.Count) instance(s))..." -ForegroundColor DarkGray
    wsl.exe --shutdown | Out-Null
    Start-Sleep -Seconds 2
}

function Merge-CursorExcludeObject {
    param(
        [object]$Existing,
        [hashtable]$Defaults
    )

    $map = [ordered]@{}
    if ($null -ne $Existing -and $Existing.PSObject.Properties.Count -gt 0) {
        foreach ($p in $Existing.PSObject.Properties) {
            $map[$p.Name] = $p.Value
        }
    }

    foreach ($key in $Defaults.Keys) {
        if (-not $map.Contains($key)) {
            $map[$key] = $Defaults[$key]
        }
    }

    return [PSCustomObject]$map
}

$hostRamGb = Get-HostRamGb
$logical = Get-LogicalProcessorCount
$limitsRaw = Get-WslLimitsForPreset -Preset $Preset -HostRamGb $hostRamGb -LogicalProcessors $logical
$limits = Apply-WslLimitOverrides -Limits $limitsRaw -HostRamGb $hostRamGb `
    -MaxWslMemoryGb $MaxWslMemoryGb -MinWslMemoryGb $MinWslMemoryGb -MaxWslProcessors $MaxWslProcessors

$avdProfile = Get-AvdProfileForPreset -Preset $Preset -LogicalProcessors $logical -AvdRamMbOverride $AvdRamMb

Write-Step "Computing WSL2 limits (preset: $Preset)"

Write-Host "   Host: RAM ~${hostRamGb}GB, logical CPUs: $logical" -ForegroundColor DarkGray
Write-Host "   WSL: memory=$($limits.MemoryGb)GB, swap=$($limits.SwapGb)GB, processors=$($limits.Processors)" -ForegroundColor DarkGray
Write-Host "   AVD profile: RAM=$($avdProfile.RamMb)MB, vmHeap=$($avdProfile.VmHeap)MB, cores=$($avdProfile.CpuCores)" -ForegroundColor DarkGray

$wslConfigPath = "$USER_PROFILE\.wslconfig"
if (-not $SkipWsl) {
    Write-Step "Configuring WSL2 (.wslconfig)"

    $wslConfig = Get-WslConfigBody -MemoryGb $limits.MemoryGb -SwapGb $limits.SwapGb -Processors $limits.Processors
    Set-Content -Path $wslConfigPath -Value $wslConfig -Encoding UTF8
    Write-Success ".wslconfig written to $wslConfigPath"

    Stop-WslIfRunning
    Write-Success "WSL2 limits applied (restart WSL after shutdown if needed)"
} else {
    Write-Warn "Skipping WSL2 (.wslconfig) and shutdown (SkipWsl)."
}

if (-not $SkipAvd) {
    Write-Step "Creating Android AVD: $AVD_NAME"

    $systemImage = "$SDK_ROOT\system-images\android-35\google_apis_playstore\x86_64"
    if (-not (Test-Path $systemImage)) {
        Write-Warn "System image not found at: $systemImage"
        Write-Warn "Install via Android Studio > SDK Manager > Android 35 > Google Play x86_64"
        Write-Warn "Skipping AVD creation."
    } else {
        $avdDir = "$AVD_HOME\$AVD_NAME.avd"
        New-Item -ItemType Directory -Force -Path $avdDir | Out-Null

        $avdPointer = @"
avd.ini.encoding=UTF-8
path=$avdDir
path.rel=avd\$AVD_NAME.avd
target=android-35
"@
        Set-Content -Path "$AVD_HOME\$AVD_NAME.ini" -Value $avdPointer -Encoding UTF8

        $avdRam = $avdProfile.RamMb
        $avdHeap = $avdProfile.VmHeap
        $avdCores = $avdProfile.CpuCores

        $avdConfig = @"
AvdId=$AVD_NAME
PlayStore.enabled=true
abi.type=x86_64
avd.ini.displayname=Pixel 8 API 35
avd.ini.encoding=UTF-8
disk.dataPartition.size=6G
fastboot.forceColdBoot=no
fastboot.forceChosenSnapshotBoot=yes
fastboot.forceFastBoot=no
hw.accelerometer=yes
hw.arc=false
hw.audioInput=yes
hw.battery=yes
hw.camera.back=virtualscene
hw.camera.front=emulated
hw.cpu.arch=x86_64
hw.cpu.ncore=$avdCores
hw.dPad=no
hw.device.manufacturer=Google
hw.device.name=pixel_8
hw.gps=yes
hw.gpu.enabled=yes
hw.gpu.mode=host
hw.initialOrientation=Portrait
hw.keyboard=yes
hw.lcd.density=420
hw.lcd.height=2400
hw.lcd.width=1080
hw.mainKeys=no
hw.ramSize=$avdRam
hw.sdCard=yes
hw.sensors.orientation=yes
hw.sensors.proximity=yes
hw.trackBall=no
image.sysdir.1=system-images\android-35\google_apis_playstore\x86_64\
runtime.network.latency=none
runtime.network.speed=full
sdcard.size=512M
showDeviceFrame=no
skin.dynamic=yes
skin.name=_no_skin
skin.path=_no_skin
tag.display=Google Play
tag.id=google_apis_playstore
vm.heapSize=$avdHeap
"@
        Set-Content -Path "$avdDir\config.ini" -Value $avdConfig -Encoding UTF8

        Write-Success "AVD created at $avdDir"
        Write-Success "GPU mode: host; Quick Boot (snapshot)"
        Write-Success "AVD RAM=${avdRam}MB, vm heap=${avdHeap}MB, CPU cores=$avdCores"
    }
} else {
    Write-Warn "Skipping Android AVD (SkipAvd)."
}

if (-not $SkipCursor) {
    Write-Step "Configuring Cursor IDE ($CURSOR_SETTINGS)"

    if (-not (Test-Path $CURSOR_SETTINGS)) {
        Write-Warn "Cursor settings.json not found. Creating a new one."
        New-Item -ItemType File -Force -Path $CURSOR_SETTINGS | Out-Null
        Set-Content -Path $CURSOR_SETTINGS -Value "{}" -Encoding UTF8
    }

    $rawJson = Get-Content -Path $CURSOR_SETTINGS -Raw -Encoding UTF8
    $rawJson = $rawJson -replace ',(\s*})', '$1'

    try {
        $settings = $rawJson | ConvertFrom-Json
    } catch {
        Write-Warn "Could not parse existing settings.json. Backing up and starting fresh."
        Copy-Item $CURSOR_SETTINGS "$CURSOR_SETTINGS.bak"
        $settings = [PSCustomObject]@{}
    }

    $watcherDefaults = [ordered]@{
        "**/node_modules/**"       = $true
        "**/.git/objects/**"       = $true
        "**/.git/subtree-cache/**" = $true
        "**/dist/**"               = $true
        "**/build/**"              = $true
        "**/.next/**"              = $true
        "**/.expo/**"              = $true
        "**/.turbo/**"             = $true
        "**/.yarn/**"              = $true
        "**/coverage/**"           = $true
        "**/storybook-static/**"   = $true
        "**/.vite/**"              = $true
        "**/playwright-report/**"  = $true
    }

    $searchDefaults = [ordered]@{
        "**/node_modules"         = $true
        "**/dist"                 = $true
        "**/build"                = $true
        "**/.next"                = $true
        "**/.expo"                = $true
        "**/.turbo"               = $true
        "**/.yarn"                = $true
        "**/coverage"             = $true
        "**/storybook-static"     = $true
        "**/.vite"                = $true
        "**/playwright-report"    = $true
    }

    $mergedWatcher = Merge-CursorExcludeObject -Existing $settings.'files.watcherExclude' -Defaults $watcherDefaults
    $mergedSearch = Merge-CursorExcludeObject -Existing $settings.'search.exclude' -Defaults $searchDefaults

    $settings | Add-Member -NotePropertyName "files.watcherExclude" -NotePropertyValue $mergedWatcher -Force
    $settings | Add-Member -NotePropertyName "search.exclude" -NotePropertyValue $mergedSearch -Force
    $settings | Add-Member -NotePropertyName "extensions.autoUpdate" -NotePropertyValue $false -Force

    $settings | ConvertTo-Json -Depth 20 | Set-Content -Path $CURSOR_SETTINGS -Encoding UTF8
    Write-Success "Cursor: merged watcher/search excludes; extensions.autoUpdate=false"
} else {
    Write-Warn "Skipping Cursor settings (SkipCursor)."
}

Write-Host "`n================================================================" -ForegroundColor DarkGray
Write-Host " Setup complete. Preset: $Preset" -ForegroundColor White
Write-Host "----------------------------------------------------------------" -ForegroundColor DarkGray
if (-not $SkipWsl) {
    Write-Host " [1] WSL2      $wslConfigPath" -ForegroundColor White
    Write-Host "               memory=$($limits.MemoryGb)GB  swap=$($limits.SwapGb)GB  processors=$($limits.Processors)" -ForegroundColor White
} else {
    Write-Host " [1] WSL2      skipped (planned: memory=$($limits.MemoryGb)GB swap=$($limits.SwapGb)GB processors=$($limits.Processors))" -ForegroundColor DarkGray
}
if (-not $SkipAvd) {
    Write-Host " [2] AVD       $AVD_HOME\$AVD_NAME  (if image present)" -ForegroundColor White
} else {
    Write-Host " [2] AVD       (skipped)" -ForegroundColor DarkGray
}
if (-not $SkipCursor) {
    Write-Host " [3] Cursor    $CURSOR_SETTINGS" -ForegroundColor White
} else {
    Write-Host " [3] Cursor    (skipped)" -ForegroundColor DarkGray
}
Write-Host "----------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host " Manual (browser):" -ForegroundColor Yellow
Write-Host "   Chrome > Settings > Performance > Memory Saver  ->  Enable" -ForegroundColor Yellow
Write-Host "================================================================`n" -ForegroundColor DarkGray
