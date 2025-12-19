@echo off
echo Creating final git commit for TaskHub QA Sandbox...
echo.

REM Add all files
git add .

REM Create commit
git commit -m "Add test case status editing - complete CRUD with status management"

echo.
echo Git commit created successfully!
echo.
echo Repository status:
git log --oneline -5
echo.
echo To push to GitHub, run:
echo git push -u origin master
echo.

pause