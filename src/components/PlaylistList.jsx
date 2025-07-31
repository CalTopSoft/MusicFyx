import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useWebSocket } from '../hooks/useWebSocket.js';

function PlaylistList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playlists, deletePlaylist } = useWebSocket(user?.id); // Pasar userId

  return (
    <div className="playlist-list">
      {playlists.map(playlist => (
        <div
          key={playlist.id}
          className="song-item"
          onClick={() => navigate(`/playlist/${playlist.id}`)}
        >
          <div className="song-info">
            <p className="song-name">{playlist.name}</p>
            <p className="song-artist">{playlist.songIds.length} canciones</p> {/* Cambié songs.length a songIds.length */}
          </div>
          <div className="song-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                deletePlaylist(playlist.id);
              }}
              className="song-action-btn"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlaylistList;
