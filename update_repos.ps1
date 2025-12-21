$currentDir = Get-Location
$sourceGithubDir = Join-Path $currentDir ".github"

# 1. Get list of repos (we only need the name now)
Write-Host "Fetching repository list..." -ForegroundColor Cyan
$repos = gh repo list --limit 100 --source --json name,url | ConvertFrom-Json

$tempDir = Join-Path $Env:TEMP "gh-update-temp"
if (Test-Path $tempDir) { Remove-Item -Path $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

foreach ($repo in $repos) {
    if ($repo.name -eq "lich-am") { continue } # Skip current repo

    Write-Host "Processing $($repo.name)..." -ForegroundColor Yellow
    $repoDir = Join-Path $tempDir $repo.name

    # 2. Clone repo using gh (handles auth automatically)
    # We use the full URL or "owner/name", but safely just clone into the dir
    Push-Location $tempDir
    gh repo clone $repo.name
    if (-not $?) { 
        Write-Warning "Failed to clone $($repo.name)"
        Pop-Location
        continue 
    }
    Pop-Location

    # 3. Copy .github folder
    $destGithubDir = Join-Path $repoDir ".github"
    if (Test-Path $destGithubDir) { Remove-Item -Path $destGithubDir -Recurse -Force }
    Copy-Item -Path $sourceGithubDir -Destination $destGithubDir -Recurse -Force

    # 4. Commit and Push
    Push-Location $repoDir
    git add .github
    $status = git status --porcelain
    if ($status) {
        git commit -m "chore: add automated workflow bots (CI, CodeQL, Labeler, Release Drafter)"
        git push origin main
        Write-Host "Successfully updated $($repo.name)" -ForegroundColor Green
    } else {
        Write-Host "No changes for $($repo.name)" -ForegroundColor Gray
    }
    Pop-Location
}

# Cleanup
Remove-Item -Path $tempDir -Recurse -Force
Write-Host "All done!" -ForegroundColor Cyan
