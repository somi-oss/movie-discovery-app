import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Browse from './pages/Browse';
import MovieDetail from './pages/MovieDetail';
import Wishlist from './pages/Wishlist';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;