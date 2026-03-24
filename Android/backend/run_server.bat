@echo off
cd /d "%~dp0"
call venv\Scripts\activate.bat
echo Starting backend server on all network interfaces...
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
