const fs = require('fs');
const path = require('path');

/**
 * Script qui inyecta variables de entorno en el HTML generado por Angular
 * Se ejecuta después del build de Angular, antes de que Vercel despliegue
 */

const distPath = path.join(__dirname, '../dist/traveldesk');
const indexPath = path.join(distPath, 'index.html');

// Leer variables de entorno
const apiUrl = process.env.SPRING_PUBLIC_API_URL || 'https://travelagent-production-05a4.up.railway.app/api/v1';

console.log(`\n📝 Inyectando variables de entorno en HTML...`);
console.log(`API URL: ${apiUrl}`);

try {
  if (fs.existsSync(indexPath)) {
    // Leer el HTML generado
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    // Reemplazar placeholders con valores reales
    htmlContent = htmlContent.replace(/%%SPRING_PUBLIC_API_URL%%/g, apiUrl);
    
    // Escribir el HTML modificado
    fs.writeFileSync(indexPath, htmlContent, 'utf8');
    
    console.log(`✅ HTML actualizado correctamente en: ${indexPath}`);
    console.log(`\n✓ Variables inyectadas:`);
    console.log(`  - SPRING_PUBLIC_API_URL: ${apiUrl}`);
  } else {
    console.warn(`⚠️  No se encontró index.html en: ${indexPath}`);
    console.log(`   Asegúrate de ejecutar este script después del build de Angular`);
  }
} catch (error) {
  console.error(`❌ Error inyectando variables:`, error.message);
  process.exit(1);
}
