import { useEffect, useState } from 'react';
import { getBrowseMovies, discoverMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';

function Browse() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  const hasFilters = genre !== '' || sortBy !== 'popularity.desc';

  const fetchMovies = async (pageNum, replace = false) => {
    try {
      const data = hasFilters
        ? await discoverMovies({ genre, sortBy, page: pageNum })
        : await getBrowseMovies(pageNum);

      setMovies((prev) => (replace ? data.results : [...prev, ...data.results]));
      setTotalPages(data.totalPages);
      setError(null);
    } catch {
      setError('Failed to load movies. Please try again.');
    }
  };

  // Reload from page 1 whenever filters change
  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchMovies(1, true).finally(() => setLoading(false));
  }, [genre, sortBy]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchMovies(nextPage, false);
    setPage(nextPage);
    setLoadingMore(false);
  };

  return (
    <div>
      <FilterBar
        selectedGenre={genre}
        selectedSort={sortBy}
        onGenreChange={setGenre}
        onSortChange={setSortBy}
      />

      {loading && <p style={{ padding: '32px' }}>Loading movies...</p>}
      {error && <p style={{ padding: '32px', color: '#ff6b6b' }}>{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p style={{ padding: '32px', color: '#999' }}>No movies found for this filter.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '24px',
              padding: '32px',
            }}
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {page < totalPages && (
            <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  padding: '10px 28px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  background: '#1f1f1f',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                }}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Browse;