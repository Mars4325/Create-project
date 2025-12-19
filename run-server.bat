@echo off
echo Starting TaskHub QA Sandbox Server...
cd /d "%~dp0backend"
if exist database\taskhub.db (
    echo Removing old database...
    del database\taskhub.db
)
echo Starting server...
node server.js
pause