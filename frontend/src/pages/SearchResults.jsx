import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }
    setLoading(true);
    setError(null);
    searchMovies(query)
      .then((data) => setMovies(data.results))
      .catch(() => setError('Search failed. Please try again.'))
      .finally(() => setLoading(false));
  }, [query]);

 if (loading) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '24px',
        padding: '32px',
      }}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
  if (error) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 32px', color: '#999' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
      <p style={{ fontSize: '16px', color: '#ff6b6b', marginBottom: '8px' }}>{error}</p>
      <p style={{ fontSize: '14px' }}>Please try your search again.</p>
    </div>
  );
}

if (!query.trim()) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 32px', color: '#999' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
      <p style={{ fontSize: '16px' }}>Type something to search for movies.</p>
    </div>
  );
}

if (movies.length === 0) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 32px', color: '#999' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>😕</div>
      <p style={{ fontSize: '16px' }}>No results found for "{query}".</p>
      <p style={{ fontSize: '14px', marginTop: '4px' }}>Try a different search term.</p>
    </div>
  );
}

  return (
    <div style={{ padding: '32px' }}>
      <p style={{ marginBottom: '20px', color: '#999' }}>
        Results for "{query}"
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '24px',
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;