@echo off
echo ========================================
echo   VERIFICATION DES PREREQUIS
echo ========================================
echo.

set ERRORS=0

REM Verification Java
echo [1/4] Verification de Java...
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Java est installe
    java -version 2>&1 | findstr /i "version"
) else (
    echo   [ERREUR] Java n'est pas installe ou pas dans le PATH
    echo   Telechargez Java 17+: https://www.oracle.com/java/technologies/downloads/
    set ERRORS=1
)
echo.

REM Verification Node.js
echo [2/4] Verification de Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] Node.js est installe
    node --version
    npm --version
) else (
    echo   [ERREUR] Node.js n'est pas installe
    echo   Telechargez Node.js: https://nodejs.org/
    set ERRORS=1
)
echo.

REM Verification MySQL (via netstat)
echo [3/4] Verification de MySQL (port 3306)...
netstat -an | findstr ":3306" >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] MySQL semble etre actif sur le port 3306
) else (
    echo   [ATTENTION] MySQL ne semble pas actif
    echo   Demarrez MySQL dans XAMPP Control Panel
    set ERRORS=1
)
echo.

REM Verification des fichiers du projet
echo [4/4] Verification des fichiers du projet...
if exist "backend\pom.xml" (
    echo   [OK] Fichier backend\pom.xml trouve
) else (
    echo   [ERREUR] backend\pom.xml introuvable
    set ERRORS=1
)

if exist "backend\src\main\resources\application.properties" (
    echo   [OK] Fichier application.properties trouve
) else (
    echo   [ERREUR] application.properties introuvable
    set ERRORS=1
)

if exist "frontend\package.json" (
    echo   [OK] Fichier frontend\package.json trouve
) else (
    echo   [ERREUR] frontend\package.json introuvable
    set ERRORS=1
)
echo.

REM Resultat final
echo ========================================
if %ERRORS% equ 0 (
    echo   TOUT EST PRET! Vous pouvez demarrer.
    echo   Executez: start-all.bat
) else (
    echo   ATTENTION: Certains prerequis manquent
    echo   Veuillez les installer avant de continuer
)
echo ========================================
echo.

pause
