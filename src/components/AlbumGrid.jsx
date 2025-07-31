import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer.js';

function AlbumGrid({ albums }) {
  const navigate = useNavigate();
  const { playSong } = usePlayer();

  return (
    <div className="album-grid">
      {albums.map(album => (
        <div
          key={album.id}
          className="album-card"
          onClick={() => navigate(`/album/${album.id}`)}
        >
          <div className="album-cover">
            <img src={album.cover || '/default-cover.png'} alt="Cover" />
          </div>
          <div className="album-info">
            <p className="album-title">{album.title}</p>
            <p className="album-artist">{album.artist}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSong(album.songs[0], album.songs);
            }}
            className="album-play"
          >
            <i className="fas fa-play"></i>
          </button>
        </div>
      ))}
    </div>
  );
}

export default AlbumGrid;