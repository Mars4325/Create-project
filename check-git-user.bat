@echo off
echo Checking Git user configuration...
echo.

echo Current Git user name:
git config user.name
echo.

echo Current Git user email:
git config user.email
echo.

echo If these are not set, you can configure them with:
echo git config --global user.name "Your Name"
echo git config --global user.email "your.email@example.com"
echo.

pause