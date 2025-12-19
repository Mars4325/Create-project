@echo off
echo FINAL SYNCHRONIZATION - All files to current time
echo.

cd "d:\для курсора\taskhub-qa-sandbox"

echo Adding timestamp to force update...
echo // Sync timestamp: %DATE% %TIME% >> backend\src\database\init.js

echo Adding all files...
git add -A

echo Creating commit...
git commit -m "FINAL SYNC - All files updated %DATE% %TIME%"

echo Pushing to GitHub...
git push -f origin master

echo.
echo DONE! Check GitHub - all files should show current time
echo https://github.com/Mars4325/Create-project
echo.

pause