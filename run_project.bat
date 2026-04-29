@echo off
title EcoGuard AI Project Runner
echo ===================================================
echo   EcoGuard AI: Economic Crisis Prediction System
echo ===================================================
echo.
echo [1] Starting ML Model Training Demo...
echo.
python model/economic_model.py
echo.
echo ===================================================
echo [2] Opening Interactive Dashboard...
echo ===================================================
timeout /t 3
start frontend/index.html
echo.
echo Project is running. You can now present the Dashboard to the judges.
pause
