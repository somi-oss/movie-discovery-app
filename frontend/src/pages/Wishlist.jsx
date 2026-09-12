import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

function Wishlist() {
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = async (movieId) => {
    setRemovingId(movieId);
    // let the fade-out animation play briefly before actually removing
    setTimeout(async () => {
      await toggleWishlist({ id: movieId });
      setRemovingId(null);
    }, 200);
  };

  if (loading) return <p style={{ padding: '32px' }}>Loading wishlist...</p>;

  if (wishlist.length === 0) {
  return (
    <div style={{ padding: '80px 32px', textAlign: 'center', color: '#999' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>♡</div>
      <p style={{ fontSize: '18px', marginBottom: '8px' }}>Your wishlist is empty.</p>
      <p style={{ fontSize: '14px', marginBottom: '16px' }}>Movies you save will appear here.</p>
      <Link to="/" className="btn-primary" style={{
        display: 'inline-block',
        padding: '10px 24px',
        borderRadius: '6px',
        background: '#e50914',
        color: '#fff',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
      }}>
        Browse Movies
      </Link>
    </div>
  );
}

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '24px',
        padding: '32px',
      }}
    >
      {wishlist.map((item) => {
        const isRemoving = removingId === item.movieId;
        return (
          <div
            key={item.movieId}
            style={{
              position: 'relative',
              opacity: isRemoving ? 0 : 1,
              transform: isRemoving ? 'scale(0.9)' : 'scale(1)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            <Link to={`/movie/${item.movieId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {item.posterPath ? (
                <img
                  src={item.posterPath}
                  alt={item.title}
                  className="movie-card-poster"
                  style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '2/3', background: '#333', borderRadius: '8px' }} />
              )}
              <p style={{ marginTop: '8px', fontSize: '14px' }}>{item.title}</p>
              <p style={{ fontSize: '12px', color: '#999' }}>
                {item.releaseYear} · ⭐ {item.rating?.toFixed(1)}
              </p>
            </Link>
            <button
              onClick={() => handleRemove(item.movieId)}
              className="wishlist-heart-btn"
              aria-label="Remove from wishlist"
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.6)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#ff4757',
              }}
            >
              ♥
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Wishlist;