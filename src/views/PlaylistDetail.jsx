import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SongList from '../components/SongList.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { API_BASE_URL } from '../config'; // Importa la URL base

function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playlists, deletePlaylist } = useWebSocket(user?.id);
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const songsRes = await axios.get(`${API_BASE_URL}/api/songs`);
      const playlistData = playlists.find(p => p.id === id);
      if (playlistData) {
        const songs = playlistData.songIds
          .map(songId => songsRes.data.find(song => song.id === songId))
          .filter(Boolean);
        setPlaylist({ ...playlistData, songs });
      }
    };
    fetchPlaylist();
  }, [id, playlists]);

  if (!playlist) return <div>Loading...</div>;

  return (
    <div className="playlist-detail">
      <button onClick={() => navigate(-1)} className="back-btn">
        <i className="fas fa-chevron-left"></i> Volver
      </button>

      <div className="playlist-header">
        <div className="playlist-info">
          <h1>{playlist.name}</h1>
        </div>
        <button onClick={() => deletePlaylist(id)} className="delete-playlist-btn">
          <i className="fas fa-trash"></i> Eliminar
        </button>
      </div>

      <div className="playlist-songs">
        <SongList songs={playlist.songs} playlistId={id} />
      </div>
    </div>
  );
}

export default PlaylistDetail;
