@echo off
echo ========================================
echo PUSH ALL CHANGES TO GITHUB
echo ========================================
echo.

cd /d "%~dp0"

echo Current Git status:
git status
echo.

echo ========================================
echo STEP 1: Adding all changes...
echo ========================================
git add .
echo Changes added.
echo.

echo ========================================
echo STEP 2: Creating commit...
echo ========================================
git commit -m "TaskHub QA Sandbox - Complete implementation

- Full CRUD operations for Users, Projects, Test Cases
- JWT authentication system with login/register pages
- Role-based access control (admin, qa, user)
- Owner columns display usernames instead of UUIDs
- Responsive UI with proper error handling
- API documentation and health endpoints
- GitHub Actions CI/CD pipeline
- Comprehensive testing and debugging tools"
echo Commit created.
echo.

echo ========================================
echo STEP 3: Pushing to GitHub...
echo ========================================
git push origin main
echo.

echo ========================================
echo SUCCESS! All changes pushed to GitHub
echo ========================================
echo.
echo Repository URL: https://github.com/Mars4325/Create-project
echo.

echo To check the repository online, visit the URL above.
echo.

pause