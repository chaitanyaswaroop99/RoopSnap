# Deployment Script for RoopSnap
# Run this script to prepare your project for deployment

Write-Host "=== RoopSnap Deployment Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "✓ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "Project directory: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Check if .git exists
if (Test-Path ".git") {
    Write-Host "✓ Git repository already initialized" -ForegroundColor Green
} else {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

# Check if files are tracked
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host ""
    Write-Host "Adding files to Git..." -ForegroundColor Yellow
    git add .
    Write-Host "✓ Files added" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Creating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit - RoopSnap photography website"
    Write-Host "✓ Commit created" -ForegroundColor Green
} else {
    Write-Host "✓ All files are already committed" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create a GitHub repository:" -ForegroundColor Yellow
Write-Host "   - Go to https://github.com/new" -ForegroundColor White
Write-Host "   - Name it: chaya-captures" -ForegroundColor White
Write-Host "   - Don't initialize with README" -ForegroundColor White
Write-Host "   - Click 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "2. Push your code to GitHub:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/chaya-captures.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "3. Deploy on Railway:" -ForegroundColor Yellow
Write-Host "   - Go to https://railway.app" -ForegroundColor White
Write-Host "   - Sign in with GitHub" -ForegroundColor White
Write-Host "   - Click 'New Project' → 'Deploy from GitHub repo'" -ForegroundColor White
Write-Host "   - Select your repository" -ForegroundColor White
Write-Host "   - Wait for deployment!" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see: DEPLOY_NOW.md" -ForegroundColor Cyan
Write-Host ""

