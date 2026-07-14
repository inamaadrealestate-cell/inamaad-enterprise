@echo off
set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"
"%~dp0node_modules\.bin\vite.cmd" build
