import { movieService, gameService, musicService } from './apiService'

// Servicio para obtener imágenes reales de contenido
export const contentImageService = {
  // Cache para evitar llamadas repetidas
  cache: {
    movies: [],
    games: [],
    music: []
  },

  // Obtener portadas de películas populares
  async getMovieCovers(limit = 20) {
    try {
      if (this.cache.movies.length > 0) {
        return this.cache.movies.slice(0, limit)
      }

      const popularMovies = await movieService.getPopularMovies()
      const movieCovers = popularMovies.map(movie => ({
        id: movie.id,
        title: movie.title,
        image: movie.poster_path ? 
          `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 
          null,
        type: 'movie',
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
        rating: movie.vote_average || 0,
        genre: movie.genre_ids?.[0] || 'Drama'
      }))

      this.cache.movies = movieCovers
      return movieCovers.slice(0, limit)
    } catch (error) {
      console.error('Error al obtener portadas de películas:', error)
      return this.getFallbackMovieCovers(limit)
    }
  },

  // Obtener portadas de series populares
  async getSeriesCovers(limit = 20) {
    try {
      const popularSeries = await movieService.getPopularSeries()
      return popularSeries.map(series => ({
        id: series.id,
        title: series.name,
        image: series.poster_path ? 
          `https://image.tmdb.org/t/p/w300${series.poster_path}` : 
          null,
        type: 'series',
        year: series.first_air_date ? new Date(series.first_air_date).getFullYear() : 'N/A',
        rating: series.vote_average || 0,
        genre: series.genre_ids?.[0] || 'Drama'
      })).slice(0, limit)
    } catch (error) {
      console.error('Error al obtener portadas de series:', error)
      return this.getFallbackSeriesCovers(limit)
    }
  },

  // Obtener portadas de juegos populares
  async getGameCovers(limit = 20) {
    try {
      if (this.cache.games.length > 0) {
        return this.cache.games.slice(0, limit)
      }

      const popularGames = await gameService.getPopularGames()
      const gameCovers = popularGames.map(game => ({
        id: game.id,
        title: game.name,
        image: game.background_image,
        type: 'game',
        year: game.released ? new Date(game.released).getFullYear() : 'N/A',
        rating: game.rating || 0,
        genre: game.genres?.[0]?.name || 'Action'
      }))

      this.cache.games = gameCovers
      return gameCovers.slice(0, limit)
    } catch (error) {
      console.error('Error al obtener portadas de juegos:', error)
      return this.getFallbackGameCovers(limit)
    }
  },

  // Obtener portadas de álbumes populares
  async getMusicCovers(limit = 20) {
    try {
      if (this.cache.music.length > 0) {
        return this.cache.music.slice(0, limit)
      }

      const topAlbums = await musicService.getTopAlbums()
      const musicCovers = topAlbums.map(album => ({
        id: album.mbid || album.name,
        title: album.name,
        artist: album.artist?.name || album.artist,
        image: album.image?.find(img => img.size === 'large')?.['#text'] || 
               album.image?.find(img => img.size === 'medium')?.['#text'],
        type: 'music',
        year: 'N/A',
        rating: 0,
        genre: 'Music'
      }))

      this.cache.music = musicCovers
      return musicCovers.slice(0, limit)
    } catch (error) {
      console.error('Error al obtener portadas de música:', error)
      return this.getFallbackMusicCovers(limit)
    }
  },

  // Obtener mix de todas las portadas
  async getMixedCovers(moviesCount = 8, gamesCount = 8, musicCount = 8) {
    try {
      const [movies, games, music] = await Promise.all([
        this.getMovieCovers(moviesCount),
        this.getGameCovers(gamesCount),
        this.getMusicCovers(musicCount)
      ])

      // Mezclar aleatoriamente
      const allCovers = [...movies, ...games, ...music]
      return this.shuffleArray(allCovers)
    } catch (error) {
      console.error('Error al obtener mix de portadas:', error)
      return this.getFallbackMixedCovers()
    }
  },

  // Obtener portadas por categoría
  async getCoversByCategory(category, limit = 20) {
    switch (category) {
      case 'movies':
        return await this.getMovieCovers(limit)
      case 'series':
        return await this.getSeriesCovers(limit)
      case 'games':
        return await this.getGameCovers(limit)
      case 'music':
        return await this.getMusicCovers(limit)
      case 'mixed':
        return await this.getMixedCovers()
      default:
        return await this.getMixedCovers()
    }
  },

  // Utilidades
  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  },

  // Datos de respaldo si las APIs fallan
  getFallbackMovieCovers(limit) {
    const fallbackMovies = [
      { id: 1, title: 'Avatar', type: 'movie', year: 2009, rating: 8.5, genre: 'Sci-Fi', image: null },
      { id: 2, title: 'Titanic', type: 'movie', year: 1997, rating: 8.8, genre: 'Romance', image: null },
      { id: 3, title: 'Avengers', type: 'movie', year: 2019, rating: 8.4, genre: 'Action', image: null },
      { id: 4, title: 'Inception', type: 'movie', year: 2010, rating: 8.8, genre: 'Sci-Fi', image: null },
      { id: 5, title: 'Interstellar', type: 'movie', year: 2014, rating: 8.6, genre: 'Sci-Fi', image: null }
    ]
    return fallbackMovies.slice(0, limit)
  },

  getFallbackSeriesCovers(limit) {
    const fallbackSeries = [
      { id: 1, title: 'Breaking Bad', type: 'series', year: 2008, rating: 9.5, genre: 'Drama', image: null },
      { id: 2, title: 'Game of Thrones', type: 'series', year: 2011, rating: 9.3, genre: 'Fantasy', image: null },
      { id: 3, title: 'Stranger Things', type: 'series', year: 2016, rating: 8.7, genre: 'Sci-Fi', image: null },
      { id: 4, title: 'The Office', type: 'series', year: 2005, rating: 8.9, genre: 'Comedy', image: null },
      { id: 5, title: 'Friends', type: 'series', year: 1994, rating: 8.9, genre: 'Comedy', image: null }
    ]
    return fallbackSeries.slice(0, limit)
  },

  getFallbackGameCovers(limit) {
    const fallbackGames = [
      { id: 1, title: 'The Witcher 3', type: 'game', year: 2015, rating: 9.3, genre: 'RPG', image: null },
      { id: 2, title: 'Red Dead Redemption 2', type: 'game', year: 2018, rating: 9.7, genre: 'Action', image: null },
      { id: 3, title: 'Cyberpunk 2077', type: 'game', year: 2020, rating: 7.2, genre: 'RPG', image: null },
      { id: 4, title: 'God of War', type: 'game', year: 2018, rating: 9.4, genre: 'Action', image: null },
      { id: 5, title: 'Minecraft', type: 'game', year: 2011, rating: 8.0, genre: 'Sandbox', image: null }
    ]
    return fallbackGames.slice(0, limit)
  },

  getFallbackMusicCovers(limit) {
    const fallbackMusic = [
      { id: 1, title: 'Abbey Road', artist: 'The Beatles', type: 'music', year: 1969, rating: 9.5, genre: 'Rock', image: null },
      { id: 2, title: 'Dark Side of the Moon', artist: 'Pink Floyd', type: 'music', year: 1973, rating: 9.7, genre: 'Rock', image: null },
      { id: 3, title: 'Thriller', artist: 'Michael Jackson', type: 'music', year: 1982, rating: 9.3, genre: 'Pop', image: null },
      { id: 4, title: 'Back in Black', artist: 'AC/DC', type: 'music', year: 1980, rating: 9.1, genre: 'Rock', image: null },
      { id: 5, title: 'Nevermind', artist: 'Nirvana', type: 'music', year: 1991, rating: 8.9, genre: 'Grunge', image: null }
    ]
    return fallbackMusic.slice(0, limit)
  },

  getFallbackMixedCovers() {
    return [
      ...this.getFallbackMovieCovers(5),
      ...this.getFallbackGameCovers(5),
      ...this.getFallbackMusicCovers(5)
    ]
  },

  // Limpiar cache
  clearCache() {
    this.cache = {
      movies: [],
      games: [],
      music: []
    }
  }
}

export default contentImageService