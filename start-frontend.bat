@echo off
echo ========================================
echo   DEMARRAGE DU FRONTEND ANGULAR
echo ========================================
echo.

cd frontend

echo [1/2] Installation des dependances npm...
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ERREUR: Installation des dependances echouee!
        pause
        exit /b %errorlevel%
    )
) else (
    echo Les dependances sont deja installees.
)

echo.
echo [2/2] Demarrage du serveur Angular...
echo Le frontend sera accessible sur: http://localhost:4200
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

call npm start

pause
