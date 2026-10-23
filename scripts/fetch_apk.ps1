$creds = "protocol=https`nhost=github.com`n`n" | git credential fill
$tokenMatch = ($creds | Select-String -Pattern 'password=(.*)')
$token = $tokenMatch.Matches.Groups[1].Value
$headers = @{ 'Authorization' = "Bearer $token"; 'Accept' = 'application/vnd.github+json'; 'User-Agent' = 'TounesTycoon' }

$artifacts = (Invoke-RestMethod -Uri "https://api.github.com/repos/hafedhhelali/tounes-tycoon/actions/artifacts?per_page=5" -Headers $headers).artifacts
foreach ($a in $artifacts) {
  Write-Host "Artifact: $($a.name), id=$($a.id), size=$($a.size_in_bytes), run=$($a.workflow_run.id)"
}

$apkArtifact = $artifacts | Where-Object { $_.name -like '*.apk' -or $_.name -like '*apk*' } | Select-Object -First 1
if ($apkArtifact) {
  $distDir = "C:\Projects\tounes-tycoon\dist"
  if (-not (Test-Path $distDir)) { New-Item -ItemType Directory -Path $distDir | Out-Null }
  Get-ChildItem $distDir | Remove-Item -Force
  
  $tempZip = Join-Path ([System.IO.Path]::GetTempPath()) "$($apkArtifact.name).zip"
  Write-Host "Downloading $($apkArtifact.name)..."
  Invoke-WebRequest -Uri $apkArtifact.archive_download_url -Headers $headers -OutFile $tempZip
  
  $extractDir = Join-Path ([System.IO.Path]::GetTempPath()) ([System.Guid]::NewGuid().ToString())
  Expand-Archive -Path $tempZip -DestinationPath $extractDir -Force
  $apkFile = Get-ChildItem -Path $extractDir -Filter *.apk -Recurse | Select-Object -First 1
  if ($apkFile) {
    $dest = Join-Path $distDir "$($apkArtifact.name)"
    if (-not $dest.EndsWith(".apk")) { $dest += ".apk" }
    Move-Item -Path $apkFile.FullName -Destination $dest -Force
    Write-Host "SUCCESS: APK saved to $dest"
  }
  Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
  Remove-Item $extractDir -Recurse -Force -ErrorAction SilentlyContinue
}
