export const environment = {
  production: false,
  apiUrl: (() => {
    // En desarrollo, intenta leer desde variable de entorno si está disponible
    if (typeof window !== 'undefined' && (window as any).__ENV__?.SPRING_PUBLIC_API_URL) {
      return (window as any).__ENV__.SPRING_PUBLIC_API_URL;
    }
    // Fallback a localhost
    return 'http://localhost:8090/api/v1';
  })(),
};
