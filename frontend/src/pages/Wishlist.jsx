import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

function Wishlist() {
  const { wishlist, loading, toggleWishlist } = useWishlist();

  if (loading) return <p style={{ padding: '32px' }}>Loading wishlist...</p>;

  if (wishlist.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#999' }}>
        <p style={{ fontSize: '18px' }}>Your wishlist is empty.</p>
        <Link to="/" style={{ color: '#e50914' }}>
          Browse movies →
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
      {wishlist.map((item) => (
        <div key={item.movieId} style={{ position: 'relative' }}>
          <Link to={`/movie/${item.movieId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {item.posterPath ? (
              <img
                src={item.posterPath}
                alt={item.title}
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
            onClick={() => toggleWishlist({ id: item.movieId })}
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
      ))}
    </div>
  );
}

export default Wishlist;