@echo off
echo ========================================
echo SAVING TaskHub QA Sandbox to Git
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Checking Git status...
cmd /c "git status"

echo.
echo Step 2: Adding all files...
cmd /c "git add ."

echo.
echo Step 3: Creating commit...
cmd /c "git commit -m \"🎯 TaskHub QA Sandbox v1.0 - Complete QA Testing Platform

✅ FULLY FUNCTIONAL APPLICATION WITH ALL FEATURES

🚀 CORE FEATURES IMPLEMENTED:
• Complete JWT Authentication (separate login/register pages)
• Full CRUD Operations (Users, Projects, Test Cases)
• SQLite Database with proper relationships
• REST API with Swagger documentation
• Content Security Policy (CSP) protection
• Responsive modern UI design
• Automated server startup scripts
• Comprehensive testing framework

🛡️ SECURITY & PRODUCTION READY:
• CSP headers against XSS attacks
• Helmet security middleware
• CORS configuration
• JWT token management
• Password hashing with bcrypt
• Input validation and sanitization

🎨 USER EXPERIENCE:
• Separate authentication pages (no modals)
• Automatic server status detection
• File protocol protection
• Mobile-responsive design
• Intuitive error handling

🗄️ BACKEND ARCHITECTURE:
• Express.js server with proper middleware
• SQLite with foreign keys and indexes
• RESTful API design
• Request validation
• Error handling and logging

📊 FRONTEND ARCHITECTURE:
• Vanilla JavaScript ES6+
• Modern CSS with animations
• Component-based structure
• API client with error handling
• State management

🧪 TESTING & QUALITY:
• Jest unit tests
• Playwright E2E tests
• API integration tests
• Automated test execution

📚 DOCUMENTATION:
• Complete README
• API docs (Swagger)
• Setup instructions
• Troubleshooting guides

🚀 DEPLOYMENT READY:
• Environment configuration
• Production scripts
• Health check endpoints
• Docker ready
• CI/CD ready

This commit represents a complete, production-ready
QA testing platform with modern development practices.\""

if %errorlevel% equ 0 (
    echo.
    echo ✅ COMMIT CREATED SUCCESSFULLY!
    echo.
    echo Step 4: Pushing to GitHub...
    cmd /c "git push origin main"

    if %errorlevel% equ 0 (
        echo.
        echo 🎉 SUCCESS! PROJECT SAVED TO GITHUB!
        echo.
        echo 📋 Repository: https://github.com/Mars4325/Create-project
        echo 🌟 Check your commits online!
        echo.
    ) else (
        echo.
        echo ⚠️ COMMIT CREATED, BUT PUSH FAILED
        echo Try pushing manually later:
        echo git push origin main
        echo.
    )
) else (
    echo.
    echo ❌ COMMIT FAILED!
    echo Check for errors above.
    echo.
)

echo Press any key to continue...
pause >nul