const axios = require('axios');
const https = require('https');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
  },
  timeout: 8000,
  httpsAgent: new https.Agent({ keepAlive: false }),
});

async function requestWithRetry(fn, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isLastAttempt = attempt === retries;
      const isRetriable = err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || !err.response;
      if (isLastAttempt || !isRetriable) throw err;
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
}

async function getPopularMovies(page = 1) {
  return requestWithRetry(async () => {
    const response = await tmdbClient.get('/movie/popular', {
      params: { language: 'en-US', page },
    });
    return response.data;
  });
}

async function getMovieDetails(movieId) {
  return requestWithRetry(async () => {
    const response = await tmdbClient.get(`/movie/${movieId}`, {
      params: { language: 'en-US' },
    });
    return response.data;
  });
}

async function searchMovies(query, page = 1) {
  return requestWithRetry(async () => {
    const response = await tmdbClient.get('/search/movie', {
      params: { query, language: 'en-US', page },
    });
    return response.data;
  });
}

async function discoverMovies({ genre, sortBy, page = 1 }) {
  return requestWithRetry(async () => {
    const response = await tmdbClient.get('/discover/movie', {
      params: {
        with_genres: genre,
        sort_by: sortBy || 'popularity.desc',
        language: 'en-US',
        page,
      },
    });
    return response.data;
  });
}

async function getGenres() {
  return requestWithRetry(async () => {
    const response = await tmdbClient.get('/genre/movie/list', {
      params: { language: 'en-US' },
    });
    return response.data;
  });
}

module.exports = {
  getPopularMovies,
  getMovieDetails,
  searchMovies,
  discoverMovies,
  getGenres,
};