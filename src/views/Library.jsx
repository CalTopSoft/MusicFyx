import { useState, useEffect } from 'react';
import axios from 'axios';
import SongList from '../components/SongList.jsx';
import AlbumGrid from '../components/AlbumGrid.jsx';
import PlaylistList from '../components/PlaylistList.jsx';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { API_BASE_URL } from '../config'; // Importa la URL base

function Library() {
  const [tab, setTab] = useState('songs');
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const { playlists } = useWebSocket();

  useEffect(() => {
    const fetchData = async () => {
      const songsRes = await axios.get(`${API_BASE_URL}/api/songs`);
      const albumsRes = await axios.get(`${API_BASE_URL}/api/albums`);
      setSongs(songsRes.data);
      setAlbums(albumsRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="view">
      <h1 className="text-2xl font-bold mb-4">Tu biblioteca</h1>
      <div className="library-tabs">
        <button onClick={() => setTab('songs')} className={`tab-btn ${tab === 'songs' ? 'active' : ''}`}>Canciones</button>
        <button onClick={() => setTab('albums')} className={`tab-btn ${tab === 'albums' ? 'active' : ''}`}>Álbumes</button>
        <button onClick={() => setTab('playlists')} className={`tab-btn ${tab === 'playlists' ? 'active' : ''}`}>Playlists</button>
      </div>
      <div className="library-content">
        {tab === 'songs' && <SongList songs={songs} />}
        {tab === 'albums' && <AlbumGrid albums={albums} />}
        {tab === 'playlists' && <PlaylistList playlists={playlists} />}
      </div>
    </div>
  );
}

export default Library;
