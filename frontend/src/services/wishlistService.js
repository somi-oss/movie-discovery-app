import api from './api';

export const getWishlist = async () => {
  const { data } = await api.get('/wishlist');
  return data;
};

export const addToWishlist = async (movie) => {
  const { data } = await api.post('/wishlist', movie);
  return data;
};

export const removeFromWishlist = async (movieId) => {
  await api.delete(`/wishlist/${movieId}`);
};

export const checkWishlistStatus = async (movieId) => {
  const { data } = await api.get(`/wishlist/check/${movieId}`);
  return data.isWishlisted;
};