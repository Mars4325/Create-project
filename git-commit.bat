@echo off
echo Creating git commit for TaskHub QA Sandbox...

REM Add all files
git add .

REM Create commit
git commit -m "TaskHub QA Sandbox - Full CRUD implementation with UI fixes"

echo Git commit created successfully!
echo.
echo To push to remote repository, use:
echo git remote add origin ^<repository-url^>
echo git push -u origin main
echo.
pause