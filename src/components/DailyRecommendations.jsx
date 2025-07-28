import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Dice6, Play, Film, Headphones, Settings, User, Wifi, WifiOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { recommendationService, apiUtils } from '../services/apiService'

const DailyRecommendations = ({ user, character, currentExperience, onExperienceChange }) => {
  const navigate = useNavigate()
  const [emotionalState, setEmotionalState] = useState({
    nostalgico: 70,
    triste: 20,
    creativo: 60,
    curioso: 80
  })
  
  const [recommendations, setRecommendations] = useState({
    jugar: null,
    ver: null,
    escuchar: null
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [apiStatus, setApiStatus] = useState({ isOnline: true, usingFallback: false })
  const [apiConfig, setApiConfig] = useState(null)

  const generateRecommendations = async () => {
    setIsGenerating(true)
    setApiStatus({ isOnline: true, usingFallback: false })
    
    try {
      // Usar el servicio de recomendaciones con APIs reales
      const newRecommendations = await recommendationService.getRecommendationsByMood(emotionalState)
      
      setRecommendations(newRecommendations)
      setApiStatus({ isOnline: true, usingFallback: false })
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error)
      
      // Usar datos de respaldo si las APIs fallan
      const dominantMood = Object.entries(emotionalState)
        .sort(([,a], [,b]) => b - a)[0][0]
      
      const fallbackRecommendations = recommendationService.getFallbackRecommendations(dominantMood)
      setRecommendations(fallbackRecommendations)
      setApiStatus({ isOnline: false, usingFallback: true })
    } finally {
      setIsGenerating(false)
    }
  }

  const rerollRecommendation = async (type) => {
    try {
      const dominantMood = Object.entries(emotionalState)
        .sort(([,a], [,b]) => b - a)[0][0]
      
      let newRec
      
      // Obtener nueva recomendación según el tipo
      if (type === 'jugar') {
        const { gameService } = await import('../services/apiService')
        const games = await gameService.getGamesByMood(dominantMood)
        newRec = games[Math.floor(Math.random() * games.length)]
      } else if (type === 'ver') {
        const { movieService } = await import('../services/apiService')
        const movies = await movieService.getMoviesByMood(dominantMood)
        newRec = movies[Math.floor(Math.random() * movies.length)]
      } else if (type === 'escuchar') {
        const { musicService } = await import('../services/apiService')
        const albums = await musicService.getAlbumsByMood(dominantMood)
        newRec = albums[Math.floor(Math.random() * albums.length)]
      }
      
      if (newRec) {
        setRecommendations(prev => ({
          ...prev,
          [type]: newRec
        }))
      }
    } catch (error) {
      console.error('Error al cambiar recomendación:', error)
      // Mantener la recomendación actual si hay error
    }
  }

  const handleExperienceSelect = (type) => {
    onExperienceChange(type)
    // Cambiar clase del body para el fondo
    document.body.className = type
  }

  const handleDetailView = (type, item) => {
    navigate(`/detail/${type}/${item.id}`)
  }

  useEffect(() => {
    // Verificar configuración de APIs al cargar
    const checkAPIs = async () => {
      const config = apiUtils.checkAPIConfiguration()
      setApiConfig(config)
      
      if (!config.isConfigured) {
        console.warn('APIs no configuradas completamente:', config.missingKeys)
        setApiStatus({ isOnline: false, usingFallback: true })
      }
    }
    
    checkAPIs()
    generateRecommendations()
  }, [])
  
  useEffect(() => {
    // Regenerar recomendaciones cuando cambie el estado emocional significativamente
    const emotionalChangeThreshold = 20
    const hasSignificantChange = Object.values(emotionalState).some(value => 
      Math.abs(value - 50) > emotionalChangeThreshold
    )
    
    if (hasSignificantChange && recommendations.jugar) {
      // Debounce para evitar demasiadas llamadas
      const timeoutId = setTimeout(() => {
        generateRecommendations()
      }, 2000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [emotionalState])

  useEffect(() => {
    // Aplicar clase al app container
    const appElement = document.querySelector('.app')
    if (appElement) {
      appElement.className = `app ${currentExperience}`
    }
  }, [currentExperience])

  const getEmotionalSummary = () => {
    const dominant = Object.entries(emotionalState)
      .sort(([,a], [,b]) => b - a)[0][0]
    
    const summaries = {
      nostalgico: 'Tu semana fue muy nostálgica... ¿Quieres seguir así o cambiar de aires?',
      triste: 'Has estado un poco melancólico... Te recomendamos algo que te anime.',
      creativo: 'Tu lado creativo está en su mejor momento. ¡Aprovéchalo!',
      curioso: 'Tu curiosidad está al máximo. Perfecto para descubrir cosas nuevas.'
    }
    
    return summaries[dominant] || 'Tienes un estado emocional equilibrado.'
  }

  return (
    <motion.div 
      className="daily-recommendations"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        {/* Header con personaje */}
        <motion.div 
          className="header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="user-info">
            <div className="character-avatar">
              {character.type === 'quick' ? character.avatar : '👤'}
            </div>
            <div className="user-details">
              <h2>¡Hola, {user.name}!</h2>
              <p>Aquí tienes tus recomendaciones de hoy</p>
            </div>
          </div>
          <button className="settings-btn">
            <Settings size={20} />
          </button>
        </motion.div>

        {/* Resumen emocional */}
        <motion.div 
          className="emotional-summary card"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3>Resumen Emocional Semanal</h3>
          <div className="character-dialogue">
            <div className="character-face">
              {character.type === 'quick' ? character.avatar : '👤'}
            </div>
            <div className="dialogue-bubble">
              <p>{getEmotionalSummary()}</p>
            </div>
          </div>
          
          <div className="emotion-sliders">
            {Object.entries(emotionalState).map(([emotion, value]) => (
              <div key={emotion} className="emotion-slider">
                <label>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setEmotionalState(prev => ({
                      ...prev,
                      [emotion]: parseInt(e.target.value)
                    }))}
                    className="emotion-range"
                  />
                  <span className="slider-value">{value}%</span>
                </div>
                <div 
                  className="slider-fill"
                  style={{ width: `${value}%` }}
                />
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button 
              className="btn"
              onClick={generateRecommendations}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generando...' : 'Actualizar Recomendaciones'}
            </button>
            
            {/* Indicador de estado de APIs */}
            <div className="api-status">
              {apiStatus.isOnline ? (
                <div className="status-indicator online">
                  <Wifi size={16} />
                  <span>APIs conectadas</span>
                </div>
              ) : (
                <div className="status-indicator offline">
                  <WifiOff size={16} />
                  <span>Modo offline - Usando datos de ejemplo</span>
                </div>
              )}
              
              {apiConfig && !apiConfig.isConfigured && (
                <div className="api-warning">
                  <span>⚠️ Para contenido real, configura las API keys en el archivo .env</span>
                  <details>
                    <summary>APIs faltantes:</summary>
                    <ul>
                      {apiConfig.missingKeys.map(key => (
                        <li key={key}>{key}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Selector de experiencia */}
        <motion.div 
          className="experience-selector"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3>¿Qué quieres hacer hoy?</h3>
          <div className="experience-buttons">
            <button 
              className={`experience-btn ${currentExperience === 'jugar' ? 'active' : ''}`}
              onClick={() => handleExperienceSelect('jugar')}
            >
              <Play size={24} />
              <span>Jugar 🎮</span>
            </button>
            <button 
              className={`experience-btn ${currentExperience === 'ver' ? 'active' : ''}`}
              onClick={() => handleExperienceSelect('ver')}
            >
              <Film size={24} />
              <span>Ver 🎥</span>
            </button>
            <button 
              className={`experience-btn ${currentExperience === 'escuchar' ? 'active' : ''}`}
              onClick={() => handleExperienceSelect('escuchar')}
            >
              <Headphones size={24} />
              <span>Escuchar 🎧</span>
            </button>
          </div>
        </motion.div>

        {/* Recomendaciones */}
        <motion.div 
          className="recommendations-grid"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {Object.entries(recommendations).map(([type, item]) => {
            if (!item) return null
            
            return (
              <motion.div 
                key={type}
                className={`recommendation-card card ${currentExperience === type ? 'highlighted' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="card-header">
                  <h4>
                    {type === 'jugar' && '🎮 Jugar'}
                    {type === 'ver' && '🎥 Ver'}
                    {type === 'escuchar' && '🎧 Escuchar'}
                  </h4>
                  <button 
                    className="reroll-btn"
                    onClick={() => rerollRecommendation(type)}
                    title="Cambiar recomendación"
                  >
                    <Dice6 size={16} />
                  </button>
                </div>
                
                <div className="recommendation-content">
                  <div className="item-image">{item.image}</div>
                  <div className="item-details">
                    <h5>{item.title}</h5>
                    <p className="item-meta">
                      {type === 'jugar' && `${item.genre} • ${item.platform}`}
                      {type === 'ver' && `${item.year} • ${item.duration} • ${item.genre}`}
                      {type === 'escuchar' && `${item.artist} • ${item.year} • ${item.genre}`}
                    </p>
                  </div>
                </div>
                
                <button 
                  className="detail-btn btn"
                  onClick={() => handleDetailView(type, item)}
                >
                  Ver detalles
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <style>{`
        .daily-recommendations {
          min-height: 100vh;
          padding: 2rem 0;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .character-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .user-details h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .user-details p {
          margin: 0;
          opacity: 0.8;
        }

        .settings-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .settings-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .emotional-summary {
          margin-bottom: 2rem;
        }

        .character-dialogue {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .character-face {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .dialogue-bubble {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px 20px 20px 5px;
          padding: 1rem 1.5rem;
          position: relative;
        }

        .emotion-sliders {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .emotion-slider {
          position: relative;
        }

        .emotion-slider label {
          display: block;
          color: white;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: capitalize;
        }

        .slider-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .emotion-range {
          flex: 1;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          cursor: pointer;
        }

        .emotion-range::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .slider-value {
          color: white;
          font-weight: 600;
          min-width: 40px;
          text-align: right;
        }

        .experience-selector {
          text-align: center;
          margin-bottom: 2rem;
        }

        .experience-selector h3 {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .experience-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .experience-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 1.5rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .experience-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .experience-btn.active {
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
          border-color: #8b5cf6;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .recommendation-card {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .recommendation-card.highlighted {
          border-color: #8b5cf6;
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .card-header h4 {
          margin: 0;
          font-size: 1.2rem;
        }

        .reroll-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reroll-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(180deg);
        }

        .recommendation-content {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .item-image {
          font-size: 3rem;
          flex-shrink: 0;
        }

        .item-details h5 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          color: white;
        }

        .item-meta {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .detail-btn {
          width: 100%;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .api-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-indicator.online {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-indicator.offline {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .api-warning {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          font-size: 0.8rem;
          max-width: 400px;
        }

        .api-warning details {
          margin-top: 8px;
        }

        .api-warning summary {
          cursor: pointer;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .api-warning ul {
          list-style: none;
          padding: 0;
          margin: 8px 0 0 0;
        }

        .api-warning li {
          padding: 2px 0;
          font-size: 0.75rem;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .emotion-sliders {
            grid-template-columns: 1fr;
          }
          
          .experience-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .recommendations-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default DailyRecommendations