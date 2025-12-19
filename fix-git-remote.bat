@echo off
echo Fixing Git remote repository...
echo.

echo Current remote repositories:
git remote -v
echo.

echo Removing existing origin...
git remote remove origin
echo.

echo Adding new origin: https://github.com/Mars4325/Create-project.git
git remote add origin https://github.com/Mars4325/Create-project.git
echo.

echo Verifying new remote:
git remote -v
echo.

echo Now you can push with:
echo git push -u origin master
echo.

pause