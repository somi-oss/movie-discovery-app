import api from './api';

export const getBrowseMovies = async (page = 1) => {
  const { data } = await api.get('/movies/browse', { params: { page } });
  return data;
};

export const searchMovies = async (query, page = 1) => {
  const { data } = await api.get('/movies/search', { params: { q: query, page } });
  return data;
};

export const discoverMovies = async ({ genre, sortBy, page = 1 }) => {
  const { data } = await api.get('/movies/discover', { params: { genre, sortBy, page } });
  return data;
};

export const getGenres = async () => {
  const { data } = await api.get('/movies/genres');
  return data;
};

export const getMovieDetails = async (id) => {
  const { data } = await api.get(`/movies/${id}`);
  return data;
};

export const getSimilarMovies = async (id) => {
  const { data } = await api.get(`/movies/${id}/similar`);
  return data;
};