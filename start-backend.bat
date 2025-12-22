@echo off
echo ========================================
echo   DEMARRAGE DU BACKEND SPRING BOOT
echo ========================================
echo.

cd backend

echo [1/3] Verification de la base de donnees...
echo Assurez-vous que MySQL est demarre dans XAMPP!
echo.
timeout /t 3 >nul

echo [2/3] Nettoyage et compilation du projet...
call mvnw.cmd clean install -DskipTests
if %errorlevel% neq 0 (
    echo.
    echo ERREUR: La compilation a echoue!
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Demarrage du serveur Spring Boot...
echo Le backend sera accessible sur: http://localhost:8080/api
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

call mvnw.cmd spring-boot:run

pause
