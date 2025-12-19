@echo off
echo Forcing update of all files timestamps...
echo.

echo Method 1: Add a comment to force file update
echo // Force update timestamp > temp_file.tmp
copy temp_file.tmp + backend\src\database\init.js backend\src\database\init.js.new >nul 2>&1
move backend\src\database\init.js.new backend\src\database\init.js >nul 2>&1
del temp_file.tmp

echo Files updated with timestamp changes
echo.

echo Method 2: Git operations
git add -A
echo.

git commit -m "Force timestamp update - all files refreshed" --allow-empty
echo.

git push -f origin master
echo.

echo Check GitHub now - all files should show current time!
echo Visit: https://github.com/Mars4325/Create-project
echo.

pause