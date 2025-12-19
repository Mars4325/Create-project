@echo off
echo Complete synchronization with timestamp update...
echo.

echo Step 1: Force timestamp change on a key file
echo // Last sync: %DATE% %TIME% >> backend\src\database\init.js
echo Timestamp added to init.js
echo.

echo Step 2: Add all changes
git add -A
echo.

echo Step 3: Commit with current timestamp
git commit -m "Complete sync %DATE% %TIME% - all files updated with current timestamp"
echo.

echo Step 4: Force push to GitHub
git push -f origin master
echo.

echo Step 5: Verification
git log --oneline -1
git status
echo.

echo SUCCESS! All files should now show current timestamp on GitHub
echo Refresh the GitHub page to see the updates
echo URL: https://github.com/Mars4325/Create-project
echo.

pause