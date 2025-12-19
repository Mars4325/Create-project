@echo off
echo ========================================
echo GIT COMMIT - TaskHub QA Sandbox
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Git status...
git status

echo.
echo Adding all changes...
git add .

echo.
echo Creating commit...
git commit -m "Fix TestCase owner column display - show usernames instead of UUIDs

- Add created_by_username and assigned_to_username fields to TestCase model constructor
- Ensure JOIN queries properly fetch user data for test cases
- Update frontend rendering to display usernames in test cases table
- Add debug and testing files for validation
- Create restart server script for fresh deployment"

echo.
echo Commit completed successfully!
echo.

echo Current Git status:
git status

echo.
echo If you want to push to GitHub, run: git push origin main
echo.
pause