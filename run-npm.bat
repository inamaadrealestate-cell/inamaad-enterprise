@echo off
set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"
"%~dp0node_modules\.bin\eslint.cmd" . --ext ts,tsx --report-unused-disable-directives --max-warnings 0
