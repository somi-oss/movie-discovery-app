const express = require('express');
const router = express.Router();
const tmdb = require('../services/tmdbService');

// Normalize a raw TMDB movie object into your own shape
function normalizeMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterUrl: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    backdropUrl: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null,
    releaseYear: movie.release_date ? movie.release_date.split('-')[0] : null,
    rating: movie.vote_average ?? null,
    genreIds: movie.genre_ids || [],
  };
}

router.get('/browse', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdb.getPopularMovies(page);
    res.json({
      page: data.page,
      totalPages: data.total_pages,
      results: data.results.map(normalizeMovie),
    });
  } catch (error) {
    console.error('Error fetching popular movies:', error.message);
    res.status(502).json({ error: 'Failed to fetch movies. Please try again later.' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, page } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ error: 'Search query is required.' });
    }
    const data = await tmdb.searchMovies(q, parseInt(page) || 1);
    res.json({
      page: data.page,
      totalPages: data.total_pages,
      results: data.results.map(normalizeMovie),
    });
  } catch (error) {
    console.error('Error searching movies:', error.message);
    res.status(502).json({ error: 'Search failed. Please try again later.' });
  }
});

router.get('/discover', async (req, res) => {
  try {
    const { genre, sortBy, page } = req.query;
    const data = await tmdb.discoverMovies({ genre, sortBy, page: parseInt(page) || 1 });
    res.json({
      page: data.page,
      totalPages: data.total_pages,
      results: data.results.map(normalizeMovie),
    });
  } catch (error) {
    console.error('Error discovering movies:', error.message);
    res.status(502).json({ error: 'Failed to fetch movies. Please try again later.' });
  }
});

router.get('/genres', async (req, res) => {
  try {
    const data = await tmdb.getGenres();
    res.json(data.genres);
  } catch (error) {
    console.error('Error fetching genres:', error.message);
    res.status(502).json({ error: 'Failed to fetch genres.' });
  }
});

router.get('/:id/similar', async (req, res) => {
  try {
    const data = await tmdb.getSimilarMovies(req.params.id);
    res.json({
      page: data.page,
      totalPages: data.total_pages,
      results: data.results.map(normalizeMovie),
    });
  } catch (error) {
    console.error('Error fetching similar movies:', error.message);
    res.status(502).json({ error: 'Failed to fetch similar movies.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await tmdb.getMovieDetails(req.params.id);
    res.json(normalizeMovie(movie));
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    res.status(502).json({ error: 'Failed to fetch movie details.' });
  }
});

module.exports = router;