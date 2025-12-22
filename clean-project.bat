@echo off
echo ========================================
echo   NETTOYAGE DU PROJET WORLDCUP 2030
echo ========================================
echo.
echo Ce script va supprimer tous les fichiers de build,
echo caches, et node_modules pour un nouveau demarrage.
echo.
pause

echo.
echo [1/4] Nettoyage du backend (Maven)...
if exist "backend\target" (
    rmdir /s /q "backend\target"
    echo   [OK] Dossier backend\target supprime
) else (
    echo   [INFO] Pas de dossier backend\target
)

echo.
echo [2/4] Nettoyage du frontend (Node modules)...
if exist "frontend\node_modules" (
    echo   Suppression de node_modules (peut prendre du temps)...
    rmdir /s /q "frontend\node_modules"
    echo   [OK] Dossier frontend\node_modules supprime
) else (
    echo   [INFO] Pas de dossier frontend\node_modules
)

echo.
echo [3/4] Nettoyage du cache Angular...
if exist "frontend\.angular" (
    rmdir /s /q "frontend\.angular"
    echo   [OK] Cache Angular supprime
) else (
    echo   [INFO] Pas de cache Angular
)

if exist "frontend\dist" (
    rmdir /s /q "frontend\dist"
    echo   [OK] Dossier dist supprime
) else (
    echo   [INFO] Pas de dossier dist
)

echo.
echo [4/4] Nettoyage des logs...
if exist "*.log" (
    del /q "*.log"
    echo   [OK] Fichiers logs supprimes
)

if exist "backend\*.log" (
    del /q "backend\*.log"
    echo   [OK] Logs backend supprimes
)

if exist "frontend\*.log" (
    del /q "frontend\*.log"
    echo   [OK] Logs frontend supprimes
)

echo.
echo ========================================
echo   NETTOYAGE TERMINE!
echo ========================================
echo.
echo Prochaines etapes:
echo   1. Executez: start-backend.bat
echo   2. Executez: start-frontend.bat
echo   OU
echo   Executez: start-all.bat
echo.
pause
