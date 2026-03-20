# Configuración de Vercel para TravelDesk

## 🚀 Paso 1: Variables de Entorno en Vercel

En el dashboard de Vercel, ve a **Settings** → **Environment Variables** y agrega:

```
SPRING_PUBLIC_API_URL = https://travelagent-production-05a4.up.railway.app/api/v1
```

⚠️ **Importante**: Selecciona `Production` en el dropdown de entornos.

## 📝 Paso 2: Build Command

Vercel debería usar automáticamente el comando del `vercel.json`, pero si no funciona, establece manualmente:

**Build Command:**
```bash
npm run build:prod && npm run inject-env
```

**Output Directory:**
```
dist/traveldesk
```

## ✅ Cómo funciona

1. **index.html** tiene un script inline que establece `window.__ENV__.SPRING_PUBLIC_API_URL`
2. **script inject-env.js** se ejecuta después del build y reemplaza `%%SPRING_PUBLIC_API_URL%%` con el valor real
3. **environment.production.ts** lee desde `window.__ENV__.SPRING_PUBLIC_API_URL`
4. Todos los servicios de Angular usan `environment.apiUrl` automáticamente

## 🧪 Verificar que funciona

Una vez deployado en Vercel, abre la consola del navegador (F12) y verifica:

```javascript
console.log(window.__ENV__.SPRING_PUBLIC_API_URL)
// Debería mostrar: https://travelagent-production-05a4.up.railway.app/api/v1
```

## 🔧 En Desarrollo Local

Para probar localmente:

```bash
npm start
# Usa http://localhost:8090/api/v1 automáticamente
```

## 📋 Checklist

- [ ] Variable `SPRING_PUBLIC_API_URL` agregada en Vercel (Production)
- [ ] Build command es: `npm run build:prod && npm run inject-env`
- [ ] Output directory es: `dist/traveldesk`
- [ ] Ejecuta redeploy en Vercel
- [ ] Abre DevTools y verifica `window.__ENV__.SPRING_PUBLIC_API_URL`

---

**Nota:** Si sigues obteniendo errores de CORS, revisa que:
1. La URL de Railway sea correcta
2. El backend en Railway tengo CORS configurado para permitir el dominio de Vercel
3. Que `SPRING_PROFILES_ACTIVE=prod` en Railway
