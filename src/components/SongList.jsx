import { usePlayer } from '../hooks/usePlayer.js';
import { useWebSocket } from '../hooks/useWebSocket.js';

function SongList({ songs, playlistId = null }) {
  const { playSong, currentSong } = usePlayer();
  const { updatePlaylist } = useWebSocket();

  const handleAddToPlaylist = (songId) => {
    document.dispatchEvent(new CustomEvent('openAddToPlaylistModal', { detail: { songId } }));
  };

  return (
    <div className="song-list">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className={`song-item ${currentSong?.id === song.id ? 'playing' : ''}`}
          onClick={() => playSong(song, songs)}
        >
          <span className="song-index">{index + 1}</span>
          <div className="song-play-btn">
            <i className="fas fa-play"></i>
          </div>
          <div className="song-cover-small">
            <img src={song.cover || '/default-cover.png'} alt="Cover" />
          </div>
          <div className="song-info">
            <p className="song-name">{song.title}</p>
            <p className="song-artist">{song.artist}</p>
          </div>
          <p className="song-duration">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</p>
          <div className="song-actions">
            <button onClick={() => handleAddToPlaylist(song.id)} className="song-action-btn">
              <i className="fas fa-plus"></i>
            </button>
            {playlistId && (
              <button
                onClick={() => updatePlaylist(playlistId, song.id, 'delete')}
                className="song-action-btn"
              >
                <i className="fas fa-trash"></i>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SongList;