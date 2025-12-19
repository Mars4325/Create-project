@echo off
echo Synchronizing all changes with GitHub...
echo.

echo Current status:
git status
echo.

echo Checking last commits:
git log --oneline -5
echo.

echo Adding any remaining changes:
git add .
echo.

echo Committing if there are changes:
git commit -m "Complete sync - all final changes included" 2>nul || echo No changes to commit
echo.

echo Pushing to GitHub:
git push origin master
echo.

echo Final verification:
git log --oneline -3
echo.

echo Remote status:
git status
echo.

echo All changes should now be synchronized on GitHub!
echo Visit: https://github.com/Mars4325/Create-project
echo.

pause