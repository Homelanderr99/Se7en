import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { LogIn, User, Instagram, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { authService, supabaseUtils } from '../services/supabaseService'
import { contentImageService } from '../services/contentImageService'

const Login = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [carouselOffset, setCarouselOffset] = useState(0)
  const [carouselCovers, setCarouselCovers] = useState([])
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [authError, setAuthError] = useState('')
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)

  // Verificar configuración de Supabase al cargar
  useEffect(() => {
    setIsSupabaseConfigured(supabaseUtils.isConfigured())
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setAuthError('')
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError('')

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase no está configurado. Usando modo invitado.')
      }

      let result
      if (showRegister) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Las contraseñas no coinciden')
        }
        result = await authService.signUp(formData.email, formData.password, {
          name: formData.name
        })
      } else {
        result = await authService.signIn(formData.email, formData.password)
      }

      if (result.success) {
        const userData = {
          id: result.data.user.id,
          name: result.data.user.user_metadata?.name || formData.name || result.data.user.email,
          email: result.data.user.email,
          provider: 'email',
          avatar: '👤'
        }
        onLogin(userData)
      } else {
        setAuthError(result.error)
      }
    } catch (error) {
      setAuthError(error.message)
      // Fallback a modo invitado si hay error
      if (error.message.includes('Supabase no está configurado')) {
        handleGuestLogin()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setIsLoading(true)
    setAuthError('')

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase no está configurado. Usando modo invitado.')
      }

      let result
      if (provider === 'google') {
        result = await authService.signInWithGoogle()
      }

      if (result && result.success) {
        // La redirección manejará el login
      } else {
        throw new Error('Error en autenticación social')
      }
    } catch (error) {
      setAuthError(error.message)
      // Fallback a modo invitado
      handleGuestLogin()
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      const userData = {
        id: 'guest-' + Date.now(),
        name: 'Invitado',
        provider: 'guest',
        avatar: '👤'
      }
      
      onLogin(userData)
      setIsLoading(false)
    }, 1000)
  }

  const handleLogin = async (provider) => {
    if (provider === 'guest') {
      handleGuestLogin()
    } else {
      await handleSocialLogin(provider)
    }
  }

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselOffset(prev => prev - 1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Cargar portadas reales del contenido
  const loadCarouselCovers = async () => {
    try {
      const covers = await contentImageService.getMixedCovers(10, 10, 10)
      // Duplicar para efecto infinito
      const duplicatedCovers = [...covers, ...covers]
      setCarouselCovers(duplicatedCovers)
    } catch (error) {
      console.error('Error al cargar portadas:', error)
      // Fallback a datos estáticos si falla
      const fallbackCovers = [
        { id: 1, title: 'Cyberpunk 2077', type: 'game', color: '#ff0080', icon: '🎮' },
        { id: 2, title: 'Dune', type: 'movie', color: '#ff6b35', icon: '🎬' },
        { id: 3, title: 'The Weeknd', type: 'music', color: '#7209b7', icon: '🎵' },
        { id: 4, title: 'Elden Ring', type: 'game', color: '#f72585', icon: '🎮' },
        { id: 5, title: 'Spider-Man', type: 'movie', color: '#4361ee', icon: '🎬' },
        { id: 6, title: 'Bad Bunny', type: 'music', color: '#f77f00', icon: '🎵' }
      ]
      setCarouselCovers([...fallbackCovers, ...fallbackCovers])
    }
  }

  // Cargar portadas al montar el componente
  useEffect(() => {
    loadCarouselCovers()
  }, [])

  const floatingCovers = [
    { id: 1, type: 'game', title: 'Silent Hill 2', image: '🎮', color: '#8b5cf6' },
    { id: 2, type: 'movie', title: 'Your Name', image: '🎬', color: '#06b6d4' },
    { id: 3, type: 'music', title: 'American Idiot', image: '🎵', color: '#10b981' },
    { id: 4, type: 'game', title: 'GRIS', image: '🎨', color: '#f59e0b' },
    { id: 5, type: 'movie', title: 'Spirited Away', image: '🌟', color: '#ec4899' },
    { id: 6, type: 'music', title: 'Bon Iver', image: '🎼', color: '#8b5cf6' }
  ]

  return (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Carrusel de portadas superior */}
      <div className="carousel-container">
        <motion.div 
          className="carousel-track"
          style={{ transform: `translateX(${carouselOffset}px)` }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {carouselCovers.map((cover, index) => (
            <motion.div
               key={`${cover.id}-${index}`}
               className="carousel-item"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: index * 0.1, duration: 0.5 }}
               whileHover={{ scale: 1.05 }}
             >
               {cover.image ? (
                 <div className="cover-image-container">
                   <img 
                     src={cover.image} 
                     alt={cover.title}
                     className="cover-image"
                     onError={(e) => {
                       e.target.style.display = 'none'
                       e.target.nextSibling.style.display = 'flex'
                     }}
                   />
                   <div 
                     className="cover-fallback"
                     style={{
                       background: `linear-gradient(135deg, ${cover.color || '#667eea'}, ${cover.color || '#667eea'}88)`,
                       display: 'none'
                     }}
                   >
                     <div className="cover-icon">
                       {cover.type === 'game' ? '🎮' : cover.type === 'movie' ? '🎬' : cover.type === 'series' ? '📺' : '🎵'}
                     </div>
                     <div className="cover-title">{cover.title}</div>
                   </div>
                   <div className="cover-overlay">
                     <span className="cover-type">
                       {cover.type === 'game' ? 'Juego' : cover.type === 'movie' ? 'Película' : cover.type === 'series' ? 'Serie' : 'Música'}
                     </span>
                   </div>
                 </div>
               ) : (
                 <div 
                   className="cover-content"
                   style={{
                     background: `linear-gradient(135deg, ${cover.color || '#667eea'}, ${cover.color || '#667eea'}88)`
                   }}
                 >
                   <div className="cover-icon">
                     {cover.type === 'game' ? '🎮' : cover.type === 'movie' ? '🎬' : '🎵'}
                   </div>
                   <div className="cover-title">{cover.title}</div>
                 </div>
               )}
               <div className="cover-overlay">
                 <span className="cover-type">{cover.type}</span>
               </div>
             </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Portadas flotantes animadas */}
      <div className="floating-covers">
        {floatingCovers.map((cover, index) => (
          <motion.div
            key={cover.id}
            className="floating-cover"
            initial={{ 
              opacity: 0, 
              y: 100,
              x: Math.random() * window.innerWidth,
              rotate: Math.random() * 360
            }}
            animate={{ 
              opacity: [0, 0.7, 0.5],
              y: [100, -20, -50],
              x: [null, null, Math.random() * window.innerWidth],
              rotate: [null, null, Math.random() * 360]
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: index * 0.5
            }}
            style={{ 
              backgroundColor: cover.color,
              left: `${10 + (index * 15)}%`,
              top: `${20 + (index % 3) * 20}%`
            }}
          >
            <span className="cover-emoji">{cover.image}</span>
            <div className="cover-title">{cover.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Contenido principal del login */}
      <div className="container">
        <motion.div 
          className="login-card card"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
        >
          <motion.div 
            className="login-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h1 className="login-title">Recomendame</h1>
            <p className="login-subtitle">
              Descubre tu próxima experiencia perfecta
            </p>
          </motion.div>

          {/* Mostrar error de autenticación */}
          {authError && (
            <motion.div 
              className="auth-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {authError}
            </motion.div>
          )}

          {/* Formulario de email/contraseña */}
          {showEmailLogin && (
            <motion.form 
              className="email-form"
              onSubmit={handleEmailAuth}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {showRegister && (
                <div className="form-group">
                  <User size={20} className="form-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre completo"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <Mail size={20} className="form-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <Lock size={20} className="form-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {showRegister && (
                <div className="form-group">
                  <Lock size={20} className="form-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              
              <motion.button 
                type="submit"
                className="login-btn email-submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <LogIn size={20} />
                {showRegister ? 'Crear cuenta' : 'Iniciar sesión'}
              </motion.button>
              
              <button
                type="button"
                className="toggle-form"
                onClick={() => setShowRegister(!showRegister)}
              >
                {showRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
              </button>
            </motion.form>
          )}

          <motion.div 
            className="login-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {!showEmailLogin && (
              <>
                <motion.button 
                  className="login-btn email"
                  onClick={() => setShowEmailLogin(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail size={20} />
                  Continuar con Email
                </motion.button>

                <div className="divider">
                  <span>o</span>
                </div>
              </>
            )}

            {isSupabaseConfigured && (
              <motion.button 
                className="login-btn google"
                onClick={() => handleLogin('google')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </motion.button>
            )}

            {showEmailLogin && (
              <button
                className="back-btn"
                onClick={() => {
                  setShowEmailLogin(false)
                  setShowRegister(false)
                  setAuthError('')
                }}
              >
                ← Volver
              </button>
            )}

            <div className="divider">
              <span>o</span>
            </div>

            <motion.button 
              className="login-btn guest"
              onClick={() => handleLogin('guest')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <User size={20} />
              Continuar como invitado
            </motion.button>

            {!isSupabaseConfigured && (
              <div className="config-notice">
                <small>💡 Configura Supabase para autenticación completa</small>
              </div>
            )}
          </motion.div>

          {isLoading && (
            <motion.div 
              className="loading-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="loading-spinner"></div>
              <p>Iniciando sesión...</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }

        .carousel-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 25vh;
          overflow: hidden;
          z-index: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%);
        }

        .carousel-track {
          display: flex;
          gap: clamp(15px, 2vw, 20px);
          padding: clamp(15px, 2vw, 20px);
          width: max-content;
          animation: scroll 60s linear infinite;
        }

        .carousel-item {
          position: relative;
          width: clamp(100px, 12vw, 120px);
          height: clamp(130px, 16vw, 160px);
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          transition: transform 0.3s ease;
        }

        .carousel-item:hover {
          transform: scale(1.05) translateY(-5px);
        }

        .cover-image-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
        }

        .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
          transition: transform 0.3s ease;
        }

        .cover-image:hover {
          transform: scale(1.1);
        }

        .cover-fallback {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 10px;
          border-radius: 12px;
          color: white;
          text-align: center;
        }

        .cover-content {
           width: 100%;
           height: 100%;
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
           padding: 12px;
           text-align: center;
         }

         .cover-icon {
           font-size: 2.5rem;
           margin-bottom: 8px;
           filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
         }

         .cover-title {
           color: white;
           font-size: 0.75rem;
           font-weight: 700;
           text-shadow: 0 1px 3px rgba(0,0,0,0.5);
           line-height: 1.2;
           overflow: hidden;
           display: -webkit-box;
           -webkit-line-clamp: 2;
           -webkit-box-orient: vertical;
         }

        .cover-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          padding: 8px;
          border-radius: 0 0 12px 12px;
        }

        .cover-type {
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .floating-covers {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .floating-cover {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .cover-emoji {
          font-size: 2rem;
          margin-bottom: 4px;
        }

        .cover-title {
          font-size: 0.6rem;
          color: white;
          text-align: center;
          font-weight: 600;
        }

        .login-card {
          max-width: min(400px, 90vw);
          width: 100%;
          text-align: center;
          position: relative;
          z-index: 1;
          margin: 0 auto;
        }

        .login-header {
          margin-bottom: 2rem;
        }

        .login-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(45deg, #8b5cf6, #06b6d4, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          font-size: 1.1rem;
          opacity: 0.8;
        }

        .login-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 0.9rem;
          text-align: center;
        }

        .email-form {
          width: 100%;
          margin-bottom: 20px;
        }

        .form-group {
          position: relative;
          margin-bottom: 16px;
        }

        .form-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.6);
          z-index: 1;
        }

        .form-group input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-group input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.15);
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: white;
        }

        .toggle-form {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          cursor: pointer;
          margin-top: 12px;
          text-decoration: underline;
          transition: color 0.3s ease;
        }

        .toggle-form:hover {
          color: white;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .config-notice {
          text-align: center;
          margin-top: 16px;
          padding: 12px;
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
          color: #ffc107;
        }

        .login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-btn.email {
          background: rgba(59, 130, 246, 0.8);
          color: white;
          backdrop-filter: blur(10px);
        }

        .login-btn.email:hover {
          background: rgba(59, 130, 246, 0.9);
          transform: translateY(-2px);
        }

        .login-btn.email-submit {
          background: rgba(34, 197, 94, 0.8);
          color: white;
          backdrop-filter: blur(10px);
        }

        .login-btn.email-submit:hover {
          background: rgba(34, 197, 94, 0.9);
          transform: translateY(-2px);
        }

        .login-btn.google {
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          backdrop-filter: blur(10px);
        }

        .login-btn.google:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .login-btn.guest {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .login-btn.guest:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 1rem 0;
          color: rgba(255, 255, 255, 0.5);
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
        }

        .divider span {
          padding: 0 1rem;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          color: white;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .login-card {
            margin: 1rem;
          }
          
          .login-title {
            font-size: 2.5rem;
          }
          
          .floating-cover {
            width: 60px;
            height: 60px;
          }
          
          .cover-emoji {
            font-size: 1.5rem;
          }

          .carousel-container {
            height: 20vh;
          }

          .carousel-item {
            width: clamp(80px, 15vw, 90px);
            height: clamp(100px, 20vw, 120px);
          }

          .carousel-track {
            gap: clamp(10px, 3vw, 15px);
            padding: clamp(10px, 3vw, 15px);
          }

          .cover-icon {
            font-size: 2rem;
          }

          .cover-title {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default Login