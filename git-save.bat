@echo off
echo ========================================
echo TaskHub QA Sandbox - Complete Git Save
echo ========================================
echo.

cd /d "%~dp0"

echo 📊 Checking Git status...
git status

echo.
echo ➕ Adding all files...
git add .

echo.
echo 💾 Creating commit...
git commit -m "🎯 TaskHub QA Sandbox v1.0 - Complete Implementation

✅ FULLY FUNCTIONAL QA TESTING PLATFORM

🚀 Core Features:
• JWT Authentication with separate login/register pages
• Complete CRUD operations for Users, Projects, Test Cases
• SQLite database with proper relationships and constraints
• REST API with comprehensive Swagger documentation
• Content Security Policy (CSP) protection
• Responsive modern UI with animations
• Automated server startup and status checking
• Comprehensive testing suite (Jest + Playwright)

🛡️ Security & Production Ready:
• CSP headers against XSS attacks
• Helmet security middleware
• CORS configuration
• Input validation and sanitization
• JWT token management with localStorage
• Password hashing with bcrypt
• Request rate limiting ready

🎨 User Experience:
• Separate authentication pages (no modals)
• Automatic server status detection
• File protocol protection and warnings
• Comprehensive error handling
• Mobile-responsive design
• Intuitive navigation and feedback

🗄️ Backend Architecture:
• Express.js server with proper middleware
• SQLite database with migrations
• RESTful API design with proper HTTP methods
• Request validation with express-validator
• Error handling and logging with Morgan
• Swagger API documentation

📊 Frontend Architecture:
• Vanilla JavaScript (ES6+) with modern practices
• Component-based UI architecture
• API client with automatic error handling
• State management for user interface
• Modern CSS with animations and transitions
• Progressive enhancement approach

🧪 Quality Assurance:
• Jest unit tests for backend
• Playwright E2E tests for frontend
• API integration tests
• Automated test execution scripts
• Code coverage reporting ready

📚 Documentation & Deployment:
• Complete README with setup instructions
• API documentation via Swagger UI
• Troubleshooting guides
• Environment configuration
• Production deployment scripts
• Docker support ready
• CI/CD pipeline configuration

🚀 Production Deployment Features:
• Environment variable configuration
• Production build scripts
• Health check endpoints
• Logging and monitoring ready
• Scalable architecture
• Security best practices implemented

This commit represents a complete, production-ready QA testing platform
with modern web development practices, security measures, and comprehensive testing."

if %errorlevel% equ 0 (
    echo.
    echo ✅ Commit created successfully!
    echo.
    echo 🚀 Pushing to GitHub...
    git push origin main

    if %errorlevel% equ 0 (
        echo.
        echo 🎉 SUCCESS! Project saved to GitHub!
        echo.
        echo 📋 Repository: https://github.com/Mars4325/Create-project
        echo 🌟 Check your commits and releases!
        echo.
    ) else (
        echo.
        echo ⚠️ Commit created, but push failed.
        echo Try pushing manually: git push origin main
        echo.
    )
) else (
    echo.
    echo ❌ Commit failed!
    echo Check the error messages above.
    echo.
)

pause