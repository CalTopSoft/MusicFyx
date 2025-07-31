import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SongList from '../components/SongList.jsx';
import { API_BASE_URL } from '../config'; // Importa la URL base

function AlbumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      const res = await axios.get(`${API_BASE_URL}/api/albums/${id}`);
      const songsRes = await axios.get(`${API_BASE_URL}/api/songs`);
      const albumSongs = songsRes.data.filter(song => res.data.songIds.includes(song.id));
      setAlbum({ ...res.data, songs: albumSongs });
    };
    fetchAlbum();
  }, [id]);

  if (!album) return <div>Loading...</div>;

  return (
    <div className="album-detail">
      <button onClick={() => navigate(-1)} className="back-btn">
        <i className="fas fa-chevron-left"></i> Volver
      </button>
      <div className="album-header">
        <img src={album.cover || 'assets/default-cover.png'} alt={album.title} />
        <div className="album-info">
          <h1>{album.title}</h1>
          <p>{album.artist}</p>
        </div>
      </div>
      <div className="album-songs">
        <SongList songs={album.songs} />
      </div>
    </div>
  );
}

export default AlbumDetail;
