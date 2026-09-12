import { useEffect, useState, useRef } from 'react';
import { getBrowseMovies, discoverMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import { useDebounce } from '../hooks/useDebounce';
import SkeletonCard from '../components/SkeletonCard';

function Browse() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  // Debounce genre/sort so rapid clicks don't fire a request per click
  const debouncedGenre = useDebounce(genre, 300);
  const debouncedSortBy = useDebounce(sortBy, 300);

  const requestIdRef = useRef(0);

  const hasFilters = debouncedGenre !== '' || debouncedSortBy !== 'popularity.desc';

  const fetchMovies = async (pageNum, replace = false) => {
    const thisRequestId = ++requestIdRef.current;

    try {
      const data = hasFilters
        ? await discoverMovies({ genre: debouncedGenre, sortBy: debouncedSortBy, page: pageNum })
        : await getBrowseMovies(pageNum);

      if (thisRequestId !== requestIdRef.current) return;

      setMovies((prev) => (replace ? data.results : [...prev, ...data.results]));
      setTotalPages(data.totalPages);
      setError(null);
    } catch {
      if (thisRequestId !== requestIdRef.current) return;
      setError('Failed to load movies. Please try again.');
    }
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchMovies(1, true).finally(() => setLoading(false));
  }, [debouncedGenre, debouncedSortBy]);

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

      {loading && (
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
)}
    {error && (
  <div style={{ textAlign: 'center', padding: '80px 32px', color: '#999' }}>
    <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
    <p style={{ fontSize: '16px', color: '#ff6b6b', marginBottom: '8px' }}>{error}</p>
    <p style={{ fontSize: '14px' }}>Please check your connection and try again.</p>
  </div>
)}

{!loading && !error && movies.length === 0 && (
  <div style={{ textAlign: 'center', padding: '80px 32px', color: '#999' }}>
    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎬</div>
    <p style={{ fontSize: '16px' }}>No movies found for this filter.</p>
    <p style={{ fontSize: '14px', marginTop: '4px' }}>Try a different genre or sorting option.</p>
  </div>
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