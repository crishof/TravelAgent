// Archivo de configuración inyectado en runtime
// En Vercel, este archivo se genera automáticamente con las variables de entorno

window['SPRING_PUBLIC_API_URL'] = window['SPRING_PUBLIC_API_URL'] || (
  typeof process !== 'undefined' && process.env?.SPRING_PUBLIC_API_URL 
    ? process.env.SPRING_PUBLIC_API_URL 
    : 'https://travelagent-production-05a4.up.railway.app/api/v1'
);
