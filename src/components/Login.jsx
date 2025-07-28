import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Play, Film, Music, User, Mail } from 'lucide-react'

const Login = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [carouselOffset, setCarouselOffset] = useState(0)

  const handleLogin = async (provider) => {
    setIsLoading(true)
    // Simular login (en producción aquí iría la integración real)
    setTimeout(() => {
      onLogin({
        id: '1',
        name: 'Usuario',
        email: 'usuario@ejemplo.com',
        provider
      })
      setIsLoading(false)
    }, 1500)
  }

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselOffset(prev => prev - 1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const carouselCovers = [
    { id: 1, title: 'The Legend of Zelda', color: '#DAA520', type: 'game' },
    { id: 2, title: 'Your Name', color: '#87CEEB', type: 'movie' },
    { id: 3, title: 'Silent Hill 2', color: '#2F4F2F', type: 'game' },
    { id: 4, title: 'Daft Punk', color: '#FFD700', type: 'music' },
    { id: 5, title: 'Spirited Away', color: '#98FB98', type: 'movie' },
    { id: 6, title: 'GRIS', color: '#DDA0DD', type: 'game' },
    { id: 7, title: 'Bon Iver', color: '#F0E68C', type: 'music' },
    { id: 8, title: 'Green Day', color: '#32CD32', type: 'music' },
    { id: 9, title: 'Interstellar', color: '#191970', type: 'movie' },
    { id: 10, title: 'Cyberpunk 2077', color: '#FFFF00', type: 'game' },
    { id: 11, title: 'The Beatles', color: '#FF6347', type: 'music' },
    { id: 12, title: 'Avatar', color: '#00CED1', type: 'movie' },
    // Duplicamos para efecto infinito
    { id: 13, title: 'The Legend of Zelda', color: '#DAA520', type: 'game' },
    { id: 14, title: 'Your Name', color: '#87CEEB', type: 'movie' },
    { id: 15, title: 'Silent Hill 2', color: '#2F4F2F', type: 'game' },
    { id: 16, title: 'Daft Punk', color: '#FFD700', type: 'music' }
  ]

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
               style={{ background: `linear-gradient(135deg, ${cover.color}, ${cover.color}88)` }}
             >
               <div className="cover-content">
                 <div className="cover-icon">
                   {cover.type === 'game' ? '🎮' : cover.type === 'movie' ? '🎬' : '🎵'}
                 </div>
                 <div className="cover-title">{cover.title}</div>
               </div>
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

          <motion.div 
            className="login-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <button 
              className="login-btn google-btn"
              onClick={() => handleLogin('google')}
              disabled={isLoading}
            >
              <div className="btn-icon">🔍</div>
              <span>Continuar con Google</span>
            </button>

            <button 
              className="login-btn apple-btn"
              onClick={() => handleLogin('apple')}
              disabled={isLoading}
            >
              <div className="btn-icon">🍎</div>
              <span>Continuar con Apple</span>
            </button>

            <button 
              className="login-btn instagram-btn"
              onClick={() => handleLogin('instagram')}
              disabled={isLoading}
            >
              <div className="btn-icon">📷</div>
              <span>Continuar con Instagram</span>
            </button>

            <div className="divider">
              <span>o</span>
            </div>

            <button 
              className="login-btn guest-btn"
              onClick={() => handleLogin('guest')}
              disabled={isLoading}
            >
              <User size={20} />
              <span>Continuar como invitado</span>
            </button>
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

        .google-btn {
          background: linear-gradient(45deg, #4285f4, #34a853);
          color: white;
        }

        .apple-btn {
          background: linear-gradient(45deg, #000, #333);
          color: white;
        }

        .instagram-btn {
          background: linear-gradient(45deg, #e4405f, #f77737);
          color: white;
        }

        .guest-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
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