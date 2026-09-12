import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/wishlistService';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = useCallback(async () => {
    try {
      const data = await getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isWishlisted = (movieId) => wishlist.some((item) => item.movieId === movieId);

  const toggleWishlist = async (movie) => {
    if (isWishlisted(movie.id)) {
      await removeFromWishlist(movie.id);
      setWishlist((prev) => prev.filter((item) => item.movieId !== movie.id));
    } else {
      const newItem = await addToWishlist({
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.posterUrl,
        releaseYear: movie.releaseYear,
        rating: movie.rating,
      });
      setWishlist((prev) => [newItem, ...prev]);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}