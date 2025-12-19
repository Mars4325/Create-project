@echo off
echo Checking Git repository status...
echo.

echo Current branch and tracking:
git branch -vv
echo.

echo Last 3 commits:
git log --oneline -3
echo.

echo Status of working directory:
git status
echo.

echo Remote repository info:
git remote -v
echo.

echo To force push if needed:
echo git push -f origin master
echo.

pause