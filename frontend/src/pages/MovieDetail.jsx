import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getGenres, getSimilarMovies } from '../services/movieService';
import { useWishlist } from '../context/WishlistContext';
import MovieCard from '../components/MovieCard';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [genreMap, setGenreMap] = useState({});
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setMovie(null);

    Promise.all([getMovieDetails(id), getGenres()])
      .then(([movieData, genresData]) => {
        setMovie(movieData);
        const map = {};
        genresData.forEach((g) => (map[g.id] = g.name));
        setGenreMap(map);
      })
      .catch(() => setError('Failed to load movie details.'))
      .finally(() => setLoading(false));

    getSimilarMovies(id)
      .then((data) => setSimilar(data.results.slice(0, 6)))
      .catch(() => setSimilar([]));
  }, [id]);

  if (loading) return <p style={{ padding: '32px' }}>Loading...</p>;
 if (error) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 32px', color: '#999' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
      <p style={{ fontSize: '16px', color: '#ff6b6b' }}>{error}</p>
      <Link to="/" style={{ color: '#e50914', marginTop: '8px', display: 'inline-block' }}>
        ← Back to Browse
      </Link>
    </div>
  );
}
  if (!movie) return null;

  const wishlisted = isWishlisted(movie.id);
  const genreNames = movie.genreIds.map((gid) => genreMap[gid]).filter(Boolean);

  return (
    <div>
      {movie.backdropUrl && (
        <div
          style={{
            width: '100%',
            height: '400px',
            backgroundImage: `linear-gradient(to top, #141414, transparent 60%), url(${movie.backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
      )}

      <div style={{ display: 'flex', gap: '32px', padding: '0 32px', marginTop: '-120px', position: 'relative' }}>
        {movie.posterUrl && (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{ width: '220px', flexShrink: 0, borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
          />
        )}

        <div style={{ paddingTop: '120px', flex: 1, minWidth: 0 }}>
          <Link to="/" style={{ fontSize: '14px', color: '#999' }}>
            ← Back to Browse
          </Link>
          <h1 style={{ fontSize: '32px', marginTop: '12px', wordBreak: 'break-word' }}>{movie.title}</h1>
          <p style={{ color: '#999', marginTop: '4px' }}>
            {movie.releaseYear || '—'} · ⭐ {movie.rating?.toFixed(1) ?? 'N/A'}
          </p>

          {genreNames.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
              {genreNames.map((name) => (
                <span
                  key={name}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#2a2a2a',
                    fontSize: '13px',
                    color: '#ccc',
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          )}

          <button
  onClick={() => toggleWishlist(movie)}
  className="btn-primary"
  style={{
    marginTop: '20px',
    padding: '10px 24px',
    borderRadius: '6px',
    border: 'none',
    background: wishlisted ? '#ff4757' : '#e50914',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
  }}
>
  {wishlisted ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
</button>

          <p style={{ marginTop: '24px', lineHeight: '1.6', maxWidth: '700px', color: '#ccc' }}>
            {movie.overview || 'No description available.'}
          </p>
        </div>
      </div>

      {similar.length > 0 && (
        <div style={{ padding: '48px 32px 32px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>You might also like</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '20px',
            }}
          >
            {similar.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;