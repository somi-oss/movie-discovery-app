import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

function MovieCard({ movie }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(movie.id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    toggleWishlist(movie);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '8px' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              aspectRatio: '2/3',
              background: '#333',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#777',
              fontSize: '13px',
            }}
          >
            No poster
          </div>
        )}
        <p
          style={{
            marginTop: '8px',
            fontSize: '14px',
            fontWeight: '500',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {movie.title}
        </p>
        <p style={{ fontSize: '12px', color: '#999' }}>
          {movie.releaseYear || '—'} · ⭐ {movie.rating?.toFixed(1) ?? 'N/A'}
        </p>
      </Link>

      <button
        onClick={handleHeartClick}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(0,0,0,0.6)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          fontSize: '16px',
          color: wishlisted ? '#ff4757' : '#fff',
        }}
      >
        {wishlisted ? '♥' : '♡'}
      </button>
    </div>
  );
}

export default MovieCard;