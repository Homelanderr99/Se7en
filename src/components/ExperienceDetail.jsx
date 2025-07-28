import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Download, Star, Clock, Calendar, Users, Trophy } from 'lucide-react'
import { movieService, gameService, musicService } from '../services/apiService'

const ExperienceDetail = ({ currentExperience, character }) => {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [hasCompleted, setHasCompleted] = useState(false)

  // Bases de datos expandidas con más detalles
  const detailedData = {
    jugar: {
      1: {
        id: 1,
        title: 'Silent Hill 2',
        genre: 'Horror Psicológico',
        platform: ['PC', 'PS5', 'Xbox Series X/S'],
        developer: 'Bloober Team',
        publisher: 'Konami',
        releaseDate: '2024',
        size: '50 GB',
        rating: 'M (Mature)',
        image: '🎮',
        description: 'James Sunderland llega a la siniestra ciudad de Silent Hill tras recibir una carta de su difunta esposa. Ahora perdido en la niebla, debe confrontar su propio tormento psicológico en un lugar lleno de horrores.',
        features: ['Historia inmersiva', 'Gráficos renovados', 'Audio 3D', 'Múltiples finales'],
        screenshots: ['🌫️', '🏚️', '👻', '🔦'],
        trailer: 'https://youtube.com/watch?v=trailer',
        metacritic: 87,
        steamRating: 92
      },
      2: {
        id: 2,
        title: 'GRIS',
        genre: 'Aventura Artística',
        platform: ['PC', 'Switch', 'PS4', 'Xbox One'],
        developer: 'Nomada Studio',
        publisher: 'Devolver Digital',
        releaseDate: '2018',
        size: '4 GB',
        rating: 'E (Everyone)',
        image: '🎨',
        description: 'Una experiencia serena y evocadora, libre de peligro, frustración o muerte. Los jugadores explorarán un mundo meticulosamente diseñado que cobra vida con arte delicado, animación detallada y una banda sonora elegante.',
        features: ['Arte único', 'Música emotiva', 'Sin violencia', 'Experiencia contemplativa'],
        screenshots: ['🌈', '🎭', '🦋', '🌸'],
        trailer: 'https://youtube.com/watch?v=trailer',
        metacritic: 83,
        steamRating: 95
      }
    },
    ver: {
      1: {
        id: 1,
        title: 'Your Name',
        year: 2016,
        duration: '107 min',
        genre: ['Animación', 'Romance', 'Drama'],
        director: 'Makoto Shinkai',
        studio: 'CoMix Wave Films',
        country: 'Japón',
        language: 'Japonés',
        rating: 'PG',
        image: '🌟',
        description: 'Mitsuha y Taki son dos adolescentes que no se conocen, pero están conectados por un fenómeno sobrenatural que les permite intercambiar cuerpos. A medida que navegan por esta extraña situación, desarrollan una conexión profunda.',
        cast: ['Ryunosuke Kamiki', 'Mone Kamishiraishi', 'Masami Nagasawa'],
        platforms: ['Netflix', 'Crunchyroll', 'Amazon Prime'],
        trailer: 'https://youtube.com/watch?v=trailer',
        imdbRating: 8.2,
        rottenTomatoes: 98
      },
      2: {
        id: 2,
        title: 'Spirited Away',
        year: 2001,
        duration: '125 min',
        genre: ['Animación', 'Fantasía', 'Familia'],
        director: 'Hayao Miyazaki',
        studio: 'Studio Ghibli',
        country: 'Japón',
        language: 'Japonés',
        rating: 'PG',
        image: '🐲',
        description: 'Chihiro, una niña de 10 años, se muda con sus padres a una nueva ciudad. En el camino, entran en lo que su padre cree que es un parque temático abandonado, pero en realidad es un mundo habitado por espíritus.',
        cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
        platforms: ['HBO Max', 'Netflix', 'Amazon Prime'],
        trailer: 'https://youtube.com/watch?v=trailer',
        imdbRating: 9.3,
        rottenTomatoes: 97
      }
    },
    escuchar: {
      1: {
        id: 1,
        title: 'American Idiot',
        artist: 'Green Day',
        year: 2004,
        genre: ['Punk Rock', 'Alternative Rock'],
        label: 'Reprise Records',
        duration: '57 min',
        tracks: 13,
        image: '💚',
        description: 'Álbum conceptual que critica la sociedad estadounidense post-11 de septiembre. Marcó el regreso triunfal de Green Day con un sonido más maduro y teatral.',
        topTracks: ['American Idiot', 'Boulevard of Broken Dreams', 'Holiday', 'Wake Me Up When September Ends'],
        platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music'],
        awards: ['Grammy Award', 'MTV Video Music Award'],
        chartPosition: '#1 Billboard 200',
        sales: '16 millones de copias'
      },
      2: {
        id: 2,
        title: 'For Emma, Forever Ago',
        artist: 'Bon Iver',
        year: 2007,
        genre: ['Indie Folk', 'Alternative'],
        label: 'Jagjaguwar',
        duration: '37 min',
        tracks: 9,
        image: '🌲',
        description: 'Grabado en una cabaña remota en Wisconsin durante el invierno, este álbum debut captura la soledad y la introspección con una belleza etérea y melancólica.',
        topTracks: ['Skinny Love', 'Re: Stacks', 'Flume', 'For Emma'],
        platforms: ['Spotify', 'Apple Music', 'Bandcamp', 'Vinyl'],
        awards: ['Pitchfork Best New Music'],
        chartPosition: '#98 Billboard 200',
        sales: '500,000 copias'
      }
    }
  }

  useEffect(() => {
    const loadItemDetails = async () => {
      setIsLoading(true)
      
      try {
        let itemData = null
        
        if (type === 'ver') {
          // Cargar detalles de película/serie desde TMDB
          itemData = await movieService.getMovieDetails(id)
        } else if (type === 'jugar') {
          // Cargar detalles de juego desde RAWG
          itemData = await gameService.getGameDetails(id)
        } else if (type === 'escuchar') {
          // Para música, necesitamos parsear el ID que contiene artista-album
          const [artist, album] = id.split('-').map(part => 
            part.replace(/-/g, ' ')
          )
          itemData = await musicService.getAlbumDetails(artist, album)
        }
        
        if (!itemData) {
          // Fallback a datos estáticos si no se encuentra en APIs
          itemData = detailedData[type]?.[id]
        }
        
        setItem(itemData)
      } catch (error) {
        console.error('Error loading item details:', error)
        // Usar datos estáticos como fallback
        const itemData = detailedData[type]?.[id]
        setItem(itemData)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadItemDetails()
  }, [type, id])

  const handleComplete = () => {
    setHasCompleted(true)
    // Aquí se podría agregar lógica para trofeos
  }

  const handleRating = (rating) => {
    setUserRating(rating)
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando detalles...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="error-container">
        <h2>Contenido no encontrado</h2>
        <button className="btn" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <motion.div 
      className={`experience-detail ${type}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        {/* Header */}
        <motion.div 
          className="detail-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Volver
          </button>
          <div className="character-companion">
            <div className="character-face">
              {character?.type === 'quick' ? character.avatar : '👤'}
            </div>
          </div>
        </motion.div>

        {/* Contenido principal */}
        <motion.div 
          className="detail-content"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="content-grid">
            {/* Información principal */}
            <div className="main-info card">
              <div className="item-header">
                <div className="item-image">{item.image}</div>
                <div className="item-title-section">
                  <h1>{item.title}</h1>
                  {type === 'jugar' && <p className="subtitle">{item.developer} • {item.releaseDate}</p>}
                  {type === 'ver' && <p className="subtitle">{item.director} • {item.year}</p>}
                  {type === 'escuchar' && <p className="subtitle">{item.artist} • {item.year}</p>}
                </div>
              </div>

              <div className="description">
                <p>{item.description}</p>
              </div>

              {/* Información específica por tipo */}
              <div className="type-specific-info">
                {type === 'jugar' && (
                  <div className="game-info">
                    <div className="info-grid">
                      <div className="info-item">
                        <strong>Género:</strong> {item.genre}
                      </div>
                      <div className="info-item">
                        <strong>Plataformas:</strong> {item.platform.join(', ')}
                      </div>
                      <div className="info-item">
                        <strong>Desarrollador:</strong> {item.developer}
                      </div>
                      <div className="info-item">
                        <strong>Tamaño:</strong> {item.size}
                      </div>
                      <div className="info-item">
                        <strong>Clasificación:</strong> {item.rating}
                      </div>
                    </div>
                    <div className="features">
                      <h4>Características:</h4>
                      <ul>
                        {item.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {type === 'ver' && (
                  <div className="movie-info">
                    <div className="info-grid">
                      <div className="info-item">
                        <Clock size={16} />
                        <span>{item.duration}</span>
                      </div>
                      <div className="info-item">
                        <Calendar size={16} />
                        <span>{item.year}</span>
                      </div>
                      <div className="info-item">
                        <strong>Director:</strong> {item.director}
                      </div>
                      <div className="info-item">
                        <strong>Estudio:</strong> {item.studio}
                      </div>
                      <div className="info-item">
                        <strong>Género:</strong> {item.genre.join(', ')}
                      </div>
                    </div>
                    <div className="cast">
                      <h4>Reparto principal:</h4>
                      <ul>
                        {item.cast.map((actor, index) => (
                          <li key={index}>{actor}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="platforms">
                      <h4>Disponible en:</h4>
                      <div className="platform-list">
                        {item.platforms.map((platform, index) => (
                          <span key={index} className="platform-tag">{platform}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {type === 'escuchar' && (
                  <div className="music-info">
                    <div className="info-grid">
                      <div className="info-item">
                        <Clock size={16} />
                        <span>{item.duration}</span>
                      </div>
                      <div className="info-item">
                        <strong>Canciones:</strong> {item.tracks}
                      </div>
                      <div className="info-item">
                        <strong>Sello:</strong> {item.label}
                      </div>
                      <div className="info-item">
                        <strong>Género:</strong> {item.genre.join(', ')}
                      </div>
                    </div>
                    <div className="top-tracks">
                      <h4>Canciones destacadas:</h4>
                      <ul>
                        {item.topTracks.map((track, index) => (
                          <li key={index}>
                            <Play size={14} />
                            {track}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="platforms">
                      <h4>Escuchar en:</h4>
                      <div className="platform-list">
                        {item.platforms.map((platform, index) => (
                          <span key={index} className="platform-tag">{platform}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Panel lateral */}
            <div className="side-panel">
              {/* Ratings */}
              <div className="ratings-card card">
                <h3>Calificaciones</h3>
                <div className="rating-item">
                  {type === 'jugar' && (
                    <>
                      <div className="rating">
                        <strong>Metacritic:</strong>
                        <span className="score">{item.metacritic}/100</span>
                      </div>
                      <div className="rating">
                        <strong>Steam:</strong>
                        <span className="score">{item.steamRating}%</span>
                      </div>
                    </>
                  )}
                  {type === 'ver' && (
                    <>
                      <div className="rating">
                        <strong>IMDb:</strong>
                        <span className="score">{item.imdbRating}/10</span>
                      </div>
                      <div className="rating">
                        <strong>Rotten Tomatoes:</strong>
                        <span className="score">{item.rottenTomatoes}%</span>
                      </div>
                    </>
                  )}
                  {type === 'escuchar' && (
                    <>
                      <div className="rating">
                        <strong>Posición en charts:</strong>
                        <span className="score">{item.chartPosition}</span>
                      </div>
                      <div className="rating">
                        <strong>Ventas:</strong>
                        <span className="score">{item.sales}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Rating del usuario */}
                <div className="user-rating">
                  <h4>Tu calificación:</h4>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`star ${userRating >= star ? 'filled' : ''}`}
                        onClick={() => handleRating(star)}
                      >
                        <Star size={20} fill={userRating >= star ? '#fbbf24' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="actions-card card">
                <h3>Acciones</h3>
                <div className="action-buttons">
                  <button className="btn primary-btn">
                    <Play size={20} />
                    {type === 'jugar' && 'Jugar ahora'}
                    {type === 'ver' && 'Ver ahora'}
                    {type === 'escuchar' && 'Escuchar ahora'}
                  </button>
                  
                  {!hasCompleted && (
                    <button className="btn secondary-btn" onClick={handleComplete}>
                      <Trophy size={20} />
                      Marcar como completado
                    </button>
                  )}
                  
                  {hasCompleted && (
                    <div className="completed-badge">
                      <Trophy size={16} />
                      ¡Completado! +50 XP
                    </div>
                  )}
                </div>
              </div>

              {/* Screenshots/Galería */}
              {(type === 'jugar' || type === 'ver') && (
                <div className="gallery-card card">
                  <h3>{type === 'jugar' ? 'Capturas' : 'Escenas'}</h3>
                  <div className="gallery">
                    {(item.screenshots || ['🖼️', '🎬', '🎮', '🌟']).map((screenshot, index) => (
                      <div key={index} className="gallery-item">
                        {screenshot}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .experience-detail {
          min-height: 100vh;
          padding: 2rem 0;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(-4px);
        }

        .character-companion {
          display: flex;
          align-items: center;
        }

        .character-face {
          font-size: 2.5rem;
          animation: float 3s ease-in-out infinite;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .main-info {
          padding: 2rem;
        }

        .item-header {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          align-items: flex-start;
        }

        .item-image {
          font-size: 6rem;
          flex-shrink: 0;
        }

        .item-title-section h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: white;
        }

        .subtitle {
          font-size: 1.1rem;
          opacity: 0.8;
          margin: 0;
        }

        .description {
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .features ul, .cast ul, .top-tracks ul {
          list-style: none;
          padding: 0;
        }

        .features li, .cast li {
          padding: 4px 0;
          opacity: 0.9;
        }

        .top-tracks li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .top-tracks li:hover {
          background: rgba(255, 255, 255, 0.1);
          padding-left: 12px;
          border-radius: 8px;
        }

        .platform-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .platform-tag {
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .side-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ratings-card, .actions-card, .gallery-card {
          padding: 1.5rem;
        }

        .rating {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .score {
          font-weight: bold;
          color: #10b981;
        }

        .user-rating {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stars {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }

        .star {
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #fbbf24;
        }

        .star:hover {
          transform: scale(1.1);
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .primary-btn {
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
        }

        .secondary-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .completed-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 600;
          text-align: center;
        }

        .gallery {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .gallery-item {
          aspect-ratio: 16/9;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .gallery-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .item-header {
            flex-direction: column;
            text-align: center;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default ExperienceDetail