@echo off
echo SIMPLE SYNC - Just push current state
echo.

echo Current status:
git status --porcelain
echo.

echo Adding all changes:
git add -A

echo Committing if needed:
git diff --cached --quiet || git commit -m "Sync update %DATE% %TIME%"

echo Pushing to GitHub:
git push origin master

echo.
echo Check: https://github.com/Mars4325/Create-project
echo.

pause