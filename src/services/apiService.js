// Servicio para integrar APIs de contenido multimedia

// Configuración de APIs usando variables de entorno
const API_CONFIG = {
  // TMDB para películas y series
  TMDB: {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: import.meta.env.VITE_TMDB_API_KEY || 'demo_key',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500'
  },
  // RAWG para videojuegos
  RAWG: {
    BASE_URL: 'https://api.rawg.io/api',
    API_KEY: import.meta.env.VITE_RAWG_API_KEY || 'demo_key'
  },
  // Last.fm para música
  LASTFM: {
    BASE_URL: 'https://ws.audioscrobbler.com/2.0',
    API_KEY: import.meta.env.VITE_LASTFM_API_KEY || 'demo_key'
  },
  // Spotify Web API (alternativa para música)
  SPOTIFY: {
    BASE_URL: 'https://api.spotify.com/v1',
    CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'demo_client_id',
    CLIENT_SECRET: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || 'demo_client_secret'
  }
}

// Utilidad para hacer peticiones HTTP
const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// ===== SERVICIOS DE PELÍCULAS Y SERIES (TMDB) =====
export const movieService = {
  // Buscar películas por género/mood
  async getMoviesByMood(mood, page = 1) {
    const genreMap = {
      nostalgico: '18,10749', // Drama, Romance
      triste: '18,10402', // Drama, Music
      creativo: '16,878', // Animation, Science Fiction
      curioso: '9648,53,27' // Mystery, Thriller, Horror
    }
    
    const genres = genreMap[mood] || '18'
    const url = `${API_CONFIG.TMDB.BASE_URL}/discover/movie?api_key=${API_CONFIG.TMDB.API_KEY}&with_genres=${genres}&page=${page}&sort_by=vote_average.desc&vote_count.gte=100`
    
    const data = await fetchAPI(url)
    return data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      year: new Date(movie.release_date).getFullYear(),
      duration: 'N/A', // Requiere llamada adicional
      genre: movie.genre_ids,
      description: movie.overview,
      image: movie.poster_path ? `${API_CONFIG.TMDB.IMAGE_BASE_URL}${movie.poster_path}` : '🎬',
      rating: movie.vote_average,
      popularity: movie.popularity,
      mood: [mood]
    }))
  },
  
  // Obtener detalles completos de una película
  async getMovieDetails(movieId) {
    const url = `${API_CONFIG.TMDB.BASE_URL}/movie/${movieId}?api_key=${API_CONFIG.TMDB.API_KEY}&append_to_response=credits,videos,watch/providers`
    const movie = await fetchAPI(url)
    
    return {
      id: movie.id,
      title: movie.title,
      year: new Date(movie.release_date).getFullYear(),
      duration: `${movie.runtime} min`,
      genre: movie.genres.map(g => g.name),
      director: movie.credits.crew.find(person => person.job === 'Director')?.name || 'N/A',
      studio: movie.production_companies[0]?.name || 'N/A',
      country: movie.production_countries[0]?.name || 'N/A',
      language: movie.original_language,
      rating: movie.vote_average,
      description: movie.overview,
      cast: movie.credits.cast.slice(0, 5).map(actor => actor.name),
      image: movie.poster_path ? `${API_CONFIG.TMDB.IMAGE_BASE_URL}${movie.poster_path}` : '🎬',
      backdrop: movie.backdrop_path ? `${API_CONFIG.TMDB.IMAGE_BASE_URL}${movie.backdrop_path}` : null,
      trailer: movie.videos.results.find(video => video.type === 'Trailer')?.key || null,
      platforms: movie['watch/providers']?.results?.US?.flatrate?.map(p => p.provider_name) || []
    }
  },
  
  // Buscar series
  async getSeriesByMood(mood, page = 1) {
    const genreMap = {
      nostalgico: '18,10765', // Drama, Sci-Fi & Fantasy
      triste: '18', // Drama
      creativo: '16,10765', // Animation, Sci-Fi & Fantasy
      curioso: '9648,80' // Mystery, Crime
    }
    
    const genres = genreMap[mood] || '18'
    const url = `${API_CONFIG.TMDB.BASE_URL}/discover/tv?api_key=${API_CONFIG.TMDB.API_KEY}&with_genres=${genres}&page=${page}&sort_by=vote_average.desc&vote_count.gte=50`
    
    const data = await fetchAPI(url)
    return data.results.map(series => ({
      id: series.id,
      title: series.name,
      year: new Date(series.first_air_date).getFullYear(),
      genre: series.genre_ids,
      description: series.overview,
      image: series.poster_path ? `${API_CONFIG.TMDB.IMAGE_BASE_URL}${series.poster_path}` : '📺',
      rating: series.vote_average,
      mood: [mood]
    }))
  }
}

// ===== SERVICIOS DE VIDEOJUEGOS (RAWG) =====
export const gameService = {
  // Buscar juegos por mood/género
  async getGamesByMood(mood, page = 1) {
    const genreMap = {
      nostalgico: 'indie,adventure', // Indie, Adventure
      triste: 'indie,adventure,puzzle', // Indie, Adventure, Puzzle
      creativo: 'indie,puzzle,simulation', // Indie, Puzzle, Simulation
      curioso: 'adventure,puzzle,strategy' // Adventure, Puzzle, Strategy
    }
    
    const genres = genreMap[mood] || 'indie'
    const url = `${API_CONFIG.RAWG.BASE_URL}/games?key=${API_CONFIG.RAWG.API_KEY}&genres=${genres}&page=${page}&page_size=20&ordering=-rating`
    
    const data = await fetchAPI(url)
    return data.results.map(game => ({
      id: game.id,
      title: game.name,
      genre: game.genres.map(g => g.name).join(', '),
      platform: game.platforms.map(p => p.platform.name),
      developer: game.developers?.[0]?.name || 'N/A',
      releaseDate: new Date(game.released).getFullYear(),
      rating: game.rating,
      image: game.background_image || '🎮',
      description: game.description_raw || 'Descripción no disponible',
      mood: [mood]
    }))
  },
  
  // Obtener detalles completos de un juego
  async getGameDetails(gameId) {
    const url = `${API_CONFIG.RAWG.BASE_URL}/games/${gameId}?key=${API_CONFIG.RAWG.API_KEY}`
    const game = await fetchAPI(url)
    
    return {
      id: game.id,
      title: game.name,
      genre: game.genres.map(g => g.name).join(', '),
      platform: game.platforms.map(p => p.platform.name),
      developer: game.developers?.[0]?.name || 'N/A',
      publisher: game.publishers?.[0]?.name || 'N/A',
      releaseDate: game.released,
      rating: game.esrb_rating?.name || 'N/A',
      metacritic: game.metacritic || 'N/A',
      description: game.description_raw || 'Descripción no disponible',
      image: game.background_image || '🎮',
      screenshots: game.short_screenshots?.map(s => s.image) || [],
      tags: game.tags?.slice(0, 10).map(t => t.name) || [],
      website: game.website || null,
      reddit: game.reddit_url || null
    }
  }
}

// ===== SERVICIOS DE MÚSICA (Last.fm) =====
export const musicService = {
  // Buscar álbumes por mood/tag
  async getAlbumsByMood(mood, page = 1) {
    const tagMap = {
      nostalgico: 'nostalgic,indie,alternative',
      triste: 'sad,melancholic,indie',
      creativo: 'experimental,electronic,indie',
      curioso: 'alternative,rock,electronic'
    }
    
    const tag = tagMap[mood] || 'indie'
    const url = `${API_CONFIG.LASTFM.BASE_URL}/?method=tag.gettopalbums&tag=${tag}&api_key=${API_CONFIG.LASTFM.API_KEY}&format=json&page=${page}&limit=20`
    
    const data = await fetchAPI(url)
    return data.topalbums.album.map(album => ({
      id: `${album.artist.name}-${album.name}`.replace(/\s+/g, '-').toLowerCase(),
      title: album.name,
      artist: album.artist.name,
      image: album.image.find(img => img.size === 'large')?.['#text'] || '🎵',
      url: album.url,
      playcount: album.playcount,
      mood: [mood]
    }))
  },
  
  // Obtener información detallada de un álbum
  async getAlbumDetails(artist, album) {
    const url = `${API_CONFIG.LASTFM.BASE_URL}/?method=album.getinfo&api_key=${API_CONFIG.LASTFM.API_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`
    
    try {
      const data = await fetchAPI(url)
      const albumInfo = data.album
      
      return {
        id: `${artist}-${album}`.replace(/\s+/g, '-').toLowerCase(),
        title: albumInfo.name,
        artist: albumInfo.artist,
        year: albumInfo.wiki?.published ? new Date(albumInfo.wiki.published).getFullYear() : 'N/A',
        genre: albumInfo.tags?.tag?.map(t => t.name) || ['N/A'],
        duration: 'N/A', // Last.fm no proporciona duración total
        tracks: albumInfo.tracks?.track?.length || 'N/A',
        description: albumInfo.wiki?.summary || 'Descripción no disponible',
        image: albumInfo.image?.find(img => img.size === 'extralarge')?.['#text'] || '🎵',
        url: albumInfo.url,
        playcount: albumInfo.playcount,
        topTracks: albumInfo.tracks?.track?.slice(0, 5).map(track => track.name) || []
      }
    } catch (error) {
      console.error('Error fetching album details:', error)
      return null
    }
  },
  
  // Buscar artistas por mood
  async getArtistsByMood(mood, page = 1) {
    const tagMap = {
      nostalgico: 'nostalgic',
      triste: 'sad',
      creativo: 'experimental',
      curioso: 'alternative'
    }
    
    const tag = tagMap[mood] || 'indie'
    const url = `${API_CONFIG.LASTFM.BASE_URL}/?method=tag.gettopartists&tag=${tag}&api_key=${API_CONFIG.LASTFM.API_KEY}&format=json&page=${page}&limit=20`
    
    const data = await fetchAPI(url)
    return data.topartists.artist.map(artist => ({
      id: artist.name.replace(/\s+/g, '-').toLowerCase(),
      name: artist.name,
      image: artist.image.find(img => img.size === 'large')?.['#text'] || '🎤',
      url: artist.url,
      playcount: artist.playcount,
      mood: [mood]
    }))
  }
}

// ===== SERVICIO PRINCIPAL DE RECOMENDACIONES =====
export const recommendationService = {
  // Obtener recomendaciones basadas en estado emocional
  async getRecommendationsByMood(emotionalState) {
    // Determinar mood dominante
    const dominantMood = Object.entries(emotionalState)
      .sort(([,a], [,b]) => b - a)[0][0]
    
    try {
      // Obtener recomendaciones en paralelo
      const [movies, games, albums] = await Promise.all([
        movieService.getMoviesByMood(dominantMood),
        gameService.getGamesByMood(dominantMood),
        musicService.getAlbumsByMood(dominantMood)
      ])
      
      // Seleccionar una recomendación aleatoria de cada categoría
      const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)]
      
      return {
        ver: getRandomItem(movies),
        jugar: getRandomItem(games),
        escuchar: getRandomItem(albums)
      }
    } catch (error) {
      console.error('Error getting recommendations:', error)
      // Fallback a datos estáticos si las APIs fallan
      return this.getFallbackRecommendations(dominantMood)
    }
  },
  
  // Datos de respaldo si las APIs no están disponibles
  getFallbackRecommendations(mood) {
    const fallbackData = {
      nostalgico: {
        ver: { id: 1, title: 'Your Name', year: 2016, image: '🌟', mood: ['nostalgico'] },
        jugar: { id: 1, title: 'Journey', genre: 'Aventura', image: '🌟', mood: ['nostalgico'] },
        escuchar: { id: 1, title: 'For Emma, Forever Ago', artist: 'Bon Iver', image: '🌲', mood: ['nostalgico'] }
      },
      triste: {
        ver: { id: 2, title: 'Her', year: 2013, image: '💭', mood: ['triste'] },
        jugar: { id: 2, title: 'GRIS', genre: 'Aventura Artística', image: '🎨', mood: ['triste'] },
        escuchar: { id: 2, title: 'Blonde', artist: 'Frank Ocean', image: '🌊', mood: ['triste'] }
      },
      creativo: {
        ver: { id: 3, title: 'Spirited Away', year: 2001, image: '🐲', mood: ['creativo'] },
        jugar: { id: 3, title: 'The Stanley Parable', genre: 'Narrativo', image: '🤔', mood: ['creativo'] },
        escuchar: { id: 3, title: 'In Rainbows', artist: 'Radiohead', image: '🌈', mood: ['creativo'] }
      },
      curioso: {
        ver: { id: 4, title: 'The Grand Budapest Hotel', year: 2014, image: '🏨', mood: ['curioso'] },
        jugar: { id: 4, title: 'Silent Hill 2', genre: 'Horror Psicológico', image: '🎮', mood: ['curioso'] },
        escuchar: { id: 4, title: 'American Idiot', artist: 'Green Day', image: '💚', mood: ['curioso'] }
      }
    }
    
    return fallbackData[mood] || fallbackData.nostalgico
  }
}

// ===== CONFIGURACIÓN Y UTILIDADES =====
export const apiUtils = {
  // Verificar si las APIs están configuradas
  checkAPIConfiguration() {
    const missingKeys = []
    
    if (API_CONFIG.TMDB.API_KEY === 'tu_api_key_tmdb') {
      missingKeys.push('TMDB API Key')
    }
    if (API_CONFIG.RAWG.API_KEY === 'tu_api_key_rawg') {
      missingKeys.push('RAWG API Key')
    }
    if (API_CONFIG.LASTFM.API_KEY === 'tu_api_key_lastfm') {
      missingKeys.push('Last.fm API Key')
    }
    
    return {
      isConfigured: missingKeys.length === 0,
      missingKeys
    }
  },
  
  // Configurar API keys dinámicamente
  setAPIKeys(keys) {
    if (keys.tmdb) API_CONFIG.TMDB.API_KEY = keys.tmdb
    if (keys.rawg) API_CONFIG.RAWG.API_KEY = keys.rawg
    if (keys.lastfm) API_CONFIG.LASTFM.API_KEY = keys.lastfm
    if (keys.spotify) {
      API_CONFIG.SPOTIFY.CLIENT_ID = keys.spotify.clientId
      API_CONFIG.SPOTIFY.CLIENT_SECRET = keys.spotify.clientSecret
    }
  }
}

export default {
  movieService,
  gameService,
  musicService,
  recommendationService,
  apiUtils
}