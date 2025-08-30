# DevNovate Blog Platform - Deployment Helper Script
# Run this script to check deployment readiness and get instructions

Write-Host "🚀 DevNovate Blog Platform - Deployment Helper" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

# Check current directory
$currentPath = Get-Location
Write-Host "📁 Current Directory: $currentPath" -ForegroundColor Cyan
Write-Host ""

# Check if required files exist
Write-Host "📋 Checking Project Files..." -ForegroundColor Yellow
Write-Host ""

$requiredFiles = @(
    "README.md",
    "LICENSE", 
    "CONTRIBUTORS.md",
    ".gitignore",
    "frontend\package.json",
    "backend\package.json",
    "backend\server.js"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (MISSING)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

# Check if Git is available
Write-Host "🔧 Checking Git Installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
        $gitAvailable = $true
    } else {
        throw "Git not found"
    }
} catch {
    Write-Host "❌ Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "📥 Download Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    $gitAvailable = $false
}

Write-Host ""

# Check if node_modules exist
Write-Host "📦 Checking Dependencies..." -ForegroundColor Yellow
if (Test-Path "backend\node_modules") {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Run: cd backend && npm install" -ForegroundColor Cyan
}

if (Test-Path "frontend\node_modules") {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Run: cd frontend && npm install" -ForegroundColor Cyan
}

Write-Host ""

# Deployment readiness assessment
Write-Host "🎯 Deployment Readiness Assessment" -ForegroundColor Magenta
Write-Host "===================================" -ForegroundColor Magenta
Write-Host ""

if ($allFilesExist) {
    Write-Host "✅ All required files are present" -ForegroundColor Green
} else {
    Write-Host "❌ Some required files are missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "🚀 Next Steps for Deployment:" -ForegroundColor Yellow
Write-Host ""

if ($gitAvailable) {
    Write-Host "1. 📋 Create GitHub Repository:" -ForegroundColor Cyan
    Write-Host "   - Go to https://github.com" -ForegroundColor White
    Write-Host "   - Click 'New Repository'" -ForegroundColor White
    Write-Host "   - Name: devnovate-blog-platform" -ForegroundColor White
    Write-Host "   - Make it Public" -ForegroundColor White
    Write-Host ""
    
    Write-Host "2. 📤 Upload Project to GitHub:" -ForegroundColor Cyan
    Write-Host "   git init" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor White
    Write-Host "   git commit -m ""DevNovate Blog Platform - VIBE HACK 2025""" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/YOUR-USERNAME/devnovate-blog-platform.git" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "1. 📥 Install Git:" -ForegroundColor Cyan
    Write-Host "   - Download from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "   - Or use GitHub Desktop: https://desktop.github.com" -ForegroundColor White
    Write-Host ""
    
    Write-Host "2. 📤 Alternative - Direct Upload:" -ForegroundColor Cyan
    Write-Host "   - Create repository on GitHub.com" -ForegroundColor White
    Write-Host "   - Use 'Upload files' option" -ForegroundColor White
    Write-Host "   - Drag and drop all project files" -ForegroundColor White
    Write-Host ""
}

Write-Host "3. 🗄️ Deploy Database (MongoDB Atlas):" -ForegroundColor Cyan
Write-Host "   - Sign up at: https://www.mongodb.com/atlas" -ForegroundColor White
Write-Host "   - Create free M0 cluster" -ForegroundColor White
Write-Host "   - Create database user and get connection string" -ForegroundColor White
Write-Host ""

Write-Host "4. 🌐 Deploy Backend (Railway.app):" -ForegroundColor Cyan
Write-Host "   - Sign up at: https://railway.app" -ForegroundColor White
Write-Host "   - Deploy from GitHub repository" -ForegroundColor White
Write-Host "   - Select 'backend' folder" -ForegroundColor White
Write-Host "   - Add environment variables" -ForegroundColor White
Write-Host ""

Write-Host "5. 🎨 Deploy Frontend (Vercel):" -ForegroundColor Cyan
Write-Host "   - Sign up at: https://vercel.com" -ForegroundColor White
Write-Host "   - Import GitHub repository" -ForegroundColor White
Write-Host "   - Select 'frontend' folder" -ForegroundColor White
Write-Host "   - Add REACT_APP_API_URL environment variable" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Expected Result:" -ForegroundColor Green
Write-Host "   Frontend: https://devnovate-blog-platform.vercel.app" -ForegroundColor White
Write-Host "   Backend:  https://your-backend.up.railway.app/api" -ForegroundColor White
Write-Host ""

Write-Host "📚 Detailed Instructions:" -ForegroundColor Yellow
Write-Host "   - Read: QUICK_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "   - Follow: LIVE_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host ""

Write-Host "🏆 Good luck with your VIBE HACK 2025 submission!" -ForegroundColor Green
Write-Host "    Made with ❤️ by BIT Durg Students" -ForegroundColor Green
