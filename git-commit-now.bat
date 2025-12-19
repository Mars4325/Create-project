@echo off
cd "d:\для курсора\taskhub-qa-sandbox"
echo Adding changes...
git add .
echo Committing changes...
git commit -m "Fix TestCase owner column - show usernames instead of UUIDs"
echo Done!
pause