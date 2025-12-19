@echo off
echo FINAL SYNCHRONIZATION - Force update all files
echo.

echo Step 1: Creating a dummy change to force update...
echo. >> backend\src\database\init.js
echo Dummy line added to force Git update

echo Step 2: Adding ALL files...
git add -A

echo Step 3: Creating commit with force update...
git commit -m "FORCE UPDATE - All files synchronized %DATE% %TIME%" --allow-empty

echo Step 4: Force pushing to GitHub...
git push -f origin master

echo Step 5: Cleaning up dummy change...
git checkout HEAD~1 -- backend\src\database\init.js 2>nul

echo.
echo SUCCESS! All files should now show current timestamp on GitHub
echo Refresh https://github.com/Mars4325/Create-project
echo.

pause