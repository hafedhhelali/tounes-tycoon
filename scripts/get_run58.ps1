$creds = "protocol=https`nhost=github.com`n`n" | git credential fill
$tokenMatch = ($creds | Select-String -Pattern 'password=(.*)')
$token = $tokenMatch.Matches.Groups[1].Value
$headers = @{ 'Authorization' = "Bearer $token"; 'Accept' = 'application/vnd.github+json'; 'User-Agent' = 'TounesTycoon' }

$artifacts = (Invoke-RestMethod -Uri "https://api.github.com/repos/hafedhhelali/tounes-tycoon/actions/runs/40032704244/artifacts" -Headers $headers).artifacts
$art = $artifacts[0]
Write-Host "Downloading latest run #58 artifact: $($art.name)..."

$tempZip = Join-Path ([System.IO.Path]::GetTempPath()) "run58.zip"
Invoke-WebRequest -Uri $art.archive_download_url -Headers $headers -OutFile $tempZip

$extractDir = Join-Path ([System.IO.Path]::GetTempPath()) ([System.Guid]::NewGuid().ToString())
Expand-Archive -Path $tempZip -DestinationPath $extractDir -Force
$apk = Get-ChildItem -Path $extractDir -Filter *.apk -Recurse | Select-Object -First 1

$distDir = "C:\Projects\tounes-tycoon\dist"
Get-ChildItem $distDir | Remove-Item -Force
Move-Item -Path $apk.FullName -Destination (Join-Path $distDir "tounes-tycoon-58-beta.apk") -Force

Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
Remove-Item $extractDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "DEPLOYED TO DIST:"
Get-ChildItem $distDir | Select-Object Name, Length, LastWriteTime
