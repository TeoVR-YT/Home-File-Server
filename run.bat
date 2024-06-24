@echo off

REM Run the server
echo Starting the server...
node server.js

IF %ERRORLEVEL% NEQ 0 (
    echo Failed to start the server. Please check your server.js file for errors and try again.
    pause
    exit /b 1
)

REM Keep the window open
pause