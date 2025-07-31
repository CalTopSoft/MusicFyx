import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useWebSocket } from '../hooks/useWebSocket.js';

const navItems = [
  { name: 'Inicio', icon: 'fa-home', path: '/' },
  { name: 'Buscar', icon: 'fa-search', path: '/search' },
  { name: 'Tu biblioteca', icon: 'fa-book', path: '/library' },
  { name: 'Crear playlist', icon: 'fa-plus', path: '/library', action: 'createPlaylist' },
  { name: 'Canciones que te gustan', icon: 'fa-heart', path: '/library', tab: 'liked' },
  { name: 'Canciones recientes', icon: 'fa-clock', path: '/library', tab: 'recent-songs' },
  { name: 'Álbumes recientes', icon: 'fa-compact-disc', path: '/library', tab: 'recent-albums' },
  { name: 'Artistas recientes', icon: 'fa-microphone', path: '/library', tab: 'recent-artists' },
  { name: 'Géneros', icon: 'fa-th-large', path: '/library', tab: 'genres' },
  { name: 'Novedades', icon: 'fa-star', path: '/library', tab: 'new-releases' },
  { name: 'Top charts', icon: 'fa-chart-line', path: '/library', tab: 'top-charts' },
  { name: 'Configuración', icon: 'fa-cog', path: '/settings' },
  { name: 'Ayuda', icon: 'fa-question-circle', path: '/help' },
  { name: 'Acerca de', icon: 'fa-info-circle', path: '/about' },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const { playlists } = useWebSocket(user?.id); // Aquí se pasa userId
  const [isOpen, setIsOpen] = useState(true);

  const handleCreatePlaylist = () => {
    document.dispatchEvent(new CustomEvent('openCreatePlaylistModal'));
    setIsOpen(false);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-music"></i>
          <span>MusicStream</span>
        </div>
        <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className="user-profile">
        <div className="profile-avatar">
          <i className="fas fa-user"></i>
        </div>
        <div className="profile-info">
          <p className="greeting">¡Hola!</p>
          <p className="username">{user?.username}</p>
        </div>
        <button onClick={logout} className="edit-profile">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3>Explorar</h3>
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (item.action === 'createPlaylist') handleCreatePlaylist();
                setIsOpen(false);
              }}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="playlists-section">
          <h3>Tus playlists</h3>
          <div className="playlist-list">
            {playlists.map(playlist => (
              <NavLink
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="nav-item"
              >
                <span>{playlist.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
