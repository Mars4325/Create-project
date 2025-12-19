@echo off
echo Final commit and push to GitHub...
echo.

echo Adding all changes:
git add .
echo.

echo Creating final commit:
git commit -m "Final updates - test case status editing and complete project polish"
echo.

echo Pushing to GitHub:
git push origin master
echo.

echo Checking final status:
git log --oneline -3
echo.

echo GitHub repository: https://github.com/Mars4325/Create-project
echo All changes have been successfully uploaded!
echo.

pause