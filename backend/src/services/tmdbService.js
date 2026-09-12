const axios = require('axios');
const https = require('https');
const cache = require('../cache/tmdbCache');

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
  const cacheKey = `popular:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('CACHE HIT:', cacheKey);
    return cached;
  }
  console.log('CACHE MISS:', cacheKey);

  const data = await requestWithRetry(async () => {
    const response = await tmdbClient.get('/movie/popular', {
      params: { language: 'en-US', page },
    });
    return response.data;
  });

  cache.set(cacheKey, data);
  return data;
}

async function getMovieDetails(movieId) {
  const cacheKey = `movie:${movieId}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('CACHE HIT:', cacheKey);
    return cached;
  }
  console.log('CACHE MISS:', cacheKey);

  const data = await requestWithRetry(async () => {
    const response = await tmdbClient.get(`/movie/${movieId}`, {
      params: { language: 'en-US' },
    });
    return response.data;
  });

  cache.set(cacheKey, data);
  return data;
}

async function searchMovies(query, page = 1) {
  const cacheKey = `search:${query.toLowerCase()}:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('CACHE HIT:', cacheKey);
    return cached;
  }
  console.log('CACHE MISS:', cacheKey);

  const data = await requestWithRetry(async () => {
    const response = await tmdbClient.get('/search/movie', {
      params: { query, language: 'en-US', page },
    });
    return response.data;
  });

  cache.set(cacheKey, data, 120);
  return data;
}

async function discoverMovies({ genre, sortBy, page = 1 }) {
  const cacheKey = `discover:${genre || 'all'}:${sortBy || 'default'}:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('CACHE HIT:', cacheKey);
    return cached;
  }
  console.log('CACHE MISS:', cacheKey);

  const data = await requestWithRetry(async () => {
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

  cache.set(cacheKey, data);
  return data;
}

async function getGenres() {
  const cacheKey = 'genres';
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('CACHE HIT:', cacheKey);
    return cached;
  }
  console.log('CACHE MISS:', cacheKey);

  const data = await requestWithRetry(async () => {
    const response = await tmdbClient.get('/genre/movie/list', {
      params: { language: 'en-US' },
    });
    return response.data;
  });

  cache.set(cacheKey, data, 86400);
  return data;
}

async function getSimilarMovies(movieId, page = 1) {
  const cacheKey = `similar:${movieId}:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('CACHE HIT:', cacheKey);
    return cached;
  }
  console.log('CACHE MISS:', cacheKey);

  const data = await requestWithRetry(async () => {
    const response = await tmdbClient.get(`/movie/${movieId}/similar`, {
      params: { language: 'en-US', page },
    });
    return response.data;
  });

  cache.set(cacheKey, data);
  return data;
}

module.exports = {
  getPopularMovies,
  getMovieDetails,
  searchMovies,
  discoverMovies,
  getGenres,
  getSimilarMovies,
};