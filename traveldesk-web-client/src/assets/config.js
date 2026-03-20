// Archivo de configuración inyectado en runtime
// En Vercel, este archivo se genera automáticamente con las variables de entorno

(function() {
  if (typeof window !== 'undefined' && !window.__ENV__) {
    const apiUrl = 'https://travelagent-production-05a4.up.railway.app/api/v1';
    window.__ENV__ = { SPRING_PUBLIC_API_URL: apiUrl };
    console.log('✓ API URL configured (via config.js):', apiUrl);
  }
})();
