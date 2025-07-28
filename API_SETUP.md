# Configuración de APIs para Recomendame 🚀

Esta guía te ayudará a configurar las APIs necesarias para obtener contenido real de películas, juegos y música.

## 📋 APIs Requeridas

### 1. TMDB (The Movie Database) - Para Películas y Series

**¿Qué es?** La base de datos de películas más completa y popular.

**Cómo obtener la API Key:**
1. Ve a [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Crea una cuenta gratuita
3. Ve a tu perfil → Configuración → API
4. Solicita una API Key (es gratuita)
5. Copia tu API Key

**Funcionalidades que obtienes:**
- Información detallada de películas y series
- Imágenes de alta calidad (posters, fondos)
- Reparto y equipo técnico
- Trailers y videos
- Plataformas de streaming disponibles
- Calificaciones y reseñas

### 2. RAWG - Para Videojuegos

**¿Qué es?** La base de datos de videojuegos más grande del mundo.

**Cómo obtener la API Key:**
1. Ve a [https://rawg.io/apidocs](https://rawg.io/apidocs)
2. Crea una cuenta gratuita
3. Ve a tu dashboard y genera una API Key
4. Copia tu API Key

**Funcionalidades que obtienes:**
- Información completa de juegos
- Capturas de pantalla
- Calificaciones de Metacritic
- Plataformas disponibles
- Desarrolladores y publishers
- Tags y géneros
- Enlaces a tiendas

### 3. Last.fm - Para Música

**¿Qué es?** Servicio de seguimiento musical con una API robusta.

**Cómo obtener la API Key:**
1. Ve a [https://www.last.fm/api/account/create](https://www.last.fm/api/account/create)
2. Crea una cuenta si no tienes una
3. Llena el formulario de aplicación
4. Copia tu API Key

**Funcionalidades que obtienes:**
- Información de álbumes y artistas
- Top tracks y álbumes por género
- Biografías de artistas
- Tags y géneros musicales
- Estadísticas de reproducción
- Imágenes de álbumes

### 4. Spotify Web API (Opcional)

**¿Qué es?** API oficial de Spotify para acceder a su catálogo.

**Cómo obtener las credenciales:**
1. Ve a [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Crea una nueva aplicación
4. Copia tu Client ID y Client Secret

**Funcionalidades adicionales:**
- Previews de canciones
- Playlists curadas
- Información más detallada de tracks
- Integración con reproductor

## ⚙️ Configuración

### Paso 1: Crear archivo de configuración

1. Copia el archivo `.env.example` como `.env`:
```bash
cp .env.example .env
```

2. Abre el archivo `.env` y completa tus API keys:

```env
# TMDB API Key
VITE_TMDB_API_KEY=tu_api_key_real_de_tmdb

# RAWG API Key
VITE_RAWG_API_KEY=tu_api_key_real_de_rawg

# Last.fm API Key
VITE_LASTFM_API_KEY=tu_api_key_real_de_lastfm

# Spotify (Opcional)
VITE_SPOTIFY_CLIENT_ID=tu_client_id_de_spotify
VITE_SPOTIFY_CLIENT_SECRET=tu_client_secret_de_spotify
```

### Paso 2: Reiniciar el servidor

Después de configurar las API keys, reinicia el servidor de desarrollo:

```bash
npm run dev
```

## 🔧 Verificación

La aplicación verificará automáticamente si las APIs están configuradas:

- ✅ **Verde**: APIs configuradas y funcionando
- ⚠️ **Amarillo**: Algunas APIs no configuradas (usando datos de ejemplo)
- ❌ **Rojo**: Error de conexión (modo offline)

## 📊 Límites de las APIs

### TMDB
- **Gratuita**: 1,000 requests por día
- **Sin límite de rate**: Pero se recomienda no más de 4 requests por segundo

### RAWG
- **Gratuita**: 20,000 requests por mes
- **Rate limit**: 5 requests por segundo

### Last.fm
- **Gratuita**: Sin límite específico documentado
- **Rate limit**: Razonable para uso personal

### Spotify
- **Gratuita**: Límites generosos para desarrollo
- **Rate limit**: Varía según el endpoint

## 🛡️ Seguridad

### Variables de Entorno
- Las API keys se almacenan en variables de entorno
- El archivo `.env` está en `.gitignore` (no se sube al repositorio)
- Nunca compartas tus API keys públicamente

### Buenas Prácticas
- Regenera las API keys si sospechas que fueron comprometidas
- Usa diferentes keys para desarrollo y producción
- Monitorea el uso de tus APIs regularmente

## 🔄 Modo Fallback

Si las APIs no están configuradas o fallan:

1. La aplicación usará datos de ejemplo predefinidos
2. Se mostrará un indicador visual del estado
3. Todas las funcionalidades seguirán funcionando
4. Los datos serán limitados pero representativos

## 🚀 Funcionalidades con APIs Reales

Con las APIs configuradas obtienes:

### Recomendaciones Dinámicas
- Contenido actualizado en tiempo real
- Algoritmos basados en popularidad y ratings
- Variedad infinita de opciones

### Información Detallada
- Sinopsis completas y actualizadas
- Imágenes de alta calidad
- Datos técnicos precisos
- Enlaces a plataformas de streaming/compra

### Experiencia Personalizada
- Recomendaciones basadas en géneros reales
- Contenido filtrado por mood/estado emocional
- Descubrimiento de contenido nuevo

## 🆘 Solución de Problemas

### Error: "API Key inválida"
- Verifica que copiaste la key correctamente
- Asegúrate de que la key esté activa
- Revisa que no haya espacios extra

### Error: "Rate limit exceeded"
- Espera unos minutos antes de hacer más requests
- Considera implementar caché local
- Verifica los límites de tu plan

### Error: "CORS"
- Las APIs están configuradas para funcionar desde localhost
- En producción, configura los dominios permitidos

### Datos no aparecen
- Verifica la consola del navegador para errores
- Confirma que el archivo `.env` está en la raíz del proyecto
- Reinicia el servidor después de cambiar las variables

## 📞 Soporte

Si tienes problemas:

1. Revisa la consola del navegador para errores específicos
2. Verifica que todas las API keys estén configuradas correctamente
3. Consulta la documentación oficial de cada API
4. El modo fallback siempre funcionará como respaldo

---

**¡Con las APIs configuradas tendrás acceso a miles de películas, juegos y álbumes reales!** 🎉