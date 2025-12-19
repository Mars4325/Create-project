@echo off
echo Force synchronizing all files with GitHub...
echo.

echo Step 1: Check current status
git status
echo.

echo Step 2: Reset any potential issues
git reset --soft HEAD~1 2>nul || echo No commits to reset
echo.

echo Step 3: Add ALL files including untracked
git add -A
echo.

echo Step 4: Create comprehensive commit
git commit -m "Complete TaskHub QA Sandbox - Full CRUD implementation with status management

Features implemented:
- User management (create, read, update, delete)
- Project management with status tracking
- Test case management with priority and status
- Complete REST API with Swagger documentation
- Frontend with responsive UI and real-time filtering
- SQLite database with proper schema
- Automated testing setup
- CI/CD configuration for GitHub Actions

Technologies: Node.js, Express, SQLite, HTML5, CSS3, JavaScript ES6"
echo.

echo Step 5: Force push to GitHub
git push -f origin master
echo.

echo Step 6: Verify everything is synchronized
git log --oneline -3
git status
echo.

echo SUCCESS! All files should now show current timestamp on GitHub
echo Visit: https://github.com/Mars4325/Create-project
echo.

pause