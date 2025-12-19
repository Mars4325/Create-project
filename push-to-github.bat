@echo off
echo Pushing to GitHub repository...
echo.

echo Current directory:
cd
echo.

echo Checking git status:
git status
echo.

echo Checking remote:
git remote -v
echo.

echo Pushing to GitHub:
git push -u origin master
echo.

echo If push fails, try force push:
echo git push -f origin master
echo.

echo GitHub repository: https://github.com/Mars4325/Create-project
echo.

pause