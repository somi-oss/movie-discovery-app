import { useEffect, useState } from 'react';
import { getGenres } from '../services/movieService';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
];

function FilterBar({ selectedGenre, selectedSort, onGenreChange, onSortChange }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #333',
    background: '#1f1f1f',
    color: '#fff',
    fontSize: '14px',
  };

  return (
    <div style={{ display: 'flex', gap: '12px', padding: '0 32px', marginBottom: '8px', flexWrap: 'wrap' }}>
      <select
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        style={selectStyle}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <select
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value)}
        style={selectStyle}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterBar;