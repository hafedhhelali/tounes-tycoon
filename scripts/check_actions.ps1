$creds = "protocol=https`nhost=github.com`n`n" | git credential fill
$tokenMatch = ($creds | Select-String -Pattern 'password=(.*)')
$token = $tokenMatch.Matches.Groups[1].Value
$headers = @{ 'Authorization' = "Bearer $token"; 'Accept' = 'application/vnd.github+json'; 'User-Agent' = 'TounesTycoon' }
$runs = (Invoke-RestMethod -Uri "https://api.github.com/repos/hafedhhelali/tounes-tycoon/actions/runs?per_page=5" -Headers $headers).workflow_runs
foreach ($r in $runs) {
  Write-Host "Run #$($r.run_number): status=$($r.status), conclusion=$($r.conclusion), commit=$($r.head_commit.message.Split("`n")[0])"
}
