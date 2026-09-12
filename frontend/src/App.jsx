import { useEffect, useState } from 'react';
import { getBrowseMovies } from './services/movieService';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getBrowseMovies().then((data) => setMovies(data.results));
  }, []);

  return (
    <div>
      <h1>Movie Discovery App</h1>
      <p>Loaded {movies.length} movies</p>
    </div>
  );
}

export default App;