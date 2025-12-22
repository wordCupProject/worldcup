@echo off
echo ========================================
echo   WORLDCUP 2030 - DEMARRAGE COMPLET
echo ========================================
echo.
echo Ce script va demarrer le backend et le frontend.
echo.
echo PREREQUIS:
echo   1. MySQL demarre dans XAMPP
echo   2. Base de donnees 'worldcupdb' creee (ou sera creee auto)
echo   3. Java 17+ installe
echo   4. Node.js installe
echo.
pause

echo.
echo Demarrage du BACKEND dans une nouvelle fenetre...
start "WorldCup Backend" cmd /k "cd /d %~dp0 && start-backend.bat"

echo.
echo Attente de 10 secondes pour laisser le backend demarrer...
timeout /t 10 >nul

echo.
echo Demarrage du FRONTEND dans une nouvelle fenetre...
start "WorldCup Frontend" cmd /k "cd /d %~dp0 && start-frontend.bat"

echo.
echo ========================================
echo   LES DEUX SERVEURS SONT EN COURS DE DEMARRAGE
echo ========================================
echo.
echo Backend:  http://localhost:8081/api
echo Frontend: http://localhost:4200
echo.
echo Fermez les fenetres des serveurs pour les arreter.
echo.
pause
