@echo off
echo Starting Music Player...
start "" http://localhost:8000
python -m http.server 8000
pause
