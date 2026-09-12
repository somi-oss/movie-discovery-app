import { NavLink, useNavigate } from 'react-router-dom';

function BottomNav() {
  const navigate = useNavigate();

  const tabStyle = ({ isActive }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    color: isActive ? '#e50914' : '#999',
    textDecoration: 'none',
    fontSize: '11px',
    flex: 1,
  });

  return (
    <nav
      className="bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'none', // shown only on mobile via CSS media query
        background: '#141414',
        borderTop: '1px solid #2a2a2a',
        padding: '10px 0',
        zIndex: 20,
      }}
    >
      <NavLink to="/" style={tabStyle} end>
        <span style={{ fontSize: '20px' }}>🏠</span>
        Home
      </NavLink>
      <button
        onClick={() => navigate('/search')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          color: '#999',
          fontSize: '11px',
          flex: 1,
        }}
      >
        <span style={{ fontSize: '20px' }}>🔍</span>
        Search
      </button>
      <NavLink to="/wishlist" style={tabStyle}>
        <span style={{ fontSize: '20px' }}>♥</span>
        Wishlist
      </NavLink>
    </nav>
  );
}

export default BottomNav;