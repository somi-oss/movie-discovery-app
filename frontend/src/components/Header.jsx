import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Clear the search box whenever the user navigates away from the search page
  useEffect(() => {
    if (!location.pathname.startsWith('/search')) {
      setQuery('');
    }
  }, [location.pathname]);

  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#f5f5f5' : '#999',
    textDecoration: 'none',
    fontWeight: isActive ? '600' : '400',
    fontSize: '15px',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        borderBottom: '1px solid #2a2a2a',
        position: 'sticky',
        top: 0,
        background: '#141414',
        zIndex: 10,
        gap: '24px',
        flexWrap: 'wrap',
      }}
    >
      <h1 style={{ fontSize: '20px', fontWeight: '700', whiteSpace: 'nowrap' }}>🎬 MovieDiscovery</h1>

      <form
        onSubmit={handleSubmit}
        style={{ flex: 1, maxWidth: '420px', display: 'flex', gap: '8px' }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          style={{
            flex: 1,
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid #333',
            background: '#1f1f1f',
            color: '#fff',
            fontSize: '14px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: '#e50914',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          Search
        </button>
      </form>

      <nav className="desktop-nav" style={{ display: 'flex', gap: '24px' }}>
        <NavLink to="/" style={linkStyle} end>
          Browse
        </NavLink>
        <NavLink to="/wishlist" style={linkStyle}>
          Wishlist
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;