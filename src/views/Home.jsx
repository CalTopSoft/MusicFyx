import { useEffect, useState } from 'react';
import axios from 'axios';
import SongList from '../components/SongList.jsx';
import AlbumGrid from '../components/AlbumGrid.jsx';
import { API_BASE_URL } from '../config'; // Importa la URL base

function Home() {
  const [recentSongs, setRecentSongs] = useState([]);
  const [albums, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const songsRes = await axios.get(`${API_BASE_URL}/api/songs`);
      const albumsRes = await axios.get(`${API_BASE_URL}/api/albums`);
      setRecentSongs(songsRes.data.slice(0, 4));
      setRecommendations(albumsRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="view">
      <h1 className="text-3xl font-bold mb-4">Inicio</h1>
      <div className="quick-picks">
        <h2 className="quick-picks h2">Escuchado recientemente</h2>
        <SongList songs={recentSongs} />
      </div>
      <div className="recommendations">
        <h2 className="recommendations h2">Recomendado para ti</h2>
        <AlbumGrid albums={albums} />
      </div>
    </div>
  );
}

export default Home;
