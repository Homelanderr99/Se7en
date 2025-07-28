# 🔐 Configuración de Supabase para Autenticación

## 📋 Requisitos Previos
- Cuenta en [Supabase](https://supabase.com)
- Proyecto creado en Supabase

## 🚀 Configuración Paso a Paso

### 1. Crear Proyecto en Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Haz clic en "New Project"
3. Completa los datos:
   - **Name**: `recomendame-app`
   - **Database Password**: (genera una contraseña segura)
   - **Region**: Selecciona la más cercana a tu ubicación
4. Haz clic en "Create new project"

### 2. Obtener Credenciales

1. En tu proyecto, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` y añade tus credenciales:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Configurar Autenticación

#### 4.1 Configurar Proveedores de Autenticación

1. Ve a **Authentication** → **Providers**
2. Configura los proveedores que desees:

**Google OAuth:**
1. Habilita "Google"
2. Ve a [Google Cloud Console](https://console.cloud.google.com)
3. Crea un proyecto o selecciona uno existente
4. Habilita la API de Google+
5. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente OAuth 2.0"
6. Configura:
   - **Tipo de aplicación**: Aplicación web
   - **URIs de redirección autorizados**: `https://tu-proyecto.supabase.co/auth/v1/callback`
7. Copia el **Client ID** y **Client Secret** a Supabase

#### 4.2 Configurar URLs de Redirección

1. Ve a **Authentication** → **URL Configuration**
2. Añade las siguientes URLs:
   - **Site URL**: `http://localhost:5173` (desarrollo)
   - **Redirect URLs**: 
     - `http://localhost:5173`
     - `https://tu-dominio.com` (producción)

### 5. Crear Tablas de Base de Datos

Ejecuta el siguiente SQL en **SQL Editor**:

```sql
-- Tabla de perfiles de usuario
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  character_type TEXT,
  character_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de preferencias de usuario
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabla de historial de recomendaciones
CREATE TABLE recommendation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de favoritos del usuario
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'movie', 'game', 'music'
  item_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own history" ON recommendation_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);
```

### 6. Configurar Triggers (Opcional)

```sql
-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## 🧪 Verificar Configuración

1. Reinicia el servidor de desarrollo:
```bash
npm run dev
```

2. Ve a la página de login
3. Deberías ver:
   - ✅ Formulario de email/contraseña
   - ✅ Botón "Continuar con Google" (si configuraste OAuth)
   - ✅ Sin mensaje de "Configura Supabase"

## 🔧 Solución de Problemas

### Error: "Invalid API key"
- Verifica que `VITE_SUPABASE_ANON_KEY` sea correcta
- Asegúrate de que no haya espacios extra

### Error: "Invalid URL"
- Verifica que `VITE_SUPABASE_URL` tenga el formato correcto
- Debe incluir `https://` al inicio

### Error de CORS
- Verifica las URLs de redirección en Supabase
- Asegúrate de incluir `http://localhost:5173`

### Google OAuth no funciona
- Verifica las credenciales de Google Cloud
- Asegúrate de que la URL de redirección sea correcta
- Verifica que la API de Google+ esté habilitada

## 📚 Recursos Adicionales

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Configuración de OAuth](https://supabase.com/docs/guides/auth/social-login)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🎯 Funcionalidades Habilitadas

Con Supabase configurado, tendrás:

- ✅ **Registro de usuarios** con email/contraseña
- ✅ **Inicio de sesión** con email/contraseña
- ✅ **Autenticación social** con Google
- ✅ **Persistencia de datos** del usuario
- ✅ **Historial de recomendaciones**
- ✅ **Sistema de favoritos**
- ✅ **Preferencias personalizadas**
- ✅ **Seguridad avanzada** con RLS

¡Tu aplicación Recomendame ahora tiene un sistema de autenticación completo! 🚀