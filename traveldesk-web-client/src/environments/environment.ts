export const environment = {
  production: false,
  apiUrl: "http://localhost:8090/api/v1",
  // Variable para variable de entorno en runtime
  apiUrlFromEnv: typeof window !== 'undefined' ? (window as any)['SPRING_PUBLIC_API_URL'] : null,
};
