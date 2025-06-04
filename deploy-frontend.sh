#!/bin/bash

# === Configuración ===
ANGULAR_PROJECT_PATH="./frontend/travelApp"
BACKEND_STATIC_PATH="./backend/travelAgent/src/main/resources/static"
BUILD_FOLDER="dist/travelApp/browser"

echo "🧱 1. Compilando Angular (modo producción)..."
cd "$ANGULAR_PROJECT_PATH" || { echo "❌ No se encontró $ANGULAR_PROJECT_PATH"; exit 1; }

npm run build -- --configuration=production || { echo "❌ Falló la compilación de Angular"; exit 1; }

echo "🧹 2. Limpiando archivos antiguos en static..."
rm -rf "$BACKEND_STATIC_PATH"/*

echo "📦 3. Copiando archivos compilados a static/"
cp -r "$BUILD_FOLDER"/* "$BACKEND_STATIC_PATH"/

echo "✅ Archivos copiados correctamente."

# Opcional: compilar backend
read -p "¿Querés compilar el backend ahora? (s/n): " buildBackend
if [[ "$buildBackend" == "s" || "$buildBackend" == "S" ]]; then
  echo "🛠 4. Compilando backend con Maven..."
  cd ../../backend/travelAgent || exit 1
  mvn clean package -DskipTests
fi

echo "🚀 ¡Listo para hacer git commit y push!"