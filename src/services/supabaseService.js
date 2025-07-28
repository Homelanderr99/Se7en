import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)

// Servicio de autenticación
export const authService = {
  // Registro con email y contraseña
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error en registro:', error)
      return { success: false, error: error.message }
    }
  },

  // Inicio de sesión con email y contraseña
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, error: error.message }
    }
  },

  // Inicio de sesión con Google
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error en login con Google:', error)
      return { success: false, error: error.message }
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { success: true, user }
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      return { success: false, error: error.message }
    }
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Servicio de datos del usuario
export const userDataService = {
  // Guardar perfil del usuario
  async saveUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al guardar perfil:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener perfil del usuario
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener perfil:', error)
      return { success: false, error: error.message }
    }
  },

  // Guardar preferencias del usuario
  async saveUserPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preferences: preferences,
          updated_at: new Date().toISOString()
        })
        .select()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al guardar preferencias:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener preferencias del usuario
  async getUserPreferences(userId) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return { success: true, data: data?.preferences || {} }
    } catch (error) {
      console.error('Error al obtener preferencias:', error)
      return { success: false, error: error.message }
    }
  },

  // Guardar historial de recomendaciones
  async saveRecommendationHistory(userId, recommendation) {
    try {
      const { data, error } = await supabase
        .from('recommendation_history')
        .insert({
          user_id: userId,
          recommendation_data: recommendation,
          created_at: new Date().toISOString()
        })
        .select()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al guardar historial:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener historial de recomendaciones
  async getRecommendationHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('recommendation_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener historial:', error)
      return { success: false, error: error.message }
    }
  },

  // Guardar favoritos del usuario
  async saveFavorite(userId, itemData) {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          item_id: itemData.id,
          item_type: itemData.type,
          item_data: itemData,
          created_at: new Date().toISOString()
        })
        .select()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al guardar favorito:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener favoritos del usuario
  async getUserFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener favoritos:', error)
      return { success: false, error: error.message }
    }
  },

  // Eliminar favorito
  async removeFavorite(userId, itemId) {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('item_id', itemId)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar favorito:', error)
      return { success: false, error: error.message }
    }
  }
}

// Utilidades
export const supabaseUtils = {
  // Verificar si Supabase está configurado
  isConfigured() {
    return !!(supabaseUrl && supabaseKey)
  },

  // Obtener configuración actual
  getConfig() {
    return {
      url: supabaseUrl,
      hasKey: !!supabaseKey,
      isConfigured: this.isConfigured()
    }
  }
}

export default supabase