import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';

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

  if (loading) return <p style={{ padding: '32px' }}>Searching...</p>;
  if (error) return <p style={{ padding: '32px', color: '#ff6b6b' }}>{error}</p>;

  if (!query.trim()) {
    return <p style={{ padding: '32px', color: '#999' }}>Type something to search for movies.</p>;
  }

  if (movies.length === 0) {
    return <p style={{ padding: '32px', color: '#999' }}>No results found for "{query}".</p>;
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