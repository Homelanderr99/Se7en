# Recomendame 🚀

Una aplicación de recomendaciones multimedia inteligente que sugiere juegos, películas y música basándose en tu estado emocional.

## ✨ Funcionalidades

### 🎯 **Recomendaciones Inteligentes**
- 🎭 **Selección de Personaje**: Elige tu avatar personalizado
- 🧠 **Análisis Emocional**: Recomendaciones basadas en tu estado de ánimo
- 🎮 **Videojuegos**: Descubre nuevos juegos según tu mood
- 🎬 **Películas y Series**: Encuentra tu próximo contenido favorito
- 🎵 **Música**: Explora nuevos artistas y álbumes
- 🔄 **Re-roll**: Cambia cualquier recomendación al instante

### 🔐 **Sistema de Autenticación**
- 📧 **Email/Contraseña**: Registro e inicio de sesión tradicional
- 🔍 **Google OAuth**: Autenticación social con Google
- 👤 **Modo Invitado**: Acceso sin registro
- 💾 **Persistencia**: Guarda tus preferencias y historial

### 🎪 **Carrusel de Portadas**
- 🖼️ **Imágenes Reales**: Portadas de películas, juegos y música
- 🔄 **Auto-scroll**: Animación continua e infinita
- 📱 **Responsive**: Adaptado a todos los tamaños de pantalla

### 💾 **Gestión de Datos**
- 📊 **Historial**: Registro de todas tus recomendaciones
- ⭐ **Favoritos**: Guarda tu contenido preferido
- 🎛️ **Preferencias**: Personaliza tu experiencia
- 🔄 **Sincronización**: Datos guardados en la nube

### 🎨 **Experiencia de Usuario**
- 📱 **Responsive**: Diseño adaptado a todos los dispositivos
- 🎨 **Interfaz Moderna**: Efectos glassmorphism y animaciones fluidas
- 🌟 **Animaciones**: Transiciones suaves con Framer Motion
- 🎯 **UX Optimizada**: Navegación intuitiva y accesible

## 🎯 Características Principales (Fase 1 - MVP)

### ✅ Funcionalidades Implementadas

#### 1. **Login Dinámico**
- Animaciones de portadas flotantes (juegos, películas, música)
- Opciones de login social: Google, Apple, Instagram
- Opción de continuar como invitado
- Fondo neon difuminado con efectos visuales

#### 2. **Selección de Personaje**
- **Selección Rápida**: Personajes inspirados en series/juegos populares
  - 2B (NieR: Automata)
  - Chihiro (El Viaje de Chihiro)
  - Link (The Legend of Zelda)
  - Gris (GRIS)
  - Eleven (Stranger Things)
  - Joker (Persona 5)
- **Creación Manual**: Personalización completa
  - Color de piel
  - Color y estilo de cabello
  - Outfit
  - Accesorios
  - Botón de aleatorización

#### 3. **Recomendaciones Diarias**
- Sistema de sliders emocionales (Nostálgico, Triste, Creativo, Curioso)
- Recomendaciones inteligentes basadas en estado emocional
- Tres categorías: Jugar 🎮, Ver 🎥, Escuchar 🎧
- Ícono de dado 🎲 para cambiar recomendaciones individuales
- Personaje que interactúa y comenta tu estado emocional

#### 4. **Elección de Experiencia**
- Botones interactivos: Jugar 🎮 | Ver 🎥 | Escuchar 🎧
- Cambio dinámico del fondo según la experiencia seleccionada
- Efectos visuales adaptativos por categoría

#### 5. **Detalle por Experiencia**
- **Juegos**: Género, plataformas, desarrollador, tamaño, características
- **Películas**: Sinopsis, duración, director, reparto, plataformas de streaming
- **Música**: Álbum, artista, canciones destacadas, plataformas de streaming
- Sistema de calificación con estrellas
- Botón "Marcar como completado" para gamificación
- Galería de capturas/escenas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Estilos**: CSS personalizado con efectos glassmorphism
- **Estado**: React Hooks (useState, useEffect)
- **APIs**: TMDB (películas), RAWG (juegos), Last.fm (música)
- **Variables de Entorno**: Vite env para configuración segura

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Configurar APIs (opcional pero recomendado)
cp .env.example .env
# Edita .env con tus API keys reales

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### 🔑 Configuración de APIs y Autenticación (Recomendado)

Para obtener contenido real y habilitar autenticación:

1. **Copia el archivo de configuración:**
   ```bash
   cp .env.example .env
   ```

2. **Obtén tus API keys gratuitas:**
   - [TMDB](https://www.themoviedb.org/settings/api) - Para películas y series
   - [RAWG](https://rawg.io/apidocs) - Para videojuegos
   - [Last.fm](https://www.last.fm/api/account/create) - Para música
   - [Supabase](https://supabase.com) - Para autenticación y base de datos

3. **Completa el archivo `.env`:**
   ```env
   # APIs de Contenido
   VITE_TMDB_API_KEY=tu_api_key_tmdb
   VITE_RAWG_API_KEY=tu_api_key_rawg
   VITE_LASTFM_API_KEY=tu_api_key_lastfm
   
   # Supabase (Autenticación y Base de Datos)
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```

📖 **Guías detalladas:**
- APIs de Contenido: [API_SETUP.md](./API_SETUP.md)
- Supabase (Autenticación): [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Nota:** La aplicación funciona perfectamente sin APIs configuradas, usando datos de ejemplo de alta calidad.

## 🎨 Diseño y UX

### Paleta de Colores
- **Base**: Gradientes oscuros con tonos púrpura y azul
- **Jugar**: Tonos púrpura y violeta
- **Ver**: Tonos naranjas y marrones cálidos
- **Escuchar**: Tonos verdes y esmeralda

### Efectos Visuales
- Fondos neon difuminados
- Efectos glassmorphism en tarjetas
- Animaciones suaves con Framer Motion
- Transiciones contextuales por experiencia
- Partículas flotantes y elementos interactivos

## 📱 Responsive Design

- Diseño completamente responsive
- Optimizado para móviles y tablets
- Navegación táctil intuitiva
- Adaptación de layouts según el dispositivo

## 🗺️ Roadmap Futuro

### 🏆 Fase 2: Gamificación y Trofeos
- Sistema de trofeos y logros
- Preguntas interactivas post-experiencia
- Ítems desbloqueables para avatares
- Sistema de puntos y niveles

### 🌈 Fase 3: Personalización e Inmersión
- Expresiones dinámicas del avatar
- Música ambiental adaptativa
- Personalización avanzada de fondos
- Temas visuales (cyberpunk, anime, nostálgico)

### 🧠 Fase 4: Asistente con IA
- Personaje conversacional con IA
- Recomendaciones más inteligentes
- Análisis de patrones de uso
- Integración con APIs externas (TMDB, Spotify, RAWG)

## 🎮 Base de Datos de Contenido

### Juegos Incluidos
- Silent Hill 2 (Horror Psicológico)
- GRIS (Aventura Artística)
- The Stanley Parable (Narrativo)
- Journey (Aventura)

### Películas Incluidas
- Your Name (Animación, Romance)
- Spirited Away (Animación, Fantasía)
- Her (Drama, Ciencia Ficción)
- The Grand Budapest Hotel (Comedia, Drama)

### Música Incluida
- American Idiot - Green Day
- For Emma, Forever Ago - Bon Iver
- In Rainbows - Radiohead
- Blonde - Frank Ocean

## 🤝 Contribuir

Este proyecto está en desarrollo activo. Las contribuciones son bienvenidas para:

- Agregar más contenido a las bases de datos
- Mejorar algoritmos de recomendación
- Implementar nuevas características de gamificación
- Optimizar rendimiento y accesibilidad

## 📄 Licencia

MIT License - Siéntete libre de usar este código para tus propios proyectos.

---

**¡Disfruta descubriendo tu próxima experiencia perfecta!** ✨

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
