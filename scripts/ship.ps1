param([Parameter(Mandatory=$true)][string]$Msg)
# Livraison unique: test -> sync www -> MD auto -> commit -> push -> verif.
Set-Location (Split-Path $PSScriptRoot -Parent)

$t = npm test 2>&1 | Out-String
if ($t -notmatch 'fail 0') { Write-Host (($t -split "`n") | Select-Object -Last 15); throw 'Tests KO' }

Copy-Item index.html,engine.js,audio.js,ads_service.js,store_animator.js www -Force

# MD auto: date HANDOFF + entree CHANGELOG
$day = Get-Date -Format 'yyyy-MM-dd'
$h = Get-Content HANDOFF.md -Raw -Encoding utf8
$h = $h -replace '(?m)^MAJ: .*$', "MAJ: $day - etat = HEAD de main (voir git log -n1)"
Set-Content HANDOFF.md $h -Encoding utf8 -NoNewline
$c = Get-Content CHANGELOG.md -Raw -Encoding utf8
if ($c -notmatch "## $day") { $c = $c -replace '# CHANGELOG', "# CHANGELOG`n`n## $day" }
$c = $c -replace "## $day", "## $day`n- $Msg"
Set-Content CHANGELOG.md $c -Encoding utf8 -NoNewline

# git ecrit des warnings sur stderr: ne pas les traiter comme erreurs, verifier les codes.
git add -A 2>$null
git commit -q -m $Msg 2>$null
if ($LASTEXITCODE -ne 0) { throw 'Commit KO (hook ou rien a commiter)' }
git push origin HEAD 2>$null
git fetch -q 2>$null
$s = git status -sb 2>$null | Select-Object -First 1
if ($s -match 'ahead|behind') { throw "Push NON confirme: $s" }
Write-Host "OK pushe: $(git log -n1 --oneline)"
