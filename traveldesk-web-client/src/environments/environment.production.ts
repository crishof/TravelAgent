// Lee la URL del backend desde variable de entorno en Vercel
const getApiUrl = (): string => {
  // Lee desde window.__ENV__ que se establece en el script inline del index.html
  if (typeof window !== 'undefined' && (window as any).__ENV__?.SPRING_PUBLIC_API_URL) {
    return (window as any).__ENV__.SPRING_PUBLIC_API_URL;
  }
  // Fallback
  return 'https://travelagent-production-05a4.up.railway.app/api/v1';
};

export const environment = {
  production: true,
  // apiUrl es una función que se evalúa en runtime
  apiUrl: getApiUrl(),
  exchangeRateApiUrl: 'https://api.exchangerate-api.com/v4/latest/USD',
};
