// Lee la URL del backend desde variable de entorno en Vercel
const springPublicApiUrl = typeof window !== 'undefined' ? (window as any)['SPRING_PUBLIC_API_URL'] : null;

export const environment = {
  production: true,
  // Prioriza variable de entorno, sino usa URL de Railway como fallback
  apiUrl: springPublicApiUrl || 'https://travelagent-production-05a4.up.railway.app/api/v1',
  exchangeRateApiUrl: 'https://api.exchangerate-api.com/v4/latest/USD',
};
